'use client';

import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  MapPin,
  Play,
  AlertTriangle,
  User,
  Truck,
} from 'lucide-react';
import { TripStatus } from '@prisma/client';
import { cn } from '@/lib/utils';

interface StatusHistoryEntry {
  id: string;
  previousStatus: TripStatus | null;
  newStatus: TripStatus;
  createdAt: string | Date;
  notes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  changedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

interface TripStatusTimelineProps {
  history: StatusHistoryEntry[];
  currentStatus: TripStatus;
  className?: string;
}

const statusConfig: Record<TripStatus, { icon: React.ReactNode; color: string; bgColor: string }> = {
  PENDING: { icon: <Clock className="h-4 w-4" />, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  CONFIRMED: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  ASSIGNED: { icon: <Truck className="h-4 w-4" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  DRIVER_EN_ROUTE: { icon: <Navigation className="h-4 w-4" />, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  DRIVER_ARRIVED: { icon: <MapPin className="h-4 w-4" />, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  IN_PROGRESS: { icon: <Play className="h-4 w-4" />, color: 'text-green-600', bgColor: 'bg-green-100' },
  COMPLETED: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  CANCELLED: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-600', bgColor: 'bg-red-100' },
  NO_SHOW: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-rose-600', bgColor: 'bg-rose-100' },
};

const statusLabels: Record<TripStatus, string> = {
  PENDING: 'Trip Created',
  CONFIRMED: 'Confirmed',
  ASSIGNED: 'Driver Assigned',
  DRIVER_EN_ROUTE: 'Driver En Route',
  DRIVER_ARRIVED: 'Driver Arrived',
  IN_PROGRESS: 'Trip Started',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

export function TripStatusTimeline({ history, currentStatus, className }: TripStatusTimelineProps) {
  // Sort history by date, oldest first
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {sortedHistory.map((entry, index) => {
          const config = statusConfig[entry.newStatus];
          const isLast = index === sortedHistory.length - 1;
          const date = new Date(entry.createdAt);

          return (
            <div key={entry.id} className="relative flex gap-4">
              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex items-center justify-center w-8 h-8 rounded-full',
                  config.bgColor,
                  config.color,
                  isLast && 'ring-2 ring-offset-2 ring-blue-500'
                )}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className={cn('font-medium', isLast ? 'text-gray-900' : 'text-gray-700')}>
                    {statusLabels[entry.newStatus]}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(date, { addSuffix: true })}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {format(date, 'MMM d, yyyy h:mm a')}
                </p>

                {entry.changedBy && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {entry.changedBy.firstName} {entry.changedBy.lastName}
                    <span className="capitalize">({entry.changedBy.role.toLowerCase().replace('_', ' ')})</span>
                  </p>
                )}

                {entry.notes && (
                  <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded italic">
                    &ldquo;{entry.notes}&rdquo;
                  </p>
                )}

                {entry.latitude && entry.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${entry.latitude},${entry.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    View location
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TripStatusTimeline;
