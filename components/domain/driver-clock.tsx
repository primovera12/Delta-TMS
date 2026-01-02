'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  Play,
  DollarSign,
  Car,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/services/timesheet';

interface ClockStatus {
  isClockedIn: boolean;
  isOnBreak: boolean;
  currentEntry: {
    id: string;
    clockInTime: string;
    breakStartTime?: string;
    totalBreakMinutes: number;
  } | null;
  todayStats: {
    hoursWorked: number;
    minutesWorked: number;
    tripsCompleted: number;
    earnings: number;
  };
}

interface DriverClockProps {
  driverId: string;
  className?: string;
}

export function DriverClock({ driverId, className }: DriverClockProps) {
  const [status, setStatus] = useState<ClockStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('0h 0m');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
  }>({
    open: false,
    action: '',
    title: '',
    description: '',
  });
  const [notes, setNotes] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/drivers/${driverId}/timesheet`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.data.currentStatus);
      }
    } catch (err) {
      console.error('Failed to fetch clock status:', err);
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Update elapsed time every minute
  useEffect(() => {
    if (!status?.currentEntry?.clockInTime) {
      setElapsedTime('0h 0m');
      return;
    }

    const updateElapsed = () => {
      const clockIn = new Date(status.currentEntry!.clockInTime);
      const now = new Date();
      const totalMinutes = Math.floor((now.getTime() - clockIn.getTime()) / (1000 * 60));
      const workMinutes = totalMinutes - (status.currentEntry?.totalBreakMinutes || 0);

      if (status.isOnBreak && status.currentEntry?.breakStartTime) {
        const breakStart = new Date(status.currentEntry.breakStartTime);
        const breakMinutes = Math.floor((now.getTime() - breakStart.getTime()) / (1000 * 60));
        setElapsedTime(formatDuration(workMinutes - breakMinutes));
      } else {
        setElapsedTime(formatDuration(workMinutes));
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [status]);

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const performAction = async (action: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const location = await getCurrentLocation();

      const response = await fetch(`/api/v1/drivers/${driverId}/timesheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: notes || undefined,
          location,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process action');
      }

      // Refresh status
      await fetchStatus();
      setConfirmDialog({ open: false, action: '', title: '', description: '' });
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClockIn = () => {
    performAction('clock_in');
  };

  const handleClockOut = () => {
    setConfirmDialog({
      open: true,
      action: 'clock_out',
      title: 'Clock Out',
      description: 'Are you sure you want to clock out for today?',
    });
  };

  const handleStartBreak = () => {
    performAction('start_break');
  };

  const handleEndBreak = () => {
    performAction('end_break');
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Clock Card */}
      <Card
        className={cn(
          status?.isClockedIn
            ? status.isOnBreak
              ? 'border-amber-300 bg-amber-50'
              : 'border-green-300 bg-green-50'
            : 'border-gray-200'
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Clock
            </div>
            {status?.isClockedIn && (
              <span
                className={cn(
                  'text-sm font-normal px-2 py-1 rounded',
                  status.isOnBreak ? 'bg-amber-200 text-amber-800' : 'bg-green-200 text-green-800'
                )}
              >
                {status.isOnBreak ? 'On Break' : 'Clocked In'}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Time Display */}
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-gray-900">{elapsedTime}</p>
            <p className="text-sm text-gray-500 mt-1">
              {status?.isClockedIn ? 'Time worked today' : 'Ready to start'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {!status?.isClockedIn ? (
              <Button
                onClick={handleClockIn}
                disabled={isProcessing}
                className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5 mr-2" />
                )}
                Clock In
              </Button>
            ) : (
              <>
                {status.isOnBreak ? (
                  <Button
                    onClick={handleEndBreak}
                    disabled={isProcessing}
                    className="w-full h-12 bg-amber-600 hover:bg-amber-700"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-5 w-5 mr-2" />
                    )}
                    End Break
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartBreak}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <Coffee className="h-5 w-5 mr-2" />
                    Take Break
                  </Button>
                )}

                <Button
                  onClick={handleClockOut}
                  disabled={isProcessing || status.isOnBreak}
                  variant="destructive"
                  className="w-full h-12"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="h-5 w-5 mr-2" />
                  )}
                  Clock Out
                </Button>
              </>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Stats */}
      {status?.todayStats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today&apos;s Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                <p className="text-lg font-semibold">{status.todayStats.hoursWorked}h</p>
                <p className="text-xs text-gray-500">Hours</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Car className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                <p className="text-lg font-semibold">{status.todayStats.tripsCompleted}</p>
                <p className="text-xs text-gray-500">Trips</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                <p className="text-lg font-semibold">${status.todayStats.earnings.toFixed(0)}</p>
                <p className="text-xs text-gray-500">Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>

          <div>
            <Textarea
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => performAction(confirmDialog.action)}
              disabled={isProcessing}
              variant={confirmDialog.action === 'clock_out' ? 'destructive' : 'default'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DriverClock;
