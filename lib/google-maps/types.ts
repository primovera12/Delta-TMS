/**
 * Google Maps Type Definitions
 */

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  addressComponents: {
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  name?: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  types: string[];
}

export interface AutocompleteOptions {
  types?: ('address' | 'establishment' | 'geocode' | '(cities)')[];
  componentRestrictions?: {
    country: string | string[];
  };
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  strictBounds?: boolean;
}

export interface DistanceMatrixResult {
  originAddress: string;
  destinationAddress: string;
  distanceMiles: number;
  distanceMeters: number;
  durationMinutes: number;
  durationSeconds: number;
  durationInTraffic?: number;
  status: 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS' | 'MAX_ROUTE_LENGTH_EXCEEDED';
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type GoogleMapsStatus = 'loading' | 'ready' | 'error';
