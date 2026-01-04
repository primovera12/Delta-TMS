'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Car,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  FileText,
  Shield,
  Settings,
  Loader2,
} from 'lucide-react';
import { StatCard } from '@/components/domain/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeDrivers: number;
  totalFacilities: number;
  totalVehicles: number;
  activeVehicles: number;
  tripsThisMonth: number;
  tripChange: number;
  completedTripsThisMonth: number;
  pendingTrips: number;
  inProgressTrips: number;
  tripsToday: number;
  monthlyRevenue: number;
  revenueChange: number;
  outstandingInvoices: number;
  outstandingInvoiceCount: number;
  pendingApprovals: Array<{
    id: string;
    name: string;
    type: string;
    submitted: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
  }>;
}

const quickLinks = [
  { label: 'Manage Users', icon: Users, href: '/admin/users', color: 'bg-primary-100 text-primary-600' },
  { label: 'Fleet Management', icon: Car, href: '/admin/vehicles', color: 'bg-success-100 text-success-600' },
  { label: 'Pricing Rules', icon: DollarSign, href: '/admin/pricing', color: 'bg-warning-100 text-warning-600' },
  { label: 'Reports', icon: FileText, href: '/admin/reports', color: 'bg-info-100 text-info-600' },
  { label: 'Compliance', icon: Shield, href: '/admin/compliance', color: 'bg-error-100 text-error-600' },
  { label: 'Settings', icon: Settings, href: '/admin/settings', color: 'bg-gray-100 text-gray-600' },
];

const activityIcons: Record<string, typeof Users> = {
  trip_pending: Clock,
  trip_confirmed: CheckCircle,
  trip_completed: CheckCircle,
  trip_cancelled: AlertTriangle,
  trip_in_progress: Activity,
  trip_assigned: Car,
  default: Activity,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/v1/dashboard/stats?portal=admin');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const result = await response.json();
        setStats(result.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-error-500 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">{error || 'Failed to load dashboard'}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            System overview and management
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/reports">
            <Button variant="secondary">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={8}
          changeLabel="registered"
          icon={<Users className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Active Drivers"
          value={stats.activeDrivers}
          change={stats.activeDrivers}
          changeLabel="available"
          icon={<Car className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          changeLabel="vs last month"
          icon={<DollarSign className="h-6 w-6" />}
          trend={stats.revenueChange >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Trips This Month"
          value={stats.tripsThisMonth.toLocaleString()}
          change={stats.tripChange}
          changeLabel="vs last month"
          icon={<Activity className="h-6 w-6" />}
          trend={stats.tripChange >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-lg ${link.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{link.label}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/admin/rides">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => {
                  const Icon = activityIcons[activity.type] || activityIcons.default;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary-50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary-500" />
                    <span className="text-sm text-gray-700">Trips Today</span>
                  </div>
                  <span className="font-semibold text-primary-600">{stats.tripsToday}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning-50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-warning-500" />
                    <span className="text-sm text-gray-700">Pending</span>
                  </div>
                  <span className="font-semibold text-warning-600">{stats.pendingTrips}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-info-50">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-info-500" />
                    <span className="text-sm text-gray-700">In Progress</span>
                  </div>
                  <span className="font-semibold text-info-600">{stats.inProgressTrips}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <Badge variant="warning">{stats.pendingApprovals.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.pendingApprovals.length > 0 ? (
                  stats.pendingApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {approval.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{approval.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{approval.type}</p>
                        </div>
                      </div>
                      <Link href={`/admin/users/${approval.id}`}>
                        <Button size="sm" variant="secondary">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No pending approvals</p>
                )}
              </div>
              <Link href="/admin/users?status=pending">
                <Button variant="ghost" className="w-full mt-4">
                  View All Pending
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Active Facilities</span>
                  <span className="font-medium text-gray-900">{stats.totalFacilities}</span>
                </div>
                <Progress value={100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Active Vehicles</span>
                  <span className="font-medium text-gray-900">{stats.activeVehicles} / {stats.totalVehicles}</span>
                </div>
                <Progress value={stats.totalVehicles > 0 ? (stats.activeVehicles / stats.totalVehicles) * 100 : 0} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Outstanding Invoices</span>
                  <span className="font-medium text-warning-600">${stats.outstandingInvoices.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">{stats.outstandingInvoiceCount} invoices pending</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="h-2 w-2 rounded-full bg-success-500" />
                  <span>All systems operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
