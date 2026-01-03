import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { InvoiceStatus } from '@prisma/client';

// GET /api/v1/payments - List payments
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get('facilityId');
    const invoiceId = searchParams.get('invoiceId');
    const method = searchParams.get('method');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (invoiceId) {
      where.invoiceId = invoiceId;
    }

    if (facilityId) {
      where.invoice = {
        facilityId,
      };
    }

    if (method) {
      where.paymentMethod = method;
    }

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) {
        (where.paymentDate as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.paymentDate as Record<string, Date>).lte = new Date(endDate);
      }
    }

    const [payments, total, methodStats] = await Promise.all([
      prisma.invoicePayment.findMany({
        where,
        include: {
          invoice: {
            include: {
              facility: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          paymentDate: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoicePayment.count({ where }),
      // Get method breakdown
      prisma.invoicePayment.groupBy({
        by: ['paymentMethod'],
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

    // Get total collected
    const totalCollectedStats = await prisma.invoicePayment.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get pending payments count (invoices with outstanding amount)
    const pendingPaymentsCount = await prisma.invoice.count({
      where: {
        status: {
          in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE, InvoiceStatus.PARTIALLY_PAID],
        },
        amountDue: {
          gt: 0,
        },
      },
    });

    // Transform for frontend
    const transformedPayments = payments.map((payment) => ({
      id: payment.id,
      invoiceId: payment.invoiceId,
      invoiceNumber: payment.invoice.invoiceNumber,
      facilityId: payment.invoice.facilityId,
      facilityName: payment.invoice.facility.name,
      amount: payment.amount,
      method: payment.paymentMethod,
      reference: payment.paymentReference,
      notes: payment.notes,
      processedAt: payment.paymentDate.toISOString(),
      createdAt: payment.createdAt.toISOString(),
    }));

    // Build method breakdown
    const byMethod: Record<string, number> = {
      ach: 0,
      check: 0,
      wire: 0,
      card: 0,
      cash: 0,
    };
    methodStats.forEach((stat) => {
      if (stat.paymentMethod) {
        byMethod[stat.paymentMethod] = stat._sum.amount || 0;
      }
    });

    const summary = {
      totalCollected: totalCollectedStats._sum.amount || 0,
      pendingPayments: pendingPaymentsCount,
      byMethod,
    };

    return NextResponse.json({
      success: true,
      data: transformedPayments,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/payments - Record a new payment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      invoiceId,
      amount,
      method,
      reference,
      paymentDate,
      notes,
    } = body;

    // Validate required fields
    if (!invoiceId || !amount || !method) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: invoiceId, amount, method',
      }, { status: 400 });
    }

    // Validate payment method
    const validMethods = ['ach', 'check', 'wire', 'card', 'cash'];
    if (!validMethods.includes(method)) {
      return NextResponse.json({
        success: false,
        error: `Invalid payment method. Must be one of: ${validMethods.join(', ')}`,
      }, { status: 400 });
    }

    // Verify invoice exists and get current balance
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        facility: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice not found',
      }, { status: 404 });
    }

    // Validate amount doesn't exceed balance
    if (amount > invoice.amountDue) {
      return NextResponse.json({
        success: false,
        error: `Payment amount ($${amount}) exceeds invoice balance ($${invoice.amountDue})`,
      }, { status: 400 });
    }

    // Create payment and update invoice in transaction
    const [payment] = await prisma.$transaction([
      // Create payment record
      prisma.invoicePayment.create({
        data: {
          invoiceId,
          amount,
          paymentMethod: method,
          paymentReference: reference || null,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          recordedById: session.user.id,
          notes: notes || null,
        },
      }),
      // Update invoice amounts
      prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: {
            increment: amount,
          },
          amountDue: {
            decrement: amount,
          },
          status: amount >= invoice.amountDue
            ? InvoiceStatus.PAID
            : InvoiceStatus.PARTIALLY_PAID,
          paidAt: amount >= invoice.amountDue ? new Date() : null,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        id: payment.id,
        invoiceId: payment.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        facilityName: invoice.facility.name,
        amount: payment.amount,
        method: payment.paymentMethod,
        reference: payment.paymentReference,
        processedAt: payment.paymentDate.toISOString(),
        createdAt: payment.createdAt.toISOString(),
      },
      message: amount >= invoice.amountDue
        ? 'Payment recorded - Invoice fully paid'
        : 'Partial payment recorded successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to record payment',
    }, { status: 500 });
  }
}
