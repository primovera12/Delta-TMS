import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock invoices data
const invoices = [
  {
    id: 'INV-2026-0115',
    facilityId: 'FAC-001',
    facilityName: 'Memorial Hospital',
    amount: 4250.00,
    trips: 45,
    period: { start: '2026-01-01', end: '2026-01-15' },
    issueDate: '2026-01-15',
    dueDate: '2026-01-30',
    status: 'pending',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'INV-2026-0114',
    facilityId: 'FAC-002',
    facilityName: 'City Dialysis Center',
    amount: 8750.00,
    trips: 120,
    period: { start: '2026-01-01', end: '2026-01-15' },
    issueDate: '2026-01-15',
    dueDate: '2026-01-30',
    status: 'pending',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'INV-2026-0108',
    facilityId: 'FAC-003',
    facilityName: 'Regional Medical Center',
    amount: 3200.00,
    trips: 38,
    period: { start: '2025-12-16', end: '2025-12-31' },
    issueDate: '2026-01-01',
    dueDate: '2026-01-15',
    status: 'overdue',
    createdAt: '2026-01-01T09:00:00Z',
    updatedAt: '2026-01-16T09:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  // Authentication check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Authorization - only allow admin, operations, and billing roles
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'BILLING'];
  if (!allowedRoles.includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);

  // Filter parameters
  const status = searchParams.get('status');
  const facilityId = searchParams.get('facilityId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filteredInvoices = [...invoices];

  // Apply filters
  if (status) {
    filteredInvoices = filteredInvoices.filter((invoice) => invoice.status === status);
  }

  if (facilityId) {
    filteredInvoices = filteredInvoices.filter((invoice) => invoice.facilityId === facilityId);
  }

  if (startDate) {
    filteredInvoices = filteredInvoices.filter(
      (invoice) => new Date(invoice.issueDate) >= new Date(startDate)
    );
  }

  if (endDate) {
    filteredInvoices = filteredInvoices.filter(
      (invoice) => new Date(invoice.issueDate) <= new Date(endDate)
    );
  }

  // Calculate pagination
  const total = filteredInvoices.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedInvoices = filteredInvoices.slice(offset, offset + limit);

  // Calculate summary stats
  const summary = {
    totalOutstanding: filteredInvoices
      .filter((i) => i.status !== 'paid')
      .reduce((sum, i) => sum + i.amount, 0),
    totalOverdue: filteredInvoices
      .filter((i) => i.status === 'overdue')
      .reduce((sum, i) => sum + i.amount, 0),
    totalPending: filteredInvoices.filter((i) => i.status === 'pending').length,
    totalOverdueCount: filteredInvoices.filter((i) => i.status === 'overdue').length,
  };

  return NextResponse.json({
    success: true,
    data: paginatedInvoices,
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
  // Authentication check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Authorization - only allow admin, operations, and billing roles
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'BILLING'];
  if (!allowedRoles.includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();

    const {
      facilityId,
      periodStart,
      periodEnd,
      tripIds,
      dueDate,
      paymentTerms,
      notes,
    } = body;

    // Validate required fields
    if (!facilityId || !periodStart || !periodEnd || !tripIds?.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: facilityId, periodStart, periodEnd, tripIds',
        },
        { status: 400 }
      );
    }

    // Generate invoice ID
    const today = new Date();
    const invoiceId = `INV-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Mock calculation - in real app, would fetch trips and calculate
    const mockAmount = tripIds.length * 85; // Average $85 per trip

    const newInvoice = {
      id: invoiceId,
      facilityId,
      facilityName: 'Mock Facility', // Would be fetched from facility
      amount: mockAmount,
      trips: tripIds.length,
      period: { start: periodStart, end: periodEnd },
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate || calculateDueDate(today, paymentTerms || 'net15'),
      status: 'pending',
      paymentTerms: paymentTerms || 'net15',
      notes,
      tripIds,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    };

    // In real app, would save to database

    return NextResponse.json({
      success: true,
      data: newInvoice,
      message: 'Invoice created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create invoice',
      },
      { status: 500 }
    );
  }
}

function calculateDueDate(issueDate: Date, terms: string): string {
  const dueDate = new Date(issueDate);

  switch (terms) {
    case 'net15':
      dueDate.setDate(dueDate.getDate() + 15);
      break;
    case 'net30':
      dueDate.setDate(dueDate.getDate() + 30);
      break;
    case 'net45':
      dueDate.setDate(dueDate.getDate() + 45);
      break;
    case 'due-receipt':
      // Due immediately
      break;
    default:
      dueDate.setDate(dueDate.getDate() + 15);
  }

  return dueDate.toISOString().split('T')[0];
}
