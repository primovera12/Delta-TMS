'use client';

import * as React from 'react';
import {
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Key,
  Globe,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Truck,
  FileText,
  Calendar,
  Cloud,
  Database,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  enabled: boolean;
  lastSync?: string;
  config?: Record<string, string>;
  docUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  // GPS & Fleet Tracking
  {
    id: 'bouncie',
    name: 'Bouncie GPS',
    description: 'Real-time GPS tracking for fleet vehicles',
    category: 'fleet',
    icon: MapPin,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://www.bouncie.com/api',
  },
  {
    id: 'samsara',
    name: 'Samsara',
    description: 'Fleet management and telematics platform',
    category: 'fleet',
    icon: Truck,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developers.samsara.com/',
  },
  {
    id: 'geotab',
    name: 'Geotab',
    description: 'Vehicle tracking and fleet management',
    category: 'fleet',
    icon: MapPin,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developers.geotab.com/',
  },
  // Payments
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and billing',
    category: 'payments',
    icon: CreditCard,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://stripe.com/docs',
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Payment processing and POS',
    category: 'payments',
    icon: CreditCard,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developer.squareup.com/',
  },
  // Communication
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS and voice notifications',
    category: 'communication',
    icon: Phone,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://www.twilio.com/docs',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery and notifications',
    category: 'communication',
    icon: Mail,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://docs.sendgrid.com/',
  },
  {
    id: 'mailgun',
    name: 'Mailgun',
    description: 'Email API for transactional emails',
    category: 'communication',
    icon: Mail,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://documentation.mailgun.com/',
  },
  // Mapping
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Maps, routing, and geocoding',
    category: 'mapping',
    icon: Globe,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developers.google.com/maps',
  },
  {
    id: 'mapbox',
    name: 'Mapbox',
    description: 'Custom maps and navigation',
    category: 'mapping',
    icon: Globe,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://docs.mapbox.com/',
  },
  // Accounting
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Accounting and invoicing',
    category: 'accounting',
    icon: FileText,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developer.intuit.com/',
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Cloud accounting platform',
    category: 'accounting',
    icon: FileText,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developer.xero.com/',
  },
  // Calendar
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Calendar sync for scheduling',
    category: 'calendar',
    icon: Calendar,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developers.google.com/calendar',
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    description: 'Microsoft 365 calendar integration',
    category: 'calendar',
    icon: Calendar,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://docs.microsoft.com/en-us/graph/',
  },
  // Healthcare
  {
    id: 'ehr-epic',
    name: 'Epic EHR',
    description: 'Electronic health records integration',
    category: 'healthcare',
    icon: Shield,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://open.epic.com/',
  },
  {
    id: 'ehr-cerner',
    name: 'Cerner EHR',
    description: 'Cerner health records integration',
    category: 'healthcare',
    icon: Shield,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://developer.cerner.com/',
  },
  // Storage
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Cloud storage for documents',
    category: 'storage',
    icon: Cloud,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://docs.aws.amazon.com/s3/',
  },
  {
    id: 'google-cloud-storage',
    name: 'Google Cloud Storage',
    description: 'Cloud storage for files and documents',
    category: 'storage',
    icon: Cloud,
    status: 'disconnected',
    enabled: false,
    docUrl: 'https://cloud.google.com/storage/docs',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Integrations', icon: Settings },
  { id: 'fleet', name: 'Fleet & GPS', icon: Truck },
  { id: 'payments', name: 'Payments', icon: CreditCard },
  { id: 'communication', name: 'Communication', icon: Phone },
  { id: 'mapping', name: 'Mapping', icon: Globe },
  { id: 'accounting', name: 'Accounting', icon: FileText },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'healthcare', name: 'Healthcare', icon: Shield },
  { id: 'storage', name: 'Storage', icon: Cloud },
];

