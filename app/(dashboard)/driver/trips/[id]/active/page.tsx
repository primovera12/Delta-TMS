'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Camera,
  FileText,
  ChevronRight,
  ArrowLeft,
  Car,
  Wheelchair,
  Activity,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type TripStatus = 'en_route_pickup' | 'arrived_pickup' | 'patient_onboard' | 'en_route_destination' | 'arrived_destination' | 'completed';

interface TripDetails {
  id: string;
  tripNumber: string;
  status: TripStatus;
  patient: {
    name: string;
    phone: string;
    dob: string;
    notes: string;
    mobility: string;
    specialNeeds: string[];
  };
  pickup: {
    address: string;
    facility?: string;
    room?: string;
    time: string;
    instructions?: string;
  };
  dropoff: {
    address: string;
    facility?: string;
    room?: string;
    appointmentTime?: string;
    instructions?: string;
  };
  transportType: string;
  distance: string;
  estimatedDuration: string;
  fare: number;
}

const mockTrip: TripDetails = {
  id: '1',
  tripNumber: 'TRP-2024-0156',
  status: 'en_route_pickup',
  patient: {
    name: 'Robert Johnson',
    phone: '(555) 123-4567',
    dob: '03/15/1952',
    notes: 'Requires assistance with mobility. Hard of hearing - speak clearly.',
    mobility: 'Wheelchair',
    specialNeeds: ['Oxygen', 'Hearing Impaired'],
  },
  pickup: {
    address: '456 Oak Avenue, Suite 200',
    facility: 'Sunrise Senior Living',
    room: 'Room 215',
    time: '9:00 AM',
    instructions: 'Check in at front desk. Caregiver will assist patient to vehicle.',
  },
  dropoff: {
    address: '789 Medical Center Drive',
    facility: 'Regional Medical Center',
    appointmentTime: '10:00 AM',
    instructions: 'Enter through main entrance. Dialysis center is on 2nd floor.',
  },
  transportType: 'Wheelchair Van',
  distance: '8.5 miles',
  estimatedDuration: '25 min',
  fare: 45.00,
};

const statusSteps: { key: TripStatus; label: string; icon: React.ElementType }[] = [
  { key: 'en_route_pickup', label: 'En Route to Pickup', icon: Car },
  { key: 'arrived_pickup', label: 'Arrived at Pickup', icon: MapPin },
  { key: 'patient_onboard', label: 'Patient Onboard', icon: User },
  { key: 'en_route_destination', label: 'En Route to Destination', icon: Navigation },
  { key: 'arrived_destination', label: 'Arrived at Destination', icon: Building2 },
  { key: 'completed', label: 'Trip Completed', icon: CheckCircle2 },
];

