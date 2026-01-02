'use client';

import * as React from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  Car,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils/cn';

interface TripTrackerProps {
  trip: {
    id: string;
    status: string;
    driver: {
      name: string;
      phone: string;
      photo?: string;
      rating: number;
      vehicle: {
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        type: string;
      };
    };
    pickup: {
      address: string;
      scheduledTime: string;
      actualTime?: string;
    };
    dropoff: {
      address: string;
      scheduledTime: string;
      actualTime?: string;
    };
    eta?: string;
    distance?: string;
    progress?: number;
  };
  onRefresh?: () => void;
  className?: string;
}

const statusSteps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'driver_assigned', label: 'Driver Assigned' },
  { key: 'driver_en_route', label: 'Driver En Route' },
  { key: 'arrived_pickup', label: 'At Pickup' },
  { key: 'patient_onboard', label: 'In Transit' },
  { key: 'arrived_dropoff', label: 'At Destination' },
  { key: 'completed', label: 'Completed' },
];

const getStepIndex = (status: string): number => {
  const index = statusSteps.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
};

export function TripTracker({ trip, onRefresh, className }: TripTrackerProps) {
  const currentStepIndex = getStepIndex(trip.status);
  const isActive = !['completed', 'cancelled'].includes(trip.status);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary-50 to-white">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Navigation className={cn('h-5 w-5', isActive && 'animate-pulse text-primary-600')} />
            Live Tracking
          </CardTitle>
          <p className="text-sm text-gray-500 font-mono mt-1">{trip.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? 'in-progress' : 'success'}>
            {statusSteps[currentStepIndex]?.label || trip.status}
          </Badge>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Progress Bar */}
        {isActive && trip.progress !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Trip Progress</span>
              {trip.eta && (
                <span className="font-medium text-primary-600">ETA: {trip.eta}</span>
              )}
            </div>
            <Progress value={trip.progress} />
          </div>
        )}

        {/* Status Timeline */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {statusSteps.slice(0, 5).map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                        isCompleted
                          ? 'bg-success-600 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <p
                      className={cn(
                        'mt-1 text-xs text-center max-w-[60px]',
                        isCurrent ? 'text-primary-600 font-medium' : 'text-gray-500'
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < 4 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-1',
                        index < currentStepIndex ? 'bg-success-600' : 'bg-gray-200'
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Driver Info */}
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-500 mb-3">Your Driver</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>
                  {trip.driver.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{trip.driver.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{trip.driver.vehicle.year} {trip.driver.vehicle.make} {trip.driver.vehicle.model}</span>
                  <span>•</span>
                  <span className="font-mono">{trip.driver.vehicle.licensePlate}</span>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </div>

        {/* Route */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-success-600" />
              </div>
              <div className="flex-1 w-px bg-gray-200 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">Pickup</p>
                <p className="text-sm text-gray-600">{trip.pickup.scheduledTime}</p>
              </div>
              <p className="text-sm text-gray-500">{trip.pickup.address}</p>
              {trip.pickup.actualTime && (
                <p className="text-xs text-success-600 mt-1">
                  Arrived at {trip.pickup.actualTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-error-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">Dropoff</p>
                <p className="text-sm text-gray-600">{trip.dropoff.scheduledTime}</p>
              </div>
              <p className="text-sm text-gray-500">{trip.dropoff.address}</p>
              {trip.dropoff.actualTime && (
                <p className="text-xs text-success-600 mt-1">
                  Arrived at {trip.dropoff.actualTime}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        {trip.distance && (
          <div className="flex items-center justify-around pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{trip.distance}</p>
              <p className="text-xs text-gray-500">Distance</p>
            </div>
            {trip.eta && (
              <div className="text-center">
                <p className="text-lg font-semibold text-primary-600">{trip.eta}</p>
                <p className="text-xs text-gray-500">ETA</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
