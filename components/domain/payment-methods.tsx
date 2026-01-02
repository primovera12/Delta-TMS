'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  CreditCard,
  Trash2,
  Plus,
  Loader2,
  Check,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      stripePromise = loadStripe(key);
    } else {
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
};

interface PaymentMethod {
  id: string;
  type: string;
  brand?: string | null;
  lastFourDigits?: string | null;
  expiryMonth?: number | null;
  expiryYear?: number | null;
  isDefault: boolean;
}

interface PaymentMethodsProps {
  userId: string;
  className?: string;
  onMethodsChange?: () => void;
}

interface AddPaymentMethodFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function AddPaymentMethodForm({
  clientSecret,
  onSuccess,
  onCancel,
}: AddPaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/method-added`,
        },
        redirect: 'if_required',
      });

      if (setupError) {
        setError(setupError.message || 'Failed to add payment method');
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function PaymentMethods({
  userId,
  className,
  onMethodsChange,
}: PaymentMethodsProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMethods = async () => {
    try {
      const response = await fetch(`/api/v1/payments/methods?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMethods(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, [userId]);

  const handleAddMethod = async () => {
    try {
      const response = await fetch('/api/v1/payments/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setClientSecret(data.data.clientSecret);
        setIsAddDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to create setup intent:', error);
    }
  };

  const handleAddSuccess = async () => {
    setIsAddDialogOpen(false);
    setClientSecret(null);
    await fetchMethods();
    onMethodsChange?.();
  };

  const handleDeleteMethod = async () => {
    if (!deleteConfirmId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/payments/methods?id=${deleteConfirmId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMethods();
        onMethodsChange?.();
      }
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const getCardIcon = (brand?: string | null) => {
    // Could add specific card brand icons here
    return <CreditCard className="h-6 w-6 text-gray-400" />;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </div>
            <Button size="sm" onClick={handleAddMethod}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {methods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No payment methods saved</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleAddMethod}>
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {methods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    method.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {method.type === 'BANK_ACCOUNT' ? (
                      <Building2 className="h-6 w-6 text-gray-400" />
                    ) : (
                      getCardIcon(method.brand)
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {method.brand || method.type.toLowerCase().replace('_', ' ')}
                        </span>
                        {method.lastFourDigits && (
                          <span className="text-gray-500">
                            •••• {method.lastFourDigits}
                          </span>
                        )}
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {method.expiryMonth && method.expiryYear && (
                        <p className="text-sm text-gray-500">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => setDeleteConfirmId(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setClientSecret(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new card or bank account for future payments
            </DialogDescription>
          </DialogHeader>

          {clientSecret && (
            <Elements
              stripe={getStripe()}
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <AddPaymentMethodForm
                clientSecret={clientSecret}
                onSuccess={handleAddSuccess}
                onCancel={() => {
                  setIsAddDialogOpen(false);
                  setClientSecret(null);
                }}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMethod}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PaymentMethods;
