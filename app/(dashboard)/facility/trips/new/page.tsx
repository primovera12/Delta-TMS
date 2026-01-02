'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  Calendar,
  Car,
  CheckCircle,
  Search,
  Plus,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock patient data
const recentPatients = [
  { id: 'PAT-001', name: 'John Smith', dob: '1952-03-15', phone: '(555) 123-4567' },
  { id: 'PAT-002', name: 'Mary Jones', dob: '1948-07-22', phone: '(555) 234-5678' },
  { id: 'PAT-003', name: 'Robert Brown', dob: '1960-11-08', phone: '(555) 345-6789' },
];

const steps = [
  { id: 'patient', label: 'Patient', icon: User },
  { id: 'trip', label: 'Trip Details', icon: MapPin },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

export default function FacilityNewTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    // Patient
    patientId: '',
    patientName: '',
    patientDob: '',
    patientPhone: '',
    // Trip
    tripType: 'outbound',
    vehicleType: 'ambulatory',
    specialNeeds: [] as string[],
    pickupLocation: '',
    pickupUnit: '',
    pickupInstructions: '',
    dropoffLocation: '',
    dropoffUnit: '',
    dropoffInstructions: '',
    // Schedule
    tripDate: '',
    pickupTime: '',
    appointmentTime: '',
    isRecurring: false,
    // Notes
    notes: '',
  });

  const handleSelectPatient = (patient: typeof recentPatients[0]) => {
    setFormData({
      ...formData,
      patientId: patient.id,
      patientName: patient.name,
      patientDob: patient.dob,
      patientPhone: patient.phone,
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Submit the form
    router.push('/facility/trips');
  };

  const toggleSpecialNeed = (need: string) => {
    setFormData({
      ...formData,
      specialNeeds: formData.specialNeeds.includes(need)
        ? formData.specialNeeds.filter((n) => n !== need)
        : [...formData.specialNeeds, need],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Book Transport</h1>
          <p className="text-sm text-gray-500">Schedule a new patient transport</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-success-600 text-white'
                      : isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded-full ${
                    index < currentStep ? 'bg-success-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Patient Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search patients by name or ID..." className="pl-10" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Recent Patients</p>
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.patientId === patient.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {patient.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">
                            DOB: {patient.dob} • {patient.phone}
                          </p>
                        </div>
                      </div>
                      {formData.patientId === patient.id && (
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                  ))}
                </div>

                <Button variant="secondary" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Patient
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Trip Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Trip Details</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Trip Type</Label>
                  <Select
                    value={formData.tripType}
                    onValueChange={(v) => setFormData({ ...formData, tripType: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outbound">Outbound (Hospital → Home)</SelectItem>
                      <SelectItem value="inbound">Inbound (Home → Hospital)</SelectItem>
                      <SelectItem value="transfer">Transfer (Facility → Facility)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(v) => setFormData({ ...formData, vehicleType: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambulatory">Ambulatory</SelectItem>
                      <SelectItem value="wheelchair">Wheelchair Van</SelectItem>
                      <SelectItem value="stretcher">Stretcher Van</SelectItem>
                      <SelectItem value="bariatric">Bariatric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Special Needs</Label>
                <div className="flex flex-wrap gap-2">
                  {['Oxygen', 'IV', 'Attendant', 'Two-Person Assist', 'Isolation'].map((need) => (
                    <Badge
                      key={need}
                      variant={formData.specialNeeds.includes(need) ? 'info' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleSpecialNeed(need)}
                    >
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Pickup Location</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pickupLocation">Address/Building</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Memorial Hospital - Main Building</SelectItem>
                        <SelectItem value="er">Memorial Hospital - ER</SelectItem>
                        <SelectItem value="radiology">Memorial Hospital - Radiology</SelectItem>
                        <SelectItem value="oncology">Memorial Hospital - Oncology</SelectItem>
                        <SelectItem value="other">Other Address...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pickupUnit">Unit/Room (Optional)</Label>
                    <Input
                      id="pickupUnit"
                      placeholder="e.g., Room 405"
                      value={formData.pickupUnit}
                      onChange={(e) => setFormData({ ...formData, pickupUnit: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
                  <Textarea
                    id="pickupInstructions"
                    placeholder="Any special instructions for pickup..."
                    value={formData.pickupInstructions}
                    onChange={(e) => setFormData({ ...formData, pickupInstructions: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Dropoff Location</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="dropoffLocation">Address</Label>
                    <Input
                      id="dropoffLocation"
                      placeholder="Enter dropoff address"
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dropoffInstructions">Dropoff Instructions</Label>
                  <Textarea
                    id="dropoffInstructions"
                    placeholder="Any special instructions for dropoff..."
                    value={formData.dropoffInstructions}
                    onChange={(e) => setFormData({ ...formData, dropoffInstructions: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="tripDate">Date</Label>
                  <Input
                    id="tripDate"
                    type="date"
                    value={formData.tripDate}
                    onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="pickupTime">Pickup Time</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="appointmentTime">Appointment Time (Optional)</Label>
                  <Input
                    id="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-lg bg-info-50">
                <Clock className="h-5 w-5 text-info-600" />
                <p className="text-sm text-info-700">
                  Estimated pickup window: 30 minutes before and after the scheduled time
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
                <Checkbox
                  id="recurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRecurring: checked as boolean })
                  }
                />
                <div>
                  <Label htmlFor="recurring" className="cursor-pointer">
                    Make this a recurring trip
                  </Label>
                  <p className="text-sm text-gray-500">
                    Set up a standing order for regular transport
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Review & Confirm</h2>

              <div className="space-y-4">
                {/* Patient */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Patient</p>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)}>
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {formData.patientName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{formData.patientName}</p>
                      <p className="text-sm text-gray-500">{formData.patientPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Trip Details</p>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                      Edit
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 capitalize">{formData.tripType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium text-gray-900 capitalize">{formData.vehicleType}</p>
                    </div>
                  </div>
                  {formData.specialNeeds.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.specialNeeds.map((need) => (
                        <Badge key={need} variant="info" size="sm">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Route */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Route</p>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-success-100 flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-success-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pickup</p>
                        <p className="font-medium text-gray-900">
                          {formData.pickupLocation || 'Memorial Hospital - Main Building'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-error-100 flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-error-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dropoff</p>
                        <p className="font-medium text-gray-900">
                          {formData.dropoffLocation || '123 Main St, Houston, TX'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Schedule</p>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                      Edit
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {formData.tripDate || 'January 15, 2026'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Time</p>
                      <p className="font-medium text-gray-900">
                        {formData.pickupTime || '10:30 AM'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Appointment</p>
                      <p className="font-medium text-gray-900">
                        {formData.appointmentTime || '11:00 AM'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-50 border border-warning-200">
                <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-800">Before submitting</p>
                  <p className="text-sm text-warning-700">
                    Please verify all information is correct. You can edit any section by clicking Edit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Submit Request
          </Button>
        )}
      </div>
    </div>
  );
}
