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
  CheckCircle,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const trips = [
  {
    id: 'TR-20260116-012',
    date: '2026-01-16',
    displayDate: 'Tomorrow',
    pickupTime: '10:30 AM',
    appointmentTime: '11:00 AM',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'Memorial Hospital',
    driver: 'Mike Johnson',
    driverRating: 4.9,
    vehicleType: 'wheelchair',
    status: 'confirmed',
    isUpcoming: true,
  },
  {
    id: 'TR-20260118-008',
    date: '2026-01-18',
    displayDate: 'Saturday, Jan 18',
    pickupTime: '8:00 AM',
    appointmentTime: '8:30 AM',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'City Dialysis Center',
    driver: null,
    driverRating: null,
    vehicleType: 'wheelchair',
    status: 'pending',
    isUpcoming: true,
  },
  {
    id: 'TR-20260113-008',
    date: '2026-01-13',
    displayDate: 'January 13, 2026',
    pickupTime: '8:00 AM',
    appointmentTime: '8:30 AM',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'City Dialysis Center',
    driver: 'Sarah Williams',
    driverRating: 5,
    vehicleType: 'wheelchair',
    status: 'completed',
    rating: 5,
    isUpcoming: false,
  },
  {
    id: 'TR-20260110-015',
    date: '2026-01-10',
    displayDate: 'January 10, 2026',
    pickupTime: '2:00 PM',
    appointmentTime: '2:30 PM',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'City Clinic',
    driver: 'David Lee',
    driverRating: 4.8,
    vehicleType: 'ambulatory',
    status: 'completed',
    rating: 4,
    isUpcoming: false,
  },
  {
    id: 'TR-20260108-022',
    date: '2026-01-08',
    displayDate: 'January 8, 2026',
    pickupTime: '11:00 AM',
    appointmentTime: '11:30 AM',
    pickup: 'Heart Center',
    dropoff: '123 Main St, Houston, TX',
    driver: 'Mike Johnson',
    driverRating: 4.9,
    vehicleType: 'wheelchair',
    status: 'completed',
    rating: 5,
    isUpcoming: false,
  },
];

const statusVariants: Record<string, 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'success'> = {
  pending: 'pending',
  confirmed: 'confirmed',
  assigned: 'assigned',
  'in-progress': 'in-progress',
  completed: 'success',
};

export default function PatientTripsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('upcoming');

  const upcomingTrips = trips.filter((trip) => trip.isUpcoming);
  const pastTrips = trips.filter((trip) => !trip.isUpcoming);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Trips</h1>
          <p className="text-sm text-gray-500">View your upcoming and past rides</p>
        </div>
        <Link href="/patient/trips/new">
          <Button>
            <Car className="h-4 w-4 mr-2" />
            Book a Ride
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingTrips.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({pastTrips.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingTrips.length === 0 ? (
            <Card className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Upcoming Trips</h3>
              <p className="mt-2 text-sm text-gray-500">
                Book a ride when you need transportation.
              </p>
              <Link href="/patient/trips/new">
                <Button className="mt-4">Book a Ride</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <Card key={trip.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <p className="text-lg font-semibold text-gray-900">{trip.displayDate}</p>
                          <Badge variant={statusVariants[trip.status]}>
                            {trip.status}
                          </Badge>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {/* Times */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Pickup:</span>
                              <span className="font-medium text-gray-900">{trip.pickupTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Appointment:</span>
                              <span className="font-medium text-gray-900">{trip.appointmentTime}</span>
                            </div>
                          </div>

                          {/* Route */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-success-600 mt-0.5" />
                              <span className="text-gray-600">{trip.pickup}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-error-600 mt-0.5" />
                              <span className="text-gray-600">{trip.dropoff}</span>
                            </div>
                          </div>
                        </div>

                        {/* Driver */}
                        {trip.driver && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <Avatar size="sm">
                                <AvatarFallback>
                                  {trip.driver.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{trip.driver}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Star className="h-3 w-3 text-warning-500 fill-warning-500" />
                                  <span>{trip.driverRating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Link href={`/patient/trips/${trip.id}`} className="flex-1">
                          <Button variant="secondary" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="secondary" size="sm" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {pastTrips.length === 0 ? (
            <Card className="py-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Trip History</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your completed trips will appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastTrips.map((trip) => (
                <Card key={trip.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-success-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{trip.displayDate}</p>
                          <p className="text-sm text-gray-500">
                            {trip.pickup} → {trip.dropoff}
                          </p>
                          <p className="text-sm text-gray-500">Driver: {trip.driver}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {trip.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: trip.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-warning-500 fill-warning-500"
                              />
                            ))}
                          </div>
                        )}
                        <Link href={`/patient/trips/${trip.id}`}>
                          <Button variant="ghost" size="sm">
                            Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
