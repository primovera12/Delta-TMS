/**
 * Bouncie Webhook Handler
 *
 * Processes incoming webhooks from Bouncie and updates device records.
 */

import { prisma } from '@/lib/db';
import { bouncieService } from './index';
import type { BounceEventType } from '@prisma/client';

export interface BouncieWebhookPayload {
  event: string;
  imei: string;
  timestamp: string;
  data: {
    location?: {
      lat: number;
      lon: number;
      speed?: number;
      heading?: number;
      altitude?: number;
    };
    trip?: {
      tripId?: string;
      startTime?: string;
      endTime?: string;
      startLocation?: { lat: number; lon: number; address?: string };
      endLocation?: { lat: number; lon: number; address?: string };
      distance?: number;
      duration?: number;
      maxSpeed?: number;
      avgSpeed?: number;
      fuelUsed?: number;
      hardBrakes?: number;
      rapidAccels?: number;
      speedingEvents?: number;
      idleTime?: number;
      polyline?: string;
    };
    battery?: {
      voltage: number;
      status: string;
    };
    dtc?: {
      codes: string[];
    };
    speed?: {
      value: number;
      limit?: number;
    };
    odometer?: {
      value: number;
    };
    fuel?: {
      level: number;
      range?: number;
    };
  };
}

export interface WebhookProcessResult {
  success: boolean;
  eventId?: string;
  error?: string;
  action?: string;
}

/**
 * Map webhook event string to enum
 */
function mapEventType(event: string): BounceEventType {
  const mapping: Record<string, BounceEventType> = {
    location: 'LOCATION',
    'trip-start': 'TRIP_START',
    'trip-end': 'TRIP_END',
    speeding: 'SPEEDING',
    'hard-brake': 'HARD_BRAKE',
    'rapid-accel': 'RAPID_ACCEL',
    idle: 'IDLE',
    dtc: 'DTC',
    battery: 'BATTERY',
    mil: 'MIL',
  };
  return mapping[event] || 'LOCATION';
}

/**
 * Validate webhook signature (if secret is configured)
 */
export async function validateWebhookSignature(
  payload: string,
  signature: string | null
): Promise<boolean> {
  const config = await bouncieService.getConfig();

  // If no webhook secret configured, skip validation
  if (!config?.webhookSecret) {
    return true;
  }

  // If secret is configured but no signature provided, reject
  if (!signature) {
    return false;
  }

  // Validate HMAC signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(config.webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computedSignature === signature;
}

/**
 * Process incoming Bouncie webhook
 */
