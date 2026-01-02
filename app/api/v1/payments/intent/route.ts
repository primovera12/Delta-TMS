import { NextRequest, NextResponse } from 'next/server';
import {
  createPaymentIntent,
  processTriPPayment,
  capturePayment,
  cancelPaymentIntent,
} from '@/lib/services/stripe';

/**
 * POST /api/v1/payments/intent
 * Create a payment intent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, amount, paymentMethodId, customerId, description, captureMethod } = body;

    // If tripId is provided, use the trip payment flow
    if (tripId) {
      const result = await processTriPPayment(tripId, paymentMethodId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to create payment' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          paymentIntentId: result.paymentIntentId,
          clientSecret: result.clientSecret,
        },
      });
    }

    // Otherwise, create a standalone payment intent
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount is required and must be positive' },
        { status: 400 }
      );
    }

    const result = await createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      customerId,
      paymentMethodId,
      description,
      captureMethod,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create payment intent' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
      },
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/payments/intent
 * Capture or cancel a payment intent
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, action, amountToCapture } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    if (!action || !['capture', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "capture" or "cancel"' },
        { status: 400 }
      );
    }

    if (action === 'capture') {
      const result = await capturePayment(
        paymentIntentId,
        amountToCapture ? Math.round(amountToCapture * 100) : undefined
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to capture payment' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          paymentIntentId: result.paymentIntent?.id,
          status: result.paymentIntent?.status,
        },
      });
    }

    if (action === 'cancel') {
      const result = await cancelPaymentIntent(paymentIntentId);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to cancel payment' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Payment intent cancelled',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment intent' },
      { status: 500 }
    );
  }
}
