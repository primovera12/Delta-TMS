'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Send,
  Printer,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  User,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock invoice data
const getInvoiceData = (id: string) => ({
  id,
  facility: {
    name: 'Memorial Hospital',
    address: '1234 Medical Center Dr',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    contact: 'Jane Wilson',
    email: 'billing@memorial.com',
    phone: '(555) 123-4567',
  },
  period: 'January 1-15, 2026',
  issueDate: '2026-01-15',
  dueDate: '2026-01-30',
  status: 'pending',
  subtotal: 4050.00,
  tax: 0,
  discount: 0,
  total: 4050.00,
  trips: [
    {
      id: 'TR-20260115-001',
      date: '2026-01-15',
      time: '10:30 AM',
      patient: 'John Smith',
      pickup: '123 Main St',
      dropoff: 'Memorial Hospital',
      vehicleType: 'Wheelchair',
      distance: '12.5 mi',
      fare: 85.00,
    },
    {
      id: 'TR-20260114-045',
      date: '2026-01-14',
      time: '3:30 PM',
      patient: 'Susan Miller',
      pickup: '456 Oak Ave',
      dropoff: 'Memorial Hospital',
      vehicleType: 'Ambulatory',
      distance: '8.2 mi',
      fare: 65.00,
    },
    {
      id: 'TR-20260114-032',
      date: '2026-01-14',
      time: '11:00 AM',
      patient: 'Robert Brown',
      pickup: '789 Pine Rd',
      dropoff: 'Memorial Hospital',
      vehicleType: 'Stretcher',
      distance: '15.8 mi',
      fare: 125.00,
    },
    {
      id: 'TR-20260113-028',
      date: '2026-01-13',
      time: '2:00 PM',
      patient: 'Mary Wilson',
      pickup: '321 Elm St',
      dropoff: 'Memorial Hospital',
      vehicleType: 'Wheelchair',
      distance: '10.3 mi',
      fare: 80.00,
    },
    {
      id: 'TR-20260113-015',
      date: '2026-01-13',
      time: '9:00 AM',
      patient: 'James Taylor',
      pickup: '555 Cedar Lane',
      dropoff: 'Memorial Hospital',
      vehicleType: 'Ambulatory',
      distance: '6.5 mi',
      fare: 55.00,
    },
  ],
  notes: 'Net 15 payment terms. Please reference invoice number on payment.',
});

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'secondary'; icon: typeof CheckCircle }> = {
  paid: { label: 'Paid', variant: 'success', icon: CheckCircle },
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  overdue: { label: 'Overdue', variant: 'error', icon: AlertCircle },
  draft: { label: 'Draft', variant: 'secondary', icon: FileText },
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoice = getInvoiceData(params.id as string);
  const status = statusConfig[invoice.status];
  const StatusIcon = status.icon;

  const handleMarkPaid = () => {
    // Mark invoice as paid
    console.log('Marking invoice as paid');
  };

  const handleSendReminder = () => {
    // Send payment reminder
    console.log('Sending payment reminder');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{invoice.id}</h1>
              <Badge variant={status.variant}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">Invoice for {invoice.period}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {invoice.status === 'pending' && (
            <>
              <Button variant="secondary" onClick={handleSendReminder}>
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button onClick={handleMarkPaid}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary-600">Delta TMS</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Non-Emergency Medical Transportation
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>5678 Transport Way</p>
                    <p>Houston, TX 77002</p>
                    <p>billing@delta-tms.com</p>
                    <p>(555) 987-6543</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-gray-900">INVOICE</h3>
                  <p className="text-lg font-mono text-gray-600 mt-2">{invoice.id}</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 border-t border-gray-200 pt-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Bill To</h4>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{invoice.facility.name}</p>
                    <p className="text-gray-600">{invoice.facility.address}</p>
                    <p className="text-gray-600">
                      {invoice.facility.city}, {invoice.facility.state} {invoice.facility.zip}
                    </p>
                    <p className="text-gray-600 mt-2">Attn: {invoice.facility.contact}</p>
                    <p className="text-gray-600">{invoice.facility.email}</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between sm:justify-end gap-4">
                      <span className="text-gray-500">Issue Date:</span>
                      <span className="font-medium text-gray-900">{invoice.issueDate}</span>
                    </div>
                    <div className="flex justify-between sm:justify-end gap-4">
                      <span className="text-gray-500">Due Date:</span>
                      <span className="font-medium text-gray-900">{invoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between sm:justify-end gap-4">
                      <span className="text-gray-500">Period:</span>
                      <span className="font-medium text-gray-900">{invoice.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Trip ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date/Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Fare
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.trips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/trips/${trip.id}`}
                            className="font-mono text-sm text-primary-600 hover:text-primary-700"
                          >
                            {trip.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{trip.date}</p>
                            <p className="text-gray-500">{trip.time}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{trip.patient}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="truncate max-w-[150px]">
                              {trip.pickup} → {trip.dropoff}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 ml-5">{trip.distance}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" size="sm">
                            <Car className="h-3 w-3 mr-1" />
                            {trip.vehicleType}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium text-gray-900">
                            ${trip.fare.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-end">
                <div className="w-72 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({invoice.trips.length} trips)</span>
                    <span className="text-gray-900">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-success-600">-${invoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-900">${invoice.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total Due</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${invoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              {invoice.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Trips</span>
                <span className="font-semibold text-gray-900">{invoice.trips.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Avg per Trip</span>
                <span className="font-semibold text-gray-900">
                  ${(invoice.total / invoice.trips.length).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Issue Date</span>
                <span className="font-semibold text-gray-900">{invoice.issueDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Due Date</span>
                <span className="font-semibold text-gray-900">{invoice.dueDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Facility Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Facility Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{invoice.facility.name}</p>
                  <p className="text-sm text-gray-500">{invoice.facility.contact}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
                <p className="text-gray-600">{invoice.facility.email}</p>
                <p className="text-gray-600">{invoice.facility.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Invoice created</p>
                    <p className="text-xs text-gray-500">{invoice.issueDate} at 9:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                    <Send className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Invoice sent to facility</p>
                    <p className="text-xs text-gray-500">{invoice.issueDate} at 9:05 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
