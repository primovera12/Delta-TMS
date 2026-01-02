'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Car,
  Accessibility,
  Phone,
  User,
  FileText,
  Repeat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Mock patient data (would come from auth context)
const patientProfile = {
  name: 'Robert Johnson',
  phone: '(555) 123-4567',
  address: '123 Main St, Houston, TX 77001',
  mobilityType: 'wheelchair',
  specialNeeds: 'Oxygen required',
};

// Common destinations
const savedDestinations = [
  {
    id: 'dest-1',
    name: 'Memorial Hospital',
    address: '1234 Medical Center Dr, Houston, TX 77001',
    type: 'hospital',
  },
  {
    id: 'dest-2',
    name: 'City Dialysis Center',
    address: '789 Health Blvd, Houston, TX 77002',
    type: 'dialysis',
  },
  {
    id: 'dest-3',
    name: 'Heart Care Clinic',
    address: '890 Cardio Dr, Houston, TX 77004',
    type: 'clinic',
  },
];

const vehicleTypes = [
  { value: 'wheelchair', label: 'Wheelchair Van', icon: Accessibility },
  { value: 'ambulatory', label: 'Ambulatory (Sedan)', icon: Car },
  { value: 'stretcher', label: 'Stretcher Van', icon: Car },
];

const appointmentTypes = [
  { value: 'medical', label: 'Medical Appointment' },
  { value: 'dialysis', label: 'Dialysis Treatment' },
  { value: 'therapy', label: 'Physical Therapy' },
  { value: 'imaging', label: 'Imaging/X-Ray' },
  { value: 'lab', label: 'Lab Work' },
  { value: 'other', label: 'Other' },
];

