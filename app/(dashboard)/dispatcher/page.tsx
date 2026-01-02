import { Car, Users, Clock, DollarSign, CheckCircle, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/domain/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock data - in production, this would come from the API
const stats = {
  todayTrips: 42,
  activeTrips: 8,
  completedTrips: 31,
  cancelledTrips: 3,
  driversOnline: 12,
  revenue: 3240,
};

const recentTrips = [
  {
    id: 'TR-20260115-001',
    patient: 'John Smith',
    pickup: '123 Main St, Houston',
    dropoff: 'Memorial Hospital',
    time: '10:30 AM',
    status: 'in-progress',
    driver: 'Mike Johnson',
  },
  {
    id: 'TR-20260115-002',
    patient: 'Mary Jones',
    pickup: '456 Oak Ave, Houston',
    dropoff: 'Dialysis Center',
    time: '11:00 AM',
    status: 'assigned',
    driver: 'Sarah Williams',
  },
  {
    id: 'TR-20260115-003',
    patient: 'Robert Brown',
    pickup: '789 Pine Rd, Houston',
    dropoff: 'City Clinic',
    time: '11:30 AM',
    status: 'pending',
    driver: null,
  },
  {
    id: 'TR-20260115-004',
    patient: 'Emily Davis',
    pickup: '321 Elm St, Houston',
    dropoff: 'General Hospital',
    time: '12:00 PM',
    status: 'confirmed',
    driver: null,
  },
];

const onlineDrivers = [
  { id: '1', name: 'Mike Johnson', status: 'on-trip', trips: 5, rating: 4.8 },
  { id: '2', name: 'Sarah Williams', status: 'available', trips: 3, rating: 4.9 },
  { id: '3', name: 'David Lee', status: 'available', trips: 4, rating: 4.7 },
  { id: '4', name: 'Lisa Chen', status: 'on-trip', trips: 6, rating: 4.9 },
];

const upcomingAlerts = [
  { type: 'warning', message: 'Driver John D. license expires in 5 days' },
  { type: 'info', message: '3 will-call returns waiting for activation' },
  { type: 'success', message: 'All morning dialysis runs completed on time' },
];

export default function DispatcherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">View Schedule</Button>
          <Button>
            <Car className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Trips"
          value={stats.todayTrips}
          change={12}
          changeLabel="vs yesterday"
          icon={<Car className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Active Now"
          value={stats.activeTrips}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Completed"
          value={stats.completedTrips}
          change={8}
          changeLabel="vs yesterday"
          icon={<CheckCircle className="h-6 w-6" />}
          trend="up"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change={15}
          changeLabel="vs yesterday"
          icon={<DollarSign className="h-6 w-6" />}
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trips</CardTitle>
            <Button variant="ghost" size="sm">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrips.map((trip) => (
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
                        <Badge variant={trip.status as 'pending' | 'confirmed' | 'assigned' | 'in-progress'}>
                          {trip.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {trip.pickup} → {trip.dropoff}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{trip.time}</p>
                    <p className="text-sm text-gray-500">
                      {trip.driver || 'Unassigned'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Online Drivers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Online Drivers</CardTitle>
              <Badge variant="success" dot>
                {stats.driversOnline} online
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onlineDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" status={driver.status === 'available' ? 'online' : 'busy'}>
                        <AvatarFallback>
                          {driver.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{driver.name}</p>
                        <p className="text-xs text-gray-500">
                          {driver.trips} trips today
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={driver.status === 'available' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {driver.status === 'on-trip' ? 'On Trip' : 'Available'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    {alert.type === 'warning' && (
                      <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0" />
                    )}
                    {alert.type === 'info' && (
                      <Clock className="h-5 w-5 text-info-500 flex-shrink-0" />
                    )}
                    {alert.type === 'success' && (
                      <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0" />
                    )}
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">On-time Rate</span>
                  <span className="font-semibold text-gray-900">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Avg Wait Time</span>
                  <span className="font-semibold text-gray-900">12 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Avg Trip Duration</span>
                  <span className="font-semibold text-gray-900">28 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Customer Rating</span>
                  <span className="font-semibold text-gray-900">4.8 / 5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
