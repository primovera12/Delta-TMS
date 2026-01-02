'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Phone,
  MessageSquare,
  Car,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation,
  Star,
  FileText,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TripDetails {
  id: string;
  tripNumber: string;
  status: 'scheduled' | 'confirmed' | 'driver_assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  pickup: {
    address: string;
    city: string;
    instructions?: string;
  };
  dropoff: {
    address: string;
    city: string;
    facility?: string;
    appointmentTime?: string;
    instructions?: string;
  };
  transportType: string;
  driver?: {
    name: string;
    phone: string;
    rating: number;
    vehicleType: string;
    vehicleNumber: string;
  };
  timeline: {
    time: string;
    event: string;
    status: 'completed' | 'current' | 'pending';
  }[];
  estimatedArrival?: string;
  fare: {
    base: number;
    mileage: number;
    total: number;
    paymentMethod: string;
    insuranceCovered: boolean;
  };
  distance: string;
  duration: string;
  bookedAt: string;
  specialNeeds: string[];
}

const mockTrip: TripDetails = {
  id: '1',
  tripNumber: 'TRP-2024-0156',
  status: 'driver_assigned',
  scheduledDate: 'Wednesday, January 17, 2024',
  scheduledTime: '9:00 AM',
  pickup: {
    address: '456 Oak Avenue, Apt 12',
    city: 'Springfield, IL 62701',
    instructions: 'Please call upon arrival. Building has elevator access.',
  },
  dropoff: {
    address: '789 Medical Center Drive',
    city: 'Springfield, IL 62704',
    facility: 'Regional Medical Center - Dialysis Unit',
    appointmentTime: '10:00 AM',
    instructions: 'Enter through main entrance. Check in at front desk.',
  },
  transportType: 'Wheelchair Van',
  driver: {
    name: 'Mike Thompson',
    phone: '(555) 234-5678',
    rating: 4.9,
    vehicleType: 'Ford Transit',
    vehicleNumber: '#12',
  },
  timeline: [
    { time: 'Jan 15, 3:00 PM', event: 'Trip booked', status: 'completed' },
    { time: 'Jan 16, 10:00 AM', event: 'Trip confirmed', status: 'completed' },
    { time: 'Jan 16, 4:00 PM', event: 'Driver assigned', status: 'completed' },
    { time: 'Jan 17, 8:30 AM', event: 'Driver en route', status: 'pending' },
    { time: 'Jan 17, 9:00 AM', event: 'Pickup', status: 'pending' },
    { time: 'Jan 17, 9:30 AM', event: 'Dropoff', status: 'pending' },
  ],
  fare: {
    base: 25.00,
    mileage: 21.25,
    total: 46.25,
    paymentMethod: 'Medicare',
    insuranceCovered: true,
  },
  distance: '8.5 miles',
  duration: '~25 min',
  bookedAt: 'January 15, 2024 at 3:00 PM',
  specialNeeds: ['Wheelchair', 'Oxygen'],
};

