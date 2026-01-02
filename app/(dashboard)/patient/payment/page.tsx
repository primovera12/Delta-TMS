'use client';

import * as React from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Building2,
  Star,
  Shield,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'insurance';
  brand?: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
  bankName?: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    nickname: 'Personal Card',
  },
  {
    id: '2',
    type: 'card',
    brand: 'Mastercard',
    last4: '8888',
    expiryMonth: 6,
    expiryYear: 2025,
    isDefault: false,
    nickname: 'Backup Card',
  },
  {
    id: '3',
    type: 'insurance',
    last4: '9012',
    isDefault: false,
    insuranceProvider: 'Medicare',
    policyNumber: 'MED-2024-9012',
  },
];

export default function PatientPaymentPage() {
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(mockPaymentMethods);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod | null>(null);
  const [newMethodType, setNewMethodType] = React.useState<'card' | 'bank' | 'insurance'>('card');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddPaymentMethod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newMethodType,
      last4: (formData.get('cardNumber') as string)?.slice(-4) || '0000',
      brand: newMethodType === 'card' ? 'Visa' : undefined,
      expiryMonth: newMethodType === 'card' ? parseInt(formData.get('expiryMonth') as string) : undefined,
      expiryYear: newMethodType === 'card' ? parseInt(formData.get('expiryYear') as string) : undefined,
      isDefault: paymentMethods.length === 0,
      nickname: formData.get('nickname') as string,
      insuranceProvider: newMethodType === 'insurance' ? formData.get('insuranceProvider') as string : undefined,
      policyNumber: newMethodType === 'insurance' ? formData.get('policyNumber') as string : undefined,
      bankName: newMethodType === 'bank' ? formData.get('bankName') as string : undefined,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAddDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(
      paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === methodId,
      }))
    );
  };

  const handleDelete = async () => {
    if (!selectedMethod) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPaymentMethods(paymentMethods.filter((m) => m.id !== selectedMethod.id));
    setIsDeleteDialogOpen(false);
    setSelectedMethod(null);
    setIsSubmitting(false);
  };

  const getCardIcon = (brand?: string) => {
    // In a real app, you'd use card brand icons
    return <CreditCard className="h-8 w-8" />;
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return <CreditCard className="h-6 w-6 text-primary-600" />;
      case 'bank':
        return <Building2 className="h-6 w-6 text-success-600" />;
      case 'insurance':
        return <Shield className="h-6 w-6 text-info-600" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500">Manage your payment methods for ride services</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="border-info-200 bg-info-50">
        <CardContent className="flex items-start gap-3 p-4">
          <Shield className="h-5 w-5 text-info-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-info-900">Your payment information is secure</p>
            <p className="text-sm text-info-700">
              All payment data is encrypted and stored securely. We never store your full card number.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No payment methods</h3>
              <p className="text-sm text-gray-500 mb-4">Add a payment method to book rides</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? 'border-primary-300 bg-primary-50/50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    {getMethodIcon(method)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {method.type === 'card' && `${method.brand} •••• ${method.last4}`}
                        {method.type === 'bank' && `${method.bankName} •••• ${method.last4}`}
                        {method.type === 'insurance' && method.insuranceProvider}
                      </h3>
                      {method.isDefault && (
                        <Badge variant="default" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    {method.nickname && (
                      <p className="text-sm text-gray-500">{method.nickname}</p>
                    )}
                    {method.type === 'card' && method.expiryMonth && method.expiryYear && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                      </p>
                    )}
                    {method.type === 'insurance' && method.policyNumber && (
                      <p className="text-sm text-gray-500">Policy: {method.policyNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error-600 hover:text-error-700 hover:bg-error-50"
                      onClick={() => {
                        setSelectedMethod(method);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Billing History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2024-01-15', description: 'Trip to Memorial Hospital', amount: 25.00, status: 'completed' },
              { date: '2024-01-12', description: 'Trip to Downtown Clinic', amount: 18.50, status: 'completed' },
              { date: '2024-01-10', description: 'Trip to Regional Dialysis', amount: 32.00, status: 'completed' },
              { date: '2024-01-08', description: 'Trip to City Medical Center', amount: 22.00, status: 'pending' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${transaction.amount.toFixed(2)}</p>
                  <Badge
                    variant={transaction.status === 'completed' ? 'success' : 'warning'}
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4 p-0">
            View full billing history
          </Button>
        </CardContent>
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to your account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPaymentMethod}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select value={newMethodType} onValueChange={(v) => setNewMethodType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newMethodType === 'card' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Expiry Month</Label>
                      <Select name="expiryMonth" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Expiry Year</Label>
                      <Select name="expiryYear" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </>
              )}

              {newMethodType === 'bank' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      placeholder="Enter bank name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      name="routingNumber"
                      placeholder="123456789"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                </>
              )}

              {newMethodType === 'insurance' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Select name="insuranceProvider" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medicare">Medicare</SelectItem>
                        <SelectItem value="Medicaid">Medicaid</SelectItem>
                        <SelectItem value="Blue Cross">Blue Cross Blue Shield</SelectItem>
                        <SelectItem value="Aetna">Aetna</SelectItem>
                        <SelectItem value="UnitedHealth">UnitedHealth</SelectItem>
                        <SelectItem value="Cigna">Cigna</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      name="policyNumber"
                      placeholder="Enter policy number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupNumber">Group Number (Optional)</Label>
                    <Input
                      id="groupNumber"
                      name="groupNumber"
                      placeholder="Enter group number"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname (Optional)</Label>
                <Input
                  id="nickname"
                  name="nickname"
                  placeholder="e.g., Personal Card"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Payment Method'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-error-600 hover:bg-error-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
