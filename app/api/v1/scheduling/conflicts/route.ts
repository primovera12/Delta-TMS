import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Conflict {
  id: string;
  type: 'trip_overlap' | 'shift_conflict' | 'driver_unavailable' | 'vehicle_conflict' | 'time_gap';
  severity: 'critical' | 'warning' | 'info';
  driverId: string;
  driverName: string;
  date: string;
  description: string;
  affectedItems: Array<{
    type: 'trip' | 'shift';
    id: string;
    startTime: string;
    endTime: string;
    details: string;
  }>;
  suggestedResolution: string;
}

/**
 * GET /api/v1/scheduling/conflicts
 * Detect scheduling conflicts for a given date range
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date().toISOString();
    const endDate = searchParams.get('endDate') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const driverId = searchParams.get('driverId');

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Build driver filter
    const driverWhere = driverId ? { id: driverId } : {};

    // Get all trips in the date range
    const trips = await prisma.trip.findMany({
      where: {
        scheduledPickupTime: {
          gte: start,
          lte: end,
        },
        driverId: driverId || undefined,
        status: {
          notIn: ['CANCELLED', 'COMPLETED'],
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
        pickupAddress: true,
        dropoffAddress: true,
      },
      orderBy: {
        scheduledPickupTime: 'asc',
      },
    });

    // Get all scheduled shifts in the date range
    const shifts = await prisma.scheduledShift.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        driverId: driverId || undefined,
        status: {
          notIn: ['cancelled'],
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
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get driver time off requests
    const timeOff = await prisma.driverTimeOff.findMany({
      where: {
        startDate: { lte: end },
        endDate: { gte: start },
        status: 'approved',
        driverId: driverId || undefined,
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
      },
    });

    const conflicts: Conflict[] = [];

    // Group trips by driver and date
    const tripsByDriverDate = new Map<string, typeof trips>();
    trips.forEach((trip) => {
      if (!trip.driverId) return;
      const dateKey = `${trip.driverId}_${new Date(trip.scheduledPickupTime).toDateString()}`;
      if (!tripsByDriverDate.has(dateKey)) {
        tripsByDriverDate.set(dateKey, []);
      }
      tripsByDriverDate.get(dateKey)!.push(trip);
    });

    // Check for trip overlaps
    tripsByDriverDate.forEach((driverTrips, key) => {
      for (let i = 0; i < driverTrips.length; i++) {
        for (let j = i + 1; j < driverTrips.length; j++) {
          const trip1 = driverTrips[i];
          const trip2 = driverTrips[j];

          const trip1Start = new Date(trip1.scheduledPickupTime);
          const trip1End = trip1.actualDropoffTime
            ? new Date(trip1.actualDropoffTime)
            : new Date(trip1Start.getTime() + (trip1.estimatedDuration || 60) * 60 * 1000);

          const trip2Start = new Date(trip2.scheduledPickupTime);
          const trip2End = trip2.actualDropoffTime
            ? new Date(trip2.actualDropoffTime)
            : new Date(trip2Start.getTime() + (trip2.estimatedDuration || 60) * 60 * 1000);

          // Check for overlap
          if (trip1Start < trip2End && trip1End > trip2Start) {
            const driverName = trip1.driver
              ? `${trip1.driver.user.firstName} ${trip1.driver.user.lastName}`
              : 'Unknown';

            conflicts.push({
              id: `conflict_${trip1.id}_${trip2.id}`,
              type: 'trip_overlap',
              severity: 'critical',
              driverId: trip1.driverId!,
              driverName,
              date: trip1Start.toISOString().split('T')[0],
              description: `Overlapping trips scheduled for ${driverName}`,
              affectedItems: [
                {
                  type: 'trip',
                  id: trip1.id,
                  startTime: trip1Start.toISOString(),
                  endTime: trip1End.toISOString(),
                  details: `Trip to ${trip1.dropoffAddress?.city || 'destination'}`,
                },
                {
                  type: 'trip',
                  id: trip2.id,
                  startTime: trip2Start.toISOString(),
                  endTime: trip2End.toISOString(),
                  details: `Trip to ${trip2.dropoffAddress?.city || 'destination'}`,
                },
              ],
              suggestedResolution: 'Reassign one trip to another available driver',
            });
          }

          // Check for insufficient gap between trips (less than 15 min)
          const gapMinutes = (trip2Start.getTime() - trip1End.getTime()) / (60 * 1000);
          if (gapMinutes > 0 && gapMinutes < 15) {
            const driverName = trip1.driver
              ? `${trip1.driver.user.firstName} ${trip1.driver.user.lastName}`
              : 'Unknown';

            conflicts.push({
              id: `gap_${trip1.id}_${trip2.id}`,
              type: 'time_gap',
              severity: 'warning',
              driverId: trip1.driverId!,
              driverName,
              date: trip1Start.toISOString().split('T')[0],
              description: `Only ${Math.round(gapMinutes)} min gap between trips for ${driverName}`,
              affectedItems: [
                {
                  type: 'trip',
                  id: trip1.id,
                  startTime: trip1Start.toISOString(),
                  endTime: trip1End.toISOString(),
                  details: `Trip ends at ${trip1End.toLocaleTimeString()}`,
                },
                {
                  type: 'trip',
                  id: trip2.id,
                  startTime: trip2Start.toISOString(),
                  endTime: trip2End.toISOString(),
                  details: `Trip starts at ${trip2Start.toLocaleTimeString()}`,
                },
              ],
              suggestedResolution: 'Adjust pickup time or reassign to ensure adequate travel time',
            });
          }
        }
      }
    });

    // Check for trips scheduled during driver time off
    timeOff.forEach((off) => {
      const driverTrips = trips.filter((t) => t.driverId === off.driverId);

      driverTrips.forEach((trip) => {
        const tripDate = new Date(trip.scheduledPickupTime);
        if (tripDate >= off.startDate && tripDate <= off.endDate) {
          const driverName = off.driver
            ? `${off.driver.user.firstName} ${off.driver.user.lastName}`
            : 'Unknown';

          conflicts.push({
            id: `unavailable_${trip.id}_${off.id}`,
            type: 'driver_unavailable',
            severity: 'critical',
            driverId: off.driverId,
            driverName,
            date: tripDate.toISOString().split('T')[0],
            description: `${driverName} has approved time off during scheduled trip`,
            affectedItems: [
              {
                type: 'trip',
                id: trip.id,
                startTime: trip.scheduledPickupTime.toISOString(),
                endTime: new Date(
                  trip.scheduledPickupTime.getTime() + (trip.estimatedDuration || 60) * 60 * 1000
                ).toISOString(),
                details: `Trip to ${trip.dropoffAddress?.city || 'destination'}`,
              },
            ],
            suggestedResolution: 'Reassign trip to an available driver',
          });
        }
      });
    });

    // Check for trips outside of scheduled shifts
    shifts.forEach((shift) => {
      const shiftDate = new Date(shift.date);
      const driverTrips = trips.filter((t) => {
        if (t.driverId !== shift.driverId) return false;
        const tripDate = new Date(t.scheduledPickupTime);
        return tripDate.toDateString() === shiftDate.toDateString();
      });

      driverTrips.forEach((trip) => {
        const tripTime = new Date(trip.scheduledPickupTime);
        const tripHour = tripTime.getHours();
        const tripMinute = tripTime.getMinutes();
        const tripTimeStr = `${tripHour.toString().padStart(2, '0')}:${tripMinute.toString().padStart(2, '0')}`;

        const [shiftStartHour, shiftStartMin] = shift.startTime.split(':').map(Number);
        const [shiftEndHour, shiftEndMin] = shift.endTime.split(':').map(Number);

        const tripMinutes = tripHour * 60 + tripMinute;
        const shiftStartMinutes = shiftStartHour * 60 + shiftStartMin;
        const shiftEndMinutes = shiftEndHour * 60 + shiftEndMin;

        if (tripMinutes < shiftStartMinutes || tripMinutes > shiftEndMinutes) {
          const driverName = shift.driver
            ? `${shift.driver.user.firstName} ${shift.driver.user.lastName}`
            : 'Unknown';

          conflicts.push({
            id: `shift_${trip.id}_${shift.id}`,
            type: 'shift_conflict',
            severity: 'warning',
            driverId: shift.driverId,
            driverName,
            date: shiftDate.toISOString().split('T')[0],
            description: `Trip scheduled outside of ${driverName}'s shift hours`,
            affectedItems: [
              {
                type: 'trip',
                id: trip.id,
                startTime: trip.scheduledPickupTime.toISOString(),
                endTime: new Date(
                  trip.scheduledPickupTime.getTime() + (trip.estimatedDuration || 60) * 60 * 1000
                ).toISOString(),
                details: `Trip at ${tripTimeStr}`,
              },
              {
                type: 'shift',
                id: shift.id,
                startTime: shift.startTime,
                endTime: shift.endTime,
                details: `Shift: ${shift.startTime} - ${shift.endTime}`,
              },
            ],
            suggestedResolution: 'Extend shift hours or reassign trip to another driver',
          });
        }
      });
    });

    // Sort conflicts by severity and date
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    conflicts.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Calculate stats
    const stats = {
      total: conflicts.length,
      critical: conflicts.filter((c) => c.severity === 'critical').length,
      warning: conflicts.filter((c) => c.severity === 'warning').length,
      info: conflicts.filter((c) => c.severity === 'info').length,
      byType: {
        trip_overlap: conflicts.filter((c) => c.type === 'trip_overlap').length,
        shift_conflict: conflicts.filter((c) => c.type === 'shift_conflict').length,
        driver_unavailable: conflicts.filter((c) => c.type === 'driver_unavailable').length,
        time_gap: conflicts.filter((c) => c.type === 'time_gap').length,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        conflicts,
        stats,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Get conflicts error:', error);
    return NextResponse.json(
      { error: 'Failed to detect conflicts' },
      { status: 500 }
    );
  }
}
