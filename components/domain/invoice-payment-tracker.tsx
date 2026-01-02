'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Building2,
  Receipt,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentReference?: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
}

interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: string;
}

interface InvoicePaymentTrackerProps {
  invoiceId: string;
  onPaymentRecorded?: () => void;
  className?: string;
}

const PAYMENT_METHODS = [
  { value: 'check', label: 'Check', icon: Receipt },
  { value: 'ach', label: 'ACH Transfer', icon: Building2 },
  { value: 'card', label: 'Credit Card', icon: CreditCard },
  { value: 'cash', label: 'Cash', icon: DollarSign },
];

const STATUS_STYLES: Record<string, { color: string; icon: React.ElementType }> = {
  DRAFT: { color: 'bg-gray-100 text-gray-700', icon: Clock },
  SENT: { color: 'bg-blue-100 text-blue-700', icon: Send },
  VIEWED: { color: 'bg-purple-100 text-purple-700', icon: Clock },
  PARTIALLY_PAID: { color: 'bg-amber-100 text-amber-700', icon: DollarSign },
  PAID: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  OVERDUE: { color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export function InvoicePaymentTracker({
  invoiceId,
  onPaymentRecorded,
  className,
}: InvoicePaymentTrackerProps) {
  const [invoice, setInvoice] = useState<InvoiceSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'check',
    paymentReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
    sendConfirmation: true,
  });

  const fetchPayments = async () => {
    try {
      const response = await fetch(`/api/v1/invoices/${invoiceId}/payments`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.data.invoice);
        setPayments(data.data.payments);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [invoiceId]);

  const handleRecordPayment = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/v1/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod,
          paymentReference: formData.paymentReference || undefined,
          paymentDate: formData.paymentDate,
          notes: formData.notes || undefined,
          sendConfirmation: formData.sendConfirmation,
        }),
      });

      if (response.ok) {
        await fetchPayments();
        setIsAddDialogOpen(false);
        setFormData({
          amount: '',
          paymentMethod: 'check',
          paymentReference: '',
          paymentDate: new Date().toISOString().split('T')[0],
          notes: '',
          sendConfirmation: true,
        });
        onPaymentRecorded?.();
      }
    } catch (error) {
      console.error('Failed to record payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!deleteConfirmId) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/v1/invoices/${invoiceId}/payments?paymentId=${deleteConfirmId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await fetchPayments();
        onPaymentRecorded?.();
      }
    } catch (error) {
      console.error('Failed to delete payment:', error);
    } finally {
      setIsProcessing(false);
      setDeleteConfirmId(null);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    const pm = PAYMENT_METHODS.find((m) => m.value === method);
    return pm?.icon || DollarSign;
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

  if (!invoice) {
    return null;
  }

  const paidPercentage = (invoice.amountPaid / invoice.totalAmount) * 100;
  const StatusIcon = STATUS_STYLES[invoice.status]?.icon || Clock;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Invoice Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Status
            </div>
            <Badge className={STATUS_STYLES[invoice.status]?.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {invoice.status.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">
                ${invoice.amountPaid.toFixed(2)} paid
              </span>
              <span className="font-medium">
                ${invoice.amountDue.toFixed(2)} remaining
              </span>
            </div>
            <Progress value={paidPercentage} className="h-3" />
          </div>

          {/* Amount Summary */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold">${invoice.totalAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ${invoice.amountPaid.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Paid</p>
            </div>
            <div className="text-center">
              <p
                className={cn(
                  'text-2xl font-bold',
                  invoice.amountDue > 0 ? 'text-amber-600' : 'text-green-600'
                )}
              >
                ${invoice.amountDue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Due</p>
            </div>
          </div>

          {/* Record Payment Button */}
          {invoice.amountDue > 0 && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => {
                const PaymentIcon = getPaymentMethodIcon(payment.paymentMethod);
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <PaymentIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ${payment.amount.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 capitalize">
                            via {payment.paymentMethod}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                          {payment.paymentReference && ` • Ref: ${payment.paymentReference}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => setDeleteConfirmId(payment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Record Payment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Invoice #{invoice.invoiceNumber} • ${invoice.amountDue.toFixed(2)} remaining
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={invoice.amountDue}
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2">
                        <method.icon className="h-4 w-4" />
                        {method.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reference Number (optional)</Label>
              <Input
                placeholder="Check #, Transaction ID, etc."
                value={formData.paymentReference}
                onChange={(e) =>
                  setFormData({ ...formData, paymentReference: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Payment notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendConfirmation"
                checked={formData.sendConfirmation}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sendConfirmation: !!checked })
                }
              />
              <label
                htmlFor="sendConfirmation"
                className="text-sm text-gray-600"
              >
                Send payment confirmation email
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecordPayment}
              disabled={isProcessing || !formData.amount}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment record? This will update the invoice balance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
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

export default InvoicePaymentTracker;
