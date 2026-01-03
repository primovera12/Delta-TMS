import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TripStatus } from '@prisma/client';
import {
  isValidTransition,
  getStatusTimestampField,
  type StatusUpdateRequest,
} from '@/lib/services/trip-status';
import { TripNotifications, DriverNotifications } from '@/lib/services/sms';

/**
 * PUT /api/v1/trips/[id]/status
 * Update trip status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as Partial<StatusUpdateRequest>;

    const { newStatus, notes, location, signature, cancellationReason } = body;

    if (!newStatus) {
      return NextResponse.json(
        { error: 'New status is required' },
        { status: 400 }
      );
    }

    // Validate status value
    if (!Object.values(TripStatus).includes(newStatus as TripStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Get current trip
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          include: { user: true },
        },
        passengers: {
          where: { isPrimary: true },
          include: { user: true },
        },
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Validate transition
    if (!isValidTransition(trip.status, newStatus as TripStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${trip.status} to ${newStatus}`,
          currentStatus: trip.status,
          validTransitions: getValidTransitions(trip.status),
        },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updatedAt: new Date(),
    };

    // Set timestamp field based on status
    const timestampField = getStatusTimestampField(newStatus as TripStatus);
    if (timestampField) {
      updateData[timestampField] = new Date();
    }

    // Handle cancellation
    if (newStatus === TripStatus.CANCELLED) {
      updateData.cancellationReason = cancellationReason || 'Cancelled';
      updateData.cancelledAt = new Date();
      // TODO: Calculate cancellation fee based on timing
    }

    // Handle signature for completion
    if (newStatus === TripStatus.COMPLETED && signature) {
      updateData.signatureUrl = signature.url;
      updateData.signatureName = signature.name;
      updateData.signatureTimestamp = new Date();
    }

    // Update trip
    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData,
    });

    // Create status history entry
    await prisma.tripStatusHistory.create({
      data: {
        tripId: id,
        previousStatus: trip.status,
        newStatus: newStatus as TripStatus,
        notes,
        latitude: location?.latitude,
        longitude: location?.longitude,
        // TODO: Get current user from session
        // changedById: session?.user?.id,
        // changedByRole: session?.user?.role,
      },
    });

    // Update driver location if provided
    if (location && trip.driverId) {
      await prisma.driverProfile.update({
        where: { id: trip.driverId },
        data: {
          currentLatitude: location.latitude,
          currentLongitude: location.longitude,
          lastLocationUpdate: new Date(),
        },
      });
    }

    // Trigger notifications based on status change (non-blocking)
    const tripForNotification = {
      id: trip.id,
      scheduledPickupTime: trip.scheduledPickupTime,
      pickupAddress: `${trip.pickupAddressLine1}, ${trip.pickupCity}, ${trip.pickupState} ${trip.pickupZipCode}`,
      dropoffAddress: `${trip.dropoffAddressLine1}, ${trip.dropoffCity}, ${trip.dropoffState} ${trip.dropoffZipCode}`,
      driverId: trip.driverId,
      driver: trip.driver ? {
        user: {
          firstName: trip.driver.user.firstName,
          lastName: trip.driver.user.lastName,
          phone: trip.driver.user.phone,
        },
      } : null,
      passengers: trip.passengers.map(p => ({
        isPrimary: p.isPrimary,
        user: {
          phone: p.user?.phone || '',
          firstName: p.user?.firstName || p.firstName,
          lastName: p.user?.lastName || p.lastName,
        },
      })),
    };
    sendStatusNotifications(tripForNotification, newStatus as TripStatus).catch(err => {
      console.error('Failed to send status notification:', err);
    });

    return NextResponse.json({
      success: true,
      data: {
        trip: updatedTrip,
        previousStatus: trip.status,
        newStatus,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Status update error:', error);

    return NextResponse.json(
      { error: 'Failed to update trip status' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/trips/[id]/status
 * Get trip status history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      select: {
        id: true,
        tripNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        actualPickupTime: true,
        actualDropoffTime: true,
        cancelledAt: true,
        cancellationReason: true,
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    const statusHistory = await prisma.tripStatusHistory.findMany({
      where: { tripId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        changedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        currentStatus: trip.status,
        trip,
        history: statusHistory,
      },
    });
  } catch (error) {
    console.error('Get status history error:', error);

    return NextResponse.json(
      { error: 'Failed to get status history' },
      { status: 500 }
    );
  }
}

// Helper function to get valid transitions for error messages
function getValidTransitions(status: TripStatus): TripStatus[] {
  const transitions: Record<TripStatus, TripStatus[]> = {
    PENDING: [TripStatus.CONFIRMED, TripStatus.CANCELLED],
    CONFIRMED: [TripStatus.ASSIGNED, TripStatus.CANCELLED],
    ASSIGNED: [TripStatus.DRIVER_EN_ROUTE, TripStatus.CANCELLED],
    DRIVER_EN_ROUTE: [TripStatus.DRIVER_ARRIVED, TripStatus.CANCELLED],
    DRIVER_ARRIVED: [TripStatus.IN_PROGRESS, TripStatus.NO_SHOW, TripStatus.CANCELLED],
    IN_PROGRESS: [TripStatus.COMPLETED, TripStatus.CANCELLED],
    COMPLETED: [],
    CANCELLED: [],
    NO_SHOW: [],
  };
  return transitions[status] || [];
}

// Send notifications based on status change
async function sendStatusNotifications(
  trip: {
    id: string;
    scheduledPickupTime: Date;
    pickupAddress: string;
    dropoffAddress: string;
    driverId: string | null;
    driver?: {
      user: { firstName: string; lastName: string; phone: string };
    } | null;
    passengers: Array<{
      isPrimary: boolean;
      user: { phone: string; firstName: string; lastName: string };
    }>;
  },
  newStatus: TripStatus
): Promise<void> {
  // Get patient phone from primary passenger
  const primaryPassenger = trip.passengers.find(p => p.isPrimary);
  const patientPhone = primaryPassenger?.user.phone;

  // Build trip data for notifications
  const tripData = {
    id: trip.id,
    scheduledPickupTime: trip.scheduledPickupTime,
    pickupAddress: trip.pickupAddress,
    dropoffAddress: trip.dropoffAddress,
    patient: patientPhone ? { phone: patientPhone } : null,
    driver: trip.driver ? { user: trip.driver.user } : null,
  };

  switch (newStatus) {
    case TripStatus.DRIVER_EN_ROUTE:
      // Notify patient that driver is on the way
      // TODO: Calculate actual ETA based on distance
      await TripNotifications.sendDriverEnRoute(tripData, 15);
      break;

    case TripStatus.DRIVER_ARRIVED:
      await TripNotifications.sendDriverArrived(tripData);
      break;

    case TripStatus.COMPLETED:
      await TripNotifications.sendTripCompleted(tripData);
      break;

    case TripStatus.CANCELLED:
      // Notify patient
      await TripNotifications.sendTripCancelled({
        ...tripData,
        bookedByPhone: null,
      });

      // Notify driver if assigned
      if (trip.driver?.user.phone) {
        await DriverNotifications.sendTripCancelled(
          trip.driver.user.phone,
          tripData
        );
      }
      break;
  }
}
