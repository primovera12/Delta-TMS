import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { InvoiceStatus } from '@prisma/client';

// GET /api/v1/invoices/[id] - Get invoice details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            addressLine1: true,
            city: true,
            state: true,
            zipCode: true,
            billingContactName: true,
            billingEmail: true,
            phone: true,
          },
        },
        payments: {
          orderBy: {
            paymentDate: 'desc',
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Parse line items (stored as JSON)
    const lineItems = invoice.lineItems as Array<{
      tripId: string;
      tripNumber: string;
      date: string;
      amount: number;
    }> || [];

    // Transform for frontend
    const transformedInvoice = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      facilityId: invoice.facilityId,
      facility: {
        id: invoice.facility.id,
        name: invoice.facility.name,
        address: invoice.facility.addressLine1,
        city: invoice.facility.city,
        state: invoice.facility.state,
        zip: invoice.facility.zipCode,
        contact: invoice.facility.billingContactName || '',
        email: invoice.facility.billingEmail || '',
        phone: invoice.facility.phone || '',
      },
      amount: invoice.totalAmount,
      subtotal: invoice.subtotal,
      tax: invoice.taxAmount || 0,
      discount: invoice.discountAmount || 0,
      amountPaid: invoice.amountPaid,
      amountDue: invoice.amountDue,
      trips: lineItems.map((item) => ({
        id: item.tripId,
        tripNumber: item.tripNumber,
        date: item.date.split('T')[0],
        fare: item.amount,
      })),
      tripCount: invoice.tripCount,
      period: {
        start: invoice.periodStart.toISOString().split('T')[0],
        end: invoice.periodEnd.toISOString().split('T')[0],
      },
      issueDate: invoice.createdAt.toISOString().split('T')[0],
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      status: invoice.status.toLowerCase(),
      paymentTerms: `net${Math.round((invoice.dueDate.getTime() - invoice.createdAt.getTime()) / (1000 * 60 * 60 * 24))}`,
      notes: invoice.notes || '',
      internalNotes: invoice.internalNotes || '',
      payments: invoice.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.paymentMethod,
        reference: p.paymentReference,
        date: p.paymentDate.toISOString(),
        notes: p.notes,
      })),
      activity: [
        {
          action: 'created',
          timestamp: invoice.createdAt.toISOString(),
          user: 'System',
        },
        ...(invoice.sentAt ? [{
          action: 'sent',
          timestamp: invoice.sentAt.toISOString(),
          user: 'System',
          details: `Sent to ${invoice.facility.billingEmail}`,
        }] : []),
        ...(invoice.paidAt ? [{
          action: 'paid',
          timestamp: invoice.paidAt.toISOString(),
          user: 'System',
          details: 'Payment received',
        }] : []),
      ],
      sentAt: invoice.sentAt?.toISOString() || null,
      paidAt: invoice.paidAt?.toISOString() || null,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: transformedInvoice,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/invoices/[id] - Update invoice
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const {
      status,
      notes,
      internalNotes,
      dueDate,
    } = body;

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (status) {
      const statusMap: Record<string, InvoiceStatus> = {
        draft: InvoiceStatus.DRAFT,
        sent: InvoiceStatus.SENT,
        viewed: InvoiceStatus.VIEWED,
        paid: InvoiceStatus.PAID,
        partially_paid: InvoiceStatus.PARTIALLY_PAID,
        overdue: InvoiceStatus.OVERDUE,
        cancelled: InvoiceStatus.CANCELLED,
        disputed: InvoiceStatus.DISPUTED,
      };

      if (statusMap[status]) {
        updateData.status = statusMap[status];

        // Set sentAt when status changes to sent
        if (status === 'sent' && !existingInvoice.sentAt) {
          updateData.sentAt = new Date();
        }

        // Set paidAt when status changes to paid
        if (status === 'paid') {
          updateData.paidAt = new Date();
          updateData.amountDue = 0;
          updateData.amountPaid = existingInvoice.totalAmount;
        }
      }
    }

    if (notes !== undefined) updateData.notes = notes;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (dueDate) updateData.dueDate = new Date(dueDate);

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
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
        facilityName: invoice.facility.name,
        status: invoice.status.toLowerCase(),
        amount: invoice.totalAmount,
        amountDue: invoice.amountDue,
        updatedAt: invoice.updatedAt.toISOString(),
      },
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

// DELETE /api/v1/invoices/[id] - Cancel/void invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Cannot delete paid or partially paid invoices
    if (existingInvoice.status === InvoiceStatus.PAID || existingInvoice.payments.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete an invoice that has payments recorded',
      }, { status: 400 });
    }

    // Void the invoice instead of deleting
    await prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.CANCELLED,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invoice ${existingInvoice.invoiceNumber} cancelled successfully`,
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
