/**
 * Bouncie GPS Integration Service
 *
 * This service handles all communication with the Bouncie API for GPS tracking.
 * Bouncie is an OPTIONAL add-on - the system works perfectly without it.
 *
 * Features:
 * - Real-time GPS location (more reliable than phone)
 * - Vehicle diagnostics (check engine, battery, fuel)
 * - Odometer/mileage tracking
 * - Driver behavior data (speeding, hard braking)
 * - Trip history
 * - Webhooks for real-time events
 */

import { prisma } from '@/lib/db';
import type {
  BouncieConfig,
  BouncieDevice,
  BounceConfigSyncStatus,
} from '@prisma/client';

// Bouncie API base URL
const BOUNCIE_API_BASE = 'https://api.bouncie.dev/v1';

// Types for Bouncie API responses
export interface BouncieCredentials {
  clientId: string;
  clientSecret: string;
  authorizationCode: string;
  redirectUrl?: string;
}

export interface BouncieTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface BouncieVehicleData {
  imei: string;
  nickName?: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  stats?: {
    location?: {
      lat: number;
      lon: number;
      heading: number;
      speed: number;
      altitude: number;
      timestamp: string;
    };
    battery?: {
      voltage: number;
      status: string;
    };
    fuel?: {
      level: number;
      range: number;
    };
    odometer?: {
      value: number;
    };
    mil?: {
      status: boolean;
      dtcs: string[];
    };
  };
  online?: boolean;
}

export interface BouncieTripData {
  tripId: string;
  imei: string;
  startTime: string;
  endTime?: string;
  startLocation: {
    lat: number;
    lon: number;
    address?: string;
  };
  endLocation?: {
    lat: number;
    lon: number;
    address?: string;
  };
  distance?: number; // miles
  duration?: number; // minutes
  maxSpeed?: number;
  avgSpeed?: number;
  fuelUsed?: number;
  hardBrakes?: number;
  rapidAccels?: number;
  speedingEvents?: number;
  idleTime?: number;
  polyline?: string;
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
  altitude?: number | null;
  accuracy?: number | null;
  source: 'bouncie' | 'driver_phone' | 'last_known';
  updatedAt: Date;
  isStale: boolean; // true if older than 5 minutes
}

class BouncieService {
  private config: BouncieConfig | null = null;
  private configLoadedAt: Date | null = null;
  private readonly CONFIG_CACHE_TTL = 60000; // 1 minute

  /**
   * Check if Bouncie integration is configured and enabled
   */
  async isEnabled(): Promise<boolean> {
    const config = await this.getConfig();
    return config?.isEnabled ?? false;
  }

  /**
   * Check if a specific feature is enabled
   */
  async isFeatureEnabled(
    feature:
      | 'realTimeTracking'
      | 'geofencing'
      | 'diagnostics'
      | 'driverBehavior'
      | 'mileageTracking'
      | 'fuelMonitoring'
      | 'maintenanceAlerts'
      | 'autoStatusUpdate'
  ): Promise<boolean> {
    const config = await this.getConfig();
    if (!config?.isEnabled) return false;

    switch (feature) {
      case 'realTimeTracking':
        return config.enableRealTimeTracking;
      case 'geofencing':
        return config.enableGeofencing;
      case 'diagnostics':
        return config.enableDiagnostics;
      case 'driverBehavior':
        return config.enableDriverBehavior;
      case 'mileageTracking':
        return config.enableMileageTracking;
      case 'fuelMonitoring':
        return config.enableFuelMonitoring;
      case 'maintenanceAlerts':
        return config.enableMaintenanceAlerts;
      case 'autoStatusUpdate':
        return config.enableAutoStatusUpdate;
      default:
        return false;
    }
  }

  /**
   * Get Bouncie configuration from database (cached)
   */
  async getConfig(): Promise<BouncieConfig | null> {
    // Check cache
    if (
      this.config &&
      this.configLoadedAt &&
      Date.now() - this.configLoadedAt.getTime() < this.CONFIG_CACHE_TTL
    ) {
      return this.config;
    }

    // Load from database
    this.config = await prisma.bouncieConfig.findFirst();
    this.configLoadedAt = new Date();
    return this.config;
  }

  /**
   * Clear the config cache (call after updates)
   */
  clearConfigCache(): void {
    this.config = null;
    this.configLoadedAt = null;
  }

  /**
   * Save or update Bouncie configuration
   */
  async saveConfig(
    data: Partial<BouncieConfig>
  ): Promise<BouncieConfig> {
    const existing = await prisma.bouncieConfig.findFirst();

    let config: BouncieConfig;
    if (existing) {
      config = await prisma.bouncieConfig.update({
        where: { id: existing.id },
        data,
      });
    } else {
      config = await prisma.bouncieConfig.create({
        data: data as never,
      });
    }

    this.clearConfigCache();
    return config;
  }

