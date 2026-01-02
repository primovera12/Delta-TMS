import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock vehicles data
const vehicles = [
  {
    id: 'VEH-001',
    make: 'Toyota',
    model: 'Sienna',
    year: 2022,
    licensePlate: 'ABC-1234',
    vin: '1HGBH41JXMN109186',
    type: 'wheelchair',
    capacity: 2,
    status: 'active',
    assignedDriverId: 'DRV-001',
    assignedDriverName: 'John Smith',
    mileage: 45230,
    fuelType: 'gasoline',
    lastInspection: '2025-12-15',
    nextMaintenance: '2026-02-15',
    insuranceExpiry: '2026-06-30',
    registrationExpiry: '2026-04-15',
    features: ['wheelchair_ramp', 'oxygen_ready', 'gps'],
    currentLocation: {
      lat: 29.7604,
      lng: -95.3698,
      updatedAt: '2026-01-15T10:30:00Z',
    },
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'VEH-002',
    make: 'Ford',
    model: 'Transit',
    year: 2023,
    licensePlate: 'DEF-5678',
    vin: '2HGBH41JXMN109187',
    type: 'stretcher',
    capacity: 1,
    status: 'active',
    assignedDriverId: 'DRV-002',
    assignedDriverName: 'Mike Johnson',
    mileage: 28450,
    fuelType: 'gasoline',
    lastInspection: '2026-01-05',
    nextMaintenance: '2026-03-05',
    insuranceExpiry: '2026-08-15',
    registrationExpiry: '2026-05-20',
    features: ['stretcher_mount', 'medical_equipment', 'gps'],
    currentLocation: {
      lat: 29.7555,
      lng: -95.3555,
      updatedAt: '2026-01-15T10:35:00Z',
    },
    createdAt: '2024-09-15T00:00:00Z',
  },
  {
    id: 'VEH-003',
    make: 'Dodge',
    model: 'Grand Caravan',
    year: 2021,
    licensePlate: 'GHI-9012',
    vin: '3HGBH41JXMN109188',
    type: 'ambulatory',
    capacity: 4,
    status: 'maintenance',
    assignedDriverId: null,
    assignedDriverName: null,
    mileage: 62180,
    fuelType: 'gasoline',
    lastInspection: '2025-11-20',
    nextMaintenance: '2026-01-20',
    insuranceExpiry: '2026-05-10',
    registrationExpiry: '2026-03-25',
    features: ['gps'],
    currentLocation: null,
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'VEH-004',
    make: 'Toyota',
    model: 'Sienna',
    year: 2024,
    licensePlate: 'JKL-3456',
    vin: '4HGBH41JXMN109189',
    type: 'wheelchair',
    capacity: 2,
    status: 'active',
    assignedDriverId: 'DRV-003',
    assignedDriverName: 'Sarah Williams',
    mileage: 12450,
    fuelType: 'hybrid',
    lastInspection: '2026-01-10',
    nextMaintenance: '2026-04-10',
    insuranceExpiry: '2026-12-01',
    registrationExpiry: '2026-11-15',
    features: ['wheelchair_ramp', 'oxygen_ready', 'gps', 'backup_camera'],
    currentLocation: {
      lat: 29.7508,
      lng: -95.4608,
      updatedAt: '2026-01-15T10:28:00Z',
    },
    createdAt: '2024-11-01T00:00:00Z',
  },
  {
    id: 'VEH-005',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2022,
    licensePlate: 'MNO-7890',
    vin: '5HGBH41JXMN109190',
    type: 'bariatric',
    capacity: 1,
    status: 'inactive',
    assignedDriverId: null,
    assignedDriverName: null,
    mileage: 38920,
    fuelType: 'diesel',
    lastInspection: '2025-10-05',
    nextMaintenance: '2026-01-05',
    insuranceExpiry: '2026-04-20',
    registrationExpiry: '2026-02-28',
    features: ['bariatric_lift', 'reinforced_floor', 'gps'],
    currentLocation: null,
    createdAt: '2024-05-20T00:00:00Z',
  },
];

// GET /api/v1/vehicles - List vehicles
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const available = searchParams.get('available');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredVehicles = [...vehicles];

    // Apply filters
    if (type) {
      filteredVehicles = filteredVehicles.filter((v) => v.type === type);
    }
    if (status) {
      filteredVehicles = filteredVehicles.filter((v) => v.status === status);
    }
    if (available === 'true') {
      filteredVehicles = filteredVehicles.filter(
        (v) => v.status === 'active' && !v.assignedDriverId
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(
        (v) =>
          v.licensePlate.toLowerCase().includes(searchLower) ||
          v.make.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower) ||
          (v.assignedDriverName?.toLowerCase().includes(searchLower) ?? false)
      );
    }

    // Pagination
    const total = filteredVehicles.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedVehicles = filteredVehicles.slice(start, end);

    return NextResponse.json({
      data: paginatedVehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'licensePlate', 'vin', 'type'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate license plate or VIN
    if (vehicles.some((v) => v.licensePlate === body.licensePlate)) {
      return NextResponse.json(
        { error: 'License plate already exists' },
        { status: 400 }
      );
    }
    if (vehicles.some((v) => v.vin === body.vin)) {
      return NextResponse.json(
        { error: 'VIN already exists' },
        { status: 400 }
      );
    }

    const newVehicle = {
      id: `VEH-${String(vehicles.length + 1).padStart(3, '0')}`,
      make: body.make,
      model: body.model,
      year: body.year,
      licensePlate: body.licensePlate,
      vin: body.vin,
      type: body.type,
      capacity: body.capacity || 1,
      status: 'active',
      assignedDriverId: null,
      assignedDriverName: null,
      mileage: body.mileage || 0,
      fuelType: body.fuelType || 'gasoline',
      lastInspection: null,
      nextMaintenance: null,
      insuranceExpiry: body.insuranceExpiry || null,
      registrationExpiry: body.registrationExpiry || null,
      features: body.features || [],
      currentLocation: null,
      createdAt: new Date().toISOString(),
    };

    vehicles.push(newVehicle);

    return NextResponse.json({ data: newVehicle }, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
