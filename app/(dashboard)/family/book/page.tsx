'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LinkedPatient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  transportType: string;
}

const mockPatients: LinkedPatient[] = [
  {
    id: '1',
    firstName: 'Robert',
    lastName: 'Johnson',
    phone: '(555) 123-4567',
    address: '123 Oak Street, Springfield, IL 62701',
    transportType: 'Wheelchair',
  },
  {
    id: '2',
    firstName: 'Margaret',
    lastName: 'Johnson',
    phone: '(555) 123-4568',
    address: '123 Oak Street, Springfield, IL 62701',
    transportType: 'Ambulatory',
  },
  {
    id: '3',
    firstName: 'James',
    lastName: 'Johnson',
    phone: '(555) 234-5678',
    address: '456 Elm Avenue, Springfield, IL 62702',
    transportType: 'Stretcher',
  },
];

interface BookingFormData {
  patientId: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  dropoffAddress: string;
  appointmentTime: string;
  transportType: string;
  isRoundTrip: boolean;
  returnTime: string;
  specialInstructions: string;
  needsAttendant: boolean;
  facility: string;
}

const steps = [
  { id: 1, title: 'Patient', description: 'Select patient' },
  { id: 2, title: 'Pickup', description: 'Pickup details' },
  { id: 3, title: 'Destination', description: 'Destination info' },
  { id: 4, title: 'Options', description: 'Trip options' },
  { id: 5, title: 'Review', description: 'Confirm booking' },
];

