import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/services/quickbooks';
import { prisma } from '@/lib/db';

/**
 * GET /api/v1/integrations/quickbooks/callback
 * OAuth callback handler for QuickBooks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const realmId = searchParams.get('realmId');
    const error = searchParams.get('error');

    if (error) {
      console.error('QuickBooks OAuth error:', error);
      return NextResponse.redirect(
        new URL('/admin/settings?qb_error=access_denied', request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/admin/settings?qb_error=no_code', request.url)
      );
    }

    // Exchange code for tokens
    const tokensResult = await exchangeCodeForTokens(code);

    if ('error' in tokensResult) {
      console.error('Token exchange failed:', tokensResult.error);
      return NextResponse.redirect(
        new URL('/admin/settings?qb_error=token_exchange', request.url)
      );
    }

    // Store tokens with realmId
    const tokens = { ...tokensResult, realmId: realmId || tokensResult.realmId };

    await prisma.systemSettings.upsert({
      where: { key: 'quickbooks_tokens' },
      update: { value: tokens as object },
      create: { key: 'quickbooks_tokens', value: tokens as object },
    });

    // Redirect back to settings with success
    return NextResponse.redirect(
      new URL('/admin/settings?qb_success=true', request.url)
    );
  } catch (error) {
    console.error('QuickBooks callback error:', error);
    return NextResponse.redirect(
      new URL('/admin/settings?qb_error=unknown', request.url)
    );
  }
}
