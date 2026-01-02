/**
 * Live Tracking API
 *
 * Provides real-time location data for the live map using
 * the location resolver with Bouncie fallback support.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  getAllActiveDriverLocations,
  getTripLocation,
  type DriverLocationResult,
} from '@/lib/services/bouncie/location-resolver';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER'];

export interface LiveDriverData {
  id: string;
  name: string;
  status: string;
  location: {
    lat: number;
    lng: number;
    speed?: number | null;
    heading?: number | null;
  };
  locationSource: 'bouncie' | 'driver_phone' | 'last_known';
  isStale: boolean;
  updatedAt: string;
  currentTripId?: string;
  vehicleId?: string | null;
  vehiclePlate?: string;
  bouncieDeviceImei?: string | null;
}

export interface LiveTripData {
  id: string;
  tripNumber: string;
  status: string;
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoff: {
    lat: number;
    lng: number;
    address: string;
  };
  driverLocation?: {
    lat: number;
    lng: number;
    speed?: number | null;
    heading?: number | null;
  };
  locationSource?: 'bouncie' | 'driver_phone' | 'last_known';
  isStale?: boolean;
  driverName?: string;
  patientName?: string;
}

/**
 * GET /api/v1/live-tracking
 * Get real-time locations for all active drivers and trips
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all driver locations (using Bouncie where available)
    const driverLocations = await getAllActiveDriverLocations();

    // Build driver data with user info
    const driverIds = driverLocations.map((d) => d.driverId);
    const drivers = await prisma.driverProfile.findMany({
      where: { id: { in: driverIds } },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        vehicles: {
          where: { isActive: true },
          select: {
            id: true,
            licensePlate: true,
          },
          take: 1,
        },
      },
    });

    // Get active trips
    const activeTrips = await prisma.trip.findMany({
      where: {
        status: {
          in: ['ASSIGNED', 'DRIVER_EN_ROUTE', 'DRIVER_ARRIVED', 'IN_PROGRESS'],
        },
      },
      include: {
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        passengers: {
          where: { isPrimary: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    // Build response data
    const driverData: LiveDriverData[] = driverLocations.map((loc) => {
      const driver = drivers.find((d) => d.id === loc.driverId);
      const activeTrip = activeTrips.find((t) => t.driverId === loc.driverId);
      const vehicle = driver?.vehicles[0];

      return {
        id: loc.driverId,
        name: driver
          ? `${driver.user.firstName} ${driver.user.lastName}`
          : 'Unknown Driver',
        status: driver?.status || 'OFFLINE',
        location: {
          lat: loc.latitude,
          lng: loc.longitude,
          speed: loc.speed,
          heading: loc.heading,
        },
        locationSource: loc.source,
        isStale: loc.isStale,
        updatedAt: loc.updatedAt.toISOString(),
        currentTripId: activeTrip?.id,
        vehicleId: loc.vehicleId,
        vehiclePlate: vehicle?.licensePlate,
        bouncieDeviceImei: loc.bouncieDeviceImei,
      };
    });

    // Build trip data with locations
    const tripData: LiveTripData[] = await Promise.all(
      activeTrips.map(async (trip) => {
        const tripLocation = await getTripLocation(trip.id);
        const primaryPassenger = trip.passengers[0];

        return {
          id: trip.id,
          tripNumber: trip.tripNumber,
          status: trip.status,
          pickup: {
            lat: trip.pickupLatitude,
            lng: trip.pickupLongitude,
            address: `${trip.pickupAddressLine1}, ${trip.pickupCity}`,
          },
          dropoff: {
            lat: trip.dropoffLatitude,
            lng: trip.dropoffLongitude,
            address: `${trip.dropoffAddressLine1}, ${trip.dropoffCity}`,
          },
          driverLocation: tripLocation
            ? {
                lat: tripLocation.latitude,
                lng: tripLocation.longitude,
                speed: tripLocation.speed,
                heading: tripLocation.heading,
              }
            : undefined,
          locationSource: tripLocation?.source,
          isStale: tripLocation?.isStale,
          driverName: trip.driver
            ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}`
            : undefined,
          patientName: primaryPassenger?.user
            ? `${primaryPassenger.user.firstName} ${primaryPassenger.user.lastName}`
            : primaryPassenger
            ? `${primaryPassenger.firstName} ${primaryPassenger.lastName}`
            : undefined,
        };
      })
    );

    return NextResponse.json({
      drivers: driverData,
      trips: tripData,
      summary: {
        totalDrivers: driverData.length,
        availableDrivers: driverData.filter((d) => d.status === 'AVAILABLE')
          .length,
        onTripDrivers: driverData.filter((d) => d.status === 'ON_TRIP').length,
        activeTrips: tripData.length,
        bouncieLocations: driverData.filter(
          (d) => d.locationSource === 'bouncie'
        ).length,
        phoneLocations: driverData.filter(
          (d) => d.locationSource === 'driver_phone'
        ).length,
        staleLocations: driverData.filter((d) => d.isStale).length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching live tracking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live tracking data' },
      { status: 500 }
    );
  }
}