export default function PatientNewTripPage() {
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [tripId, setTripId] = React.useState('');

  const [formData, setFormData] = React.useState({
    // Pickup
    pickupAddress: patientProfile.address,
    pickupNotes: '',
    // Dropoff
    dropoffAddress: '',
    dropoffNotes: '',
    selectedDestination: '',
    // Schedule
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: '',
    // Return
    needsReturn: false,
    returnTime: '',
    willCall: false,
    // Vehicle
    vehicleType: patientProfile.mobilityType,
    // Additional
    specialInstructions: patientProfile.specialNeeds || '',
    attendantNeeded: false,
    attendantName: '',
    attendantPhone: '',
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectDestination = (destId: string) => {
    const dest = savedDestinations.find((d) => d.id === destId);
    if (dest) {
      setFormData((prev) => ({
        ...prev,
        selectedDestination: destId,
        dropoffAddress: dest.address,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTripId(`TR-${Date.now()}`);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-success-100 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Trip Request Submitted
            </h2>
            <p className="text-gray-500 mb-6">
              Your trip request has been submitted successfully. You will receive a confirmation
              once a driver is assigned.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Trip Reference</p>
              <p className="text-lg font-mono font-semibold text-gray-900">{tripId}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formData.appointmentDate}</span>
                <span>at</span>
                <span>{formData.appointmentTime}</span>
              </div>
              <div className="flex items-start gap-2 justify-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5" />
                <div>
                  <p>{formData.pickupAddress}</p>
                  <p className="text-primary-600">to</p>
                  <p>{formData.dropoffAddress}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Link href="/patient/trips" className="flex-1">
                <Button variant="secondary" className="w-full">
                  View My Trips
                </Button>
              </Link>
              <Link href="/patient" className="flex-1">
                <Button className="w-full">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Request a Trip</h1>
        <p className="text-sm text-gray-500">Book transportation to your medical appointment</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {['Destination', 'Schedule', 'Details', 'Review'].map((label, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;

          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? 'bg-success-500 text-white'
                      : isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNum}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isActive ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < 3 && (
                <div
                  className={`h-0.5 w-12 sm:w-20 mx-2 ${
                    step > stepNum ? 'bg-success-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Destination */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Where are you going?</h3>

                {/* Saved Destinations */}
                <div className="mb-6">
                  <Label className="mb-3 block">Quick Select - Saved Destinations</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedDestinations.map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => selectDestination(dest.id)}
                        className={`p-4 rounded-lg border text-left transition-colors ${
                          formData.selectedDestination === dest.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{dest.name}</span>
                        </div>
                        <p className="text-sm text-gray-500">{dest.address}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">or enter address</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label>Pickup Address</Label>
                    <Input
                      value={formData.pickupAddress}
                      onChange={(e) => updateField('pickupAddress', e.target.value)}
                      placeholder="Enter pickup address"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Destination Address</Label>
                    <Input
                      value={formData.dropoffAddress}
                      onChange={(e) => {
                        updateField('dropoffAddress', e.target.value);
                        updateField('selectedDestination', '');
                      }}
                      placeholder="Enter destination address"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">When is your appointment?</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Appointment Date</Label>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => updateField('appointmentDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Appointment Time</Label>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => updateField('appointmentTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Appointment Type</Label>
                <Select
                  value={formData.appointmentType}
                  onValueChange={(value) => updateField('appointmentType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Return Trip */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Repeat className="h-5 w-5 text-gray-400" />
                  <h4 className="font-medium text-gray-900">Return Trip</h4>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.needsReturn}
                    onChange={(e) => updateField('needsReturn', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">I need a return trip</span>
                </label>

                {formData.needsReturn && (
                  <div className="ml-6 space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.willCall}
                        onChange={(e) => updateField('willCall', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600"
                      />
                      <span className="text-sm text-gray-700">
                        Will-call (I will call when ready)
                      </span>
                    </label>

                    {!formData.willCall && (
                      <div>
                        <Label>Estimated Return Time</Label>
                        <Input
                          type="time"
                          value={formData.returnTime}
                          onChange={(e) => updateField('returnTime', e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This is an estimate. Please call if your appointment runs late.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Details</h3>

              <div>
                <Label>Vehicle Type</Label>
                <div className="grid gap-3 sm:grid-cols-3 mt-2">
                  {vehicleTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => updateField('vehicleType', type.value)}
                        className={`p-4 rounded-lg border text-center transition-colors ${
                          formData.vehicleType === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                        <p className="text-sm font-medium text-gray-900">{type.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Special Instructions</Label>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={(e) => updateField('specialInstructions', e.target.value)}
                  placeholder="e.g., Oxygen required, wheelchair type, entry instructions..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Attendant */}
              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.attendantNeeded}
                    onChange={(e) => updateField('attendantNeeded', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">An attendant will be traveling with me</span>
                </label>

                {formData.attendantNeeded && (
                  <div className="ml-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Attendant Name</Label>
                      <Input
                        value={formData.attendantName}
                        onChange={(e) => updateField('attendantName', e.target.value)}
                        placeholder="Full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Attendant Phone</Label>
                      <Input
                        value={formData.attendantPhone}
                        onChange={(e) => updateField('attendantPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Pickup Notes (Optional)</Label>
                  <Input
                    value={formData.pickupNotes}
                    onChange={(e) => updateField('pickupNotes', e.target.value)}
                    placeholder="e.g., Use side entrance"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Dropoff Notes (Optional)</Label>
                  <Input
                    value={formData.dropoffNotes}
                    onChange={(e) => updateField('dropoffNotes', e.target.value)}
                    placeholder="e.g., 2nd floor, suite 201"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Trip Request</h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                {/* Route */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-success-500" />
                    <div className="h-12 border-l border-dashed border-gray-300" />
                    <div className="h-2 w-2 rounded-full bg-error-500" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="font-medium text-gray-900">{formData.pickupAddress}</p>
                      {formData.pickupNotes && (
                        <p className="text-sm text-gray-500">{formData.pickupNotes}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="font-medium text-gray-900">{formData.dropoffAddress}</p>
                      {formData.dropoffNotes && (
                        <p className="text-sm text-gray-500">{formData.dropoffNotes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{formData.appointmentDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Appointment Time</p>
                      <p className="font-medium text-gray-900">{formData.appointmentTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-medium text-gray-900">
                        {appointmentTypes.find((t) => t.value === formData.appointmentType)?.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Return */}
                {formData.needsReturn && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Repeat className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">Return Trip</span>
                    </div>
                    {formData.willCall ? (
                      <Badge variant="info">Will-Call Return</Badge>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Scheduled return at {formData.returnTime}
                      </p>
                    )}
                  </div>
                )}

                {/* Vehicle & Details */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">Vehicle Type</p>
                      <Badge variant="secondary">
                        {vehicleTypes.find((v) => v.value === formData.vehicleType)?.label}
                      </Badge>
                    </div>
                    {formData.attendantNeeded && (
                      <div>
                        <p className="text-xs text-gray-500">Attendant</p>
                        <p className="font-medium text-gray-900">{formData.attendantName}</p>
                        <p className="text-sm text-gray-500">{formData.attendantPhone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {formData.specialInstructions && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 mb-1">Special Instructions</p>
                    <p className="text-sm text-gray-900">{formData.specialInstructions}</p>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-info-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-info-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-info-800">
                  <p className="font-medium">Important</p>
                  <p>
                    Transportation will be scheduled to arrive 30-45 minutes before your appointment
                    time. You will receive a confirmation with driver details.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <Link href="/patient/trips">
                <Button variant="secondary">Cancel</Button>
              </Link>
            )}

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!formData.pickupAddress || !formData.dropoffAddress)) ||
                  (step === 2 && (!formData.appointmentDate || !formData.appointmentTime))
                }
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Request
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
