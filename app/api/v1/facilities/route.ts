import { NextRequest, NextResponse } from 'next/server';

// Mock facilities data
const facilities = [
  {
    id: 'FAC-001',
    name: 'Memorial Hospital',
    type: 'hospital',
    address: '1234 Medical Center Dr',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    contact: {
      name: 'Jane Wilson',
      email: 'scheduling@memorial.com',
      phone: '(555) 123-4567',
    },
    billing: {
      email: 'billing@memorial.com',
      paymentTerms: 'net30',
    },
    status: 'active',
    tripCount: 450,
    monthlyVolume: 45000,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'FAC-002',
    name: 'City Dialysis Center',
    type: 'dialysis',
    address: '789 Health Blvd',
    city: 'Houston',
    state: 'TX',
    zip: '77002',
    contact: {
      name: 'Mike Roberts',
      email: 'transport@citydialysis.com',
      phone: '(555) 234-5678',
    },
    billing: {
      email: 'accounts@citydialysis.com',
      paymentTerms: 'net15',
    },
    status: 'active',
    tripCount: 520,
    monthlyVolume: 38000,
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'FAC-003',
    name: 'Regional Medical Center',
    type: 'hospital',
    address: '567 Healthcare Way',
    city: 'Houston',
    state: 'TX',
    zip: '77003',
    contact: {
      name: 'Sarah Johnson',
      email: 'transport@rmc.com',
      phone: '(555) 345-6789',
    },
    billing: {
      email: 'billing@rmc.com',
      paymentTerms: 'net30',
    },
    status: 'active',
    tripCount: 280,
    monthlyVolume: 28000,
    createdAt: '2024-03-10T09:00:00Z',
  },
  {
    id: 'FAC-004',
    name: 'Heart Care Clinic',
    type: 'clinic',
    address: '890 Cardio Dr',
    city: 'Houston',
    state: 'TX',
    zip: '77004',
    contact: {
      name: 'Dr. Lisa Chen',
      email: 'admin@heartcare.com',
      phone: '(555) 456-7890',
    },
    billing: {
      email: 'billing@heartcare.com',
      paymentTerms: 'net15',
    },
    status: 'active',
    tripCount: 180,
    monthlyVolume: 15000,
    createdAt: '2024-04-05T11:00:00Z',
  },
  {
    id: 'FAC-005',
    name: 'Cancer Treatment Center',
    type: 'specialty',
    address: '567 Oncology Way',
    city: 'Houston',
    state: 'TX',
    zip: '77005',
    contact: {
      name: 'Tom Williams',
      email: 'scheduling@ctc.com',
      phone: '(555) 567-8901',
    },
    billing: {
      email: 'billing@ctc.com',
      paymentTerms: 'net30',
    },
    status: 'active',
    tripCount: 140,
    monthlyVolume: 18000,
    createdAt: '2024-05-12T15:30:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Filter parameters
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filteredFacilities = [...facilities];

  // Apply filters
  if (type) {
    filteredFacilities = filteredFacilities.filter((f) => f.type === type);
  }

  if (status) {
    filteredFacilities = filteredFacilities.filter((f) => f.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredFacilities = filteredFacilities.filter(
      (f) =>
        f.name.toLowerCase().includes(searchLower) ||
        f.address.toLowerCase().includes(searchLower) ||
        f.city.toLowerCase().includes(searchLower)
    );
  }

  // Calculate pagination
  const total = filteredFacilities.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedFacilities = filteredFacilities.slice(offset, offset + limit);

  // Summary stats
  const summary = {
    totalFacilities: facilities.length,
    activeFacilities: facilities.filter((f) => f.status === 'active').length,
    totalTrips: facilities.reduce((sum, f) => sum + f.tripCount, 0),
    totalMonthlyVolume: facilities.reduce((sum, f) => sum + f.monthlyVolume, 0),
    byType: {
      hospital: facilities.filter((f) => f.type === 'hospital').length,
      dialysis: facilities.filter((f) => f.type === 'dialysis').length,
      clinic: facilities.filter((f) => f.type === 'clinic').length,
      specialty: facilities.filter((f) => f.type === 'specialty').length,
    },
  };

  return NextResponse.json({
    success: true,
    data: paginatedFacilities,
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
      name,
      type,
      address,
      city,
      state,
      zip,
      contact,
      billing,
    } = body;

    // Validate required fields
    if (!name || !type || !address || !city || !state || !zip) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, type, address, city, state, zip',
        },
        { status: 400 }
      );
    }

    // Validate facility type
    const validTypes = ['hospital', 'dialysis', 'clinic', 'specialty', 'nursing_home', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid facility type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate facility ID
    const facilityId = `FAC-${String(facilities.length + 1).padStart(3, '0')}`;

    const newFacility = {
      id: facilityId,
      name,
      type,
      address,
      city,
      state,
      zip,
      contact: contact || {
        name: '',
        email: '',
        phone: '',
      },
      billing: billing || {
        email: '',
        paymentTerms: 'net30',
      },
      status: 'active',
      tripCount: 0,
      monthlyVolume: 0,
      createdAt: new Date().toISOString(),
    };

    // In real app, would save to database

    return NextResponse.json({
      success: true,
      data: newFacility,
      message: 'Facility created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create facility',
      },
      { status: 500 }
    );
  }
}
