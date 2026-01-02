/**
 * Email Service
 * Handles sending emails for invoices, notifications, and alerts
 * Uses SendGrid as the email provider
 */

import { prisma } from '@/lib/db';
import { NotificationChannel, NotificationType } from '@prisma/client';

interface SendGridClient {
  send: (msg: SendGridMessage) => Promise<[{ statusCode: number }]>;
}

interface SendGridMessage {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

let sgMail: SendGridClient | null = null;

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    content: string; // base64 encoded
    filename: string;
    type: string;
  }>;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface InvoiceEmailData {
  invoiceId: string;
  recipientEmail: string;
  recipientName: string;
  invoiceNumber: string;
  totalAmount: number;
  dueDate: Date;
  facilityName: string;
  periodStart: Date;
  periodEnd: Date;
  tripCount: number;
  invoiceUrl: string;
  pdfContent?: string; // base64 encoded PDF
}

// Email Templates
const EMAIL_TEMPLATES = {
  INVOICE_SENT: {
    subject: 'Invoice #{invoiceNumber} from Delta Transportation',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #{invoiceNumber}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Delta Transportation</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.8;">Medical Transportation Services</p>
  </div>

  <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
    <h2 style="color: #1e293b; margin-top: 0;">Invoice #{invoiceNumber}</h2>

    <p>Dear {recipientName},</p>

    <p>Please find attached your invoice for transportation services provided during the period of <strong>{periodStart}</strong> to <strong>{periodEnd}</strong>.</p>

    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Invoice Number:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">{invoiceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Billing Period:</td>
          <td style="padding: 8px 0; text-align: right;">{periodStart} - {periodEnd}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Total Trips:</td>
          <td style="padding: 8px 0; text-align: right;">{tripCount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Due Date:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626;">{dueDate}</td>
        </tr>
        <tr style="border-top: 2px solid #e2e8f0;">
          <td style="padding: 16px 0 8px 0; font-size: 18px; font-weight: bold;">Amount Due:</td>
          <td style="padding: 16px 0 8px 0; text-align: right; font-size: 24px; font-weight: bold; color: #1e293b;">$ {totalAmount}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{invoiceUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Invoice Online</a>
    </div>

    <p style="color: #64748b; font-size: 14px;">If you have any questions about this invoice, please don't hesitate to contact our billing department.</p>
  </div>

  <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
    <p style="margin: 0;">Delta Transportation Services</p>
    <p style="margin: 5px 0 0 0; opacity: 0.7;">© 2026 All rights reserved</p>
  </div>
</body>
</html>
    `,
  },

  INVOICE_REMINDER: {
    subject: 'Reminder: Invoice #{invoiceNumber} Due {dueDate}',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Payment Reminder</h1>
  </div>

  <div style="background: #fef2f2; padding: 20px; border: 1px solid #fecaca; border-top: none;">
    <p>Dear {recipientName},</p>

    <p>This is a friendly reminder that invoice <strong>#{invoiceNumber}</strong> for <strong>$ {totalAmount}</strong> is due on <strong>{dueDate}</strong>.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{invoiceUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Pay Now</a>
    </div>

    <p style="color: #64748b; font-size: 14px;">If you have already made this payment, please disregard this reminder.</p>
  </div>

  <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
    <p style="margin: 0;">Delta Transportation Services</p>
  </div>
</body>
</html>
    `,
  },

  INVOICE_OVERDUE: {
    subject: 'OVERDUE: Invoice #{invoiceNumber} - Immediate Payment Required',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #7f1d1d; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">⚠️ OVERDUE NOTICE</h1>
  </div>

  <div style="background: #fef2f2; padding: 20px; border: 2px solid #dc2626; border-top: none;">
    <p>Dear {recipientName},</p>

    <p><strong>Your invoice #{invoiceNumber} for $ {totalAmount} is now overdue.</strong></p>

    <p>The payment was due on {dueDate}. Please make payment immediately to avoid any service interruptions.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{invoiceUrl}" style="display: inline-block; background: #7f1d1d; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Pay Now</a>
    </div>

    <p>If you are experiencing financial difficulties or have questions about this invoice, please contact our billing department immediately.</p>
  </div>

  <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
    <p style="margin: 0;">Delta Transportation Services</p>
  </div>
</body>
</html>
    `,
  },

  PAYMENT_RECEIVED: {
    subject: 'Payment Received - Invoice #{invoiceNumber}',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">✓ Payment Received</h1>
  </div>

  <div style="background: #f0fdf4; padding: 20px; border: 1px solid #bbf7d0; border-top: none;">
    <p>Dear {recipientName},</p>

    <p>Thank you! We have received your payment of <strong>$ {paymentAmount}</strong> for invoice <strong>#{invoiceNumber}</strong>.</p>

    <div style="background: white; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Invoice Number:</td>
          <td style="padding: 8px 0; text-align: right;">{invoiceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Payment Amount:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">$ {paymentAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Payment Date:</td>
          <td style="padding: 8px 0; text-align: right;">{paymentDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Remaining Balance:</td>
          <td style="padding: 8px 0; text-align: right;">$ {remainingBalance}</td>
        </tr>
      </table>
    </div>

    <p>Thank you for your continued partnership with Delta Transportation.</p>
  </div>

  <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
    <p style="margin: 0;">Delta Transportation Services</p>
  </div>
</body>
</html>
    `,
  },
};

/**
 * Initialize SendGrid client
 */
async function getSendGridClient(): Promise<SendGridClient | null> {
  if (sgMail) return sgMail;

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn('SENDGRID_API_KEY not configured');
    return null;
  }

  try {
    const sendgrid = await import('@sendgrid/mail');
    sendgrid.default.setApiKey(apiKey);
    sgMail = sendgrid.default as unknown as SendGridClient;
    return sgMail;
  } catch (error) {
    console.error('Failed to initialize SendGrid client:', error);
    return null;
  }
}

/**
 * Format template with variables
 */
function formatTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Send email via SendGrid
 */
export async function sendEmail(config: EmailConfig): Promise<SendEmailResult> {
  const fromEmail = process.env.EMAIL_FROM || 'billing@deltatransport.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'Delta Transportation';

  try {
    const client = await getSendGridClient();

    if (!client) {
      // In development, log and simulate
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV EMAIL] To: ${config.to}, Subject: ${config.subject}`);
        return { success: true, messageId: `dev_${Date.now()}` };
      }
      return { success: false, error: 'Email service not configured' };
    }

    const msg: SendGridMessage = {
      to: config.to,
      from: `${fromName} <${fromEmail}>`,
      subject: config.subject,
      html: config.html,
      text: config.text,
    };

    if (config.attachments?.length) {
      msg.attachments = config.attachments.map((att) => ({
        content: att.content,
        filename: att.filename,
        type: att.type,
        disposition: 'attachment',
      }));
    }

    const [response] = await client.send(msg);

    return {
      success: response.statusCode >= 200 && response.statusCode < 300,
      messageId: `sg_${Date.now()}`,
    };
  } catch (error) {
    console.error('Send email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<SendEmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.deltatransport.com';

  const variables: Record<string, string> = {
    invoiceNumber: data.invoiceNumber,
    recipientName: data.recipientName,
    totalAmount: data.totalAmount.toFixed(2),
    dueDate: data.dueDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    facilityName: data.facilityName,
    periodStart: data.periodStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    periodEnd: data.periodEnd.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    tripCount: String(data.tripCount),
    invoiceUrl: data.invoiceUrl || `${baseUrl}/invoices/${data.invoiceId}`,
  };

  const template = EMAIL_TEMPLATES.INVOICE_SENT;
  const subject = formatTemplate(template.subject, variables);
  const html = formatTemplate(template.html, variables);

  const attachments = data.pdfContent
    ? [
        {
          content: data.pdfContent,
          filename: `Invoice-${data.invoiceNumber}.pdf`,
          type: 'application/pdf',
        },
      ]
    : undefined;

  const result = await sendEmail({
    to: data.recipientEmail,
    subject,
    html,
    attachments,
  });

  // Log the notification
  if (result.success) {
    await prisma.notificationLog.create({
      data: {
        recipientEmail: data.recipientEmail,
        channel: NotificationChannel.EMAIL,
        type: NotificationType.INVOICE_SENT,
        subject,
        content: html,
        status: 'sent',
        sentAt: new Date(),
        sendgridMessageId: result.messageId,
      },
    });

    // Update invoice sentAt
    await prisma.invoice.update({
      where: { id: data.invoiceId },
      data: {
        sentAt: new Date(),
        status: 'SENT',
      },
    });
  }

  return result;
}

/**
 * Send invoice reminder
 */
export async function sendInvoiceReminder(
  invoiceId: string,
  isOverdue: boolean = false
): Promise<SendEmailResult> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      facility: {
        include: {
          billingContact: true,
        },
      },
    },
  });

  if (!invoice) {
    return { success: false, error: 'Invoice not found' };
  }

  const recipientEmail =
    invoice.facility.billingEmail || invoice.facility.billingContact?.email;
  const recipientName =
    invoice.facility.billingContactName ||
    (invoice.facility.billingContact
      ? `${invoice.facility.billingContact.firstName} ${invoice.facility.billingContact.lastName}`
      : invoice.facility.name);

  if (!recipientEmail) {
    return { success: false, error: 'No billing email configured' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.deltatransport.com';

  const variables: Record<string, string> = {
    invoiceNumber: invoice.invoiceNumber,
    recipientName,
    totalAmount: invoice.amountDue.toFixed(2),
    dueDate: invoice.dueDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    invoiceUrl: `${baseUrl}/invoices/${invoice.id}`,
  };

  const template = isOverdue ? EMAIL_TEMPLATES.INVOICE_OVERDUE : EMAIL_TEMPLATES.INVOICE_REMINDER;
  const subject = formatTemplate(template.subject, variables);
  const html = formatTemplate(template.html, variables);

  const result = await sendEmail({
    to: recipientEmail,
    subject,
    html,
  });

  // Log the notification
  if (result.success) {
    await prisma.notificationLog.create({
      data: {
        recipientEmail,
        channel: NotificationChannel.EMAIL,
        type: isOverdue ? NotificationType.INVOICE_OVERDUE : NotificationType.INVOICE_SENT,
        subject,
        content: html,
        status: 'sent',
        sentAt: new Date(),
        sendgridMessageId: result.messageId,
      },
    });

    // Update invoice status if overdue
    if (isOverdue && invoice.status !== 'OVERDUE') {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'OVERDUE' },
      });
    }
  }

  return result;
}

/**
 * Send payment confirmation
 */
export async function sendPaymentConfirmation(
  invoiceId: string,
  paymentAmount: number,
  paymentDate: Date
): Promise<SendEmailResult> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      facility: {
        include: {
          billingContact: true,
        },
      },
    },
  });

  if (!invoice) {
    return { success: false, error: 'Invoice not found' };
  }

  const recipientEmail =
    invoice.facility.billingEmail || invoice.facility.billingContact?.email;
  const recipientName =
    invoice.facility.billingContactName ||
    (invoice.facility.billingContact
      ? `${invoice.facility.billingContact.firstName} ${invoice.facility.billingContact.lastName}`
      : invoice.facility.name);

  if (!recipientEmail) {
    return { success: false, error: 'No billing email configured' };
  }

  const variables: Record<string, string> = {
    invoiceNumber: invoice.invoiceNumber,
    recipientName,
    paymentAmount: paymentAmount.toFixed(2),
    paymentDate: paymentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    remainingBalance: Math.max(0, invoice.amountDue - paymentAmount).toFixed(2),
  };

  const template = EMAIL_TEMPLATES.PAYMENT_RECEIVED;
  const subject = formatTemplate(template.subject, variables);
  const html = formatTemplate(template.html, variables);

  const result = await sendEmail({
    to: recipientEmail,
    subject,
    html,
  });

  if (result.success) {
    await prisma.notificationLog.create({
      data: {
        recipientEmail,
        channel: NotificationChannel.EMAIL,
        type: NotificationType.PAYMENT_RECEIVED,
        subject,
        content: html,
        status: 'sent',
        sentAt: new Date(),
        sendgridMessageId: result.messageId,
      },
    });
  }

  return result;
}

/**
 * Get invoices that need reminder emails
 */
export async function getInvoicesNeedingReminders(): Promise<{
  dueSoon: string[];
  overdue: string[];
}> {
  const now = new Date();
  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Get invoices due in the next 3 days
  const dueSoon = await prisma.invoice.findMany({
    where: {
      status: 'SENT',
      dueDate: {
        gte: now,
        lte: threeDaysFromNow,
      },
    },
    select: { id: true },
  });

  // Get overdue invoices
  const overdue = await prisma.invoice.findMany({
    where: {
      status: { in: ['SENT', 'VIEWED'] },
      dueDate: { lt: now },
    },
    select: { id: true },
  });

  return {
    dueSoon: dueSoon.map((i) => i.id),
    overdue: overdue.map((i) => i.id),
  };
}
