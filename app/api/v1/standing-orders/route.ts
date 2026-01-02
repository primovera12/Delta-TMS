import { NextRequest, NextResponse } from 'next/server';

// Mock standing orders data
const standingOrders = [
  {
    id: 'SO-001',
    patientId: 'PAT-001',
    patientName: 'John Smith',
    facilityId: 'FAC-002',
    facilityName: 'City Dialysis Center',
    vehicleType: 'wheelchair',
    pickupAddress: '123 Main St, Houston, TX 77001',
    dropoffAddress: '789 Health Blvd, Houston, TX 77002',
    frequency: 'weekly',
    daysOfWeek: ['monday', 'wednesday', 'friday'],
    pickupTime: '08:00',
    appointmentTime: '09:00',
    returnTrip: true,
    returnTime: '13:00',
    specialInstructions: 'Patient requires assistance with wheelchair',
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'SO-002',
    patientId: 'PAT-002',
    patientName: 'Mary Jones',
    facilityId: 'FAC-003',
    facilityName: 'Heart Care Clinic',
    vehicleType: 'ambulatory',
    pickupAddress: '456 Oak Ave, Houston, TX 77003',
    dropoffAddress: '890 Cardio Dr, Houston, TX 77004',
    frequency: 'biweekly',
    daysOfWeek: ['tuesday'],
    pickupTime: '10:00',
    appointmentTime: '11:00',
    returnTrip: true,
    returnTime: '14:00',
    specialInstructions: '',
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    createdAt: '2025-12-20T14:00:00Z',
    updatedAt: '2025-12-20T14:00:00Z',
  },
  {
    id: 'SO-003',
    patientId: 'PAT-003',
    patientName: 'Robert Brown',
    facilityId: 'FAC-005',
    facilityName: 'Cancer Treatment Center',
    vehicleType: 'stretcher',
    pickupAddress: '789 Pine Rd, Houston, TX 77005',
    dropoffAddress: '567 Oncology Way, Houston, TX 77006',
    frequency: 'weekly',
    daysOfWeek: ['thursday'],
    pickupTime: '07:30',
    appointmentTime: '08:30',
    returnTrip: true,
    returnTime: '12:00',
    specialInstructions: 'Patient on oxygen therapy',
    status: 'paused',
    pausedReason: 'Patient hospitalized',
    startDate: '2025-11-01',
    endDate: '2026-10-31',
    createdAt: '2025-10-25T09:00:00Z',
    updatedAt: '2026-01-05T11:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Filter parameters
  const status = searchParams.get('status');
  const patientId = searchParams.get('patientId');
  const facilityId = searchParams.get('facilityId');
  const frequency = searchParams.get('frequency');

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filteredOrders = [...standingOrders];

  // Apply filters
  if (status) {
    filteredOrders = filteredOrders.filter((order) => order.status === status);
  }

  if (patientId) {
    filteredOrders = filteredOrders.filter((order) => order.patientId === patientId);
  }

  if (facilityId) {
    filteredOrders = filteredOrders.filter((order) => order.facilityId === facilityId);
  }

  if (frequency) {
    filteredOrders = filteredOrders.filter((order) => order.frequency === frequency);
  }

  // Calculate pagination
  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedOrders = filteredOrders.slice(offset, offset + limit);

  // Summary stats
  const summary = {
    totalOrders: standingOrders.length,
    activeOrders: standingOrders.filter((o) => o.status === 'active').length,
    pausedOrders: standingOrders.filter((o) => o.status === 'paused').length,
    byFrequency: {
      daily: standingOrders.filter((o) => o.frequency === 'daily').length,
      weekly: standingOrders.filter((o) => o.frequency === 'weekly').length,
      biweekly: standingOrders.filter((o) => o.frequency === 'biweekly').length,
      monthly: standingOrders.filter((o) => o.frequency === 'monthly').length,
    },
  };

  return NextResponse.json({
    success: true,
    data: paginatedOrders,
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
      patientId,
      patientName,
      facilityId,
      facilityName,
      vehicleType,
      pickupAddress,
      dropoffAddress,
      frequency,
      daysOfWeek,
      pickupTime,
      appointmentTime,
      returnTrip,
      returnTime,
      specialInstructions,
      startDate,
      endDate,
    } = body;

    // Validate required fields
    if (!patientId || !facilityId || !pickupAddress || !dropoffAddress || !frequency || !daysOfWeek?.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Validate frequency
    const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate standing order ID
    const orderId = `SO-${String(standingOrders.length + 1).padStart(3, '0')}`;

    const newOrder = {
      id: orderId,
      patientId,
      patientName: patientName || 'Unknown Patient',
      facilityId,
      facilityName: facilityName || 'Unknown Facility',
      vehicleType: vehicleType || 'ambulatory',
      pickupAddress,
      dropoffAddress,
      frequency,
      daysOfWeek,
      pickupTime,
      appointmentTime,
      returnTrip: returnTrip || false,
      returnTime: returnTrip ? returnTime : null,
      specialInstructions: specialInstructions || '',
      status: 'active',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In real app, would save to database

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Standing order created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating standing order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create standing order',
      },
      { status: 500 }
    );
  }
}
