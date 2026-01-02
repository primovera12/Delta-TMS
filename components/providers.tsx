'use client';

import React from 'react';
import { GoogleMapsProvider } from '@/lib/google-maps/provider';
import { Toaster } from '@/components/ui/toast';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GoogleMapsProvider>
      {children}
      <Toaster />
    </GoogleMapsProvider>
  );
}
