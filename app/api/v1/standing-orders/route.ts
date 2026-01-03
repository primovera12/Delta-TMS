import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { VehicleType, DayOfWeek } from '@prisma/client';

// GET /api/v1/standing-orders - List standing orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    const facilityId = searchParams.get('facilityId');
    const frequency = searchParams.get('frequency');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (patientId) {
      where.patientUserId = patientId;
    }

    if (facilityId) {
      where.facilityId = facilityId;
    }

    if (frequency) {
      where.frequency = frequency;
    }

    const [orders, total, stats] = await Promise.all([
      prisma.standingOrder.findMany({
        where,
        include: {
          facility: {
            select: {
              id: true,
              name: true,
            },
          },
          facilityPatient: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.standingOrder.count({ where }),
      // Get frequency breakdown
      prisma.standingOrder.groupBy({
        by: ['frequency'],
        _count: true,
      }),
    ]);

    // Get status counts
    const [activeCount] = await Promise.all([
      prisma.standingOrder.count({ where: { isActive: true } }),
    ]);

    // Transform for frontend
    const transformedOrders = orders.map((order) => {
      const patient = order.facilityPatient;
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        patientId: order.patientUserId || patient?.userId,
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : 'Unknown',
        facilityId: order.facilityId,
        facilityName: order.facility?.name || null,
        vehicleType: order.vehicleType.toLowerCase().replace(/_/g, '-'),
        pickupAddress: `${order.pickupAddressLine1}, ${order.pickupCity}, ${order.pickupState} ${order.pickupZipCode}`,
        dropoffAddress: `${order.dropoffAddressLine1}, ${order.dropoffCity}, ${order.dropoffState} ${order.dropoffZipCode}`,
        frequency: order.frequency,
        daysOfWeek: order.daysOfWeek.map((d) => d.toLowerCase()),
        pickupTime: order.pickupTime,
        appointmentTime: order.appointmentTime,
        returnTrip: order.includeReturn,
        returnTime: order.returnTime,
        isWillCall: order.isReturnWillCall,
        specialInstructions: order.specialInstructions || '',
        status: order.isActive ? 'active' : 'inactive',
        startDate: order.startDate?.toISOString().split('T')[0] || null,
        endDate: order.endDate?.toISOString().split('T')[0] || null,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    });

    // Build frequency breakdown
    const frequencyBreakdown: Record<string, number> = {
      daily: 0,
      weekly: 0,
      biweekly: 0,
      monthly: 0,
    };
    stats.forEach((s) => {
      frequencyBreakdown[s.frequency] = s._count;
    });

    const summary = {
      totalOrders: total,
      activeOrders: activeCount,
      pausedOrders: 0, // No paused status in schema
      byFrequency: frequencyBreakdown,
    };

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching standing orders:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/standing-orders - Create a new standing order
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      patientId,
      facilityId,
      facilityPatientId,
      vehicleType,
      pickupAddress,
      pickupCity,
      pickupState,
      pickupZipCode,
      pickupLat,
      pickupLng,
      dropoffAddress,
      dropoffCity,
      dropoffState,
      dropoffZipCode,
      dropoffLat,
      dropoffLng,
      frequency,
      daysOfWeek,
      pickupTime,
      appointmentTime,
      returnTrip,
      returnTime,
      isWillCall,
      specialInstructions,
      startDate,
      endDate,
    } = body;

    // Validate required fields
    if (!pickupAddress || !dropoffAddress || !frequency || !daysOfWeek?.length || !pickupTime) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: pickupAddress, dropoffAddress, frequency, daysOfWeek, pickupTime',
      }, { status: 400 });
    }

    // Validate frequency
    const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly', 'custom'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json({
        success: false,
        error: `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}`,
      }, { status: 400 });
    }

    // Generate order number
    const count = await prisma.standingOrder.count();
    const orderNumber = `SO-${String(count + 1).padStart(5, '0')}`;

    // Convert days of week to enum
    const dayEnumMap: Record<string, DayOfWeek> = {
      sunday: DayOfWeek.SUNDAY,
      monday: DayOfWeek.MONDAY,
      tuesday: DayOfWeek.TUESDAY,
      wednesday: DayOfWeek.WEDNESDAY,
      thursday: DayOfWeek.THURSDAY,
      friday: DayOfWeek.FRIDAY,
      saturday: DayOfWeek.SATURDAY,
    };
    const daysEnum = daysOfWeek.map((d: string) => dayEnumMap[d.toLowerCase()]).filter(Boolean);

    const order = await prisma.standingOrder.create({
      data: {
        orderNumber,
        createdById: session.user.id,
        facilityId: facilityId || null,
        facilityPatientId: facilityPatientId || null,
        patientUserId: patientId || null,
        frequency,
        daysOfWeek: daysEnum,
        pickupTime,
        appointmentTime: appointmentTime || null,
        pickupAddressLine1: pickupAddress,
        pickupCity: pickupCity || 'Houston',
        pickupState: pickupState || 'TX',
        pickupZipCode: pickupZipCode || '77001',
        pickupLatitude: pickupLat || 0,
        pickupLongitude: pickupLng || 0,
        dropoffAddressLine1: dropoffAddress,
        dropoffCity: dropoffCity || 'Houston',
        dropoffState: dropoffState || 'TX',
        dropoffZipCode: dropoffZipCode || '77001',
        dropoffLatitude: dropoffLat || 0,
        dropoffLongitude: dropoffLng || 0,
        includeReturn: returnTrip || false,
        returnTime: returnTrip ? returnTime : null,
        isReturnWillCall: isWillCall || false,
        vehicleType: (vehicleType?.toUpperCase().replace(/-/g, '_') as VehicleType) || VehicleType.WHEELCHAIR_ACCESSIBLE,
        specialInstructions: specialInstructions || null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
      },
      include: {
        facility: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        facilityName: order.facility?.name || null,
        frequency: order.frequency,
        daysOfWeek: order.daysOfWeek.map((d) => d.toLowerCase()),
        pickupTime: order.pickupTime,
        status: 'active',
        createdAt: order.createdAt.toISOString(),
      },
      message: 'Standing order created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating standing order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create standing order',
    }, { status: 500 });
  }
}