export default function FamilyBookRidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get('patientId');

  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bookingComplete, setBookingComplete] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [confirmationNumber, setConfirmationNumber] = React.useState<string>('');
  const [formData, setFormData] = React.useState<BookingFormData>({
    patientId: preselectedPatientId || '',
    pickupAddress: '',
    pickupDate: '',
    pickupTime: '',
    dropoffAddress: '',
    appointmentTime: '',
    transportType: '',
    isRoundTrip: false,
    returnTime: '',
    specialInstructions: '',
    needsAttendant: false,
    facility: '',
  });

  // Auto-fill patient info when selected
  React.useEffect(() => {
    if (formData.patientId) {
      const patient = mockPatients.find((p) => p.id === formData.patientId);
      if (patient) {
        setFormData((prev) => ({
          ...prev,
          pickupAddress: patient.address,
          transportType: patient.transportType,
        }));
      }
    }
  }, [formData.patientId]);

  const selectedPatient = mockPatients.find((p) => p.id === formData.patientId);

  const updateFormData = (field: keyof BookingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Map transport type to vehicle type enum
      const vehicleTypeMap: Record<string, string> = {
        'Ambulatory': 'SEDAN',
        'Wheelchair': 'WHEELCHAIR_ACCESSIBLE',
        'Stretcher': 'STRETCHER_VAN',
        'Bariatric': 'BARIATRIC_VEHICLE',
      };

      // Combine date and time into ISO string
      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
      const appointmentDateTime = new Date(`${formData.pickupDate}T${formData.appointmentTime}`);

      const tripData = {
        patientId: formData.patientId,
        tripType: formData.isRoundTrip ? 'ROUND_TRIP' : 'ONE_WAY',
        vehicleType: vehicleTypeMap[formData.transportType] || 'SEDAN',
        pickupAddress: formData.pickupAddress,
        dropoffAddress: formData.dropoffAddress,
        pickupTime: pickupDateTime.toISOString(),
        appointmentTime: appointmentDateTime.toISOString(),
        notes: formData.specialInstructions || undefined,
        wheelchairRequired: formData.transportType === 'Wheelchair',
        stretcherRequired: formData.transportType === 'Stretcher',
        bariatricRequired: formData.transportType === 'Bariatric',
      };

      const response = await fetch('/api/v1/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to book trip');
      }

      setConfirmationNumber(result.data?.tripNumber || `RID-${Date.now().toString().slice(-6)}`);
      setBookingComplete(true);
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError(error instanceof Error ? error.message : 'Failed to book trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.patientId;
      case 2:
        return !!formData.pickupAddress && !!formData.pickupDate && !!formData.pickupTime;
      case 3:
        return !!formData.dropoffAddress && !!formData.appointmentTime;
      case 4:
        return !!formData.transportType;
      default:
        return true;
    }
  };

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-success-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ride Booked Successfully!</h2>
            <p className="text-gray-500 text-center mb-6">
              Your ride for {selectedPatient?.firstName} {selectedPatient?.lastName} has been scheduled.
              <br />
              A confirmation has been sent to your phone.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 w-full max-w-sm mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Confirmation #</span>
                  <span className="font-medium">RID-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formData.pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pickup Time</span>
                  <span className="font-medium">{formData.pickupTime}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/family/rides')}>
                View My Rides
              </Button>
              <Button onClick={() => {
                setBookingComplete(false);
                setCurrentStep(1);
                setFormData({
                  patientId: '',
                  pickupAddress: '',
                  pickupDate: '',
                  pickupTime: '',
                  dropoffAddress: '',
                  appointmentTime: '',
                  transportType: '',
                  isRoundTrip: false,
                  returnTime: '',
                  specialInstructions: '',
                  needsAttendant: false,
                  facility: '',
                });
              }}>
                Book Another Ride
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Book a Ride</h1>
        <p className="text-sm text-gray-500">Schedule transportation for your family member</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep > step.id
                    ? 'bg-success-500 text-white'
                    : currentStep === step.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-success-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Select Patient */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Select Patient</h2>
              <p className="text-sm text-gray-500">Choose the family member you're booking this ride for</p>

              <div className="grid gap-3">
                {mockPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => updateFormData('patientId', patient.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.patientId === patient.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{patient.address}</p>
                      </div>
                      <Badge variant="secondary">{patient.transportType}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pickup Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Pickup Details</h2>
              <p className="text-sm text-gray-500">Enter pickup location and time</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Pickup Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="pickupAddress"
                      className="pl-10"
                      placeholder="Enter pickup address"
                      value={formData.pickupAddress}
                      onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="pickupDate"
                        type="date"
                        className="pl-10"
                        value={formData.pickupDate}
                        onChange={(e) => updateFormData('pickupDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="pickupTime"
                        type="time"
                        className="pl-10"
                        value={formData.pickupTime}
                        onChange={(e) => updateFormData('pickupTime', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-info-50 border border-info-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-info-600 mt-0.5" />
                    <div className="text-sm text-info-800">
                      <p>We recommend scheduling pickup at least 1 hour before your appointment time to ensure timely arrival.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Destination */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Destination</h2>
              <p className="text-sm text-gray-500">Enter destination and appointment details</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facility">Facility (Optional)</Label>
                  <Select value={formData.facility} onValueChange={(v) => updateFormData('facility', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a saved facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="memorial">Memorial Hospital</SelectItem>
                      <SelectItem value="city-medical">City Medical Center</SelectItem>
                      <SelectItem value="dialysis">Regional Dialysis Center</SelectItem>
                      <SelectItem value="downtown">Downtown Clinic</SelectItem>
                      <SelectItem value="other">Other (Enter manually)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoffAddress">Destination Address</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="dropoffAddress"
                      className="pl-10"
                      placeholder="Enter destination address"
                      value={formData.dropoffAddress}
                      onChange={(e) => updateFormData('dropoffAddress', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentTime">Appointment Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="appointmentTime"
                      type="time"
                      className="pl-10"
                      value={formData.appointmentTime}
                      onChange={(e) => updateFormData('appointmentTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Options */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Trip Options</h2>
              <p className="text-sm text-gray-500">Configure additional trip settings</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transportType">Transport Type</Label>
                  <Select
                    value={formData.transportType}
                    onValueChange={(v) => updateFormData('transportType', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ambulatory">Ambulatory</SelectItem>
                      <SelectItem value="Wheelchair">Wheelchair</SelectItem>
                      <SelectItem value="Stretcher">Stretcher</SelectItem>
                      <SelectItem value="Bariatric">Bariatric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <Checkbox
                    id="roundTrip"
                    checked={formData.isRoundTrip}
                    onCheckedChange={(checked) => updateFormData('isRoundTrip', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="roundTrip" className="font-medium cursor-pointer">
                      <Repeat className="h-4 w-4 inline-block mr-2" />
                      Round Trip
                    </Label>
                    <p className="text-sm text-gray-500">Include a return trip after the appointment</p>
                  </div>
                </div>

                {formData.isRoundTrip && (
                  <div className="space-y-2 pl-6 border-l-2 border-primary-200">
                    <Label htmlFor="returnTime">Estimated Return Pickup Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="returnTime"
                        type="time"
                        className="pl-10"
                        value={formData.returnTime}
                        onChange={(e) => updateFormData('returnTime', e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      We'll call you when the appointment is done to confirm pickup
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <Checkbox
                    id="attendant"
                    checked={formData.needsAttendant}
                    onCheckedChange={(checked) => updateFormData('needsAttendant', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="attendant" className="font-medium cursor-pointer">
                      Attendant Required
                    </Label>
                    <p className="text-sm text-gray-500">An attendant will accompany the patient</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="Enter any special requirements or notes for the driver..."
                    value={formData.specialInstructions}
                    onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Review & Confirm</h2>
              <p className="text-sm text-gray-500">Please review your booking details</p>

              <div className="space-y-4">
                {/* Patient Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Patient</h3>
                  <p className="font-medium text-gray-900">
                    {selectedPatient?.firstName} {selectedPatient?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedPatient?.phone}</p>
                </div>

                {/* Trip Details */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Trip Details</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-success-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-sm font-medium text-gray-900">{formData.pickupAddress}</p>
                        <p className="text-sm text-gray-500">
                          {formData.pickupDate} at {formData.pickupTime}
                        </p>
                      </div>
                    </div>

                    <div className="ml-4 border-l-2 border-dashed border-gray-200 h-4" />

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="text-sm font-medium text-gray-900">{formData.dropoffAddress}</p>
                        <p className="text-sm text-gray-500">
                          Appointment at {formData.appointmentTime}
                        </p>
                      </div>
                    </div>

                    {formData.isRoundTrip && (
                      <>
                        <div className="ml-4 border-l-2 border-dashed border-gray-200 h-4" />
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-info-100 flex items-center justify-center">
                            <Repeat className="h-4 w-4 text-info-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Return Trip</p>
                            <p className="text-sm font-medium text-gray-900">Back to pickup location</p>
                            <p className="text-sm text-gray-500">
                              Estimated return: {formData.returnTime || 'Will call'}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Options Summary */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{formData.transportType}</Badge>
                  {formData.isRoundTrip && <Badge variant="info">Round Trip</Badge>}
                  {formData.needsAttendant && <Badge variant="warning">Attendant Required</Badge>}
                </div>

                {formData.specialInstructions && (
                  <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <p className="text-sm font-medium text-warning-900">Special Instructions:</p>
                    <p className="text-sm text-warning-800">{formData.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Car className="h-4 w-4 mr-2 animate-pulse" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Car className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
