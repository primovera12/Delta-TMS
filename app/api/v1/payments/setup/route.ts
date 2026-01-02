import { NextRequest, NextResponse } from 'next/server';
import { createSetupIntent } from '@/lib/services/stripe';

/**
 * POST /api/v1/payments/setup
 * Create a setup intent for adding a new payment method
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await createSetupIntent(userId);

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: result.clientSecret,
      },
    });
  } catch (error) {
    console.error('Create setup intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create setup intent' },
      { status: 500 }
    );
  }
}
