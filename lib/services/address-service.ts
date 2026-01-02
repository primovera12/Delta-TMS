/**
 * Address Validation and Geocoding Service
 * Provides address validation, geocoding, and distance calculations
 */

export interface AddressComponents {
  streetNumber?: string;
  streetName?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedAddress: string;
}

export interface GeocodedAddress {
  address: AddressComponents;
  location: {
    lat: number;
    lng: number;
  };
  placeId: string;
  confidence: 'high' | 'medium' | 'low';
  isServiceable: boolean;
  serviceAreaName?: string;
}

export interface DistanceResult {
  distanceMiles: number;
  distanceMeters: number;
  durationMinutes: number;
  durationSeconds: number;
  durationInTraffic?: number;
  route?: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radiusMiles: number;
  active: boolean;
}

// Default service areas (Houston area)
const defaultServiceAreas: ServiceArea[] = [
  {
    id: 'houston-metro',
    name: 'Houston Metro',
    centerLat: 29.7604,
    centerLng: -95.3698,
    radiusMiles: 50,
    active: true,
  },
  {
    id: 'galveston',
    name: 'Galveston',
    centerLat: 29.3013,
    centerLng: -94.7977,
    radiusMiles: 15,
    active: true,
  },
];

/**
 * Validate an address string
 */
export async function validateAddress(
  address: string,
  apiKey?: string
): Promise<{ valid: boolean; suggestions?: string[]; error?: string }> {
  // Basic validation
  if (!address || address.trim().length < 5) {
    return { valid: false, error: 'Address is too short' };
  }

  // Check for minimum components
  const hasNumber = /\d/.test(address);
  const hasLetters = /[a-zA-Z]/.test(address);

  if (!hasNumber || !hasLetters) {
    return {
      valid: false,
      error: 'Address must include street number and name',
    };
  }

  // Check for state abbreviation or full name
  const statePattern = /\b(TX|Texas|LA|Louisiana|OK|Oklahoma|AR|Arkansas)\b/i;
  if (!statePattern.test(address)) {
    return {
      valid: false,
      error: 'Please include the state (e.g., TX or Texas)',
      suggestions: [`${address}, TX`],
    };
  }

  // If we have an API key, use Google Maps for validation
  if (apiKey) {
    try {
      const result = await geocodeAddress(address, apiKey);
      return {
        valid: result.confidence !== 'low',
        suggestions: result.confidence === 'low' ? [result.address.formattedAddress] : undefined,
      };
    } catch {
      // Fallback to basic validation
    }
  }

  return { valid: true };
}

/**
 * Geocode an address to get coordinates
 */
export async function geocodeAddress(
  address: string,
  apiKey: string,
  serviceAreas: ServiceArea[] = defaultServiceAreas
): Promise<GeocodedAddress> {
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', address);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('components', 'country:US');

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(`Geocoding failed: ${data.status}`);
  }

  const result = data.results[0];
  const location = result.geometry.location;

  // Parse address components
  const components: Partial<AddressComponents> = {
    formattedAddress: result.formatted_address,
    country: 'US',
  };

  for (const component of result.address_components) {
    const types = component.types;
    if (types.includes('street_number')) {
      components.streetNumber = component.long_name;
    } else if (types.includes('route')) {
      components.streetName = component.long_name;
    } else if (types.includes('locality')) {
      components.city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      components.state = component.short_name;
    } else if (types.includes('postal_code')) {
      components.postalCode = component.long_name;
    }
  }

  // Determine confidence based on location type
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (result.geometry.location_type === 'ROOFTOP') {
    confidence = 'high';
  } else if (result.geometry.location_type === 'GEOMETRIC_CENTER') {
    confidence = 'low';
  }

  // Check if address is within service area
  const serviceCheck = checkServiceArea(location.lat, location.lng, serviceAreas);

  return {
    address: components as AddressComponents,
    location: {
      lat: location.lat,
      lng: location.lng,
    },
    placeId: result.place_id,
    confidence,
    isServiceable: serviceCheck.isServiceable,
    serviceAreaName: serviceCheck.areaName,
  };
}

/**
 * Calculate distance between two addresses
 */
