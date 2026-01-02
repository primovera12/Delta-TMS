/**
 * QuickBooks Integration Service
 * Handles OAuth authentication and invoice sync with QuickBooks Online
 */

import { prisma } from '@/lib/db';

// QuickBooks API endpoints
const QB_SANDBOX_BASE = 'https://sandbox-quickbooks.api.intuit.com';
const QB_PRODUCTION_BASE = 'https://quickbooks.api.intuit.com';
const QB_AUTH_BASE = 'https://appcenter.intuit.com/connect/oauth2';

interface QuickBooksConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
}

interface QuickBooksTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  realmId: string;
}

interface QuickBooksCustomer {
  Id?: string;
  DisplayName: string;
  CompanyName?: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  BillAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
  };
}

interface QuickBooksInvoice {
  Id?: string;
  DocNumber?: string;
  TxnDate: string;
  DueDate: string;
  CustomerRef: { value: string };
  Line: Array<{
    Amount: number;
    DetailType: 'SalesItemLineDetail';
    SalesItemLineDetail?: {
      ItemRef: { value: string; name: string };
      Qty?: number;
      UnitPrice?: number;
    };
    Description?: string;
  }>;
  CustomerMemo?: { value: string };
  BillEmail?: { Address: string };
  EmailStatus?: 'NotSet' | 'NeedToSend' | 'EmailSent';
}

interface SyncResult {
  success: boolean;
  quickbooksId?: string;
  error?: string;
}

/**
 * Get QuickBooks configuration
 */
function getConfig(): QuickBooksConfig {
  return {
    clientId: process.env.QUICKBOOKS_CLIENT_ID || '',
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET || '',
    redirectUri: process.env.QUICKBOOKS_REDIRECT_URI || '',
    environment: (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  };
}

/**
 * Get API base URL based on environment
 */
function getApiBase(environment: 'sandbox' | 'production'): string {
  return environment === 'production' ? QB_PRODUCTION_BASE : QB_SANDBOX_BASE;
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthorizationUrl(state: string): string {
  const config = getConfig();
  const scopes = encodeURIComponent('com.intuit.quickbooks.accounting');

  return `${QB_AUTH_BASE}?client_id=${config.clientId}&response_type=code&scope=${scopes}&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=${state}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string
): Promise<QuickBooksTokens | { error: string }> {
  const config = getConfig();

  try {
    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('QuickBooks token exchange failed:', error);
      return { error: 'Failed to exchange authorization code' };
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      realmId: data.realmId || '',
    };
  } catch (error) {
    console.error('QuickBooks token exchange error:', error);
    return { error: error instanceof Error ? error.message : 'Token exchange failed' };
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<QuickBooksTokens | { error: string }> {
  const config = getConfig();

  try {
    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      return { error: 'Failed to refresh token' };
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      realmId: '',
    };
  } catch (error) {
    console.error('QuickBooks token refresh error:', error);
    return { error: error instanceof Error ? error.message : 'Token refresh failed' };
  }
}

/**
 * Get stored QuickBooks tokens
 */
async function getStoredTokens(): Promise<QuickBooksTokens | null> {
  const settings = await prisma.systemSettings.findFirst({
    where: { key: 'quickbooks_tokens' },
  });

  if (!settings?.value) return null;

  try {
    const tokens = settings.value as Record<string, unknown>;
    return {
      accessToken: tokens.accessToken as string,
      refreshToken: tokens.refreshToken as string,
      expiresAt: new Date(tokens.expiresAt as string),
      realmId: tokens.realmId as string,
    };
  } catch {
    return null;
  }
}

/**
 * Store QuickBooks tokens
 */
async function storeTokens(tokens: QuickBooksTokens): Promise<void> {
  await prisma.systemSettings.upsert({
    where: { key: 'quickbooks_tokens' },
    update: { value: tokens as object },
    create: { key: 'quickbooks_tokens', value: tokens as object },
  });
}

/**
 * Get valid access token (refreshing if needed)
 */
async function getValidAccessToken(): Promise<{ accessToken: string; realmId: string } | { error: string }> {
  const tokens = await getStoredTokens();

  if (!tokens) {
    return { error: 'QuickBooks not connected. Please authorize the integration.' };
  }

  // Check if token is expired or will expire soon (5 min buffer)
  const expiresIn = tokens.expiresAt.getTime() - Date.now();
  if (expiresIn < 5 * 60 * 1000) {
    // Refresh the token
    const refreshResult = await refreshAccessToken(tokens.refreshToken);
    if ('error' in refreshResult) {
      return refreshResult;
    }

    // Store new tokens with original realmId
    const newTokens = { ...refreshResult, realmId: tokens.realmId };
    await storeTokens(newTokens);

    return { accessToken: newTokens.accessToken, realmId: newTokens.realmId };
  }

  return { accessToken: tokens.accessToken, realmId: tokens.realmId };
}

/**
 * Make authenticated API request to QuickBooks
 */
async function qbRequest<T>(
  method: 'GET' | 'POST',
  endpoint: string,
  data?: unknown
): Promise<T | { error: string }> {
  const config = getConfig();
  const tokenResult = await getValidAccessToken();

  if ('error' in tokenResult) {
    return tokenResult;
  }

  const { accessToken, realmId } = tokenResult;
  const baseUrl = getApiBase(config.environment);
  const url = `${baseUrl}/v3/company/${realmId}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('QuickBooks API error:', error);
      return { error: `QuickBooks API error: ${response.status}` };
    }

    return await response.json();
  } catch (error) {
    console.error('QuickBooks request error:', error);
    return { error: error instanceof Error ? error.message : 'API request failed' };
  }
}

