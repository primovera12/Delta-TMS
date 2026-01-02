'use client';

import * as React from 'react';
import { AlertTriangle, X, Clock, DollarSign, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Trip {
  id: string;
  patientName: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  status: string;
  vehicleType: string;
  driverName?: string;
}

const cancellationReasons = [
  { value: 'patient_request', label: 'Patient Request' },
  { value: 'patient_no_show', label: 'Patient No Show' },
  { value: 'patient_hospitalized', label: 'Patient Hospitalized' },
  { value: 'appointment_cancelled', label: 'Appointment Cancelled' },
  { value: 'facility_closed', label: 'Facility Closed' },
  { value: 'driver_unavailable', label: 'Driver Unavailable' },
  { value: 'vehicle_issue', label: 'Vehicle Issue' },
  { value: 'weather', label: 'Weather Conditions' },
  { value: 'duplicate', label: 'Duplicate Trip' },
  { value: 'other', label: 'Other' },
];

const cancellationPolicies = {
  free: { label: 'Free cancellation', description: 'More than 2 hours before pickup' },
  late: { label: 'Late cancellation', description: 'Less than 2 hours before pickup', fee: 25 },
  noShow: { label: 'No-show', description: 'After pickup time', fee: 50 },
};

interface TripCancellationModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, notes: string, notifyPatient: boolean) => void;
}

export function TripCancellationModal({
  trip,
  isOpen,
  onClose,
  onConfirm,
}: TripCancellationModalProps) {
  const [reason, setReason] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [notifyPatient, setNotifyPatient] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Determine cancellation policy based on timing
  const getCancellationPolicy = () => {
    const tripDateTime = new Date(`${trip.date} ${trip.time}`);
    const now = new Date();
    const hoursUntilTrip = (tripDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilTrip < 0) return 'noShow';
    if (hoursUntilTrip < 2) return 'late';
    return 'free';
  };

  const policy = cancellationPolicies[getCancellationPolicy()];
  const cancellationFee = policy.fee || 0;

  const handleSubmit = async () => {
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await onConfirm(reason, notes, notifyPatient);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-error-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-error-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cancel Trip</h3>
              <p className="text-sm text-gray-500">{trip.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Trip Summary */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>{trip.patientName}</span>
              </div>
              <Badge variant="secondary">{trip.vehicleType}</Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{trip.date} at {trip.time}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Route:</span> {trip.pickup} → {trip.dropoff}
            </div>
          </div>
        </div>

        {/* Cancellation Policy Alert */}
        <div className={`p-4 border-b border-gray-200 ${
          cancellationFee > 0 ? 'bg-warning-50' : 'bg-success-50'
        }`}>
          <div className="flex items-start gap-3">
            {cancellationFee > 0 ? (
              <DollarSign className="h-5 w-5 text-warning-600 flex-shrink-0" />
            ) : (
              <Clock className="h-5 w-5 text-success-600 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${
                cancellationFee > 0 ? 'text-warning-900' : 'text-success-900'
              }`}>
                {policy.label}
              </p>
              <p className={`text-sm ${
                cancellationFee > 0 ? 'text-warning-700' : 'text-success-700'
              }`}>
                {policy.description}
                {cancellationFee > 0 && (
                  <span className="font-medium"> - ${cancellationFee} fee may apply</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Reason */}
          <div className="space-y-2">
            <Label>Cancellation Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {cancellationReasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          {/* Notify Patient */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Notify Patient</p>
              <p className="text-sm text-gray-500">Send SMS/email notification</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyPatient}
                onChange={(e) => setNotifyPatient(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Keep Trip
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-error-600 hover:bg-error-700"
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? 'Cancelling...' : 'Cancel Trip'}
          </Button>
        </div>
      </div>
    </div>
  );
}
