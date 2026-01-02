'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Download,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock timesheet data
const mockTimesheets = [
  {
    id: 'TS-001',
    driver: 'Michael Johnson',
    driverId: 'DRV-001',
    weekEnding: '2024-01-21',
    regularHours: 40,
    overtimeHours: 5,
    totalHours: 45,
    tripsCompleted: 28,
    status: 'pending',
    submittedAt: '2024-01-21 6:00 PM',
  },
  {
    id: 'TS-002',
    driver: 'Sarah Kim',
    driverId: 'DRV-002',
    weekEnding: '2024-01-21',
    regularHours: 38,
    overtimeHours: 0,
    totalHours: 38,
    tripsCompleted: 24,
    status: 'approved',
    submittedAt: '2024-01-21 5:30 PM',
    approvedBy: 'John Manager',
    approvedAt: '2024-01-22 9:00 AM',
  },
  {
    id: 'TS-003',
    driver: 'David Lee',
    driverId: 'DRV-003',
    weekEnding: '2024-01-21',
    regularHours: 40,
    overtimeHours: 8,
    totalHours: 48,
    tripsCompleted: 32,
    status: 'pending',
    submittedAt: '2024-01-21 7:00 PM',
  },
  {
    id: 'TS-004',
    driver: 'Lisa Martinez',
    driverId: 'DRV-004',
    weekEnding: '2024-01-21',
    regularHours: 32,
    overtimeHours: 0,
    totalHours: 32,
    tripsCompleted: 18,
    status: 'rejected',
    submittedAt: '2024-01-21 4:00 PM',
    rejectedReason: 'Missing clock-out records for Monday',
  },
  {
    id: 'TS-005',
    driver: 'James Wilson',
    driverId: 'DRV-005',
    weekEnding: '2024-01-21',
    regularHours: 40,
    overtimeHours: 2,
    totalHours: 42,
    tripsCompleted: 26,
    status: 'approved',
    submittedAt: '2024-01-21 5:00 PM',
    approvedBy: 'John Manager',
    approvedAt: '2024-01-22 9:15 AM',
  },
  {
    id: 'TS-006',
    driver: 'Emily Chen',
    driverId: 'DRV-006',
    weekEnding: '2024-01-21',
    regularHours: 40,
    overtimeHours: 0,
    totalHours: 40,
    tripsCompleted: 25,
    status: 'pending',
    submittedAt: '2024-01-21 6:30 PM',
  },
];

export default function OperationsTimesheetsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [weekEnding, setWeekEnding] = useState('2024-01-21');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredTimesheets = mockTimesheets.filter(ts => {
    const matchesSearch = ts.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ts.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockTimesheets.length,
    pending: mockTimesheets.filter(t => t.status === 'pending').length,
    approved: mockTimesheets.filter(t => t.status === 'approved').length,
    rejected: mockTimesheets.filter(t => t.status === 'rejected').length,
    totalHours: mockTimesheets.reduce((sum, t) => sum + t.totalHours, 0),
    totalOvertime: mockTimesheets.reduce((sum, t) => sum + t.overtimeHours, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-600">Review and approve driver timesheets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Payroll
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Week Ending: January 21, 2024</span>
              </div>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline">
              Current Week
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Submitted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Overtime Hours</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalOvertime}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search drivers..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timesheets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead className="text-center">Regular Hours</TableHead>
                <TableHead className="text-center">Overtime</TableHead>
                <TableHead className="text-center">Total Hours</TableHead>
                <TableHead className="text-center">Trips</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimesheets.map((timesheet) => (
                <TableRow
                  key={timesheet.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/operations/timesheets/${timesheet.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{timesheet.driver}</p>
                      <p className="text-sm text-gray-500">{timesheet.driverId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {timesheet.regularHours}h
                  </TableCell>
                  <TableCell className="text-center">
                    {timesheet.overtimeHours > 0 ? (
                      <span className="font-medium text-orange-600">+{timesheet.overtimeHours}h</span>
                    ) : (
                      <span className="text-gray-400">0h</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {timesheet.totalHours}h
                  </TableCell>
                  <TableCell className="text-center">{timesheet.tripsCompleted}</TableCell>
                  <TableCell>
                    <p className="text-sm">{timesheet.submittedAt}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(timesheet.status)}>
                      {timesheet.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {timesheet.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">
                          Approve
                        </Button>
                      </div>
                    )}
                    {timesheet.status === 'rejected' && (
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    )}
                    {timesheet.status === 'approved' && (
                      <Button size="sm" variant="ghost">
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
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
