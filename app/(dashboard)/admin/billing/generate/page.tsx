'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
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

// Mock data
const facilities = [
  { id: 'FAC-001', name: 'Memorial Hospital', unbilledTrips: 45, unbilledAmount: 4250.00 },
  { id: 'FAC-002', name: 'City Dialysis Center', unbilledTrips: 120, unbilledAmount: 8750.00 },
  { id: 'FAC-003', name: 'Regional Medical Center', unbilledTrips: 38, unbilledAmount: 3200.00 },
  { id: 'FAC-004', name: 'Heart Care Clinic', unbilledTrips: 25, unbilledAmount: 2100.00 },
  { id: 'FAC-005', name: 'Cancer Treatment Center', unbilledTrips: 32, unbilledAmount: 3250.00 },
];

const unbilledTrips = [
  { id: 'TR-20260115-001', date: '2026-01-15', patient: 'John Smith', type: 'Wheelchair', fare: 85.00 },
  { id: 'TR-20260115-002', date: '2026-01-15', patient: 'Mary Jones', type: 'Ambulatory', fare: 65.00 },
  { id: 'TR-20260114-045', date: '2026-01-14', patient: 'Susan Miller', type: 'Stretcher', fare: 125.00 },
  { id: 'TR-20260114-032', date: '2026-01-14', patient: 'Robert Brown', type: 'Wheelchair', fare: 80.00 },
  { id: 'TR-20260113-028', date: '2026-01-13', patient: 'Mary Wilson', type: 'Wheelchair', fare: 80.00 },
  { id: 'TR-20260113-015', date: '2026-01-13', patient: 'James Taylor', type: 'Ambulatory', fare: 55.00 },
  { id: 'TR-20260112-042', date: '2026-01-12', patient: 'Emily Davis', type: 'Wheelchair', fare: 90.00 },
  { id: 'TR-20260112-038', date: '2026-01-12', patient: 'William Taylor', type: 'Stretcher', fare: 130.00 },
];

