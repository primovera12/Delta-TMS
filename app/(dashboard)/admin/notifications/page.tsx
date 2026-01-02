'use client';

import * as React from 'react';
import {
  Bell,
  BellOff,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Send,
  Users,
  Car,
  Building2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

const mockAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Driver License Expired',
    message: 'Driver Mike Thompson\'s license expired on Jan 10, 2024. Vehicle #12 has been taken out of service.',
    timestamp: '2024-01-15T14:30:00Z',
    source: 'Compliance System',
    acknowledged: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Trip Volume Today',
    message: '47 trips scheduled for today with only 12 available drivers. Consider calling in additional drivers.',
    timestamp: '2024-01-15T06:00:00Z',
    source: 'Scheduling System',
    acknowledged: true,
    acknowledgedBy: 'Sarah Johnson',
    acknowledgedAt: '2024-01-15T06:15:00Z',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Vehicle Maintenance Due',
    message: 'Vehicle #8 (Wheelchair Van) is due for scheduled maintenance. 500 miles remaining.',
    timestamp: '2024-01-15T08:00:00Z',
    source: 'Fleet Management',
    acknowledged: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'New Contract Pending',
    message: 'TransportLink Brokers contract awaiting approval. Review required within 48 hours.',
    timestamp: '2024-01-14T16:00:00Z',
    source: 'Contract Management',
    acknowledged: true,
    acknowledgedBy: 'Admin User',
    acknowledgedAt: '2024-01-14T17:30:00Z',
  },
  {
    id: '5',
    type: 'success',
    title: 'Weekly Billing Complete',
    message: 'Successfully processed 342 trip invoices totaling $28,450. All claims submitted.',
    timestamp: '2024-01-14T23:00:00Z',
    source: 'Billing System',
    acknowledged: true,
    acknowledgedBy: 'System',
    acknowledgedAt: '2024-01-14T23:00:00Z',
  },
  {
    id: '6',
    type: 'critical',
    title: 'Insurance Verification Failed',
    message: '3 patients have failed insurance verification. Trips scheduled for tomorrow may need to be cancelled.',
    timestamp: '2024-01-15T10:00:00Z',
    source: 'Insurance Verification',
    acknowledged: false,
  },
  {
    id: '7',
    type: 'info',
    title: 'System Update Scheduled',
    message: 'System maintenance scheduled for Sunday 2:00 AM - 4:00 AM. Brief downtime expected.',
    timestamp: '2024-01-13T12:00:00Z',
    source: 'IT Operations',
    acknowledged: true,
    acknowledgedBy: 'Admin User',
    acknowledgedAt: '2024-01-13T14:00:00Z',
  },
];

