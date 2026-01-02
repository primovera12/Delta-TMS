/**
 * Reminder Scheduler Service
 * Handles scheduling and sending trip reminders
 */

import { prisma } from '@/lib/db';
import { TripStatus } from '@prisma/client';
import { ReminderService, TripNotifications, DriverNotifications } from './sms';

interface ScheduledReminder {
  tripId: string;
  type: '24h' | '1h' | '30m';
  scheduledFor: Date;
}

/**
 * Get trips that need 24-hour reminders
 */
export async function getTripsFor24HourReminder(): Promise<
  Array<{
    id: string;
    scheduledPickupTime: Date;
    pickupAddress: string;
    passengers: Array<{
      isPrimary: boolean;
      user: { phone: string };
    }>;
  }>
> {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get trips scheduled for tomorrow that haven't been reminded yet
  const startOfTomorrow = new Date(tomorrow);
  startOfTomorrow.setHours(0, 0, 0, 0);

  const endOfTomorrow = new Date(tomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const trips = await prisma.trip.findMany({
    where: {
      scheduledPickupTime: {
        gte: startOfTomorrow,
        lte: endOfTomorrow,
      },
      status: {
        in: [TripStatus.CONFIRMED, TripStatus.ASSIGNED],
      },
      // Check if 24h reminder was already sent
      notificationLogs: {
        none: {
          type: 'REMINDER_24H',
        },
      },
    },
    include: {
      passengers: {
        where: { isPrimary: true },
        include: {
          user: {
            select: { phone: true },
          },
        },
      },
    },
  });

  return trips;
}

/**
 * Get trips that need 1-hour reminders
 */
export async function getTripsFor1HourReminder(): Promise<
  Array<{
    id: string;
    scheduledPickupTime: Date;
    pickupAddress: string;
    passengers: Array<{
      isPrimary: boolean;
      user: { phone: string };
    }>;
    driver?: {
      user: { firstName: string };
    } | null;
  }>
> {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const trips = await prisma.trip.findMany({
    where: {
      scheduledPickupTime: {
        gte: oneHourFromNow,
        lt: twoHoursFromNow,
      },
      status: {
        in: [TripStatus.CONFIRMED, TripStatus.ASSIGNED],
      },
      notificationLogs: {
        none: {
          type: 'REMINDER_1H',
        },
      },
    },
    include: {
      passengers: {
        where: { isPrimary: true },
        include: {
          user: {
            select: { phone: true },
          },
        },
      },
      driver: {
        include: {
          user: {
            select: { firstName: true },
          },
        },
      },
    },
  });

  return trips;
}

/**
 * Send all pending 24-hour reminders
 */
export async function send24HourReminders(): Promise<{
  sent: number;
  failed: number;
  errors: string[];
}> {
  const trips = await getTripsFor24HourReminder();
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const trip of trips) {
    const primaryPassenger = trip.passengers.find((p) => p.isPrimary);
    if (!primaryPassenger?.user.phone) continue;

    try {
      const result = await ReminderService.send24HourReminder({
        id: trip.id,
        scheduledPickupTime: trip.scheduledPickupTime,
        pickupAddress: trip.pickupAddress,
        patient: { phone: primaryPassenger.user.phone },
        bookedByPhone: null,
      });

      if (result?.success) {
        sent++;
      } else {
        failed++;
        errors.push(`Trip ${trip.id}: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      failed++;
      errors.push(`Trip ${trip.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { sent, failed, errors };
}

/**
 * Send all pending 1-hour reminders
 */
export async function send1HourReminders(): Promise<{
  sent: number;
  failed: number;
  errors: string[];
}> {
  const trips = await getTripsFor1HourReminder();
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const trip of trips) {
    const primaryPassenger = trip.passengers.find((p) => p.isPrimary);
    if (!primaryPassenger?.user.phone) continue;

    try {
      const result = await ReminderService.send1HourReminder({
        id: trip.id,
        scheduledPickupTime: trip.scheduledPickupTime,
        pickupAddress: trip.pickupAddress,
        patient: { phone: primaryPassenger.user.phone },
        bookedByPhone: null,
        driver: trip.driver,
      });

      if (result?.success) {
        sent++;
      } else {
        failed++;
        errors.push(`Trip ${trip.id}: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      failed++;
      errors.push(`Trip ${trip.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { sent, failed, errors };
}

/**
 * Notify drivers of upcoming trips
 */
export async function notifyDriversOfUpcomingTrips(): Promise<{
  sent: number;
  failed: number;
}> {
  const now = new Date();
  const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  // Get assigned trips starting in 30-60 minutes
  const trips = await prisma.trip.findMany({
    where: {
      scheduledPickupTime: {
        gte: thirtyMinutesFromNow,
        lt: oneHourFromNow,
      },
      status: TripStatus.ASSIGNED,
      driverId: { not: null },
    },
    include: {
      driver: {
        include: {
          user: {
            select: { phone: true },
          },
        },
      },
      passengers: {
        where: { isPrimary: true },
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });

  let sent = 0;
  let failed = 0;

  for (const trip of trips) {
    if (!trip.driver?.user.phone) continue;

    const patient = trip.passengers.find((p) => p.isPrimary)?.user;

    try {
      const result = await DriverNotifications.sendNewAssignment(trip.driver.user.phone, {
        id: trip.id,
        scheduledPickupTime: trip.scheduledPickupTime,
        pickupAddress: trip.pickupAddress,
        dropoffAddress: trip.dropoffAddress,
        patient: patient || null,
      });

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Get notification statistics for dashboard
 */
export async function getNotificationStats(
  startDate?: Date,
  endDate?: Date
): Promise<{
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  byType: Record<string, number>;
  byChannel: Record<string, number>;
}> {
  const where: Record<string, unknown> = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) (where.createdAt as Record<string, Date>).gte = startDate;
    if (endDate) (where.createdAt as Record<string, Date>).lte = endDate;
  }

  const [total, sent, delivered, failed, byType, byChannel] = await Promise.all([
    prisma.notificationLog.count({ where }),
    prisma.notificationLog.count({ where: { ...where, status: 'sent' } }),
    prisma.notificationLog.count({ where: { ...where, status: 'delivered' } }),
    prisma.notificationLog.count({ where: { ...where, status: 'failed' } }),
    prisma.notificationLog.groupBy({
      by: ['type'],
      where,
      _count: true,
    }),
    prisma.notificationLog.groupBy({
      by: ['channel'],
      where,
      _count: true,
    }),
  ]);

  return {
    total,
    sent,
    delivered,
    failed,
    byType: byType.reduce(
      (acc, item) => ({ ...acc, [item.type]: item._count }),
      {} as Record<string, number>
    ),
    byChannel: byChannel.reduce(
      (acc, item) => ({ ...acc, [item.channel]: item._count }),
      {} as Record<string, number>
    ),
  };
}
