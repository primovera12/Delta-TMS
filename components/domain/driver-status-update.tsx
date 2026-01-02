'use client';

import React, { useState, useCallback } from 'react';
import {
  Navigation,
  MapPin,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { TripStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { getDriverActions, getStatusInfo, isTerminalStatus } from '@/lib/services/trip-status';

interface DriverStatusUpdateProps {
  tripId: string;
  currentStatus: TripStatus;
  onStatusUpdate?: (newStatus: TripStatus) => void;
  className?: string;
}

const statusIcons: Partial<Record<TripStatus, React.ReactNode>> = {
  ASSIGNED: <Navigation className="h-6 w-6" />,
  DRIVER_EN_ROUTE: <Navigation className="h-6 w-6" />,
  DRIVER_ARRIVED: <MapPin className="h-6 w-6" />,
  IN_PROGRESS: <Play className="h-6 w-6" />,
  COMPLETED: <CheckCircle className="h-6 w-6" />,
  CANCELLED: <XCircle className="h-6 w-6" />,
  NO_SHOW: <AlertTriangle className="h-6 w-6" />,
};

const statusButtonColors: Partial<Record<TripStatus, string>> = {
  DRIVER_EN_ROUTE: 'bg-cyan-500 hover:bg-cyan-600 text-white',
  DRIVER_ARRIVED: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  IN_PROGRESS: 'bg-green-500 hover:bg-green-600 text-white',
  COMPLETED: 'bg-blue-500 hover:bg-blue-600 text-white',
  NO_SHOW: 'bg-rose-500 hover:bg-rose-600 text-white',
  CANCELLED: 'bg-red-500 hover:bg-red-600 text-white',
};

export function DriverStatusUpdate({
  tripId,
  currentStatus,
  onStatusUpdate,
  className,
}: DriverStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    status: TripStatus | null;
    message: string;
  }>({
    open: false,
    status: null,
    message: '',
  });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const actions = getDriverActions(currentStatus);
  const statusInfo = getStatusInfo(currentStatus);

  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number } | null> => {
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
        () => {
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  const updateStatus = async (newStatus: TripStatus) => {
    setIsUpdating(true);
    setError(null);

    try {
      // Get current location
      const location = await getCurrentLocation();

      const response = await fetch(`/api/v1/trips/${tripId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus,
          notes: notes || undefined,
          location: location || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      const data = await response.json();

      // Call callback
      onStatusUpdate?.(newStatus);

      // Close dialog and reset
      setConfirmDialog({ open: false, status: null, message: '' });
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleActionClick = (action: { nextStatus: TripStatus; label: string; confirmText?: string }) => {
    if (action.confirmText) {
      setConfirmDialog({
        open: true,
        status: action.nextStatus,
        message: action.confirmText,
      });
    } else {
      updateStatus(action.nextStatus);
    }
  };

  if (isTerminalStatus(currentStatus)) {
    return (
      <Card className={cn('bg-gray-50', className)}>
        <CardContent className="py-6 text-center">
          <div className={cn(
            'inline-flex items-center justify-center w-12 h-12 rounded-full mb-3',
            currentStatus === 'COMPLETED' ? 'bg-green-100' : 'bg-red-100'
          )}>
            {statusIcons[currentStatus]}
          </div>
          <p className="font-medium text-gray-900">{statusInfo.label}</p>
          <p className="text-sm text-gray-500">{statusInfo.description}</p>
        </CardContent>
      </Card>
    );
  }

  if (actions.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-6 text-center">
          <p className="text-gray-500">No actions available for current status</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Current Status Display */}
      <Card className="bg-gray-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                `bg-${statusInfo.color}-100 text-${statusInfo.color}-600`
              )}>
                {statusIcons[currentStatus] || <Navigation className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium text-gray-900">{statusInfo.label}</p>
                <p className="text-sm text-gray-500">{statusInfo.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.nextStatus}
            onClick={() => handleActionClick(action)}
            disabled={isUpdating}
            className={cn(
              'w-full h-14 text-lg font-semibold justify-between',
              statusButtonColors[action.nextStatus] || 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            <span className="flex items-center gap-2">
              {statusIcons[action.nextStatus]}
              {action.label}
            </span>
            {isUpdating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, status: null, message: '' })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>{confirmDialog.message}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
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
              onClick={() => setConfirmDialog({ open: false, status: null, message: '' })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDialog.status && updateStatus(confirmDialog.status)}
              disabled={isUpdating}
              className={confirmDialog.status ? statusButtonColors[confirmDialog.status] : ''}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
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

export default DriverStatusUpdate;
