'use client';

import * as React from 'react';
import {
  History,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Settings,
  Car,
  CreditCard,
  Building2,
  Users,
  Download,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

interface AuditLog {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view' | 'export';
  category: 'user' | 'trip' | 'patient' | 'driver' | 'billing' | 'settings' | 'system';
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  details?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  };
  ipAddress: string;
  userAgent: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T14:32:15Z',
    action: 'create',
    category: 'trip',
    description: 'Created new trip TRP-2024-0156 for patient Robert Johnson',
    user: { id: 'u1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Dispatcher' },
    details: {
      after: { tripId: 'TRP-2024-0156', patientId: 'P001', status: 'scheduled' },
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  },
  {
    id: '2',
    timestamp: '2024-01-15T14:28:00Z',
    action: 'update',
    category: 'driver',
    description: 'Updated driver Mike Thompson availability schedule',
    user: { id: 'u2', name: 'Admin User', email: 'admin@example.com', role: 'Administrator' },
    details: {
      before: { availability: 'weekdays' },
      after: { availability: 'full-time' },
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.0',
  },
  {
    id: '3',
    timestamp: '2024-01-15T14:15:22Z',
    action: 'login',
    category: 'user',
    description: 'User logged in successfully',
    user: { id: 'u3', name: 'John Smith', email: 'john@example.com', role: 'Driver' },
    ipAddress: '10.0.0.55',
    userAgent: 'Delta TMS Driver App/2.1.0 (iOS 17.0)',
  },
  {
    id: '4',
    timestamp: '2024-01-15T14:10:45Z',
    action: 'export',
    category: 'billing',
    description: 'Exported billing report for December 2023',
    user: { id: 'u4', name: 'Finance Team', email: 'finance@example.com', role: 'Finance' },
    details: {
      metadata: { reportType: 'monthly', period: '2023-12', format: 'xlsx' },
    },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/120.0',
  },
  {
    id: '5',
    timestamp: '2024-01-15T13:55:30Z',
    action: 'delete',
    category: 'patient',
    description: 'Removed emergency contact from patient Mary Williams',
    user: { id: 'u2', name: 'Admin User', email: 'admin@example.com', role: 'Administrator' },
    details: {
      before: { contactName: 'James Williams', relationship: 'Spouse' },
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.0',
  },
  {
    id: '6',
    timestamp: '2024-01-15T13:45:00Z',
    action: 'update',
    category: 'settings',
    description: 'Modified system notification settings',
    user: { id: 'u2', name: 'Admin User', email: 'admin@example.com', role: 'Administrator' },
    details: {
      before: { emailNotifications: false },
      after: { emailNotifications: true, smsNotifications: true },
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.0',
  },
  {
    id: '7',
    timestamp: '2024-01-15T13:30:15Z',
    action: 'view',
    category: 'patient',
    description: 'Viewed patient records for Thomas Anderson',
    user: { id: 'u1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Dispatcher' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  },
  {
    id: '8',
    timestamp: '2024-01-15T13:20:00Z',
    action: 'logout',
    category: 'user',
    description: 'User logged out',
    user: { id: 'u5', name: 'Lisa Davis', email: 'lisa@example.com', role: 'Facility Admin' },
    ipAddress: '172.16.0.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
  },
];

export default function AdminAuditLogPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('today');
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [showDetailDialog, setShowDetailDialog] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesAction && matchesCategory;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-success-100 text-success-700">Create</Badge>;
      case 'update':
        return <Badge className="bg-info-100 text-info-700">Update</Badge>;
      case 'delete':
        return <Badge variant="destructive">Delete</Badge>;
      case 'login':
        return <Badge className="bg-primary-100 text-primary-700">Login</Badge>;
      case 'logout':
        return <Badge variant="secondary">Logout</Badge>;
      case 'view':
        return <Badge variant="outline">View</Badge>;
      case 'export':
        return <Badge className="bg-purple-100 text-purple-700">Export</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'trip':
        return <Car className="h-4 w-4" />;
      case 'patient':
        return <Users className="h-4 w-4" />;
      case 'driver':
        return <Users className="h-4 w-4" />;
      case 'billing':
        return <CreditCard className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      case 'system':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  const handleExport = () => {
    console.log('Exporting audit logs...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Log</h1>
          <p className="text-sm text-gray-500">Track all system activities and changes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setLogs([...mockAuditLogs])}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            <p className="text-sm text-gray-500">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success-600">
              {logs.filter((l) => l.action === 'create').length}
            </p>
            <p className="text-sm text-gray-500">Creates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-info-600">
              {logs.filter((l) => l.action === 'update').length}
            </p>
            <p className="text-sm text-gray-500">Updates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-error-600">
              {logs.filter((l) => l.action === 'delete').length}
            </p>
            <p className="text-sm text-gray-500">Deletes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="trip">Trip</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Timestamp</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Action</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">User</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => {
                  const { date, time } = formatTimestamp(log.timestamp);
                  return (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{date}</p>
                          <p className="text-gray-500">{time}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getActionBadge(log.action)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{getCategoryIcon(log.category)}</span>
                          <span className="capitalize text-gray-700">{log.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 max-w-md truncate">{log.description}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{log.user.name}</p>
                          <p className="text-xs text-gray-500">{log.user.role}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No audit logs found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Full details of this audit event
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Timestamp</p>
                  <p className="font-medium">
                    {formatTimestamp(selectedLog.timestamp).date} at{' '}
                    {formatTimestamp(selectedLog.timestamp).time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Action</p>
                  <p className="mt-1">{getActionBadge(selectedLog.action)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium capitalize">{selectedLog.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium">{selectedLog.user.name}</p>
                  <p className="text-xs text-gray-500">{selectedLog.user.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-900">{selectedLog.description}</p>
              </div>

              {selectedLog.details && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Change Details</p>
                  {selectedLog.details.before && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">Before:</p>
                      <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(selectedLog.details.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.details.after && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">After:</p>
                      <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(selectedLog.details.after, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.details.metadata && (
                    <div>
                      <p className="text-xs text-gray-500">Metadata:</p>
                      <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(selectedLog.details.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Technical Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">IP Address</p>
                    <p className="font-mono">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">User Agent</p>
                    <p className="text-xs truncate">{selectedLog.userAgent}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
