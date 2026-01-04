import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { TripStatus, UserStatus, InvoiceStatus, DriverStatus } from '@prisma/client';

// GET /api/v1/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const portal = searchParams.get('portal') || 'admin';

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Common stats for all portals
    const [
      totalUsers,
      activeDrivers,
      totalFacilities,
      tripsThisMonth,
      tripsLastMonth,
      completedTripsThisMonth,
      pendingTrips,
      inProgressTrips,
      totalVehicles,
      activeVehicles,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.driverProfile.count({ where: { status: { not: DriverStatus.OFFLINE } } }),
      prisma.facility.count({ where: { isActive: true } }),
      prisma.trip.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.trip.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
      prisma.trip.count({ where: { status: TripStatus.COMPLETED, createdAt: { gte: startOfMonth } } }),
      prisma.trip.count({ where: { status: TripStatus.PENDING } }),
      prisma.trip.count({ where: { status: TripStatus.IN_PROGRESS } }),
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { isActive: true } }),
    ]);

    // Revenue calculations
    const revenueThisMonth = await prisma.trip.aggregate({
      where: {
        status: TripStatus.COMPLETED,
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalFare: true },
    });

    const revenueLastMonth = await prisma.trip.aggregate({
      where: {
        status: TripStatus.COMPLETED,
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
      _sum: { totalFare: true },
    });

    // Pending approvals (users pending verification)
    const pendingUsers = await prisma.user.findMany({
      where: { status: UserStatus.PENDING_VERIFICATION },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // Recent activity (recent trips)
    const recentTrips = await prisma.trip.findMany({
      select: {
        id: true,
        tripNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    });

    // Upcoming trips today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const tripsToday = await prisma.trip.count({
      where: {
        scheduledPickupTime: { gte: startOfDay, lte: endOfDay },
      },
    });

    // Calculate changes
    const tripChange = tripsLastMonth > 0
      ? Math.round(((tripsThisMonth - tripsLastMonth) / tripsLastMonth) * 100)
      : 0;

    const revenueChange = (revenueLastMonth._sum.totalFare || 0) > 0
      ? Math.round((((revenueThisMonth._sum.totalFare || 0) - (revenueLastMonth._sum.totalFare || 0)) / (revenueLastMonth._sum.totalFare || 1)) * 100)
      : 0;

    // Outstanding invoices
    const outstandingInvoices = await prisma.invoice.aggregate({
      where: {
        status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
      },
      _sum: { amountDue: true },
      _count: true,
    });

    const stats = {
      totalUsers,
      activeDrivers,
      totalFacilities,
      totalVehicles,
      activeVehicles,
      tripsThisMonth,
      tripChange,
      completedTripsThisMonth,
      pendingTrips,
      inProgressTrips,
      tripsToday,
      monthlyRevenue: revenueThisMonth._sum.totalFare || 0,
      revenueChange,
      outstandingInvoices: outstandingInvoices._sum.amountDue || 0,
      outstandingInvoiceCount: outstandingInvoices._count || 0,
      pendingApprovals: pendingUsers.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        type: u.role.toLowerCase().replace('_', ' '),
        submitted: getTimeAgo(u.createdAt),
      })),
      recentActivity: recentTrips.map(t => ({
        id: t.id,
        type: 'trip_' + t.status.toLowerCase(),
        message: `Trip ${t.tripNumber || t.id.substring(0, 8)} - ${formatStatus(t.status)}`,
        time: getTimeAgo(t.updatedAt),
      })),
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatStatus(status: TripStatus): string {
  const statusMap: Record<TripStatus, string> = {
    PENDING: 'Pending confirmation',
    CONFIRMED: 'Confirmed',
    ASSIGNED: 'Driver assigned',
    DRIVER_EN_ROUTE: 'Driver en route',
    DRIVER_ARRIVED: 'Driver arrived',
    IN_PROGRESS: 'In progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No show',
  };
  return statusMap[status] || status;
}
