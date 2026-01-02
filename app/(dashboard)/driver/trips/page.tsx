'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Car,
  Clock,
  MapPin,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle,
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
    id: 'TR-20260115-012',
    patient: {
      name: 'John Smith',
      phone: '(555) 123-4567',
    },
    pickup: {
      address: '123 Main St, Houston, TX 77001',
      time: '10:30 AM',
    },
    dropoff: {
      address: 'Memorial Hospital, 6400 Fannin St',
      time: '11:00 AM',
    },
    status: 'in_progress',
    vehicleType: 'wheelchair',
    specialNeeds: ['wheelchair', 'oxygen'],
    fare: 85.50,
    date: '2026-01-15',
  },
  {
    id: 'TR-20260115-015',
    patient: {
      name: 'Mary Jones',
      phone: '(555) 234-5678',
    },
    pickup: {
      address: '456 Oak Ave, Houston, TX 77002',
      time: '11:30 AM',
    },
    dropoff: {
      address: 'Dialysis Center, 2100 West Loop',
      time: '12:00 PM',
    },
    status: 'assigned',
    vehicleType: 'ambulatory',
    specialNeeds: [],
    fare: 65.00,
    date: '2026-01-15',
  },
  {
    id: 'TR-20260115-018',
    patient: {
      name: 'Robert Brown',
      phone: '(555) 345-6789',
    },
    pickup: {
      address: '789 Pine Rd, Houston, TX 77003',
      time: '1:00 PM',
    },
    dropoff: {
      address: 'City Clinic, 500 Main St',
      time: '1:30 PM',
    },
    status: 'assigned',
    vehicleType: 'wheelchair',
    specialNeeds: ['wheelchair'],
    fare: 55.00,
    date: '2026-01-15',
  },
  {
    id: 'TR-20260115-022',
    patient: {
      name: 'Emily Davis',
      phone: '(555) 456-7890',
    },
    pickup: {
      address: '321 Elm St, Houston, TX 77004',
      time: '2:30 PM',
    },
    dropoff: {
      address: 'General Hospital, 1200 Med Center Dr',
      time: '3:00 PM',
    },
    status: 'assigned',
    vehicleType: 'stretcher',
    specialNeeds: ['stretcher', 'attendant'],
    fare: 125.00,
    date: '2026-01-15',
  },
  {
    id: 'TR-20260114-045',
    patient: {
      name: 'William Taylor',
      phone: '(555) 567-8901',
    },
    pickup: {
      address: '555 Cedar Lane, Houston, TX 77005',
      time: '9:00 AM',
    },
    dropoff: {
      address: 'Specialty Clinic, 800 Rice Blvd',
      time: '9:30 AM',
    },
    status: 'completed',
    vehicleType: 'ambulatory',
    specialNeeds: [],
    fare: 45.00,
    date: '2026-01-14',
  },
  {
    id: 'TR-20260114-048',
    patient: {
      name: 'Patricia Wilson',
      phone: '(555) 678-9012',
    },
    pickup: {
      address: '777 Maple Dr, Houston, TX 77006',
      time: '10:30 AM',
    },
    dropoff: {
      address: 'Heart Center, 900 Texas Ave',
      time: '11:00 AM',
    },
    status: 'completed',
    vehicleType: 'wheelchair',
    specialNeeds: ['wheelchair'],
    fare: 65.00,
    date: '2026-01-14',
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'in-progress';
    case 'assigned':
      return 'assigned';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    case 'assigned':
      return 'Assigned';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export default function DriverTripsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('today');

  const todayTrips = trips.filter((trip) => trip.date === '2026-01-15');
  const pastTrips = trips.filter((trip) => trip.date !== '2026-01-15');

  const filteredTodayTrips = todayTrips.filter(
    (trip) =>
      trip.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoff.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPastTrips = pastTrips.filter(
    (trip) =>
      trip.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoff.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Trips</h1>
          <p className="text-sm text-gray-500">View and manage your assigned trips</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">
            Today ({todayTrips.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({pastTrips.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <div className="space-y-4">
            {filteredTodayTrips.length === 0 ? (
              <Card className="py-12 text-center">
                <Car className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No trips found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'No trips scheduled for today'}
                </p>
              </Card>
            ) : (
              filteredTodayTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {filteredPastTrips.length === 0 ? (
              <Card className="py-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No trip history</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Your completed trips will appear here'}
                </p>
              </Card>
            ) : (
              filteredPastTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} showDate />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TripCard({
  trip,
  showDate = false,
}: {
  trip: (typeof trips)[0];
  showDate?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarFallback>
                    {trip.patient.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{trip.patient.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{trip.id}</p>
                </div>
              </div>
              <Badge variant={getStatusVariant(trip.status) as any}>
                {getStatusLabel(trip.status)}
              </Badge>
            </div>

            {/* Route */}
            <div className="space-y-3">
              {/* Pickup */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full bg-success-100 flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-success-600" />
                  </div>
                  <div className="flex-1 w-px bg-gray-200 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    <p className="text-sm text-gray-600">{trip.pickup.time}</p>
                  </div>
                  <p className="text-sm text-gray-500">{trip.pickup.address}</p>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full bg-error-100 flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-error-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Dropoff</p>
                    <p className="text-sm text-gray-600">{trip.dropoff.time}</p>
                  </div>
                  <p className="text-sm text-gray-500">{trip.dropoff.address}</p>
                </div>
              </div>
            </div>

            {/* Special Needs */}
            {trip.specialNeeds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {trip.specialNeeds.map((need) => (
                  <Badge key={need} variant="info" size="sm">
                    {need}
                  </Badge>
                ))}
              </div>
            )}

            {/* Date for history */}
            {showDate && (
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(trip.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="flex lg:flex-col gap-2 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50">
            {trip.status !== 'completed' && trip.status !== 'cancelled' && (
              <>
                <Button variant="secondary" size="sm" className="flex-1 lg:flex-none">
                  <Phone className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Call</span>
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 lg:flex-none">
                  <Navigation className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Navigate</span>
                </Button>
              </>
            )}
            <Link href={`/driver/trips/${trip.id}`} className="flex-1 lg:flex-none">
              <Button variant="secondary" size="sm" className="w-full">
                <span>Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
