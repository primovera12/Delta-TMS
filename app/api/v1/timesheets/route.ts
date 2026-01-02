import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/v1/timesheets
 * Get all timesheets with filtering options
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const driverId = searchParams.get('driverId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (driverId) {
      where.driverId = driverId;
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

    const [timesheets, total] = await Promise.all([
      prisma.timesheet.findMany({
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
        orderBy: [{ date: 'desc' }, { clockInTime: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.timesheet.count({ where }),
    ]);

    // Calculate summary stats
    const stats = await prisma.timesheet.aggregate({
      where,
      _sum: {
        totalMinutes: true,
        totalBreakMinutes: true,
      },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        timesheets,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          totalEntries: stats._count,
          totalMinutesWorked: stats._sum.totalMinutes || 0,
          totalBreakMinutes: stats._sum.totalBreakMinutes || 0,
          totalHoursWorked: Math.round((stats._sum.totalMinutes || 0) / 60 * 10) / 10,
        },
      },
    });
  } catch (error) {
    console.error('Get timesheets error:', error);
    return NextResponse.json(
      { error: 'Failed to get timesheets' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/timesheets
 * Bulk update timesheet status (approve/reject)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status, notes } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Timesheet IDs are required' },
        { status: 400 }
      );
    }

    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required (approved, rejected, pending)' },
        { status: 400 }
      );
    }

    // Update all timesheets
    const result = await prisma.timesheet.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
        dispatcherNotes: notes || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} timesheet(s) ${status}`,
      data: { updated: result.count },
    });
  } catch (error) {
    console.error('Update timesheets error:', error);
    return NextResponse.json(
      { error: 'Failed to update timesheets' },
      { status: 500 }
    );
  }
}
