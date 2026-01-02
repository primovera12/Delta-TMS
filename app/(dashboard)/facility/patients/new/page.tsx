'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Accessibility,
  AlertCircle,
  UserPlus,
  Heart,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface PatientFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  ssn: string;
  memberId: string;

  // Contact Information
  phone: string;
  altPhone: string;
  email: string;

  // Address
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;

  // Medical Information
  mobilityType: string;
  specialNeeds: string[];
  medicalNotes: string;
  primaryDiagnosis: string;

  // Emergency Contact
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;

  // Insurance
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceGroupNumber: string;
}

const initialFormData: PatientFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  ssn: '',
  memberId: '',
  phone: '',
  altPhone: '',
  email: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  mobilityType: '',
  specialNeeds: [],
  medicalNotes: '',
  primaryDiagnosis: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  insuranceGroupNumber: '',
};

const mobilityTypes = [
  { id: 'ambulatory', label: 'Ambulatory', description: 'Can walk independently' },
  { id: 'wheelchair', label: 'Wheelchair', description: 'Requires wheelchair transport' },
  { id: 'stretcher', label: 'Stretcher', description: 'Requires stretcher/gurney' },
  { id: 'bariatric', label: 'Bariatric', description: 'Requires bariatric equipment' },
];

const specialNeedOptions = [
  'Oxygen',
  'Hearing Impaired',
  'Vision Impaired',
  'Non-English Speaker',
  'Dementia/Alzheimer\'s',
  'Dialysis',
  'Cardiac Condition',
  'Requires Aide',
  'Door-to-Door Assistance',
  'Service Animal',
];

export default function FacilityAddPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<PatientFormData>(initialFormData);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Contact & Address', icon: MapPin },
    { number: 3, title: 'Medical', icon: Heart },
    { number: 4, title: 'Emergency & Insurance', icon: Shield },
  ];

  const updateField = (field: keyof PatientFormData, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleSpecialNeed = (need: string) => {
    const current = formData.specialNeeds;
    if (current.includes(need)) {
      updateField('specialNeeds', current.filter((n) => n !== need));
    } else {
      updateField('specialNeeds', [...current, need]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-success-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Patient Added Successfully</h1>
        <p className="text-gray-500 mb-6">
          {formData.firstName} {formData.lastName} has been added to your facility&apos;s patient roster.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/facility/patients')}>
            View All Patients
          </Button>
          <Button onClick={() => {
            setFormData(initialFormData);
            setCurrentStep(1);
            setIsComplete(false);
          }}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Another Patient
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Patient</h1>
          <p className="text-sm text-gray-500">Enter patient information to add them to your facility</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-success-500 text-white'
                          : isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${isCompleted ? 'bg-success-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ssn">SSN (Last 4 digits)</Label>
                    <Input
                      id="ssn"
                      value={formData.ssn}
                      onChange={(e) => updateField('ssn', e.target.value)}
                      placeholder="XXXX"
                      maxLength={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberId">Member/Patient ID</Label>
                    <Input
                      id="memberId"
                      value={formData.memberId}
                      onChange={(e) => updateField('memberId', e.target.value)}
                      placeholder="Enter member ID"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Address */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altPhone">Alternate Phone</Label>
                    <Input
                      id="altPhone"
                      type="tel"
                      value={formData.altPhone}
                      onChange={(e) => updateField('altPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Home Address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="apartment">Apartment/Unit/Room</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => updateField('apartment', e.target.value)}
                      placeholder="Apt 4B, Room 215, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        placeholder="IL"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        value={formData.zip}
                        onChange={(e) => updateField('zip', e.target.value)}
                        placeholder="62701"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Mobility Requirements</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {mobilityTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.mobilityType === type.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateField('mobilityType', type.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Accessibility className={`h-5 w-5 ${
                          formData.mobilityType === type.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            formData.mobilityType === type.id ? 'text-primary-900' : 'text-gray-900'
                          }`}>
                            {type.label}
                          </p>
                          <p className="text-sm text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Special Needs</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {specialNeedOptions.map((need) => (
                    <div key={need} className="flex items-center gap-3">
                      <Checkbox
                        id={need}
                        checked={formData.specialNeeds.includes(need)}
                        onCheckedChange={() => toggleSpecialNeed(need)}
                      />
                      <Label htmlFor={need} className="cursor-pointer">{need}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
                  <Input
                    id="primaryDiagnosis"
                    value={formData.primaryDiagnosis}
                    onChange={(e) => updateField('primaryDiagnosis', e.target.value)}
                    placeholder="e.g., ESRD, CHF, Diabetes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Medical Notes</Label>
                  <Textarea
                    id="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={(e) => updateField('medicalNotes', e.target.value)}
                    placeholder="Any important medical information or transport notes..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Emergency & Insurance */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name *</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyName}
                      onChange={(e) => updateField('emergencyName', e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Select
                      value={formData.emergencyRelationship}
                      onValueChange={(v) => updateField('emergencyRelationship', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="emergencyPhone">Phone Number *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateField('emergencyPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Select
                      value={formData.insuranceProvider}
                      onValueChange={(v) => updateField('insuranceProvider', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicare">Medicare</SelectItem>
                        <SelectItem value="medicaid">Medicaid</SelectItem>
                        <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                        <SelectItem value="aetna">Aetna</SelectItem>
                        <SelectItem value="cigna">Cigna</SelectItem>
                        <SelectItem value="united">United Healthcare</SelectItem>
                        <SelectItem value="humana">Humana</SelectItem>
                        <SelectItem value="private">Private Pay</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={(e) => updateField('insurancePolicyNumber', e.target.value)}
                      placeholder="Policy number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceGroupNumber">Group Number</Label>
                    <Input
                      id="insuranceGroupNumber"
                      value={formData.insuranceGroupNumber}
                      onChange={(e) => updateField('insuranceGroupNumber', e.target.value)}
                      placeholder="Group number"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Patient Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Name:</p>
                  <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                  <p className="text-gray-500">Address:</p>
                  <p className="font-medium">{formData.address}, {formData.city}</p>
                  <p className="text-gray-500">Mobility:</p>
                  <p className="font-medium capitalize">{formData.mobilityType || 'Not specified'}</p>
                  <p className="text-gray-500">Special Needs:</p>
                  <p className="font-medium">{formData.specialNeeds.length > 0 ? formData.specialNeeds.join(', ') : 'None'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            'Saving...'
          ) : currentStep === 4 ? (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Patient
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
