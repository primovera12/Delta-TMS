'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Car,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  User,
  Navigation,
  CheckCircle2,
  Circle,
  ChevronLeft,
  Star,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RideDetail {
  id: string;
  confirmationNumber: string;
  patientName: string;
  status: 'scheduled' | 'driver_assigned' | 'en_route_pickup' | 'arrived_pickup' | 'in_transit' | 'arrived_destination' | 'completed' | 'cancelled';
  date: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  appointmentTime: string;
  transportType: string;
  isRoundTrip: boolean;
  driver?: {
    name: string;
    phone: string;
    photo?: string;
    rating: number;
    vehicle: {
      make: string;
      model: string;
      color: string;
      licensePlate: string;
    };
  };
  estimatedArrival?: string;
  timeline: {
    status: string;
    time: string;
    completed: boolean;
  }[];
  specialInstructions?: string;
}

const mockRide: RideDetail = {
  id: '1',
  confirmationNumber: 'RID-847592',
  patientName: 'Robert Johnson',
  status: 'en_route_pickup',
  date: '2024-01-20',
  pickupTime: '9:00 AM',
  pickupAddress: '123 Oak Street, Springfield, IL 62701',
  dropoffAddress: 'Regional Dialysis Center, 789 Medical Drive, Springfield, IL 62703',
  appointmentTime: '10:00 AM',
  transportType: 'Wheelchair',
  isRoundTrip: true,
  driver: {
    name: 'John Smith',
    phone: '(555) 111-2222',
    rating: 4.9,
    vehicle: {
      make: 'Ford',
      model: 'Transit',
      color: 'White',
      licensePlate: 'ABC-1234',
    },
  },
  estimatedArrival: '8:55 AM',
  timeline: [
    { status: 'Ride Scheduled', time: 'Jan 18, 2:30 PM', completed: true },
    { status: 'Driver Assigned', time: 'Jan 19, 4:00 PM', completed: true },
    { status: 'Driver En Route to Pickup', time: 'Jan 20, 8:30 AM', completed: true },
    { status: 'Arrived at Pickup', time: '-', completed: false },
    { status: 'In Transit', time: '-', completed: false },
    { status: 'Arrived at Destination', time: '-', completed: false },
  ],
  specialInstructions: 'Needs assistance entering/exiting vehicle. Please use ramp entrance.',
};

export default function FamilyRideDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [ride, setRide] = React.useState<RideDetail>(mockRide);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusProgress = () => {
    switch (ride.status) {
      case 'scheduled':
        return 10;
      case 'driver_assigned':
        return 25;
      case 'en_route_pickup':
        return 40;
      case 'arrived_pickup':
        return 55;
      case 'in_transit':
        return 75;
      case 'arrived_destination':
        return 90;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusLabel = () => {
    switch (ride.status) {
      case 'scheduled':
        return 'Scheduled';
      case 'driver_assigned':
        return 'Driver Assigned';
      case 'en_route_pickup':
        return 'Driver En Route';
      case 'arrived_pickup':
        return 'Driver Arrived';
      case 'in_transit':
        return 'In Transit';
      case 'arrived_destination':
        return 'Arrived';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return ride.status;
    }
  };

  const getStatusColor = () => {
    switch (ride.status) {
      case 'completed':
        return 'text-success-600 bg-success-50';
      case 'cancelled':
        return 'text-error-600 bg-error-50';
      case 'in_transit':
      case 'en_route_pickup':
        return 'text-warning-600 bg-warning-50';
      default:
        return 'text-primary-600 bg-primary-50';
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      {/* Status Card */}
      <Card className={getStatusColor()}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-75">Confirmation #{ride.confirmationNumber}</p>
              <h1 className="text-2xl font-bold">{getStatusLabel()}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <Progress value={getStatusProgress()} className="h-2 mb-4" />

          {ride.status === 'en_route_pickup' && ride.estimatedArrival && (
            <div className="flex items-center gap-2 text-lg font-medium">
              <Clock className="h-5 w-5" />
              <span>Driver arriving at {ride.estimatedArrival}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver Info */}
      {ride.driver && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                {ride.driver.photo ? (
                  <img
                    src={ride.driver.photo}
                    alt={ride.driver.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{ride.driver.name}</h3>
                  <div className="flex items-center gap-1 text-warning-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{ride.driver.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {ride.driver.vehicle.color} {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                </p>
                <Badge variant="secondary" className="font-mono">
                  {ride.driver.vehicle.licensePlate}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${ride.driver.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trip Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trip Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="info">{ride.transportType}</Badge>
              {ride.isRoundTrip && <Badge variant="secondary">Round Trip</Badge>}
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-success-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="font-medium text-gray-900">{ride.pickupAddress}</p>
                <p className="text-sm text-gray-500">{ride.date} at {ride.pickupTime}</p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-dashed border-gray-200 h-6" />

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Navigation className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="font-medium text-gray-900">{ride.dropoffAddress}</p>
                <p className="text-sm text-gray-500">Appointment at {ride.appointmentTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Instructions */}
      {ride.specialInstructions && (
        <Card className="border-warning-200 bg-warning-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5" />
              <div>
                <p className="font-medium text-warning-900">Special Instructions</p>
                <p className="text-sm text-warning-800 mt-1">{ride.specialInstructions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trip Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ride.timeline.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  event.completed
                    ? 'bg-success-100'
                    : 'bg-gray-100'
                }`}>
                  {event.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-success-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                    {event.status}
                  </p>
                  <p className={`text-sm ${event.completed ? 'text-gray-500' : 'text-gray-300'}`}>
                    {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => router.push('/family/rides')}>
          Back to Rides
        </Button>
        {ride.status !== 'completed' && ride.status !== 'cancelled' && (
          <Button variant="destructive" className="flex-1">
            Cancel Ride
          </Button>
        )}
      </div>

      {/* Support */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Need help? Call support at{' '}
          <a href="tel:1-800-555-0123" className="text-primary-600 hover:underline">
            1-800-555-0123
          </a>
        </p>
      </div>
    </div>
  );
}
