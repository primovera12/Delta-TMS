import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { TripStatus } from '@prisma/client';

// GET /api/v1/trips/[id] - Get trip details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id },
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
            phone: true,
          },
        },
        bookedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            changedBy: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        stops: {
          orderBy: {
            stopOrder: 'asc',
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const primaryPassenger = trip.passengers.find((p) => p.isPrimary);

    // Transform for frontend
    const transformedTrip = {
      id: trip.id,
      tripNumber: trip.tripNumber,
      patientId: primaryPassenger?.userId || null,
      patientName: primaryPassenger?.user
        ? `${primaryPassenger.user.firstName} ${primaryPassenger.user.lastName}`
        : 'Unknown',
      patientPhone: primaryPassenger?.user?.phone || null,
      driverId: trip.driverId,
      driverName: trip.driver
        ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}`
        : null,
      driverPhone: trip.driver?.user.phone || null,
      vehicleId: trip.vehicleId,
      vehiclePlate: trip.vehicle?.licensePlate || null,
      vehicleType: trip.vehicleType.toLowerCase().replace(/_/g, '-'),
      status: trip.status.toLowerCase().replace(/_/g, '-'),
      tripType: trip.tripType.toLowerCase(),
      pickup: {
        address: `${trip.pickupAddressLine1}, ${trip.pickupCity}, ${trip.pickupState} ${trip.pickupZipCode}`,
        lat: trip.pickupLatitude,
        lng: trip.pickupLongitude,
        scheduledTime: trip.scheduledPickupTime.toISOString(),
        actualTime: trip.actualPickupTime?.toISOString() || null,
        instructions: trip.bookingNotes || null,
      },
      dropoff: {
        address: `${trip.dropoffAddressLine1}, ${trip.dropoffCity}, ${trip.dropoffState} ${trip.dropoffZipCode}`,
        lat: trip.dropoffLatitude,
        lng: trip.dropoffLongitude,
        scheduledTime: trip.lastDropoffTime?.toISOString() || null,
        actualTime: trip.actualDropoffTime?.toISOString() || null,
        instructions: trip.driverNotes || null,
      },
      specialNeeds: [
        trip.wheelchairRequired && 'wheelchair',
        trip.stretcherRequired && 'stretcher',
        trip.oxygenRequired && 'oxygen',
        trip.bariatricRequired && 'bariatric',
      ].filter(Boolean),
      fare: trip.totalFare,
      distance: trip.totalDistanceMiles,
      estimatedDuration: trip.estimatedDurationMinutes,
      appointmentTime: trip.appointmentTime?.toISOString() || null,
      facility: trip.facility ? {
        name: trip.facility.name,
        phone: trip.facility.phone,
      } : null,
      signatures: {
        pickup: trip.signatureUrl ? { url: trip.signatureUrl, name: trip.signatureName } : null,
        dropoff: null,
      },
      notes: trip.dispatcherNotes || '',
      timeline: trip.statusHistory.map((h) => ({
        status: h.newStatus.toLowerCase().replace(/_/g, '-'),
        timestamp: h.createdAt.toISOString(),
        actor: h.changedBy ? `${h.changedBy.firstName} ${h.changedBy.lastName}` : 'System',
        notes: h.notes || null,
      })),
      stops: trip.stops.map((s) => ({
        order: s.stopOrder,
        type: s.stopType.toLowerCase(),
        address: `${s.addressLine1}, ${s.city}, ${s.state} ${s.zipCode}`,
        lat: s.latitude,
        lng: s.longitude,
        scheduledTime: s.scheduledArrival?.toISOString() || null,
        actualTime: s.actualArrival?.toISOString() || null,
      })),
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
    };

    return NextResponse.json({ data: transformedTrip });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/trips/[id] - Update trip
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (body.driverId !== undefined) {
      updateData.driverId = body.driverId;
    }
    if (body.vehicleId !== undefined) {
      updateData.vehicleId = body.vehicleId;
    }
    if (body.notes !== undefined) {
      updateData.dispatcherNotes = body.notes;
    }
    if (body.bookingNotes !== undefined) {
      updateData.bookingNotes = body.bookingNotes;
    }
    if (body.driverNotes !== undefined) {
      updateData.driverNotes = body.driverNotes;
    }

    // Handle status change
    if (body.status) {
      const newStatus = body.status.toUpperCase().replace(/-/g, '_') as TripStatus;
      updateData.status = newStatus;

      // Create status history entry
      await prisma.tripStatusHistory.create({
        data: {
          tripId: id,
          newStatus: newStatus,
          previousStatus: existingTrip.status,
          changedById: session.user.id,
          notes: body.statusNotes || null,
        },
      });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData,
      include: {
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        passengers: {
          where: { isPrimary: true },
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

    const primaryPassenger = updatedTrip.passengers[0];

    return NextResponse.json({
      data: {
        id: updatedTrip.id,
        tripNumber: updatedTrip.tripNumber,
        status: updatedTrip.status.toLowerCase().replace(/_/g, '-'),
        driverId: updatedTrip.driverId,
        driverName: updatedTrip.driver
          ? `${updatedTrip.driver.user.firstName} ${updatedTrip.driver.user.lastName}`
          : null,
        patientName: primaryPassenger?.user
          ? `${primaryPassenger.user.firstName} ${primaryPassenger.user.lastName}`
          : 'Unknown',
        updatedAt: updatedTrip.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/trips/[id] - Cancel trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Can only cancel if not already in progress or completed
    const nonCancellableStatuses = [TripStatus.IN_PROGRESS, TripStatus.COMPLETED];
    if (nonCancellableStatuses.includes(trip.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel a trip that is in progress or completed' },
        { status: 400 }
      );
    }

    // Update trip status to cancelled
    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        status: TripStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledById: session.user.id,
      },
    });

    // Create status history entry
    await prisma.tripStatusHistory.create({
      data: {
        tripId: id,
        newStatus: TripStatus.CANCELLED,
        previousStatus: trip.status,
        changedById: session.user.id,
        notes: 'Trip cancelled',
      },
    });

    return NextResponse.json({
      data: {
        id: updatedTrip.id,
        tripNumber: updatedTrip.tripNumber,
        status: 'cancelled',
        cancelledAt: updatedTrip.cancelledAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error cancelling trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
