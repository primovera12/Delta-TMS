'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Car,
  RefreshCw,
  Search,
  Phone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load LiveMap component to reduce initial bundle size
const LiveMap = dynamic(() => import('@/components/domain/live-map').then(mod => mod.LiveMap), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-gray-200 bg-gray-50 animate-pulse" style={{ height: '600px' }}>
      <div className="flex items-center justify-center h-full">
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  ),
});

// Mock data
const drivers = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    status: 'available' as const,
    location: { lat: 29.7604, lng: -95.3698 },
    phone: '(555) 123-4567',
    vehicle: '2022 Toyota Sienna',
    vehicleType: 'wheelchair',
    lastUpdate: '2 min ago',
  },
  {
    id: 'DRV-002',
    name: 'Mike Johnson',
    status: 'on-trip' as const,
    location: { lat: 29.7555, lng: -95.3555 },
    currentTripId: 'TR-20260115-012',
    phone: '(555) 345-6789',
    vehicle: '2023 Ford Transit',
    vehicleType: 'stretcher',
    lastUpdate: '1 min ago',
  },
  {
    id: 'DRV-003',
    name: 'Sarah Williams',
    status: 'available' as const,
    location: { lat: 29.7508, lng: -95.4608 },
    phone: '(555) 456-7890',
    vehicle: '2024 Toyota Sienna',
    vehicleType: 'wheelchair',
    lastUpdate: '3 min ago',
  },
  {
    id: 'DRV-004',
    name: 'David Lee',
    status: 'offline' as const,
    location: { lat: 29.7400, lng: -95.3800 },
    phone: '(555) 567-8901',
    vehicle: '2021 Dodge Grand Caravan',
    vehicleType: 'ambulatory',
    lastUpdate: '45 min ago',
  },
];

const activeTrips = [
  {
    id: 'TR-20260115-012',
    patient: 'John Smith',
    driver: 'Mike Johnson',
    status: 'in-progress',
    pickup: { address: '123 Main St', lat: 29.7604, lng: -95.3698 },
    dropoff: { address: 'Memorial Hospital', lat: 29.7108, lng: -95.3978 },
    pickupTime: '10:30 AM',
    eta: '5 min',
  },
  {
    id: 'TR-20260115-015',
    patient: 'Mary Jones',
    driver: 'Sarah Williams',
    status: 'assigned',
    pickup: { address: '456 Oak Ave', lat: 29.7555, lng: -95.3555 },
    dropoff: { address: 'Dialysis Center', lat: 29.7508, lng: -95.4608 },
    pickupTime: '11:00 AM',
    eta: '15 min',
  },
];

export default function DispatcherMapPage() {
  const [selectedDriver, setSelectedDriver] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDriverClick = (driver: (typeof drivers)[0]) => {
    setSelectedDriver(driver.id === selectedDriver ? null : driver.id);
  };

  const selectedDriverData = drivers.find((d) => d.id === selectedDriver);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Live Map</h1>
          <p className="text-sm text-gray-500">Real-time view of drivers and active trips</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <LiveMap
            drivers={filteredDrivers}
            trips={activeTrips}
            onDriverClick={handleDriverClick}
            height="600px"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="on-trip">On Trip</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Selected Driver Details */}
          {selectedDriverData && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Driver Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {selectedDriverData.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedDriverData.name}</h3>
                    <Badge
                      variant={
                        selectedDriverData.status === 'available'
                          ? 'success'
                          : selectedDriverData.status === 'on-trip'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {selectedDriverData.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>{selectedDriverData.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{selectedDriverData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Updated {selectedDriverData.lastUpdate}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" className="flex-1">
                    Assign Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Trips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-lg">Active Trips</CardTitle>
              <Badge variant="in-progress">{activeTrips.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{trip.patient}</span>
                    <Badge variant="in-progress" size="sm">
                      ETA: {trip.eta}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-success-600" />
                      <span className="truncate">{trip.pickup.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-error-600" />
                      <span className="truncate">{trip.dropoff.address}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Driver: {trip.driver}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Driver List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-lg">Drivers</CardTitle>
              <Badge variant="success">
                {drivers.filter((d) => d.status === 'available').length} available
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => handleDriverClick(driver)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedDriver === driver.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {driver.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.vehicleType}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        driver.status === 'available'
                          ? 'success'
                          : driver.status === 'on-trip'
                          ? 'warning'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {driver.status === 'on-trip' ? 'On Trip' : driver.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
