import { NextRequest, NextResponse } from 'next/server';

// Mock facility detail data
const getFacilityById = (id: string) => ({
  id,
  name: 'Memorial Hospital',
  type: 'hospital',
  address: '1234 Medical Center Dr',
  city: 'Houston',
  state: 'TX',
  zip: '77001',
  coordinates: {
    lat: 29.7604,
    lng: -95.3698,
  },
  contact: {
    name: 'Jane Wilson',
    title: 'Transportation Coordinator',
    email: 'scheduling@memorial.com',
    phone: '(555) 123-4567',
  },
  billing: {
    email: 'billing@memorial.com',
    paymentTerms: 'net30',
    taxId: 'XX-XXXXXXX',
  },
  status: 'active',
  operatingHours: {
    monday: { open: '06:00', close: '22:00' },
    tuesday: { open: '06:00', close: '22:00' },
    wednesday: { open: '06:00', close: '22:00' },
    thursday: { open: '06:00', close: '22:00' },
    friday: { open: '06:00', close: '22:00' },
    saturday: { open: '08:00', close: '18:00' },
    sunday: { open: '08:00', close: '18:00' },
  },
  stats: {
    totalTrips: 450,
    thisMonth: 45,
    lastMonth: 52,
    avgTripsPerDay: 3.2,
    revenueThisMonth: 42500,
    outstandingBalance: 9350,
  },
  users: [
    { id: 'USR-001', name: 'Jane Wilson', email: 'jwilson@memorial.com', role: 'admin' },
    { id: 'USR-002', name: 'Tom Davis', email: 'tdavis@memorial.com', role: 'scheduler' },
  ],
  notes: 'Main entrance for patient pickup. Use emergency entrance for stretcher patients.',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2026-01-10T14:30:00Z',
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Facility ID is required' },
      { status: 400 }
    );
  }

  // In real app, would fetch from database
  const facility = getFacilityById(id);

  return NextResponse.json({
    success: true,
    data: facility,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Facility ID is required' },
        { status: 400 }
      );
    }

    // In real app, would update in database
    const facility = getFacilityById(id);

    const updatedFacility = {
      ...facility,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedFacility,
      message: 'Facility updated successfully',
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update facility' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Facility ID is required' },
      { status: 400 }
    );
  }

  // In real app, would check for active trips/invoices before deletion
  // and delete from database

  return NextResponse.json({
    success: true,
    message: `Facility ${id} deleted successfully`,
  });
}