export async function processBouncieWebhook(
  payload: BouncieWebhookPayload
): Promise<WebhookProcessResult> {
  const { event, imei, data } = payload;

  try {
    // Verify device exists in our database
    const device = await bouncieService.getDeviceByImei(imei);
    if (!device) {
      // Device not registered - could auto-create or reject
      return {
        success: false,
        error: `Device ${imei} not found in database`,
      };
    }

    // Log the event
    const eventRecord = await prisma.bouncieEvent.create({
      data: {
        deviceImei: imei,
        eventType: mapEventType(event),
        latitude: data.location?.lat,
        longitude: data.location?.lon,
        speed: data.location?.speed,
        heading: data.location?.heading,
        payload: payload as object,
      },
    });

    // Process based on event type
    let action: string;
    switch (event) {
      case 'location':
        action = await handleLocationEvent(imei, data);
        break;

      case 'trip-start':
        action = await handleTripStartEvent(imei, data, eventRecord.id);
        break;

      case 'trip-end':
        action = await handleTripEndEvent(imei, data, eventRecord.id);
        break;

      case 'speeding':
        action = await handleSpeedingEvent(imei, data);
        break;

      case 'hard-brake':
        action = await handleHardBrakeEvent(imei, data);
        break;

      case 'rapid-accel':
        action = await handleRapidAccelEvent(imei, data);
        break;

      case 'idle':
        action = await handleIdleEvent(imei, data);
        break;

      case 'dtc':
        action = await handleDtcEvent(imei, data);
        break;

      case 'battery':
        action = await handleBatteryEvent(imei, data);
        break;

      case 'mil':
        action = await handleMilEvent(imei, data);
        break;

      default:
        action = 'unknown_event_type';
    }

    // Mark event as processed
    await prisma.bouncieEvent.update({
      where: { id: eventRecord.id },
      data: { processedAt: new Date() },
    });

    return {
      success: true,
      eventId: eventRecord.id,
      action,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Handle location update event
 */
async function handleLocationEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  if (!data.location) return 'no_location_data';

  await bouncieService.updateDeviceLocation(imei, {
    latitude: data.location.lat,
    longitude: data.location.lon,
    speed: data.location.speed,
    heading: data.location.heading,
    altitude: data.location.altitude,
  });

  // Check if we should trigger geofence detection
  const config = await bouncieService.getConfig();
  if (config?.enableGeofencing && config?.enableAutoStatusUpdate) {
    await checkGeofenceTriggers(imei, data.location.lat, data.location.lon);
  }

  return 'location_updated';
}

/**
 * Handle trip start event
 */
async function handleTripStartEvent(
  imei: string,
  data: BouncieWebhookPayload['data'],
  eventId: string
): Promise<string> {
  if (!data.trip?.startLocation) return 'no_trip_data';

  // Update device trip status
  await prisma.bouncieDevice.update({
    where: { imei },
    data: {
      isOnTrip: true,
      currentTripStartedAt: data.trip.startTime
        ? new Date(data.trip.startTime)
        : new Date(),
    },
  });

  // Create Bouncie trip record
  await prisma.bouncieTrip.create({
    data: {
      deviceImei: imei,
      bouncieTripId: data.trip.tripId,
      startedAt: data.trip.startTime
        ? new Date(data.trip.startTime)
        : new Date(),
      startLatitude: data.trip.startLocation.lat,
      startLongitude: data.trip.startLocation.lon,
      startAddress: data.trip.startLocation.address,
    },
  });

  return 'trip_started';
}

/**
 * Handle trip end event
 */
async function handleTripEndEvent(
  imei: string,
  data: BouncieWebhookPayload['data'],
  eventId: string
): Promise<string> {
  if (!data.trip) return 'no_trip_data';

  // Update device trip status
  await prisma.bouncieDevice.update({
    where: { imei },
    data: {
      isOnTrip: false,
      currentTripStartedAt: null,
    },
  });

  // Update Bouncie trip record
  if (data.trip.tripId) {
    await prisma.bouncieTrip.update({
      where: { bouncieTripId: data.trip.tripId },
      data: {
        endedAt: data.trip.endTime ? new Date(data.trip.endTime) : new Date(),
        endLatitude: data.trip.endLocation?.lat,
        endLongitude: data.trip.endLocation?.lon,
        endAddress: data.trip.endLocation?.address,
        distanceMiles: data.trip.distance,
        durationMinutes: data.trip.duration,
        maxSpeedMph: data.trip.maxSpeed,
        avgSpeedMph: data.trip.avgSpeed,
        fuelUsedGallons: data.trip.fuelUsed,
        hardBrakes: data.trip.hardBrakes ?? 0,
        rapidAccels: data.trip.rapidAccels ?? 0,
        speedingEvents: data.trip.speedingEvents ?? 0,
        idleTimeMinutes: data.trip.idleTime ?? 0,
        routePolyline: data.trip.polyline,
      },
    });
  }

  return 'trip_ended';
}

/**
 * Handle speeding event
 */
async function handleSpeedingEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  if (await bouncieService.isFeatureEnabled('driverBehavior')) {
    await bouncieService.incrementBehaviorCounter(imei, 'speeding');
  }
  return 'speeding_recorded';
}

/**
 * Handle hard brake event
 */
async function handleHardBrakeEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  if (await bouncieService.isFeatureEnabled('driverBehavior')) {
    await bouncieService.incrementBehaviorCounter(imei, 'hardBraking');
  }
  return 'hard_brake_recorded';
}

