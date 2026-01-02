'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CalendarIcon,
  Clock,
  User,
  Phone,
  Wheelchair,
  Stethoscope,
  Wind,
  Scale,
  CarFront,
  Truck,
  Ambulance,
  DollarSign,
  Loader2,
  Plus,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AddressAutocomplete, type AddressValue } from './address-autocomplete';
import { cn } from '@/lib/utils';

// Form schema
const quickBookSchema = z.object({
  // Patient
  patientId: z.string().optional(),
  patientFirstName: z.string().min(1, 'First name is required'),
  patientLastName: z.string().min(1, 'Last name is required'),
  patientPhone: z.string().min(10, 'Valid phone number is required'),

  // Schedule
  tripDate: z.string().min(1, 'Date is required'),
  tripTime: z.string().min(1, 'Time is required'),

  // Vehicle type
  vehicleType: z.enum(['WHEELCHAIR_ACCESSIBLE', 'STRETCHER_VAN', 'BARIATRIC_VEHICLE', 'SEDAN']),

  // Medical needs
  wheelchairRequired: z.boolean(),
  stretcherRequired: z.boolean(),
  oxygenRequired: z.boolean(),
  bariatricRequired: z.boolean(),

  // Notes
  notes: z.string().optional(),
});

type QuickBookFormValues = z.infer<typeof quickBookSchema>;

interface QuickBookFormProps {
  onSubmit?: (data: QuickBookFormValues & { pickup: AddressValue; dropoff: AddressValue }) => Promise<void>;
  onBookAndAssign?: (data: QuickBookFormValues & { pickup: AddressValue; dropoff: AddressValue }) => Promise<void>;
}

const vehicleTypes = [
  { value: 'WHEELCHAIR_ACCESSIBLE', label: 'Wheelchair', icon: Wheelchair },
  { value: 'STRETCHER_VAN', label: 'Stretcher', icon: Ambulance },
  { value: 'BARIATRIC_VEHICLE', label: 'Bariatric', icon: Scale },
  { value: 'SEDAN', label: 'Sedan', icon: CarFront },
] as const;