  /**
   * Test connection with provided credentials
   */
  async testConnection(
    credentials: BouncieCredentials
  ): Promise<{ success: boolean; error?: string; vehicleCount?: number }> {
    try {
      // Exchange authorization code for tokens
      const tokenResponse = await this.exchangeCodeForTokens(credentials);

      if (!tokenResponse.access_token) {
        return { success: false, error: 'Failed to obtain access token' };
      }

      // Try to fetch vehicles to verify the token works
      const vehicles = await this.fetchVehiclesWithToken(
        tokenResponse.access_token
      );

      // Save the tokens to config
      await this.saveConfig({
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        authorizationCode: credentials.authorizationCode,
        redirectUrl: credentials.redirectUrl,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: new Date(
          Date.now() + tokenResponse.expires_in * 1000
        ),
        syncStatus: 'CONNECTED',
        syncError: null,
        lastSyncAt: new Date(),
      });

      return { success: true, vehicleCount: vehicles.length };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      await this.saveConfig({
        syncStatus: 'ERROR',
        syncError: message,
      });
      return { success: false, error: message };
    }
  }

  /**
   * Exchange authorization code for access tokens
   */
  private async exchangeCodeForTokens(
    credentials: BouncieCredentials
  ): Promise<BouncieTokenResponse> {
    const response = await fetch(`${BOUNCIE_API_BASE}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code: credentials.authorizationCode,
        redirect_uri: credentials.redirectUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    const config = await this.getConfig();
    if (!config?.refreshToken || !config?.clientId || !config?.clientSecret) {
      return false;
    }

    try {
      const response = await fetch(`${BOUNCIE_API_BASE}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          client_id: config.clientId,
          client_secret: config.clientSecret,
          refresh_token: config.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokens: BouncieTokenResponse = await response.json();

      await this.saveConfig({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        syncStatus: 'CONNECTED',
        syncError: null,
      });

      return true;
    } catch (error) {
      await this.saveConfig({
        syncStatus: 'ERROR',
        syncError: 'Token refresh failed',
      });
      return false;
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getAccessToken(): Promise<string | null> {
    const config = await this.getConfig();
    if (!config?.accessToken) return null;

    // Check if token is expired or about to expire (5 min buffer)
    if (
      config.tokenExpiresAt &&
      new Date(config.tokenExpiresAt).getTime() < Date.now() + 300000
    ) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) return null;

      // Re-fetch config to get new token
      this.clearConfigCache();
      const newConfig = await this.getConfig();
      return newConfig?.accessToken ?? null;
    }

    return config.accessToken;
  }

