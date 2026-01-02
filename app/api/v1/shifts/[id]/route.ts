import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/shifts/[id]
 * Get a single scheduled shift
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const shift = await prisma.scheduledShift.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!shift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: shift,
    });
  } catch (error) {
    console.error('Get shift error:', error);
    return NextResponse.json(
      { error: 'Failed to get shift' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/shifts/[id]
 * Update a scheduled shift
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { startTime, endTime, shiftType, status, notes } = body;

    const existingShift = await prisma.scheduledShift.findUnique({
      where: { id },
    });

    if (!existingShift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (shiftType) updateData.shiftType = shiftType;
    if (notes !== undefined) updateData.notes = notes;

    if (status) {
      const validStatuses = ['scheduled', 'confirmed', 'started', 'completed', 'cancelled', 'no_show'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.status = status;
      if (status === 'confirmed') {
        updateData.confirmedAt = new Date();
      }
    }

    // Check for overlapping shifts if time is changed
    if (startTime || endTime) {
      const newStartTime = startTime || existingShift.startTime;
      const newEndTime = endTime || existingShift.endTime;

      const overlapping = await prisma.scheduledShift.findFirst({
        where: {
          id: { not: id },
          driverId: existingShift.driverId,
          date: existingShift.date,
          status: { notIn: ['cancelled'] },
          OR: [
            {
              AND: [
                { startTime: { lte: newStartTime } },
                { endTime: { gt: newStartTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: newEndTime } },
                { endTime: { gte: newEndTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: newStartTime } },
                { endTime: { lte: newEndTime } },
              ],
            },
          ],
        },
      });

      if (overlapping) {
        return NextResponse.json(
          { error: 'Updated time overlaps with another shift' },
          { status: 400 }
        );
      }
    }

    const shift = await prisma.scheduledShift.update({
      where: { id },
      data: updateData,
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: shift,
    });
  } catch (error) {
    console.error('Update shift error:', error);
    return NextResponse.json(
      { error: 'Failed to update shift' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/shifts/[id]
 * Delete a scheduled shift
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deleteRecurring = searchParams.get('deleteRecurring') === 'true';

    const shift = await prisma.scheduledShift.findUnique({
      where: { id },
    });

    if (!shift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    // If shift is already started or completed, don't delete
    if (['started', 'completed'].includes(shift.status)) {
      return NextResponse.json(
        { error: 'Cannot delete a shift that has started or completed' },
        { status: 400 }
      );
    }

    if (deleteRecurring && shift.isRecurring) {
      // Delete all related recurring shifts
      await prisma.scheduledShift.deleteMany({
        where: {
          OR: [
            { id },
            { parentShiftId: id },
            { parentShiftId: shift.parentShiftId || id },
          ],
          status: { notIn: ['started', 'completed'] },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Recurring shifts deleted',
      });
    }

    await prisma.scheduledShift.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Shift deleted',
    });
  } catch (error) {
    console.error('Delete shift error:', error);
    return NextResponse.json(
      { error: 'Failed to delete shift' },
      { status: 500 }
    );
  }
}
