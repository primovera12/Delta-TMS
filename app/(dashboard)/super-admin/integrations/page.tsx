'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  Plug,
  CheckCircle,
  XCircle,
  Settings,
  ExternalLink,
  Key,
  RefreshCw,
} from 'lucide-react';

// Mock integrations data
const mockIntegrations = [
  {
    id: 'INT-001',
    name: 'Google Maps',
    category: 'mapping',
    description: 'Geocoding, routing, and distance calculation',
    status: 'connected',
    lastSync: '2024-01-15 10:30 AM',
    apiCalls: 45678,
    icon: '🗺️',
  },
  {
    id: 'INT-002',
    name: 'Twilio',
    category: 'communication',
    description: 'SMS notifications and voice calls',
    status: 'connected',
    lastSync: '2024-01-15 10:28 AM',
    apiCalls: 12456,
    icon: '📱',
  },
  {
    id: 'INT-003',
    name: 'SendGrid',
    category: 'communication',
    description: 'Transactional and marketing emails',
    status: 'connected',
    lastSync: '2024-01-15 10:25 AM',
    apiCalls: 8945,
    icon: '📧',
  },
  {
    id: 'INT-004',
    name: 'Stripe',
    category: 'payment',
    description: 'Payment processing and subscriptions',
    status: 'connected',
    lastSync: '2024-01-15 10:20 AM',
    apiCalls: 2345,
    icon: '💳',
  },
  {
    id: 'INT-005',
    name: 'QuickBooks',
    category: 'accounting',
    description: 'Invoice sync and financial reporting',
    status: 'error',
    lastSync: '2024-01-14 4:30 PM',
    apiCalls: 567,
    icon: '📊',
    error: 'Authentication expired',
  },
  {
    id: 'INT-006',
    name: 'Bouncie GPS',
    category: 'tracking',
    description: 'Real-time vehicle GPS tracking',
    status: 'connected',
    lastSync: '2024-01-15 10:30 AM',
    apiCalls: 156789,
    icon: '📍',
  },
  {
    id: 'INT-007',
    name: 'Salesforce',
    category: 'crm',
    description: 'Customer relationship management',
    status: 'disconnected',
    lastSync: null,
    apiCalls: 0,
    icon: '☁️',
  },
];

const availableIntegrations = [
  { name: 'Zapier', description: 'Connect with 5000+ apps', icon: '⚡' },
  { name: 'Slack', description: 'Team notifications', icon: '💬' },
  { name: 'Microsoft Teams', description: 'Team collaboration', icon: '👥' },
  { name: 'HubSpot', description: 'Marketing automation', icon: '🎯' },
];

export default function SuperAdminIntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      connected: 'bg-green-100 text-green-800',
      disconnected: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'connected') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    return <XCircle className="h-4 w-4 text-gray-400" />;
  };

  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: mockIntegrations.length,
    connected: mockIntegrations.filter(i => i.status === 'connected').length,
    errors: mockIntegrations.filter(i => i.status === 'error').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations Hub</h1>
          <p className="text-gray-600">Manage third-party service connections</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Plug className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">{stats.connected}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Calls (Today)</p>
                <p className="text-2xl font-bold">226K</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connected">
        <TabsList>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Integrations List */}
          <div className="grid grid-cols-2 gap-4">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {integration.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                        {integration.error && (
                          <p className="text-sm text-red-600 mt-1">{integration.error}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          {integration.lastSync && (
                            <span>Last sync: {integration.lastSync}</span>
                          )}
                          {integration.apiCalls > 0 && (
                            <span>{integration.apiCalls.toLocaleString()} API calls</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Switch checked={integration.status === 'connected'} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {availableIntegrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">API Keys</CardTitle>
                <Button size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-gray-500 font-mono">pk_live_••••••••••••••••</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                    <Button variant="outline" size="sm">Reveal</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Test API Key</p>
                    <p className="text-sm text-gray-500 font-mono">pk_test_••••••••••••••••</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Test</Badge>
                    <Button variant="outline" size="sm">Reveal</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Webhook Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Trip Status Updates</p>
                      <p className="text-xs text-gray-500">https://api.example.com/webhooks/trips</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Driver Events</p>
                      <p className="text-xs text-gray-500">https://api.example.com/webhooks/drivers</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook Endpoint
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
