'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Building2,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Info,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface BookingFormData {
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  dropoffAddress: string;
  appointmentTime: string;
  appointmentType: string;
  transportType: string;
  isRoundTrip: boolean;
  returnTime: string;
  specialInstructions: string;
  needsAttendant: boolean;
}

const steps = [
  { id: 1, title: 'Pickup', description: 'Where & when' },
  { id: 2, title: 'Destination', description: 'Appointment details' },
  { id: 3, title: 'Options', description: 'Trip preferences' },
  { id: 4, title: 'Confirm', description: 'Review booking' },
];

const savedAddresses = [
  { id: '1', label: 'Home', address: '123 Oak Street, Springfield, IL 62701' },
  { id: '2', label: 'Work', address: '456 Business Park, Springfield, IL 62702' },
];

const frequentDestinations = [
  { id: '1', name: 'Regional Dialysis Center', address: '789 Medical Drive, Springfield, IL 62703' },
  { id: '2', name: 'City Medical Center', address: '321 Hospital Way, Springfield, IL 62704' },
  { id: '3', name: 'Downtown Clinic', address: '555 Main Street, Springfield, IL 62705' },
];

export default function PatientBookRidePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bookingComplete, setBookingComplete] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [confirmationNumber, setConfirmationNumber] = React.useState<string>('');
  const [formData, setFormData] = React.useState<BookingFormData>({
    pickupAddress: '',
    pickupDate: '',
    pickupTime: '',
    dropoffAddress: '',
    appointmentTime: '',
    appointmentType: '',
    transportType: 'Ambulatory',
    isRoundTrip: false,
    returnTime: '',
    specialInstructions: '',
    needsAttendant: false,
  });

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
        return !!formData.pickupAddress && !!formData.pickupDate && !!formData.pickupTime;
      case 2:
        return !!formData.dropoffAddress && !!formData.appointmentTime;
      case 3:
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
              Your ride has been scheduled. You will receive a confirmation via SMS.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 w-full max-w-sm mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Confirmation #</span>
                  <span className="font-medium">{confirmationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formData.pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pickup Time</span>
                  <span className="font-medium">{formData.pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transport</span>
                  <span className="font-medium">{formData.transportType}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/patient/trips')}>
                View My Trips
              </Button>
              <Button onClick={() => {
                setBookingComplete(false);
                setBookingError(null);
                setConfirmationNumber('');
                setCurrentStep(1);
                setFormData({
                  pickupAddress: '',
                  pickupDate: '',
                  pickupTime: '',
                  dropoffAddress: '',
                  appointmentTime: '',
                  appointmentType: '',
                  transportType: 'Ambulatory',
                  isRoundTrip: false,
                  returnTime: '',
                  specialInstructions: '',
                  needsAttendant: false,
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Book a Ride</h1>
        <p className="text-sm text-gray-500">Schedule your medical transportation</p>
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
          {/* Step 1: Pickup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Pickup Details</h2>

              {/* Saved Addresses */}
              <div>
                <Label className="mb-2 block">Quick Select</Label>
                <div className="flex gap-2">
                  {savedAddresses.map((addr) => (
                    <Button
                      key={addr.id}
                      variant={formData.pickupAddress === addr.address ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFormData('pickupAddress', addr.address)}
                    >
                      {addr.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="pickupAddress"
                    className="pl-10"
                    placeholder="Enter your pickup address"
                    value={formData.pickupAddress}
                    onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Date</Label>
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
                  <p className="text-sm text-info-800">
                    Schedule your pickup at least 1 hour before your appointment to ensure timely arrival.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Destination */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Destination</h2>

              {/* Frequent Destinations */}
              <div>
                <Label className="mb-2 block">Frequent Destinations</Label>
                <div className="grid gap-2">
                  {frequentDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => updateFormData('dropoffAddress', dest.address)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.dropoffAddress === dest.address
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{dest.name}</p>
                      <p className="text-sm text-gray-500">{dest.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoffAddress">Or Enter Address</Label>
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

              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <Select
                    value={formData.appointmentType}
                    onValueChange={(v) => updateFormData('appointmentType', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dialysis">Dialysis</SelectItem>
                      <SelectItem value="Doctor Visit">Doctor Visit</SelectItem>
                      <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                      <SelectItem value="Lab Work">Lab Work</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Options */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Trip Options</h2>

              <div className="space-y-2">
                <Label>Transport Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Ambulatory', 'Wheelchair', 'Stretcher', 'Bariatric'].map((type) => (
                    <div
                      key={type}
                      onClick={() => updateFormData('transportType', type)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.transportType === type
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Car className={`h-5 w-5 ${formData.transportType === type ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.transportType === type ? 'text-primary-700' : 'text-gray-700'}`}>
                          {type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <p className="text-sm text-gray-500">Include return trip after appointment</p>
                </div>
              </div>

              {formData.isRoundTrip && (
                <div className="space-y-2 pl-6 border-l-2 border-primary-200">
                  <Label htmlFor="returnTime">Estimated Return Time</Label>
                  <Input
                    id="returnTime"
                    type="time"
                    value={formData.returnTime}
                    onChange={(e) => updateFormData('returnTime', e.target.value)}
                  />
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
                  <p className="text-sm text-gray-500">Companion will accompany you</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special requirements or notes..."
                  value={formData.specialInstructions}
                  onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Review & Confirm</h2>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-medium text-gray-700">Trip Summary</h3>
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
                        {formData.appointmentType && ` • ${formData.appointmentType}`}
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
                            {formData.returnTime ? `Estimated: ${formData.returnTime}` : 'Will call when ready'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{formData.transportType}</Badge>
                {formData.isRoundTrip && <Badge variant="info">Round Trip</Badge>}
                {formData.needsAttendant && <Badge variant="warning">Attendant</Badge>}
              </div>

              {formData.specialInstructions && (
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <p className="text-sm font-medium text-warning-900">Special Instructions:</p>
                  <p className="text-sm text-warning-800">{formData.specialInstructions}</p>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  By confirming this booking, you agree to our terms of service. A driver will be assigned
                  and you will receive confirmation via SMS.
                </p>
              </div>

              {bookingError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">Booking Failed</p>
                  <p className="text-sm text-destructive/80">{bookingError}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
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
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Need help? Call us at{' '}
          <a href="tel:1-800-555-0123" className="text-primary-600 hover:underline">
            1-800-555-0123
          </a>
        </p>
      </div>
    </div>
  );
}
