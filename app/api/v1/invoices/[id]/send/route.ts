import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendInvoiceEmail } from '@/lib/services/email';

/**
 * POST /api/v1/invoices/[id]/send
 * Send invoice email to facility
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get invoice with facility details
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        facility: {
          include: {
            billingContact: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Get recipient email
    const recipientEmail =
      invoice.facility.billingEmail || invoice.facility.billingContact?.email;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'No billing email configured for this facility' },
        { status: 400 }
      );
    }

    // Get recipient name
    const recipientName =
      invoice.facility.billingContactName ||
      (invoice.facility.billingContact
        ? `${invoice.facility.billingContact.firstName} ${invoice.facility.billingContact.lastName}`
        : invoice.facility.name);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.deltatransport.com';

    // Send the email
    const result = await sendInvoiceEmail({
      invoiceId: invoice.id,
      recipientEmail,
      recipientName,
      invoiceNumber: invoice.invoiceNumber,
      totalAmount: invoice.totalAmount,
      dueDate: invoice.dueDate,
      facilityName: invoice.facility.name,
      periodStart: invoice.periodStart,
      periodEnd: invoice.periodEnd,
      tripCount: invoice.tripCount,
      invoiceUrl: `${baseUrl}/facility/invoices/${invoice.id}`,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send invoice' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice sent successfully',
      data: {
        sentTo: recipientEmail,
        sentAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Send invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