export default function GenerateInvoicePage() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = React.useState<string>('');
  const [billingPeriodStart, setBillingPeriodStart] = React.useState('');
  const [billingPeriodEnd, setBillingPeriodEnd] = React.useState('');
  const [selectedTrips, setSelectedTrips] = React.useState<string[]>([]);
  const [step, setStep] = React.useState(1);

  const facility = facilities.find((f) => f.id === selectedFacility);

  const handleSelectAllTrips = () => {
    if (selectedTrips.length === unbilledTrips.length) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(unbilledTrips.map((t) => t.id));
    }
  };

  const handleToggleTrip = (tripId: string) => {
    setSelectedTrips((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId]
    );
  };

  const selectedTripsData = unbilledTrips.filter((t) => selectedTrips.includes(t.id));
  const totalAmount = selectedTripsData.reduce((sum, t) => sum + t.fare, 0);

  const handleGenerateInvoice = () => {
    // Generate invoice logic
    console.log('Generating invoice', {
      facility: selectedFacility,
      periodStart: billingPeriodStart,
      periodEnd: billingPeriodEnd,
      trips: selectedTrips,
      total: totalAmount,
    });
    router.push('/admin/billing');
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
          <h1 className="text-2xl font-semibold text-gray-900">Generate Invoice</h1>
          <p className="text-sm text-gray-500">Create a new invoice for a facility</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Select Facility' },
              { num: 2, label: 'Choose Period' },
              { num: 3, label: 'Select Trips' },
              { num: 4, label: 'Review & Generate' },
            ].map((s, index) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s.num
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      s.num
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step >= s.num ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-px mx-4 ${
                      step > s.num ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Facility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search facilities..." className="pl-10" />
            </div>
            <div className="space-y-3">
              {facilities.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFacility(f.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedFacility === f.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{f.name}</h3>
                        <p className="text-sm text-gray-500">{f.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {f.unbilledTrips} trips
                      </p>
                      <p className="text-sm text-gray-500">
                        ${f.unbilledAmount.toLocaleString()} unbilled
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!selectedFacility}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Billing Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Building2 className="h-6 w-6 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{facility?.name}</p>
                <p className="text-sm text-gray-500">
                  {facility?.unbilledTrips} unbilled trips
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Period Start</Label>
                <Input
                  type="date"
                  value={billingPeriodStart}
                  onChange={(e) => setBillingPeriodStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Period End</Label>
                <Input
                  type="date"
                  value={billingPeriodEnd}
                  onChange={(e) => setBillingPeriodEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Select</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'This Week', start: '2026-01-13', end: '2026-01-19' },
                  { label: 'Last Week', start: '2026-01-06', end: '2026-01-12' },
                  { label: 'First Half of Month', start: '2026-01-01', end: '2026-01-15' },
                  { label: 'Last Month', start: '2025-12-01', end: '2025-12-31' },
                ].map((period) => (
                  <Button
                    key={period.label}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setBillingPeriodStart(period.start);
                      setBillingPeriodEnd(period.end);
                    }}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!billingPeriodStart || !billingPeriodEnd}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Select Trips</CardTitle>
            <Button variant="secondary" size="sm" onClick={handleSelectAllTrips}>
              {selectedTrips.length === unbilledTrips.length ? 'Deselect All' : 'Select All'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{facility?.name}</p>
                <p className="text-sm text-gray-500">
                  {billingPeriodStart} to {billingPeriodEnd}
                </p>
              </div>
              <Badge variant="info">
                {selectedTrips.length} of {unbilledTrips.length} selected
              </Badge>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedTrips.length === unbilledTrips.length}
                        onChange={handleSelectAllTrips}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trip ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Fare
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {unbilledTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedTrips.includes(trip.id) ? 'bg-primary-50' : ''
                      }`}
                      onClick={() => handleToggleTrip(trip.id)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTrips.includes(trip.id)}
                          onChange={() => handleToggleTrip(trip.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">
                        {trip.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{trip.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{trip.patient}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" size="sm">
                          {trip.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ${trip.fare.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">
                {selectedTrips.length} trips selected
              </span>
              <span className="text-lg font-bold text-gray-900">
                Total: ${totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} disabled={selectedTrips.length === 0}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Invoice Preview */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-primary-600">Delta TMS</h2>
                      <p className="text-sm text-gray-500">
                        Non-Emergency Medical Transportation
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-bold text-gray-900">INVOICE</h3>
                      <p className="text-sm text-gray-500 mt-1">Draft</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 border-t border-gray-200 pt-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Bill To</h4>
                      <p className="font-semibold text-gray-900">{facility?.name}</p>
                    </div>
                    <div className="sm:text-right">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Period</h4>
                      <p className="text-gray-900">
                        {billingPeriodStart} - {billingPeriodEnd}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Trip Summary
                    </h4>
                    <div className="space-y-2">
                      {selectedTripsData.slice(0, 5).map((trip) => (
                        <div
                          key={trip.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {trip.id} - {trip.patient}
                          </span>
                          <span className="text-gray-900">${trip.fare.toFixed(2)}</span>
                        </div>
                      ))}
                      {selectedTripsData.length > 5 && (
                        <p className="text-sm text-gray-500">
                          ... and {selectedTripsData.length - 5} more trips
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" defaultValue="2026-01-30" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select defaultValue="net15">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                      <SelectItem value="due-receipt">Due on Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Input placeholder="Add notes to invoice..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Facility</span>
                  <span className="font-medium text-gray-900">{facility?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Period</span>
                  <span className="font-medium text-gray-900">
                    {billingPeriodStart} - {billingPeriodEnd}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Trips</span>
                  <span className="font-medium text-gray-900">{selectedTrips.length}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button onClick={handleGenerateInvoice} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
              <Button variant="secondary" onClick={() => setStep(3)} className="w-full">
                Back
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
