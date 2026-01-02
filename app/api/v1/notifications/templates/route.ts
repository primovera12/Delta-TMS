import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { NotificationChannel, NotificationType } from '@prisma/client';

/**
 * GET /api/v1/notifications/templates
 * Get all notification templates
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel') as NotificationChannel | null;
    const type = searchParams.get('type') as NotificationType | null;

    const where: Record<string, unknown> = {};
    if (channel) where.channel = channel;
    if (type) where.type = type;

    const templates = await prisma.notificationTemplate.findMany({
      where,
      orderBy: [{ channel: 'asc' }, { type: 'asc' }],
    });

    // Group by channel for easier UI consumption
    const grouped = templates.reduce((acc, template) => {
      const channel = template.channel;
      if (!acc[channel]) acc[channel] = [];
      acc[channel].push(template);
      return acc;
    }, {} as Record<string, typeof templates>);

    return NextResponse.json({
      success: true,
      data: {
        templates,
        grouped,
      },
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: 'Failed to get templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/notifications/templates
 * Create or update a notification template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, channel, name, subject, body: templateBody, isActive } = body;

    // Validate required fields
    if (!type || !channel || !name || !templateBody) {
      return NextResponse.json(
        { error: 'Missing required fields: type, channel, name, body' },
        { status: 400 }
      );
    }

    // Validate enum values
    if (!Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    if (!Object.values(NotificationChannel).includes(channel)) {
      return NextResponse.json(
        { error: 'Invalid notification channel' },
        { status: 400 }
      );
    }

    // Upsert template (unique on type + channel)
    const template = await prisma.notificationTemplate.upsert({
      where: {
        type_channel: { type, channel },
      },
      update: {
        name,
        subject,
        body: templateBody,
        isActive: isActive ?? true,
      },
      create: {
        type,
        channel,
        name,
        subject,
        body: templateBody,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/notifications/templates
 * Delete a notification template
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    await prisma.notificationTemplate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Template deleted',
    });
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
