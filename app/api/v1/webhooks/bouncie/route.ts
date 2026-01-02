/**
 * Bouncie Webhook Endpoint
 *
 * Receives real-time events from Bouncie GPS devices.
 *
 * Event Types:
 * - location: Real-time location update
 * - trip-start: Vehicle started moving
 * - trip-end: Vehicle stopped
 * - speeding: Speed threshold exceeded
 * - hard-brake: Hard braking detected
 * - rapid-accel: Rapid acceleration
 * - idle: Extended idling
 * - dtc: Diagnostic trouble code
 * - battery: Battery voltage alert
 * - mil: Malfunction indicator lamp (check engine)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  processBouncieWebhook,
  validateWebhookSignature,
  type BouncieWebhookPayload,
} from '@/lib/services/bouncie/webhook-handler';
import { bouncieService } from '@/lib/services/bouncie';

/**
 * POST /api/v1/webhooks/bouncie
 * Receive Bouncie webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Bouncie is enabled
    const isEnabled = await bouncieService.isEnabled();
    if (!isEnabled) {
      return NextResponse.json(
        { error: 'Bouncie integration is not enabled' },
        { status: 503 }
      );
    }

    // Get raw body for signature validation
    const rawBody = await request.text();

    // Validate webhook signature
    const signature = request.headers.get('x-bouncie-signature');
    const isValid = await validateWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.warn('Invalid Bouncie webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse payload
    let payload: BouncieWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!payload.event || !payload.imei) {
      return NextResponse.json(
        { error: 'Missing required fields: event, imei' },
        { status: 400 }
      );
    }

    // Process the webhook
    const result = await processBouncieWebhook(payload);

    if (!result.success) {
      console.error('Webhook processing failed:', result.error);
      // Still return 200 to acknowledge receipt (prevents Bouncie from retrying)
      return NextResponse.json({
        received: true,
        processed: false,
        error: result.error,
      });
    }

    return NextResponse.json({
      received: true,
      processed: true,
      eventId: result.eventId,
      action: result.action,
    });
  } catch (error) {
    console.error('Bouncie webhook error:', error);
    // Return 500 so Bouncie will retry
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/webhooks/bouncie
 * Health check for webhook endpoint
 */
export async function GET(request: NextRequest) {
  const isEnabled = await bouncieService.isEnabled();
  const config = await bouncieService.getConfig();

  return NextResponse.json({
    status: 'ok',
    bouncieEnabled: isEnabled,
    webhookEnabled: config?.webhookEnabled ?? false,
    lastSync: config?.lastSyncAt ?? null,
    syncStatus: config?.syncStatus ?? 'disconnected',
  });
}
