/**
 * Stripe Payment Service
 * Handles payment processing, refunds, and payment method management
 */

import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { PaymentStatus, PaymentMethodType } from '@prisma/client';

// Lazy initialization of Stripe client
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility
const stripe = {
  get customers() { return getStripe().customers; },
  get paymentIntents() { return getStripe().paymentIntents; },
  get paymentMethods() { return getStripe().paymentMethods; },
  get setupIntents() { return getStripe().setupIntents; },
  get refunds() { return getStripe().refunds; },
  get webhooks() { return getStripe().webhooks; },
};

export interface CreatePaymentIntentParams {
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  paymentMethodId?: string;
  tripId?: string;
  description?: string;
  metadata?: Record<string, string>;
  captureMethod?: 'automatic' | 'manual';
}

export interface CreatePaymentIntentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

export interface CapturePaymentResult {
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface SavePaymentMethodParams {
  userId: string;
  stripePaymentMethodId: string;
  setAsDefault?: boolean;
}

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(
  params: CreateCustomerParams
): Promise<{ customerId: string } | { error: string }> {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: params.metadata,
    });

    return { customerId: customer.id };
  } catch (error) {
    console.error('Create Stripe customer error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create customer' };
  }
}

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string
): Promise<{ customerId: string } | { error: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    if (user.stripeCustomerId) {
      return { customerId: user.stripeCustomerId };
    }

    // Create new Stripe customer
    const result = await createStripeCustomer({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      metadata: { userId: user.id },
    });

    if ('error' in result) {
      return result;
    }

    // Save customer ID to user
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: result.customerId },
    });

    return result;
  } catch (error) {
    console.error('Get or create Stripe customer error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to get customer' };
  }
}

/**
 * Create a payment intent
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<CreatePaymentIntentResult> {
  try {
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: params.amount,
      currency: params.currency || 'usd',
      description: params.description,
      capture_method: params.captureMethod || 'automatic',
      metadata: {
        tripId: params.tripId || '',
        ...params.metadata,
      },
    };

    if (params.customerId) {
      paymentIntentParams.customer = params.customerId;
    }

    if (params.paymentMethodId) {
      paymentIntentParams.payment_method = params.paymentMethodId;
      paymentIntentParams.confirm = true;
      paymentIntentParams.automatic_payment_methods = {
        enabled: true,
        allow_redirects: 'never',
      };
    } else {
      paymentIntentParams.automatic_payment_methods = {
        enabled: true,
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    // Update trip with payment intent ID if provided
    if (params.tripId) {
      await prisma.trip.update({
        where: { id: params.tripId },
        data: {
          stripePaymentIntentId: paymentIntent.id,
          paymentStatus: mapStripeStatusToPaymentStatus(paymentIntent.status),
        },
      });
    }

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error('Create payment intent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    };
  }
}

/**
 * Capture a previously authorized payment
 */
export async function capturePayment(
  paymentIntentId: string,
  amountToCapture?: number
): Promise<CapturePaymentResult> {
  try {
    const captureParams: Stripe.PaymentIntentCaptureParams = {};
    if (amountToCapture) {
      captureParams.amount_to_capture = amountToCapture;
    }

    const paymentIntent = await stripe.paymentIntents.capture(
      paymentIntentId,
      captureParams
    );

    // Update trip payment status
    if (paymentIntent.metadata.tripId) {
      await prisma.trip.update({
        where: { id: paymentIntent.metadata.tripId },
        data: {
          paymentStatus: PaymentStatus.CAPTURED,
        },
      });
    }

    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Capture payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to capture payment',
    };
  }
}

/**
 * Cancel a payment intent
 */
export async function cancelPaymentIntent(
  paymentIntentId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await stripe.paymentIntents.cancel(paymentIntentId, {
      cancellation_reason: 'requested_by_customer' as Stripe.PaymentIntentCancelParams.CancellationReason,
    });

    return { success: true };
  } catch (error) {
    console.error('Cancel payment intent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel payment',
    };
  }
}

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<RefundResult> {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer',
    };

    if (amount) {
      refundParams.amount = amount;
    }

    const refund = await stripe.refunds.create(refundParams);

    // Get payment intent to update trip
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.tripId) {
      await prisma.trip.update({
        where: { id: paymentIntent.metadata.tripId },
        data: {
          paymentStatus: amount ? PaymentStatus.PARTIALLY_REFUNDED : PaymentStatus.REFUNDED,
        },
      });
    }

    return {
      success: true,
      refundId: refund.id,
    };
  } catch (error) {
    console.error('Create refund error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create refund',
    };
  }
}

/**
 * Save a payment method for a user
 */
