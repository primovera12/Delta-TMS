'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  MapPin,
  Star,
  Car,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const drivers = [
  {
    id: '1',
    name: 'Mike Johnson',
    phone: '(555) 111-2222',
    email: 'mike.johnson@delta.com',
    status: 'online',
    currentLocation: 'Downtown Houston',
    vehicle: { make: 'Toyota', model: 'Sienna', year: 2022, type: 'wheelchair' },
    rating: 4.8,
    totalTrips: 234,
    todayTrips: 5,
    nextTrip: { time: '11:00 AM', location: 'Memorial Hospital' },
  },
  {
    id: '2',
    name: 'Sarah Williams',
    phone: '(555) 222-3333',
    email: 'sarah.williams@delta.com',
    status: 'on-trip',
    currentLocation: 'En route to Dialysis Center',
    vehicle: { make: 'Ford', model: 'Transit', year: 2021, type: 'wheelchair' },
    rating: 4.9,
    totalTrips: 312,
    todayTrips: 3,
    currentTrip: { patient: 'Mary Jones', destination: 'Dialysis Center' },
  },
  {
    id: '3',
    name: 'David Lee',
    phone: '(555) 333-4444',
    email: 'david.lee@delta.com',
    status: 'available',
    currentLocation: 'Midtown',
    vehicle: { make: 'Dodge', model: 'Grand Caravan', year: 2020, type: 'wheelchair' },
    rating: 4.7,
    totalTrips: 189,
    todayTrips: 4,
    nextTrip: null,
  },
  {
    id: '4',
    name: 'Lisa Chen',
    phone: '(555) 444-5555',
    email: 'lisa.chen@delta.com',
    status: 'on-trip',
    currentLocation: 'Northside',
    vehicle: { make: 'Mercedes', model: 'Sprinter', year: 2023, type: 'stretcher' },
    rating: 4.9,
    totalTrips: 156,
    todayTrips: 6,
    currentTrip: { patient: 'William Taylor', destination: 'Sunrise Medical Center' },
  },
  {
    id: '5',
    name: 'James Wilson',
    phone: '(555) 555-6666',
    email: 'james.wilson@delta.com',
    status: 'break',
    currentLocation: 'West End',
    vehicle: { make: 'Toyota', model: 'Sienna', year: 2021, type: 'wheelchair' },
    rating: 4.6,
    totalTrips: 98,
    todayTrips: 2,
    nextTrip: { time: '12:30 PM', location: 'General Hospital' },
  },
  {
    id: '6',
    name: 'Jennifer Martinez',
    phone: '(555) 666-7777',
    email: 'jennifer.martinez@delta.com',
    status: 'offline',
    currentLocation: null,
    vehicle: { make: 'Ford', model: 'Transit', year: 2022, type: 'bariatric' },
    rating: 4.8,
    totalTrips: 145,
    todayTrips: 0,
    nextTrip: null,
  },
];

const statusFilters = [
  { value: 'all', label: 'All Drivers', count: drivers.length },
  { value: 'online', label: 'Online', count: drivers.filter(d => d.status !== 'offline').length },
  { value: 'available', label: 'Available', count: drivers.filter(d => ['online', 'available'].includes(d.status)).length },
  { value: 'on-trip', label: 'On Trip', count: drivers.filter(d => d.status === 'on-trip').length },
  { value: 'offline', label: 'Offline', count: drivers.filter(d => d.status === 'offline').length },
];

export default function DriversPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [vehicleFilter, setVehicleFilter] = React.useState('all');

  const filteredDrivers = React.useMemo(() => {
    return drivers.filter((driver) => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'online' && driver.status === 'offline') return false;
        if (statusFilter === 'available' && !['online', 'available'].includes(driver.status)) return false;
        if (statusFilter === 'on-trip' && driver.status !== 'on-trip') return false;
        if (statusFilter === 'offline' && driver.status !== 'offline') return false;
      }

      // Vehicle filter
      if (vehicleFilter !== 'all' && driver.vehicle.type !== vehicleFilter) {
        return false;
      }

      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          driver.name.toLowerCase().includes(query) ||
          driver.phone.includes(query) ||
          driver.email.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, statusFilter, vehicleFilter]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'success' | 'warning' | 'error' | 'info' | 'secondary'; label: string }> = {
      online: { variant: 'success', label: 'Online' },
      available: { variant: 'success', label: 'Available' },
      'on-trip': { variant: 'info', label: 'On Trip' },
      break: { variant: 'warning', label: 'On Break' },
      offline: { variant: 'secondary', label: 'Offline' },
    };
    return badges[status] || { variant: 'secondary', label: status };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Drivers</h1>
          <p className="text-sm text-gray-500">Manage and track driver availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-success-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter(d => d.status !== 'offline').length}
              </p>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
              <Car className="h-5 w-5 text-info-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter(d => d.status === 'on-trip').length}
              </p>
              <p className="text-sm text-gray-500">On Trip</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-gray-500">Avg Rating</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Car className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.reduce((acc, d) => acc + d.todayTrips, 0)}
              </p>
              <p className="text-sm text-gray-500">Trips Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search drivers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="wheelchair">Wheelchair</SelectItem>
                <SelectItem value="stretcher">Stretcher</SelectItem>
                <SelectItem value="bariatric">Bariatric</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {statusFilters.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value} className="flex items-center gap-2">
              {filter.label}
              <Badge variant="secondary" size="sm">
                {filter.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Drivers List */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredDrivers.map((driver) => {
          const statusBadge = getStatusBadge(driver.status);

          return (
            <Card key={driver.id} className="p-4" interactive>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar
                    size="lg"
                    status={
                      driver.status === 'offline'
                        ? 'offline'
                        : driver.status === 'on-trip'
                        ? 'busy'
                        : 'online'
                    }
                  >
                    <AvatarFallback>
                      {driver.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                      <Badge variant={statusBadge.variant} size="sm" dot>
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {driver.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-warning-500" />
                        {driver.rating}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <Car className="h-3.5 w-3.5" />
                      <span>
                        {driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}
                      </span>
                      <Badge variant="secondary" size="sm" className="ml-1">
                        {driver.vehicle.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>View Schedule</DropdownMenuItem>
                    <DropdownMenuItem>Assign Trip</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>Call Driver</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Current Location or Trip */}
              <div className="mt-4 p-3 rounded-lg bg-gray-50">
                {driver.status === 'on-trip' && driver.currentTrip ? (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Current Trip</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {driver.currentTrip.patient} → {driver.currentTrip.destination}
                    </p>
                  </div>
                ) : driver.currentLocation ? (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{driver.currentLocation}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Location unavailable</p>
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm">
                  <span className="text-gray-500">Today:</span>{' '}
                  <span className="font-medium text-gray-900">{driver.todayTrips} trips</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Total:</span>{' '}
                  <span className="font-medium text-gray-900">{driver.totalTrips} trips</span>
                </div>
                {driver.nextTrip && (
                  <div className="text-sm">
                    <span className="text-gray-500">Next:</span>{' '}
                    <span className="font-medium text-gray-900">{driver.nextTrip.time}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDrivers.length === 0 && (
        <Card className="py-12 text-center">
          <Car className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No drivers found</h3>
          <p className="mt-2 text-sm text-gray-500">
            No drivers match your current filters.
          </p>
        </Card>
      )}
    </div>
  );
}
