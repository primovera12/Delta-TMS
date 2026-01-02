import { NextRequest, NextResponse } from 'next/server';

// Mock invoice detail data
const getInvoiceById = (id: string) => ({
  id,
  facilityId: 'FAC-001',
  facility: {
    id: 'FAC-001',
    name: 'Memorial Hospital',
    address: '1234 Medical Center Dr',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    contact: 'Jane Wilson',
    email: 'billing@memorial.com',
    phone: '(555) 123-4567',
  },
  amount: 4250.00,
  subtotal: 4250.00,
  tax: 0,
  discount: 0,
  trips: [
    {
      id: 'TR-20260115-001',
      date: '2026-01-15',
      time: '10:30 AM',
      patient: 'John Smith',
      pickup: '123 Main St',
      dropoff: 'Memorial Hospital',
      vehicleType: 'Wheelchair',
      distance: 12.5,
      fare: 85.00,
    },
    {
      id: 'TR-20260114-045',
      date: '2026-01-14',
      time: '3:30 PM',
      patient: 'Susan Miller',
      pickup: '456 Oak Ave',
      dropoff: 'Memorial Hospital',
      vehicleType: 'Ambulatory',
      distance: 8.2,
      fare: 65.00,
    },
  ],
  period: { start: '2026-01-01', end: '2026-01-15' },
  issueDate: '2026-01-15',
  dueDate: '2026-01-30',
  status: 'pending',
  paymentTerms: 'net15',
  notes: 'Net 15 payment terms. Please reference invoice number on payment.',
  activity: [
    {
      action: 'created',
      timestamp: '2026-01-15T09:00:00Z',
      user: 'System',
    },
    {
      action: 'sent',
      timestamp: '2026-01-15T09:05:00Z',
      user: 'System',
      details: 'Sent to billing@memorial.com',
    },
  ],
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-01-15T09:05:00Z',
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Invoice ID is required' },
      { status: 400 }
    );
  }

  // In real app, would fetch from database
  const invoice = getInvoiceById(id);

  return NextResponse.json({
    success: true,
    data: invoice,
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
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const { status, notes, dueDate, paidDate, paymentMethod, paymentReference } = body;

    // In real app, would update in database
    const invoice = getInvoiceById(id);

    const updatedInvoice = {
      ...invoice,
      ...(status && { status }),
      ...(notes && { notes }),
      ...(dueDate && { dueDate }),
      ...(paidDate && { paidDate }),
      ...(paymentMethod && { paymentMethod }),
      ...(paymentReference && { paymentReference }),
      updatedAt: new Date().toISOString(),
    };

    // Add activity log entry
    if (status === 'paid') {
      updatedInvoice.activity = [
        ...invoice.activity,
        {
          action: 'paid',
          timestamp: new Date().toISOString(),
          user: 'Admin User',
          details: paymentMethod ? `Payment received via ${paymentMethod}` : 'Payment received',
        },
      ];
    }

    return NextResponse.json({
      success: true,
      data: updatedInvoice,
      message: 'Invoice updated successfully',
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
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
      { success: false, error: 'Invoice ID is required' },
      { status: 400 }
    );
  }

  // In real app, would check invoice status (can't delete paid invoices)
  // and delete from database

  return NextResponse.json({
    success: true,
    message: `Invoice ${id} deleted successfully`,
  });
}
