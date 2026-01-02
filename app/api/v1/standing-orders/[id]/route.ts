import { NextRequest, NextResponse } from 'next/server';

// Mock standing order detail data
const getStandingOrderById = (id: string) => ({
  id,
  patientId: 'PAT-001',
  patientName: 'John Smith',
  patientPhone: '(555) 123-4567',
  facilityId: 'FAC-002',
  facilityName: 'City Dialysis Center',
  facilityPhone: '(555) 234-5678',
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
  generatedTrips: [
    { id: 'TR-20260115-001', date: '2026-01-15', status: 'completed' },
    { id: 'TR-20260113-001', date: '2026-01-13', status: 'completed' },
    { id: 'TR-20260110-001', date: '2026-01-10', status: 'completed' },
    { id: 'TR-20260117-001', date: '2026-01-17', status: 'scheduled' },
    { id: 'TR-20260120-001', date: '2026-01-20', status: 'scheduled' },
  ],
  history: [
    { action: 'created', timestamp: '2025-12-15T10:00:00Z', user: 'Admin User' },
    { action: 'updated', timestamp: '2026-01-10T14:30:00Z', user: 'Dispatcher', changes: 'Updated pickup time' },
  ],
  createdAt: '2025-12-15T10:00:00Z',
  updatedAt: '2026-01-10T14:30:00Z',
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Standing order ID is required' },
      { status: 400 }
    );
  }

  const order = getStandingOrderById(id);

  return NextResponse.json({
    success: true,
    data: order,
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
        { success: false, error: 'Standing order ID is required' },
        { status: 400 }
      );
    }

    const { status, pausedReason, ...updates } = body;

    const order = getStandingOrderById(id);

    // Handle status changes
    let statusUpdate = {};
    if (status) {
      if (status === 'paused' && !pausedReason) {
        return NextResponse.json(
          { success: false, error: 'Paused reason is required when pausing an order' },
          { status: 400 }
        );
      }
      statusUpdate = {
        status,
        pausedReason: status === 'paused' ? pausedReason : null,
      };
    }

    const updatedOrder = {
      ...order,
      ...updates,
      ...statusUpdate,
      updatedAt: new Date().toISOString(),
      history: [
        ...order.history,
        {
          action: status ? `status changed to ${status}` : 'updated',
          timestamp: new Date().toISOString(),
          user: 'System',
          changes: Object.keys(updates).join(', '),
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Standing order updated successfully',
    });
  } catch (error) {
    console.error('Error updating standing order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update standing order' },
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
      { success: false, error: 'Standing order ID is required' },
      { status: 400 }
    );
  }

  // In real app, would:
  // 1. Cancel any future scheduled trips
  // 2. Mark standing order as cancelled
  // 3. Log the deletion

  return NextResponse.json({
    success: true,
    message: `Standing order ${id} cancelled successfully`,
  });
}
