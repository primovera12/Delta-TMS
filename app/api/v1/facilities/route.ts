import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FacilityBillingType } from '@prisma/client';

// GET /api/v1/facilities - List facilities
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (type) {
      where.type = type;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { addressLine1: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [facilities, total, tripCounts] = await Promise.all([
      prisma.facility.findMany({
        where,
        include: {
          staff: {
            take: 1,
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          _count: {
            select: {
              trips: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.facility.count({ where }),
      // Get summary stats
      prisma.facility.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    // Transform for frontend
    const transformedFacilities = facilities.map((facility) => {
      const primaryContact = facility.staff[0];
      return {
        id: facility.id,
        name: facility.name,
        type: facility.type,
        address: facility.addressLine1,
        addressLine2: facility.addressLine2,
        city: facility.city,
        state: facility.state,
        zip: facility.zipCode,
        contact: {
          name: primaryContact
            ? `${primaryContact.user.firstName} ${primaryContact.user.lastName}`
            : facility.billingContactName || '',
          email: primaryContact?.user.email || facility.email || '',
          phone: primaryContact?.user.phone || facility.phone || '',
        },
        billing: {
          email: facility.billingEmail || '',
          paymentTerms: `net${facility.paymentTermDays}`,
        },
        status: facility.isActive ? 'active' : 'inactive',
        tripCount: facility._count.trips,
        entranceInstructions: facility.entranceInstructions,
        parkingInstructions: facility.parkingInstructions,
        createdAt: facility.createdAt.toISOString(),
        updatedAt: facility.updatedAt.toISOString(),
      };
    });

    // Calculate summary
    const typeBreakdown: Record<string, number> = {};
    tripCounts.forEach((tc) => {
      typeBreakdown[tc.type] = tc._count;
    });

    const summary = {
      totalFacilities: total,
      activeFacilities: await prisma.facility.count({ where: { isActive: true } }),
      byType: typeBreakdown,
    };

    return NextResponse.json({
      success: true,
      data: transformedFacilities,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, {
      headers: {
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/facilities - Create a new facility
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      name,
      type,
      address,
      addressLine2,
      city,
      state,
      zip,
      phone,
      email,
      contact,
      billing,
      entranceInstructions,
      parkingInstructions,
    } = body;

    // Validate required fields
    if (!name || !type || !address || !city || !state || !zip || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, type, address, city, state, zip, phone',
      }, { status: 400 });
    }

    // Validate facility type
    const validTypes = ['hospital', 'dialysis_center', 'clinic', 'nursing_home', 'rehab', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid facility type. Must be one of: ${validTypes.join(', ')}`,
      }, { status: 400 });
    }

    const facility = await prisma.facility.create({
      data: {
        name,
        type,
        phone,
        email: email || null,
        addressLine1: address,
        addressLine2: addressLine2 || null,
        city,
        state,
        zipCode: zip,
        entranceInstructions: entranceInstructions || null,
        parkingInstructions: parkingInstructions || null,
        billingEmail: billing?.email || null,
        billingContactName: contact?.name || null,
        billingContactPhone: contact?.phone || null,
        paymentTermDays: billing?.paymentTerms === 'net15' ? 15 : 30,
        billingType: FacilityBillingType.PAY_PER_RIDE,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: facility.id,
        name: facility.name,
        type: facility.type,
        address: facility.addressLine1,
        city: facility.city,
        state: facility.state,
        zip: facility.zipCode,
        status: 'active',
        createdAt: facility.createdAt.toISOString(),
      },
      message: 'Facility created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create facility',
    }, { status: 500 });
  }
}
