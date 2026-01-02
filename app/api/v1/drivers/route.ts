import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/v1/drivers - List drivers
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, unknown> = {};

    // Handle status filter
    // "active" means all non-offline statuses
    if (status === 'active') {
      where.status = {
        in: ['ONLINE', 'AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ON_TRIP', 'BREAK'],
      };
    } else if (status) {
      where.status = status.toUpperCase();
    }

    // Handle search filter
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search } } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [drivers, total] = await Promise.all([
      prisma.driverProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: [
          { user: { lastName: 'asc' } },
          { user: { firstName: 'asc' } },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.driverProfile.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          drivers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      {
        headers: {
          // Cache for 60 seconds since driver status can change frequently
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/drivers - Create a new driver
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'licenseNumber', 'licenseState', 'licenseExpiry'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // First, create the user with a temporary password (to be changed on first login)
    const bcrypt = await import('bcryptjs');
    const tempPasswordHash = await bcrypt.hash('TempPassword123!', 10);

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        passwordHash: tempPasswordHash,
        role: 'DRIVER',
        status: 'ACTIVE',
      },
    });

    // Then create the driver profile
    const driver = await prisma.driverProfile.create({
      data: {
        userId: user.id,
        licenseNumber: body.licenseNumber,
        licenseState: body.licenseState,
        licenseExpiry: new Date(body.licenseExpiry),
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        status: 'OFFLINE',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: driver }, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