export default function PatientTripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trip] = React.useState<TripDetails>(mockTrip);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [showHelpDialog, setShowHelpDialog] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'confirmed':
        return <Badge className="bg-info-100 text-info-700">Confirmed</Badge>;
      case 'driver_assigned':
        return <Badge className="bg-primary-100 text-primary-700">Driver Assigned</Badge>;
      case 'en_route':
        return <Badge className="bg-warning-100 text-warning-700">Driver En Route</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary-100 text-primary-700">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-success-100 text-success-700">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCopyTripNumber = () => {
    navigator.clipboard.writeText(trip.tripNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelTrip = () => {
    console.log('Cancelling trip with reason:', cancelReason);
    setShowCancelDialog(false);
    router.push('/patient/trips');
  };

  const canCancel = ['scheduled', 'confirmed', 'driver_assigned'].includes(trip.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Trip Details</h1>
            {getStatusBadge(trip.status)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{trip.tripNumber}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopyTripNumber}>
              {copied ? (
                <Check className="h-3 w-3 text-success-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowHelpDialog(true)}>
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-500" />
                Scheduled Trip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="h-14 w-14 rounded-lg bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="text-xs text-gray-500">JAN</span>
                  <span className="text-2xl font-bold text-primary-600">17</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{trip.scheduledDate}</p>
                  <p className="text-lg text-primary-600">{trip.scheduledTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-success-500 text-white flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <span className="font-medium text-gray-900">Pickup</span>
                </div>
                <div className="ml-8 space-y-1">
                  <p className="text-gray-900">{trip.pickup.address}</p>
                  <p className="text-gray-500">{trip.pickup.city}</p>
                  {trip.pickup.instructions && (
                    <div className="p-2 bg-gray-50 rounded text-sm text-gray-600 mt-2">
                      <span className="font-medium">Note:</span> {trip.pickup.instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Route Info */}
              <div className="flex items-center gap-4 px-8 py-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{trip.distance}</p>
                  <p className="text-xs text-gray-500">Distance</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{trip.duration}</p>
                  <p className="text-xs text-gray-500">Est. Duration</p>
                </div>
              </div>

              {/* Dropoff */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-error-500 text-white flex items-center justify-center text-xs font-bold">
                    B
                  </div>
                  <span className="font-medium text-gray-900">Dropoff</span>
                  {trip.dropoff.appointmentTime && (
                    <Badge variant="secondary">Appt: {trip.dropoff.appointmentTime}</Badge>
                  )}
                </div>
                <div className="ml-8 space-y-1">
                  {trip.dropoff.facility && (
                    <p className="font-medium text-gray-900">{trip.dropoff.facility}</p>
                  )}
                  <p className="text-gray-900">{trip.dropoff.address}</p>
                  <p className="text-gray-500">{trip.dropoff.city}</p>
                  {trip.dropoff.instructions && (
                    <div className="p-2 bg-gray-50 rounded text-sm text-gray-600 mt-2">
                      <span className="font-medium">Note:</span> {trip.dropoff.instructions}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Card */}
          {trip.driver && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-success-500" />
                  Your Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {trip.driver.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{trip.driver.name}</h3>
                    <div className="flex items-center gap-1 text-warning-500">
                      <Star className="h-4 w-4 fill-warning-500" />
                      <span className="font-medium">{trip.driver.rating}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {trip.driver.vehicleType} • Vehicle {trip.driver.vehicleNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${trip.driver.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`sms:${trip.driver.phone}`}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Text
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-info-500" />
                Trip Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trip.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          item.status === 'completed'
                            ? 'bg-success-500 text-white'
                            : item.status === 'current'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {item.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      {index < trip.timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${
                            item.status === 'completed' ? 'bg-success-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-medium ${item.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {item.event}
                      </p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary-500" />
                Trip Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Transport Type</span>
                <span className="font-medium">{trip.transportType}</span>
              </div>
              {trip.specialNeeds.length > 0 && (
                <div>
                  <span className="text-gray-500">Special Needs</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trip.specialNeeds.map((need) => (
                      <Badge key={need} variant="outline">{need}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Fare</span>
                  <span>${trip.fare.base.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mileage</span>
                  <span>${trip.fare.mileage.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${trip.fare.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success-600" />
                  <span className="text-sm text-success-700">
                    {trip.fare.insuranceCovered ? `Covered by ${trip.fare.paymentMethod}` : trip.fare.paymentMethod}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={`https://www.google.com/maps/dir/${encodeURIComponent(trip.pickup.address)}/${encodeURIComponent(trip.dropoff.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  View Route
                </a>
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              {canCancel && (
                <Button
                  variant="outline"
                  className="w-full text-error-600 hover:bg-error-50"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Trip
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Booked on</p>
              <p className="font-medium text-gray-900">{trip.bookedAt}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0" />
                <p className="text-sm text-warning-800">
                  Cancellations within 24 hours of the scheduled pickup may incur a fee.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason for cancellation (optional)</Label>
              <Textarea
                placeholder="Let us know why you're cancelling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Trip
            </Button>
            <Button variant="destructive" onClick={handleCancelTrip}>
              Cancel Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Need Help?</DialogTitle>
            <DialogDescription>
              Contact us for assistance with your trip
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-500" />
                <div>
                  <p className="font-medium">Call Dispatch</p>
                  <p className="text-primary-600">(555) 123-4567</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                For issues with your current trip, contact your driver directly or call our dispatch line.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
