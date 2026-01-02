import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock data for development
const trips = [
  {
    id: 'TR-20260115-001',
    patientId: 'PAT-001',
    patientName: 'John Smith',
    driverId: 'DRV-001',
    driverName: 'Mike Johnson',
    vehicleId: 'VEH-001',
    status: 'in-progress',
    tripType: 'outbound',
    vehicleType: 'wheelchair',
    pickup: {
      address: '123 Main St, Houston, TX 77001',
      lat: 29.7604,
      lng: -95.3698,
      scheduledTime: '2026-01-15T10:30:00Z',
      actualTime: '2026-01-15T10:32:00Z',
      instructions: 'Ring doorbell, wait for aide',
    },
    dropoff: {
      address: 'Memorial Hospital, 6400 Fannin St, Houston, TX 77030',
      lat: 29.7108,
      lng: -95.3978,
      scheduledTime: '2026-01-15T11:00:00Z',
      actualTime: null,
      instructions: 'Emergency entrance',
    },
    specialNeeds: ['wheelchair', 'oxygen'],
    fare: 85.5,
    distance: 12.5,
    appointmentTime: '2026-01-15T11:30:00Z',
    createdAt: '2026-01-14T14:00:00Z',
    updatedAt: '2026-01-15T10:32:00Z',
  },
  {
    id: 'TR-20260115-002',
    patientId: 'PAT-002',
    patientName: 'Mary Jones',
    driverId: 'DRV-002',
    driverName: 'Sarah Williams',
    vehicleId: 'VEH-002',
    status: 'assigned',
    tripType: 'return',
    vehicleType: 'ambulatory',
    pickup: {
      address: '456 Oak Ave, Houston, TX 77002',
      lat: 29.7555,
      lng: -95.3555,
      scheduledTime: '2026-01-15T11:00:00Z',
      actualTime: null,
      instructions: null,
    },
    dropoff: {
      address: 'Dialysis Center, 2100 West Loop, Houston, TX',
      lat: 29.7508,
      lng: -95.4608,
      scheduledTime: '2026-01-15T11:30:00Z',
      actualTime: null,
      instructions: 'Side entrance',
    },
    specialNeeds: [],
    fare: 65.0,
    distance: 8.2,
    appointmentTime: '2026-01-15T12:00:00Z',
    createdAt: '2026-01-14T15:00:00Z',
    updatedAt: '2026-01-14T15:00:00Z',
  },
];

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredTrips = [...trips];

    // Apply filters
    if (status) {
      filteredTrips = filteredTrips.filter((trip) => trip.status === status);
    }
    if (driverId) {
      filteredTrips = filteredTrips.filter((trip) => trip.driverId === driverId);
    }
    if (patientId) {
      filteredTrips = filteredTrips.filter((trip) => trip.patientId === patientId);
    }
    if (date) {
      filteredTrips = filteredTrips.filter((trip) =>
        trip.pickup.scheduledTime.startsWith(date)
      );
    }

    // Pagination
    const total = filteredTrips.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTrips = filteredTrips.slice(start, end);

    return NextResponse.json({
      data: paginatedTrips,
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

    // Create new trip (in production, this would save to database)
    const newTrip = {
      id: `TR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(trips.length + 1).padStart(3, '0')}`,
      patientId: body.patientId,
      patientName: body.patientName || 'Unknown',
      driverId: null,
      driverName: null,
      vehicleId: null,
      status: 'pending',
      tripType: body.tripType,
      vehicleType: body.vehicleType,
      pickup: {
        address: body.pickupAddress,
        lat: body.pickupLat || null,
        lng: body.pickupLng || null,
        scheduledTime: body.pickupTime,
        actualTime: null,
        instructions: body.pickupInstructions || null,
      },
      dropoff: {
        address: body.dropoffAddress,
        lat: body.dropoffLat || null,
        lng: body.dropoffLng || null,
        scheduledTime: body.dropoffTime || null,
        actualTime: null,
        instructions: body.dropoffInstructions || null,
      },
      specialNeeds: body.specialNeeds || [],
      fare: null,
      distance: null,
      appointmentTime: body.appointmentTime || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    trips.push(newTrip);

    return NextResponse.json({ data: newTrip }, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
