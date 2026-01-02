import { NextRequest, NextResponse } from 'next/server';
import {
  getUserPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,
  createSetupIntent,
} from '@/lib/services/stripe';

/**
 * GET /api/v1/payments/methods
 * Get user's payment methods
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const paymentMethods = await getUserPaymentMethods(userId);

    return NextResponse.json({
      success: true,
      data: paymentMethods.map((pm) => ({
        id: pm.id,
        type: pm.type,
        brand: pm.brand,
        lastFourDigits: pm.lastFourDigits,
        expiryMonth: pm.expiryMonth,
        expiryYear: pm.expiryYear,
        isDefault: pm.isDefault,
        createdAt: pm.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    return NextResponse.json(
      { error: 'Failed to get payment methods' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/payments/methods
 * Save a new payment method
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, stripePaymentMethodId, setAsDefault } = body;

    if (!userId || !stripePaymentMethodId) {
      return NextResponse.json(
        { error: 'User ID and Stripe payment method ID are required' },
        { status: 400 }
      );
    }

    const result = await savePaymentMethod({
      userId,
      stripePaymentMethodId,
      setAsDefault,
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentMethodId: result.paymentMethodId,
      },
    });
  } catch (error) {
    console.error('Save payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to save payment method' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/payments/methods
 * Delete a payment method
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get('id');

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const result = await deletePaymentMethod(paymentMethodId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete payment method' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted',
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}
