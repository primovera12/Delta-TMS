'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapPin, Search, Loader2, X, Building, Home, Hospital, Pill, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAddressAutocomplete } from '@/lib/google-maps/hooks';
import type { PlacePrediction, PlaceDetails } from '@/lib/google-maps/types';

export interface AddressValue {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  placeName?: string;
  placeType?: string;
}

interface AddressAutocompleteProps {
  value?: AddressValue | null;
  onChange: (address: AddressValue | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  restrictToState?: string;
  showSelectedAddress?: boolean;
  className?: string;
  id?: string;
}

const facilityIcons: Record<string, React.ReactNode> = {
  hospital: <Hospital className="h-4 w-4 text-red-500" />,
  pharmacy: <Pill className="h-4 w-4 text-green-500" />,
  doctor: <Building2 className="h-4 w-4 text-blue-500" />,
  clinic: <Building2 className="h-4 w-4 text-blue-500" />,
  nursing_home: <Building className="h-4 w-4 text-purple-500" />,
  home: <Home className="h-4 w-4 text-amber-500" />,
};

function getFacilityType(types: string[]): string | null {
  if (types.includes('hospital')) return 'hospital';
  if (types.includes('pharmacy')) return 'pharmacy';
  if (types.includes('doctor') || types.includes('health')) return 'doctor';
  if (types.includes('nursing_home') || types.includes('senior_housing')) return 'nursing_home';
  return null;
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Search for an address...',
  label,
  error,
  disabled = false,
  showSelectedAddress = true,
  className,
  id,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    predictions,
    isLoading,
    error: autocompleteError,
    search,
    getPlaceDetails,
    clear,
  } = useAddressAutocomplete({
    types: ['address', 'establishment'],
    componentRestrictions: { country: 'us' },
  });

  // Sync input value with external value
  useEffect(() => {
    if (value && showSelectedAddress) {
      setInputValue(value.addressLine1 || '');
    }
  }, [value, showSelectedAddress]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setActiveIndex(-1);

    if (newValue.length >= 3) {
      search(newValue);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      clear();
    }

    // If user is typing, clear the selected value
    if (value) {
      onChange(null);
    }
  };

  // Handle selecting a prediction
  const handleSelectPrediction = useCallback(
    async (prediction: PlacePrediction) => {
      setIsOpen(false);
      setInputValue(prediction.mainText);
      clear();

      const details = await getPlaceDetails(prediction.placeId);

      if (details) {
        const addressValue: AddressValue = {
          addressLine1: `${details.addressComponents.streetNumber || ''} ${details.addressComponents.streetName || ''}`.trim(),
          city: details.addressComponents.city || '',
          state: details.addressComponents.state || '',
          zipCode: details.addressComponents.zipCode || '',
          latitude: details.location.lat,
          longitude: details.location.lng,
          placeId: details.placeId,
          placeName: details.name,
          placeType: getFacilityType(details.types) || undefined,
        };

        // If no street address, use the full formatted address
        if (!addressValue.addressLine1) {
          addressValue.addressLine1 = prediction.mainText;
        }

        onChange(addressValue);
        setInputValue(showSelectedAddress ? addressValue.addressLine1 : '');
      }
    },
    [getPlaceDetails, onChange, clear, showSelectedAddress]
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < predictions.length) {
          handleSelectPrediction(predictions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Handle clear
  const handleClear = () => {
    setInputValue('');
    onChange(null);
    clear();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>

        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => predictions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'pl-10 pr-10',
            error && 'border-red-500 focus:ring-red-500',
            value && 'border-green-500'
          )}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        {(inputValue || value) && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={handleClear}
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
          role="listbox"
        >
          {predictions.map((prediction, index) => {
            const facilityType = getFacilityType(prediction.types);
            const icon = facilityType ? facilityIcons[facilityType] : <MapPin className="h-4 w-4 text-gray-400" />;

            return (
              <button
                key={prediction.placeId}
                type="button"
                className={cn(
                  'w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                  index === activeIndex && 'bg-blue-50'
                )}
                onClick={() => handleSelectPrediction(prediction)}
                role="option"
                aria-selected={index === activeIndex}
              >
                <span className="flex-shrink-0 mt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.mainText}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {prediction.secondaryText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Error message */}
      {(error || autocompleteError) && (
        <p className="mt-1 text-sm text-red-500">{error || autocompleteError}</p>
      )}

      {/* Selected address display */}
      {value && showSelectedAddress && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              {value.placeName && (
                <p className="font-medium text-gray-900">{value.placeName}</p>
              )}
              <p className="text-gray-700">{value.addressLine1}</p>
              {value.addressLine2 && (
                <p className="text-gray-700">{value.addressLine2}</p>
              )}
              <p className="text-gray-500">
                {value.city}, {value.state} {value.zipCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressAutocomplete;
