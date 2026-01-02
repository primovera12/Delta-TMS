'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  User,
  Truck,
  Accessibility,
  Wind,
  Stethoscope,
  Scale,
  Edit2,
  Printer,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  UserPlus,
  Loader2,
} from 'lucide-react';
import { TripStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripStatusTimeline } from '@/components/domain/trip-status-timeline';
import { AddressDisplay } from '@/components/domain/address-display';
import { TripCancellationModal } from '@/components/domain/trip-cancellation-modal';
import { TripAssignmentModal } from '@/components/domain/trip-assignment-modal';
import { cn } from '@/lib/utils';

interface TripDetail {
  id: string;
  tripNumber: string;
  tripType: string;
  status: TripStatus;

  // Schedule
  scheduledPickupTime: string;
  actualPickupTime?: string;
  actualDropoffTime?: string;

  // Addresses
  pickupAddressLine1: string;
  pickupAddressLine2?: string;
  pickupCity: string;
  pickupState: string;
  pickupZipCode: string;
  pickupLatitude: number;
  pickupLongitude: number;

  dropoffAddressLine1: string;
  dropoffAddressLine2?: string;
  dropoffCity: string;
  dropoffState: string;
  dropoffZipCode: string;
  dropoffLatitude: number;
  dropoffLongitude: number;

  // Pricing
  totalFare: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  accessibilitySurcharge: number;
  tipAmount: number;
  paymentStatus: string;

  // Requirements
  vehicleType: string;
  wheelchairRequired: boolean;
  stretcherRequired: boolean;
  oxygenRequired: boolean;
  bariatricRequired: boolean;

  // Distance/Duration
  totalDistanceMiles: number;
  estimatedDurationMinutes: number;

  // Notes
  bookingNotes?: string;
  driverNotes?: string;
  dispatcherNotes?: string;
  specialRequirements?: string;

  // Cancellation
  cancellationReason?: string;
  cancelledAt?: string;