  /**
   * Fetch all devices/vehicles from Bouncie account
   */
  async fetchDevices(): Promise<BouncieVehicleData[]> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No valid access token');
    }
    return this.fetchVehiclesWithToken(token);
  }

  /**
   * Fetch vehicles with a specific token
   */
  private async fetchVehiclesWithToken(
    token: string
  ): Promise<BouncieVehicleData[]> {
    const response = await fetch(`${BOUNCIE_API_BASE}/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch single device status
   */
  async fetchDeviceStatus(imei: string): Promise<BouncieVehicleData | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    const response = await fetch(`${BOUNCIE_API_BASE}/vehicles/${imei}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch device: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch trips for a device
   */
  async fetchTrips(
    imei: string,
    options: { startDate: Date; endDate: Date }
  ): Promise<BouncieTripData[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    const params = new URLSearchParams({
      start: options.startDate.toISOString(),
      end: options.endDate.toISOString(),
    });

    const response = await fetch(
      `${BOUNCIE_API_BASE}/vehicles/${imei}/trips?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trips: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Sync all devices from Bouncie to our database
   */
  async syncDevices(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      await this.saveConfig({ syncStatus: 'SYNCING' });

      const devices = await this.fetchDevices();

      for (const device of devices) {
        try {
          await prisma.bouncieDevice.upsert({
            where: { imei: device.imei },
            update: {
              nickname: device.nickName,
              vin: device.vin,
              make: device.make,
              model: device.model,
              year: device.year,
              isOnline: device.online ?? false,
              lastSeenAt: device.online ? new Date() : undefined,
              latitude: device.stats?.location?.lat,
              longitude: device.stats?.location?.lon,
              speed: device.stats?.location?.speed,
              heading: device.stats?.location?.heading,
              altitude: device.stats?.location?.altitude,
              locationUpdatedAt: device.stats?.location?.timestamp
                ? new Date(device.stats.location.timestamp)
                : undefined,
              batteryVoltage: device.stats?.battery?.voltage,
              fuelLevelPercent: device.stats?.fuel?.level,
              fuelRange: device.stats?.fuel?.range,
              odometerMiles: device.stats?.odometer?.value,
              checkEngineLight: device.stats?.mil?.status ?? false,
              diagnosticCodes: device.stats?.mil?.dtcs ?? [],
              diagnosticsUpdatedAt: new Date(),
              updatedAt: new Date(),
            },
            create: {
              imei: device.imei,
              nickname: device.nickName,
              vin: device.vin,
              make: device.make,
              model: device.model,
              year: device.year,
              isOnline: device.online ?? false,
              lastSeenAt: device.online ? new Date() : undefined,
              latitude: device.stats?.location?.lat,
              longitude: device.stats?.location?.lon,
              speed: device.stats?.location?.speed,
              heading: device.stats?.location?.heading,
              altitude: device.stats?.location?.altitude,
              locationUpdatedAt: device.stats?.location?.timestamp
                ? new Date(device.stats.location.timestamp)
                : undefined,
            },
          });
          synced++;
        } catch (error) {
          errors.push(
            `Failed to sync device ${device.imei}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      await this.saveConfig({
        syncStatus: 'CONNECTED',
        syncError: errors.length > 0 ? errors.join('; ') : null,
        lastSyncAt: new Date(),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      errors.push(message);
      await this.saveConfig({
        syncStatus: 'ERROR',
        syncError: message,
      });
    }

    return { synced, errors };
  }

  /**
   * Link a Bouncie device to a vehicle
   */
  async linkDeviceToVehicle(
    imei: string,
    vehicleId: string
  ): Promise<BouncieDevice> {
    return prisma.bouncieDevice.update({
      where: { imei },
      data: { vehicleId },
    });
  }

  /**
   * Unlink a Bouncie device from its vehicle
   */
  async unlinkDevice(imei: string): Promise<BouncieDevice> {
    return prisma.bouncieDevice.update({
      where: { imei },
      data: { vehicleId: null },
    });
  }

  /**
   * Get all Bouncie devices (optionally including vehicle relation)
   */
  async getDevices(
    includeVehicle = false
  ): Promise<BouncieDevice[]> {
    return prisma.bouncieDevice.findMany({
      include: includeVehicle ? { vehicle: true } : undefined,
      orderBy: { nickname: 'asc' },
    });
  }

  /**
   * Get device by vehicle ID
   */
  async getDeviceByVehicleId(
    vehicleId: string
  ): Promise<BouncieDevice | null> {
    return prisma.bouncieDevice.findFirst({
      where: { vehicleId },
    });
  }

  /**
   * Get device by IMEI
   */
  async getDeviceByImei(imei: string): Promise<BouncieDevice | null> {
    return prisma.bouncieDevice.findUnique({
      where: { imei },
    });
  }

  /**
   * Register webhook with Bouncie
   */
  async registerWebhook(webhookUrl: string): Promise<boolean> {
    const token = await this.getAccessToken();
    if (!token) return false;

    try {
      // Generate a webhook secret
      const webhookSecret = crypto.randomUUID();

      const response = await fetch(`${BOUNCIE_API_BASE}/webhooks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          events: [
            'location',
            'trip-start',
            'trip-end',
            'speeding',
            'hard-brake',
            'rapid-accel',
            'idle',
            'dtc',
            'battery',
            'mil',
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook registration failed: ${response.statusText}`);
      }

      // Save webhook config
      await this.saveConfig({
        webhookUrl,
        webhookSecret,
        webhookEnabled: true,
      });

      return true;
    } catch (error) {
      console.error('Failed to register webhook:', error);
      return false;
    }
  }

  /**
   * Update device location from webhook event
   */
  async updateDeviceLocation(
    imei: string,
    location: {
      latitude: number;
      longitude: number;
      speed?: number;
      heading?: number;
      altitude?: number;
    }
  ): Promise<void> {
    await prisma.bouncieDevice.update({
      where: { imei },
      data: {
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed,
        heading: location.heading,
        altitude: location.altitude,
        locationUpdatedAt: new Date(),
        isOnline: true,
        lastSeenAt: new Date(),
      },
    });
  }

  /**
   * Update device diagnostics
   */
  async updateDeviceDiagnostics(
    imei: string,
    diagnostics: {
      batteryVoltage?: number;
      fuelLevelPercent?: number;
      fuelRange?: number;
      engineStatus?: string;
      checkEngineLight?: boolean;
      diagnosticCodes?: string[];
      odometerMiles?: number;
    }
  ): Promise<void> {
    await prisma.bouncieDevice.update({
      where: { imei },
      data: {
        ...diagnostics,
        diagnosticsUpdatedAt: new Date(),
      },
    });
  }

  /**
   * Increment driver behavior counters
   */
  async incrementBehaviorCounter(
    imei: string,
    counter: 'hardBraking' | 'rapidAccel' | 'speeding'
  ): Promise<void> {
    const updateField = {
      hardBraking: 'hardBrakingCount',
      rapidAccel: 'rapidAccelCount',
      speeding: 'speedingCount',
    }[counter];

    await prisma.bouncieDevice.update({
      where: { imei },
      data: {
        [updateField]: { increment: 1 },
        behaviorUpdatedAt: new Date(),
      },
    });
  }
}

// Export singleton instance
export const bouncieService = new BouncieService();

// Export types
export type { BouncieConfig, BouncieDevice };
