/**
 * Driver Behavior Dashboard API
 *
 * Provides driver behavior data from Bouncie devices
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { bouncieService } from '@/lib/services/bouncie';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'];

/**
 * GET /api/v1/admin/fleet/behavior
 * Get driver behavior dashboard data
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

    // Check if driver behavior feature is enabled
    const behaviorEnabled = await bouncieService.isFeatureEnabled('driverBehavior');

    if (!behaviorEnabled) {
      return NextResponse.json({
        enabled: false,
        message: 'Bouncie driver behavior feature is not enabled',
      });
    }

    // Get all devices with their vehicles and drivers
    const devices = await prisma.bouncieDevice.findMany({
      where: {
        vehicleId: { not: null },
        vehicle: {
          isActive: true,
          driverId: { not: null },
        },
      },
      include: {
        vehicle: {
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
          },
        },
      },
    });

    // Calculate overall fleet behavior score
    const devicesWithScores = devices.filter((d) => d.behaviorScore !== null);
    const averageScore =
      devicesWithScores.length > 0
        ? devicesWithScores.reduce((sum, d) => sum + (d.behaviorScore ?? 0), 0) /
          devicesWithScores.length
        : null;

    // Total incidents
    const totalHardBrakes = devices.reduce((sum, d) => sum + d.hardBrakingCount, 0);
    const totalRapidAccels = devices.reduce((sum, d) => sum + d.rapidAccelCount, 0);
    const totalSpeedingEvents = devices.reduce((sum, d) => sum + d.speedingCount, 0);
    const totalIdleMinutes = devices.reduce((sum, d) => sum + d.idleTimeMinutes, 0);

    // Sort by behavior score (lowest first for improvement opportunities)
    const sortedByScore = [...devices].sort((a, b) => {
      if (a.behaviorScore === null) return 1;
      if (b.behaviorScore === null) return -1;
      return a.behaviorScore - b.behaviorScore;
    });

    // Get recent behavior events
    const recentEvents = await prisma.bouncieEvent.findMany({
      where: {
        eventType: {
          in: ['SPEEDING', 'HARD_BRAKE', 'RAPID_ACCEL'],
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        device: {
          include: {
            vehicle: {
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
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      enabled: true,
      summary: {
        averageFleetScore: averageScore ? Math.round(averageScore) : null,
        totalDrivers: devices.length,
        totalIncidents: totalHardBrakes + totalRapidAccels + totalSpeedingEvents,
        incidentBreakdown: {
          hardBrakes: totalHardBrakes,
          rapidAccelerations: totalRapidAccels,
          speedingEvents: totalSpeedingEvents,
          idleTimeMinutes: totalIdleMinutes,
        },
      },
      topPerformers: sortedByScore
        .filter((d) => d.behaviorScore !== null)
        .slice(-5)
        .reverse()
        .map((d) => ({
          driverId: d.vehicle?.driver?.id,
          driverName: d.vehicle?.driver
            ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
            : null,
          vehicleId: d.vehicle?.id,
          vehicle: d.vehicle
            ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
            : d.nickname,
          score: d.behaviorScore,
        })),
      needsImprovement: sortedByScore
        .filter((d) => d.behaviorScore !== null)
        .slice(0, 5)
        .map((d) => ({
          driverId: d.vehicle?.driver?.id,
          driverName: d.vehicle?.driver
            ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
            : null,
          vehicleId: d.vehicle?.id,
          vehicle: d.vehicle
            ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
            : d.nickname,
          score: d.behaviorScore,
          incidents: {
            hardBrakes: d.hardBrakingCount,
            rapidAccels: d.rapidAccelCount,
            speeding: d.speedingCount,
          },
        })),
      recentIncidents: recentEvents.map((e) => ({
        id: e.id,
        type: e.eventType,
        timestamp: e.createdAt,
        deviceImei: e.deviceImei,
        driverName: e.device.vehicle?.driver
          ? `${e.device.vehicle.driver.user.firstName} ${e.device.vehicle.driver.user.lastName}`
          : null,
        vehicle: e.device.vehicle
          ? `${e.device.vehicle.make} ${e.device.vehicle.model}`
          : e.device.nickname,
        location: e.latitude && e.longitude
          ? { lat: e.latitude, lng: e.longitude }
          : null,
        speed: e.speed,
      })),
      drivers: devices.map((d) => ({
        driverId: d.vehicle?.driver?.id,
        driverName: d.vehicle?.driver
          ? `${d.vehicle.driver.user.firstName} ${d.vehicle.driver.user.lastName}`
          : null,
        vehicleId: d.vehicle?.id,
        vehicle: d.vehicle
          ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}`
          : d.nickname,
        licensePlate: d.vehicle?.licensePlate,
        behaviorScore: d.behaviorScore,
        incidents: {
          hardBrakes: d.hardBrakingCount,
          rapidAccels: d.rapidAccelCount,
          speeding: d.speedingCount,
          idleMinutes: d.idleTimeMinutes,
        },
        lastUpdated: d.behaviorUpdatedAt,
        resetAt: d.behaviorResetAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching fleet behavior:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fleet behavior data' },
      { status: 500 }
    );
  }
}
