'use client';

import { useEffect, useState } from 'react';
import { Car, Users, Clock, DollarSign, CheckCircle, XCircle, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/domain/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface DashboardStats {
  tripsToday: number;
  pendingTrips: number;
  inProgressTrips: number;
  completedTripsThisMonth: number;
  activeDrivers: number;
  monthlyRevenue: number;
}

interface Trip {
  id: string;
  tripNumber: string;
  status: string;
  scheduledPickupTime: string;
  pickupCity: string;
  dropoffCity: string;
  driver?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  passengers: Array<{
    firstName: string;
    lastName: string;
    isPrimary: boolean;
  }>;
}

interface Driver {
  id: string;
  status: string;
  totalTrips: number;
  rating: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function DispatcherDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, tripsRes, driversRes] = await Promise.all([
          fetch('/api/v1/dashboard/stats?portal=dispatcher'),
          fetch('/api/v1/trips?limit=5&status=pending,confirmed,assigned,in_progress'),
          fetch('/api/v1/drivers?limit=4&status=online'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          setTrips(tripsData.data || []);
        }

        if (driversRes.ok) {
          const driversData = await driversRes.json();
          setDrivers(driversData.data || []);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-error-500 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'secondary'> = {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      ASSIGNED: 'assigned',
      IN_PROGRESS: 'in-progress',
      DRIVER_EN_ROUTE: 'in-progress',
      DRIVER_ARRIVED: 'in-progress',
    };
    return variants[status] || 'secondary';
  };

  const formatStatus = (status: string) => {
    return status.toLowerCase().replace(/_/g, ' ');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPrimaryPassenger = (passengers: Trip['passengers']) => {
    const primary = passengers.find(p => p.isPrimary);
    return primary ? `${primary.firstName} ${primary.lastName}` : 'Unknown';
  };

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
          <Link href="/dispatcher/scheduler">
            <Button variant="secondary">View Schedule</Button>
          </Link>
          <Link href="/dispatcher/trips/new">
            <Button>
              <Car className="h-4 w-4 mr-2" />
              New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Trips"
          value={stats?.tripsToday || 0}
          icon={<Car className="h-6 w-6" />}
        />
        <StatCard
          title="Active Now"
          value={stats?.inProgressTrips || 0}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Pending"
          value={stats?.pendingTrips || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats?.monthlyRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trips</CardTitle>
            <Link href="/dispatcher/trips">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <Link key={trip.id} href={`/dispatcher/trips/${trip.id}`}>
                    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {getPrimaryPassenger(trip.passengers).split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{getPrimaryPassenger(trip.passengers)}</p>
                            <Badge variant={getStatusBadgeVariant(trip.status)}>
                              {formatStatus(trip.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {trip.pickupCity} → {trip.dropoffCity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatTime(trip.scheduledPickupTime)}</p>
                        <p className="text-sm text-gray-500">
                          {trip.driver ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}` : 'Unassigned'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No trips found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Online Drivers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Active Drivers</CardTitle>
              <Badge variant="success" dot>
                {stats?.activeDrivers || 0} online
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" status={driver.status === 'AVAILABLE' ? 'online' : 'busy'}>
                          <AvatarFallback>
                            {driver.user.firstName[0]}{driver.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {driver.user.firstName} {driver.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {driver.totalTrips} trips total
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={driver.status === 'AVAILABLE' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {driver.status === 'ON_TRIP' ? 'On Trip' : driver.status === 'AVAILABLE' ? 'Available' : formatStatus(driver.status)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No drivers online</p>
                )}
              </div>
              <Link href="/dispatcher/drivers">
                <Button variant="ghost" className="w-full mt-4">
                  View All Drivers
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dispatcher/trips/new" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Car className="h-4 w-4 mr-2" />
                  Book New Trip
                </Button>
              </Link>
              <Link href="/dispatcher/quick-book" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Quick Book
                </Button>
              </Link>
              <Link href="/dispatcher/will-call" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Will-Call Returns
                </Button>
              </Link>
              <Link href="/dispatcher/map" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Live Map
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Active Drivers</span>
                  <span className="font-semibold text-gray-900">{stats?.activeDrivers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pending Trips</span>
                  <span className="font-semibold text-gray-900">{stats?.pendingTrips || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">In Progress</span>
                  <span className="font-semibold text-gray-900">{stats?.inProgressTrips || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Completed This Month</span>
                  <span className="font-semibold text-gray-900">{stats?.completedTripsThisMonth || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
