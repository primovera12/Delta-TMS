'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  MapPin,
  Clock,
  User,
  Car,
  Calendar,
  Save,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Stop {
  id: string;
  type: 'pickup' | 'dropoff' | 'stop';
  address: string;
  time: string;
  waitTime: number;
  notes: string;
  patientId?: string;
  patientName?: string;
}

const patients = [
  { id: 'PAT-001', name: 'John Smith', address: '123 Main St, Houston, TX' },
  { id: 'PAT-002', name: 'Mary Jones', address: '456 Oak Ave, Houston, TX' },
  { id: 'PAT-003', name: 'Robert Brown', address: '789 Pine Rd, Houston, TX' },
  { id: 'PAT-004', name: 'Emily Davis', address: '321 Elm St, Houston, TX' },
];

const drivers = [
  { id: 'DRV-001', name: 'John Smith', vehicleType: 'Wheelchair' },
  { id: 'DRV-002', name: 'Mike Johnson', vehicleType: 'Stretcher' },
  { id: 'DRV-003', name: 'Sarah Williams', vehicleType: 'Wheelchair' },
];

const facilities = [
  { id: 'FAC-001', name: 'Memorial Hospital', address: '1234 Medical Center Dr' },
  { id: 'FAC-002', name: 'City Dialysis Center', address: '789 Health Blvd' },
  { id: 'FAC-003', name: 'Heart Care Clinic', address: '890 Cardio Dr' },
];

export default function MultiStopTripPage() {
  const router = useRouter();

  const [tripDate, setTripDate] = React.useState('');
  const [selectedDriver, setSelectedDriver] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [stops, setStops] = React.useState<Stop[]>([
    {
      id: '1',
      type: 'pickup',
      address: '',
      time: '',
      waitTime: 0,
      notes: '',
    },
    {
      id: '2',
      type: 'dropoff',
      address: '',
      time: '',
      waitTime: 0,
      notes: '',
    },
  ]);

  const addStop = (afterIndex: number) => {
    const newStop: Stop = {
      id: Date.now().toString(),
      type: 'stop',
      address: '',
      time: '',
      waitTime: 15,
      notes: '',
    };

    const newStops = [...stops];
    newStops.splice(afterIndex + 1, 0, newStop);
    setStops(newStops);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const moveStop = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === stops.length - 1)
    ) {
      return;
    }

    const newStops = [...stops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newStops[index], newStops[targetIndex]] = [newStops[targetIndex], newStops[index]];
    setStops(newStops);
  };

  const updateStop = (index: number, field: keyof Stop, value: string | number) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  const handleSubmit = () => {
    // Validate and submit
    console.log({
      tripDate,
      driver: selectedDriver,
      vehicleType,
      notes,
      stops,
    });
    router.push('/dispatcher/trips');
  };

  const calculateTotalTime = () => {
    const waitTime = stops.reduce((sum, stop) => sum + (stop.waitTime || 0), 0);
    return waitTime;
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
          <h1 className="text-2xl font-semibold text-gray-900">Create Multi-Stop Trip</h1>
          <p className="text-sm text-gray-500">
            Schedule a trip with multiple pickups and dropoffs
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Trip Date</Label>
                  <Input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambulatory">Ambulatory</SelectItem>
                      <SelectItem value="wheelchair">Wheelchair</SelectItem>
                      <SelectItem value="stretcher">Stretcher</SelectItem>
                      <SelectItem value="bariatric">Bariatric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Driver (Optional)</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign later or select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Assign Later</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} ({driver.vehicleType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stops */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Route Stops</CardTitle>
              <Badge variant="info">{stops.length} stops</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle & Order */}
                    <div className="flex flex-col items-center gap-1 pt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStop(index, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStop(index, 'down')}
                          disabled={index === stops.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          stop.type === 'pickup'
                            ? 'bg-success-100 text-success-700'
                            : stop.type === 'dropoff'
                            ? 'bg-error-100 text-error-700'
                            : 'bg-info-100 text-info-700'
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Stop Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Select
                            value={stop.type}
                            onValueChange={(value) =>
                              updateStop(index, 'type', value as Stop['type'])
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pickup">Pickup</SelectItem>
                              <SelectItem value="stop">Stop</SelectItem>
                              <SelectItem value="dropoff">Dropoff</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge
                            variant={
                              stop.type === 'pickup'
                                ? 'success'
                                : stop.type === 'dropoff'
                                ? 'error'
                                : 'info'
                            }
                            size="sm"
                          >
                            {stop.type}
                          </Badge>
                        </div>
                        {stops.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStop(index)}
                            className="text-error-600 hover:text-error-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Patient (Optional)</Label>
                          <Select
                            value={stop.patientId || ''}
                            onValueChange={(value) => {
                              const patient = patients.find((p) => p.id === value);
                              updateStop(index, 'patientId', value);
                              updateStop(index, 'patientName', patient?.name || '');
                              if (patient) {
                                updateStop(index, 'address', patient.address);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No patient</SelectItem>
                              {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  {patient.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Facility (Optional)</Label>
                          <Select
                            onValueChange={(value) => {
                              const facility = facilities.find((f) => f.id === value);
                              if (facility) {
                                updateStop(index, 'address', facility.address);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select facility" />
                            </SelectTrigger>
                            <SelectContent>
                              {facilities.map((facility) => (
                                <SelectItem key={facility.id} value={facility.id}>
                                  {facility.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            value={stop.address}
                            onChange={(e) => updateStop(index, 'address', e.target.value)}
                            placeholder="Enter address"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Scheduled Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="time"
                              value={stop.time}
                              onChange={(e) => updateStop(index, 'time', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Wait Time (minutes)</Label>
                          <Input
                            type="number"
                            value={stop.waitTime}
                            onChange={(e) =>
                              updateStop(index, 'waitTime', parseInt(e.target.value) || 0)
                            }
                            min={0}
                            max={120}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Notes</Label>
                        <Input
                          value={stop.notes}
                          onChange={(e) => updateStop(index, 'notes', e.target.value)}
                          placeholder="Special instructions for this stop"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add Stop Button */}
                  {index < stops.length - 1 && (
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addStop(index)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Stop
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trip Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes for this multi-stop trip..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Stops</span>
                <span className="font-semibold text-gray-900">{stops.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Pickups</span>
                <span className="font-semibold text-gray-900">
                  {stops.filter((s) => s.type === 'pickup').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Dropoffs</span>
                <span className="font-semibold text-gray-900">
                  {stops.filter((s) => s.type === 'dropoff').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Intermediate Stops</span>
                <span className="font-semibold text-gray-900">
                  {stops.filter((s) => s.type === 'stop').length}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Wait Time</span>
                  <span className="font-semibold text-gray-900">
                    {calculateTotalTime()} min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Route Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          stop.type === 'pickup'
                            ? 'bg-success-500 text-white'
                            : stop.type === 'dropoff'
                            ? 'bg-error-500 text-white'
                            : 'bg-info-500 text-white'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < stops.length - 1 && (
                        <div className="w-px h-6 bg-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {stop.address || 'No address set'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stop.time || 'No time set'} • {stop.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Validation */}
          {(!tripDate || stops.some((s) => !s.address)) && (
            <Card className="border-warning-200 bg-warning-50">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-warning-900">Missing Information</p>
                    <ul className="mt-1 text-warning-700 list-disc list-inside">
                      {!tripDate && <li>Trip date is required</li>}
                      {stops.some((s) => !s.address) && (
                        <li>All stops need addresses</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!tripDate || stops.some((s) => !s.address)}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Multi-Stop Trip
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
