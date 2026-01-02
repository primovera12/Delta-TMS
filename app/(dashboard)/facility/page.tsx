import {
  Car,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/domain/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock data
const stats = {
  todayTrips: 12,
  activeTrips: 3,
  completedTrips: 8,
  pendingTrips: 1,
  monthlyTrips: 245,
  monthlySpend: 18450,
};

const todaysTrips = [
  {
    id: 'TR-20260115-001',
    patient: 'John Smith',
    type: 'Outbound',
    time: '10:30 AM',
    destination: 'Main Campus',
    status: 'in-progress',
    driver: 'Mike Johnson',
    vehicleType: 'wheelchair',
  },
  {
    id: 'TR-20260115-002',
    patient: 'Mary Jones',
    type: 'Return',
    time: '11:00 AM',
    destination: '456 Oak Ave',
    status: 'assigned',
    driver: 'Sarah Williams',
    vehicleType: 'ambulatory',
  },
  {
    id: 'TR-20260115-003',
    patient: 'Robert Brown',
    type: 'Outbound',
    time: '11:30 AM',
    destination: 'Dialysis Center',
    status: 'pending',
    driver: null,
    vehicleType: 'wheelchair',
  },
  {
    id: 'TR-20260115-004',
    patient: 'Emily Davis',
    type: 'Return',
    time: '12:00 PM',
    destination: '321 Elm St',
    status: 'confirmed',
    driver: 'David Lee',
    vehicleType: 'stretcher',
  },
];

const recentPatients = [
  { id: '1', name: 'John Smith', trips: 8, lastTrip: '2026-01-15' },
  { id: '2', name: 'Mary Jones', trips: 12, lastTrip: '2026-01-14' },
  { id: '3', name: 'Robert Brown', trips: 5, lastTrip: '2026-01-13' },
  { id: '4', name: 'Emily Davis', trips: 3, lastTrip: '2026-01-12' },
];

const alerts = [
  { type: 'warning', message: "Patient John S.'s appointment at 2:00 PM - no return trip scheduled" },
  { type: 'info', message: '2 standing orders expiring this week' },
];

const statusVariants: Record<string, 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'success'> = {
  'pending': 'pending',
  'confirmed': 'confirmed',
  'assigned': 'assigned',
  'in-progress': 'in-progress',
  'completed': 'success',
};

export default function FacilityDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Memorial Hospital - Transport Overview
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Link href="/facility/trips/new">
            <Button>
              <Car className="h-4 w-4 mr-2" />
              Book Transport
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Trips"
          value={stats.todayTrips}
          icon={<Car className="h-6 w-6" />}
        />
        <StatCard
          title="Active Now"
          value={stats.activeTrips}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="This Month"
          value={stats.monthlyTrips}
          change={8}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Monthly Spend"
          value={`$${stats.monthlySpend.toLocaleString()}`}
          change={-5}
          changeLabel="vs last month"
          icon={<DollarSign className="h-6 w-6" />}
          trend="down"
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 rounded-lg ${
                alert.type === 'warning' ? 'bg-warning-50' : 'bg-info-50'
              }`}
            >
              {alert.type === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-info-500 flex-shrink-0" />
              )}
              <p className="text-sm text-gray-700 flex-1">{alert.message}</p>
              <Button variant="ghost" size="sm">
                Take Action
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Trips */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today&apos;s Trips</CardTitle>
            <Link href="/facility/trips">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {trip.patient.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{trip.patient}</p>
                        <Badge variant={statusVariants[trip.status]}>
                          {trip.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={trip.type === 'Outbound' ? 'text-primary-600' : 'text-success-600'}>
                          {trip.type}
                        </span>
                        <span>•</span>
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{trip.destination}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{trip.time}</p>
                    <p className="text-sm text-gray-500">
                      {trip.driver || 'Pending assignment'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/facility/trips/new" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Car className="h-4 w-4 mr-3" />
                  Book New Transport
                </Button>
              </Link>
              <Link href="/facility/patients" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-3" />
                  Manage Patients
                </Button>
              </Link>
              <Link href="/facility/standing-orders" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-3" />
                  Standing Orders
                </Button>
              </Link>
              <Link href="/facility/invoices" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-3" />
                  View Invoices
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Patients</CardTitle>
              <Link href="/facility/patients">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {patient.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">
                          {patient.trips} trips this month
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Car className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Need Help?</p>
                  <p className="text-sm text-gray-500">Contact dispatch</p>
                </div>
                <Button variant="secondary">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
