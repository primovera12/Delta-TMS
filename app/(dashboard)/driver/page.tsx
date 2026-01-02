'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Car,
  Clock,
  MapPin,
  DollarSign,
  Star,
  Navigation,
  Phone,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { StatCard } from '@/components/domain/stat-card';

// Mock data
const driverStats = {
  todayTrips: 5,
  completedTrips: 3,
  remainingTrips: 2,
  todayEarnings: 285.50,
  rating: 4.8,
  onTimeRate: 96,
};

const currentTrip = {
  id: 'TR-20260115-012',
  patient: {
    name: 'John Smith',
    phone: '(555) 123-4567',
    photo: null,
  },
  pickup: {
    address: '123 Main St, Houston, TX 77001',
    time: '10:30 AM',
    instructions: 'Ring doorbell, wait for aide',
  },
  dropoff: {
    address: 'Memorial Hospital, 6400 Fannin St',
    time: '11:00 AM',
    instructions: 'Emergency entrance',
  },
  status: 'driver_en_route',
  vehicleType: 'wheelchair',
  specialNeeds: ['wheelchair', 'oxygen'],
  fare: 85.50,
  distance: 12.5,
};

const upcomingTrips = [
  {
    id: 'TR-20260115-015',
    patient: 'Mary Jones',
    pickup: '456 Oak Ave',
    dropoff: 'Dialysis Center',
    time: '11:30 AM',
    status: 'assigned',
  },
  {
    id: 'TR-20260115-018',
    patient: 'Robert Brown',
    pickup: '789 Pine Rd',
    dropoff: 'City Clinic',
    time: '1:00 PM',
    status: 'assigned',
  },
];

const tripStatusSteps = [
  { key: 'assigned', label: 'Assigned', icon: CheckCircle },
  { key: 'en_route', label: 'En Route', icon: Navigation },
  { key: 'arrived', label: 'Arrived', icon: MapPin },
  { key: 'in_progress', label: 'In Progress', icon: Car },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function DriverDashboardPage() {
  const [isOnline, setIsOnline] = React.useState(true);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(1);

  const handleStatusUpdate = () => {
    if (currentStepIndex < tripStatusSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const getStatusButtonLabel = () => {
    switch (currentStepIndex) {
      case 0:
        return 'Start Navigation';
      case 1:
        return 'I\'ve Arrived';
      case 2:
        return 'Start Trip';
      case 3:
        return 'Complete Trip';
      default:
        return 'Update Status';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Online Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Driver Dashboard</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            <Badge variant={isOnline ? 'success' : 'secondary'} dot>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Trips"
          value={`${driverStats.completedTrips}/${driverStats.todayTrips}`}
          icon={<Car className="h-6 w-6" />}
        />
        <StatCard
          title="Today's Earnings"
          value={`$${driverStats.todayEarnings.toFixed(2)}`}
          change={12}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Rating"
          value={driverStats.rating.toFixed(1)}
          icon={<Star className="h-6 w-6" />}
        />
        <StatCard
          title="On-Time Rate"
          value={`${driverStats.onTimeRate}%`}
          icon={<Clock className="h-6 w-6" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Trip */}
        <div className="lg:col-span-2 space-y-6">
          {currentTrip ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Trip</CardTitle>
                  <p className="text-sm text-gray-500 font-mono">{currentTrip.id}</p>
                </div>
                <Badge variant="in-progress">In Progress</Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Steps */}
                <div className="flex items-center justify-between">
                  {tripStatusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                              isCompleted
                                ? 'bg-success-600 text-white'
                                : isActive
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p
                            className={`mt-2 text-xs font-medium ${
                              isActive ? 'text-primary-600' : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                        {index < tripStatusSteps.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-2 rounded-full ${
                              index < currentStepIndex ? 'bg-success-600' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Patient Info */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg">
                      <AvatarFallback>
                        {currentTrip.patient.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{currentTrip.patient.name}</h3>
                      <p className="text-sm text-gray-500">{currentTrip.patient.phone}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>

                {/* Route */}
                <div className="space-y-4">
                  {/* Pickup */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-success-600" />
                      </div>
                      <div className="flex-1 w-px bg-gray-200 my-2" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Pickup</p>
                          <p className="text-sm text-gray-600">{currentTrip.pickup.address}</p>
                          {currentTrip.pickup.instructions && (
                            <p className="mt-1 text-xs text-gray-500">
                              <AlertCircle className="inline h-3 w-3 mr-1" />
                              {currentTrip.pickup.instructions}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{currentTrip.pickup.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dropoff */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-error-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Dropoff</p>
                          <p className="text-sm text-gray-600">{currentTrip.dropoff.address}</p>
                          {currentTrip.dropoff.instructions && (
                            <p className="mt-1 text-xs text-gray-500">
                              <AlertCircle className="inline h-3 w-3 mr-1" />
                              {currentTrip.dropoff.instructions}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{currentTrip.dropoff.time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Needs */}
                <div className="flex flex-wrap gap-2">
                  {currentTrip.specialNeeds.map((need) => (
                    <Badge key={need} variant="info">
                      {need}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button className="flex-1" size="lg" onClick={handleStatusUpdate}>
                    {getStatusButtonLabel()}
                  </Button>
                  <Button variant="secondary" size="lg">
                    <Navigation className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="py-12 text-center">
              <Car className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Active Trip</h3>
              <p className="mt-2 text-sm text-gray-500">
                You&apos;ll see your current trip here when you have one assigned.
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Trips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Trips</CardTitle>
              <Link href="/driver/trips">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{trip.patient}</span>
                    <span className="text-sm font-medium text-primary-600">{trip.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{trip.pickup}</span>
                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{trip.dropoff}</span>
                  </div>
                </div>
              ))}

              {upcomingTrips.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">
                  No more trips scheduled for today
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Trips Completed</span>
                  <span className="font-medium text-gray-900">
                    {driverStats.completedTrips} / {driverStats.todayTrips}
                  </span>
                </div>
                <Progress
                  value={(driverStats.completedTrips / driverStats.todayTrips) * 100}
                />
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Distance Today</span>
                  <span className="font-medium text-gray-900">45.2 mi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Active Time</span>
                  <span className="font-medium text-gray-900">4h 35m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Wait Time</span>
                  <span className="font-medium text-gray-900">45m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Car className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">2022 Toyota Sienna</p>
                  <p className="text-sm text-gray-500">ABC-1234 • Wheelchair Van</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button variant="secondary" className="w-full">
                  Pre-Trip Inspection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
