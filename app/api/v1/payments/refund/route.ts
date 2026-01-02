import { NextRequest, NextResponse } from 'next/server';
import { createRefund } from '@/lib/services/stripe';
import { prisma } from '@/lib/db';

/**
 * POST /api/v1/payments/refund
 * Create a refund for a payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, paymentIntentId, amount, reason } = body;

    let intentId = paymentIntentId;

    // If tripId is provided, get the payment intent from the trip
    if (tripId && !intentId) {
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        select: { stripePaymentIntentId: true },
      });

      if (!trip?.stripePaymentIntentId) {
        return NextResponse.json(
          { error: 'No payment found for this trip' },
          { status: 400 }
        );
      }

      intentId = trip.stripePaymentIntentId;
    }

    if (!intentId) {
      return NextResponse.json(
        { error: 'Payment intent ID or trip ID is required' },
        { status: 400 }
      );
    }

    // Validate reason if provided
    const validReasons = ['duplicate', 'fraudulent', 'requested_by_customer'] as const;
    const refundReason = reason && validReasons.includes(reason) ? reason : 'requested_by_customer';

    const result = await createRefund(
      intentId,
      amount ? Math.round(amount * 100) : undefined,
      refundReason
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create refund' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        refundId: result.refundId,
        amount: amount || 'full',
      },
    });
  } catch (error) {
    console.error('Create refund error:', error);
    return NextResponse.json(
      { error: 'Failed to create refund' },
      { status: 500 }
    );
  }
}
