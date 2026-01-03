import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { DayOfWeek, TripStatus } from '@prisma/client';

// GET /api/v1/standing-orders/[id] - Get standing order details
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Standing order ID is required' },
        { status: 400 }
      );
    }

    const order = await prisma.standingOrder.findUnique({
      where: { id },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        facilityPatient: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Standing order not found' },
        { status: 404 }
      );
    }

    // Get generated trips for this standing order
    const trips = await prisma.trip.findMany({
      where: {
        standingOrderId: order.id,
      },
      select: {
        id: true,
        tripNumber: true,
        scheduledPickupTime: true,
        status: true,
      },
      orderBy: {
        scheduledPickupTime: 'desc',
      },
      take: 20,
    });

    const patient = order.facilityPatient;

    // Transform for frontend
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      patientId: order.patientUserId || patient?.userId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
      patientPhone: patient?.phone || null,
      facilityId: order.facilityId,
      facilityName: order.facility?.name || null,
      facilityPhone: order.facility?.phone || null,
      vehicleType: order.vehicleType.toLowerCase().replace(/_/g, '-'),
      pickupAddress: `${order.pickupAddressLine1}, ${order.pickupCity}, ${order.pickupState} ${order.pickupZipCode}`,
      dropoffAddress: `${order.dropoffAddressLine1}, ${order.dropoffCity}, ${order.dropoffState} ${order.dropoffZipCode}`,
      frequency: order.frequency,
      daysOfWeek: order.daysOfWeek.map((d) => d.toLowerCase()),
      pickupTime: order.pickupTime,
      appointmentTime: order.appointmentTime,
      returnTrip: order.includeReturn,
      returnTime: order.returnTime,
      isWillCall: order.isReturnWillCall,
      specialInstructions: order.specialInstructions || '',
      status: order.isActive ? 'active' : 'inactive',
      startDate: order.startDate?.toISOString().split('T')[0] || null,
      endDate: order.endDate?.toISOString().split('T')[0] || null,
      generatedTrips: trips.map((t) => ({
        id: t.id,
        tripNumber: t.tripNumber,
        date: t.scheduledPickupTime.toISOString().split('T')[0],
        status: t.status.toLowerCase(),
      })),
      history: [
        {
          action: 'created',
          timestamp: order.createdAt.toISOString(),
          user: 'System',
        },
      ],
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: transformedOrder,
    });
  } catch (error) {
    console.error('Error fetching standing order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/standing-orders/[id] - Update standing order
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Standing order ID is required' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.standingOrder.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Standing order not found' },
        { status: 404 }
      );
    }

    const { status, daysOfWeek, ...updates } = body;

    // Build update data
    const updateData: Record<string, unknown> = {};

    // Handle status changes
    if (status) {
      if (status === 'active') {
        updateData.isActive = true;
      } else if (status === 'inactive') {
        updateData.isActive = false;
      }
    }

    // Handle days of week conversion
    if (daysOfWeek && Array.isArray(daysOfWeek)) {
      const dayEnumMap: Record<string, DayOfWeek> = {
        sunday: DayOfWeek.SUNDAY,
        monday: DayOfWeek.MONDAY,
        tuesday: DayOfWeek.TUESDAY,
        wednesday: DayOfWeek.WEDNESDAY,
        thursday: DayOfWeek.THURSDAY,
        friday: DayOfWeek.FRIDAY,
        saturday: DayOfWeek.SATURDAY,
      };
      updateData.daysOfWeek = daysOfWeek.map((d: string) => dayEnumMap[d.toLowerCase()]).filter(Boolean);
    }

    // Map other fields
    if (updates.pickupTime) updateData.pickupTime = updates.pickupTime;
    if (updates.appointmentTime) updateData.appointmentTime = updates.appointmentTime;
    if (updates.returnTime) updateData.returnTime = updates.returnTime;
    if (updates.returnTrip !== undefined) updateData.includeReturn = updates.returnTrip;
    if (updates.isWillCall !== undefined) updateData.isReturnWillCall = updates.isWillCall;
    if (updates.specialInstructions !== undefined) updateData.specialInstructions = updates.specialInstructions;
    if (updates.frequency) updateData.frequency = updates.frequency;
    if (updates.startDate) updateData.startDate = new Date(updates.startDate);
    if (updates.endDate) updateData.endDate = new Date(updates.endDate);

    const order = await prisma.standingOrder.update({
      where: { id },
      data: updateData,
      include: {
        facility: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        facilityName: order.facility?.name || null,
        status: order.isActive ? 'active' : 'inactive',
        updatedAt: order.updatedAt.toISOString(),
      },
      message: 'Standing order updated successfully',
    });
  } catch (error) {
    console.error('Error updating standing order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update standing order' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/standing-orders/[id] - Cancel standing order
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Standing order ID is required' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.standingOrder.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Standing order not found' },
        { status: 404 }
      );
    }

    // Cancel future scheduled trips
    await prisma.trip.updateMany({
      where: {
        standingOrderId: id,
        status: { in: [TripStatus.PENDING, TripStatus.CONFIRMED] },
        scheduledPickupTime: {
          gt: new Date(),
        },
      },
      data: {
        status: TripStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledById: session.user.id,
      },
    });

    // Mark standing order as inactive
    await prisma.standingOrder.update({
      where: { id },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Standing order ${existingOrder.orderNumber} cancelled successfully`,
    });
  } catch (error) {
    console.error('Error cancelling standing order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel standing order' },
      { status: 500 }
    );
  }
}
