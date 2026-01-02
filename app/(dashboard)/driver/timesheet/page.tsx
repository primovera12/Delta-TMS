'use client';

import * as React from 'react';
import {
  Clock,
  Calendar,
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  Coffee,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TimeEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  breaks: { start: string; end: string | null }[];
  totalHours: number;
  tripsCompleted: number;
  earnings: number;
  status: 'active' | 'completed' | 'pending_approval' | 'approved';
}

// Mock data
const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    clockIn: new Date(Date.now() - 3600000 * 4).toISOString(),
    clockOut: null,
    breaks: [
      { start: new Date(Date.now() - 3600000 * 2).toISOString(), end: new Date(Date.now() - 3600000 * 1.5).toISOString() },
    ],
    totalHours: 3.5,
    tripsCompleted: 5,
    earnings: 156.50,
    status: 'active',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(),
    clockIn: new Date(Date.now() - 86400000 - 3600000 * 8).toISOString(),
    clockOut: new Date(Date.now() - 86400000).toISOString(),
    breaks: [
      { start: new Date(Date.now() - 86400000 - 3600000 * 4).toISOString(), end: new Date(Date.now() - 86400000 - 3600000 * 3.5).toISOString() },
    ],
    totalHours: 7.5,
    tripsCompleted: 12,
    earnings: 312.00,
    status: 'approved',
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    clockIn: new Date(Date.now() - 86400000 * 2 - 3600000 * 9).toISOString(),
    clockOut: new Date(Date.now() - 86400000 * 2).toISOString(),
    breaks: [],
    totalHours: 9.0,
    tripsCompleted: 14,
    earnings: 378.50,
    status: 'approved',
  },
];

export default function DriverTimesheetPage() {
  const [timeEntries, setTimeEntries] = React.useState<TimeEntry[]>(mockTimeEntries);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isClockedIn, setIsClockedIn] = React.useState(true);
  const [isOnBreak, setIsOnBreak] = React.useState(false);
  const [currentShiftStart, setCurrentShiftStart] = React.useState<Date>(new Date(Date.now() - 3600000 * 4));
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [weekOffset, setWeekOffset] = React.useState(0);

  // Update elapsed time every second when clocked in
  React.useEffect(() => {
    if (!isClockedIn) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - currentShiftStart.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockedIn, currentShiftStart]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekStart = formatDate(weekDates[0].toISOString());
  const weekEnd = formatDate(weekDates[6].toISOString());

  // Calculate weekly totals
  const weeklyTotals = React.useMemo(() => {
    return {
      hours: timeEntries.reduce((acc, entry) => acc + entry.totalHours, 0),
      trips: timeEntries.reduce((acc, entry) => acc + entry.tripsCompleted, 0),
      earnings: timeEntries.reduce((acc, entry) => acc + entry.earnings, 0),
    };
  }, [timeEntries]);

  const handleClockIn = () => {
    setIsClockedIn(true);
    setCurrentShiftStart(new Date());
    setElapsedTime(0);
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setIsOnBreak(false);
  };

  const handleStartBreak = () => {
    setIsOnBreak(true);
  };

  const handleEndBreak = () => {
    setIsOnBreak(false);
  };

  const getStatusBadge = (status: TimeEntry['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'pending_approval':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Timesheet</h1>
          <p className="text-sm text-gray-500">Track your work hours and breaks</p>
        </div>
        <Button variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Clock In/Out Card */}
      <Card className={isClockedIn ? 'border-success-200 bg-success-50' : ''}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 mb-1">
                {isClockedIn ? 'Currently Working' : 'Not Clocked In'}
              </p>
              {isClockedIn && (
                <>
                  <p className="text-4xl font-bold text-gray-900 font-mono">
                    {formatElapsedTime(elapsedTime)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Started at {formatTime(currentShiftStart.toISOString())}
                  </p>
                  {isOnBreak && (
                    <Badge variant="warning" className="mt-2">
                      <Coffee className="h-3 w-3 mr-1" />
                      On Break
                    </Badge>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-3">
              {!isClockedIn ? (
                <Button size="lg" onClick={handleClockIn} className="gap-2">
                  <Play className="h-5 w-5" />
                  Clock In
                </Button>
              ) : (
                <>
                  {!isOnBreak ? (
                    <Button variant="secondary" size="lg" onClick={handleStartBreak} className="gap-2">
                      <Coffee className="h-5 w-5" />
                      Start Break
                    </Button>
                  ) : (
                    <Button variant="secondary" size="lg" onClick={handleEndBreak} className="gap-2">
                      <Play className="h-5 w-5" />
                      End Break
                    </Button>
                  )}
                  <Button variant="destructive" size="lg" onClick={handleClockOut} className="gap-2">
                    <Square className="h-5 w-5" />
                    Clock Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{weeklyTotals.hours.toFixed(1)}h</p>
                <p className="text-sm text-gray-500">Hours This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{weeklyTotals.trips}</p>
                <p className="text-sm text-gray-500">Trips Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <span className="text-lg font-bold text-warning-600">$</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${weeklyTotals.earnings.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Earnings This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWeekOffset(weekOffset - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous Week
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">{weekStart} - {weekEnd}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={weekOffset >= 0}
        >
          Next Week
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : timeEntries.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No time entries</h3>
              <p className="text-gray-500">Clock in to start tracking your time</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Clock In</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Clock Out</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Breaks</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Hours</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Trips</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Earnings</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{formatDate(entry.date)}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-900">{formatTime(entry.clockIn)}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-900">
                          {entry.clockOut ? formatTime(entry.clockOut) : '--:--'}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">
                          {entry.breaks.length} break{entry.breaks.length !== 1 ? 's' : ''}
                          {entry.breaks.length > 0 && (
                            <span className="text-gray-400 ml-1">
                              ({entry.breaks.reduce((acc, b) => {
                                if (!b.end) return acc;
                                const duration = (new Date(b.end).getTime() - new Date(b.start).getTime()) / 60000;
                                return acc + duration;
                              }, 0).toFixed(0)} min)
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-gray-900">{entry.totalHours.toFixed(1)}h</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-900">{entry.tripsCompleted}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-gray-900">${entry.earnings.toFixed(2)}</p>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(entry.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
