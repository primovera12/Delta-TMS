'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Car,
  Search,
  Filter,
  Plus,
  Calendar,
  MapPin,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const trips = [
  {
    id: 'TR-20260115-001',
    patient: 'John Smith',
    patientId: 'PAT-001',
    type: 'Outbound',
    pickupTime: '10:30 AM',
    pickup: 'Memorial Hospital - Main Entrance',
    dropoff: 'Home - 123 Main St',
    status: 'in-progress',
    driver: 'Mike Johnson',
    vehicleType: 'wheelchair',
    appointmentTime: '9:00 AM',
    date: '2026-01-15',
  },
  {
    id: 'TR-20260115-002',
    patient: 'Mary Jones',
    patientId: 'PAT-002',
    type: 'Return',
    pickupTime: '11:00 AM',
    pickup: '456 Oak Ave',
    dropoff: 'Memorial Hospital - ER',
    status: 'assigned',
    driver: 'Sarah Williams',
    vehicleType: 'ambulatory',
    appointmentTime: '11:30 AM',
    date: '2026-01-15',
  },
  {
    id: 'TR-20260115-003',
    patient: 'Robert Brown',
    patientId: 'PAT-003',
    type: 'Outbound',
    pickupTime: '11:30 AM',
    pickup: 'Memorial Hospital - Radiology',
    dropoff: 'City Dialysis Center',
    status: 'pending',
    driver: null,
    vehicleType: 'wheelchair',
    appointmentTime: '12:00 PM',
    date: '2026-01-15',
  },
  {
    id: 'TR-20260115-004',
    patient: 'Emily Davis',
    patientId: 'PAT-004',
    type: 'Return',
    pickupTime: '12:00 PM',
    pickup: '321 Elm St',
    dropoff: 'Memorial Hospital - Cardiology',
    status: 'confirmed',
    driver: 'David Lee',
    vehicleType: 'stretcher',
    appointmentTime: '12:30 PM',
    date: '2026-01-15',
  },
  {
    id: 'TR-20260115-005',
    patient: 'William Taylor',
    patientId: 'PAT-005',
    type: 'Outbound',
    pickupTime: '1:00 PM',
    pickup: 'Memorial Hospital - Oncology',
    dropoff: 'Home - 555 Cedar Lane',
    status: 'completed',
    driver: 'Lisa Chen',
    vehicleType: 'ambulatory',
    appointmentTime: '10:00 AM',
    date: '2026-01-15',
  },
];

const statusVariants: Record<string, 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'success' | 'destructive'> = {
  pending: 'pending',
  confirmed: 'confirmed',
  assigned: 'assigned',
  'in-progress': 'in-progress',
  completed: 'success',
  cancelled: 'destructive',
};

export default function FacilityTripsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('today');

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tripCounts = {
    all: trips.length,
    pending: trips.filter((t) => t.status === 'pending').length,
    active: trips.filter((t) => ['assigned', 'in-progress'].includes(t.status)).length,
    completed: trips.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Transport Requests</h1>
          <p className="text-sm text-gray-500">Manage patient transport requests</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/facility/trips/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Book Transport
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by patient or trip ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v === 'all' ? 'all' : v)}>
        <TabsList>
          <TabsTrigger value="all">All ({tripCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({tripCounts.pending})</TabsTrigger>
          <TabsTrigger value="active">Active ({tripCounts.active})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tripCounts.completed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.length === 0 ? (
          <Card className="py-12 text-center">
            <Car className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No trips found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'No trips for the selected filters'}
            </p>
          </Card>
        ) : (
          filteredTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Main Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar size="lg">
                          <AvatarFallback>
                            {trip.patient.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{trip.patient}</h3>
                            <Badge variant={statusVariants[trip.status]}>
                              {trip.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-mono">{trip.id}</span>
                            <span>•</span>
                            <span className={trip.type === 'Outbound' ? 'text-primary-600' : 'text-success-600'}>
                              {trip.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{trip.pickupTime}</p>
                        <p className="text-sm text-gray-500">Pickup</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-3 w-3 text-success-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">From</p>
                          <p className="text-sm text-gray-500">{trip.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-3 w-3 text-error-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">To</p>
                          <p className="text-sm text-gray-500">{trip.dropoff}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Appt: {trip.appointmentTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Car className="h-4 w-4" />
                        <span className="capitalize">{trip.vehicleType}</span>
                      </div>
                      {trip.driver && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Driver: {trip.driver}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50 lg:w-48">
                    <Link href={`/facility/trips/${trip.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {trip.status === 'pending' && (
                      <Button variant="secondary" size="sm" className="flex-1">
                        Cancel
                      </Button>
                    )}
                    {trip.driver && (
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Call Driver</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing 1 to {filteredTrips.length} of {filteredTrips.length} trips
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