/**
 * Find or create a customer in QuickBooks
 */
export async function syncCustomer(facility: {
  id: string;
  name: string;
  billingEmail?: string | null;
  billingPhone?: string | null;
  billingAddressLine1?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingZipCode?: string | null;
  quickbooksCustomerId?: string | null;
}): Promise<SyncResult> {
  // If already synced, return existing ID
  if (facility.quickbooksCustomerId) {
    return { success: true, quickbooksId: facility.quickbooksCustomerId };
  }

  // Create customer in QuickBooks
  const customerData: QuickBooksCustomer = {
    DisplayName: facility.name,
    CompanyName: facility.name,
    PrimaryEmailAddr: facility.billingEmail ? { Address: facility.billingEmail } : undefined,
    PrimaryPhone: facility.billingPhone ? { FreeFormNumber: facility.billingPhone } : undefined,
    BillAddr: {
      Line1: facility.billingAddressLine1 || undefined,
      City: facility.billingCity || undefined,
      CountrySubDivisionCode: facility.billingState || undefined,
      PostalCode: facility.billingZipCode || undefined,
    },
  };

  const result = await qbRequest<{ Customer: QuickBooksCustomer }>('POST', 'customer', customerData);

  if ('error' in result) {
    return { success: false, error: result.error };
  }

  const quickbooksId = result.Customer.Id;

  // Store QuickBooks ID on facility
  if (quickbooksId) {
    await prisma.facility.update({
      where: { id: facility.id },
      data: { quickbooksCustomerId: quickbooksId },
    });
  }

  return { success: true, quickbooksId };
}

/**
 * Sync invoice to QuickBooks
 */