const CONFIG_FIELDS: Record<string, { label: string; type: string; placeholder: string }[]> = {
  bouncie: [
    { label: 'API Key', type: 'password', placeholder: 'Enter your Bouncie API key' },
    { label: 'Account ID', type: 'text', placeholder: 'Enter your Account ID' },
  ],
  samsara: [
    { label: 'API Token', type: 'password', placeholder: 'Enter your Samsara API token' },
    { label: 'Organization ID', type: 'text', placeholder: 'Enter your Organization ID' },
  ],
  geotab: [
    { label: 'Database', type: 'text', placeholder: 'Enter your Geotab database' },
    { label: 'Username', type: 'text', placeholder: 'Enter your username' },
    { label: 'Password', type: 'password', placeholder: 'Enter your password' },
  ],
  stripe: [
    { label: 'Publishable Key', type: 'text', placeholder: 'pk_live_...' },
    { label: 'Secret Key', type: 'password', placeholder: 'sk_live_...' },
    { label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...' },
  ],
  square: [
    { label: 'Access Token', type: 'password', placeholder: 'Enter your Square access token' },
    { label: 'Location ID', type: 'text', placeholder: 'Enter your Location ID' },
  ],
  twilio: [
    { label: 'Account SID', type: 'text', placeholder: 'ACxxxxxxxxxxxxxxxx' },
    { label: 'Auth Token', type: 'password', placeholder: 'Enter your Auth Token' },
    { label: 'Phone Number', type: 'text', placeholder: '+1234567890' },
  ],
  sendgrid: [
    { label: 'API Key', type: 'password', placeholder: 'SG.xxxxxxxx' },
    { label: 'From Email', type: 'email', placeholder: 'noreply@yourdomain.com' },
    { label: 'From Name', type: 'text', placeholder: 'Delta TMS' },
  ],
  mailgun: [
    { label: 'API Key', type: 'password', placeholder: 'key-xxxxxxxx' },
    { label: 'Domain', type: 'text', placeholder: 'mg.yourdomain.com' },
    { label: 'From Email', type: 'email', placeholder: 'noreply@yourdomain.com' },
  ],
  'google-maps': [
    { label: 'API Key', type: 'password', placeholder: 'AIzaSyxxxxxxxx' },
  ],
  mapbox: [
    { label: 'Access Token', type: 'password', placeholder: 'pk.xxxxxxxx' },
  ],
  quickbooks: [
    { label: 'Client ID', type: 'text', placeholder: 'Enter your QuickBooks Client ID' },
    { label: 'Client Secret', type: 'password', placeholder: 'Enter your Client Secret' },
    { label: 'Realm ID', type: 'text', placeholder: 'Enter your Realm ID' },
  ],
  xero: [
    { label: 'Client ID', type: 'text', placeholder: 'Enter your Xero Client ID' },
    { label: 'Client Secret', type: 'password', placeholder: 'Enter your Client Secret' },
  ],
  'google-calendar': [
    { label: 'Client ID', type: 'text', placeholder: 'Enter Google OAuth Client ID' },
    { label: 'Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
  ],
  outlook: [
    { label: 'Client ID', type: 'text', placeholder: 'Enter Microsoft App Client ID' },
    { label: 'Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
    { label: 'Tenant ID', type: 'text', placeholder: 'Enter Tenant ID' },
  ],
  'ehr-epic': [
    { label: 'Client ID', type: 'text', placeholder: 'Enter Epic Client ID' },
    { label: 'Base URL', type: 'text', placeholder: 'https://fhir.epic.com/' },
  ],
  'ehr-cerner': [
    { label: 'Client ID', type: 'text', placeholder: 'Enter Cerner Client ID' },
    { label: 'Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
  ],
  'aws-s3': [
    { label: 'Access Key ID', type: 'text', placeholder: 'AKIAXXXXXXXX' },
    { label: 'Secret Access Key', type: 'password', placeholder: 'Enter Secret Access Key' },
    { label: 'Bucket Name', type: 'text', placeholder: 'your-bucket-name' },
    { label: 'Region', type: 'text', placeholder: 'us-east-1' },
  ],
  'google-cloud-storage': [
    { label: 'Project ID', type: 'text', placeholder: 'your-project-id' },
    { label: 'Bucket Name', type: 'text', placeholder: 'your-bucket-name' },
    { label: 'Service Account JSON', type: 'password', placeholder: 'Paste service account JSON' },
  ],
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = React.useState<Integration[]>(INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);
  const [selectedIntegration, setSelectedIntegration] = React.useState<Integration | null>(null);
  const [configValues, setConfigValues] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null);

  const filteredIntegrations = React.useMemo(() => {
    if (selectedCategory === 'all') return integrations;
    return integrations.filter((i) => i.category === selectedCategory);
  }, [integrations, selectedCategory]);

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;
  const enabledCount = integrations.filter((i) => i.enabled).length;

  const openConfigDialog = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigValues(integration.config || {});
    setTestResult(null);
    setConfigDialogOpen(true);
  };

  const handleToggleEnabled = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId ? { ...i, enabled: !i.enabled } : i
      )
    );
  };

  const handleSaveConfig = async () => {
    if (!selectedIntegration) return;

    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === selectedIntegration.id
          ? {
              ...i,
              config: configValues,
              status: 'connected' as const,
              enabled: true,
              lastSync: new Date().toISOString(),
            }
          : i
      )
    );

    setSaving(false);
    setConfigDialogOpen(false);
  };

  const handleTestConnection = async () => {
    if (!selectedIntegration) return;

    setSaving(true);
    setTestResult(null);

    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if all required fields are filled
    const fields = CONFIG_FIELDS[selectedIntegration.id] || [];
    const allFilled = fields.every((f) => configValues[f.label]?.trim());

    if (allFilled) {
      setTestResult({ success: true, message: 'Connection successful!' });
    } else {
      setTestResult({ success: false, message: 'Please fill in all required fields' });
    }

    setSaving(false);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId
          ? { ...i, status: 'disconnected' as const, enabled: false, config: undefined, lastSync: undefined }
          : i
      )
    );
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" /> Connected
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="error" className="gap-1">
            <XCircle className="h-3 w-3" /> Error
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="h-3 w-3" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" /> Not Connected
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500">
            Connect Delta TMS with your favorite tools and services
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{connectedCount}</p>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{enabledCount}</p>
                <p className="text-sm text-gray-500">Enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Database className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{INTEGRATIONS.length}</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <Icon className="h-4 w-4 mr-1" />
              {cat.name}
            </Button>
          );
        })}
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggleEnabled(integration.id)}
                    disabled={integration.status !== 'connected'}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{integration.description}</CardDescription>
                {integration.lastSync && (
                  <p className="text-xs text-gray-400 mb-3">
                    Last synced: {new Date(integration.lastSync).toLocaleString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => openConfigDialog(integration)}
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  {integration.docUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a href={integration.docUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect this integration.
            </DialogDescription>
          </DialogHeader>

          {selectedIntegration && (
            <div className="space-y-4">
              {(CONFIG_FIELDS[selectedIntegration.id] || []).map((field) => (
                <div key={field.label}>
                  <Label>{field.label}</Label>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={configValues[field.label] || ''}
                    onChange={(e) =>
                      setConfigValues((prev) => ({ ...prev, [field.label]: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
              ))}

              {testResult && (
                <Alert variant={testResult.success ? 'default' : 'error'}>
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}

              {selectedIntegration.status === 'connected' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDisconnect(selectedIntegration.id);
                    setConfigDialogOpen(false);
                  }}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect Integration
                </Button>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="secondary" onClick={handleTestConnection} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button onClick={handleSaveConfig} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Save & Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
