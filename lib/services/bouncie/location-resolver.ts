/**
 * Location Resolver Service
 *
 * Smart location resolution with fallback:
 * 1. Bouncie GPS (most accurate, if available and online)
 * 2. Driver phone GPS
 * 3. Last known location
 *
 * This ensures the system works perfectly without Bouncie.
 */

import { prisma } from '@/lib/db';
import { bouncieService, type LocationResult } from './index';

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export interface VehicleLocationResult extends LocationResult {
  vehicleId: string;
  driverId?: string | null;
  bouncieDeviceImei?: string | null;
}

export interface DriverLocationResult extends LocationResult {
  driverId: string;
  vehicleId?: string | null;
  bouncieDeviceImei?: string | null;
}

/**
 * Get the best available location for a vehicle
 */
export async function getVehicleLocation(
  vehicleId: string
): Promise<VehicleLocationResult | null> {
  // Get vehicle with driver and Bouncie device
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      driver: true,
      bouncieDevice: true,
    },
  });

  if (!vehicle) return null;

  const now = Date.now();

  // 1. Try Bouncie device location (if enabled, linked, and online)
  if (await bouncieService.isEnabled()) {
    const device = vehicle.bouncieDevice;
    if (
      device?.isOnline &&
      device.latitude !== null &&
      device.longitude !== null &&
      device.locationUpdatedAt
    ) {
      const ageMs = now - new Date(device.locationUpdatedAt).getTime();
      if (ageMs < STALE_THRESHOLD_MS) {
        return {
          vehicleId,
          driverId: vehicle.driverId,
          bouncieDeviceImei: device.imei,
          latitude: device.latitude,
          longitude: device.longitude,
          speed: device.speed,
          heading: device.heading,
          altitude: device.altitude,
          accuracy: device.locationAccuracy,
          source: 'bouncie',
          updatedAt: device.locationUpdatedAt,
          isStale: false,
        };
      }
    }
  }

  // 2. Fall back to driver phone GPS
  if (vehicle.driver) {
    const driver = vehicle.driver;
    if (
      driver.currentLatitude !== null &&
      driver.currentLongitude !== null &&
      driver.lastLocationUpdate
    ) {
      const ageMs = now - new Date(driver.lastLocationUpdate).getTime();
      return {
        vehicleId,
        driverId: driver.id,
        bouncieDeviceImei: vehicle.bouncieDevice?.imei,
        latitude: driver.currentLatitude,
        longitude: driver.currentLongitude,
        speed: driver.currentSpeed,
        heading: driver.currentHeading,
        altitude: null,
        accuracy: null,
        source: 'driver_phone',
        updatedAt: driver.lastLocationUpdate,
        isStale: ageMs >= STALE_THRESHOLD_MS,
      };
    }
  }

  // 3. Fall back to last known Bouncie location (even if stale)
  const device = vehicle.bouncieDevice;
  if (
    device?.latitude !== null &&
    device?.longitude !== null &&
    device?.locationUpdatedAt
  ) {
    return {
      vehicleId,
      driverId: vehicle.driverId,
      bouncieDeviceImei: device.imei,
      latitude: device.latitude!,
      longitude: device.longitude!,
      speed: device.speed,
      heading: device.heading,
      altitude: device.altitude,
      accuracy: device.locationAccuracy,
      source: 'last_known',
      updatedAt: device.locationUpdatedAt,
      isStale: true,
    };
  }

  return null;
}

/**
 * Get the best available location for a driver
 */
export async function getDriverLocation(
  driverId: string
): Promise<DriverLocationResult | null> {
  // Get driver with assigned vehicle and its Bouncie device
  const driver = await prisma.driverProfile.findUnique({
    where: { id: driverId },
    include: {
      vehicles: {
        include: {
          bouncieDevice: true,
        },
        where: { isActive: true },
        take: 1, // Get primary vehicle
      },
    },
  });

  if (!driver) return null;

  const now = Date.now();
  const vehicle = driver.vehicles[0];

  // 1. Try Bouncie device on driver's vehicle
  if (vehicle && (await bouncieService.isEnabled())) {
    const device = vehicle.bouncieDevice;
    if (
      device?.isOnline &&
      device.latitude !== null &&
      device.longitude !== null &&
      device.locationUpdatedAt
    ) {
      const ageMs = now - new Date(device.locationUpdatedAt).getTime();
      if (ageMs < STALE_THRESHOLD_MS) {
        return {
          driverId,
          vehicleId: vehicle.id,
          bouncieDeviceImei: device.imei,
          latitude: device.latitude,
          longitude: device.longitude,
          speed: device.speed,
          heading: device.heading,
          altitude: device.altitude,
          accuracy: device.locationAccuracy,
          source: 'bouncie',
          updatedAt: device.locationUpdatedAt,
          isStale: false,
        };
      }
    }
  }

  // 2. Use driver's phone GPS
  if (
    driver.currentLatitude !== null &&
    driver.currentLongitude !== null &&
    driver.lastLocationUpdate
  ) {
    const ageMs = now - new Date(driver.lastLocationUpdate).getTime();
    return {
      driverId,
      vehicleId: vehicle?.id,
      bouncieDeviceImei: vehicle?.bouncieDevice?.imei,
      latitude: driver.currentLatitude,
      longitude: driver.currentLongitude,
      speed: driver.currentSpeed,
      heading: driver.currentHeading,
      altitude: null,
      accuracy: null,
      source: 'driver_phone',
      updatedAt: driver.lastLocationUpdate,
      isStale: ageMs >= STALE_THRESHOLD_MS,
    };
  }

  // 3. Last known Bouncie location
  if (vehicle?.bouncieDevice) {
    const device = vehicle.bouncieDevice;
    if (
      device.latitude !== null &&
      device.longitude !== null &&
      device.locationUpdatedAt
    ) {
      return {
        driverId,
        vehicleId: vehicle.id,
        bouncieDeviceImei: device.imei,
        latitude: device.latitude,
        longitude: device.longitude,
        speed: device.speed,
        heading: device.heading,
        altitude: device.altitude,
        accuracy: device.locationAccuracy,
        source: 'last_known',
        updatedAt: device.locationUpdatedAt,
        isStale: true,
      };
    }
  }

  return null;
}

