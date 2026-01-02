'use client';

import * as React from 'react';
import {
  Settings,
  Bell,
  Globe,
  Palette,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  MapPin,
  HelpCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingsState {
  notifications: {
    rideConfirmations: boolean;
    driverAssigned: boolean;
    driverArriving: boolean;
    tripComplete: boolean;
    remindersBefore: string;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    distanceUnit: string;
  };
  privacy: {
    shareLocation: boolean;
    allowAnalytics: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reduceMotion: boolean;
  };
}

const defaultSettings: SettingsState = {
  notifications: {
    rideConfirmations: true,
    driverAssigned: true,
    driverArriving: true,
    tripComplete: true,
    remindersBefore: '60',
  },
  preferences: {
    language: 'en',
    timezone: 'America/Chicago',
    dateFormat: 'MM/DD/YYYY',
    distanceUnit: 'miles',
  },
  privacy: {
    shareLocation: true,
    allowAnalytics: false,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
  },
};

export default function FamilySettingsPage() {
  const [settings, setSettings] = React.useState<SettingsState>(defaultSettings);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateNotifications = (key: keyof typeof settings.notifications, value: any) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const updatePreferences = (key: keyof typeof settings.preferences, value: any) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const updatePrivacy = (key: keyof typeof settings.privacy, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }));
  };

  const updateAccessibility = (key: keyof typeof settings.accessibility, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value },
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Customize your app experience</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-500" />
            Notification Settings
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Ride Confirmations</p>
                <p className="text-sm text-gray-500">Get notified when a ride is confirmed</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications.rideConfirmations}
              onCheckedChange={(checked) => updateNotifications('rideConfirmations', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Driver Assigned</p>
                <p className="text-sm text-gray-500">Notify when a driver is assigned to a ride</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications.driverAssigned}
              onCheckedChange={(checked) => updateNotifications('driverAssigned', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Driver Arriving</p>
                <p className="text-sm text-gray-500">Alert when driver is close to pickup location</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications.driverArriving}
              onCheckedChange={(checked) => updateNotifications('driverArriving', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Trip Complete</p>
                <p className="text-sm text-gray-500">Notify when a trip is completed</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications.tripComplete}
              onCheckedChange={(checked) => updateNotifications('tripComplete', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Ride Reminders</p>
                <p className="text-sm text-gray-500">Get reminded before scheduled rides</p>
              </div>
            </div>
            <Select
              value={settings.notifications.remindersBefore}
              onValueChange={(value) => updateNotifications('remindersBefore', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="1440">1 day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-info-500" />
            Preferences
          </CardTitle>
          <CardDescription>Configure your regional and display preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={settings.preferences.language}
                onValueChange={(value) => updatePreferences('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={settings.preferences.timezone}
                onValueChange={(value) => updatePreferences('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                value={settings.preferences.dateFormat}
                onValueChange={(value) => updatePreferences('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Distance Unit</Label>
              <Select
                value={settings.preferences.distanceUnit}
                onValueChange={(value) => updatePreferences('distanceUnit', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="kilometers">Kilometers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success-500" />
            Privacy
          </CardTitle>
          <CardDescription>Control your privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Share Location</p>
                <p className="text-sm text-gray-500">Allow drivers to see patient pickup location on map</p>
              </div>
            </div>
            <Switch
              checked={settings.privacy.shareLocation}
              onCheckedChange={(checked) => updatePrivacy('shareLocation', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Usage Analytics</p>
                <p className="text-sm text-gray-500">Help improve our service by sharing anonymous usage data</p>
              </div>
            </div>
            <Switch
              checked={settings.privacy.allowAnalytics}
              onCheckedChange={(checked) => updatePrivacy('allowAnalytics', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-warning-500" />
            Accessibility
          </CardTitle>
          <CardDescription>Customize display for better accessibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">High Contrast Mode</p>
              <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
            </div>
            <Switch
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => updateAccessibility('highContrast', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Large Text</p>
              <p className="text-sm text-gray-500">Increase font size throughout the app</p>
            </div>
            <Switch
              checked={settings.accessibility.largeText}
              onCheckedChange={(checked) => updateAccessibility('largeText', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Reduce Motion</p>
              <p className="text-sm text-gray-500">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={settings.accessibility.reduceMotion}
              onCheckedChange={(checked) => updateAccessibility('reduceMotion', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary-500" />
            Help & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms of Service
            </span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </Button>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </Button>
        </CardContent>
      </Card>

      {/* App Version */}
      <div className="text-center text-sm text-gray-500">
        <p>Delta TMS Family Portal v1.0.0</p>
      </div>
    </div>
  );
}
