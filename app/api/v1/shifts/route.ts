import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/v1/shifts
 * Get scheduled shifts with filtering options
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (driverId) {
      where.driverId = driverId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        (where.date as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.date as Record<string, Date>).lte = new Date(endDate);
      }
    }

    const [shifts, total] = await Promise.all([
      prisma.scheduledShift.findMany({
        where,
        include: {
          driver: {
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
        },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scheduledShift.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        shifts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get shifts error:', error);
    return NextResponse.json(
      { error: 'Failed to get shifts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/shifts
 * Create a new scheduled shift
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      driverId,
      date,
      startTime,
      endTime,
      shiftType = 'regular',
      notes,
      isRecurring,
      recurrenceRule,
    } = body;

    if (!driverId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Driver ID, date, start time, and end time are required' },
        { status: 400 }
      );
    }

    // Check if driver exists
    const driver = await prisma.driverProfile.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Check for overlapping shifts
    const existingShift = await prisma.scheduledShift.findFirst({
      where: {
        driverId,
        date: new Date(date),
        status: { notIn: ['cancelled'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (existingShift) {
      return NextResponse.json(
        { error: 'Shift overlaps with an existing shift' },
        { status: 400 }
      );
    }

    // Create the shift
    const shift = await prisma.scheduledShift.create({
      data: {
        driverId,
        date: new Date(date),
        startTime,
        endTime,
        shiftType,
        notes,
        isRecurring: isRecurring || false,
        recurrenceRule: recurrenceRule || null,
      },
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

    // If recurring, create future shifts
    if (isRecurring && recurrenceRule) {
      await createRecurringShifts(shift.id, driverId, date, startTime, endTime, shiftType, recurrenceRule);
    }

    return NextResponse.json({
      success: true,
      data: shift,
    });
  } catch (error) {
    console.error('Create shift error:', error);
    return NextResponse.json(
      { error: 'Failed to create shift' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/shifts
 * Bulk update shift status
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status, notes } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Shift IDs are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['scheduled', 'confirmed', 'started', 'completed', 'cancelled', 'no_show'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Valid status is required (${validStatuses.join(', ')})` },
        { status: 400 }
      );
    }

    // Update all shifts
    const result = await prisma.scheduledShift.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
        notes: notes || undefined,
        confirmedAt: status === 'confirmed' ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} shift(s) updated to ${status}`,
      data: { updated: result.count },
    });
  } catch (error) {
    console.error('Update shifts error:', error);
    return NextResponse.json(
      { error: 'Failed to update shifts' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to create recurring shifts
 */
async function createRecurringShifts(
  parentShiftId: string,
  driverId: string,
  startDate: string,
  startTime: string,
  endTime: string,
  shiftType: string,
  recurrenceRule: string
): Promise<void> {
  // Parse recurrence rule (simplified RRULE parsing)
  // Example: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=4"
  const parts = recurrenceRule.split(';');
  const rule: Record<string, string> = {};
  parts.forEach((part) => {
    const [key, value] = part.split('=');
    rule[key] = value;
  });

  if (rule.FREQ !== 'WEEKLY') {
    // Only supporting weekly for now
    return;
  }

  const dayMap: Record<string, number> = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  };

  const days = (rule.BYDAY || '').split(',').map((d) => dayMap[d]).filter((d) => d !== undefined);
  const count = parseInt(rule.COUNT || '4');

  const shiftsToCreate = [];
  const baseDate = new Date(startDate);
  let created = 0;

  // Generate shifts for the next 'count' weeks
  for (let week = 1; week <= count && created < count * days.length; week++) {
    for (const dayOfWeek of days) {
      const shiftDate = new Date(baseDate);
      shiftDate.setDate(baseDate.getDate() + week * 7 + (dayOfWeek - baseDate.getDay()));

      // Skip if date is before start date
      if (shiftDate <= baseDate) continue;

      shiftsToCreate.push({
        driverId,
        date: shiftDate,
        startTime,
        endTime,
        shiftType,
        isRecurring: true,
        recurrenceRule,
        parentShiftId,
      });

      created++;
      if (created >= count * days.length) break;
    }
  }

  if (shiftsToCreate.length > 0) {
    await prisma.scheduledShift.createMany({
      data: shiftsToCreate,
      skipDuplicates: true,
    });
  }
}
