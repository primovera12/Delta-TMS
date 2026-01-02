import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateWorkMinutes, canClockIn, canClockOut } from '@/lib/services/timesheet';

/**
 * GET /api/v1/drivers/[id]/timesheet
 * Get driver's timesheet entries and current status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Build where clause
    const where: Record<string, unknown> = { driverId: id };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    // Get timesheet entries
    const timesheets = await prisma.timesheet.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 50,
    });

    // Get today's active entry if any
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeEntry = await prisma.timesheet.findFirst({
      where: {
        driverId: id,
        date: today,
        clockOutTime: null,
      },
    });

    // Calculate today's stats
    const todayEntries = await prisma.timesheet.findMany({
      where: {
        driverId: id,
        date: today,
      },
    });

    let totalMinutesToday = 0;
    for (const entry of todayEntries) {
      if (entry.totalMinutes) {
        totalMinutesToday += entry.totalMinutes;
      } else if (entry.clockInTime) {
        totalMinutesToday += calculateWorkMinutes(
          entry.clockInTime,
          entry.clockOutTime,
          entry.totalBreakMinutes
        );
      }
    }

    // Get today's completed trips
    const todayTrips = await prisma.trip.count({
      where: {
        driverId: id,
        status: 'COMPLETED',
        actualDropoffTime: {
          gte: today,
        },
      },
    });

    // Get today's earnings
    const todayEarnings = await prisma.driverEarning.aggregate({
      where: {
        driverId: id,
        createdAt: {
          gte: today,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        timesheets,
        currentStatus: {
          isClockedIn: !!activeEntry,
          isOnBreak: !!(activeEntry?.breakStartTime && !activeEntry.breakEndTime),
          currentEntry: activeEntry,
          todayStats: {
            hoursWorked: Math.round(totalMinutesToday / 60 * 10) / 10,
            minutesWorked: totalMinutesToday,
            tripsCompleted: todayTrips,
            earnings: todayEarnings._sum.amount || 0,
          },
        },
      },
    });
  } catch (error) {
    console.error('Get timesheet error:', error);
    return NextResponse.json(
      { error: 'Failed to get timesheet' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/drivers/[id]/timesheet
 * Clock in, clock out, or manage breaks
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, notes, location } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current active entry
    const activeEntry = await prisma.timesheet.findFirst({
      where: {
        driverId: id,
        date: today,
        clockOutTime: null,
      },
    });

    const now = new Date();

    switch (action) {
      case 'clock_in': {
        const check = canClockIn(!!activeEntry);
        if (!check.allowed) {
          return NextResponse.json(
            { error: check.reason },
            { status: 400 }
          );
        }

        const newEntry = await prisma.timesheet.create({
          data: {
            driverId: id,
            date: today,
            clockInTime: now,
            notes,
          },
        });

        // Update driver status
        await prisma.driverProfile.update({
          where: { id },
          data: {
            status: 'AVAILABLE',
            currentLatitude: location?.latitude,
            currentLongitude: location?.longitude,
            lastLocationUpdate: now,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Clocked in successfully',
          data: newEntry,
        });
      }

      case 'clock_out': {
        const check = canClockOut(
          !!activeEntry,
          !!(activeEntry?.breakStartTime && !activeEntry?.breakEndTime)
        );
        if (!check.allowed) {
          return NextResponse.json(
            { error: check.reason },
            { status: 400 }
          );
        }

        if (!activeEntry) {
          return NextResponse.json(
            { error: 'No active timesheet entry' },
            { status: 400 }
          );
        }

        const totalMinutes = calculateWorkMinutes(
          activeEntry.clockInTime,
          now,
          activeEntry.totalBreakMinutes
        );

        const updatedEntry = await prisma.timesheet.update({
          where: { id: activeEntry.id },
          data: {
            clockOutTime: now,
            totalMinutes,
            dispatcherNotes: notes,
          },
        });

        // Update driver status
        await prisma.driverProfile.update({
          where: { id },
          data: {
            status: 'OFFLINE',
            currentLatitude: location?.latitude,
            currentLongitude: location?.longitude,
            lastLocationUpdate: now,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Clocked out successfully',
          data: updatedEntry,
        });
      }

      case 'start_break': {
        if (!activeEntry) {
          return NextResponse.json(
            { error: 'Not clocked in' },
            { status: 400 }
          );
        }

        if (activeEntry.breakStartTime && !activeEntry.breakEndTime) {
          return NextResponse.json(
            { error: 'Already on break' },
            { status: 400 }
          );
        }

        const updatedEntry = await prisma.timesheet.update({
          where: { id: activeEntry.id },
          data: {
            breakStartTime: now,
          },
        });

        // Update driver status
        await prisma.driverProfile.update({
          where: { id },
          data: { status: 'BREAK' },
        });

        return NextResponse.json({
          success: true,
          message: 'Break started',
          data: updatedEntry,
        });
      }

      case 'end_break': {
        if (!activeEntry) {
          return NextResponse.json(
            { error: 'Not clocked in' },
            { status: 400 }
          );
        }

        if (!activeEntry.breakStartTime || activeEntry.breakEndTime) {
          return NextResponse.json(
            { error: 'Not on break' },
            { status: 400 }
          );
        }

        const breakMinutes = Math.floor(
          (now.getTime() - activeEntry.breakStartTime.getTime()) / (1000 * 60)
        );

        const updatedEntry = await prisma.timesheet.update({
          where: { id: activeEntry.id },
          data: {
            breakEndTime: now,
            totalBreakMinutes: activeEntry.totalBreakMinutes + breakMinutes,
          },
        });

        // Update driver status
        await prisma.driverProfile.update({
          where: { id },
          data: { status: 'AVAILABLE' },
        });

        return NextResponse.json({
          success: true,
          message: 'Break ended',
          data: updatedEntry,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: clock_in, clock_out, start_break, end_break' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Timesheet action error:', error);
    return NextResponse.json(
      { error: 'Failed to process timesheet action' },
      { status: 500 }
    );
  }
}
