'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Zap, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AddressValue } from '@/components/domain/address-autocomplete';

// Lazy load the heavy QuickBookForm component
const QuickBookForm = dynamic(
  () => import('@/components/domain/quick-book-form').then((mod) => mod.QuickBookForm),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Loading booking form...</span>
          </div>
        </CardContent>
      </Card>
    ),
  }
);

interface BookingData {
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string;
  tripDate: string;
  tripTime: string;
  vehicleType: string;
  wheelchairRequired: boolean;
  stretcherRequired: boolean;
  oxygenRequired: boolean;
  bariatricRequired: boolean;
  notes?: string;
  pickup: AddressValue;
  dropoff: AddressValue;
}

export default function QuickBookPage() {
  const handleSubmit = async (data: BookingData) => {
    console.log('Booking submitted:', data);

    // TODO: Call API to create trip
    // const response = await fetch('/api/v1/trips', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleBookAndAssign = async (data: BookingData) => {
    console.log('Booking and assigning:', data);

    // TODO: Call API to create trip and open assignment modal
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quick Book</h1>
            <p className="text-gray-500">
              Fast booking optimized for phone calls
            </p>
          </div>
        </div>
      </div>

      <QuickBookForm
        onSubmit={handleSubmit}
        onBookAndAssign={handleBookAndAssign}
      />

      {/* Keyboard Shortcuts Help */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Ctrl + Enter</kbd>
            <span className="text-gray-600">Submit</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Tab</kbd>
            <span className="text-gray-600">Next field</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">↓ / ↑</kbd>
            <span className="text-gray-600">Navigate list</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Enter</kbd>
            <span className="text-gray-600">Select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
