/**
 * Fleet Health Dashboard API
 *
 * Provides vehicle diagnostics from Bouncie devices
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { bouncieService } from '@/lib/services/bouncie';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'];

/**
 * GET /api/v1/admin/fleet/health
 * Get fleet health dashboard data
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

    // Check if diagnostics feature is enabled
    const diagnosticsEnabled = await bouncieService.isFeatureEnabled('diagnostics');

    if (!diagnosticsEnabled) {
      return NextResponse.json({
        enabled: false,
        message: 'Bouncie diagnostics feature is not enabled',
      });
    }

    // Get all devices with their vehicles
    const devices = await prisma.bouncieDevice.findMany({
      where: {
        vehicleId: { not: null },
      },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            vehicleType: true,
            isActive: true,
            driver: {
              select: {
                id: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Categorize vehicles by health status
    const checkEngineLightVehicles = devices.filter(
      (d) => d.checkEngineLight && d.vehicle?.isActive
    );
    const lowBatteryVehicles = devices.filter(
      (d) => d.batteryVoltage !== null && d.batteryVoltage < 11.8 && d.vehicle?.isActive
    );
    const lowFuelVehicles = devices.filter(
      (d) => d.fuelLevelPercent !== null && d.fuelLevelPercent < 20 && d.vehicle?.isActive
    );
    const offlineDevices = devices.filter(
      (d) => !d.isOnline && d.vehicle?.isActive
    );

    // Calculate summary stats
    const totalVehicles = devices.filter((d) => d.vehicle?.isActive).length;
    const healthyVehicles = devices.filter(
      (d) =>
        d.vehicle?.isActive &&
        !d.checkEngineLight &&
        (d.batteryVoltage === null || d.batteryVoltage >= 11.8) &&
        (d.fuelLevelPercent === null || d.fuelLevelPercent >= 20)
    ).length;

    return NextResponse.json({
      enabled: true,
      summary: {
        totalVehicles,
        healthyVehicles,
        issueCount:
          checkEngineLightVehicles.length +
          lowBatteryVehicles.length +
          lowFuelVehicles.length,
        offlineCount: offlineDevices.length,
      },
      alerts: {
        checkEngineLight: checkEngineLightVehicles.map((d) => ({
          deviceImei: d.imei,
          vehicleId: d.vehicle?.id,
          vehicle: d.vehicle
            ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
            : d.nickname,
          licensePlate: d.vehicle?.licensePlate,
          diagnosticCodes: d.diagnosticCodes,
          driverName: d.vehicle?.driver
            ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
            : null,
        })),
        lowBattery: lowBatteryVehicles.map((d) => ({
          deviceImei: d.imei,
          vehicleId: d.vehicle?.id,
          vehicle: d.vehicle
            ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
            : d.nickname,
          licensePlate: d.vehicle?.licensePlate,
          voltage: d.batteryVoltage,
          driverName: d.vehicle?.driver
            ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
            : null,
        })),
        lowFuel: lowFuelVehicles.map((d) => ({
          deviceImei: d.imei,
          vehicleId: d.vehicle?.id,
          vehicle: d.vehicle
            ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
            : d.nickname,
          licensePlate: d.vehicle?.licensePlate,
          fuelLevel: d.fuelLevelPercent,
          fuelRange: d.fuelRange,
          driverName: d.vehicle?.driver
            ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
            : null,
        })),
        offline: offlineDevices.map((d) => ({
          deviceImei: d.imei,
          vehicleId: d.vehicle?.id,
          vehicle: d.vehicle
            ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
            : d.nickname,
          licensePlate: d.vehicle?.licensePlate,
          lastSeenAt: d.lastSeenAt,
          driverName: d.vehicle?.driver
            ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
            : null,
        })),
      },
      vehicles: devices
        .filter((d) => d.vehicle?.isActive)
        .map((d) => ({
          deviceImei: d.imei,
          vehicleId: d.vehicle?.id,
          vehicle: d.vehicle
            ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
            : d.nickname,
          licensePlate: d.vehicle?.licensePlate,
          vehicleType: d.vehicle?.vehicleType,
          isOnline: d.isOnline,
          lastSeenAt: d.lastSeenAt,
          diagnostics: {
            batteryVoltage: d.batteryVoltage,
            fuelLevelPercent: d.fuelLevelPercent,
            fuelRange: d.fuelRange,
            odometerMiles: d.odometerMiles,
            checkEngineLight: d.checkEngineLight,
            diagnosticCodes: d.diagnosticCodes,
            engineStatus: d.engineStatus,
            lastUpdated: d.diagnosticsUpdatedAt,
          },
          driverName: d.vehicle?.driver
            ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
            : null,
        })),
    });
  } catch (error) {
    console.error('Error fetching fleet health:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fleet health data' },
      { status: 500 }
    );
  }
}