  // Relations
  driver?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    rating: number;
  };
  vehicle?: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
    vehicleType: string;
  };
  passengers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isPrimary: boolean;
    user?: {
      email?: string;
      medicalProfile?: {
        emergencyContactName?: string;
        emergencyContactPhone?: string;
      };
    };
  }>;
  statusHistory: Array<{
    id: string;
    previousStatus: TripStatus | null;
    newStatus: TripStatus;
    createdAt: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
    changedBy?: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }>;

  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<TripStatus, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-800' },
  CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800' },
  ASSIGNED: { bg: 'bg-purple-100', text: 'text-purple-800' },
  DRIVER_EN_ROUTE: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  DRIVER_ARRIVED: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  IN_PROGRESS: { bg: 'bg-green-100', text: 'text-green-800' },
  COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-800' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
  NO_SHOW: { bg: 'bg-rose-100', text: 'text-rose-800' },
};

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/v1/trips/${tripId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trip');
        }
        const data = await response.json();
        setTrip(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trip');
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleCancelTrip = async (reason: string) => {
    try {
      const response = await fetch(`/api/v1/trips/${tripId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: 'CANCELLED',
          cancellationReason: reason,
        }),
      });

      if (response.ok) {
        // Refresh trip data
        const tripResponse = await fetch(`/api/v1/trips/${tripId}`);
        const data = await tripResponse.json();
        setTrip(data.data || data);
        setShowCancelModal(false);
      }
    } catch (err) {
      console.error('Failed to cancel trip:', err);
    }
  };

  const handleAssignDriver = async (driverId: string) => {
    try {
      const response = await fetch(`/api/v1/trips/${tripId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      });

      if (response.ok) {
        // Refresh trip data
        const tripResponse = await fetch(`/api/v1/trips/${tripId}`);
        const data = await tripResponse.json();
        setTrip(data.data || data);
        setShowAssignModal(false);
      }
    } catch (err) {
      console.error('Failed to assign driver:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyTripNumber = async () => {
    if (trip) {
      await navigator.clipboard.writeText(trip.tripNumber);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip Not Found</h2>
          <p className="text-gray-500 mb-4">{error || 'The requested trip could not be found.'}</p>
          <Button onClick={() => router.push('/dispatcher/trips')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const primaryPassenger = trip.passengers.find((p) => p.isPrimary) || trip.passengers[0];
  const isTerminal = ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(trip.status);
  const statusColor = statusColors[trip.status];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dispatcher/trips')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{trip.tripNumber}</h1>
              <Button variant="ghost" size="sm" onClick={copyTripNumber}>
                <Copy className="h-4 w-4" />
              </Button>
              <Badge className={cn(statusColor.bg, statusColor.text, 'capitalize')}>
                {trip.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-gray-500">
              Created {format(new Date(trip.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {!isTerminal && (
            <>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {!trip.driver && (
                <Button size="sm" onClick={() => setShowAssignModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Driver
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => setShowCancelModal(true)}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-medium text-gray-700">Pickup</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(trip.scheduledPickupTime), 'h:mm a')}
                  </span>
                </div>
                <AddressDisplay
                  addressLine1={trip.pickupAddressLine1}
                  addressLine2={trip.pickupAddressLine2}
                  city={trip.pickupCity}
                  state={trip.pickupState}
                  zipCode={trip.pickupZipCode}
                  latitude={trip.pickupLatitude}
                  longitude={trip.pickupLongitude}
                  compact
                />
              </div>

              {/* Dropoff */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-medium text-gray-700">Dropoff</span>
                </div>
                <AddressDisplay
                  addressLine1={trip.dropoffAddressLine1}
                  addressLine2={trip.dropoffAddressLine2}
                  city={trip.dropoffCity}
                  state={trip.dropoffState}
                  zipCode={trip.dropoffZipCode}
                  latitude={trip.dropoffLatitude}
                  longitude={trip.dropoffLongitude}
                  compact
                />
              </div>

              <Separator />

              {/* Distance & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {trip.totalDistanceMiles.toFixed(1)} miles
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    ~{trip.estimatedDurationMinutes} min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {primaryPassenger && (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {primaryPassenger.firstName} {primaryPassenger.lastName}
                    </p>
                    {primaryPassenger.phone && (
                      <a
                        href={`tel:${primaryPassenger.phone}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        {primaryPassenger.phone}
                      </a>
                    )}
                    {primaryPassenger.user?.email && (
                      <a
                        href={`mailto:${primaryPassenger.user.email}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Mail className="h-4 w-4" />
                        {primaryPassenger.user.email}
                      </a>
                    )}
                  </div>

                  {/* Medical Needs */}
                  <div className="flex flex-wrap gap-2">
                    {trip.wheelchairRequired && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Accessibility className="h-3 w-3" />
                        Wheelchair
                      </Badge>
                    )}
                    {trip.stretcherRequired && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3" />
                        Stretcher
                      </Badge>
                    )}
                    {trip.oxygenRequired && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Wind className="h-3 w-3" />
                        Oxygen
                      </Badge>
                    )}
                    {trip.bariatricRequired && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        Bariatric
                      </Badge>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  {primaryPassenger.user?.medicalProfile?.emergencyContactName && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm font-medium text-amber-800">Emergency Contact</p>
                      <p className="text-sm text-amber-700">
                        {primaryPassenger.user.medicalProfile.emergencyContactName}
                        {primaryPassenger.user.medicalProfile.emergencyContactPhone && (
                          <> - {primaryPassenger.user.medicalProfile.emergencyContactPhone}</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Driver Info */}
          {trip.driver && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Driver & Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {trip.driver.user.firstName} {trip.driver.user.lastName}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500">
                      {'★'.repeat(Math.round(trip.driver.rating))}
                      <span className="text-gray-500 text-sm">({trip.driver.rating.toFixed(1)})</span>
                    </div>
                    <a
                      href={`tel:${trip.driver.user.phone}`}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <Phone className="h-3 w-3" />
                      {trip.driver.user.phone}
                    </a>
                  </div>
                  {trip.vehicle && (
                    <div className="text-right text-sm">
                      <p className="font-medium">
                        {trip.vehicle.color} {trip.vehicle.make} {trip.vehicle.model}
                      </p>
                      <p className="text-gray-500">{trip.vehicle.licensePlate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Tabs defaultValue="booking">
            <TabsList>
              <TabsTrigger value="booking">Booking Notes</TabsTrigger>
              <TabsTrigger value="driver">Driver Notes</TabsTrigger>
              <TabsTrigger value="internal">Internal Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="booking">
              <Card>
                <CardContent className="pt-6">
                  {trip.bookingNotes || trip.specialRequirements ? (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {trip.bookingNotes || trip.specialRequirements}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">No booking notes</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="driver">
              <Card>
                <CardContent className="pt-6">
                  {trip.driverNotes ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{trip.driverNotes}</p>
                  ) : (
                    <p className="text-gray-400 italic">No driver notes</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="internal">
              <Card>
                <CardContent className="pt-6">
                  {trip.dispatcherNotes ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{trip.dispatcherNotes}</p>
                  ) : (
                    <p className="text-gray-400 italic">No internal notes</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Price Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Fare</span>
                <span>${trip.baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance ({trip.totalDistanceMiles.toFixed(1)} mi)</span>
                <span>${trip.distanceFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time ({trip.estimatedDurationMinutes} min)</span>
                <span>${trip.timeFare.toFixed(2)}</span>
              </div>
              {trip.accessibilitySurcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accessibility</span>
                  <span>${trip.accessibilitySurcharge.toFixed(2)}</span>
                </div>
              )}
              {trip.tipAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tip</span>
                  <span>${trip.tipAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-600">${trip.totalFare.toFixed(2)}</span>
              </div>

              <div className="mt-4">
                <Badge
                  className={cn(
                    trip.paymentStatus === 'PAID' || trip.paymentStatus === 'CAPTURED'
                      ? 'bg-green-100 text-green-800'
                      : trip.paymentStatus === 'FAILED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  )}
                >
                  Payment: {trip.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trip.statusHistory.length > 0 ? (
                <TripStatusTimeline
                  history={trip.statusHistory}
                  currentStatus={trip.status}
                />
              ) : (
                <p className="text-gray-400 italic">No status history</p>
              )}
            </CardContent>
          </Card>

          {/* Cancellation Info */}
          {trip.status === 'CANCELLED' && trip.cancellationReason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  Cancellation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{trip.cancellationReason}</p>
                {trip.cancelledAt && (
                  <p className="text-sm text-red-500 mt-2">
                    Cancelled on {format(new Date(trip.cancelledAt), 'MMM d, yyyy h:mm a')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCancelModal && (
        <TripCancellationModal
          tripNumber={trip.tripNumber}
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelTrip}
        />
      )}

      {showAssignModal && (
        <TripAssignmentModal
          tripId={trip.id}
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignDriver}
        />
      )}
    </div>
  );
}