/**
 * Get locations for all active drivers (for live map)
 */
export async function getAllActiveDriverLocations(): Promise<
  DriverLocationResult[]
> {
  const activeDrivers = await prisma.driverProfile.findMany({
    where: {
      status: { in: ['ONLINE', 'AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ON_TRIP'] },
    },
    include: {
      vehicles: {
        include: {
          bouncieDevice: true,
        },
        where: { isActive: true },
        take: 1,
      },
    },
  });

  const bouncieEnabled = await bouncieService.isEnabled();
  const now = Date.now();
  const locations: DriverLocationResult[] = [];

  for (const driver of activeDrivers) {
    const vehicle = driver.vehicles[0];
    let location: DriverLocationResult | null = null;

    // Try Bouncie first
    if (bouncieEnabled && vehicle?.bouncieDevice) {
      const device = vehicle.bouncieDevice;
      if (
        device.isOnline &&
        device.latitude !== null &&
        device.longitude !== null &&
        device.locationUpdatedAt
      ) {
        const ageMs = now - new Date(device.locationUpdatedAt).getTime();
        if (ageMs < STALE_THRESHOLD_MS) {
          location = {
            driverId: driver.id,
            vehicleId: vehicle.id,
            bouncieDeviceImei: device.imei,
            latitude: device.latitude,
            longitude: device.longitude,
            speed: device.speed,
            heading: device.heading,
            altitude: device.altitude,
            accuracy: device.locationAccuracy,
            source: 'bouncie',
            updatedAt: device.locationUpdatedAt,
            isStale: false,
          };
        }
      }
    }

    // Fall back to driver phone
    if (
      !location &&
      driver.currentLatitude !== null &&
      driver.currentLongitude !== null
    ) {
      const ageMs = driver.lastLocationUpdate
        ? now - new Date(driver.lastLocationUpdate).getTime()
        : Infinity;
      location = {
        driverId: driver.id,
        vehicleId: vehicle?.id,
        bouncieDeviceImei: vehicle?.bouncieDevice?.imei,
        latitude: driver.currentLatitude,
        longitude: driver.currentLongitude,
        speed: driver.currentSpeed,
        heading: driver.currentHeading,
        altitude: null,
        accuracy: null,
        source: 'driver_phone',
        updatedAt: driver.lastLocationUpdate ?? new Date(),
        isStale: ageMs >= STALE_THRESHOLD_MS,
      };
    }

    if (location) {
      locations.push(location);
    }
  }

  return locations;
}

/**
 * Get location for an active trip
 */
export async function getTripLocation(
  tripId: string
): Promise<VehicleLocationResult | DriverLocationResult | null> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      vehicleId: true,
      driverId: true,
    },
  });

  if (!trip) return null;

  // Prefer vehicle location if assigned
  if (trip.vehicleId) {
    return getVehicleLocation(trip.vehicleId);
  }

  // Fall back to driver location
  if (trip.driverId) {
    return getDriverLocation(trip.driverId);
  }

  return null;
}

/**
 * Check if a location is within a radius of a target
 */
export function isWithinRadius(
  location: { latitude: number; longitude: number },
  target: { latitude: number; longitude: number },
  radiusMeters: number
): boolean {
  const distance = calculateDistanceMeters(
    location.latitude,
    location.longitude,
    target.latitude,
    target.longitude
  );
  return distance <= radiusMeters;
}

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate ETA based on current location and destination
 */
export function calculateETA(
  currentLocation: { latitude: number; longitude: number; speed?: number | null },
  destination: { latitude: number; longitude: number },
  defaultSpeedMph: number = 30
): { distanceMiles: number; etaMinutes: number } {
  const distanceMeters = calculateDistanceMeters(
    currentLocation.latitude,
    currentLocation.longitude,
    destination.latitude,
    destination.longitude
  );

  const distanceMiles = distanceMeters / 1609.34; // Convert to miles

  // Use current speed if available and reasonable, otherwise use default
  const speedMph =
    currentLocation.speed && currentLocation.speed > 5
      ? currentLocation.speed
      : defaultSpeedMph;

  const etaMinutes = (distanceMiles / speedMph) * 60;

  return {
    distanceMiles: Math.round(distanceMiles * 10) / 10, // Round to 1 decimal
    etaMinutes: Math.round(etaMinutes),
  };
}
