import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendSMS, sendTemplatedSMS, formatPhoneNumber } from '@/lib/services/sms';
import { NotificationType } from '@prisma/client';

/**
 * POST /api/v1/notifications/send
 * Send a notification (SMS, Email, Push)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, type, to, message, variables, tripId, userId } = body;

    // Validate required fields
    if (!channel || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: channel, to' },
        { status: 400 }
      );
    }

    // Currently only supporting SMS
    if (channel !== 'SMS') {
      return NextResponse.json(
        { error: 'Only SMS channel is currently supported' },
        { status: 400 }
      );
    }

    // Validate phone number
    const formattedPhone = formatPhoneNumber(to);
    if (formattedPhone.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    let result;

    if (type && variables) {
      // Send templated SMS
      if (!Object.values(NotificationType).includes(type)) {
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        );
      }

      result = await sendTemplatedSMS(
        type as NotificationType,
        to,
        variables,
        tripId,
        userId
      );
    } else if (message) {
      // Send custom message
      result = await sendSMS({
        to,
        message,
        tripId,
        userId,
        type: type || NotificationType.BOOKING_CONFIRMATION,
      });
    } else {
      return NextResponse.json(
        { error: 'Either message or (type + variables) must be provided' },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/notifications/send
 * Get notification logs
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};

    if (tripId) where.tripId = tripId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [logs, total] = await Promise.all([
      prisma.notificationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          trip: {
            select: {
              id: true,
              status: true,
              scheduledPickupTime: true,
            },
          },
        },
      }),
      prisma.notificationLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    );
  }
}