export default function DriverActiveTripPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = React.useState<TripDetails>(mockTrip);
  const [showIssueDialog, setShowIssueDialog] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [issueNote, setIssueNote] = React.useState('');
  const [nextAction, setNextAction] = React.useState<TripStatus | null>(null);

  const currentStepIndex = statusSteps.findIndex((s) => s.key === trip.status);

  const getNextStatus = (): TripStatus | null => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < statusSteps.length) {
      return statusSteps[nextIndex].key;
    }
    return null;
  };

  const getActionButton = () => {
    switch (trip.status) {
      case 'en_route_pickup':
        return { label: 'Arrived at Pickup', nextStatus: 'arrived_pickup' as TripStatus };
      case 'arrived_pickup':
        return { label: 'Patient Onboard', nextStatus: 'patient_onboard' as TripStatus };
      case 'patient_onboard':
        return { label: 'Start Trip', nextStatus: 'en_route_destination' as TripStatus };
      case 'en_route_destination':
        return { label: 'Arrived at Destination', nextStatus: 'arrived_destination' as TripStatus };
      case 'arrived_destination':
        return { label: 'Complete Trip', nextStatus: 'completed' as TripStatus };
      default:
        return null;
    }
  };

  const handleStatusUpdate = (newStatus: TripStatus) => {
    setNextAction(newStatus);
    setShowConfirmDialog(true);
  };

  const confirmStatusUpdate = () => {
    if (nextAction) {
      setTrip({ ...trip, status: nextAction });
      setShowConfirmDialog(false);
      setNextAction(null);

      if (nextAction === 'completed') {
        // Redirect to trip summary after short delay
        setTimeout(() => {
          router.push(`/driver/trips/${params.id}`);
        }, 1500);
      }
    }
  };

  const handleReportIssue = () => {
    console.log('Issue reported:', issueNote);
    setShowIssueDialog(false);
    setIssueNote('');
  };

  const actionButton = getActionButton();

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">Active Trip</h1>
          <p className="text-sm text-gray-500">{trip.tripNumber}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowIssueDialog(true)}>
          <AlertCircle className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </div>

      {/* Status Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Trip Progress</span>
            <Badge variant={trip.status === 'completed' ? 'default' : 'secondary'}>
              {statusSteps[currentStepIndex]?.label}
            </Badge>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center z-10">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-success-500 text-white'
                          : isCurrent
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-1 text-center max-w-16 ${isCurrent ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                      {step.label.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-success-500 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary-500" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{trip.patient.name}</p>
              <p className="text-sm text-gray-500">DOB: {trip.patient.dob}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${trip.patient.phone}`}>
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={`sms:${trip.patient.phone}`}>
                  <MessageSquare className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Wheelchair className="h-3 w-3" />
              {trip.patient.mobility}
            </Badge>
            {trip.patient.specialNeeds.map((need) => (
              <Badge key={need} variant="outline" className="text-warning-600 border-warning-300">
                {need}
              </Badge>
            ))}
          </div>
          {trip.patient.notes && (
            <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <p className="text-sm text-warning-800">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                {trip.patient.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pickup Location */}
      <Card className={trip.status === 'en_route_pickup' || trip.status === 'arrived_pickup' ? 'border-primary-300 bg-primary-50/30' : ''}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-success-500 text-white flex items-center justify-center text-xs font-bold">
                A
              </div>
              Pickup Location
            </CardTitle>
            <span className="text-sm font-medium text-gray-600">{trip.pickup.time}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {trip.pickup.facility && (
            <p className="font-medium text-gray-900">{trip.pickup.facility}</p>
          )}
          <p className="text-sm text-gray-600">{trip.pickup.address}</p>
          {trip.pickup.room && (
            <p className="text-sm text-gray-500">{trip.pickup.room}</p>
          )}
          {trip.pickup.instructions && (
            <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
              {trip.pickup.instructions}
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trip.pickup.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Navigate to Pickup
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Dropoff Location */}
      <Card className={trip.status === 'en_route_destination' || trip.status === 'arrived_destination' ? 'border-primary-300 bg-primary-50/30' : ''}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-error-500 text-white flex items-center justify-center text-xs font-bold">
                B
              </div>
              Dropoff Location
            </CardTitle>
            {trip.dropoff.appointmentTime && (
              <span className="text-sm font-medium text-gray-600">Appt: {trip.dropoff.appointmentTime}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {trip.dropoff.facility && (
            <p className="font-medium text-gray-900">{trip.dropoff.facility}</p>
          )}
          <p className="text-sm text-gray-600">{trip.dropoff.address}</p>
          {trip.dropoff.instructions && (
            <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
              {trip.dropoff.instructions}
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trip.dropoff.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Navigate to Destination
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="font-medium text-gray-900">{trip.distance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Est. Time</p>
              <p className="font-medium text-gray-900">{trip.estimatedDuration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fare</p>
              <p className="font-medium text-gray-900">${trip.fare.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-3 flex-col gap-1">
          <Camera className="h-5 w-5" />
          <span className="text-xs">Take Photo</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1">
          <FileText className="h-5 w-5" />
          <span className="text-xs">Add Note</span>
        </Button>
      </div>

      {/* Fixed Action Button */}
      {actionButton && trip.status !== 'completed' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <Button
            className="w-full h-14 text-lg"
            onClick={() => handleStatusUpdate(actionButton.nextStatus)}
          >
            {actionButton.label}
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Completed Message */}
      {trip.status === 'completed' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-success-500 text-white text-center">
          <CheckCircle2 className="h-6 w-6 mx-auto mb-1" />
          <p className="font-medium">Trip Completed Successfully!</p>
          <p className="text-sm opacity-90">Redirecting to trip summary...</p>
        </div>
      )}

      {/* Confirm Status Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the trip status to &quot;{statusSteps.find(s => s.key === nextAction)?.label}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusUpdate}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              Describe the issue you&apos;re experiencing with this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {['Patient not ready', 'Wrong address', 'Access issue', 'Vehicle problem', 'Traffic delay', 'Other'].map((issue) => (
                <Button
                  key={issue}
                  variant={issueNote === issue ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIssueNote(issue)}
                >
                  {issue}
                </Button>
              ))}
            </div>
            <Textarea
              placeholder="Add additional details..."
              value={issueNote}
              onChange={(e) => setIssueNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowIssueDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportIssue} disabled={!issueNote}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
