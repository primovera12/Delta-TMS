'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  Server,
  Shield,
  Activity,
  AlertTriangle,
  Database,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

// Mock system stats
const mockSystemStats = {
  companies: 12,
  totalUsers: 1245,
  activeUsers: 892,
  apiCalls: 45678,
  uptime: 99.98,
  storageUsed: 245,
  storageTotal: 500,
  pendingTickets: 3,
};

const mockRecentActivity = [
  { id: 1, action: 'New company registered', entity: 'Metro Medical Transport', time: '2 hours ago' },
  { id: 2, action: 'User role updated', entity: 'John Smith - Admin', time: '4 hours ago' },
  { id: 3, action: 'API key generated', entity: 'Integration API', time: '5 hours ago' },
  { id: 4, action: 'System backup completed', entity: 'Full backup', time: '6 hours ago' },
  { id: 5, action: 'Feature flag enabled', entity: 'GPS Tracking v2', time: '1 day ago' },
];

const mockSystemHealth = [
  { name: 'API Server', status: 'healthy', latency: '45ms' },
  { name: 'Database', status: 'healthy', latency: '12ms' },
  { name: 'Cache Server', status: 'healthy', latency: '3ms' },
  { name: 'File Storage', status: 'healthy', latency: '28ms' },
  { name: 'Email Service', status: 'warning', latency: '156ms' },
];

const mockAlerts = [
  { id: 1, type: 'warning', message: 'Email service experiencing delays', time: '30 min ago' },
  { id: 2, type: 'info', message: 'Scheduled maintenance in 24 hours', time: '2 hours ago' },
];

export default function SuperAdminDashboardPage() {
  const getHealthColor = (status: string) => {
    if (status === 'healthy') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600">Manage platform configuration and monitor system health</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">{mockSystemStats.companies}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockSystemStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">{mockSystemStats.activeUsers} active</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Calls (Today)</p>
                <p className="text-2xl font-bold text-gray-900">{mockSystemStats.apiCalls.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-green-600">{mockSystemStats.uptime}%</p>
              </div>
              <Server className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {mockAlerts.length > 0 && (
        <div className="space-y-2">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} />
                <span className="font-medium">{alert.message}</span>
              </div>
              <span className="text-sm text-gray-500">{alert.time}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="h-4 w-4" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSystemHealth.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getHealthColor(service.status)}`} />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{service.latency}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/super-admin/system">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.entity}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/super-admin/audit">
                <Button variant="outline" className="w-full">View All Activity</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <Link href="/super-admin/companies">
          <Card className="hover:shadow-md cursor-pointer transition-shadow">
            <CardContent className="p-4 text-center">
              <Building2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">Manage Companies</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/super-admin/users">
          <Card className="hover:shadow-md cursor-pointer transition-shadow">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">User Management</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/super-admin/roles">
          <Card className="hover:shadow-md cursor-pointer transition-shadow">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium">Roles & Permissions</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/super-admin/config">
          <Card className="hover:shadow-md cursor-pointer transition-shadow">
            <CardContent className="p-4 text-center">
              <Settings className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="font-medium">System Config</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Storage & Database */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Used: {mockSystemStats.storageUsed} GB</span>
                  <span>Total: {mockSystemStats.storageTotal} GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${(mockSystemStats.storageUsed / mockSystemStats.storageTotal) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">120 GB</p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>
                <div>
                  <p className="text-lg font-bold">85 GB</p>
                  <p className="text-xs text-gray-500">Media</p>
                </div>
                <div>
                  <p className="text-lg font-bold">40 GB</p>
                  <p className="text-xs text-gray-500">Backups</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-bold text-green-600">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Requests/Second</span>
                <span className="font-bold">528</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Error Rate</span>
                <span className="font-bold text-green-600">0.02%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cache Hit Rate</span>
                <span className="font-bold text-green-600">94.5%</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/super-admin/analytics">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
