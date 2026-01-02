import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock users data
const users = [
  {
    id: 'USR-001',
    email: 'admin@delta-tms.com',
    name: 'Emily Davis',
    phone: '(555) 456-7890',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-05T00:00:00Z',
    lastLogin: '2026-01-15T11:00:00Z',
  },
  {
    id: 'USR-002',
    email: 'dispatcher@delta-tms.com',
    name: 'Sarah Williams',
    phone: '(555) 234-5678',
    role: 'dispatcher',
    status: 'active',
    createdAt: '2025-08-22T00:00:00Z',
    lastLogin: '2026-01-15T09:45:00Z',
  },
  {
    id: 'USR-003',
    email: 'john.smith@email.com',
    name: 'John Smith',
    phone: '(555) 123-4567',
    role: 'driver',
    status: 'active',
    driverId: 'DRV-001',
    createdAt: '2025-06-15T00:00:00Z',
    lastLogin: '2026-01-15T10:30:00Z',
  },
  {
    id: 'USR-004',
    email: 'mike.johnson@email.com',
    name: 'Mike Johnson',
    phone: '(555) 345-6789',
    role: 'driver',
    status: 'active',
    driverId: 'DRV-002',
    createdAt: '2025-07-10T00:00:00Z',
    lastLogin: '2026-01-14T16:20:00Z',
  },
  {
    id: 'USR-005',
    email: 'facility@memorial.org',
    name: 'David Lee',
    phone: '(555) 678-9012',
    role: 'facility',
    status: 'active',
    facilityId: 'FAC-001',
    createdAt: '2025-11-05T00:00:00Z',
    lastLogin: '2026-01-15T08:30:00Z',
  },
];

// GET /api/v1/users - List users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredUsers = [...users];

    // Apply filters
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }
    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(search)
      );
    }

    // Pagination
    const total = filteredUsers.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = filteredUsers.slice(start, end);

    return NextResponse.json({
      data: paginatedUsers,
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

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['email', 'name', 'role'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check for existing email
    if (users.some((u) => u.email === body.email)) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'dispatcher', 'driver', 'facility', 'patient', 'family'];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      email: body.email,
      name: body.name,
      phone: body.phone || null,
      role: body.role,
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    users.push(newUser);

    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