export async function calculateDistance(
  origin: string | { lat: number; lng: number },
  destination: string | { lat: number; lng: number },
  apiKey: string,
  options?: {
    departureTime?: Date;
    avoidHighways?: boolean;
    avoidTolls?: boolean;
  }
): Promise<DistanceResult> {
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');

  const originStr =
    typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`;
  const destStr =
    typeof destination === 'string'
      ? destination
      : `${destination.lat},${destination.lng}`;

  url.searchParams.set('origins', originStr);
  url.searchParams.set('destinations', destStr);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('units', 'imperial');

  if (options?.departureTime) {
    url.searchParams.set(
      'departure_time',
      Math.floor(options.departureTime.getTime() / 1000).toString()
    );
  }

  const avoid: string[] = [];
  if (options?.avoidHighways) avoid.push('highways');
  if (options?.avoidTolls) avoid.push('tolls');
  if (avoid.length) {
    url.searchParams.set('avoid', avoid.join('|'));
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== 'OK' || !data.rows?.[0]?.elements?.[0]) {
    throw new Error(`Distance calculation failed: ${data.status}`);
  }

  const element = data.rows[0].elements[0];

  if (element.status !== 'OK') {
    throw new Error(`Route not found: ${element.status}`);
  }

  return {
    distanceMiles: element.distance.value / 1609.34, // meters to miles
    distanceMeters: element.distance.value,
    durationMinutes: element.duration.value / 60,
    durationSeconds: element.duration.value,
    durationInTraffic: element.duration_in_traffic?.value
      ? element.duration_in_traffic.value / 60
      : undefined,
  };
}

/**
 * Check if coordinates are within a service area
 */
export function checkServiceArea(
  lat: number,
  lng: number,
  serviceAreas: ServiceArea[] = defaultServiceAreas
): { isServiceable: boolean; areaName?: string; distance?: number } {
  for (const area of serviceAreas) {
    if (!area.active) continue;

    const distance = calculateHaversineDistance(
      lat,
      lng,
      area.centerLat,
      area.centerLng
    );

    if (distance <= area.radiusMiles) {
      return {
        isServiceable: true,
        areaName: area.name,
        distance,
      };
    }
  }

  return { isServiceable: false };
}

/**
 * Calculate distance using Haversine formula (for straight-line distance)
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format an address for display
 */
export function formatAddress(
  components: Partial<AddressComponents>,
  format: 'full' | 'short' | 'oneline' = 'oneline'
): string {
  if (components.formattedAddress && format === 'oneline') {
    return components.formattedAddress;
  }

  const parts: string[] = [];

  if (components.streetNumber && components.streetName) {
    parts.push(`${components.streetNumber} ${components.streetName}`);
  } else if (components.streetName) {
    parts.push(components.streetName);
  }

  if (format === 'short') {
    if (components.city) {
      parts.push(components.city);
    }
    return parts.join(', ');
  }

  if (components.city && components.state) {
    parts.push(`${components.city}, ${components.state}`);
  } else if (components.city) {
    parts.push(components.city);
  }

  if (components.postalCode) {
    parts.push(components.postalCode);
  }

  return parts.join(format === 'full' ? '\n' : ', ');
}

/**
 * Parse a place search query and identify facility types
 */
export function identifyFacilityType(
  query: string
): 'hospital' | 'clinic' | 'dialysis' | 'pharmacy' | 'nursing_home' | 'other' {
  const lowerQuery = query.toLowerCase();

  if (/hospital|medical center|med center/i.test(lowerQuery)) {
    return 'hospital';
  }
  if (/dialysis|kidney|renal/i.test(lowerQuery)) {
    return 'dialysis';
  }
  if (/nursing home|assisted living|senior care|retirement/i.test(lowerQuery)) {
    return 'nursing_home';
  }
  if (/pharmacy|cvs|walgreens|drug/i.test(lowerQuery)) {
    return 'pharmacy';
  }
  if (/clinic|doctor|physician|urgent care|medical office/i.test(lowerQuery)) {
    return 'clinic';
  }

  return 'other';
}

/**
 * Get ETA text from minutes
 */
export function formatETA(minutes: number, departureTime?: Date): string {
  if (minutes < 1) {
    return 'Less than a minute';
  }

  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (departureTime) {
    const arrivalTime = new Date(departureTime.getTime() + minutes * 60 * 1000);
    const timeStr = arrivalTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${hours}h ${mins}m (arrives ${timeStr})`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
  if (miles < 0.1) {
    return `${Math.round(miles * 5280)} ft`;
  }
  if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${Math.round(miles)} mi`;
}
