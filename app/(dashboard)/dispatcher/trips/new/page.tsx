'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  Clock,
  Car,
  DollarSign,
  Check,
  Accessibility,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/toast';

// Form validation schema
const tripBookingSchema = z.object({
  // Patient info
  patientType: z.enum(['existing', 'new']),
  existingPatientId: z.string().optional(),
  firstName: z.string().min(2, 'First name is required').optional(),
  lastName: z.string().min(2, 'Last name is required').optional(),
  phone: z.string().min(10, 'Valid phone number required').optional(),
  email: z.string().email().optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),

  // Trip details
  tripType: z.enum(['one-way', 'round-trip', 'multi-stop']),
  isAsap: z.boolean().default(false),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().min(1, 'Time is required'),
  appointmentTime: z.string().optional(),

  // Pickup address
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  pickupCity: z.string().min(2, 'City is required'),
  pickupState: z.string().min(2, 'State is required'),
  pickupZip: z.string().min(5, 'ZIP code is required'),
  pickupInstructions: z.string().optional(),

  // Dropoff address
  dropoffAddress: z.string().min(5, 'Dropoff address is required'),
  dropoffCity: z.string().min(2, 'City is required'),
  dropoffState: z.string().min(2, 'State is required'),
  dropoffZip: z.string().min(5, 'ZIP code is required'),
  dropoffInstructions: z.string().optional(),

  // Return trip (if round-trip)
  returnTime: z.string().optional(),
  isWillCallReturn: z.boolean().default(false),

  // Vehicle and medical requirements
  vehicleType: z.enum(['sedan', 'wheelchair', 'stretcher', 'bariatric']),
  wheelchairRequired: z.boolean().default(false),
  stretcherRequired: z.boolean().default(false),
  oxygenRequired: z.boolean().default(false),
  bariatricRequired: z.boolean().default(false),
  companions: z.number().min(0).max(3).default(0),

  // Notes
  bookingNotes: z.string().optional(),
  specialRequirements: z.string().optional(),
});

type TripBookingFormData = z.infer<typeof tripBookingSchema>;

const steps = [
  { id: 1, title: 'Patient', description: 'Select or add patient', icon: User },
  { id: 2, title: 'Addresses', description: 'Pickup and dropoff locations', icon: MapPin },
  { id: 3, title: 'Schedule', description: 'Date, time, and vehicle', icon: Clock },
  { id: 4, title: 'Review', description: 'Confirm and book', icon: Check },
];

