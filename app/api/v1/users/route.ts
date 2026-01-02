import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Map frontend role names to database enum values
const roleMap: Record<string, UserRole> = {
  admin: 'ADMIN',
  dispatcher: 'DISPATCHER',
  driver: 'DRIVER',
  facility: 'FACILITY_STAFF',
  patient: 'PATIENT',
  family: 'FAMILY_MEMBER',
};

// Reverse map for response formatting
const reverseRoleMap: Record<UserRole, string> = {
  SUPER_ADMIN: 'admin',
  ADMIN: 'admin',
  OPERATIONS_MANAGER: 'admin',
  DISPATCHER: 'dispatcher',
  DRIVER: 'driver',
  FACILITY_STAFF: 'facility',
  PATIENT: 'patient',
  FAMILY_MEMBER: 'family',
};

// GET /api/v1/users - List users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and dispatchers can list users
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'];
    if (!allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    // Role filter
    if (role && role !== 'all') {
      const dbRole = roleMap[role];
      if (dbRole) {
        where.role = dbRole;
      }
    }

    // Status filter
    if (status && status !== 'all') {
      const statusMap: Record<string, UserStatus> = {
        active: 'ACTIVE',
        inactive: 'INACTIVE',
        suspended: 'SUSPENDED',
        pending: 'PENDING_VERIFICATION',
      };
      if (statusMap[status]) {
        where.status = statusMap[status];
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get paginated users
    const users = await prisma.user.findMany({
      where,
      include: {
        driverProfile: {
          select: { id: true },
        },
        facilityStaff: {
          select: { facilityId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: reverseRoleMap[user.role] || user.role.toLowerCase(),
      status: user.status.toLowerCase().replace('_verification', ''),
      driverId: user.driverProfile?.id || null,
      facilityId: user.facilityStaff?.facilityId || null,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLoginAt?.toISOString() || null,
    }));

    return NextResponse.json({
      data: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create users
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'];
    if (!allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['email', 'role'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Parse name into firstName and lastName
    let firstName = body.firstName || '';
    let lastName = body.lastName || '';
    if (body.name && !firstName && !lastName) {
      const nameParts = body.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    if (!firstName) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Check if phone already exists (if provided)
    if (body.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: body.phone },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: 'A user with this phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Validate role
    const validRoles = ['admin', 'dispatcher', 'driver', 'facility', 'patient', 'family'];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Map role to database enum
    const dbRole = roleMap[body.role];

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        phone: body.phone || `temp-${Date.now()}`, // Phone is required in schema
        firstName,
        lastName: lastName || firstName, // Use firstName as lastName if not provided
        passwordHash,
        role: dbRole,
        status: 'PENDING_VERIFICATION',
      },
    });

    // Create driver profile if role is driver
    if (body.role === 'driver') {
      await prisma.driverProfile.create({
        data: {
          userId: newUser.id,
          licenseNumber: `TEMP-${Date.now()}`, // Temporary, to be updated later
          licenseState: 'TX',
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        },
      });
    }

    // Format response
    const formattedUser = {
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: body.role,
      status: 'pending',
      createdAt: newUser.createdAt.toISOString(),
      lastLogin: null,
    };

    return NextResponse.json({ data: formattedUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
