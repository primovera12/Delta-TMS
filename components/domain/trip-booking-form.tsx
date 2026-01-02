'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Car,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Building2,
  Search,
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

// Mock data
const patients = [
  { id: 'PAT-001', name: 'John Smith', phone: '(555) 123-4567', address: '123 Main St, Houston, TX' },
  { id: 'PAT-002', name: 'Mary Jones', phone: '(555) 234-5678', address: '456 Oak Ave, Houston, TX' },
  { id: 'PAT-003', name: 'Robert Brown', phone: '(555) 345-6789', address: '789 Pine Rd, Houston, TX' },
];

const facilities = [
  { id: 'FAC-001', name: 'Memorial Hospital', address: '1234 Medical Center Dr' },
  { id: 'FAC-002', name: 'City Dialysis Center', address: '789 Health Blvd' },
  { id: 'FAC-003', name: 'Heart Care Clinic', address: '890 Cardio Dr' },
];

const vehicleTypes = [
  { value: 'ambulatory', label: 'Ambulatory', description: 'Patient can walk with minimal assistance' },
  { value: 'wheelchair', label: 'Wheelchair', description: 'Patient uses a wheelchair' },
  { value: 'stretcher', label: 'Stretcher', description: 'Patient requires stretcher transport' },
  { value: 'bariatric', label: 'Bariatric', description: 'Patient requires bariatric equipment' },
];

const appointmentTypes = [
  { value: 'dialysis', label: 'Dialysis' },
  { value: 'doctor', label: 'Doctor Visit' },
  { value: 'therapy', label: 'Physical Therapy' },
  { value: 'hospital', label: 'Hospital Visit' },
  { value: 'imaging', label: 'Imaging/Lab' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'other', label: 'Other' },
];

