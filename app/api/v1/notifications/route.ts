import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NotificationChannel } from '@prisma/client';

// GET /api/v1/notifications - List notifications
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: Record<string, unknown> = {
      userId,
    };

    if (category) {
      // Map category to notification types
      const categoryTypeMap: Record<string, string[]> = {
        trip: ['TRIP_SCHEDULED', 'TRIP_ASSIGNED', 'DRIVER_EN_ROUTE', 'DRIVER_ARRIVED', 'TRIP_STARTED', 'TRIP_COMPLETED', 'TRIP_CANCELLED', 'REMINDER_1H', 'REMINDER_30M'],
        billing: ['PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'INVOICE_SENT', 'INVOICE_OVERDUE'],
        compliance: ['DOCUMENT_EXPIRING', 'STANDING_ORDER_CREATED'],
        driver: ['DRIVER_EN_ROUTE', 'DRIVER_ARRIVED'],
      };
      if (categoryTypeMap[category]) {
        where.type = { in: categoryTypeMap[category] };
      }
    }

    if (type) {
      where.type = type;
    }

    const [notifications, total, allNotifications] = await Promise.all([
      prisma.notificationLog.findMany({
        where,
        orderBy: {
          sentAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notificationLog.count({ where }),
      // Get category breakdown
      prisma.notificationLog.groupBy({
        by: ['type'],
        where: { userId },
        _count: true,
      }),
    ]);

    // Transform for frontend
    const transformedNotifications = notifications.map((notification) => {
      // Determine category from type
      let notifCategory = 'system';
      const typeStr = notification.type as string;
      if (typeStr.includes('TRIP') || typeStr.includes('DRIVER') || typeStr.includes('REMINDER')) {
        notifCategory = 'trip';
      } else if (typeStr.includes('PAYMENT') || typeStr.includes('INVOICE')) {
        notifCategory = 'billing';
      } else if (typeStr.includes('DOCUMENT')) {
        notifCategory = 'compliance';
      }

      return {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        category: notifCategory,
        title: notification.subject || 'Notification',
        message: notification.content,
        read: notification.status === 'delivered',
        createdAt: notification.sentAt?.toISOString() || notification.createdAt?.toISOString(),
      };
    });

    // Build category breakdown
    const byCategory: Record<string, number> = {
      trip: 0,
      driver: 0,
      billing: 0,
      compliance: 0,
      system: 0,
    };

    allNotifications.forEach((item) => {
      const typeStr = item.type as string;
      if (typeStr.includes('TRIP') || typeStr.includes('REMINDER')) {
        byCategory.trip += item._count;
      } else if (typeStr.includes('DRIVER')) {
        byCategory.driver += item._count;
      } else if (typeStr.includes('PAYMENT') || typeStr.includes('INVOICE')) {
        byCategory.billing += item._count;
      } else if (typeStr.includes('DOCUMENT')) {
        byCategory.compliance += item._count;
      } else {
        byCategory.system += item._count;
      }
    });

    // Count undelivered as unread
    const unreadCount = await prisma.notificationLog.count({
      where: {
        userId,
        status: { not: 'delivered' },
      },
    });

    const summary = {
      total,
      unread: unreadCount,
      byCategory,
    };

    return NextResponse.json({
      success: true,
      data: transformedNotifications,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/notifications - Create a notification
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      userId,
      type,
      title,
      message,
      channel,
    } = body;

    // Validate required fields
    if (!userId || !type || !message) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userId, type, message',
      }, { status: 400 });
    }

    const notification = await prisma.notificationLog.create({
      data: {
        userId,
        type,
        channel: channel || NotificationChannel.IN_APP,
        subject: title || null,
        content: message,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.subject,
        message: notification.content,
        read: false,
        createdAt: notification.sentAt?.toISOString(),
      },
      message: 'Notification created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification',
    }, { status: 500 });
  }
}

// PATCH /api/v1/notifications - Mark notifications as read (delivered)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, notificationIds } = body;

    const targetUserId = userId || session.user.id;

    let result;
    if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Mark specific notifications as delivered
      result = await prisma.notificationLog.updateMany({
        where: {
          id: { in: notificationIds },
          userId: targetUserId,
        },
        data: {
          status: 'delivered',
          deliveredAt: new Date(),
        },
      });
    } else {
      // Mark all notifications as delivered
      result = await prisma.notificationLog.updateMany({
        where: {
          userId: targetUserId,
          status: { not: 'delivered' },
        },
        data: {
          status: 'delivered',
          deliveredAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `${result.count} notifications marked as read`,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update notifications',
    }, { status: 500 });
  }
}
