'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  ChevronRight,
  Navigation,
  CheckCircle,
  AlertCircle,
  User,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Trip {
  id: string;
  tripNumber: string;
  status: string;
  scheduledPickupTime: string;
  pickupAddressLine1: string;
  pickupCity: string;
  dropoffAddressLine1: string;
  dropoffCity: string;
  driver?: {
    rating: number;
    user: {
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
  vehicle?: {
    make: string;
    model: string;
    licensePlate: string;
  };
}

interface StandingOrder {
  id: string;
  name: string;
  frequency: string;
  isActive: boolean;
  pickupCity: string;
  dropoffCity: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
}

export default function PatientDashboardPage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [upcomingTrips, setUpcomingTrips] = React.useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = React.useState<Trip[]>([]);
  const [standingOrders, setStandingOrders] = React.useState<StandingOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, tripsRes, pastTripsRes, ordersRes] = await Promise.all([
          fetch('/api/v1/patients/me'),
          fetch('/api/v1/trips?status=pending,confirmed,assigned&limit=1'),
          fetch('/api/v1/trips?status=completed&limit=3'),
          fetch('/api/v1/standing-orders?limit=3'),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.data);
        }

        if (tripsRes.ok) {
          const data = await tripsRes.json();
          setUpcomingTrips(data.data || []);
        }

        if (pastTripsRes.ok) {
          const data = await pastTripsRes.json();
          setPastTrips(data.data || []);
        }

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setStandingOrders(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
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

  const upcomingTrip = upcomingTrips[0];
  const firstName = profile?.firstName || 'there';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {firstName}</h1>
          <p className="text-sm text-gray-500">
            Here&apos;s your upcoming transportation
          </p>
        </div>
        <Link href="/patient/trips/new">
          <Button>
            <Car className="h-4 w-4 mr-2" />
            Book a Ride
          </Button>
        </Link>
      </div>

      {/* Upcoming Trip Card */}
      {upcomingTrip ? (
        <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                Upcoming Trip
              </CardTitle>
              <Badge variant="confirmed">{upcomingTrip.status.replace('_', ' ')}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date and Time */}
            <div className="flex items-center gap-4 text-lg">
              <span className="font-semibold text-gray-900">
                {formatDate(upcomingTrip.scheduledPickupTime)}
              </span>
              <span className="text-primary-600 font-bold">
                {formatTime(upcomingTrip.scheduledPickupTime)}
              </span>
            </div>

            {/* Route */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium text-gray-900">
                    {upcomingTrip.pickupAddressLine1}, {upcomingTrip.pickupCity}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-error-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dropoff</p>
                  <p className="font-medium text-gray-900">
                    {upcomingTrip.dropoffAddressLine1}, {upcomingTrip.dropoffCity}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            {upcomingTrip.driver && (
              <div className="p-4 rounded-lg bg-white border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-3">Your Driver</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback>
                        {upcomingTrip.driver.user.firstName[0]}
                        {upcomingTrip.driver.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {upcomingTrip.driver.user.firstName} {upcomingTrip.driver.user.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-warning-500 fill-warning-500" />
                        <span>{upcomingTrip.driver.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
                {upcomingTrip.vehicle && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      {upcomingTrip.vehicle.make} {upcomingTrip.vehicle.model} • {upcomingTrip.vehicle.licensePlate}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link href={`/patient/trips/${upcomingTrip.id}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  View Details
                </Button>
              </Link>
              <Button variant="secondary">
                Cancel Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-12 text-center">
          <Car className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Upcoming Trips</h3>
          <p className="mt-2 text-sm text-gray-500">
            Book a ride when you need transportation to your appointments.
          </p>
          <Link href="/patient/trips/new">
            <Button className="mt-4">
              <Car className="h-4 w-4 mr-2" />
              Book a Ride
            </Button>
          </Link>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Standing Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Regular Rides</CardTitle>
            <Link href="/patient/standing-orders">
              <Button variant="ghost" size="sm">
                Manage
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {standingOrders.length > 0 ? (
              <div className="space-y-3">
                {standingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{order.name}</p>
                      <Badge variant={order.isActive ? 'success' : 'secondary'}>
                        {order.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{order.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{order.pickupCity} → {order.dropoffCity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No regular rides set up</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Trips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Trips</CardTitle>
            <Link href="/patient/trips/history">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pastTrips.length > 0 ? (
              <div className="space-y-3">
                {pastTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(trip.scheduledPickupTime)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {trip.pickupCity} → {trip.dropoffCity}
                      </p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Car className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No past trips yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/patient/trips/new">
              <Button variant="secondary" className="w-full h-auto py-4 flex-col gap-2">
                <Car className="h-6 w-6" />
                <span>Book a Ride</span>
              </Button>
            </Link>
            <Link href="/patient/profile">
              <Button variant="secondary" className="w-full h-auto py-4 flex-col gap-2">
                <User className="h-6 w-6" />
                <span>My Profile</span>
              </Button>
            </Link>
            <Button variant="secondary" className="w-full h-auto py-4 flex-col gap-2">
              <Phone className="h-6 w-6" />
              <span>Call Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
