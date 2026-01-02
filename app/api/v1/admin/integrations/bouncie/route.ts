/**
 * Bouncie Integration Configuration API
 *
 * GET  - Get current configuration (with masked secrets)
 * PUT  - Update configuration
 * POST - Test connection / Sync devices
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { bouncieService, type BouncieCredentials } from '@/lib/services/bouncie';
import { prisma } from '@/lib/prisma';

// Allowed roles for Bouncie configuration
const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * GET /api/v1/admin/integrations/bouncie
 * Get current Bouncie configuration (with masked secrets)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const config = await bouncieService.getConfig();

    if (!config) {
      return NextResponse.json({
        isConfigured: false,
        isEnabled: false,
        config: null,
      });
    }

    // Mask sensitive fields
    const maskedConfig = {
      id: config.id,
      isEnabled: config.isEnabled,
      isConfigured: Boolean(config.clientId && config.clientSecret),

      // Masked credentials
      clientId: config.clientId ? maskSecret(config.clientId) : null,
      clientSecretSet: Boolean(config.clientSecret),
      authorizationCodeSet: Boolean(config.authorizationCode),
      accessTokenSet: Boolean(config.accessToken),
      tokenExpiresAt: config.tokenExpiresAt,

      // Feature toggles
      enableRealTimeTracking: config.enableRealTimeTracking,
      enableGeofencing: config.enableGeofencing,
      enableDiagnostics: config.enableDiagnostics,
      enableDriverBehavior: config.enableDriverBehavior,
      enableMileageTracking: config.enableMileageTracking,
      enableFuelMonitoring: config.enableFuelMonitoring,
      enableMaintenanceAlerts: config.enableMaintenanceAlerts,
      enableAutoStatusUpdate: config.enableAutoStatusUpdate,

      // Webhook
      webhookUrl: config.webhookUrl,
      webhookEnabled: config.webhookEnabled,

      // Sync settings
      locationUpdateInterval: config.locationUpdateInterval,
      diagnosticsSyncInterval: config.diagnosticsSyncInterval,
      geofenceRadiusMeters: config.geofenceRadiusMeters,

      // Status
      syncStatus: config.syncStatus,
      syncError: config.syncError,
      lastSyncAt: config.lastSyncAt,

      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };

    return NextResponse.json({
      isConfigured: maskedConfig.isConfigured,
      isEnabled: maskedConfig.isEnabled,
      config: maskedConfig,
    });
  } catch (error) {
    console.error('Error fetching Bouncie config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/admin/integrations/bouncie
 * Update Bouncie configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validate and sanitize input
    const updateData: Record<string, unknown> = {};

    // Feature toggles
    if (typeof body.isEnabled === 'boolean') {
      updateData.isEnabled = body.isEnabled;
    }
    if (typeof body.enableRealTimeTracking === 'boolean') {
      updateData.enableRealTimeTracking = body.enableRealTimeTracking;
    }
    if (typeof body.enableGeofencing === 'boolean') {
      updateData.enableGeofencing = body.enableGeofencing;
    }
    if (typeof body.enableDiagnostics === 'boolean') {
      updateData.enableDiagnostics = body.enableDiagnostics;
    }
    if (typeof body.enableDriverBehavior === 'boolean') {
      updateData.enableDriverBehavior = body.enableDriverBehavior;
    }
    if (typeof body.enableMileageTracking === 'boolean') {
      updateData.enableMileageTracking = body.enableMileageTracking;
    }
    if (typeof body.enableFuelMonitoring === 'boolean') {
      updateData.enableFuelMonitoring = body.enableFuelMonitoring;
    }
    if (typeof body.enableMaintenanceAlerts === 'boolean') {
      updateData.enableMaintenanceAlerts = body.enableMaintenanceAlerts;
    }
    if (typeof body.enableAutoStatusUpdate === 'boolean') {
      updateData.enableAutoStatusUpdate = body.enableAutoStatusUpdate;
    }

    // Sync settings
    if (typeof body.locationUpdateInterval === 'number') {
      updateData.locationUpdateInterval = Math.max(5, Math.min(300, body.locationUpdateInterval));
    }
    if (typeof body.diagnosticsSyncInterval === 'number') {
      updateData.diagnosticsSyncInterval = Math.max(60, Math.min(3600, body.diagnosticsSyncInterval));
    }
    if (typeof body.geofenceRadiusMeters === 'number') {
      updateData.geofenceRadiusMeters = Math.max(25, Math.min(500, body.geofenceRadiusMeters));
    }

    // Credentials (only update if provided)
    if (body.clientId && typeof body.clientId === 'string') {
      updateData.clientId = body.clientId;
    }
    if (body.clientSecret && typeof body.clientSecret === 'string') {
      updateData.clientSecret = body.clientSecret;
    }
    if (body.authorizationCode && typeof body.authorizationCode === 'string') {
      updateData.authorizationCode = body.authorizationCode;
    }
    if (body.redirectUrl && typeof body.redirectUrl === 'string') {
      updateData.redirectUrl = body.redirectUrl;
    }

    const config = await bouncieService.saveConfig(updateData as never);

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      isEnabled: config.isEnabled,
      syncStatus: config.syncStatus,
    });
  } catch (error) {
    console.error('Error updating Bouncie config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/admin/integrations/bouncie
 * Test connection or sync devices
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const action = body.action as string;

    switch (action) {
      case 'test': {
        // Test connection with provided credentials
        const credentials: BouncieCredentials = {
          clientId: body.clientId,
          clientSecret: body.clientSecret,
          authorizationCode: body.authorizationCode,
          redirectUrl: body.redirectUrl,
        };

        if (!credentials.clientId || !credentials.clientSecret || !credentials.authorizationCode) {
          return NextResponse.json(
            { error: 'Missing required credentials' },
            { status: 400 }
          );
        }

        const result = await bouncieService.testConnection(credentials);

        return NextResponse.json({
          success: result.success,
          error: result.error,
          vehicleCount: result.vehicleCount,
        });
      }

      case 'sync': {
        // Sync devices from Bouncie
        const result = await bouncieService.syncDevices();

        return NextResponse.json({
          success: result.errors.length === 0,
          synced: result.synced,
          errors: result.errors,
        });
      }

      case 'register-webhook': {
        // Register webhook with Bouncie
        const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
        const webhookUrl = `${baseUrl}/api/v1/webhooks/bouncie`;

        const success = await bouncieService.registerWebhook(webhookUrl);

        return NextResponse.json({
          success,
          webhookUrl: success ? webhookUrl : null,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Bouncie action:', error);
    return NextResponse.json(
      { error: 'Action failed' },
      { status: 500 }
    );
  }
}

/**
 * Mask a secret string for display
 */
function maskSecret(secret: string): string {
  if (secret.length <= 8) {
    return '****';
  }
  return secret.substring(0, 4) + '****' + secret.substring(secret.length - 4);
}
