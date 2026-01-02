/**
 * Bouncie Devices API
 *
 * GET - List all Bouncie devices
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'];

/**
 * GET /api/v1/admin/integrations/bouncie/devices
 * List all Bouncie devices with their linked vehicles
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

    const devices = await prisma.bouncieDevice.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            vehicleType: true,
          },
        },
      },
      orderBy: [
        { isOnline: 'desc' },
        { nickname: 'asc' },
      ],
    });

    // Get unlinked vehicles for potential linking
    const unlinkedVehicles = await prisma.vehicle.findMany({
      where: {
        isActive: true,
        bouncieDevice: null,
      },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        licensePlate: true,
        vehicleType: true,
      },
      orderBy: [
        { make: 'asc' },
        { model: 'asc' },
      ],
    });

    return NextResponse.json({
      devices: devices.map((device) => ({
        id: device.id,
        imei: device.imei,
        nickname: device.nickname,
        status: device.status,
        isOnline: device.isOnline,
        lastSeenAt: device.lastSeenAt,

        // Location
        latitude: device.latitude,
        longitude: device.longitude,
        speed: device.speed,
        heading: device.heading,
        locationUpdatedAt: device.locationUpdatedAt,

        // Vehicle info from OBD-II
        vin: device.vin,
        make: device.make,
        model: device.model,
        year: device.year,

        // Diagnostics
        batteryVoltage: device.batteryVoltage,
        fuelLevelPercent: device.fuelLevelPercent,
        fuelRange: device.fuelRange,
        checkEngineLight: device.checkEngineLight,
        diagnosticCodes: device.diagnosticCodes,
        odometerMiles: device.odometerMiles,

        // Behavior
        behaviorScore: device.behaviorScore,
        hardBrakingCount: device.hardBrakingCount,
        rapidAccelCount: device.rapidAccelCount,
        speedingCount: device.speedingCount,

        // Trip status
        isOnTrip: device.isOnTrip,
        currentTripStartedAt: device.currentTripStartedAt,

        // Linked vehicle
        vehicle: device.vehicle,
        vehicleId: device.vehicleId,

        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
      })),
      unlinkedVehicles,
    });
  } catch (error) {
    console.error('Error fetching Bouncie devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}
