'use client';

import * as React from 'react';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Car,
  Calendar,
  DollarSign,
  AlertCircle,
  Info,
  MessageSquare,
  Settings,
  Trash2,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notification {
  id: string;
  type: 'trip' | 'schedule' | 'payment' | 'alert' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'trip',
    title: 'New Trip Assigned',
    message: 'You have been assigned a new trip for Robert Johnson at 9:00 AM tomorrow.',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    actionUrl: '/driver/trips/1',
    actionLabel: 'View Trip',
  },
  {
    id: '2',
    type: 'alert',
    title: 'Schedule Change',
    message: 'Trip #TRP-456 has been rescheduled to 2:30 PM. Please confirm your availability.',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    actionUrl: '/driver/trips/2',
    actionLabel: 'View Details',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Processed',
    message: 'Your weekly payment of $1,245.00 has been deposited to your account.',
    timestamp: '2024-01-14T16:00:00Z',
    read: true,
    actionUrl: '/driver/earnings',
    actionLabel: 'View Earnings',
  },
  {
    id: '4',
    type: 'message',
    title: 'Message from Dispatch',
    message: 'Please remember to submit your vehicle inspection report before end of day.',
    timestamp: '2024-01-14T14:30:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'schedule',
    title: 'Weekly Schedule Available',
    message: 'Your schedule for next week (Jan 22-28) is now available.',
    timestamp: '2024-01-14T08:00:00Z',
    read: true,
    actionUrl: '/driver/schedule',
    actionLabel: 'View Schedule',
  },
  {
    id: '6',
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of the driver app is available. Please update for the latest features.',
    timestamp: '2024-01-13T12:00:00Z',
    read: true,
  },
  {
    id: '7',
    type: 'trip',
    title: 'Trip Completed',
    message: 'Trip #TRP-123 has been marked as completed. Great job!',
    timestamp: '2024-01-13T11:45:00Z',
    read: true,
  },
  {
    id: '8',
    type: 'alert',
    title: 'Document Expiring Soon',
    message: "Your driver's license will expire in 30 days. Please upload a renewed copy.",
    timestamp: '2024-01-12T09:00:00Z',
    read: false,
    actionUrl: '/driver/documents',
    actionLabel: 'Upload Document',
  },
];

export default function DriverNotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = React.useState<string>('all');
  const [activeTab, setActiveTab] = React.useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (filter !== 'all') return n.type === filter;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return <Car className="h-5 w-5 text-primary-600" />;
      case 'schedule':
        return <Calendar className="h-5 w-5 text-info-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-success-600" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-warning-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'trip':
        return 'bg-primary-100';
      case 'schedule':
        return 'bg-info-100';
      case 'payment':
        return 'bg-success-100';
      case 'alert':
        return 'bg-warning-100';
      case 'message':
        return 'bg-purple-100';
      case 'system':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline" onClick={() => {}}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="trip">Trips</SelectItem>
            <SelectItem value="schedule">Schedule</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
            <SelectItem value="message">Messages</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BellOff className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'unread'
                ? "You're all caught up!"
                : 'You have no notifications yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.read ? 'bg-primary-50/50 border-primary-200' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg ${getTypeBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={notification.actionUrl}>{notification.actionLabel}</a>
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className="text-gray-400 hover:text-error-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={handleClearAll} className="text-gray-500">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Notifications
          </Button>
        </div>
      )}

      {/* Notification Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Trip Assignments</p>
              <p className="text-sm text-gray-500">Get notified when you're assigned a new trip</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Schedule Changes</p>
              <p className="text-sm text-gray-500">Alerts for trip reschedules or cancellations</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Payment Updates</p>
              <p className="text-sm text-gray-500">Notifications when payments are processed</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Dispatch Messages</p>
              <p className="text-sm text-gray-500">Direct messages from dispatch team</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Document Reminders</p>
              <p className="text-sm text-gray-500">Alerts when documents are expiring</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
