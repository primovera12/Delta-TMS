import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { TripStatus, TripType, VehicleType } from '@prisma/client';

// GET /api/v1/trips - List trips with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const driverId = searchParams.get('driverId');
    const patientId = searchParams.get('patientId');
    const facilityId = searchParams.get('facilityId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status.toUpperCase() as TripStatus;
    }
    if (driverId) {
      where.driverId = driverId;
    }
    if (facilityId) {
      where.facilityId = facilityId;
    }
    if (patientId) {
      where.passengers = {
        some: {
          userId: patientId,
        },
      };
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.scheduledPickupTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        include: {
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              licensePlate: true,
              vehicleType: true,
            },
          },
          passengers: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
          facility: {
            select: {
              id: true,
              name: true,
            },
          },
          bookedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          scheduledPickupTime: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trip.count({ where }),
    ]);

    // Transform data for frontend
    const transformedTrips = trips.map((trip) => {
      const primaryPassenger = trip.passengers.find((p) => p.isPrimary);
      return {
        id: trip.id,
        tripNumber: trip.tripNumber,
        patientId: primaryPassenger?.userId || null,
        patientName: primaryPassenger?.user
          ? `${primaryPassenger.user.firstName} ${primaryPassenger.user.lastName}`
          : 'Unknown',
        driverId: trip.driverId,
        driverName: trip.driver
          ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}`
          : null,
        vehicleId: trip.vehicleId,
        vehicleName: trip.vehicle
          ? `${trip.vehicle.make} ${trip.vehicle.model}`
          : null,
        status: trip.status.toLowerCase().replace(/_/g, '-'),
        tripType: trip.tripType.toLowerCase(),
        vehicleType: trip.vehicleType.toLowerCase().replace(/_/g, '-'),
        pickup: {
          address: `${trip.pickupAddressLine1}, ${trip.pickupCity}, ${trip.pickupState} ${trip.pickupZipCode}`,
          lat: trip.pickupLatitude,
          lng: trip.pickupLongitude,
          scheduledTime: trip.scheduledPickupTime.toISOString(),
          actualTime: trip.actualPickupTime?.toISOString() || null,
        },
        dropoff: {
          address: `${trip.dropoffAddressLine1}, ${trip.dropoffCity}, ${trip.dropoffState} ${trip.dropoffZipCode}`,
          lat: trip.dropoffLatitude,
          lng: trip.dropoffLongitude,
          scheduledTime: trip.lastDropoffTime?.toISOString() || null,
          actualTime: trip.actualDropoffTime?.toISOString() || null,
        },
        specialNeeds: [
          trip.wheelchairRequired && 'wheelchair',
          trip.stretcherRequired && 'stretcher',
          trip.oxygenRequired && 'oxygen',
          trip.bariatricRequired && 'bariatric',
        ].filter(Boolean),
        fare: trip.totalFare,
        distance: trip.totalDistanceMiles,
        appointmentTime: trip.appointmentTime?.toISOString() || null,
        facilityId: trip.facilityId,
        facilityName: trip.facility?.name || null,
        createdAt: trip.createdAt.toISOString(),
        updatedAt: trip.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      data: transformedTrips,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/trips - Create a new trip
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'patientId',
      'tripType',
      'vehicleType',
      'pickupAddress',
      'dropoffAddress',
      'pickupTime',
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate trip number
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await prisma.trip.count({
      where: {
        tripNumber: {
          startsWith: `TR-${dateStr}`,
        },
      },
    });
    const tripNumber = `TR-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    // Parse pickup time
    const scheduledPickupTime = new Date(body.pickupTime);

    // Create the trip
    const trip = await prisma.trip.create({
      data: {
        tripNumber,
        tripType: (body.tripType?.toUpperCase() as TripType) || TripType.ONE_WAY,
        bookedById: session.user.id,
        facilityId: body.facilityId || null,

        // Pickup address
        pickupAddressLine1: body.pickupAddress,
        pickupAddressLine2: body.pickupAddressLine2 || null,
        pickupCity: body.pickupCity || 'Houston',
        pickupState: body.pickupState || 'TX',
        pickupZipCode: body.pickupZipCode || '77001',
        pickupLatitude: body.pickupLat || 0,
        pickupLongitude: body.pickupLng || 0,

        // Dropoff address
        dropoffAddressLine1: body.dropoffAddress,
        dropoffAddressLine2: body.dropoffAddressLine2 || null,
        dropoffCity: body.dropoffCity || 'Houston',
        dropoffState: body.dropoffState || 'TX',
        dropoffZipCode: body.dropoffZipCode || '77001',
        dropoffLatitude: body.dropoffLat || 0,
        dropoffLongitude: body.dropoffLng || 0,

        // Timing
        firstPickupTime: scheduledPickupTime,
        scheduledPickupTime,
        appointmentTime: body.appointmentTime ? new Date(body.appointmentTime) : null,
        lastDropoffTime: body.dropoffTime ? new Date(body.dropoffTime) : null,

        // Vehicle requirements
        vehicleType: (body.vehicleType?.toUpperCase().replace(/-/g, '_') as VehicleType) || VehicleType.WHEELCHAIR_ACCESSIBLE,
        wheelchairRequired: body.specialNeeds?.includes('wheelchair') || false,
        stretcherRequired: body.specialNeeds?.includes('stretcher') || false,
        oxygenRequired: body.specialNeeds?.includes('oxygen') || false,
        bariatricRequired: body.specialNeeds?.includes('bariatric') || false,

        // Distance and pricing (to be calculated)
        totalDistanceMiles: body.distance || 0,
        estimatedDurationMinutes: body.duration || 30,
        baseFare: body.baseFare || 0,
        distanceFare: body.distanceFare || 0,
        timeFare: body.timeFare || 0,
        subtotal: body.subtotal || 0,
        totalFare: body.totalFare || 0,

        // Notes
        bookingNotes: body.notes || null,
        specialRequirements: body.specialRequirements || null,

        // Status
        status: TripStatus.PENDING,

        // Create passenger record
        passengers: {
          create: {
            userId: body.patientId,
            isPrimary: true,
            firstName: body.patientFirstName || 'Unknown',
            lastName: body.patientLastName || 'Patient',
          },
        },
      },
      include: {
        passengers: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const primaryPassenger = trip.passengers[0];

    return NextResponse.json({
      data: {
        id: trip.id,
        tripNumber: trip.tripNumber,
        patientId: primaryPassenger?.userId,
        patientName: primaryPassenger?.user
          ? `${primaryPassenger.user.firstName} ${primaryPassenger.user.lastName}`
          : 'Unknown',
        status: trip.status.toLowerCase(),
        tripType: trip.tripType.toLowerCase(),
        vehicleType: trip.vehicleType.toLowerCase().replace(/_/g, '-'),
        pickup: {
          address: `${trip.pickupAddressLine1}, ${trip.pickupCity}, ${trip.pickupState} ${trip.pickupZipCode}`,
          scheduledTime: trip.scheduledPickupTime.toISOString(),
        },
        dropoff: {
          address: `${trip.dropoffAddressLine1}, ${trip.dropoffCity}, ${trip.dropoffState} ${trip.dropoffZipCode}`,
        },
        createdAt: trip.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
