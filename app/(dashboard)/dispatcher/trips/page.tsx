'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  MapPin,
  Clock,
  User,
  Car,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatTime, formatDate } from '@/lib/utils';

// Mock data
const trips = [
  {
    id: 'TR-20260115-001',
    patient: { name: 'John Smith', phone: '(555) 123-4567' },
    pickup: { address: '123 Main St, Houston, TX', time: '10:30 AM' },
    dropoff: { address: 'Memorial Hospital', time: '11:00 AM' },
    status: 'in-progress',
    driver: { name: 'Mike Johnson', avatar: null },
    vehicleType: 'wheelchair',
    fare: 85.5,
    distance: 12.5,
  },
  {
    id: 'TR-20260115-002',
    patient: { name: 'Mary Jones', phone: '(555) 234-5678' },
    pickup: { address: '456 Oak Ave, Houston, TX', time: '11:00 AM' },
    dropoff: { address: 'Dialysis Center', time: '11:30 AM' },
    status: 'assigned',
    driver: { name: 'Sarah Williams', avatar: null },
    vehicleType: 'wheelchair',
    fare: 65.0,
    distance: 8.2,
  },
  {
    id: 'TR-20260115-003',
    patient: { name: 'Robert Brown', phone: '(555) 345-6789' },
    pickup: { address: '789 Pine Rd, Houston, TX', time: '11:30 AM' },
    dropoff: { address: 'City Clinic', time: '12:00 PM' },
    status: 'pending',
    driver: null,
    vehicleType: 'sedan',
    fare: 45.0,
    distance: 5.5,
  },
  {
    id: 'TR-20260115-004',
    patient: { name: 'Emily Davis', phone: '(555) 456-7890' },
    pickup: { address: '321 Elm St, Houston, TX', time: '12:00 PM' },
    dropoff: { address: 'General Hospital', time: '12:30 PM' },
    status: 'confirmed',
    driver: null,
    vehicleType: 'stretcher',
    fare: 125.0,
    distance: 15.3,
  },
  {
    id: 'TR-20260115-005',
    patient: { name: 'William Taylor', phone: '(555) 567-8901' },
    pickup: { address: '654 Cedar Ln, Houston, TX', time: '1:00 PM' },
    dropoff: { address: 'Sunrise Medical Center', time: '1:30 PM' },
    status: 'driver-arrived',
    driver: { name: 'David Lee', avatar: null },
    vehicleType: 'wheelchair',
    fare: 72.5,
    distance: 9.8,
  },
  {
    id: 'TR-20260115-006',
    patient: { name: 'Jennifer Wilson', phone: '(555) 678-9012' },
    pickup: { address: '987 Birch Dr, Houston, TX', time: '2:00 PM' },
    dropoff: { address: 'Northside Hospital', time: '2:30 PM' },
    status: 'completed',
    driver: { name: 'Lisa Chen', avatar: null },
    vehicleType: 'wheelchair',
    fare: 92.0,
    distance: 11.5,
  },
  {
    id: 'TR-20260115-007',
    patient: { name: 'Michael Anderson', phone: '(555) 789-0123' },
    pickup: { address: '147 Maple St, Houston, TX', time: '2:30 PM' },
    dropoff: { address: 'Rehab Center', time: '3:00 PM' },
    status: 'cancelled',
    driver: null,
    vehicleType: 'bariatric',
    fare: 145.0,
    distance: 18.2,
  },
];

const statusTabs = [
  { value: 'all', label: 'All Trips', count: trips.length },
  { value: 'pending', label: 'Pending', count: trips.filter(t => t.status === 'pending').length },
  { value: 'confirmed', label: 'Confirmed', count: trips.filter(t => t.status === 'confirmed').length },
  { value: 'active', label: 'Active', count: trips.filter(t => ['assigned', 'driver-arrived', 'in-progress'].includes(t.status)).length },
  { value: 'completed', label: 'Completed', count: trips.filter(t => t.status === 'completed').length },
  { value: 'cancelled', label: 'Cancelled', count: trips.filter(t => t.status === 'cancelled').length },
];

export default function TripsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [vehicleFilter, setVehicleFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Filter trips
  const filteredTrips = React.useMemo(() => {
    return trips.filter((trip) => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'active') {
          if (!['assigned', 'driver-arrived', 'in-progress'].includes(trip.status)) {
            return false;
          }
        } else if (trip.status !== statusFilter) {
          return false;
        }
      }

      // Vehicle filter
      if (vehicleFilter !== 'all' && trip.vehicleType !== vehicleFilter) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          trip.id.toLowerCase().includes(query) ||
          trip.patient.name.toLowerCase().includes(query) ||
          trip.pickup.address.toLowerCase().includes(query) ||
          trip.dropoff.address.toLowerCase().includes(query) ||
          (trip.driver?.name.toLowerCase().includes(query) ?? false)
        );
      }

      return true;
    });
  }, [searchQuery, statusFilter, vehicleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trips</h1>
          <p className="text-sm text-gray-500">Manage and track all transportation trips</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/dispatcher/trips/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search trips, patients, drivers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Vehicle Type Filter */}
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="wheelchair">Wheelchair</SelectItem>
                <SelectItem value="stretcher">Stretcher</SelectItem>
                <SelectItem value="bariatric">Bariatric</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh */}
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              {tab.label}
              <Badge variant="secondary" size="sm">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Trips List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Trip / Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Pickup
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Dropoff
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Fare
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dispatcher/trips/${trip.id}`)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {trip.patient.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{trip.patient.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{trip.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">{trip.pickup.address}</p>
                          <p className="text-xs text-gray-500">{trip.pickup.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-error-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">{trip.dropoff.address}</p>
                          <p className="text-xs text-gray-500">{trip.dropoff.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {trip.driver ? (
                        <div className="flex items-center gap-2">
                          <Avatar size="xs">
                            <AvatarFallback>
                              {trip.driver.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">{trip.driver.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={trip.status as 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'}>
                        {trip.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-medium text-gray-900">${trip.fare.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{trip.distance} mi</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Trip</DropdownMenuItem>
                          {!trip.driver && (
                            <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            Cancel Trip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredTrips.length)} of{' '}
                {filteredTrips.length} trips
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {paginatedTrips.length === 0 && (
            <div className="py-12 text-center">
              <Car className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No trips found</h3>
              <p className="mt-2 text-sm text-gray-500">
                No trips match your current filters. Try adjusting your search.
              </p>
              <Button className="mt-4" onClick={() => router.push('/dispatcher/trips/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Trip
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
