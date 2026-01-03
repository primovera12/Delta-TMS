import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { TripStatus, InvoiceStatus } from '@prisma/client';

/**
 * GET /api/v1/reports - Generate report data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trips';
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const format = searchParams.get('format') || 'json';

    const validTypes = ['trips', 'revenue', 'drivers', 'operations'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid report type. Must be one of: ${validTypes.join(', ')}`,
      }, { status: 400 });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let reportData;

    switch (type) {
      case 'trips':
        reportData = await generateTripsReport(start, end);
        break;
      case 'revenue':
        reportData = await generateRevenueReport(start, end);
        break;
      case 'drivers':
        reportData = await generateDriversReport(start, end);
        break;
      case 'operations':
        reportData = await generateOperationsReport(start, end);
        break;
      default:
        reportData = { type: 'unknown', error: 'Unknown report type' };
    }

    // Handle different output formats
    if (format === 'csv') {
      return NextResponse.json({
        success: true,
        message: 'CSV export would be generated here',
        downloadUrl: `/api/v1/reports/download?type=${type}&startDate=${startDate}&endDate=${endDate}&format=csv`,
      });
    }

    if (format === 'pdf') {
      return NextResponse.json({
        success: true,
        message: 'PDF export would be generated here',
        downloadUrl: `/api/v1/reports/download?type=${type}&startDate=${startDate}&endDate=${endDate}&format=pdf`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        period: { startDate, endDate },
        ...reportData,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate report',
    }, { status: 500 });
  }
}

/**
 * Generate trips report from database
 */
async function generateTripsReport(start: Date, end: Date) {
  const [
    totalTrips,
    completedTrips,
    cancelledTrips,
    noShowTrips,
    tripsByVehicleType,
    tripsByFacility,
  ] = await Promise.all([
    prisma.trip.count({
      where: { scheduledPickupTime: { gte: start, lte: end } },
    }),
    prisma.trip.count({
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        status: TripStatus.COMPLETED,
      },
    }),
    prisma.trip.count({
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        status: TripStatus.CANCELLED,
      },
    }),
    prisma.trip.count({
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        status: TripStatus.NO_SHOW,
      },
    }),
    prisma.trip.groupBy({
      by: ['vehicleType'],
      where: { scheduledPickupTime: { gte: start, lte: end } },
      _count: true,
      _sum: { totalFare: true },
    }),
    prisma.trip.groupBy({
      by: ['facilityId'],
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        facilityId: { not: null },
      },
      _count: true,
      _sum: { totalFare: true },
    }),
  ]);

  // Get facility names
  const facilityIds = tripsByFacility.map(f => f.facilityId).filter(Boolean) as string[];
  const facilities = await prisma.facility.findMany({
    where: { id: { in: facilityIds } },
    select: { id: true, name: true },
  });
  const facilityMap = new Map(facilities.map(f => [f.id, f.name]));

  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const completionRate = totalTrips > 0 ? (completedTrips / totalTrips) * 100 : 0;

  return {
    type: 'trips',
    summary: {
      totalTrips,
      completedTrips,
      cancelledTrips,
      noShowTrips,
      completionRate: Math.round(completionRate * 10) / 10,
      averageTripsPerDay: Math.round(totalTrips / daysDiff),
    },
    byStatus: [
      { status: 'completed', count: completedTrips, percentage: Math.round((completedTrips / totalTrips) * 1000) / 10 || 0 },
      { status: 'cancelled', count: cancelledTrips, percentage: Math.round((cancelledTrips / totalTrips) * 1000) / 10 || 0 },
      { status: 'no_show', count: noShowTrips, percentage: Math.round((noShowTrips / totalTrips) * 1000) / 10 || 0 },
    ],
    byVehicleType: tripsByVehicleType.map(v => ({
      type: v.vehicleType.toLowerCase().replace(/_/g, '-'),
      count: v._count,
      percentage: Math.round((v._count / totalTrips) * 1000) / 10 || 0,
      revenue: v._sum.totalFare || 0,
    })),
    byFacility: tripsByFacility.slice(0, 10).map(f => ({
      id: f.facilityId,
      name: facilityMap.get(f.facilityId!) || 'Unknown',
      trips: f._count,
      revenue: f._sum.totalFare || 0,
    })),
  };
}

/**
 * Generate revenue report from database
 */
