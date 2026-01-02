'use client';

import * as React from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Car,
  User,
  Plus,
  Filter,
  List,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Generate mock schedule data
const generateScheduleData = () => {
  const hours = [];
  for (let h = 6; h < 22; h++) {
    hours.push({
      hour: h,
      label: h <= 12 ? `${h}:00 AM` : `${h - 12}:00 PM`,
    });
  }
  return hours;
};

const scheduleHours = generateScheduleData();

const scheduledTrips = [
  {
    id: 'TR-20260115-001',
    patient: 'John Smith',
    startHour: 10,
    duration: 1, // hours
    pickup: '123 Main St',
    dropoff: 'Memorial Hospital',
    driver: 'Mike Johnson',
    vehicleType: 'wheelchair',
    status: 'in-progress',
  },
  {
    id: 'TR-20260115-002',
    patient: 'Mary Jones',
    startHour: 11,
    duration: 0.5,
    pickup: '456 Oak Ave',
    dropoff: 'Dialysis Center',
    driver: 'Sarah Williams',
    vehicleType: 'ambulatory',
    status: 'assigned',
  },
  {
    id: 'TR-20260115-003',
    patient: 'Robert Brown',
    startHour: 8,
    duration: 0.5,
    pickup: '789 Pine Rd',
    dropoff: 'City Dialysis Center',
    driver: 'John Smith',
    vehicleType: 'wheelchair',
    status: 'completed',
  },
  {
    id: 'TR-20260115-004',
    patient: 'Emily Davis',
    startHour: 14,
    duration: 1,
    pickup: '321 Elm St',
    dropoff: 'Cancer Center',
    driver: 'David Lee',
    vehicleType: 'stretcher',
    status: 'confirmed',
  },
  {
    id: 'TR-20260115-005',
    patient: 'William Taylor',
    startHour: 9,
    duration: 0.5,
    pickup: '555 Cedar Lane',
    dropoff: 'Heart Center',
    driver: null,
    vehicleType: 'ambulatory',
    status: 'pending',
  },
  {
    id: 'TR-20260115-006',
    patient: 'Patricia Wilson',
    startHour: 15,
    duration: 0.5,
    pickup: '777 Maple Dr',
    dropoff: 'General Hospital',
    driver: 'Mike Johnson',
    vehicleType: 'wheelchair',
    status: 'assigned',
  },
];

const drivers = [
  { id: 'DRV-001', name: 'John Smith', status: 'available' },
  { id: 'DRV-002', name: 'Mike Johnson', status: 'on-trip' },
  { id: 'DRV-003', name: 'Sarah Williams', status: 'available' },
  { id: 'DRV-004', name: 'David Lee', status: 'available' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-warning-100 border-warning-300 text-warning-800',
  confirmed: 'bg-info-100 border-info-300 text-info-800',
  assigned: 'bg-primary-100 border-primary-300 text-primary-800',
  'in-progress': 'bg-success-100 border-success-300 text-success-800',
  completed: 'bg-gray-100 border-gray-300 text-gray-600',
};

export default function DispatcherSchedulePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'timeline' | 'list'>('timeline');
  const [driverFilter, setDriverFilter] = React.useState<string>('all');

  const filteredTrips = scheduledTrips.filter((trip) => {
    if (driverFilter === 'all') return true;
    if (driverFilter === 'unassigned') return !trip.driver;
    return trip.driver === driverFilter;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const goToPreviousDay = () => {
    setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const goToNextDay = () => {
    setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500">View and manage daily trip schedule</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'timeline' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/dispatcher/trips/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="ghost" size="sm" onClick={goToNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-semibold text-gray-900">{formatDate(currentDate)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={driverFilter} onValueChange={setDriverFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.name}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="info">
                {filteredTrips.length} trips
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule View */}
      {viewMode === 'timeline' ? (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Time Header */}
              <div className="flex border-b border-gray-200">
                <div className="w-24 flex-shrink-0 p-3 bg-gray-50 border-r border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Time</span>
                </div>
                <div className="flex-1 p-3 bg-gray-50">
                  <span className="text-sm font-medium text-gray-500">Trips</span>
                </div>
              </div>

              {/* Time Slots */}
              {scheduleHours.map((timeSlot) => {
                const tripsInSlot = filteredTrips.filter(
                  (trip) => trip.startHour === timeSlot.hour
                );

                return (
                  <div
                    key={timeSlot.hour}
                    className="flex border-b border-gray-100 min-h-[60px]"
                  >
                    <div className="w-24 flex-shrink-0 p-3 border-r border-gray-100 bg-gray-50">
                      <span className="text-sm text-gray-600">{timeSlot.label}</span>
                    </div>
                    <div className="flex-1 p-2 flex gap-2 flex-wrap">
                      {tripsInSlot.map((trip) => (
                        <div
                          key={trip.id}
                          className={`p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${statusColors[trip.status]}`}
                          style={{
                            minWidth: '200px',
                            maxWidth: '300px',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm truncate">
                              {trip.patient}
                            </span>
                            <Badge variant="secondary" size="sm">
                              {trip.vehicleType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs opacity-80">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">
                              {trip.pickup} → {trip.dropoff}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span>{trip.driver || 'Unassigned'}</span>
                            <span className="font-mono">{trip.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTrips
            .sort((a, b) => a.startHour - b.startHour)
            .map((trip) => (
              <Card key={trip.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-bold text-gray-900">
                          {trip.startHour <= 12
                            ? `${trip.startHour}:00`
                            : `${trip.startHour - 12}:00`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {trip.startHour < 12 ? 'AM' : 'PM'}
                        </p>
                      </div>
                      <div className="h-12 w-px bg-gray-200" />
                      <Avatar>
                        <AvatarFallback>
                          {trip.patient.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{trip.patient}</p>
                          <Badge
                            variant={
                              trip.status === 'pending'
                                ? 'pending'
                                : trip.status === 'confirmed'
                                ? 'confirmed'
                                : trip.status === 'assigned'
                                ? 'assigned'
                                : trip.status === 'in-progress'
                                ? 'in-progress'
                                : 'success'
                            }
                          >
                            {trip.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {trip.pickup} → {trip.dropoff}
                          </span>
                          <span className="flex items-center gap-1">
                            <Car className="h-3.5 w-3.5" />
                            {trip.vehicleType}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {trip.driver || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Driver Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Driver Load</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {drivers.map((driver) => {
              const driverTrips = scheduledTrips.filter((t) => t.driver === driver.name);
              return (
                <div
                  key={driver.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {driver.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <Badge
                        variant={driver.status === 'available' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {driver.status === 'on-trip' ? 'On Trip' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned</span>
                      <span className="font-medium text-gray-900">{driverTrips.length} trips</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed</span>
                      <span className="font-medium text-gray-900">
                        {driverTrips.filter((t) => t.status === 'completed').length} trips
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
