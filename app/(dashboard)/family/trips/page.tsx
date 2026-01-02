'use client';

import * as React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  User,
  Car,
  Navigation,
  CheckCircle,
  AlertCircle,
  Calendar,
  RefreshCw,
  ChevronRight,
  Bell,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock data for family member's trips
const patientInfo = {
  name: 'Robert Johnson',
  relationship: 'Father',
  phone: '(555) 123-4567',
};

const activeTrip = {
  id: 'TR-20260115-001',
  status: 'in_transit',
  driver: {
    name: 'John Smith',
    phone: '(555) 987-6543',
    vehicle: 'White Toyota Sienna',
    licensePlate: 'ABC-1234',
    rating: 4.9,
  },
  pickup: {
    address: '123 Main St, Houston, TX 77001',
    time: '10:00 AM',
    status: 'completed',
    actualTime: '10:05 AM',
  },
  dropoff: {
    address: 'Memorial Hospital, 1234 Medical Center Dr',
    time: '10:30 AM',
    status: 'pending',
    eta: '10:28 AM',
  },
  appointmentTime: '11:00 AM',
  vehicleType: 'Wheelchair Van',
  lastUpdated: new Date().toISOString(),
  currentLocation: 'En route - 2.3 miles away',
  progress: 65,
};

const upcomingTrips = [
  {
    id: 'TR-20260117-001',
    date: '2026-01-17',
    pickupTime: '8:00 AM',
    pickup: '123 Main St, Houston, TX 77001',
    dropoff: 'City Dialysis Center, 789 Health Blvd',
    status: 'scheduled',
    type: 'Dialysis Treatment',
  },
  {
    id: 'TR-20260119-001',
    date: '2026-01-19',
    pickupTime: '9:30 AM',
    pickup: '123 Main St, Houston, TX 77001',
    dropoff: 'Heart Care Clinic, 890 Cardio Dr',
    status: 'scheduled',
    type: 'Medical Appointment',
  },
];

const recentTrips = [
  {
    id: 'TR-20260113-001',
    date: '2026-01-13',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'City Dialysis Center',
    status: 'completed',
    driver: 'Mike Johnson',
    onTimePickup: true,
  },
  {
    id: 'TR-20260110-001',
    date: '2026-01-10',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'Memorial Hospital',
    status: 'completed',
    driver: 'Sarah Williams',
    onTimePickup: true,
  },
];

const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'error' | 'secondary' }> = {
  scheduled: { label: 'Scheduled', variant: 'secondary' },
  driver_assigned: { label: 'Driver Assigned', variant: 'info' },
  en_route_pickup: { label: 'Driver En Route', variant: 'warning' },
  in_transit: { label: 'In Transit', variant: 'info' },
  at_dropoff: { label: 'Arriving', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
};

export default function FamilyTripsPage() {
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trip Tracking</h1>
          <p className="text-sm text-gray-500">
            Monitor trips for {patientInfo.name} ({patientInfo.relationship})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {formatTime(lastRefresh)}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLastRefresh(new Date())}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Trip */}
      {activeTrip && (
        <Card className="border-primary-200 bg-primary-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary-500 animate-pulse" />
                <CardTitle className="text-lg">Active Trip</CardTitle>
              </div>
              <Badge variant={statusConfig[activeTrip.status].variant}>
                {statusConfig[activeTrip.status].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Pickup</span>
                <span>En Route</span>
                <span>Dropoff</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-500"
                  style={{ width: `${activeTrip.progress}%` }}
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{activeTrip.currentLocation}</p>
                <p className="text-sm text-gray-500">ETA: {activeTrip.dropoff.eta}</p>
              </div>
            </div>

            {/* Route */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${activeTrip.pickup.status === 'completed' ? 'bg-success-500' : 'bg-gray-300'}`} />
                  <div className="h-12 border-l-2 border-dashed border-gray-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pickup</p>
                  <p className="text-sm font-medium text-gray-900">{activeTrip.pickup.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {activeTrip.pickup.status === 'completed'
                        ? `Picked up at ${activeTrip.pickup.actualTime}`
                        : `Scheduled: ${activeTrip.pickup.time}`}
                    </span>
                    {activeTrip.pickup.status === 'completed' && (
                      <CheckCircle className="h-3.5 w-3.5 text-success-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${activeTrip.dropoff.status === 'completed' ? 'bg-success-500' : 'bg-error-500'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dropoff</p>
                  <p className="text-sm font-medium text-gray-900">{activeTrip.dropoff.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      ETA: {activeTrip.dropoff.eta}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Driver Details</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {activeTrip.driver.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{activeTrip.driver.name}</p>
                    <p className="text-sm text-gray-500">{activeTrip.driver.vehicle}</p>
                    <p className="text-xs text-gray-400">{activeTrip.driver.licensePlate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${activeTrip.driver.phone}`}>
                    <Button variant="secondary" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </a>
                  <Button variant="secondary" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Appointment Reminder */}
            <div className="flex items-center gap-3 p-3 bg-info-50 rounded-lg border border-info-200">
              <AlertCircle className="h-5 w-5 text-info-600" />
              <p className="text-sm text-info-800">
                Appointment at <span className="font-medium">{activeTrip.appointmentTime}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Trip */}
      {!activeTrip && (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active trips at the moment</p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            Upcoming Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTrips.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming trips scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-gray-900">
                        {new Date(trip.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {new Date(trip.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{trip.type}</p>
                        <Badge variant="secondary" size="sm">
                          {trip.pickupTime}
                        </Badge>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{trip.pickup}</p>
                          <p className="text-primary-600">→ {trip.dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            Recent Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {trip.pickup} → {trip.dropoff}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{trip.date}</span>
                      <span>•</span>
                      <span>Driver: {trip.driver}</span>
                      {trip.onTimePickup && (
                        <>
                          <span>•</span>
                          <span className="text-success-600">On-time</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Trip started', description: 'When driver picks up patient', enabled: true },
              { label: 'Arriving at destination', description: 'When nearing dropoff', enabled: true },
              { label: 'Trip completed', description: 'When patient is dropped off', enabled: true },
              { label: 'Driver delays', description: 'When there are unexpected delays', enabled: true },
              { label: 'Trip cancelled', description: 'When a trip is cancelled', enabled: true },
            ].map((setting, index) => (
              <label
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium text-gray-900">{setting.label}</p>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={setting.enabled}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600"
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-error-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Need Help?</p>
                <p className="text-sm text-gray-500">24/7 Dispatch Line</p>
              </div>
            </div>
            <a href="tel:+15551234567">
              <Button variant="secondary">
                Call Dispatch
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
