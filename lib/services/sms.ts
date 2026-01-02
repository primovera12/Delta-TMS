/**
 * SMS Service with Twilio Integration
 * Handles sending SMS notifications for trip updates, reminders, and alerts
 */

import { prisma } from '@/lib/db';
import { NotificationChannel, NotificationType, TripStatus } from '@prisma/client';

// Twilio SDK types (dynamic import for edge compatibility)
let twilioClient: TwilioClient | null = null;

interface TwilioClient {
  messages: {
    create: (params: {
      to: string;
      from: string;
      body: string;
      statusCallback?: string;
    }) => Promise<{ sid: string; status: string }>;
  };
}

interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  statusCallbackUrl?: string;
}

interface SendSMSParams {
  to: string;
  message: string;
  tripId?: string;
  userId?: string;
  type: NotificationType;
}

interface SendSMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// SMS Templates with placeholder variables
const SMS_TEMPLATES: Record<NotificationType, string> = {
  BOOKING_CONFIRMATION:
    'Your ride is confirmed for {date} at {time}. Pickup: {pickup}. Confirmation #: {tripId}. Reply HELP for assistance.',

  BOOKING_UPDATED:
    'Your ride #{tripId} has been updated. New time: {date} at {time}. Reply HELP for questions.',

  BOOKING_CANCELLED:
    'Your ride #{tripId} for {date} has been cancelled. Contact us if you have questions.',

  DRIVER_ASSIGNED:
    'Driver {driverName} has been assigned to your ride. Vehicle: {vehicleInfo}. They will arrive at {time}.',

  DRIVER_EN_ROUTE:
    'Your driver {driverName} is on the way! ETA: {eta} minutes. Track at: {trackingUrl}',

  DRIVER_ARRIVED:
    'Your driver has arrived at {location}. Please meet them at the pickup point.',

  TRIP_STARTED:
    'Your ride has started. Estimated arrival at destination: {eta}.',

  TRIP_COMPLETED:
    'Thank you for riding with us! Your trip is complete. Rate your driver: {ratingUrl}',

  REMINDER_24H:
    'Reminder: You have a ride scheduled tomorrow, {date} at {time}. Pickup: {pickup}. Reply C to confirm.',

  REMINDER_1H:
    'Reminder: Your ride is in 1 hour at {time}. Driver {driverName} will pick you up at {pickup}.',

  REMINDER_30M:
    'Your driver will arrive in approximately 30 minutes. Please be ready at {pickup}.',

  PAYMENT_RECEIVED:
    'Payment of ${amount} received for trip #{tripId}. Thank you!',

  PAYMENT_FAILED:
    'Payment failed for trip #{tripId}. Please update your payment method or contact us.',

  INVOICE_SENT:
    'Invoice #{invoiceNumber} for ${amount} has been sent. Due: {dueDate}. View: {invoiceUrl}',

  INVOICE_OVERDUE:
    'Invoice #{invoiceNumber} for ${amount} is overdue. Please make payment to avoid service interruption.',

  WILL_CALL_REMINDER:
    'Don\'t forget to call when ready for pickup. Call {dispatchNumber} or use the app.',

  STANDING_ORDER_CREATED:
    'Your recurring ride has been set up for {schedule}. First ride: {firstDate}. Manage at: {manageUrl}',

  DOCUMENT_EXPIRING:
    'Your {documentType} expires on {expiryDate}. Please update to avoid service interruption.',
};

/**
 * Initialize Twilio client
 */
async function getTwilioClient(): Promise<TwilioClient | null> {
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }

  try {
    // Dynamic import for edge runtime compatibility
    const twilio = await import('twilio');
    twilioClient = twilio.default(accountSid, authToken) as unknown as TwilioClient;
    return twilioClient;
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
    return null;
  }
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // If it's a 10-digit US number, add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  // If it already has country code
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }

  // Return with + prefix if not already present
  return phone.startsWith('+') ? phone : `+${cleaned}`;
}

/**
 * Replace template variables with actual values
 */