/**
 * Handle rapid acceleration event
 */
async function handleRapidAccelEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  if (await bouncieService.isFeatureEnabled('driverBehavior')) {
    await bouncieService.incrementBehaviorCounter(imei, 'rapidAccel');
  }
  return 'rapid_accel_recorded';
}

/**
 * Handle idle event
 */
async function handleIdleEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  // Idle time is typically reported in minutes
  await prisma.bouncieDevice.update({
    where: { imei },
    data: {
      idleTimeMinutes: { increment: 1 },
      behaviorUpdatedAt: new Date(),
    },
  });
  return 'idle_recorded';
}

/**
 * Handle diagnostic trouble codes event
 */
async function handleDtcEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  if (!data.dtc?.codes) return 'no_dtc_data';

  await bouncieService.updateDeviceDiagnostics(imei, {
    diagnosticCodes: data.dtc.codes,
    checkEngineLight: data.dtc.codes.length > 0,
  });

  return 'dtc_updated';
}

/**
 * Handle battery event
 */
async function handleBatteryEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  if (!data.battery) return 'no_battery_data';

  await bouncieService.updateDeviceDiagnostics(imei, {
    batteryVoltage: data.battery.voltage,
  });

  // Alert if battery is low (below 11.8V typically indicates issues)
  if (
    data.battery.voltage < 11.8 &&
    (await bouncieService.isFeatureEnabled('maintenanceAlerts'))
  ) {
    // TODO: Create maintenance alert
    console.log(`Low battery alert for device ${imei}: ${data.battery.voltage}V`);
  }

  return 'battery_updated';
}

/**
 * Handle malfunction indicator lamp (check engine) event
 */
async function handleMilEvent(
  imei: string,
  data: BouncieWebhookPayload['data']
): Promise<string> {
  await bouncieService.updateDeviceDiagnostics(imei, {
    checkEngineLight: true,
  });

  if (await bouncieService.isFeatureEnabled('maintenanceAlerts')) {
    // TODO: Create maintenance alert
    console.log(`Check engine light alert for device ${imei}`);
  }

  return 'mil_updated';
}

/**
 * Check if location triggers any geofence events
 * This is called on location updates when auto-status-update is enabled
 */
async function checkGeofenceTriggers(
  imei: string,
  latitude: number,
  longitude: number
): Promise<void> {
  const config = await bouncieService.getConfig();
  if (!config?.enableGeofencing) return;

  const device = await prisma.bouncieDevice.findUnique({
    where: { imei },
    include: { vehicle: true },
  });

  if (!device?.vehicleId || !device.vehicle) return;

  // Find active trips for this vehicle
  const activeTrips = await prisma.trip.findMany({
    where: {
      vehicleId: device.vehicleId,
      status: { in: ['ASSIGNED', 'DRIVER_EN_ROUTE', 'DRIVER_ARRIVED', 'IN_PROGRESS'] },
    },
    include: {
      stops: {
        orderBy: { stopOrder: 'asc' },
      },
    },
  });

  for (const trip of activeTrips) {
    // Check distance to current stop
    const currentStop = trip.stops.find(
      (s) => s.stopOrder === trip.currentStopIndex
    );
    if (!currentStop) continue;

    const distance = calculateDistance(
      latitude,
      longitude,
      currentStop.latitude,
      currentStop.longitude
    );

    const geofenceRadius = config.geofenceRadiusMeters || 100;

    // If within geofence radius, trigger arrival
    if (distance <= geofenceRadius) {
      // TODO: Auto-update trip status based on current status
      console.log(
        `Vehicle ${device.vehicleId} arrived at stop ${currentStop.id} (${distance}m from target)`
      );
    }
  }
}

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
function calculateDistance(
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
