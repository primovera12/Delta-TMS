'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCard,
  DollarSign,
  Package,
  Settings,
  Save,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';

// Mock billing plans
const mockPlans = [
  {
    id: 'PLAN-001',
    name: 'Starter',
    price: 99,
    interval: 'monthly',
    features: ['Up to 10 users', 'Up to 5 drivers', '500 trips/month', 'Email support'],
    active: true,
    subscribers: 45,
  },
  {
    id: 'PLAN-002',
    name: 'Professional',
    price: 299,
    interval: 'monthly',
    features: ['Up to 50 users', 'Up to 25 drivers', 'Unlimited trips', 'Priority support', 'API access'],
    active: true,
    subscribers: 28,
  },
  {
    id: 'PLAN-003',
    name: 'Enterprise',
    price: 799,
    interval: 'monthly',
    features: ['Unlimited users', 'Unlimited drivers', 'Unlimited trips', '24/7 support', 'Custom integrations', 'Dedicated account manager'],
    active: true,
    subscribers: 12,
  },
];

export default function SuperAdminBillingConfigPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Configuration</h1>
          <p className="text-gray-600">Manage subscription plans and payment settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
          <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Subscription Plans</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {mockPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-500">/{plan.interval}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{plan.subscribers} subscribers</span>
                        <Badge className={plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {plan.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Gateway Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Provider</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key (Live)</Label>
                  <Input type="password" defaultValue="••••••••••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>API Key (Test)</Label>
                  <Input type="password" defaultValue="••••••••••••••••" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Webhook Secret</Label>
                <Input type="password" defaultValue="••••••••••••••••" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Test Mode</p>
                  <p className="text-sm text-gray-500">Use test credentials for transactions</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Accepted Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Credit/Debit Cards</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>ACH Bank Transfer</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>PayPal</span>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoicing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Invoice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Prefix</Label>
                  <Input defaultValue="INV-" />
                </div>
                <div className="space-y-2">
                  <Label>Starting Number</Label>
                  <Input type="number" defaultValue="1001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Terms (Days)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-generate Invoices</p>
                  <p className="text-sm text-gray-500">Automatically create invoices on billing date</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Send Invoice Emails</p>
                  <p className="text-sm text-gray-500">Email invoices to customers automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Enable Tax Calculation</p>
                  <p className="text-sm text-gray-500">Calculate and apply taxes to invoices</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Default Tax Rate (%)</Label>
                <Input type="number" defaultValue="8.25" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Tax ID / VAT Number</Label>
                <Input placeholder="Enter tax identification number" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
