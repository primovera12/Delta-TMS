'use client';

import * as React from 'react';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  MessageSquare,
  CreditCard,
  Clock,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Key,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AdminSettingsPage() {
  const [saving, setSaving] = React.useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6 space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Delta Transportation Services" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input id="companyPhone" defaultValue="(713) 555-0100" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="companyAddress">Address</Label>
                <Input id="companyAddress" defaultValue="1234 Main Street, Houston, TX 77001" className="mt-1.5" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input id="companyEmail" type="email" defaultValue="info@delta-tms.com" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input id="companyWebsite" defaultValue="https://delta-tms.com" className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america_chicago">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america_chicago">America/Chicago (CST)</SelectItem>
                      <SelectItem value="america_new_york">America/New_York (EST)</SelectItem>
                      <SelectItem value="america_los_angeles">America/Los_Angeles (PST)</SelectItem>
                      <SelectItem value="america_denver">America/Denver (MST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select defaultValue="12h">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operations Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operations Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="businessHoursStart">Business Hours Start</Label>
                  <Input id="businessHoursStart" type="time" defaultValue="06:00" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="businessHoursEnd">Business Hours End</Label>
                  <Input id="businessHoursEnd" type="time" defaultValue="22:00" className="mt-1.5" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="defaultPickupWindow">Default Pickup Window (minutes)</Label>
                  <Input id="defaultPickupWindow" type="number" defaultValue="30" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="waitTimeLimit">Wait Time Limit (minutes)</Label>
                  <Input id="waitTimeLimit" type="number" defaultValue="15" className="mt-1.5" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">24/7 Operations</p>
                  <p className="text-sm text-gray-500">Allow trip scheduling outside business hours</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">New Trip Notifications</p>
                    <p className="text-sm text-gray-500">Notify dispatchers when new trips are booked</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Driver Status Updates</p>
                    <p className="text-sm text-gray-500">Notifications when drivers go online/offline</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Trip Status Changes</p>
                    <p className="text-sm text-gray-500">Real-time updates on trip progress</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Compliance Alerts</p>
                    <p className="text-sm text-gray-500">Warnings for expiring licenses and documents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Daily Summary Emails</p>
                    <p className="text-sm text-gray-500">Send daily operations summary to admins</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMS Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Patient Pickup Reminders</p>
                    <p className="text-sm text-gray-500">Send SMS 30 minutes before pickup</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Driver En Route Alerts</p>
                    <p className="text-sm text-gray-500">Notify patients when driver is on the way</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Trip Confirmation</p>
                    <p className="text-sm text-gray-500">Send confirmation when trip is booked</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Alert variant="info">
            <Shield className="h-4 w-4" />
            <AlertTitle>Security Best Practices</AlertTitle>
            <AlertDescription>
              Enable two-factor authentication and regular password changes for all admin accounts.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Password Expiry</p>
                  <p className="text-sm text-gray-500">Force password change periodically</p>
                </div>
                <Select defaultValue="90">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Production API Key</p>
                    <p className="text-sm text-gray-500 font-mono">sk_live_...xxxx</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Reveal</Button>
                    <Button variant="secondary" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Test API Key</p>
                    <p className="text-sm text-gray-500 font-mono">sk_test_...yyyy</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Reveal</Button>
                    <Button variant="secondary" size="sm">Regenerate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Alert variant="info">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Integration Setup Required</AlertTitle>
            <AlertDescription>
              Configure your API keys in environment variables to enable integrations. Contact support for setup assistance.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>External Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Service (SendGrid)</p>
                      <p className="text-sm text-gray-500">Transactional emails and notifications</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Configured</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">SMS Service (Twilio)</p>
                      <p className="text-sm text-gray-500">SMS notifications and reminders</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Configured</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Payment Gateway (Stripe)</p>
                      <p className="text-sm text-gray-500">Payment processing</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Configured</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GPS & Fleet Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bouncie GPS Tracking</p>
                      <p className="text-sm text-gray-500">Real-time vehicle location and fleet behavior analytics</p>
                    </div>
                  </div>
                  <a href="/admin/settings/integrations/bouncie">
                    <Button variant="primary" size="sm">Configure</Button>
                  </a>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Database className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">EHR Integration</p>
                      <p className="text-sm text-gray-500">Connect to healthcare systems</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input id="invoicePrefix" defaultValue="INV-" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
                  <Input id="nextInvoiceNumber" type="number" defaultValue="1001" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentTerms">Default Payment Terms (days)</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">Net 15</SelectItem>
                    <SelectItem value="30">Net 30</SelectItem>
                    <SelectItem value="45">Net 45</SelectItem>
                    <SelectItem value="60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="invoiceNotes">Default Invoice Notes</Label>
                <Textarea
                  id="invoiceNotes"
                  className="mt-1.5"
                  defaultValue="Thank you for your business. Payment is due within the terms specified above."
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Auto-generate Invoices</p>
                  <p className="text-sm text-gray-500">Automatically create invoices after trip completion</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
