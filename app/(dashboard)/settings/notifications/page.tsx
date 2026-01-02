'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  Volume2,
} from 'lucide-react';

export default function NotificationSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    // Email
    emailTrips: true,
    emailReminders: true,
    emailUpdates: false,
    emailMarketing: false,

    // SMS
    smsTrips: true,
    smsReminders: true,
    smsAlerts: true,

    // Push
    pushTrips: true,
    pushReminders: true,
    pushAlerts: true,

    // In-App
    inAppTrips: true,
    inAppReminders: true,
    inAppAlerts: true,
    inAppMessages: true,
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const updatePreference = (key: string, value: boolean) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-gray-600">Choose how you want to receive notifications</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trip Updates</p>
              <p className="text-sm text-gray-500">
                Confirmations, cancellations, and driver assignments
              </p>
            </div>
            <Switch
              checked={preferences.emailTrips}
              onCheckedChange={(v) => updatePreference('emailTrips', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trip Reminders</p>
              <p className="text-sm text-gray-500">
                Reminders before scheduled pickups
              </p>
            </div>
            <Switch
              checked={preferences.emailReminders}
              onCheckedChange={(v) => updatePreference('emailReminders', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">System Updates</p>
              <p className="text-sm text-gray-500">
                New features, maintenance notices, and announcements
              </p>
            </div>
            <Switch
              checked={preferences.emailUpdates}
              onCheckedChange={(v) => updatePreference('emailUpdates', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Marketing & Promotions</p>
              <p className="text-sm text-gray-500">
                Special offers and promotional content
              </p>
            </div>
            <Switch
              checked={preferences.emailMarketing}
              onCheckedChange={(v) => updatePreference('emailMarketing', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trip Updates</p>
              <p className="text-sm text-gray-500">
                Driver on the way, arrived, and trip completed
              </p>
            </div>
            <Switch
              checked={preferences.smsTrips}
              onCheckedChange={(v) => updatePreference('smsTrips', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trip Reminders</p>
              <p className="text-sm text-gray-500">
                Text reminders before scheduled pickups
              </p>
            </div>
            <Switch
              checked={preferences.smsReminders}
              onCheckedChange={(v) => updatePreference('smsReminders', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Urgent Alerts</p>
              <p className="text-sm text-gray-500">
                Delays, cancellations, and time-sensitive updates
              </p>
            </div>
            <Switch
              checked={preferences.smsAlerts}
              onCheckedChange={(v) => updatePreference('smsAlerts', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trip Updates</p>
              <p className="text-sm text-gray-500">
                Real-time status changes for your trips
              </p>
            </div>
            <Switch
              checked={preferences.pushTrips}
              onCheckedChange={(v) => updatePreference('pushTrips', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trip Reminders</p>
              <p className="text-sm text-gray-500">
                Push reminders before scheduled pickups
              </p>
            </div>
            <Switch
              checked={preferences.pushReminders}
              onCheckedChange={(v) => updatePreference('pushReminders', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Alerts</p>
              <p className="text-sm text-gray-500">
                Important system and security alerts
              </p>
            </div>
            <Switch
              checked={preferences.pushAlerts}
              onCheckedChange={(v) => updatePreference('pushAlerts', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4" />
            In-App Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trip Updates</p>
              <p className="text-sm text-gray-500">
                Show in notification center
              </p>
            </div>
            <Switch
              checked={preferences.inAppTrips}
              onCheckedChange={(v) => updatePreference('inAppTrips', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Reminders</p>
              <p className="text-sm text-gray-500">
                Show in notification center
              </p>
            </div>
            <Switch
              checked={preferences.inAppReminders}
              onCheckedChange={(v) => updatePreference('inAppReminders', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">System Alerts</p>
              <p className="text-sm text-gray-500">
                Show in notification center
              </p>
            </div>
            <Switch
              checked={preferences.inAppAlerts}
              onCheckedChange={(v) => updatePreference('inAppAlerts', v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-gray-500">
                Direct messages from dispatch and drivers
              </p>
            </div>
            <Switch
              checked={preferences.inAppMessages}
              onCheckedChange={(v) => updatePreference('inAppMessages', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Notification Sounds</p>
              <p className="text-sm text-gray-500">
                Play sound for notifications
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
