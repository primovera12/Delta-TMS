/**
 * Bouncie Device Management API
 *
 * GET    - Get device details
 * POST   - Link device to vehicle
 * DELETE - Unlink device from vehicle
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { bouncieService } from '@/lib/services/bouncie';
import { prisma } from '@/lib/db';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'];

interface RouteParams {
  params: Promise<{ imei: string }>;
}

/**
 * GET /api/v1/admin/integrations/bouncie/devices/[imei]
 * Get device details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { imei } = await params;

    const device = await prisma.bouncieDevice.findUnique({
      where: { imei },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            vehicleType: true,
            driver: {
              select: {
                id: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        events: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        trips: {
          orderBy: { startedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({ device });
  } catch (error) {
    console.error('Error fetching device:', error);
    return NextResponse.json(
      { error: 'Failed to fetch device' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/admin/integrations/bouncie/devices/[imei]
 * Link device to a vehicle
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { imei } = await params;
    const body = await request.json();
    const { vehicleId } = body;

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'vehicleId is required' },
        { status: 400 }
      );
    }

    // Verify device exists
    const device = await bouncieService.getDeviceByImei(imei);
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Verify vehicle exists and is not already linked
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { bouncieDevice: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    if (vehicle.bouncieDevice && vehicle.bouncieDevice.imei !== imei) {
      return NextResponse.json(
        { error: 'Vehicle is already linked to another device' },
        { status: 400 }
      );
    }

    // Link device to vehicle
    const updatedDevice = await bouncieService.linkDeviceToVehicle(imei, vehicleId);

    return NextResponse.json({
      success: true,
      message: 'Device linked successfully',
      device: {
        imei: updatedDevice.imei,
        nickname: updatedDevice.nickname,
        vehicleId: updatedDevice.vehicleId,
      },
    });
  } catch (error) {
    console.error('Error linking device:', error);
    return NextResponse.json(
      { error: 'Failed to link device' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/admin/integrations/bouncie/devices/[imei]
 * Unlink device from vehicle
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { imei } = await params;

    // Verify device exists
    const device = await bouncieService.getDeviceByImei(imei);
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    if (!device.vehicleId) {
      return NextResponse.json(
        { error: 'Device is not linked to any vehicle' },
        { status: 400 }
      );
    }

    // Unlink device
    await bouncieService.unlinkDevice(imei);

    return NextResponse.json({
      success: true,
      message: 'Device unlinked successfully',
    });
  } catch (error) {
    console.error('Error unlinking device:', error);
    return NextResponse.json(
      { error: 'Failed to unlink device' },
      { status: 500 }
    );
  }
}
