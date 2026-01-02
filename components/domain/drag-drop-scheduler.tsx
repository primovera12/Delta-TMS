'use client';

import * as React from 'react';
import {
  Clock,
  User,
  MapPin,
  Car,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';

interface Trip {
  id: string;
  patientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  tripType: string;
  status: string;
  estimatedDuration: number;
}

interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  status: 'available' | 'on-trip' | 'offline';
  trips: Trip[];
}

interface DragDropSchedulerProps {
  drivers: Driver[];
  date: Date;
  onTripMove?: (tripId: string, fromDriverId: string, toDriverId: string, newTime: string) => void;
  onTripClick?: (trip: Trip) => void;
  onDateChange?: (date: Date) => void;
}

// Time slots from 5 AM to 10 PM
const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 5;
  return {
    hour,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
    value: `${hour.toString().padStart(2, '0')}:00`,
  };
});

export function DragDropScheduler({
  drivers,
  date,
  onTripMove,
  onTripClick,
  onDateChange,
}: DragDropSchedulerProps) {
  const [draggedTrip, setDraggedTrip] = React.useState<{
    trip: Trip;
    driverId: string;
  } | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{
    driverId: string;
    hour: number;
  } | null>(null);

  const handleDragStart = (trip: Trip, driverId: string) => {
    setDraggedTrip({ trip, driverId });
  };

  const handleDragEnd = () => {
    if (draggedTrip && dropTarget && onTripMove) {
      const newTime = `${dropTarget.hour.toString().padStart(2, '0')}:00`;
      onTripMove(draggedTrip.trip.id, draggedTrip.driverId, dropTarget.driverId, newTime);
    }
    setDraggedTrip(null);
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, driverId: string, hour: number) => {
    e.preventDefault();
    setDropTarget({ driverId, hour });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const getTripsForSlot = (driverTrips: Trip[], hour: number) => {
    return driverTrips.filter((trip) => {
      const tripHour = parseInt(trip.pickupTime.split(':')[0]);
      return tripHour === hour;
    });
  };

  const getTripPosition = (trip: Trip) => {
    const [hours, minutes] = trip.pickupTime.split(':').map(Number);
    const startMinutes = (hours - 5) * 60 + minutes; // Minutes from 5 AM
    const durationMinutes = trip.estimatedDuration || 60;

    return {
      left: `${(startMinutes / 60) * 100}%`,
      width: `${(durationMinutes / 60) * 100}%`,
    };
  };

  const navigateDay = (direction: 'prev' | 'next' | 'today') => {
    if (!onDateChange) return;
    if (direction === 'today') {
      onDateChange(new Date());
    } else {
      const days = direction === 'prev' ? -1 : 1;
      onDateChange(new Date(date.getTime() + days * 24 * 60 * 60 * 1000));
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigateDay('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigateDay('today')}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigateDay('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="font-semibold text-gray-900">{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <GripVertical className="h-4 w-4" />
          <span>Drag trips to reschedule</span>
        </div>
      </div>

      {/* Scheduler Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Time Header */}
            <div className="flex border-b border-gray-200">
              <div className="w-48 flex-shrink-0 p-3 bg-gray-50 border-r border-gray-200">
                <span className="text-xs font-medium text-gray-500 uppercase">Driver</span>
              </div>
              <div className="flex-1 flex">
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={slot.hour}
                    className="flex-1 p-2 text-center border-r border-gray-100 bg-gray-50"
                  >
                    <span className="text-xs font-medium text-gray-500">{slot.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Rows */}
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="flex border-b border-gray-200 hover:bg-gray-50"
              >
                {/* Driver Info */}
                <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {driver.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{driver.name}</p>
                      <div className="flex items-center gap-1">
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
                          {driver.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{driver.vehicleType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="flex-1 flex relative" style={{ height: '80px' }}>
                  {TIME_SLOTS.map((slot) => {
                    const isDropTarget =
                      dropTarget?.driverId === driver.id &&
                      dropTarget?.hour === slot.hour;

                    return (
                      <div
                        key={slot.hour}
                        className={cn(
                          'flex-1 border-r border-gray-100 relative',
                          isDropTarget && 'bg-primary-50 border-primary-200'
                        )}
                        onDragOver={(e) => handleDragOver(e, driver.id, slot.hour)}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDragEnd}
                      >
                        {/* Drop indicator */}
                        {isDropTarget && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded">
                              Drop here
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Trips as positioned blocks */}
                  {driver.trips.map((trip) => {
                    const tripHour = parseInt(trip.pickupTime.split(':')[0]);
                    const tripMinute = parseInt(trip.pickupTime.split(':')[1] || '0');
                    const startOffset = ((tripHour - 5) * 60 + tripMinute) / (18 * 60);
                    const duration = (trip.estimatedDuration || 60) / (18 * 60);
                    const isDragging = draggedTrip?.trip.id === trip.id;

                    return (
                      <div
                        key={trip.id}
                        draggable
                        onDragStart={() => handleDragStart(trip, driver.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onTripClick?.(trip)}
                        className={cn(
                          'absolute top-1 bottom-1 rounded-md cursor-move transition-all',
                          'flex items-center gap-1 px-2 overflow-hidden',
                          trip.status === 'scheduled'
                            ? 'bg-primary-100 border border-primary-300 text-primary-800'
                            : trip.status === 'in_progress'
                            ? 'bg-warning-100 border border-warning-300 text-warning-800'
                            : 'bg-gray-100 border border-gray-300 text-gray-800',
                          isDragging && 'opacity-50 shadow-lg'
                        )}
                        style={{
                          left: `${startOffset * 100}%`,
                          width: `${Math.max(duration * 100, 5)}%`,
                          minWidth: '60px',
                        }}
                      >
                        <GripVertical className="h-3 w-3 flex-shrink-0 opacity-50" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{trip.patientName}</p>
                          <p className="text-[10px] opacity-75 truncate">
                            {trip.pickupTime}
                          </p>
                        </div>
                        {trip.tripType === 'medical' && (
                          <Badge variant="secondary" size="sm" className="text-[10px]">
                            MED
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Unassigned Trips Row */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-sm">Unassigned</p>
                    <span className="text-xs text-gray-500">Drag to assign</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex relative" style={{ height: '60px' }}>
                {TIME_SLOTS.map((slot) => (
                  <div key={slot.hour} className="flex-1 border-r border-gray-100" />
                ))}
                {/* Placeholder for unassigned trips */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-100 border border-primary-300" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning-100 border border-warning-300" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success-100 border border-success-300" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
          <span>Other</span>
        </div>
      </div>
    </div>
  );
}