async function generateRevenueReport(start: Date, end: Date) {
  const [
    invoices,
    paidInvoices,
    overdueInvoices,
    invoicesByFacility,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: { createdAt: { gte: start, lte: end } },
      _sum: { totalAmount: true, amountPaid: true, amountDue: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        status: InvoiceStatus.PAID,
      },
      _sum: { totalAmount: true },
    }),
    prisma.invoice.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        status: InvoiceStatus.OVERDUE,
      },
      _sum: { totalAmount: true },
    }),
    prisma.invoice.groupBy({
      by: ['facilityId'],
      where: { createdAt: { gte: start, lte: end } },
      _sum: { totalAmount: true, amountPaid: true, amountDue: true },
    }),
  ]);

  // Get facility names
  const facilityIds = invoicesByFacility.map(f => f.facilityId);
  const facilities = await prisma.facility.findMany({
    where: { id: { in: facilityIds } },
    select: { id: true, name: true },
  });
  const facilityMap = new Map(facilities.map(f => [f.id, f.name]));

  const totalRevenue = invoices._sum.totalAmount || 0;
  const collectedRevenue = invoices._sum.amountPaid || 0;
  const outstandingRevenue = invoices._sum.amountDue || 0;
  const collectionRate = totalRevenue > 0 ? (collectedRevenue / totalRevenue) * 100 : 0;
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  // Get trip count for average calculation
  const tripCount = await prisma.trip.count({
    where: {
      scheduledPickupTime: { gte: start, lte: end },
      status: TripStatus.COMPLETED,
    },
  });

  return {
    type: 'revenue',
    summary: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      collectedRevenue: Math.round(collectedRevenue * 100) / 100,
      outstandingRevenue: Math.round(outstandingRevenue * 100) / 100,
      collectionRate: Math.round(collectionRate * 10) / 10,
      averageRevenuePerTrip: tripCount > 0 ? Math.round((totalRevenue / tripCount) * 100) / 100 : 0,
      averageRevenuePerDay: Math.round((totalRevenue / daysDiff) * 100) / 100,
    },
    byPaymentStatus: [
      { status: 'collected', amount: collectedRevenue, percentage: Math.round((collectedRevenue / totalRevenue) * 1000) / 10 || 0 },
      { status: 'pending', amount: outstandingRevenue - (overdueInvoices._sum.totalAmount || 0), percentage: Math.round(((outstandingRevenue - (overdueInvoices._sum.totalAmount || 0)) / totalRevenue) * 1000) / 10 || 0 },
      { status: 'overdue', amount: overdueInvoices._sum.totalAmount || 0, percentage: Math.round(((overdueInvoices._sum.totalAmount || 0) / totalRevenue) * 1000) / 10 || 0 },
    ],
    byFacility: invoicesByFacility.slice(0, 10).map(f => ({
      id: f.facilityId,
      name: facilityMap.get(f.facilityId) || 'Unknown',
      billed: f._sum.totalAmount || 0,
      collected: f._sum.amountPaid || 0,
      outstanding: f._sum.amountDue || 0,
    })),
  };
}

/**
 * Generate drivers report from database
 */
async function generateDriversReport(start: Date, end: Date) {
  const [
    totalDrivers,
    activeDrivers,
    driverTrips,
  ] = await Promise.all([
    prisma.driverProfile.count(),
    prisma.driverProfile.count({
      where: {
        trips: {
          some: {
            scheduledPickupTime: { gte: start, lte: end },
          },
        },
      },
    }),
    prisma.trip.groupBy({
      by: ['driverId'],
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        driverId: { not: null },
        status: TripStatus.COMPLETED,
      },
      _count: true,
    }),
  ]);

  // Get driver details
  const driverIds = driverTrips.map(d => d.driverId).filter(Boolean) as string[];
  const drivers = await prisma.driverProfile.findMany({
    where: { id: { in: driverIds } },
    include: {
      user: {
        select: { firstName: true, lastName: true },
      },
    },
  });
  const driverMap = new Map(drivers.map(d => [d.id, `${d.user.firstName} ${d.user.lastName}`]));

  const totalTrips = driverTrips.reduce((sum, d) => sum + d._count, 0);

  // Get compliance stats
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [expiredDocs, expiringDocs] = await Promise.all([
    prisma.driverDocument.count({
      where: { expiryDate: { lt: now } },
    }),
    prisma.driverDocument.count({
      where: {
        expiryDate: { gte: now, lte: thirtyDaysFromNow },
      },
    }),
  ]);

  return {
    type: 'drivers',
    summary: {
      totalDrivers,
      activeDrivers,
      totalTrips,
      averageTripsPerDriver: activeDrivers > 0 ? Math.round(totalTrips / activeDrivers) : 0,
      totalHours: 0, // Would need timesheet data
      averageRating: 0, // Would need rating data
    },
    driverPerformance: driverTrips.slice(0, 10).map((d, i) => ({
      id: d.driverId,
      name: driverMap.get(d.driverId!) || 'Unknown',
      trips: d._count,
      hours: 0,
      rating: 0,
      onTimeRate: 0,
    })),
    complianceStatus: {
      fullCompliance: totalDrivers - expiredDocs,
      expiringDocuments: expiringDocs,
      expiredDocuments: expiredDocs,
    },
  };
}

