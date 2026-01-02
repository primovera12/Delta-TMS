'use client';

import * as React from 'react';
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Car,
  MapPin,
  DollarSign,
  User,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'trip' | 'driver' | 'payment' | 'system' | 'patient';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'not-001',
    type: 'warning',
    category: 'trip',
    title: 'Trip Running Late',
    message: 'Trip TR-20260115-012 is running 10 minutes late. ETA updated.',
    timestamp: '2 min ago',
    read: false,
    actionUrl: '/dispatcher/trips/TR-20260115-012',
    actionLabel: 'View Trip',
  },
  {
    id: 'not-002',
    type: 'success',
    category: 'trip',
    title: 'Trip Completed',
    message: 'Trip TR-20260115-008 has been completed successfully.',
    timestamp: '15 min ago',
    read: false,
    actionUrl: '/dispatcher/trips/TR-20260115-008',
    actionLabel: 'View Details',
  },
  {
    id: 'not-003',
    type: 'info',
    category: 'driver',
    title: 'Driver Now Available',
    message: 'John Smith has completed their trip and is now available.',
    timestamp: '20 min ago',
    read: false,
  },
  {
    id: 'not-004',
    type: 'warning',
    category: 'payment',
    title: 'Invoice Overdue',
    message: 'Invoice INV-2026-0108 for Regional Medical Center is overdue.',
    timestamp: '1 hour ago',
    read: true,
    actionUrl: '/admin/billing/INV-2026-0108',
    actionLabel: 'View Invoice',
  },
  {
    id: 'not-005',
    type: 'info',
    category: 'system',
    title: 'System Update',
    message: 'Scheduled maintenance tonight from 2 AM to 4 AM EST.',
    timestamp: '3 hours ago',
    read: true,
  },
];

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
};

const typeColors = {
  info: 'text-info-600 bg-info-100',
  success: 'text-success-600 bg-success-100',
  warning: 'text-warning-600 bg-warning-100',
  error: 'text-error-600 bg-error-100',
};

const categoryIcons = {
  trip: MapPin,
  driver: Car,
  payment: DollarSign,
  system: Info,
  patient: User,
};

interface NotificationCenterProps {
  onClose?: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="error" size="sm">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const TypeIcon = typeIcons[notification.type];
              const CategoryIcon = categoryIcons[notification.category];

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        typeColors[notification.type]
                      }`}
                    >
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {notification.timestamp}
                          </span>
                          <Badge variant="secondary" size="sm">
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {notification.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              Mark read
                            </button>
                          )}
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              {notification.actionLabel || 'View'}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <a
          href="/settings/notifications"
          className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Notification Settings
        </a>
      </div>
    </div>
  );
}

// Bell icon with notification badge
interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

export function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label={`${count} unread notifications`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-error-500 text-white text-xs flex items-center justify-center font-medium">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
