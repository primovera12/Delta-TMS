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
} from 'lucide-react';
import { StatCard } from '@/components/domain/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Mock data
const systemStats = {
  totalUsers: 156,
  activeDrivers: 42,
  activeFacilities: 18,
  monthlyRevenue: 128450,
  tripsThisMonth: 3240,
  avgTripRating: 4.7,
};

const recentActivity = [
  {
    id: '1',
    type: 'user_created',
    message: 'New driver registered: John Smith',
    time: '5 min ago',
    icon: Users,
  },
  {
    id: '2',
    type: 'trip_completed',
    message: 'Trip TR-20260115-012 completed successfully',
    time: '12 min ago',
    icon: CheckCircle,
  },
  {
    id: '3',
    type: 'facility_added',
    message: 'New facility added: Memorial Hospital',
    time: '1 hour ago',
    icon: Building2,
  },
  {
    id: '4',
    type: 'vehicle_inspection',
    message: 'Vehicle ABC-1234 passed inspection',
    time: '2 hours ago',
    icon: Car,
  },
  {
    id: '5',
    type: 'payment_processed',
    message: 'Weekly payments processed: $45,230',
    time: '3 hours ago',
    icon: DollarSign,
  },
];

const pendingApprovals = [
  {
    id: '1',
    type: 'driver',
    name: 'Robert Johnson',
    status: 'pending_verification',
    submitted: '2 days ago',
  },
  {
    id: '2',
    type: 'driver',
    name: 'Sarah Williams',
    status: 'pending_documents',
    submitted: '3 days ago',
  },
  {
    id: '3',
    type: 'facility',
    name: 'City Medical Center',
    status: 'pending_contract',
    submitted: '1 day ago',
  },
];

const systemAlerts = [
  {
    type: 'warning',
    message: '3 driver licenses expiring within 30 days',
    action: 'View Details',
    link: '/admin/compliance',
  },
  {
    type: 'warning',
    message: '2 vehicles due for maintenance',
    action: 'Schedule',
    link: '/admin/vehicles',
  },
  {
    type: 'info',
    message: 'System backup completed successfully',
    action: 'View Logs',
    link: '/admin/settings',
  },
];

const quickLinks = [
  { label: 'Manage Users', icon: Users, href: '/admin/users', color: 'bg-primary-100 text-primary-600' },
  { label: 'Fleet Management', icon: Car, href: '/admin/vehicles', color: 'bg-success-100 text-success-600' },
  { label: 'Pricing Rules', icon: DollarSign, href: '/admin/pricing', color: 'bg-warning-100 text-warning-600' },
  { label: 'Reports', icon: FileText, href: '/admin/reports', color: 'bg-info-100 text-info-600' },
  { label: 'Compliance', icon: Shield, href: '/admin/compliance', color: 'bg-error-100 text-error-600' },
  { label: 'Settings', icon: Settings, href: '/admin/settings', color: 'bg-gray-100 text-gray-600' },
];

export default function AdminDashboardPage() {
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
          <Button variant="secondary">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={systemStats.totalUsers}
          change={8}
          changeLabel="this month"
          icon={<Users className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Active Drivers"
          value={systemStats.activeDrivers}
          change={5}
          changeLabel="vs last week"
          icon={<Car className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${systemStats.monthlyRevenue.toLocaleString()}`}
          change={12}
          changeLabel="vs last month"
          icon={<DollarSign className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Trips This Month"
          value={systemStats.tripsThisMonth.toLocaleString()}
          change={15}
          changeLabel="vs last month"
          icon={<Activity className="h-6 w-6" />}
          trend="up"
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
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
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
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      alert.type === 'warning' ? 'bg-warning-50' : 'bg-info-50'
                    }`}
                  >
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-info-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <Link href={alert.link}>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                          {alert.action}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <Badge variant="warning">{pendingApprovals.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
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
                    <Button size="sm" variant="secondary">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
              <Link href="/admin/approvals">
                <Button variant="ghost" className="w-full mt-4">
                  View All Pending
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">API Response</span>
                  <span className="font-medium text-success-600">99.9%</span>
                </div>
                <Progress value={99.9} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Database Load</span>
                  <span className="font-medium text-success-600">42%</span>
                </div>
                <Progress value={42} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Storage Used</span>
                  <span className="font-medium text-warning-600">68%</span>
                </div>
                <Progress value={68} />
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