export function formatTemplate(template: string, variables: Record<string, string>): string {
  let message = template;

  for (const [key, value] of Object.entries(variables)) {
    message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return message;
}

/**
 * Get template for notification type
 */
export async function getTemplate(type: NotificationType): Promise<string> {
  // Try to get custom template from database
  const customTemplate = await prisma.notificationTemplate.findFirst({
    where: {
      type,
      channel: NotificationChannel.SMS,
      isActive: true,
    },
  });

  if (customTemplate) {
    return customTemplate.body;
  }

  // Fall back to default template
  return SMS_TEMPLATES[type] || 'You have a notification from Delta Transportation.';
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(params: SendSMSParams): Promise<SendSMSResult> {
  const { to, message, tripId, userId, type } = params;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!fromNumber) {
    console.error('TWILIO_PHONE_NUMBER not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  const formattedPhone = formatPhoneNumber(to);

  // Create notification log entry first
  const notificationLog = await prisma.notificationLog.create({
    data: {
      tripId,
      userId,
      recipientPhone: formattedPhone,
      channel: NotificationChannel.SMS,
      type,
      content: message,
      status: 'pending',
    },
  });

  try {
    const client = await getTwilioClient();

    if (!client) {
      // In development without Twilio, log and simulate success
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV SMS] To: ${formattedPhone}, Message: ${message}`);

        await prisma.notificationLog.update({
          where: { id: notificationLog.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
            twilioMessageSid: `dev_${Date.now()}`,
          },
        });

        return { success: true, messageId: `dev_${Date.now()}` };
      }

      await prisma.notificationLog.update({
        where: { id: notificationLog.id },
        data: {
          status: 'failed',
          failedAt: new Date(),
          errorMessage: 'Twilio client not initialized',
        },
      });

      return { success: false, error: 'SMS service not available' };
    }

    // Send via Twilio
    const result = await client.messages.create({
      to: formattedPhone,
      from: fromNumber,
      body: message,
      statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL,
    });

    // Update notification log with success
    await prisma.notificationLog.update({
      where: { id: notificationLog.id },
      data: {
        status: 'sent',
        sentAt: new Date(),
        twilioMessageSid: result.sid,
      },
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Update notification log with failure
    await prisma.notificationLog.update({
      where: { id: notificationLog.id },
      data: {
        status: 'failed',
        failedAt: new Date(),
        errorMessage,
      },
    });

    console.error('SMS send failed:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send notification using template
 */
export async function sendTemplatedSMS(
  type: NotificationType,
  to: string,
  variables: Record<string, string>,
  tripId?: string,
  userId?: string
): Promise<SendSMSResult> {
  const template = await getTemplate(type);
  const message = formatTemplate(template, variables);

  return sendSMS({
    to,
    message,
    tripId,
    userId,
    type,
  });
}

/**
 * Notification helpers for common trip events
 */
export const TripNotifications = {
  /**
   * Send booking confirmation
   */
  async sendBookingConfirmation(trip: {
    id: string;
    scheduledPickupTime: Date;
    pickupAddress: string;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
  }): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone) return null;

    return sendTemplatedSMS(
      NotificationType.BOOKING_CONFIRMATION,
      phone,
      {
        tripId: trip.id.substring(0, 8).toUpperCase(),
        date: trip.scheduledPickupTime.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        time: trip.scheduledPickupTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        }),
        pickup: trip.pickupAddress,
      },
      trip.id
    );
  },

  /**
   * Send driver assignment notification
   */
  async sendDriverAssigned(trip: {
    id: string;
    scheduledPickupTime: Date;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
    driver?: {
      user: { firstName: string; lastName: string }
    } | null;
    vehicle?: {
      make: string;
      model: string;
      color: string;
      licensePlate: string
    } | null;
  }): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone || !trip.driver) return null;

    const driverName = `${trip.driver.user.firstName} ${trip.driver.user.lastName.charAt(0)}.`;
    const vehicleInfo = trip.vehicle
      ? `${trip.vehicle.color} ${trip.vehicle.make} ${trip.vehicle.model} (${trip.vehicle.licensePlate})`
      : 'Details pending';

    return sendTemplatedSMS(
      NotificationType.DRIVER_ASSIGNED,
      phone,
      {
        driverName,
        vehicleInfo,
        time: trip.scheduledPickupTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        }),
      },
      trip.id
    );
  },

  /**
   * Send driver en route notification
   */
  async sendDriverEnRoute(trip: {
    id: string;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
    driver?: {
      user: { firstName: string }
    } | null;
  }, etaMinutes: number): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone) return null;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.deltatransport.com';
    const trackingUrl = `${baseUrl}/track/${trip.id}`;

    return sendTemplatedSMS(
      NotificationType.DRIVER_EN_ROUTE,
      phone,
      {
        driverName: trip.driver?.user.firstName || 'Your driver',
        eta: String(etaMinutes),
        trackingUrl,
      },
      trip.id
    );
  },

  /**
   * Send driver arrived notification
   */
  async sendDriverArrived(trip: {
    id: string;
    pickupAddress: string;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
  }): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone) return null;

    return sendTemplatedSMS(
      NotificationType.DRIVER_ARRIVED,
      phone,
      {
        location: trip.pickupAddress,
      },
      trip.id
    );
  },

  /**
   * Send trip completed notification
   */
  async sendTripCompleted(trip: {
    id: string;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
  }): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone) return null;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.deltatransport.com';
    const ratingUrl = `${baseUrl}/rate/${trip.id}`;

    return sendTemplatedSMS(
      NotificationType.TRIP_COMPLETED,
      phone,
      {
        ratingUrl,
      },
      trip.id
    );
  },

  /**
   * Send trip cancellation notification
   */
  async sendTripCancelled(trip: {
    id: string;
    scheduledPickupTime: Date;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
  }): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone) return null;

    return sendTemplatedSMS(
      NotificationType.BOOKING_CANCELLED,
      phone,
      {
        tripId: trip.id.substring(0, 8).toUpperCase(),
        date: trip.scheduledPickupTime.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
      },
      trip.id
    );
  },
};

/**
 * Driver notifications
 */
export const DriverNotifications = {
  /**
   * Notify driver of new assignment
   */
  async sendNewAssignment(
    driverPhone: string,
    trip: {
      id: string;
      scheduledPickupTime: Date;
      pickupAddress: string;
      dropoffAddress: string;
      patient?: { firstName: string; lastName: string } | null;
    }
  ): Promise<SendSMSResult> {
    const patientName = trip.patient
      ? `${trip.patient.firstName} ${trip.patient.lastName.charAt(0)}.`
      : 'Patient';

    return sendSMS({
      to: driverPhone,
      message: `New trip assigned: ${patientName} at ${trip.scheduledPickupTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })}. From: ${trip.pickupAddress.split(',')[0]}. Open app for details.`,
      tripId: trip.id,
      type: NotificationType.DRIVER_ASSIGNED,
    });
  },

  /**
   * Notify driver of trip cancellation
   */
  async sendTripCancelled(
    driverPhone: string,
    trip: {
      id: string;
      scheduledPickupTime: Date;
    }
  ): Promise<SendSMSResult> {
    return sendSMS({
      to: driverPhone,
      message: `Trip cancelled: Your ${trip.scheduledPickupTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })} trip has been cancelled. Check app for other assignments.`,
      tripId: trip.id,
      type: NotificationType.BOOKING_CANCELLED,
    });
  },
};

/**
 * Reminder service
 */
export const ReminderService = {
  /**
   * Send 24-hour reminder
   */
  async send24HourReminder(trip: {
    id: string;
    scheduledPickupTime: Date;
    pickupAddress: string;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
  }): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone) return null;

    return sendTemplatedSMS(
      NotificationType.REMINDER_24H,
      phone,
      {
        date: trip.scheduledPickupTime.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }),
        time: trip.scheduledPickupTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        }),
        pickup: trip.pickupAddress,
      },
      trip.id
    );
  },

  /**
   * Send 1-hour reminder
   */
  async send1HourReminder(trip: {
    id: string;
    scheduledPickupTime: Date;
    pickupAddress: string;
    patient?: { phone: string } | null;
    bookedByPhone?: string | null;
    driver?: { user: { firstName: string } } | null;
  }): Promise<SendSMSResult | null> {
    const phone = trip.patient?.phone || trip.bookedByPhone;
    if (!phone) return null;

    return sendTemplatedSMS(
      NotificationType.REMINDER_1H,
      phone,
      {
        time: trip.scheduledPickupTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        }),
        driverName: trip.driver?.user.firstName || 'Your driver',
        pickup: trip.pickupAddress,
      },
      trip.id
    );
  },
};

/**
 * Map trip status to notification type
 */
export function getNotificationTypeForStatus(status: TripStatus): NotificationType | null {
  const statusToNotification: Partial<Record<TripStatus, NotificationType>> = {
    [TripStatus.CONFIRMED]: NotificationType.BOOKING_CONFIRMATION,
    [TripStatus.ASSIGNED]: NotificationType.DRIVER_ASSIGNED,
    [TripStatus.DRIVER_EN_ROUTE]: NotificationType.DRIVER_EN_ROUTE,
    [TripStatus.DRIVER_ARRIVED]: NotificationType.DRIVER_ARRIVED,
    [TripStatus.IN_PROGRESS]: NotificationType.TRIP_STARTED,
    [TripStatus.COMPLETED]: NotificationType.TRIP_COMPLETED,
    [TripStatus.CANCELLED]: NotificationType.BOOKING_CANCELLED,
  };

  return statusToNotification[status] || null;
}
