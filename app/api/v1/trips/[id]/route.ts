import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock trip data
const trips: Record<string, unknown> = {
  'TR-20260115-001': {
    id: 'TR-20260115-001',
    patientId: 'PAT-001',
    patientName: 'John Smith',
    patientPhone: '(555) 123-4567',
    driverId: 'DRV-001',
    driverName: 'Mike Johnson',
    driverPhone: '(555) 987-6543',
    vehicleId: 'VEH-001',
    vehiclePlate: 'ABC-1234',
    vehicleType: 'wheelchair',
    status: 'in-progress',
    tripType: 'outbound',
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
    estimatedDuration: 25,
    appointmentTime: '2026-01-15T11:30:00Z',
    facility: {
      name: 'Memorial Hospital',
      department: 'Cardiology',
      phone: '(713) 555-0100',
    },
    signatures: {
      pickup: null,
      dropoff: null,
    },
    mileage: {
      start: 45230,
      end: null,
    },
    notes: '',
    timeline: [
      { status: 'pending', timestamp: '2026-01-14T14:00:00Z', actor: 'System' },
      { status: 'confirmed', timestamp: '2026-01-14T14:05:00Z', actor: 'Dispatcher' },
      { status: 'assigned', timestamp: '2026-01-14T16:00:00Z', actor: 'Dispatcher' },
      { status: 'driver_en_route', timestamp: '2026-01-15T10:15:00Z', actor: 'Driver' },
      { status: 'arrived_pickup', timestamp: '2026-01-15T10:32:00Z', actor: 'Driver' },
      { status: 'patient_onboard', timestamp: '2026-01-15T10:40:00Z', actor: 'Driver' },
    ],
    createdAt: '2026-01-14T14:00:00Z',
    updatedAt: '2026-01-15T10:40:00Z',
  },
};

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
    const trip = trips[id];

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ data: trip });
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
    const trip = trips[id];

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const body = await request.json();

    // Update allowed fields
    const allowedFields = [
      'status',
      'driverId',
      'vehicleId',
      'pickupInstructions',
      'dropoffInstructions',
      'notes',
      'specialNeeds',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'pickupInstructions') {
          trip.pickup.instructions = body[field];
        } else if (field === 'dropoffInstructions') {
          trip.dropoff.instructions = body[field];
        } else {
          trip[field] = body[field];
        }
      }
    }

    trip.updatedAt = new Date().toISOString();

    // Add to timeline if status changed
    if (body.status) {
      trip.timeline.push({
        status: body.status,
        timestamp: new Date().toISOString(),
        actor: session.user.name || 'User',
      });
    }

    return NextResponse.json({ data: trip });
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
    const trip = trips[id];

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Can only cancel if not already in progress or completed
    if (['in-progress', 'completed'].includes(trip.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel a trip that is in progress or completed' },
        { status: 400 }
      );
    }

    trip.status = 'cancelled';
    trip.updatedAt = new Date().toISOString();
    trip.timeline.push({
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      actor: session.user.name || 'User',
    });

    return NextResponse.json({ data: trip });
  } catch (error) {
    console.error('Error cancelling trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
