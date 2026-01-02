import { NextRequest, NextResponse } from 'next/server';

// Mock payments data
const payments = [
  {
    id: 'PAY-2026-0112',
    invoiceId: 'INV-2026-0105',
    facilityId: 'FAC-004',
    facilityName: 'Heart Care Clinic',
    amount: 2100.00,
    method: 'ach',
    reference: 'ACH-REF-12345',
    status: 'completed',
    processedAt: '2026-01-12T14:30:00Z',
    createdAt: '2026-01-12T14:30:00Z',
  },
  {
    id: 'PAY-2026-0110',
    invoiceId: 'INV-2026-0102',
    facilityId: 'FAC-001',
    facilityName: 'Memorial Hospital',
    amount: 5100.00,
    method: 'check',
    reference: 'CHK-45678',
    status: 'completed',
    processedAt: '2026-01-10T10:15:00Z',
    createdAt: '2026-01-10T10:15:00Z',
  },
  {
    id: 'PAY-2025-1228',
    invoiceId: 'INV-2025-1231',
    facilityId: 'FAC-002',
    facilityName: 'City Dialysis Center',
    amount: 9300.00,
    method: 'wire',
    reference: 'WIRE-REF-98765',
    status: 'completed',
    processedAt: '2025-12-28T09:00:00Z',
    createdAt: '2025-12-28T09:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Filter parameters
  const facilityId = searchParams.get('facilityId');
  const invoiceId = searchParams.get('invoiceId');
  const method = searchParams.get('method');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filteredPayments = [...payments];

  // Apply filters
  if (facilityId) {
    filteredPayments = filteredPayments.filter((p) => p.facilityId === facilityId);
  }

  if (invoiceId) {
    filteredPayments = filteredPayments.filter((p) => p.invoiceId === invoiceId);
  }

  if (method) {
    filteredPayments = filteredPayments.filter((p) => p.method === method);
  }

  if (status) {
    filteredPayments = filteredPayments.filter((p) => p.status === status);
  }

  if (startDate) {
    filteredPayments = filteredPayments.filter(
      (p) => new Date(p.processedAt) >= new Date(startDate)
    );
  }

  if (endDate) {
    filteredPayments = filteredPayments.filter(
      (p) => new Date(p.processedAt) <= new Date(endDate)
    );
  }

  // Calculate pagination
  const total = filteredPayments.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedPayments = filteredPayments.slice(offset, offset + limit);

  // Calculate summary
  const summary = {
    totalCollected: filteredPayments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: filteredPayments.filter((p) => p.status === 'pending').length,
    byMethod: {
      ach: filteredPayments
        .filter((p) => p.method === 'ach')
        .reduce((sum, p) => sum + p.amount, 0),
      check: filteredPayments
        .filter((p) => p.method === 'check')
        .reduce((sum, p) => sum + p.amount, 0),
      wire: filteredPayments
        .filter((p) => p.method === 'wire')
        .reduce((sum, p) => sum + p.amount, 0),
      card: filteredPayments
        .filter((p) => p.method === 'card')
        .reduce((sum, p) => sum + p.amount, 0),
    },
  };

  return NextResponse.json({
    success: true,
    data: paginatedPayments,
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
      invoiceId,
      amount,
      method,
      reference,
      notes,
    } = body;

    // Validate required fields
    if (!invoiceId || !amount || !method) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: invoiceId, amount, method',
        },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods = ['ach', 'check', 'wire', 'card', 'cash'];
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid payment method. Must be one of: ${validMethods.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate payment ID
    const today = new Date();
    const paymentId = `PAY-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const newPayment = {
      id: paymentId,
      invoiceId,
      facilityId: 'FAC-001', // Would be fetched from invoice
      facilityName: 'Mock Facility', // Would be fetched from facility
      amount,
      method,
      reference: reference || `${method.toUpperCase()}-${Date.now()}`,
      status: 'completed',
      notes,
      processedAt: today.toISOString(),
      createdAt: today.toISOString(),
    };

    // In real app, would:
    // 1. Save payment to database
    // 2. Update invoice status to 'paid'
    // 3. Send payment confirmation email
    // 4. Log activity

    return NextResponse.json({
      success: true,
      data: newPayment,
      message: 'Payment recorded successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record payment',
      },
      { status: 500 }
    );
  }
}
