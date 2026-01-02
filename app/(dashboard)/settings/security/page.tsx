'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Shield,
  Smartphone,
  Key,
  Monitor,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Trash2,
} from 'lucide-react';

// Mock active sessions
const mockSessions = [
  {
    id: 'SES-001',
    device: 'Chrome on Windows',
    location: 'Los Angeles, CA',
    ip: '192.168.1.100',
    lastActive: 'Now',
    current: true,
  },
  {
    id: 'SES-002',
    device: 'Safari on iPhone',
    location: 'Los Angeles, CA',
    ip: '192.168.1.101',
    lastActive: '2 hours ago',
    current: false,
  },
  {
    id: 'SES-003',
    device: 'Chrome on MacBook',
    location: 'San Francisco, CA',
    ip: '10.0.0.50',
    lastActive: '1 day ago',
    current: false,
  },
];

const mockLoginHistory = [
  { date: '2024-01-15 10:30 AM', device: 'Chrome on Windows', location: 'Los Angeles, CA', status: 'success' },
  { date: '2024-01-14 2:15 PM', device: 'Safari on iPhone', location: 'Los Angeles, CA', status: 'success' },
  { date: '2024-01-14 9:00 AM', device: 'Chrome on Windows', location: 'Los Angeles, CA', status: 'success' },
  { date: '2024-01-13 8:45 PM', device: 'Unknown Browser', location: 'Chicago, IL', status: 'failed' },
  { date: '2024-01-13 3:30 PM', device: 'Chrome on MacBook', location: 'San Francisco, CA', status: 'success' },
];

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and active sessions</p>
      </div>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Shield className={`h-5 w-5 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-gray-500">
                  {twoFactorEnabled ? 'Enabled - Using Google Authenticator' : 'Add an extra layer of security'}
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium">Recovery Codes</p>
                <p className="text-sm text-gray-500">
                  8 codes remaining - Last regenerated on Jan 1, 2024
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Codes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Security Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Login Alerts</p>
              <p className="text-sm text-gray-500">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-gray-500">
                Automatically log out after 60 minutes of inactivity
              </p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Active Sessions
            </CardTitle>
            <Button variant="outline" size="sm" className="text-red-600">
              Sign Out All Devices
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.current && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="icon" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Login Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLoginHistory.map((login, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {login.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{login.device}</p>
                    <p className="text-xs text-gray-500">
                      {login.location} • {login.date}
                    </p>
                  </div>
                </div>
                <Badge className={
                  login.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }>
                  {login.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