interface TripBookingFormProps {
  onSubmit: (data: TripFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TripFormData>;
  mode?: 'create' | 'edit';
}

export interface TripFormData {
  // Patient
  patientId: string;
  patientName: string;
  patientPhone: string;
  // Pickup
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  pickupNotes: string;
  // Dropoff
  dropoffAddress: string;
  facilityId: string;
  appointmentTime: string;
  appointmentType: string;
  // Vehicle & Requirements
  vehicleType: string;
  wheelchairSize: string;
  oxygenRequired: boolean;
  attendantRequired: boolean;
  // Return Trip
  returnTrip: boolean;
  returnType: 'scheduled' | 'will-call';
  returnTime: string;
  // Additional
  specialInstructions: string;
  billingNotes: string;
}

const steps = [
  { id: 1, name: 'Patient', icon: User },
  { id: 2, name: 'Pickup', icon: MapPin },
  { id: 3, name: 'Destination', icon: Building2 },
  { id: 4, name: 'Requirements', icon: Car },
  { id: 5, name: 'Review', icon: Check },
];

export function TripBookingForm({
  onSubmit,
  onCancel,
  initialData,
  mode = 'create',
}: TripBookingFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<TripFormData>({
    patientId: '',
    patientName: '',
    patientPhone: '',
    pickupAddress: '',
    pickupDate: '',
    pickupTime: '',
    pickupNotes: '',
    dropoffAddress: '',
    facilityId: '',
    appointmentTime: '',
    appointmentType: '',
    vehicleType: 'wheelchair',
    wheelchairSize: 'standard',
    oxygenRequired: false,
    attendantRequired: false,
    returnTrip: true,
    returnType: 'will-call',
    returnTime: '',
    specialInstructions: '',
    billingNotes: '',
    ...initialData,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [patientSearch, setPatientSearch] = React.useState('');

  const updateField = (field: keyof TripFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const selectPatient = (patient: typeof patients[0]) => {
    updateField('patientId', patient.id);
    updateField('patientName', patient.name);
    updateField('patientPhone', patient.phone);
    updateField('pickupAddress', patient.address);
  };

  const selectFacility = (facility: typeof facilities[0]) => {
    updateField('facilityId', facility.id);
    updateField('dropoffAddress', facility.address);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.patientName) newErrors.patientName = 'Patient name is required';
        if (!formData.patientPhone) newErrors.patientPhone = 'Phone number is required';
        break;
      case 2:
        if (!formData.pickupAddress) newErrors.pickupAddress = 'Pickup address is required';
        if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
        if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
        break;
      case 3:
        if (!formData.dropoffAddress) newErrors.dropoffAddress = 'Destination address is required';
        if (!formData.appointmentTime) newErrors.appointmentTime = 'Appointment time is required';
        break;
      case 4:
        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.phone.includes(patientSearch)
  );

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-success-500 text-white'
                      : isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                </div>
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-center ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  <span className="hidden sm:inline">{step.name}</span>
                  <span className="sm:hidden">{step.name.split(' ')[0]}</span>
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1 sm:mx-2 ${
                    currentStep > step.id ? 'bg-success-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Step 1: Patient */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
                <p className="text-sm text-gray-500">Select or enter patient details</p>
              </div>

              {/* Patient Search */}
              <div className="space-y-2">
                <Label>Search Existing Patients</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="pl-10"
                  />
                </div>
                {patientSearch && (
                  <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          selectPatient(patient);
                          setPatientSearch('');
                        }}
                        className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.phone}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Patient Name *</Label>
                  <Input
                    value={formData.patientName}
                    onChange={(e) => updateField('patientName', e.target.value)}
                    placeholder="Enter patient name"
                    className={errors.patientName ? 'border-error-500' : ''}
                  />
                  {errors.patientName && (
                    <p className="text-sm text-error-500">{errors.patientName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={formData.patientPhone}
                    onChange={(e) => updateField('patientPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className={errors.patientPhone ? 'border-error-500' : ''}
                  />
                  {errors.patientPhone && (
                    <p className="text-sm text-error-500">{errors.patientPhone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pickup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pickup Details</h3>
                <p className="text-sm text-gray-500">Where and when to pick up the patient</p>
              </div>

              <div className="space-y-2">
                <Label>Pickup Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.pickupAddress}
                    onChange={(e) => updateField('pickupAddress', e.target.value)}
                    placeholder="Enter pickup address"
                    className={`pl-10 ${errors.pickupAddress ? 'border-error-500' : ''}`}
                  />
                </div>
                {errors.pickupAddress && (
                  <p className="text-sm text-error-500">{errors.pickupAddress}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pickup Date *</Label>
                  <Input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => updateField('pickupDate', e.target.value)}
                    className={errors.pickupDate ? 'border-error-500' : ''}
                  />
                  {errors.pickupDate && (
                    <p className="text-sm text-error-500">{errors.pickupDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Pickup Time *</Label>
                  <Input
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => updateField('pickupTime', e.target.value)}
                    className={errors.pickupTime ? 'border-error-500' : ''}
                  />
                  {errors.pickupTime && (
                    <p className="text-sm text-error-500">{errors.pickupTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pickup Notes</Label>
                <Textarea
                  value={formData.pickupNotes}
                  onChange={(e) => updateField('pickupNotes', e.target.value)}
                  placeholder="e.g., Use side entrance, call on arrival..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Destination */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Destination Details</h3>
                <p className="text-sm text-gray-500">Where is the patient going</p>
              </div>

              {/* Facility Selection */}
              <div className="space-y-2">
                <Label>Select Facility</Label>
                <div className="grid gap-2">
                  {facilities.map((facility) => (
                    <button
                      key={facility.id}
                      onClick={() => selectFacility(facility)}
                      className={`p-3 text-left rounded-lg border transition-colors ${
                        formData.facilityId === facility.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{facility.name}</p>
                      <p className="text-sm text-gray-500">{facility.address}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Or Enter Custom Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.dropoffAddress}
                    onChange={(e) => updateField('dropoffAddress', e.target.value)}
                    placeholder="Enter destination address"
                    className={`pl-10 ${errors.dropoffAddress ? 'border-error-500' : ''}`}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Appointment Time *</Label>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => updateField('appointmentTime', e.target.value)}
                    className={errors.appointmentTime ? 'border-error-500' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <Select
                    value={formData.appointmentType}
                    onValueChange={(value) => updateField('appointmentType', value)}
                  >
                    <SelectTrigger>
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
              </div>

              {/* Return Trip */}
              <div className="p-4 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Return Trip</p>
                    <p className="text-sm text-gray-500">Schedule a return trip</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.returnTrip}
                      onChange={(e) => updateField('returnTrip', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {formData.returnTrip && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Return Type</Label>
                      <Select
                        value={formData.returnType}
                        onValueChange={(value) => updateField('returnType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled Time</SelectItem>
                          <SelectItem value="will-call">Will-Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.returnType === 'scheduled' && (
                      <div className="space-y-2">
                        <Label>Return Time</Label>
                        <Input
                          type="time"
                          value={formData.returnTime}
                          onChange={(e) => updateField('returnTime', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Requirements */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Transport Requirements</h3>
                <p className="text-sm text-gray-500">Vehicle type and special requirements</p>
              </div>

              <div className="space-y-2">
                <Label>Vehicle Type *</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {vehicleTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateField('vehicleType', type.value)}
                      className={`p-4 text-left rounded-lg border transition-colors ${
                        formData.vehicleType === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{type.label}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {formData.vehicleType === 'wheelchair' && (
                <div className="space-y-2">
                  <Label>Wheelchair Size</Label>
                  <Select
                    value={formData.wheelchairSize}
                    onValueChange={(value) => updateField('wheelchairSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="wide">Wide/Oversized</SelectItem>
                      <SelectItem value="power">Power Wheelchair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <Label>Additional Requirements</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.oxygenRequired}
                      onChange={(e) => updateField('oxygenRequired', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Oxygen Required</p>
                      <p className="text-sm text-gray-500">Patient requires supplemental oxygen</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.attendantRequired}
                      onChange={(e) => updateField('attendantRequired', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Attendant Required</p>
                      <p className="text-sm text-gray-500">Patient has a caregiver accompanying</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Special Instructions</Label>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={(e) => updateField('specialInstructions', e.target.value)}
                  placeholder="Any special requirements or instructions for the driver..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Trip Details</h3>
                <p className="text-sm text-gray-500">Please confirm all information is correct</p>
              </div>

              <div className="space-y-4">
                {/* Patient */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Patient</span>
                  </div>
                  <p className="text-gray-900">{formData.patientName}</p>
                  <p className="text-sm text-gray-500">{formData.patientPhone}</p>
                </div>

                {/* Pickup */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-success-500" />
                    <span className="font-medium text-gray-700">Pickup</span>
                  </div>
                  <p className="text-gray-900">{formData.pickupAddress}</p>
                  <p className="text-sm text-gray-500">
                    {formData.pickupDate} at {formData.pickupTime}
                  </p>
                </div>

                {/* Dropoff */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-error-500" />
                    <span className="font-medium text-gray-700">Destination</span>
                  </div>
                  <p className="text-gray-900">{formData.dropoffAddress}</p>
                  <p className="text-sm text-gray-500">
                    Appointment at {formData.appointmentTime}
                  </p>
                </div>

                {/* Requirements */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Requirements</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{formData.vehicleType}</Badge>
                    {formData.oxygenRequired && (
                      <Badge variant="warning">Oxygen</Badge>
                    )}
                    {formData.attendantRequired && (
                      <Badge variant="info">Attendant</Badge>
                    )}
                    {formData.returnTrip && (
                      <Badge variant="success">
                        Return: {formData.returnType === 'will-call' ? 'Will-Call' : formData.returnTime}
                      </Badge>
                    )}
                  </div>
                </div>

                {formData.specialInstructions && (
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-700">Special Instructions</span>
                    </div>
                    <p className="text-gray-600">{formData.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {onCancel && currentStep === 1 && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {currentStep > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        <div>
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Book Trip' : 'Update Trip'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
