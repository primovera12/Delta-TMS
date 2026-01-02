import { NextRequest, NextResponse } from 'next/server';

// Mock notifications data
const notifications = [
  {
    id: 'NOT-001',
    userId: 'USR-001',
    type: 'trip_update',
    category: 'trip',
    title: 'Trip Running Late',
    message: 'Trip TR-20260115-012 is running 10 minutes late. ETA updated.',
    data: { tripId: 'TR-20260115-012', newEta: '10:40 AM' },
    read: false,
    actionUrl: '/dispatcher/trips/TR-20260115-012',
    createdAt: '2026-01-15T10:28:00Z',
  },
  {
    id: 'NOT-002',
    userId: 'USR-001',
    type: 'trip_completed',
    category: 'trip',
    title: 'Trip Completed',
    message: 'Trip TR-20260115-008 has been completed successfully.',
    data: { tripId: 'TR-20260115-008' },
    read: false,
    actionUrl: '/dispatcher/trips/TR-20260115-008',
    createdAt: '2026-01-15T10:15:00Z',
  },
  {
    id: 'NOT-003',
    userId: 'USR-001',
    type: 'driver_available',
    category: 'driver',
    title: 'Driver Now Available',
    message: 'John Smith has completed their trip and is now available.',
    data: { driverId: 'DRV-001', driverName: 'John Smith' },
    read: false,
    createdAt: '2026-01-15T10:10:00Z',
  },
  {
    id: 'NOT-004',
    userId: 'USR-001',
    type: 'invoice_overdue',
    category: 'billing',
    title: 'Invoice Overdue',
    message: 'Invoice INV-2026-0108 for Regional Medical Center is overdue.',
    data: { invoiceId: 'INV-2026-0108', amount: 3200 },
    read: true,
    actionUrl: '/admin/billing/INV-2026-0108',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'NOT-005',
    userId: 'USR-001',
    type: 'system',
    category: 'system',
    title: 'System Update',
    message: 'Scheduled maintenance tonight from 2 AM to 4 AM EST.',
    data: {},
    read: true,
    createdAt: '2026-01-15T07:00:00Z',
  },
  {
    id: 'NOT-006',
    userId: 'USR-001',
    type: 'document_expiring',
    category: 'compliance',
    title: 'Document Expiring Soon',
    message: 'Driver John Smith\'s insurance expires in 15 days.',
    data: { driverId: 'DRV-001', documentType: 'insurance', daysUntilExpiry: 15 },
    read: true,
    actionUrl: '/admin/drivers/DRV-001/documents',
    createdAt: '2026-01-14T14:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Filter parameters
  const userId = searchParams.get('userId');
  const category = searchParams.get('category');
  const read = searchParams.get('read');
  const type = searchParams.get('type');

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  let filteredNotifications = [...notifications];

  // Apply filters
  if (userId) {
    filteredNotifications = filteredNotifications.filter((n) => n.userId === userId);
  }

  if (category) {
    filteredNotifications = filteredNotifications.filter((n) => n.category === category);
  }

  if (read !== null && read !== undefined) {
    const isRead = read === 'true';
    filteredNotifications = filteredNotifications.filter((n) => n.read === isRead);
  }

  if (type) {
    filteredNotifications = filteredNotifications.filter((n) => n.type === type);
  }

  // Sort by createdAt descending (newest first)
  filteredNotifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate pagination
  const total = filteredNotifications.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);

  // Summary
  const summary = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    byCategory: {
      trip: notifications.filter((n) => n.category === 'trip').length,
      driver: notifications.filter((n) => n.category === 'driver').length,
      billing: notifications.filter((n) => n.category === 'billing').length,
      compliance: notifications.filter((n) => n.category === 'compliance').length,
      system: notifications.filter((n) => n.category === 'system').length,
    },
  };

  return NextResponse.json({
    success: true,
    data: paginatedNotifications,
    summary,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      type,
      category,
      title,
      message,
      data,
      actionUrl,
    } = body;

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, type, title, message',
        },
        { status: 400 }
      );
    }

    // Generate notification ID
    const notificationId = `NOT-${Date.now().toString(36).toUpperCase()}`;

    const newNotification = {
      id: notificationId,
      userId,
      type,
      category: category || 'system',
      title,
      message,
      data: data || {},
      read: false,
      actionUrl,
      createdAt: new Date().toISOString(),
    };

    // In real app, would:
    // 1. Save to database
    // 2. Send push notification if enabled
    // 3. Send email/SMS if configured

    return NextResponse.json({
      success: true,
      data: newNotification,
      message: 'Notification created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create notification',
      },
      { status: 500 }
    );
  }
}

// Mark all as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notificationIds } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // In real app, would update notifications in database
    const updatedCount = notificationIds?.length || notifications.filter((n) => n.userId === userId && !n.read).length;

    return NextResponse.json({
      success: true,
      message: `${updatedCount} notifications marked as read`,
      updatedCount,
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
