import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { VehicleType } from '@prisma/client';

// GET /api/v1/vehicles - List vehicles
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const available = searchParams.get('available');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status === 'active') {
      where.isActive = true;
      where.isInService = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    } else if (status === 'maintenance') {
      where.isInService = false;
      where.isActive = true;
    }

    if (type) {
      where.vehicleType = type.toUpperCase().replace(/-/g, '_') as VehicleType;
    }

    if (available === 'true') {
      where.driverId = null;
      where.isActive = true;
      where.isInService = true;
    }

    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { licensePlate: { contains: search, mode: 'insensitive' } },
        { vin: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    // Transform for frontend
    const transformedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      type: vehicle.vehicleType.toLowerCase().replace(/_/g, '-'),
      capacity: vehicle.seatingCapacity,
      wheelchairCapacity: vehicle.wheelchairCapacity,
      stretcherCapacity: vehicle.stretcherCapacity,
      status: vehicle.isActive && vehicle.isInService ? 'active' :
              !vehicle.isActive ? 'inactive' : 'maintenance',
      assignedDriverId: vehicle.driverId,
      assignedDriverName: vehicle.driver
        ? `${vehicle.driver.user.firstName} ${vehicle.driver.user.lastName}`
        : null,
      mileage: vehicle.currentMileage,
      lastInspection: vehicle.inspectionExpiry?.toISOString().split('T')[0] || null,
      nextMaintenance: vehicle.nextMaintenanceDue?.toISOString().split('T')[0] || null,
      insuranceExpiry: vehicle.insuranceExpiry.toISOString().split('T')[0],
      registrationExpiry: vehicle.registrationExpiry.toISOString().split('T')[0],
      features: [
        vehicle.wheelchairAccessible && 'wheelchair_accessible',
        vehicle.stretcherCapable && 'stretcher_capable',
        vehicle.oxygenEquipped && 'oxygen_equipped',
        vehicle.hasLift && 'lift',
        vehicle.hasRamp && 'ramp',
        vehicle.hasGPS && 'gps',
        vehicle.hasDashcam && 'dashcam',
      ].filter(Boolean),
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      data: transformedVehicles,
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
    const requiredFields = [
      'make', 'model', 'year', 'licensePlate', 'vin', 'vehicleType',
      'seatingCapacity', 'insuranceProvider', 'insurancePolicyNumber',
      'insuranceExpiry', 'registrationState', 'registrationExpiry', 'inspectionExpiry'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate license plate or VIN
    const existing = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { licensePlate: body.licensePlate },
          { vin: body.vin },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Vehicle with this license plate or VIN already exists' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        color: body.color || 'Unknown',
        licensePlate: body.licensePlate,
        vin: body.vin,
        vehicleType: body.vehicleType.toUpperCase().replace(/-/g, '_') as VehicleType,
        seatingCapacity: parseInt(body.seatingCapacity),
        wheelchairCapacity: parseInt(body.wheelchairCapacity) || 1,
        stretcherCapacity: parseInt(body.stretcherCapacity) || 0,
        maxWeightCapacity: body.maxWeightCapacity ? parseInt(body.maxWeightCapacity) : null,
        wheelchairAccessible: body.wheelchairAccessible ?? true,
        stretcherCapable: body.stretcherCapable ?? false,
        oxygenEquipped: body.oxygenEquipped ?? false,
        hasLift: body.hasLift ?? false,
        hasRamp: body.hasRamp ?? false,
        hasGPS: body.hasGPS ?? true,
        hasDashcam: body.hasDashcam ?? false,
        insuranceProvider: body.insuranceProvider,
        insurancePolicyNumber: body.insurancePolicyNumber,
        insuranceExpiry: new Date(body.insuranceExpiry),
        registrationState: body.registrationState,
        registrationExpiry: new Date(body.registrationExpiry),
        inspectionExpiry: new Date(body.inspectionExpiry),
        currentMileage: body.mileage ? parseInt(body.mileage) : null,
        notes: body.notes || null,
        isActive: true,
        isInService: true,
      },
    });

    return NextResponse.json({
      data: {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        type: vehicle.vehicleType.toLowerCase().replace(/_/g, '-'),
        status: 'active',
        createdAt: vehicle.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/vehicles - Bulk update vehicles
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleIds, update } = body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json(
        { error: 'vehicleIds array is required' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (update.isActive !== undefined) updateData.isActive = update.isActive;
    if (update.isInService !== undefined) updateData.isInService = update.isInService;
    if (update.driverId !== undefined) updateData.driverId = update.driverId;

    const result = await prisma.vehicle.updateMany({
      where: {
        id: { in: vehicleIds },
      },
      data: updateData,
    });

    return NextResponse.json({
      data: {
        updated: result.count,
      },
    });
  } catch (error) {
    console.error('Error updating vehicles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