export async function syncInvoice(invoiceId: string): Promise<SyncResult> {
  // Get invoice with facility
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      facility: true,
    },
  });

  if (!invoice) {
    return { success: false, error: 'Invoice not found' };
  }

  // If already synced, update instead of create
  if (invoice.quickbooksInvoiceId) {
    // Could implement update logic here
    return { success: true, quickbooksId: invoice.quickbooksInvoiceId };
  }

  // Ensure customer exists in QuickBooks
  const customerResult = await syncCustomer({
    id: invoice.facility.id,
    name: invoice.facility.name,
    billingEmail: invoice.facility.billingEmail,
    billingPhone: invoice.facility.billingPhone,
    billingAddressLine1: invoice.facility.billingAddressLine1,
    billingCity: invoice.facility.billingCity,
    billingState: invoice.facility.billingState,
    billingZipCode: invoice.facility.billingZipCode,
    quickbooksCustomerId: invoice.facility.quickbooksCustomerId,
  });

  if (!customerResult.success) {
    return customerResult;
  }

  // Build invoice data
  const lineItems = (invoice.lineItems as Array<{ description: string; amount: number }>) || [];

  const invoiceData: QuickBooksInvoice = {
    DocNumber: invoice.invoiceNumber,
    TxnDate: invoice.periodEnd.toISOString().split('T')[0],
    DueDate: invoice.dueDate.toISOString().split('T')[0],
    CustomerRef: { value: customerResult.quickbooksId! },
    Line: lineItems.map((item, index) => ({
      Amount: item.amount,
      DetailType: 'SalesItemLineDetail' as const,
      SalesItemLineDetail: {
        ItemRef: { value: '1', name: 'Transportation Services' },
        Qty: 1,
        UnitPrice: item.amount,
      },
      Description: item.description,
    })),
    CustomerMemo: { value: `Invoice for transportation services - ${invoice.tripCount} trips` },
    BillEmail: invoice.facility.billingEmail
      ? { Address: invoice.facility.billingEmail }
      : undefined,
  };

  // If no line items, create a single line for the total
  if (invoiceData.Line.length === 0) {
    invoiceData.Line = [
      {
        Amount: invoice.totalAmount,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: { value: '1', name: 'Transportation Services' },
          Qty: invoice.tripCount,
          UnitPrice: invoice.tripCount > 0 ? invoice.totalAmount / invoice.tripCount : invoice.totalAmount,
        },
        Description: `Transportation services - ${invoice.tripCount} trips`,
      },
    ];
  }

  const result = await qbRequest<{ Invoice: { Id: string } }>('POST', 'invoice', invoiceData);

  if ('error' in result) {
    return { success: false, error: result.error };
  }

  const quickbooksId = result.Invoice.Id;

  // Store QuickBooks ID on invoice
  if (quickbooksId) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { quickbooksInvoiceId: quickbooksId },
    });
  }

  return { success: true, quickbooksId };
}

/**
 * Sync payment to QuickBooks
 */
export async function syncPayment(
  invoiceId: string,
  paymentId: string
): Promise<SyncResult> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  const payment = await prisma.invoicePayment.findUnique({
    where: { id: paymentId },
  });

  if (!invoice || !payment) {
    return { success: false, error: 'Invoice or payment not found' };
  }

  if (!invoice.quickbooksInvoiceId) {
    // First sync the invoice
    const invoiceResult = await syncInvoice(invoiceId);
    if (!invoiceResult.success) {
      return invoiceResult;
    }
  }

  // Get fresh invoice with QB ID
  const refreshedInvoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { facility: true },
  });

  if (!refreshedInvoice?.quickbooksInvoiceId) {
    return { success: false, error: 'Invoice not synced to QuickBooks' };
  }

  // Create payment in QuickBooks
  const paymentData = {
    TotalAmt: payment.amount,
    CustomerRef: { value: refreshedInvoice.facility.quickbooksCustomerId },
    Line: [
      {
        Amount: payment.amount,
        LinkedTxn: [
          {
            TxnId: refreshedInvoice.quickbooksInvoiceId,
            TxnType: 'Invoice',
          },
        ],
      },
    ],
    PaymentRefNum: payment.paymentReference || undefined,
  };

  const result = await qbRequest<{ Payment: { Id: string } }>('POST', 'payment', paymentData);

  if ('error' in result) {
    return { success: false, error: result.error };
  }

  return { success: true, quickbooksId: result.Payment.Id };
}

/**
 * Check QuickBooks connection status
 */
export async function getConnectionStatus(): Promise<{
  connected: boolean;
  companyName?: string;
  lastSync?: Date;
}> {
  const tokens = await getStoredTokens();

  if (!tokens) {
    return { connected: false };
  }

  // Try to get company info
  const result = await qbRequest<{ CompanyInfo: { CompanyName: string } }>(
    'GET',
    'companyinfo/' + tokens.realmId
  );

  if ('error' in result) {
    return { connected: false };
  }

  // Get last sync time
  const lastSyncSetting = await prisma.systemSettings.findFirst({
    where: { key: 'quickbooks_last_sync' },
  });

  return {
    connected: true,
    companyName: result.CompanyInfo.CompanyName,
    lastSync: lastSyncSetting?.value ? new Date((lastSyncSetting.value as { date: string }).date) : undefined,
  };
}

/**
 * Disconnect QuickBooks integration
 */
export async function disconnect(): Promise<void> {
  await prisma.systemSettings.deleteMany({
    where: {
      key: {
        in: ['quickbooks_tokens', 'quickbooks_last_sync'],
      },
    },
  });
}
