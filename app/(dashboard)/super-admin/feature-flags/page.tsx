'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Flag,
  Plus,
  Search,
  Beaker,
  Users,
  Building2,
  Globe,
  Clock,
} from 'lucide-react';

// Mock feature flags data
const mockFeatureFlags = [
  {
    id: 'FF-001',
    name: 'gps_tracking_v2',
    displayName: 'GPS Tracking v2',
    description: 'New real-time GPS tracking with improved accuracy',
    status: 'enabled',
    scope: 'global',
    enabledFor: 'all',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 'FF-002',
    name: 'new_booking_flow',
    displayName: 'New Booking Flow',
    description: 'Redesigned trip booking interface with step-by-step wizard',
    status: 'beta',
    scope: 'company',
    enabledFor: ['Delta Medical Transport', 'Metro Health Shuttle'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14',
  },
  {
    id: 'FF-003',
    name: 'ai_route_optimization',
    displayName: 'AI Route Optimization',
    description: 'Machine learning based route optimization for better efficiency',
    status: 'beta',
    scope: 'percentage',
    enabledFor: '25%',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
  },
  {
    id: 'FF-004',
    name: 'dark_mode',
    displayName: 'Dark Mode',
    description: 'Dark theme option for all user interfaces',
    status: 'disabled',
    scope: 'global',
    enabledFor: 'none',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'FF-005',
    name: 'patient_notifications',
    displayName: 'Enhanced Patient Notifications',
    description: 'Real-time SMS and push notifications for patients',
    status: 'enabled',
    scope: 'global',
    enabledFor: 'all',
    createdAt: '2023-11-15',
    updatedAt: '2024-01-10',
  },
  {
    id: 'FF-006',
    name: 'multi_language',
    displayName: 'Multi-Language Support',
    description: 'Support for Spanish and French languages',
    status: 'beta',
    scope: 'company',
    enabledFor: ['City Care Transport'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-13',
  },
];

export default function SuperAdminFeatureFlagsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      enabled: 'bg-green-100 text-green-800',
      disabled: 'bg-gray-100 text-gray-800',
      beta: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScopeIcon = (scope: string) => {
    if (scope === 'global') return <Globe className="h-4 w-4 text-blue-500" />;
    if (scope === 'company') return <Building2 className="h-4 w-4 text-green-500" />;
    if (scope === 'percentage') return <Users className="h-4 w-4 text-purple-500" />;
    return <Flag className="h-4 w-4" />;
  };

  const filteredFlags = mockFeatureFlags.filter(flag => {
    const matchesSearch =
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || flag.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockFeatureFlags.length,
    enabled: mockFeatureFlags.filter(f => f.status === 'enabled').length,
    beta: mockFeatureFlags.filter(f => f.status === 'beta').length,
    disabled: mockFeatureFlags.filter(f => f.status === 'disabled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Flags</h1>
          <p className="text-gray-600">Control feature rollouts and experiments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Flag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
              <DialogDescription>
                Create a new feature flag to control feature rollout
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Flag Key</Label>
                <Input placeholder="e.g., new_dashboard" />
              </div>
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input placeholder="e.g., New Dashboard" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="What does this feature do?" />
              </div>
              <div className="space-y-2">
                <Label>Scope</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (All Users)</SelectItem>
                    <SelectItem value="company">By Company</SelectItem>
                    <SelectItem value="percentage">Percentage Rollout</SelectItem>
                    <SelectItem value="user">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>Create Flag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Flags</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Flag className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enabled</p>
                <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
              </div>
              <Flag className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Beta</p>
                <p className="text-2xl font-bold text-purple-600">{stats.beta}</p>
              </div>
              <Beaker className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disabled</p>
                <p className="text-2xl font-bold text-gray-600">{stats.disabled}</p>
              </div>
              <Flag className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search flags..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="beta">Beta</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feature Flags List */}
      <div className="space-y-4">
        {filteredFlags.map((flag) => (
          <Card key={flag.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Flag className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{flag.displayName}</h3>
                      <Badge className={getStatusColor(flag.status)}>
                        {flag.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 font-mono">{flag.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        {getScopeIcon(flag.scope)}
                        {flag.scope === 'global' && 'Global'}
                        {flag.scope === 'company' && `${Array.isArray(flag.enabledFor) ? flag.enabledFor.length : 0} companies`}
                        {flag.scope === 'percentage' && flag.enabledFor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {flag.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Switch checked={flag.status === 'enabled'} />
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
