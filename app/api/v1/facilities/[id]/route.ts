import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { TripStatus, InvoiceStatus } from '@prisma/client';

// GET /api/v1/facilities/[id] - Get facility details
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
        { success: false, error: 'Facility ID is required' },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        staff: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        _count: {
          select: {
            trips: true,
            invoices: true,
            patients: true,
          },
        },
      },
    });

    if (!facility) {
      return NextResponse.json(
        { success: false, error: 'Facility not found' },
        { status: 404 }
      );
    }

    // Get trip stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [thisMonthTrips, lastMonthTrips, revenueStats, outstandingInvoices] = await Promise.all([
      prisma.trip.count({
        where: {
          facilityId: id,
          scheduledPickupTime: { gte: startOfMonth },
        },
      }),
      prisma.trip.count({
        where: {
          facilityId: id,
          scheduledPickupTime: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.invoice.aggregate({
        where: {
          facilityId: id,
          periodStart: { gte: startOfMonth },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.invoice.aggregate({
        where: {
          facilityId: id,
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE, InvoiceStatus.PARTIALLY_PAID] },
        },
        _sum: {
          amountDue: true,
        },
      }),
    ]);

    // Transform for frontend
    const users = facility.staff.map((s) => ({
      id: s.user.id,
      name: `${s.user.firstName} ${s.user.lastName}`,
      email: s.user.email,
      title: s.title || 'Staff',
    }));

    const primaryContact = facility.staff[0];

    const transformedFacility = {
      id: facility.id,
      name: facility.name,
      type: facility.type,
      address: facility.addressLine1,
      addressLine2: facility.addressLine2,
      city: facility.city,
      state: facility.state,
      zip: facility.zipCode,
      coordinates: facility.latitude && facility.longitude
        ? { lat: facility.latitude, lng: facility.longitude }
        : null,
      contact: {
        name: primaryContact
          ? `${primaryContact.user.firstName} ${primaryContact.user.lastName}`
          : facility.billingContactName || '',
        title: primaryContact?.title || 'Transportation Coordinator',
        email: primaryContact?.user.email || facility.email || '',
        phone: primaryContact?.user.phone || facility.phone || '',
      },
      billing: {
        email: facility.billingEmail || '',
        paymentTerms: `net${facility.paymentTermDays}`,
      },
      status: facility.isActive ? 'active' : 'inactive',
      stats: {
        totalTrips: facility._count.trips,
        thisMonth: thisMonthTrips,
        lastMonth: lastMonthTrips,
        avgTripsPerDay: thisMonthTrips / Math.max(now.getDate(), 1),
        revenueThisMonth: revenueStats._sum.totalAmount || 0,
        outstandingBalance: outstandingInvoices._sum.amountDue || 0,
      },
      users,
      notes: facility.notes || facility.entranceInstructions || null,
      entranceInstructions: facility.entranceInstructions,
      parkingInstructions: facility.parkingInstructions,
      createdAt: facility.createdAt.toISOString(),
      updatedAt: facility.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: transformedFacility,
    });
  } catch (error) {
    console.error('Error fetching facility:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/facilities/[id] - Update facility
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
        { success: false, error: 'Facility ID is required' },
        { status: 400 }
      );
    }

    // Check if facility exists
    const existingFacility = await prisma.facility.findUnique({
      where: { id },
    });

    if (!existingFacility) {
      return NextResponse.json(
        { success: false, error: 'Facility not found' },
        { status: 404 }
      );
    }

    const {
      name,
      type,
      address,
      addressLine2,
      city,
      state,
      zip,
      phone,
      email,
      contact,
      billing,
      status,
      notes,
      entranceInstructions,
      parkingInstructions,
    } = body;

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (address) updateData.addressLine1 = address;
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (zip) updateData.zipCode = zip;
    if (phone) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (status) updateData.isActive = status === 'active';
    if (notes !== undefined) updateData.notes = notes;
    if (entranceInstructions !== undefined) updateData.entranceInstructions = entranceInstructions;
    if (parkingInstructions !== undefined) updateData.parkingInstructions = parkingInstructions;

    // Handle contact updates
    if (contact) {
      if (contact.name) updateData.billingContactName = contact.name;
      if (contact.phone) updateData.billingContactPhone = contact.phone;
    }

    // Handle billing updates
    if (billing) {
      if (billing.email) updateData.billingEmail = billing.email;
      if (billing.paymentTerms) {
        const days = parseInt(billing.paymentTerms.replace('net', ''));
        if (!isNaN(days)) updateData.paymentTermDays = days;
      }
    }

    const facility = await prisma.facility.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: facility.id,
        name: facility.name,
        type: facility.type,
        status: facility.isActive ? 'active' : 'inactive',
        updatedAt: facility.updatedAt.toISOString(),
      },
      message: 'Facility updated successfully',
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update facility' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/facilities/[id] - Delete/deactivate facility
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
        { success: false, error: 'Facility ID is required' },
        { status: 400 }
      );
    }

    // Check if facility exists with active trips/invoices
    const existingFacility = await prisma.facility.findUnique({
      where: { id },
    });

    if (!existingFacility) {
      return NextResponse.json(
        { success: false, error: 'Facility not found' },
        { status: 404 }
      );
    }

    // Count active trips
    const activeTripsCount = await prisma.trip.count({
      where: {
        facilityId: id,
        status: {
          in: [TripStatus.PENDING, TripStatus.CONFIRMED, TripStatus.ASSIGNED, TripStatus.DRIVER_EN_ROUTE, TripStatus.IN_PROGRESS],
        },
      },
    });

    // Count unpaid invoices
    const unpaidInvoicesCount = await prisma.invoice.count({
      where: {
        facilityId: id,
        status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
      },
    });

    // Check for active trips or unpaid invoices
    if (activeTripsCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete facility with ${activeTripsCount} active trips`,
      }, { status: 400 });
    }

    if (unpaidInvoicesCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete facility with ${unpaidInvoicesCount} unpaid invoices`,
      }, { status: 400 });
    }

    // Soft delete - mark as inactive
    await prisma.facility.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Facility ${existingFacility.name} deactivated successfully`,
    });
  } catch (error) {
    console.error('Error deleting facility:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete facility' },
      { status: 500 }
    );
  }
}
