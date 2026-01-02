import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPaymentConfirmation } from '@/lib/services/email';

/**
 * GET /api/v1/invoices/[id]/payments
 * Get all payments for an invoice
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        amountPaid: true,
        amountDue: true,
        status: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const payments = await prisma.invoicePayment.findMany({
      where: { invoiceId: id },
      orderBy: { paymentDate: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        invoice: {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          totalAmount: invoice.totalAmount,
          amountPaid: invoice.amountPaid,
          amountDue: invoice.amountDue,
          status: invoice.status,
        },
        payments,
      },
    });
  } catch (error) {
    console.error('Get invoice payments error:', error);
    return NextResponse.json(
      { error: 'Failed to get payments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/invoices/[id]/payments
 * Record a payment for an invoice
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, paymentMethod, paymentReference, paymentDate, notes, sendConfirmation } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid payment amount is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Calculate new amounts
    const newAmountPaid = invoice.amountPaid + amount;
    const newAmountDue = Math.max(0, invoice.totalAmount - newAmountPaid);
    const isFullyPaid = newAmountDue <= 0;

    // Create payment record
    const payment = await prisma.invoicePayment.create({
      data: {
        invoiceId: id,
        amount,
        paymentMethod,
        paymentReference,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        notes,
      },
    });

    // Update invoice
    await prisma.invoice.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        amountDue: newAmountDue,
        status: isFullyPaid ? 'PAID' : invoice.status === 'OVERDUE' ? 'PARTIALLY_PAID' : invoice.status,
        paidAt: isFullyPaid ? new Date() : undefined,
        paymentMethod,
        paymentReference,
      },
    });

    // Send confirmation email if requested
    if (sendConfirmation) {
      await sendPaymentConfirmation(id, amount, payment.paymentDate);
    }

    return NextResponse.json({
      success: true,
      message: isFullyPaid ? 'Invoice fully paid' : 'Payment recorded',
      data: {
        payment,
        invoice: {
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: isFullyPaid ? 'PAID' : invoice.status,
        },
      },
    });
  } catch (error) {
    console.error('Record payment error:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/invoices/[id]/payments
 * Delete a payment record
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Get payment
    const payment = await prisma.invoicePayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.invoiceId !== id) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Delete payment
    await prisma.invoicePayment.delete({
      where: { id: paymentId },
    });

    // Recalculate invoice amounts
    const newAmountPaid = Math.max(0, invoice.amountPaid - payment.amount);
    const newAmountDue = invoice.totalAmount - newAmountPaid;

    // Update invoice
    await prisma.invoice.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        amountDue: newAmountDue,
        status: newAmountPaid > 0 ? 'PARTIALLY_PAID' : 'SENT',
        paidAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment deleted',
      data: {
        invoice: {
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
        },
      },
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
}
