'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Car,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Camera,
  Pen,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Mock trip data
const tripData = {
  id: 'TR-20260115-012',
  patient: {
    name: 'John Smith',
    phone: '(555) 123-4567',
    dateOfBirth: '1952-03-15',
    memberId: 'MBR-00012345',
    notes: 'Hard of hearing, prefers written communication',
  },
  pickup: {
    address: '123 Main St, Houston, TX 77001',
    time: '10:30 AM',
    instructions: 'Ring doorbell, wait for aide. Apartment 4B, second floor.',
    coords: { lat: 29.7604, lng: -95.3698 },
  },
  dropoff: {
    address: 'Memorial Hospital, 6400 Fannin St, Houston, TX 77030',
    time: '11:00 AM',
    instructions: 'Emergency entrance, use ramp access',
    coords: { lat: 29.7108, lng: -95.3978 },
  },
  status: 'driver_en_route',
  vehicleType: 'wheelchair',
  specialNeeds: ['wheelchair', 'oxygen'],
  fare: 85.50,
  distance: 12.5,
  estimatedDuration: '25 min',
  appointmentTime: '11:30 AM',
  appointmentType: 'Follow-up',
  facility: {
    name: 'Memorial Hospital',
    department: 'Cardiology',
    phone: '(713) 555-0100',
  },
  mileage: {
    start: null,
    end: null,
  },
  signatures: {
    pickup: null,
    dropoff: null,
  },
  notes: '',
};

const tripStatusSteps = [
  { key: 'assigned', label: 'Assigned', icon: CheckCircle },
  { key: 'driver_en_route', label: 'En Route to Pickup', icon: Navigation },
  { key: 'arrived_pickup', label: 'At Pickup', icon: MapPin },
  { key: 'patient_onboard', label: 'Patient Onboard', icon: Car },
  { key: 'arrived_dropoff', label: 'At Dropoff', icon: MapPin },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function DriverTripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = React.useState(tripData);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(1);
  const [showSignatureModal, setShowSignatureModal] = React.useState(false);
  const [showNotesModal, setShowNotesModal] = React.useState(false);
  const [signatureType, setSignatureType] = React.useState<'pickup' | 'dropoff'>('pickup');
  const [notes, setNotes] = React.useState('');

  const handleStatusUpdate = () => {
    if (currentStepIndex < tripStatusSteps.length - 1) {
      // Check if signature is needed
      if (currentStepIndex === 2) {
        // Arrived at pickup - need pickup signature
        setSignatureType('pickup');
        setShowSignatureModal(true);
      } else if (currentStepIndex === 4) {
        // Arrived at dropoff - need dropoff signature
        setSignatureType('dropoff');
        setShowSignatureModal(true);
      } else {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const handleSignatureComplete = () => {
    setShowSignatureModal(false);
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const getStatusButtonLabel = () => {
    switch (currentStepIndex) {
      case 0:
        return 'Start Navigation';
      case 1:
        return "I've Arrived at Pickup";
      case 2:
        return 'Confirm Pickup';
      case 3:
        return "I've Arrived at Dropoff";
      case 4:
        return 'Complete Trip';
      default:
        return 'Trip Completed';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Trip Details</h1>
          <p className="text-sm text-gray-500 font-mono">{trip.id}</p>
        </div>
        <Badge variant="in-progress">
          {tripStatusSteps[currentStepIndex]?.label}
        </Badge>
      </div>

      {/* Status Progress */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between overflow-x-auto">
            {tripStatusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center min-w-[80px]">
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
                      className={`mt-2 text-xs font-medium text-center ${
                        isActive ? 'text-primary-600' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < tripStatusSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full min-w-[20px] ${
                        index < currentStepIndex ? 'bg-success-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-4">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {trip.patient.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{trip.patient.name}</h3>
                    <p className="text-sm text-gray-500">DOB: {trip.patient.dateOfBirth}</p>
                    <p className="text-sm text-gray-500">ID: {trip.patient.memberId}</p>
                  </div>
                </div>
                <Button variant="secondary">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>

              {trip.patient.notes && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-50 border border-warning-200">
                  <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning-800">Patient Notes</p>
                    <p className="text-sm text-warning-700">{trip.patient.notes}</p>
                  </div>
                </div>
              )}

              {/* Special Needs */}
              <div className="flex flex-wrap gap-2">
                {trip.specialNeeds.map((need) => (
                  <Badge key={need} variant="info">
                    {need}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Route Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-success-600" />
                  </div>
                  <div className="flex-1 w-px bg-gray-200 my-2" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Pickup</p>
                      <p className="text-sm text-gray-600">{trip.pickup.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{trip.pickup.time}</p>
                    </div>
                  </div>
                  {trip.pickup.instructions && (
                    <div className="flex items-start gap-2 mt-2 p-2 rounded bg-gray-50">
                      <AlertCircle className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{trip.pickup.instructions}</p>
                    </div>
                  )}
                  <Button variant="secondary" size="sm" className="mt-3">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-error-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-error-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Dropoff</p>
                      <p className="text-sm text-gray-600">{trip.dropoff.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{trip.dropoff.time}</p>
                    </div>
                  </div>
                  {trip.dropoff.instructions && (
                    <div className="flex items-start gap-2 mt-2 p-2 rounded bg-gray-50">
                      <AlertCircle className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{trip.dropoff.instructions}</p>
                    </div>
                  )}
                  <Button variant="secondary" size="sm" className="mt-3">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>

              {/* Trip Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{trip.distance}</p>
                  <p className="text-sm text-gray-500">miles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{trip.estimatedDuration}</p>
                  <p className="text-sm text-gray-500">estimated</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${trip.fare.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">fare</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Action */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStepIndex < tripStatusSteps.length - 1 ? (
                <Button className="w-full" size="lg" onClick={handleStatusUpdate}>
                  {getStatusButtonLabel()}
                </Button>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-success-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Trip Completed</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setShowNotesModal(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
                <Button variant="secondary">
                  <Camera className="h-4 w-4 mr-2" />
                  Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Time</span>
                <span className="text-sm font-medium text-gray-900">{trip.appointmentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-sm font-medium text-gray-900">{trip.appointmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Facility</span>
                <span className="text-sm font-medium text-gray-900">{trip.facility.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Department</span>
                <span className="text-sm font-medium text-gray-900">{trip.facility.department}</span>
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-2">
                <Phone className="h-4 w-4 mr-2" />
                Call Facility
              </Button>
            </CardContent>
          </Card>

          {/* Signatures */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Signatures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <Pen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Pickup Signature</span>
                </div>
                {trip.signatures.pickup ? (
                  <Badge variant="success" size="sm">Captured</Badge>
                ) : (
                  <Badge variant="secondary" size="sm">Pending</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <Pen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Dropoff Signature</span>
                </div>
                {trip.signatures.dropoff ? (
                  <Badge variant="success" size="sm">Captured</Badge>
                ) : (
                  <Badge variant="secondary" size="sm">Pending</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Signature Modal */}
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {signatureType === 'pickup' ? 'Pickup' : 'Dropoff'} Signature
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Pen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Sign here</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Have the {signatureType === 'pickup' ? 'patient or aide' : 'facility staff'} sign above
            </p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowSignatureModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSignatureComplete}>
              Confirm Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trip Notes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any notes about this trip..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowNotesModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNotesModal(false)}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
