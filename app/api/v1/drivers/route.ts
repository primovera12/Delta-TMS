import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock drivers data
const drivers = [
  {
    id: 'DRV-001',
    userId: 'USR-003',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    licenseNumber: 'DL123456789',
    licenseExpiry: '2027-03-15',
    status: 'available',
    onlineStatus: 'online',
    vehicleId: 'VEH-001',
    currentLocation: {
      lat: 29.7604,
      lng: -95.3698,
      updatedAt: '2026-01-15T10:30:00Z',
    },
    stats: {
      totalTrips: 245,
      todayTrips: 5,
      rating: 4.8,
      onTimeRate: 96,
      completionRate: 99,
    },
    certifications: ['wheelchair', 'stretcher', 'oxygen'],
    createdAt: '2025-06-15T00:00:00Z',
  },
  {
    id: 'DRV-002',
    userId: 'USR-004',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '(555) 345-6789',
    licenseNumber: 'DL987654321',
    licenseExpiry: '2026-08-22',
    status: 'on-trip',
    onlineStatus: 'online',
    vehicleId: 'VEH-002',
    currentLocation: {
      lat: 29.7555,
      lng: -95.3555,
      updatedAt: '2026-01-15T10:35:00Z',
    },
    stats: {
      totalTrips: 312,
      todayTrips: 3,
      rating: 4.9,
      onTimeRate: 98,
      completionRate: 100,
    },
    certifications: ['wheelchair', 'stretcher', 'bariatric'],
    createdAt: '2025-07-10T00:00:00Z',
  },
  {
    id: 'DRV-003',
    userId: 'USR-006',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    phone: '(555) 456-7890',
    licenseNumber: 'DL456789123',
    licenseExpiry: '2027-11-05',
    status: 'available',
    onlineStatus: 'online',
    vehicleId: 'VEH-003',
    currentLocation: {
      lat: 29.7508,
      lng: -95.4608,
      updatedAt: '2026-01-15T10:28:00Z',
    },
    stats: {
      totalTrips: 198,
      todayTrips: 4,
      rating: 4.7,
      onTimeRate: 94,
      completionRate: 98,
    },
    certifications: ['wheelchair', 'oxygen'],
    createdAt: '2025-08-22T00:00:00Z',
  },
  {
    id: 'DRV-004',
    userId: 'USR-007',
    name: 'David Lee',
    email: 'david.lee@email.com',
    phone: '(555) 567-8901',
    licenseNumber: 'DL789123456',
    licenseExpiry: '2026-04-18',
    status: 'offline',
    onlineStatus: 'offline',
    vehicleId: null,
    currentLocation: null,
    stats: {
      totalTrips: 156,
      todayTrips: 0,
      rating: 4.6,
      onTimeRate: 92,
      completionRate: 97,
    },
    certifications: ['wheelchair'],
    createdAt: '2025-09-18T00:00:00Z',
  },
];

// GET /api/v1/drivers - List drivers
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const onlineStatus = searchParams.get('onlineStatus');
    const search = searchParams.get('search');
    const certification = searchParams.get('certification');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredDrivers = [...drivers];

    // Apply filters
    if (status) {
      filteredDrivers = filteredDrivers.filter((d) => d.status === status);
    }
    if (onlineStatus) {
      filteredDrivers = filteredDrivers.filter(
        (d) => d.onlineStatus === onlineStatus
      );
    }
    if (certification) {
      filteredDrivers = filteredDrivers.filter((d) =>
        d.certifications.includes(certification)
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDrivers = filteredDrivers.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          d.email.toLowerCase().includes(searchLower) ||
          d.phone.includes(search)
      );
    }

    // Pagination
    const total = filteredDrivers.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedDrivers = filteredDrivers.slice(start, end);

    return NextResponse.json({
      data: paginatedDrivers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/drivers - Create a new driver
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'licenseNumber', 'licenseExpiry'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newDriver = {
      id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
      userId: null,
      name: body.name,
      email: body.email,
      phone: body.phone,
      licenseNumber: body.licenseNumber,
      licenseExpiry: body.licenseExpiry,
      status: 'pending',
      onlineStatus: 'offline',
      vehicleId: null,
      currentLocation: null,
      stats: {
        totalTrips: 0,
        todayTrips: 0,
        rating: 0,
        onTimeRate: 0,
        completionRate: 0,
      },
      certifications: body.certifications || [],
      createdAt: new Date().toISOString(),
    };

    drivers.push(newDriver);

    return NextResponse.json({ data: newDriver }, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