export async function savePaymentMethod(
  params: SavePaymentMethodParams
): Promise<{ paymentMethodId: string } | { error: string }> {
  try {
    // Get or create Stripe customer
    const customerResult = await getOrCreateStripeCustomer(params.userId);
    if ('error' in customerResult) {
      return customerResult;
    }

    // Attach payment method to customer
    const paymentMethod = await stripe.paymentMethods.attach(
      params.stripePaymentMethodId,
      { customer: customerResult.customerId }
    );

    // Get payment method details
    const pmDetails = paymentMethod.card || paymentMethod.us_bank_account;

    // Determine payment method type
    let type: PaymentMethodType = PaymentMethodType.CARD;
    if (paymentMethod.type === 'us_bank_account') {
      type = PaymentMethodType.BANK_ACCOUNT;
    }

    // Check if this is the first payment method (make it default)
    const existingMethods = await prisma.paymentMethod.count({
      where: { userId: params.userId },
    });
    const isDefault = existingMethods === 0 || params.setAsDefault;

    // If setting as default, remove default from other methods
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: params.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Save to database
    const savedMethod = await prisma.paymentMethod.create({
      data: {
        userId: params.userId,
        stripePaymentMethodId: paymentMethod.id,
        type,
        brand: paymentMethod.card?.brand,
        lastFourDigits: paymentMethod.card?.last4 || paymentMethod.us_bank_account?.last4,
        expiryMonth: paymentMethod.card?.exp_month,
        expiryYear: paymentMethod.card?.exp_year,
        isDefault,
      },
    });

    // Set as default payment method in Stripe if needed
    if (isDefault) {
      await stripe.customers.update(customerResult.customerId, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });
    }

    return { paymentMethodId: savedMethod.id };
  } catch (error) {
    console.error('Save payment method error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to save payment method' };
  }
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(
  paymentMethodId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (!paymentMethod) {
      return { success: false, error: 'Payment method not found' };
    }

    // Detach from Stripe
    if (paymentMethod.stripePaymentMethodId) {
      try {
        await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);
      } catch (e) {
        // Payment method might already be detached
        console.warn('Payment method detach warning:', e);
      }
    }

    // Delete from database
    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    return { success: true };
  } catch (error) {
    console.error('Delete payment method error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete payment method' };
  }
}

/**
 * Get user's payment methods
 */
export async function getUserPaymentMethods(userId: string) {
  return prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
}

/**
 * Create a setup intent for adding a new payment method
 */
export async function createSetupIntent(
  userId: string
): Promise<{ clientSecret: string } | { error: string }> {
  try {
    const customerResult = await getOrCreateStripeCustomer(userId);
    if ('error' in customerResult) {
      return customerResult;
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerResult.customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { clientSecret: setupIntent.client_secret || '' };
  } catch (error) {
    console.error('Create setup intent error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create setup intent' };
  }
}

/**
 * Process a payment for a trip
 */
export async function processTriPPayment(
  tripId: string,
  paymentMethodId?: string
): Promise<CreatePaymentIntentResult> {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookedBy: true,
        paymentMethod: true,
      },
    });

    if (!trip) {
      return { success: false, error: 'Trip not found' };
    }

    // Get the payment method
    const pmId = paymentMethodId || trip.paymentMethodId;
    let stripePaymentMethodId: string | undefined;
    let customerId: string | undefined;

    if (pmId) {
      const pm = await prisma.paymentMethod.findUnique({
        where: { id: pmId },
      });
      stripePaymentMethodId = pm?.stripePaymentMethodId || undefined;
    }

    // Get customer ID if user has one
    if (trip.bookedById) {
      const customerResult = await getOrCreateStripeCustomer(trip.bookedById);
      if (!('error' in customerResult)) {
        customerId = customerResult.customerId;
      }
    }

    // Calculate amount in cents
    const amount = Math.round((trip.totalPrice || 0) * 100);

    if (amount <= 0) {
      return { success: false, error: 'Invalid payment amount' };
    }

    return createPaymentIntent({
      amount,
      customerId,
      paymentMethodId: stripePaymentMethodId,
      tripId: trip.id,
      description: `Trip #${trip.tripNumber}`,
      metadata: {
        tripNumber: trip.tripNumber,
      },
    });
  } catch (error) {
    console.error('Process trip payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment',
    };
  }
}

/**
 * Map Stripe payment intent status to our PaymentStatus
 */
function mapStripeStatusToPaymentStatus(
  stripeStatus: Stripe.PaymentIntent.Status
): PaymentStatus {
  switch (stripeStatus) {
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
    case 'processing':
      return PaymentStatus.PENDING;
    case 'requires_capture':
      return PaymentStatus.AUTHORIZED;
    case 'succeeded':
      return PaymentStatus.CAPTURED;
    case 'canceled':
      return PaymentStatus.FAILED;
    default:
      return PaymentStatus.PENDING;
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.metadata.tripId) {
        await prisma.trip.update({
          where: { id: paymentIntent.metadata.tripId },
          data: {
            paymentStatus: PaymentStatus.CAPTURED,
          },
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.metadata.tripId) {
        await prisma.trip.update({
          where: { id: paymentIntent.metadata.tripId },
          data: {
            paymentStatus: PaymentStatus.FAILED,
          },
        });
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent && typeof charge.payment_intent === 'string') {
        const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent);
        if (paymentIntent.metadata.tripId) {
          const isFullRefund = charge.amount_refunded === charge.amount;
          await prisma.trip.update({
            where: { id: paymentIntent.metadata.tripId },
            data: {
              paymentStatus: isFullRefund
                ? PaymentStatus.REFUNDED
                : PaymentStatus.PARTIALLY_REFUNDED,
            },
          });
        }
      }
      break;
    }
  }
}

// Export stripe getter for advanced usage
export { getStripe as stripe };
