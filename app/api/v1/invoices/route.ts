import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { InvoiceStatus, TripStatus } from '@prisma/client';

// GET /api/v1/invoices - List invoices
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const facilityId = searchParams.get('facilityId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status.toUpperCase() as InvoiceStatus;
    }

    if (facilityId) {
      where.facilityId = facilityId;
    }

    if (startDate || endDate) {
      where.periodStart = {};
      if (startDate) {
        (where.periodStart as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.periodStart as Record<string, Date>).lte = new Date(endDate);
      }
    }

    const [invoices, total, stats] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          facility: {
            select: {
              id: true,
              name: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              paymentDate: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
      // Get summary stats
      prisma.invoice.aggregate({
        where: {
          status: { not: InvoiceStatus.PAID },
        },
        _sum: {
          amountDue: true,
        },
      }),
    ]);

    // Get overdue stats separately
    const overdueStats = await prisma.invoice.aggregate({
      where: {
        status: InvoiceStatus.OVERDUE,
      },
      _sum: {
        amountDue: true,
      },
      _count: true,
    });

    const pendingCount = await prisma.invoice.count({
      where: { status: InvoiceStatus.DRAFT },
    });

    // Transform for frontend
    const transformedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      facilityId: invoice.facilityId,
      facilityName: invoice.facility.name,
      amount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      amountDue: invoice.amountDue,
      trips: invoice.tripCount,
      period: {
        start: invoice.periodStart.toISOString().split('T')[0],
        end: invoice.periodEnd.toISOString().split('T')[0],
      },
      issueDate: invoice.createdAt.toISOString().split('T')[0],
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      status: invoice.status.toLowerCase(),
      sentAt: invoice.sentAt?.toISOString() || null,
      paidAt: invoice.paidAt?.toISOString() || null,
      payments: invoice.payments,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
    }));

    const summary = {
      totalOutstanding: stats._sum.amountDue || 0,
      totalOverdue: overdueStats._sum.amountDue || 0,
      totalPending: pendingCount,
      totalOverdueCount: overdueStats._count || 0,
    };

    return NextResponse.json({
      success: true,
      data: transformedInvoices,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      facilityId,
      periodStart,
      periodEnd,
      tripIds,
      dueDate,
      notes,
    } = body;

    // Validate required fields
    if (!facilityId || !periodStart || !periodEnd) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: facilityId, periodStart, periodEnd',
      }, { status: 400 });
    }

    // Fetch facility to get payment terms
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
    });

    if (!facility) {
      return NextResponse.json({
        success: false,
        error: 'Facility not found',
      }, { status: 404 });
    }

    // Calculate trips in period (or use provided tripIds)
    const tripsWhere = tripIds?.length > 0
      ? { id: { in: tripIds } }
      : {
          facilityId,
          scheduledPickupTime: {
            gte: new Date(periodStart),
            lte: new Date(periodEnd),
          },
          status: TripStatus.COMPLETED,
        };

    const trips = await prisma.trip.findMany({
      where: tripsWhere,
      select: {
        id: true,
        tripNumber: true,
        totalFare: true,
        scheduledPickupTime: true,
      },
    });

    const subtotal = trips.reduce((sum, t) => sum + t.totalFare, 0);
    const totalAmount = subtotal; // No tax for now
    const amountDue = totalAmount;

    // Generate invoice number
    const today = new Date();
    const year = today.getFullYear();
    const count = await prisma.invoice.count({
      where: {
        invoiceNumber: {
          startsWith: `INV-${year}`,
        },
      },
    });
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`;

    // Calculate due date
    const calculatedDueDate = dueDate
      ? new Date(dueDate)
      : new Date(today.getTime() + facility.paymentTermDays * 24 * 60 * 60 * 1000);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        facilityId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        subtotal,
        totalAmount,
        amountDue,
        tripCount: trips.length,
        lineItems: trips.map((t) => ({
          tripId: t.id,
          tripNumber: t.tripNumber,
          date: t.scheduledPickupTime.toISOString(),
          amount: t.totalFare,
        })),
        dueDate: calculatedDueDate,
        status: InvoiceStatus.DRAFT,
        notes: notes || null,
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
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        facilityId: invoice.facilityId,
        facilityName: invoice.facility.name,
        amount: invoice.totalAmount,
        trips: invoice.tripCount,
        period: {
          start: invoice.periodStart.toISOString().split('T')[0],
          end: invoice.periodEnd.toISOString().split('T')[0],
        },
        dueDate: invoice.dueDate.toISOString().split('T')[0],
        status: invoice.status.toLowerCase(),
        createdAt: invoice.createdAt.toISOString(),
      },
      message: 'Invoice created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create invoice',
    }, { status: 500 });
  }
}
