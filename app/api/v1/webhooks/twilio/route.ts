import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

/**
 * POST /api/v1/webhooks/twilio
 * Handle Twilio status callbacks for SMS delivery tracking
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract Twilio parameters
    const messageSid = formData.get('MessageSid') as string;
    const messageStatus = formData.get('MessageStatus') as string;
    const errorCode = formData.get('ErrorCode') as string | null;
    const errorMessage = formData.get('ErrorMessage') as string | null;

    // Validate the request is from Twilio (optional but recommended)
    const twilioSignature = request.headers.get('X-Twilio-Signature');
    if (process.env.TWILIO_AUTH_TOKEN && twilioSignature) {
      const isValid = validateTwilioSignature(
        request.url,
        Object.fromEntries(formData),
        twilioSignature,
        process.env.TWILIO_AUTH_TOKEN
      );

      if (!isValid) {
        console.warn('Invalid Twilio signature');
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    if (!messageSid) {
      return new NextResponse('Missing MessageSid', { status: 400 });
    }

    // Find and update the notification log
    const notificationLog = await prisma.notificationLog.findFirst({
      where: { twilioMessageSid: messageSid },
    });

    if (!notificationLog) {
      console.warn(`No notification log found for MessageSid: ${messageSid}`);
      // Return 200 anyway to acknowledge receipt
      return new NextResponse('OK', { status: 200 });
    }

    // Update status based on Twilio status
    const now = new Date();
    let updateData: {
      status: string;
      deliveredAt?: Date;
      failedAt?: Date;
      errorMessage?: string;
    } = { status: messageStatus };

    switch (messageStatus) {
      case 'delivered':
        updateData.deliveredAt = now;
        updateData.status = 'delivered';
        break;

      case 'sent':
        updateData.status = 'sent';
        break;

      case 'failed':
      case 'undelivered':
        updateData.failedAt = now;
        updateData.status = 'failed';
        updateData.errorMessage = errorMessage || `Error code: ${errorCode}`;
        break;

      case 'queued':
      case 'sending':
        updateData.status = 'sending';
        break;
    }

    await prisma.notificationLog.update({
      where: { id: notificationLog.id },
      data: updateData,
    });

    console.log(`Updated notification ${notificationLog.id} status to: ${messageStatus}`);

    // Return TwiML-compatible response
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Validate Twilio request signature
 */
function validateTwilioSignature(
  url: string,
  params: Record<string, FormDataEntryValue>,
  signature: string,
  authToken: string
): boolean {
  // Sort parameters alphabetically and concatenate
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], '');

  // Create signature
  const data = url + sortedParams;
  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(data, 'utf-8'))
    .digest('base64');

  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
