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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock data
const upcomingTrip = {
  id: 'TR-20260115-012',
  date: 'Tomorrow, January 16',
  pickupTime: '10:30 AM',
  appointmentTime: '11:00 AM',
  pickup: {
    address: '123 Main St, Houston, TX 77001',
    instructions: 'Wait at front door',
  },
  dropoff: {
    address: 'Memorial Hospital, 6400 Fannin St',
    department: 'Cardiology, 3rd Floor',
  },
  driver: {
    name: 'Mike Johnson',
    phone: '(555) 123-4567',
    rating: 4.9,
    vehicle: '2022 Toyota Sienna',
    licensePlate: 'ABC-1234',
  },
  vehicleType: 'wheelchair',
  status: 'confirmed',
};

const pastTrips = [
  {
    id: 'TR-20260113-008',
    date: 'January 13, 2026',
    pickup: '123 Main St',
    dropoff: 'Dialysis Center',
    driver: 'Sarah Williams',
    status: 'completed',
    rating: 5,
  },
  {
    id: 'TR-20260110-015',
    date: 'January 10, 2026',
    pickup: '123 Main St',
    dropoff: 'City Clinic',
    driver: 'David Lee',
    status: 'completed',
    rating: 4,
  },
  {
    id: 'TR-20260108-022',
    date: 'January 8, 2026',
    pickup: 'Heart Center',
    dropoff: '123 Main St',
    driver: 'Mike Johnson',
    status: 'completed',
    rating: 5,
  },
];

const standingOrders = [
  {
    id: 'SO-001',
    type: 'Dialysis',
    schedule: 'Mon, Wed, Fri at 8:00 AM',
    destination: 'City Dialysis Center',
    active: true,
  },
];

export default function PatientDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, John</h1>
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
      {upcomingTrip && (
        <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                Upcoming Trip
              </CardTitle>
              <Badge variant="confirmed">Confirmed</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date and Time */}
            <div className="flex items-center gap-4 text-lg">
              <span className="font-semibold text-gray-900">{upcomingTrip.date}</span>
              <span className="text-primary-600 font-bold">{upcomingTrip.pickupTime}</span>
            </div>

            {/* Route */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium text-gray-900">{upcomingTrip.pickup.address}</p>
                  {upcomingTrip.pickup.instructions && (
                    <p className="text-sm text-gray-500">{upcomingTrip.pickup.instructions}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-error-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dropoff</p>
                  <p className="font-medium text-gray-900">{upcomingTrip.dropoff.address}</p>
                  <p className="text-sm text-gray-500">{upcomingTrip.dropoff.department}</p>
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-info-50">
              <Clock className="h-5 w-5 text-info-600" />
              <p className="text-sm text-info-700">
                Appointment at <span className="font-semibold">{upcomingTrip.appointmentTime}</span>
              </p>
            </div>

            {/* Driver Info */}
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-3">Your Driver</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {upcomingTrip.driver.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{upcomingTrip.driver.name}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-warning-500 fill-warning-500" />
                      <span>{upcomingTrip.driver.rating}</span>
                    </div>
                  </div>
                </div>
                <Button variant="secondary">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {upcomingTrip.driver.vehicle} • {upcomingTrip.driver.licensePlate}
                </p>
              </div>
            </div>

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
      )}

      {!upcomingTrip && (
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
                      <p className="font-medium text-gray-900">{order.type}</p>
                      <Badge variant={order.active ? 'success' : 'secondary'}>
                        {order.active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{order.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{order.destination}</span>
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
            <Link href="/patient/history">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{trip.date}</p>
                    <p className="text-sm text-gray-500">
                      {trip.pickup} → {trip.dropoff}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: trip.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-warning-500 fill-warning-500"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
