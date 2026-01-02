import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthorizationUrl,
  getConnectionStatus,
  disconnect,
  syncInvoice,
  syncPayment,
} from '@/lib/services/quickbooks';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

/**
 * GET /api/v1/integrations/quickbooks
 * Get QuickBooks connection status
 */
export async function GET() {
  try {
    const status = await getConnectionStatus();

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Get QuickBooks status error:', error);
    return NextResponse.json(
      { error: 'Failed to get connection status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/integrations/quickbooks
 * Initiate QuickBooks connection or perform sync operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, invoiceId, paymentId } = body;

    switch (action) {
      case 'connect': {
        // Generate state for CSRF protection
        const state = crypto.randomBytes(16).toString('hex');

        // Store state temporarily
        await prisma.systemSettings.upsert({
          where: { key: 'quickbooks_oauth_state' },
          update: { value: { state } },
          create: { key: 'quickbooks_oauth_state', value: { state } },
        });

        const authUrl = getAuthorizationUrl(state);

        return NextResponse.json({
          success: true,
          data: { authorizationUrl: authUrl },
        });
      }

      case 'sync_invoice': {
        if (!invoiceId) {
          return NextResponse.json(
            { error: 'Invoice ID is required' },
            { status: 400 }
          );
        }

        const result = await syncInvoice(invoiceId);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error || 'Failed to sync invoice' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: { quickbooksInvoiceId: result.quickbooksId },
        });
      }

      case 'sync_payment': {
        if (!invoiceId || !paymentId) {
          return NextResponse.json(
            { error: 'Invoice ID and Payment ID are required' },
            { status: 400 }
          );
        }

        const result = await syncPayment(invoiceId, paymentId);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error || 'Failed to sync payment' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: { quickbooksPaymentId: result.quickbooksId },
        });
      }

      case 'sync_all': {
        // Sync all unsyced invoices
        const unsynced = await prisma.invoice.findMany({
          where: {
            quickbooksInvoiceId: null,
            status: { in: ['SENT', 'VIEWED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE'] },
          },
          orderBy: { createdAt: 'asc' },
          take: 50, // Limit batch size
        });

        const results = {
          total: unsynced.length,
          synced: 0,
          failed: 0,
          errors: [] as string[],
        };

        for (const invoice of unsynced) {
          const result = await syncInvoice(invoice.id);
          if (result.success) {
            results.synced++;
          } else {
            results.failed++;
            results.errors.push(`${invoice.invoiceNumber}: ${result.error}`);
          }
        }

        // Update last sync time
        await prisma.systemSettings.upsert({
          where: { key: 'quickbooks_last_sync' },
          update: { value: { date: new Date().toISOString() } },
          create: { key: 'quickbooks_last_sync', value: { date: new Date().toISOString() } },
        });

        return NextResponse.json({
          success: true,
          data: results,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('QuickBooks action error:', error);
    return NextResponse.json(
      { error: 'Failed to process QuickBooks action' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/integrations/quickbooks
 * Disconnect QuickBooks integration
 */
export async function DELETE() {
  try {
    await disconnect();

    return NextResponse.json({
      success: true,
      message: 'QuickBooks disconnected',
    });
  } catch (error) {
    console.error('QuickBooks disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect QuickBooks' },
      { status: 500 }
    );
  }
}
