'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useGoogleMaps } from './provider';
import type { PlacePrediction, PlaceDetails, AutocompleteOptions } from './types';

interface UseAddressAutocompleteOptions extends AutocompleteOptions {
  debounceMs?: number;
  minChars?: number;
}

interface UseAddressAutocompleteReturn {
  predictions: PlacePrediction[];
  isLoading: boolean;
  error: string | null;
  search: (input: string) => void;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | null>;
  clear: () => void;
}

export function useAddressAutocomplete(
  options: UseAddressAutocompleteOptions = {}
): UseAddressAutocompleteReturn {
  const {
    debounceMs = 300,
    minChars = 3,
    types = ['address'],
    componentRestrictions = { country: 'us' },
    ...restOptions
  } = options;

  const { autocompleteService, placesService, isLoaded, error: mapsError } = useGoogleMaps();

  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Create session token for billing optimization
  useEffect(() => {
    if (isLoaded && typeof google !== 'undefined') {
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  const search = useCallback(
    (input: string) => {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Clear if input is too short
      if (!input || input.trim().length < minChars) {
        setPredictions([]);
        setIsLoading(false);
        return;
      }

      // Check if Google Maps is available
      if (!isLoaded || !autocompleteService) {
        setError(mapsError?.message || 'Google Maps not available');
        return;
      }

      setIsLoading(true);
      setError(null);

      debounceRef.current = setTimeout(() => {
        const request: google.maps.places.AutocompletionRequest = {
          input: input.trim(),
          types,
          componentRestrictions,
          sessionToken: sessionTokenRef.current || undefined,
          ...restOptions,
        };

        autocompleteService.getPlacePredictions(request, (results, status) => {
          setIsLoading(false);

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const formattedPredictions: PlacePrediction[] = results.map((result) => ({
              placeId: result.place_id,
              description: result.description,
              mainText: result.structured_formatting.main_text,
              secondaryText: result.structured_formatting.secondary_text,
              types: result.types,
            }));
            setPredictions(formattedPredictions);
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setPredictions([]);
          } else if (status !== google.maps.places.PlacesServiceStatus.OK) {
            setError(`Autocomplete error: ${status}`);
            setPredictions([]);
          }
        });
      }, debounceMs);
    },
    [autocompleteService, isLoaded, mapsError, minChars, debounceMs, types, componentRestrictions, restOptions]
  );

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceDetails | null> => {
      if (!isLoaded || !placesService) {
        setError('Google Maps not available');
        return null;
      }

      return new Promise((resolve) => {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId,
          fields: [
            'place_id',
            'formatted_address',
            'address_components',
            'geometry',
            'name',
            'formatted_phone_number',
            'website',
            'opening_hours',
            'types',
          ],
          sessionToken: sessionTokenRef.current || undefined,
        };

        placesService.getDetails(request, (result, status) => {
          // Reset session token after getting details (billing optimization)
          if (typeof google !== 'undefined') {
            sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
          }

          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            const addressComponents: PlaceDetails['addressComponents'] = {};

            result.address_components?.forEach((component) => {
              const types = component.types;
              if (types.includes('street_number')) {
                addressComponents.streetNumber = component.long_name;
              } else if (types.includes('route')) {
                addressComponents.streetName = component.long_name;
              } else if (types.includes('locality')) {
                addressComponents.city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                addressComponents.state = component.short_name;
              } else if (types.includes('postal_code')) {
                addressComponents.zipCode = component.long_name;
              } else if (types.includes('country')) {
                addressComponents.country = component.short_name;
              }
            });

            const details: PlaceDetails = {
              placeId: result.place_id || placeId,
              formattedAddress: result.formatted_address || '',
              addressComponents,
              location: {
                lat: result.geometry?.location?.lat() || 0,
                lng: result.geometry?.location?.lng() || 0,
              },
              name: result.name,
              phoneNumber: result.formatted_phone_number,
              website: result.website,
              openingHours: result.opening_hours?.weekday_text,
              types: result.types || [],
            };

            resolve(details);
          } else {
            setError(`Failed to get place details: ${status}`);
            resolve(null);
          }
        });
      });
    },
    [isLoaded, placesService]
  );

  const clear = useCallback(() => {
    setPredictions([]);
    setError(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    predictions,
    isLoading,
    error,
    search,
    getPlaceDetails,
    clear,
  };
}
