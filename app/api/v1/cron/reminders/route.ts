import { NextRequest, NextResponse } from 'next/server';
import {
  send24HourReminders,
  send1HourReminders,
  notifyDriversOfUpcomingTrips,
  getNotificationStats,
} from '@/lib/services/reminder-scheduler';

/**
 * POST /api/v1/cron/reminders
 * Cron job endpoint to send scheduled reminders
 *
 * Should be called every 15-30 minutes by Vercel Cron or external scheduler
 *
 * Authorization: Requires CRON_SECRET header for security
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const cronSecret = request.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && cronSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { types = ['24h', '1h', 'driver'] } = body;

    const results: Record<string, { sent: number; failed: number; errors?: string[] }> = {};

    // Send 24-hour reminders
    if (types.includes('24h')) {
      results['24h'] = await send24HourReminders();
    }

    // Send 1-hour reminders
    if (types.includes('1h')) {
      results['1h'] = await send1HourReminders();
    }

    // Notify drivers of upcoming trips
    if (types.includes('driver')) {
      results['driver'] = await notifyDriversOfUpcomingTrips();
    }

    // Calculate totals
    const totalSent = Object.values(results).reduce((sum, r) => sum + r.sent, 0);
    const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);

    console.log(`[Cron] Reminders sent: ${totalSent}, failed: ${totalFailed}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
      summary: {
        totalSent,
        totalFailed,
      },
    });
  } catch (error) {
    console.error('Cron reminder error:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/cron/reminders
 * Get notification statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const stats = await getNotificationStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get notification stats' },
      { status: 500 }
    );
  }
}
