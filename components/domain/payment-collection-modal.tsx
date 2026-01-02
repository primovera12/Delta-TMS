'use client';

import React, { useState, useEffect } from 'react';
import {
  loadStripe,
  Stripe,
  StripeElements,
  PaymentIntent,
} from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      stripePromise = loadStripe(key);
    } else {
      console.warn('Stripe publishable key not configured');
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
};

interface PaymentCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  amount: number;
  tripNumber?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

interface PaymentFormProps {
  tripId: string;
  amount: number;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

function PaymentForm({
  tripId,
  amount,
  clientSecret,
  onSuccess,
  onError,
  onClose,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setPaymentStatus('error');
        setErrorMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          setPaymentStatus('success');
          onSuccess(paymentIntent.id);
        } else if (paymentIntent.status === 'requires_capture') {
          // Payment authorized, waiting for capture
          setPaymentStatus('success');
          onSuccess(paymentIntent.id);
        } else {
          setPaymentStatus('error');
          setErrorMessage(`Payment status: ${paymentIntent.status}`);
        }
      }
    } catch (err) {
      setPaymentStatus('error');
      const message = err instanceof Error ? err.message : 'Payment failed';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-700">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mt-2">
          ${(amount / 100).toFixed(2)} has been charged
        </p>
        <Button onClick={onClose} className="mt-6">
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Amount Display */}
        <Card className="bg-gray-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount to charge</span>
              <span className="text-2xl font-bold">
                ${(amount / 100).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Payment Element */}
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />

        {/* Error Message */}
        {paymentStatus === 'error' && errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {errorMessage}
          </div>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ${(amount / 100).toFixed(2)}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function PaymentCollectionModal({
  open,
  onOpenChange,
  tripId,
  amount,
  tripNumber,
  onSuccess,
  onError,
}: PaymentCollectionModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent when modal opens
  useEffect(() => {
    if (open && !clientSecret) {
      createPaymentIntent();
    }
  }, [open]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      setClientSecret(data.data.clientSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize payment';
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setClientSecret(null);
      setError(null);
    }, 300);
  };

  const handleSuccess = (paymentIntentId: string) => {
    onSuccess?.(paymentIntentId);
  };

  const handleError = (message: string) => {
    onError?.(message);
  };

  const stripeOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#0f172a',
          },
        },
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Collect Payment
          </DialogTitle>
          <DialogDescription>
            {tripNumber
              ? `Collect payment for Trip #${tripNumber}`
              : 'Enter payment details to complete the transaction'}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Initializing payment...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <Button onClick={createPaymentIntent} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {clientSecret && stripeOptions && (
          <Elements stripe={getStripe()} options={stripeOptions}>
            <PaymentForm
              tripId={tripId}
              amount={amount}
              clientSecret={clientSecret}
              onSuccess={handleSuccess}
              onError={handleError}
              onClose={handleClose}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PaymentCollectionModal;
