'use client';

import * as React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Clock,
  User,
  Car,
  ArrowRight,
  CheckCircle,
  XCircle,
  Zap,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AffectedItem {
  type: 'trip' | 'shift';
  id: string;
  startTime: string;
  endTime: string;
  details: string;
}

interface Conflict {
  id: string;
  type: 'trip_overlap' | 'shift_conflict' | 'driver_unavailable' | 'vehicle_conflict' | 'time_gap';
  severity: 'critical' | 'warning' | 'info';
  driverId: string;
  driverName: string;
  date: string;
  description: string;
  affectedItems: AffectedItem[];
  suggestedResolution: string;
}

interface ConflictStats {
  total: number;
  critical: number;
  warning: number;
  info: number;
  byType: {
    trip_overlap: number;
    shift_conflict: number;
    driver_unavailable: number;
    time_gap: number;
  };
}

const CONFLICT_TYPE_LABELS: Record<string, { label: string; icon: typeof AlertTriangle }> = {
  trip_overlap: { label: 'Trip Overlap', icon: AlertTriangle },
  shift_conflict: { label: 'Shift Conflict', icon: Clock },
  driver_unavailable: { label: 'Driver Unavailable', icon: User },
  vehicle_conflict: { label: 'Vehicle Conflict', icon: Car },
  time_gap: { label: 'Insufficient Gap', icon: Clock },
};

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string; icon: typeof AlertTriangle }> = {
  critical: {
    bg: 'bg-error-50',
    text: 'text-error-700',
    border: 'border-error-200',
    icon: XCircle,
  },
  warning: {
    bg: 'bg-warning-50',
    text: 'text-warning-700',
    border: 'border-warning-200',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-info-50',
    text: 'text-info-700',
    border: 'border-info-200',
    icon: Info,
  },
};

