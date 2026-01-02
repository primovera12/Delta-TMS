'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  FileText,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Coffee,
  PlayCircle,
  StopCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Timesheet {
  id: string;
  date: string;
  clockInTime: string;
  clockOutTime: string | null;
  status: 'pending' | 'approved' | 'rejected';
  totalMinutes: number | null;
  totalBreakMinutes: number | null;
  dispatcherNotes: string | null;
  driver: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
}

interface TimesheetStats {
  totalEntries: number;
  totalMinutesWorked: number;
  totalBreakMinutes: number;
  totalHoursWorked: number;
}

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = React.useState<Timesheet[]>([]);
  const [stats, setStats] = React.useState<TimesheetStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [driverFilter, setDriverFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [dateRange, setDateRange] = React.useState<{ start: Date; end: Date }>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { start, end };
  });

  // Approval dialog
  const [showApprovalDialog, setShowApprovalDialog] = React.useState(false);
  const [approvalAction, setApprovalAction] = React.useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Unique drivers for filter
  const [drivers, setDrivers] = React.useState<Array<{ id: string; name: string }>>([]);

  const fetchTimesheets = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (driverFilter !== 'all') {
        params.append('driverId', driverFilter);
      }

      const response = await fetch(`/api/v1/timesheets?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTimesheets(data.data.timesheets);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);

        // Extract unique drivers
        const uniqueDrivers = new Map<string, string>();
        data.data.timesheets.forEach((ts: Timesheet) => {
          if (!uniqueDrivers.has(ts.driver.id)) {
            uniqueDrivers.set(
              ts.driver.id,
              `${ts.driver.user.firstName} ${ts.driver.user.lastName}`
            );
          }
        });
        setDrivers(
          Array.from(uniqueDrivers.entries()).map(([id, name]) => ({ id, name }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch timesheets:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, driverFilter, dateRange]);

  React.useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const toggleSelectAll = () => {
    if (selectedIds.length === timesheets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(timesheets.map((ts) => ts.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return;

    setApprovalAction(action);
    setApprovalNotes('');
    setShowApprovalDialog(true);
  };

  const submitApproval = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/v1/timesheets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          status: approvalAction === 'approve' ? 'approved' : 'rejected',
          notes: approvalNotes || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSelectedIds([]);
        setShowApprovalDialog(false);
        fetchTimesheets();
      }
    } catch (error) {
      console.error('Failed to update timesheets:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '--';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const navigateWeek = (direction: 'prev' | 'next' | 'current') => {
    if (direction === 'current') {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      setDateRange({ start, end });
    } else {
      const days = direction === 'prev' ? -7 : 7;
      setDateRange((prev) => ({
        start: new Date(prev.start.getTime() + days * 24 * 60 * 60 * 1000),
        end: new Date(prev.end.getTime() + days * 24 * 60 * 60 * 1000),
      }));
    }
    setCurrentPage(1);
  };

  const formatDateRange = () => {
    const startStr = dateRange.start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endStr = dateRange.end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${startStr} - ${endStr}`;
  };

  const pendingCount = timesheets.filter((ts) => ts.status === 'pending').length;
  const selectedPending = selectedIds.filter((id) => {
    const ts = timesheets.find((t) => t.id === id);
    return ts?.status === 'pending';
  }).length;

  const filteredTimesheets = searchQuery
    ? timesheets.filter((ts) => {
        const name = `${ts.driver.user.firstName} ${ts.driver.user.lastName}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
      })
    : timesheets;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Timesheet Management</h1>
          <p className="text-sm text-gray-500">Review and approve driver time entries</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalEntries || 0}</p>
                <p className="text-sm text-gray-500">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalHoursWorked.toFixed(1) || 0}h
                </p>
                <p className="text-sm text-gray-500">Hours Worked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-sm text-gray-500">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Coffee className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(stats?.totalBreakMinutes || 0)}
                </p>
                <p className="text-sm text-gray-500">Break Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Date Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigateWeek('current')}>
                  This Week
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-semibold text-gray-900">{formatDateRange()}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={driverFilter} onValueChange={setDriverFilter}>
                <SelectTrigger className="w-40">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="border-primary-200 bg-primary-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary-900">
                {selectedIds.length} timesheet(s) selected
                {selectedPending > 0 && ` (${selectedPending} pending)`}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedIds([])}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                {selectedPending > 0 && (
                  <>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBulkAction('reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleBulkAction('approve')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timesheets Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : filteredTimesheets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No timesheets found</p>
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={
                        selectedIds.length === filteredTimesheets.length &&
                        filteredTimesheets.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Break
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTimesheets.map((timesheet) => (
                  <tr
                    key={timesheet.id}
                    className={`hover:bg-gray-50 ${
                      selectedIds.includes(timesheet.id) ? 'bg-primary-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.includes(timesheet.id)}
                        onCheckedChange={() => toggleSelect(timesheet.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {timesheet.driver.user.firstName[0]}
                            {timesheet.driver.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {timesheet.driver.user.firstName} {timesheet.driver.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {timesheet.driver.user.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(timesheet.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <PlayCircle className="h-4 w-4 text-success-500" />
                        {formatTime(timesheet.clockInTime)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        {timesheet.clockOutTime ? (
                          <>
                            <StopCircle className="h-4 w-4 text-error-500" />
                            {formatTime(timesheet.clockOutTime)}
                          </>
                        ) : (
                          <Badge variant="info">Active</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatDuration(timesheet.totalMinutes)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDuration(timesheet.totalBreakMinutes)}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(timesheet.status)}</td>
                    <td className="px-4 py-3">
                      {timesheet.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedIds([timesheet.id]);
                              handleBulkAction('approve');
                            }}
                          >
                            <Check className="h-4 w-4 text-success-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedIds([timesheet.id]);
                              handleBulkAction('reject');
                            }}
                          >
                            <X className="h-4 w-4 text-error-600" />
                          </Button>
                        </div>
                      )}
                      {timesheet.dispatcherNotes && (
                        <p className="text-xs text-gray-500 mt-1 max-w-32 truncate">
                          {timesheet.dispatcherNotes}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Approval/Rejection Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve' : 'Reject'} Timesheet
              {selectedIds.length > 1 ? 's' : ''}
            </DialogTitle>
            <DialogDescription>
              You are about to {approvalAction} {selectedIds.length} timesheet
              {selectedIds.length > 1 ? 's' : ''}.
              {approvalAction === 'reject' && ' Please provide a reason.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">
                Notes {approvalAction === 'reject' && <span className="text-error-500">*</span>}
              </Label>
              <Textarea
                id="notes"
                placeholder={
                  approvalAction === 'approve'
                    ? 'Optional notes...'
                    : 'Reason for rejection...'
                }
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={approvalAction === 'reject' ? 'destructive' : 'default'}
              onClick={submitApproval}
              disabled={isSubmitting || (approvalAction === 'reject' && !approvalNotes)}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : approvalAction === 'approve' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {approvalAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
