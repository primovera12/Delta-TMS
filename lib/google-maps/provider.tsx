'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { GoogleMapsStatus } from './types';

interface GoogleMapsContextValue {
  status: GoogleMapsStatus;
  isLoaded: boolean;
  error: Error | null;
  autocompleteService: google.maps.places.AutocompleteService | null;
  placesService: google.maps.places.PlacesService | null;
  geocoder: google.maps.Geocoder | null;
  distanceMatrixService: google.maps.DistanceMatrixService | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue | null>(null);

interface GoogleMapsProviderProps {
  children: React.ReactNode;
  apiKey?: string;
}

export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [status, setStatus] = useState<GoogleMapsStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [services, setServices] = useState<{
    autocompleteService: google.maps.places.AutocompleteService | null;
    placesService: google.maps.places.PlacesService | null;
    geocoder: google.maps.Geocoder | null;
    distanceMatrixService: google.maps.DistanceMatrixService | null;
  }>({
    autocompleteService: null,
    placesService: null,
    geocoder: null,
    distanceMatrixService: null,
  });

  useEffect(() => {
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!key) {
      console.warn('Google Maps API key not provided. Address autocomplete will be disabled.');
      setStatus('error');
      setError(new Error('Google Maps API key not configured'));
      return;
    }

    const loader = new Loader({
      apiKey: key,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader
      .load()
      .then(() => {
        // Create a dummy element for PlacesService (required by Google Maps API)
        const dummyElement = document.createElement('div');

        setServices({
          autocompleteService: new google.maps.places.AutocompleteService(),
          placesService: new google.maps.places.PlacesService(dummyElement),
          geocoder: new google.maps.Geocoder(),
          distanceMatrixService: new google.maps.DistanceMatrixService(),
        });
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Failed to load Google Maps:', err);
        setError(err);
        setStatus('error');
      });
  }, [apiKey]);

  const value: GoogleMapsContextValue = {
    status,
    isLoaded: status === 'ready',
    error,
    ...services,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps(): GoogleMapsContextValue {
  const context = useContext(GoogleMapsContext);

  if (!context) {
    // Return a fallback context for when provider is not available
    return {
      status: 'error' as const,
      isLoaded: false,
      error: new Error('GoogleMapsProvider not found in component tree'),
      autocompleteService: null,
      placesService: null,
      geocoder: null,
      distanceMatrixService: null,
    };
  }

  return context;
}