export default function AdminNotificationsPage() {
  const [alerts, setAlerts] = React.useState<SystemAlert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showBroadcastDialog, setShowBroadcastDialog] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [broadcastMessage, setBroadcastMessage] = React.useState('');
  const [broadcastRecipients, setBroadcastRecipients] = React.useState<string[]>([]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'acknowledged' && alert.acknowledged) ||
      (statusFilter === 'unacknowledged' && !alert.acknowledged);
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    critical: alerts.filter((a) => a.type === 'critical' && !a.acknowledged).length,
    warning: alerts.filter((a) => a.type === 'warning' && !a.acknowledged).length,
    unacknowledged: alerts.filter((a) => !a.acknowledged).length,
    total: alerts.length,
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              acknowledged: true,
              acknowledgedBy: 'Admin User',
              acknowledgedAt: new Date().toISOString(),
            }
          : alert
      )
    );
  };

  const handleAcknowledgeAll = () => {
    setAlerts(
      alerts.map((alert) => ({
        ...alert,
        acknowledged: true,
        acknowledgedBy: alert.acknowledged ? alert.acknowledgedBy : 'Admin User',
        acknowledgedAt: alert.acknowledged ? alert.acknowledgedAt : new Date().toISOString(),
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const handleBroadcast = () => {
    console.log('Broadcasting message to:', broadcastRecipients, broadcastMessage);
    setShowBroadcastDialog(false);
    setBroadcastMessage('');
    setBroadcastRecipients([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-error-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-info-600" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-warning-100 text-warning-700">Warning</Badge>;
      case 'info':
        return <Badge className="bg-info-100 text-info-700">Info</Badge>;
      case 'success':
        return <Badge className="bg-success-100 text-success-700">Success</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications & Alerts</h1>
          <p className="text-sm text-gray-500">System alerts and notification management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setShowBroadcastDialog(true)}>
            <Send className="h-4 w-4 mr-2" />
            Broadcast
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className={stats.critical > 0 ? 'border-error-300 bg-error-50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${stats.critical > 0 ? 'bg-error-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <XCircle className={`h-5 w-5 ${stats.critical > 0 ? 'text-error-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stats.critical > 0 ? 'text-error-600' : 'text-gray-900'}`}>
                  {stats.critical}
                </p>
                <p className="text-sm text-gray-500">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.warning > 0 ? 'border-warning-300 bg-warning-50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${stats.warning > 0 ? 'bg-warning-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <AlertTriangle className={`h-5 w-5 ${stats.warning > 0 ? 'text-warning-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stats.warning > 0 ? 'text-warning-600' : 'text-gray-900'}`}>
                  {stats.warning}
                </p>
                <p className="text-sm text-gray-500">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.unacknowledged}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {stats.unacknowledged > 0 && (
              <Button variant="outline" onClick={handleAcknowledgeAll}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Acknowledge All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BellOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No alerts</h3>
              <p className="text-gray-500">All clear! No alerts match your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`transition-colors ${
                !alert.acknowledged
                  ? alert.type === 'critical'
                    ? 'border-error-300 bg-error-50/50'
                    : alert.type === 'warning'
                    ? 'border-warning-300 bg-warning-50/50'
                    : 'border-primary-200 bg-primary-50/30'
                  : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.type === 'critical' ? 'bg-error-100' :
                    alert.type === 'warning' ? 'bg-warning-100' :
                    alert.type === 'info' ? 'bg-info-100' :
                    'bg-success-100'
                  }`}>
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{alert.title}</h3>
                          {getTypeBadge(alert.type)}
                          {!alert.acknowledged && (
                            <span className="h-2 w-2 rounded-full bg-primary-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(alert.timestamp)}
                          </span>
                          <span>{alert.source}</span>
                          {alert.acknowledged && alert.acknowledgedBy && (
                            <span className="text-success-600">
                              Acknowledged by {alert.acknowledgedBy}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!alert.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(alert.id)}
                          className="text-gray-400 hover:text-error-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Broadcast Dialog */}
      <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Broadcast Message</DialogTitle>
            <DialogDescription>
              Send a notification to selected user groups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'drivers', label: 'All Drivers', icon: Car },
                  { id: 'dispatchers', label: 'Dispatchers', icon: Users },
                  { id: 'facilities', label: 'Facilities', icon: Building2 },
                  { id: 'patients', label: 'Patients', icon: Users },
                ].map((recipient) => {
                  const Icon = recipient.icon;
                  const isSelected = broadcastRecipients.includes(recipient.id);
                  return (
                    <div
                      key={recipient.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'border-primary-500 bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setBroadcastRecipients(broadcastRecipients.filter((r) => r !== recipient.id));
                        } else {
                          setBroadcastRecipients([...broadcastRecipients, recipient.id]);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${isSelected ? 'text-primary-900 font-medium' : 'text-gray-700'}`}>
                          {recipient.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Enter your broadcast message..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBroadcastDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBroadcast} disabled={!broadcastMessage || broadcastRecipients.length === 0}>
              <Send className="h-4 w-4 mr-2" />
              Send Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Configure how you receive system alerts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Critical Alerts</p>
                <p className="text-sm text-gray-500">Receive critical system alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Warning Alerts</p>
                <p className="text-sm text-gray-500">Receive warning notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Get alerts via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Get critical alerts via SMS</p>
              </div>
              <Switch />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettingsDialog(false)}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
