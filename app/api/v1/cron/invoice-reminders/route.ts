import { NextRequest, NextResponse } from 'next/server';
import { getInvoicesNeedingReminders, sendInvoiceReminder } from '@/lib/services/email';

/**
 * POST /api/v1/cron/invoice-reminders
 * Cron job to send invoice reminder emails
 * Should be called daily
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const cronSecret = request.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && cronSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { dueSoon, overdue } = await getInvoicesNeedingReminders();

    const results = {
      dueSoon: { sent: 0, failed: 0 },
      overdue: { sent: 0, failed: 0 },
    };

    // Send reminders for invoices due soon
    for (const invoiceId of dueSoon) {
      const result = await sendInvoiceReminder(invoiceId, false);
      if (result.success) {
        results.dueSoon.sent++;
      } else {
        results.dueSoon.failed++;
      }
    }

    // Send overdue notices
    for (const invoiceId of overdue) {
      const result = await sendInvoiceReminder(invoiceId, true);
      if (result.success) {
        results.overdue.sent++;
      } else {
        results.overdue.failed++;
      }
    }

    console.log('[Cron] Invoice reminders sent:', results);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Invoice reminder cron error:', error);
    return NextResponse.json(
      { error: 'Failed to process invoice reminders' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/cron/invoice-reminders
 * Get pending invoice reminders count
 */
export async function GET() {
  try {
    const { dueSoon, overdue } = await getInvoicesNeedingReminders();

    return NextResponse.json({
      success: true,
      data: {
        dueSoon: dueSoon.length,
        overdue: overdue.length,
        total: dueSoon.length + overdue.length,
      },
    });
  } catch (error) {
    console.error('Get invoice reminders error:', error);
    return NextResponse.json(
      { error: 'Failed to get invoice reminders' },
      { status: 500 }
    );
  }
}