export function QuickBookForm({ onSubmit, onBookAndAssign }: QuickBookFormProps) {
  const [pickupAddress, setPickupAddress] = useState<AddressValue | null>(null);
  const [dropoffAddress, setDropoffAddress] = useState<AddressValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceQuote, setPriceQuote] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBookedTrip, setLastBookedTrip] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuickBookFormValues>({
    resolver: zodResolver(quickBookSchema),
    defaultValues: {
      vehicleType: 'WHEELCHAIR_ACCESSIBLE',
      wheelchairRequired: false,
      stretcherRequired: false,
      oxygenRequired: false,
      bariatricRequired: false,
      tripDate: format(new Date(), 'yyyy-MM-dd'),
      tripTime: '',
    },
  });

  const watchedValues = watch();

  // Auto-select vehicle type based on medical needs
  useEffect(() => {
    if (watchedValues.stretcherRequired) {
      setValue('vehicleType', 'STRETCHER_VAN');
    } else if (watchedValues.bariatricRequired) {
      setValue('vehicleType', 'BARIATRIC_VEHICLE');
    } else if (watchedValues.wheelchairRequired) {
      setValue('vehicleType', 'WHEELCHAIR_ACCESSIBLE');
    }
  }, [watchedValues.wheelchairRequired, watchedValues.stretcherRequired, watchedValues.bariatricRequired, setValue]);

  // Calculate price when addresses change
  useEffect(() => {
    const calculatePrice = async () => {
      if (!pickupAddress || !dropoffAddress) {
        setPriceQuote(null);
        return;
      }

      setIsCalculatingPrice(true);
      try {
        const response = await fetch('/api/v1/maps/distance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: { lat: pickupAddress.latitude, lng: pickupAddress.longitude },
            destination: { lat: dropoffAddress.latitude, lng: dropoffAddress.longitude },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const distanceMiles = data.data.distanceMiles;
          const durationMinutes = data.data.durationMinutes;

          // Calculate price (simplified)
          const baseFare = 25;
          const perMile = 2.5;
          const perMinute = 0.5;
          let surcharges = 0;

          if (watchedValues.wheelchairRequired) surcharges += 15;
          if (watchedValues.stretcherRequired) surcharges += 25;
          if (watchedValues.oxygenRequired) surcharges += 10;
          if (watchedValues.bariatricRequired) surcharges += 20;

          const distanceFare = distanceMiles * perMile;
          const timeFare = durationMinutes * perMinute;
          const total = baseFare + distanceFare + timeFare + surcharges;

          setPriceQuote({
            total: Math.round(total * 100) / 100,
            breakdown: {
              'Base Fare': baseFare,
              [`Distance (${distanceMiles.toFixed(1)} mi)`]: Math.round(distanceFare * 100) / 100,
              [`Time (${durationMinutes} min)`]: Math.round(timeFare * 100) / 100,
              ...(surcharges > 0 ? { Surcharges: surcharges } : {}),
            },
          });
        }
      } catch (error) {
        console.error('Failed to calculate price:', error);
      } finally {
        setIsCalculatingPrice(false);
      }
    };

    const debounce = setTimeout(calculatePrice, 500);
    return () => clearTimeout(debounce);
  }, [pickupAddress, dropoffAddress, watchedValues.wheelchairRequired, watchedValues.stretcherRequired, watchedValues.oxygenRequired, watchedValues.bariatricRequired]);

  const handleFormSubmit = async (data: QuickBookFormValues, assignAfter = false) => {
    if (!pickupAddress || !dropoffAddress) {
      return;
    }

    setIsSubmitting(true);
    try {
      const fullData = { ...data, pickup: pickupAddress, dropoff: dropoffAddress };

      if (assignAfter && onBookAndAssign) {
        await onBookAndAssign(fullData);
      } else if (onSubmit) {
        await onSubmit(fullData);
      }

      // Generate mock trip number for demo
      const tripNumber = `TR-${format(new Date(), 'yyyyMMdd')}-${Math.floor(1000 + Math.random() * 9000)}`;
      setLastBookedTrip(tripNumber);
      setShowSuccess(true);

      // Reset form
      reset();
      setPickupAddress(null);
      setDropoffAddress(null);
      setPriceQuote(null);

      // Hide success after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit((data) => handleFormSubmit(data, false))();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit((data) => handleFormSubmit(data, false))} className="space-y-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-green-900">Ride Booked Successfully!</p>
            <p className="text-sm text-green-700">Trip #{lastBookedTrip}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-700"
            onClick={() => setShowSuccess(false)}
          >
            View Details
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Patient & Addresses */}
        <div className="space-y-6">
          {/* Patient Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="patientFirstName">First Name *</Label>
                  <Input
                    id="patientFirstName"
                    {...register('patientFirstName')}
                    placeholder="John"
                    className={errors.patientFirstName ? 'border-red-500' : ''}
                  />
                  {errors.patientFirstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.patientFirstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="patientLastName">Last Name *</Label>
                  <Input
                    id="patientLastName"
                    {...register('patientLastName')}
                    placeholder="Doe"
                    className={errors.patientLastName ? 'border-red-500' : ''}
                  />
                  {errors.patientLastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.patientLastName.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="patientPhone">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="patientPhone"
                    {...register('patientPhone')}
                    placeholder="(555) 123-4567"
                    className={cn('pl-10', errors.patientPhone && 'border-red-500')}
                  />
                </div>
                {errors.patientPhone && (
                  <p className="text-xs text-red-500 mt-1">{errors.patientPhone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pickup & Dropoff</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AddressAutocomplete
                label="Pickup Address *"
                value={pickupAddress}
                onChange={setPickupAddress}
                placeholder="Search pickup address..."
              />

              <AddressAutocomplete
                label="Dropoff Address *"
                value={dropoffAddress}
                onChange={setDropoffAddress}
                placeholder="Search dropoff address..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Schedule, Vehicle, Notes, Price */}
        <div className="space-y-6">
          {/* Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="tripDate">Date *</Label>
                  <Input
                    id="tripDate"
                    type="date"
                    {...register('tripDate')}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className={errors.tripDate ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="tripTime">Time *</Label>
                  <Input
                    id="tripTime"
                    type="time"
                    {...register('tripTime')}
                    className={errors.tripTime ? 'border-red-500' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Vehicle & Medical Needs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle type buttons */}
              <div className="grid grid-cols-4 gap-2">
                {vehicleTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = watchedValues.vehicleType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setValue('vehicleType', type.value as any)}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors',
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Icon className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              <Separator />

              {/* Medical needs checkboxes */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={watchedValues.wheelchairRequired}
                    onCheckedChange={(checked) => setValue('wheelchairRequired', !!checked)}
                  />
                  <Wheelchair className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Wheelchair</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={watchedValues.stretcherRequired}
                    onCheckedChange={(checked) => setValue('stretcherRequired', !!checked)}
                  />
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Stretcher</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={watchedValues.oxygenRequired}
                    onCheckedChange={(checked) => setValue('oxygenRequired', !!checked)}
                  />
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Oxygen</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={watchedValues.bariatricRequired}
                    onCheckedChange={(checked) => setValue('bariatricRequired', !!checked)}
                  />
                  <Scale className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Bariatric</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Special instructions, accessibility needs, etc."
              rows={3}
            />
          </div>

          {/* Price Quote */}
          <Card className="bg-gray-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Price Quote
                </span>
                {isCalculatingPrice && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>

              {priceQuote ? (
                <div className="space-y-2">
                  {Object.entries(priceQuote.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key}</span>
                      <span>${value.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${priceQuote.total.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Enter pickup and dropoff addresses to see price
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl + Enter</kbd> to book
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit((data) => handleFormSubmit(data, true))}
            disabled={isSubmitting || !pickupAddress || !dropoffAddress}
          >
            <Plus className="h-4 w-4 mr-2" />
            Book & Assign
          </Button>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !pickupAddress || !dropoffAddress}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              'Book Now'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default QuickBookForm;
