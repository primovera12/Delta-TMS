'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Download,
  Clock,
  User,
  Shield,
  FileText,
  Settings,
  Eye,
} from 'lucide-react';

// Mock audit log data
const mockAuditLogs = [
  {
    id: 'AUD-001',
    timestamp: '2024-01-15 10:30:45',
    user: 'John Smith',
    userId: 'USR-001',
    company: 'Delta Medical Transport',
    action: 'user.login',
    resource: 'Authentication',
    details: 'Successful login from 192.168.1.100',
    ip: '192.168.1.100',
    severity: 'info',
  },
  {
    id: 'AUD-002',
    timestamp: '2024-01-15 10:28:12',
    user: 'Sarah Johnson',
    userId: 'USR-002',
    company: 'Metro Health Shuttle',
    action: 'trip.create',
    resource: 'Trip TRP-1234',
    details: 'Created new trip for patient John Doe',
    ip: '192.168.2.50',
    severity: 'info',
  },
  {
    id: 'AUD-003',
    timestamp: '2024-01-15 10:25:00',
    user: 'System',
    userId: 'SYSTEM',
    company: 'System',
    action: 'backup.complete',
    resource: 'Database',
    details: 'Daily backup completed successfully',
    ip: 'localhost',
    severity: 'info',
  },
  {
    id: 'AUD-004',
    timestamp: '2024-01-15 10:20:33',
    user: 'Admin User',
    userId: 'USR-ADMIN',
    company: 'System',
    action: 'user.role.update',
    resource: 'User USR-003',
    details: 'Changed role from Dispatcher to Admin',
    ip: '10.0.0.15',
    severity: 'warning',
  },
  {
    id: 'AUD-005',
    timestamp: '2024-01-15 10:15:22',
    user: 'Unknown',
    userId: null,
    company: null,
    action: 'auth.failed',
    resource: 'Authentication',
    details: 'Failed login attempt for user@example.com',
    ip: '203.0.113.50',
    severity: 'error',
  },
  {
    id: 'AUD-006',
    timestamp: '2024-01-15 10:10:00',
    user: 'Michael Brown',
    userId: 'USR-005',
    company: 'Delta Medical Transport',
    action: 'patient.update',
    resource: 'Patient PAT-456',
    details: 'Updated patient contact information',
    ip: '192.168.1.105',
    severity: 'info',
  },
  {
    id: 'AUD-007',
    timestamp: '2024-01-15 10:05:15',
    user: 'Admin User',
    userId: 'USR-ADMIN',
    company: 'System',
    action: 'config.update',
    resource: 'System Config',
    details: 'Updated email SMTP settings',
    ip: '10.0.0.15',
    severity: 'warning',
  },
];

export default function SuperAdminAuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action: string) => {
    if (action.startsWith('user') || action.startsWith('auth')) return <User className="h-4 w-4" />;
    if (action.startsWith('config')) return <Settings className="h-4 w-4" />;
    if (action.includes('role')) return <Shield className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action.startsWith(filterAction);
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesAction && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Track all system activities and changes</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events (Today)</p>
                <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User Actions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockAuditLogs.filter(l => l.action.startsWith('user')).length}
                </p>
              </div>
              <User className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockAuditLogs.filter(l => l.severity === 'warning').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockAuditLogs.filter(l => l.severity === 'error').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="user">User Actions</SelectItem>
            <SelectItem value="auth">Authentication</SelectItem>
            <SelectItem value="trip">Trip Actions</SelectItem>
            <SelectItem value="config">Configuration</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{log.user}</p>
                      {log.company && log.company !== 'System' && (
                        <p className="text-xs text-gray-500">{log.company}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="font-mono text-sm">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {log.details}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