export default function ConflictsPage() {
  const [conflicts, setConflicts] = React.useState<Conflict[]>([]);
  const [stats, setStats] = React.useState<ConflictStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [dateRange, setDateRange] = React.useState<{ start: Date; end: Date }>(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    return { start, end };
  });
  const [severityFilter, setSeverityFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [selectedConflict, setSelectedConflict] = React.useState<Conflict | null>(null);
  const [showResolveDialog, setShowResolveDialog] = React.useState(false);

  const fetchConflicts = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
      });

      const response = await fetch(`/api/v1/scheduling/conflicts?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setConflicts(data.data.conflicts);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch conflicts:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  React.useEffect(() => {
    fetchConflicts();
  }, [fetchConflicts]);

  const navigateWeek = (direction: 'prev' | 'next' | 'current') => {
    if (direction === 'current') {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 7);
      setDateRange({ start, end });
    } else {
      const days = direction === 'prev' ? -7 : 7;
      setDateRange((prev) => ({
        start: new Date(prev.start.getTime() + days * 24 * 60 * 60 * 1000),
        end: new Date(prev.end.getTime() + days * 24 * 60 * 60 * 1000),
      }));
    }
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

  const formatTime = (isoString: string) => {
    // Handle HH:MM format from shifts
    if (isoString.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = isoString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    // Handle ISO date string
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredConflicts = conflicts.filter((conflict) => {
    if (severityFilter !== 'all' && conflict.severity !== severityFilter) return false;
    if (typeFilter !== 'all' && conflict.type !== typeFilter) return false;
    return true;
  });

  // Group conflicts by date
  const conflictsByDate = filteredConflicts.reduce<Record<string, Conflict[]>>((acc, conflict) => {
    const date = conflict.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(conflict);
    return acc;
  }, {});

  const handleResolve = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setShowResolveDialog(true);
  };

  const handleDismiss = (conflictId: string) => {
    // In a real implementation, this would mark the conflict as dismissed
    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scheduling Conflicts</h1>
          <p className="text-sm text-gray-500">Detect and resolve scheduling issues</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={fetchConflicts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Auto-Resolve All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={stats?.critical ? 'border-error-200 bg-error-50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-error-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.critical || 0}</p>
                <p className="text-sm text-gray-500">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats?.warning ? 'border-warning-200 bg-warning-50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.warning || 0}</p>
                <p className="text-sm text-gray-500">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Info className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.info || 0}</p>
                <p className="text-sm text-gray-500">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                <p className="text-sm text-gray-500">Total Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-44">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trip_overlap">Trip Overlap</SelectItem>
                  <SelectItem value="shift_conflict">Shift Conflict</SelectItem>
                  <SelectItem value="driver_unavailable">Driver Unavailable</SelectItem>
                  <SelectItem value="time_gap">Insufficient Gap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflict List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : filteredConflicts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-success-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">No Conflicts Found</h3>
              <p className="text-gray-500 mt-1">All schedules are clear for this period</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(conflictsByDate).map(([date, dateConflicts]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {dateConflicts.map((conflict) => {
                  const severityStyle = SEVERITY_STYLES[conflict.severity];
                  const typeInfo = CONFLICT_TYPE_LABELS[conflict.type];
                  const SeverityIcon = severityStyle.icon;
                  const TypeIcon = typeInfo?.icon || AlertCircle;

                  return (
                    <Card
                      key={conflict.id}
                      className={`${severityStyle.border} ${severityStyle.bg}`}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div
                              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                conflict.severity === 'critical'
                                  ? 'bg-error-100'
                                  : conflict.severity === 'warning'
                                  ? 'bg-warning-100'
                                  : 'bg-info-100'
                              }`}
                            >
                              <SeverityIcon
                                className={`h-5 w-5 ${severityStyle.text}`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">
                                  {conflict.description}
                                </h4>
                                <Badge
                                  variant={
                                    conflict.severity === 'critical'
                                      ? 'error'
                                      : conflict.severity === 'warning'
                                      ? 'warning'
                                      : 'info'
                                  }
                                  size="sm"
                                >
                                  {conflict.severity}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <TypeIcon className="h-4 w-4" />
                                  <span>{typeInfo?.label || conflict.type}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{conflict.driverName}</span>
                                </div>
                              </div>

                              {/* Affected Items Timeline */}
                              <div className="space-y-2 mb-3">
                                {conflict.affectedItems.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 text-sm"
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        item.type === 'trip'
                                          ? 'bg-primary-500'
                                          : 'bg-gray-400'
                                      }`}
                                    />
                                    <Badge
                                      variant="secondary"
                                      size="sm"
                                      className="font-mono"
                                    >
                                      {formatTime(item.startTime)} -{' '}
                                      {formatTime(item.endTime)}
                                    </Badge>
                                    <span className="text-gray-600">{item.details}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Suggested Resolution */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                                <Zap className="h-4 w-4 text-primary-500" />
                                <span className="text-sm text-gray-700">
                                  <strong>Suggestion:</strong> {conflict.suggestedResolution}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleResolve(conflict)}
                            >
                              Resolve
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleResolve(conflict)}>
                                  <Zap className="h-4 w-4 mr-2" />
                                  Auto-Resolve
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDismiss(conflict.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Dismiss
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conflict Type Summary */}
      {stats && stats.total > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Conflict Summary by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(stats.byType).map(([type, count]) => {
                const typeInfo = CONFLICT_TYPE_LABELS[type];
                const TypeIcon = typeInfo?.icon || AlertCircle;

                return (
                  <div
                    key={type}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-500">
                        {typeInfo?.label || type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Conflict</DialogTitle>
            <DialogDescription>
              Choose how to resolve this scheduling conflict.
            </DialogDescription>
          </DialogHeader>
          {selectedConflict && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedConflict.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Driver: {selectedConflict.driverName}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Resolution Options:</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary-500" />
                      <span className="font-medium">Auto-assign to available driver</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-6">
                      Find the next available driver and reassign the trip
                    </p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning-500" />
                      <span className="font-medium">Adjust trip times</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-6">
                      Modify pickup times to eliminate overlap
                    </p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-info-500" />
                      <span className="font-medium">Manually select driver</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-6">
                      Choose a specific driver from the available list
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowResolveDialog(false)}>
              Apply Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