/**
 * Generate operations report from database
 */
async function generateOperationsReport(start: Date, end: Date) {
  const [
    completedTrips,
    cancelledTrips,
    noShowTrips,
    tripsByHour,
  ] = await Promise.all([
    prisma.trip.count({
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        status: TripStatus.COMPLETED,
      },
    }),
    prisma.trip.count({
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        status: TripStatus.CANCELLED,
      },
    }),
    prisma.trip.count({
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        status: TripStatus.NO_SHOW,
      },
    }),
    // Get trips by hour for peak analysis
    prisma.trip.findMany({
      where: {
        scheduledPickupTime: { gte: start, lte: end },
        status: TripStatus.COMPLETED,
      },
      select: { scheduledPickupTime: true },
    }),
  ]);

  // Calculate peak hours
  const hourCounts: Record<number, number> = {};
  tripsByHour.forEach(trip => {
    const hour = trip.scheduledPickupTime.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const peakHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, count]) => ({
      hour: `${hour}:00-${parseInt(hour) + 1}:00`,
      trips: count,
      utilization: Math.round((count / completedTrips) * 100),
    }));

  // Complaints and incidents would need separate models
  const complaints = 0;
  const incidents = 0;

  const totalTrips = completedTrips + cancelledTrips + noShowTrips;

  return {
    type: 'operations',
    summary: {
      onTimePickupRate: 0, // Would need actual vs scheduled comparison
      onTimeDropoffRate: 0,
      averageWaitTime: 0,
      averageTripDuration: 0,
      utilizationRate: 0,
    },
    performanceMetrics: {
      pickupPerformance: [
        { range: 'On Time (±5 min)', count: completedTrips, percentage: totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0 },
        { range: 'Cancelled', count: cancelledTrips, percentage: totalTrips > 0 ? Math.round((cancelledTrips / totalTrips) * 100) : 0 },
        { range: 'No Show', count: noShowTrips, percentage: totalTrips > 0 ? Math.round((noShowTrips / totalTrips) * 100) : 0 },
      ],
      peakHours,
    },
    issues: {
      cancellations: cancelledTrips,
      noShows: noShowTrips,
      complaints,
      accidents: incidents,
    },
  };
}

/**
 * POST /api/v1/reports - Schedule a report
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, frequency, recipients, filters } = body;

    if (!type || !name || !frequency || !recipients?.length) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: type, name, frequency, recipients',
      }, { status: 400 });
    }

    // In a real implementation, save to database
    const scheduledReport = {
      id: `RPT-${Date.now().toString(36).toUpperCase()}`,
      type,
      name,
      frequency,
      recipients,
      filters: filters || {},
      nextRun: calculateNextRun(frequency),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: scheduledReport,
      message: 'Scheduled report created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating scheduled report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create scheduled report',
    }, { status: 500 });
  }
}

function calculateNextRun(frequency: string): string {
  const now = new Date();

  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      now.setHours(6, 0, 0, 0);
      break;
    case 'weekly':
      now.setDate(now.getDate() + (7 - now.getDay() + 1) % 7 + 1);
      now.setHours(6, 0, 0, 0);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      now.setDate(1);
      now.setHours(6, 0, 0, 0);
      break;
    default:
      now.setDate(now.getDate() + 1);
  }

  return now.toISOString();
}