export default function NewTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [estimatedFare, setEstimatedFare] = React.useState({
    base: 25.0,
    distance: 31.25,
    time: 17.5,
    surcharges: 15.0,
    total: 88.75,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<TripBookingFormData>({
    resolver: zodResolver(tripBookingSchema),
    defaultValues: {
      patientType: 'existing',
      tripType: 'one-way',
      isAsap: false,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '',
      vehicleType: 'wheelchair',
      wheelchairRequired: true,
      stretcherRequired: false,
      oxygenRequired: false,
      bariatricRequired: false,
      companions: 0,
      isWillCallReturn: false,
      pickupState: 'TX',
      dropoffState: 'TX',
    },
  });

  const watchPatientType = watch('patientType');
  const watchTripType = watch('tripType');
  const watchVehicleType = watch('vehicleType');
  const watchIsAsap = watch('isAsap');

  // Validate current step fields before proceeding
  const validateStep = async () => {
    let fieldsToValidate: (keyof TripBookingFormData)[] = [];

    switch (currentStep) {
      case 1:
        if (watchPatientType === 'new') {
          fieldsToValidate = ['firstName', 'lastName', 'phone'];
        }
        break;
      case 2:
        fieldsToValidate = [
          'pickupAddress',
          'pickupCity',
          'pickupState',
          'pickupZip',
          'dropoffAddress',
          'dropoffCity',
          'dropoffState',
          'dropoffZip',
        ];
        break;
      case 3:
        fieldsToValidate = ['scheduledDate', 'scheduledTime', 'vehicleType'];
        break;
    }

    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: TripBookingFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Submit to API
      console.log('Trip booking data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Trip booked successfully!');
      router.push('/dispatcher/trips');
    } catch {
      toast.error('Failed to book trip. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Mock existing patients
  const existingPatients = [
    { id: '1', name: 'John Smith', phone: '(555) 123-4567' },
    { id: '2', name: 'Mary Jones', phone: '(555) 234-5678' },
    { id: '3', name: 'Robert Brown', phone: '(555) 345-6789' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Book New Trip</h1>
          <p className="text-sm text-gray-500">Create a new transportation booking</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="hidden sm:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;

              return (
                <li key={step.id} className="flex-1 relative">
                  <div className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'bg-primary-600 border-primary-600'
                          : isActive
                          ? 'border-primary-600 bg-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? 'text-primary-600' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>
                    <div className="ml-3 hidden lg:block">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? 'text-primary-600' : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-10 w-[calc(100%-2.5rem)] h-0.5 ${
                        isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Mobile step indicator */}
      <div className="sm:hidden">
        <p className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
        </p>
        <div className="mt-2 flex gap-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-1.5 flex-1 rounded-full ${
                currentStep >= step.id ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Patient */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>
                    Select an existing patient or add a new one
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient Type */}
                  <div className="flex gap-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        value="existing"
                        {...register('patientType')}
                        className="sr-only peer"
                      />
                      <div className="p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50">
                        <p className="font-medium text-gray-900">Existing Patient</p>
                        <p className="text-sm text-gray-500">Select from your patients</p>
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        value="new"
                        {...register('patientType')}
                        className="sr-only peer"
                      />
                      <div className="p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50">
                        <p className="font-medium text-gray-900">New Patient</p>
                        <p className="text-sm text-gray-500">Add patient details</p>
                      </div>
                    </label>
                  </div>

                  {watchPatientType === 'existing' ? (
                    <div className="space-y-4">
                      <Label>Select Patient</Label>
                      <Controller
                        name="existingPatientId"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Search patients..." />
                            </SelectTrigger>
                            <SelectContent>
                              {existingPatients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{patient.name}</span>
                                    <span className="text-gray-400">{patient.phone}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" required>First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            error={!!errors.firstName}
                            {...register('firstName')}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-error-600">{errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" required>Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Smith"
                            error={!!errors.lastName}
                            {...register('lastName')}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-error-600">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" required>Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            leftIcon={<Phone className="h-4 w-4" />}
                            error={!!errors.phone}
                            {...register('phone')}
                          />
                          {errors.phone && (
                            <p className="text-sm text-error-600">{errors.phone.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email (Optional)</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            leftIcon={<Mail className="h-4 w-4" />}
                            {...register('email')}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          leftIcon={<Calendar className="h-4 w-4" />}
                          {...register('dateOfBirth')}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Addresses */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Pickup Address */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-success-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Pickup Location</CardTitle>
                        <CardDescription>Where to pick up the patient</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupAddress" required>Street Address</Label>
                      <Input
                        id="pickupAddress"
                        placeholder="123 Main Street"
                        error={!!errors.pickupAddress}
                        {...register('pickupAddress')}
                      />
                      {errors.pickupAddress && (
                        <p className="text-sm text-error-600">{errors.pickupAddress.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupCity" required>City</Label>
                        <Input
                          id="pickupCity"
                          placeholder="Houston"
                          error={!!errors.pickupCity}
                          {...register('pickupCity')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupState" required>State</Label>
                        <Input
                          id="pickupState"
                          placeholder="TX"
                          error={!!errors.pickupState}
                          {...register('pickupState')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupZip" required>ZIP</Label>
                        <Input
                          id="pickupZip"
                          placeholder="77001"
                          error={!!errors.pickupZip}
                          {...register('pickupZip')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
                      <Textarea
                        id="pickupInstructions"
                        placeholder="e.g., Ring doorbell, use side entrance, wait for aide..."
                        {...register('pickupInstructions')}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Dropoff Address */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-error-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Dropoff Location</CardTitle>
                        <CardDescription>Where to drop off the patient</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dropoffAddress" required>Street Address</Label>
                      <Input
                        id="dropoffAddress"
                        placeholder="456 Hospital Drive"
                        error={!!errors.dropoffAddress}
                        {...register('dropoffAddress')}
                      />
                      {errors.dropoffAddress && (
                        <p className="text-sm text-error-600">{errors.dropoffAddress.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dropoffCity" required>City</Label>
                        <Input
                          id="dropoffCity"
                          placeholder="Houston"
                          error={!!errors.dropoffCity}
                          {...register('dropoffCity')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dropoffState" required>State</Label>
                        <Input
                          id="dropoffState"
                          placeholder="TX"
                          error={!!errors.dropoffState}
                          {...register('dropoffState')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dropoffZip" required>ZIP</Label>
                        <Input
                          id="dropoffZip"
                          placeholder="77002"
                          error={!!errors.dropoffZip}
                          {...register('dropoffZip')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dropoffInstructions">Dropoff Instructions</Label>
                      <Textarea
                        id="dropoffInstructions"
                        placeholder="e.g., Emergency entrance, notify front desk..."
                        {...register('dropoffInstructions')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Trip Type */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Type</CardTitle>
                    <CardDescription>Select the type of trip</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {[
                        { value: 'one-way', label: 'One Way' },
                        { value: 'round-trip', label: 'Round Trip' },
                        { value: 'multi-stop', label: 'Multi-Stop' },
                      ].map((type) => (
                        <label key={type.value} className="flex-1">
                          <input
                            type="radio"
                            value={type.value}
                            {...register('tripType')}
                            className="sr-only peer"
                          />
                          <div className="p-3 text-center rounded-lg border-2 border-gray-200 cursor-pointer transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50">
                            <p className="font-medium text-gray-900">{type.label}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>When should we pick up the patient?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* ASAP toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">ASAP Pickup</p>
                        <p className="text-sm text-gray-500">Request immediate pickup</p>
                      </div>
                      <Controller
                        name="isAsap"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {!watchIsAsap && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="scheduledDate" required>Pickup Date</Label>
                          <Input
                            id="scheduledDate"
                            type="date"
                            error={!!errors.scheduledDate}
                            {...register('scheduledDate')}
                          />
                          {errors.scheduledDate && (
                            <p className="text-sm text-error-600">{errors.scheduledDate.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scheduledTime" required>Pickup Time</Label>
                          <Input
                            id="scheduledTime"
                            type="time"
                            error={!!errors.scheduledTime}
                            {...register('scheduledTime')}
                          />
                          {errors.scheduledTime && (
                            <p className="text-sm text-error-600">{errors.scheduledTime.message}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="appointmentTime">Appointment Time (Optional)</Label>
                      <Input
                        id="appointmentTime"
                        type="time"
                        {...register('appointmentTime')}
                      />
                      <p className="text-xs text-gray-500">
                        We&apos;ll calculate optimal pickup time to arrive on time
                      </p>
                    </div>

                    {/* Return trip options */}
                    {watchTripType === 'round-trip' && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Return Trip</h4>

                          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-900">Will-Call Return</p>
                              <p className="text-sm text-gray-500">
                                Patient will call when ready
                              </p>
                            </div>
                            <Controller
                              name="isWillCallReturn"
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                          </div>

                          {!watch('isWillCallReturn') && (
                            <div className="space-y-2">
                              <Label htmlFor="returnTime" required>Return Pickup Time</Label>
                              <Input
                                id="returnTime"
                                type="time"
                                {...register('returnTime')}
                              />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Vehicle & Medical Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Requirements</CardTitle>
                    <CardDescription>Select vehicle type and medical needs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Vehicle Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'sedan', label: 'Sedan', icon: Car },
                          { value: 'wheelchair', label: 'Wheelchair Van', icon: Accessibility },
                          { value: 'stretcher', label: 'Stretcher Van', icon: Car },
                          { value: 'bariatric', label: 'Bariatric', icon: Car },
                        ].map((type) => {
                          const Icon = type.icon;
                          return (
                            <label key={type.value}>
                              <input
                                type="radio"
                                value={type.value}
                                {...register('vehicleType')}
                                className="sr-only peer"
                              />
                              <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 cursor-pointer transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50">
                                <Icon className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">{type.label}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Medical Requirements</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Controller
                            name="wheelchairRequired"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id="wheelchairRequired"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label htmlFor="wheelchairRequired" className="font-normal cursor-pointer">
                            Wheelchair Required
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Controller
                            name="oxygenRequired"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id="oxygenRequired"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label htmlFor="oxygenRequired" className="font-normal cursor-pointer">
                            Oxygen Required
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Controller
                            name="bariatricRequired"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id="bariatricRequired"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label htmlFor="bariatricRequired" className="font-normal cursor-pointer">
                            Bariatric Equipment Needed
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companions">Number of Companions</Label>
                      <Controller
                        name="companions"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(v) => field.onChange(parseInt(v))}
                            value={field.value?.toString()}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">None</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingNotes">Booking Notes</Label>
                      <Textarea
                        id="bookingNotes"
                        placeholder="Any additional notes for this booking..."
                        {...register('bookingNotes')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Special Requirements</Label>
                      <Textarea
                        id="specialRequirements"
                        placeholder="Any special medical or accessibility requirements..."
                        {...register('specialRequirements')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Trip Details</CardTitle>
                  <CardDescription>
                    Please review all details before confirming
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Patient
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4">
                      {watchPatientType === 'existing' ? (
                        <p className="text-gray-700">
                          {existingPatients.find((p) => p.id === watch('existingPatientId'))?.name || 'No patient selected'}
                        </p>
                      ) : (
                        <p className="text-gray-700">
                          {watch('firstName')} {watch('lastName')}
                          {watch('phone') && ` - ${watch('phone')}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Route
                    </h4>
                    <div className="rounded-lg border border-gray-200 p-4 space-y-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4 text-success-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Pickup</p>
                          <p className="text-sm text-gray-600">
                            {watch('pickupAddress')}, {watch('pickupCity')}, {watch('pickupState')} {watch('pickupZip')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4 text-error-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Dropoff</p>
                          <p className="text-sm text-gray-600">
                            {watch('dropoffAddress')}, {watch('dropoffCity')}, {watch('dropoffState')} {watch('dropoffZip')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Schedule
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trip Type</span>
                        <Badge variant="primary">{watchTripType.replace('-', ' ')}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">{watch('scheduledDate')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Time</span>
                        <span className="font-medium">
                          {watchIsAsap ? 'ASAP' : watch('scheduledTime')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vehicle & Requirements
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="primary">{watchVehicleType}</Badge>
                        {watch('wheelchairRequired') && <Badge variant="info">Wheelchair</Badge>}
                        {watch('oxygenRequired') && <Badge variant="warning">Oxygen</Badge>}
                        {watch('bariatricRequired') && <Badge variant="info">Bariatric</Badge>}
                        {watch('companions') > 0 && (
                          <Badge variant="secondary">{watch('companions')} companion(s)</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Alert variant="info">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      By confirming, a trip will be created and available for driver assignment.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Fare Estimate */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Fare Estimate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base fare</span>
                    <span className="text-gray-900">${estimatedFare.base.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance (12.5 mi)</span>
                    <span className="text-gray-900">${estimatedFare.distance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time (35 min)</span>
                    <span className="text-gray-900">${estimatedFare.time.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Wheelchair surcharge</span>
                    <span className="text-gray-900">${estimatedFare.surcharges.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Estimated Total</span>
                  <span className="text-primary-600">${estimatedFare.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Final fare may vary based on actual route and wait time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" loading={isSubmitting}>
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
