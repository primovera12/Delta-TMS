import { NextRequest, NextResponse } from 'next/server';

// Generate mock report data based on type and date range
const generateReportData = (type: string, startDate: string, endDate: string) => {
  const baseData = {
    generatedAt: new Date().toISOString(),
    period: { startDate, endDate },
  };

  switch (type) {
    case 'trips':
      return {
        ...baseData,
        type: 'trips',
        summary: {
          totalTrips: 1250,
          completedTrips: 1180,
          cancelledTrips: 45,
          noShowTrips: 25,
          completionRate: 94.4,
          averageTripsPerDay: 42,
        },
        byStatus: [
          { status: 'completed', count: 1180, percentage: 94.4 },
          { status: 'cancelled', count: 45, percentage: 3.6 },
          { status: 'no_show', count: 25, percentage: 2.0 },
        ],
        byVehicleType: [
          { type: 'wheelchair', count: 620, percentage: 49.6, revenue: 52700 },
          { type: 'ambulatory', count: 380, percentage: 30.4, revenue: 24700 },
          { type: 'stretcher', count: 200, percentage: 16.0, revenue: 26000 },
          { type: 'bariatric', count: 50, percentage: 4.0, revenue: 7500 },
        ],
        byFacility: [
          { id: 'FAC-001', name: 'Memorial Hospital', trips: 350, revenue: 29750 },
          { id: 'FAC-002', name: 'City Dialysis Center', trips: 420, revenue: 31500 },
          { id: 'FAC-003', name: 'Regional Medical Center', trips: 220, revenue: 18700 },
          { id: 'FAC-004', name: 'Heart Care Clinic', trips: 160, revenue: 13600 },
          { id: 'FAC-005', name: 'Cancer Treatment Center', trips: 100, revenue: 8500 },
        ],
        dailyBreakdown: generateDailyData(startDate, endDate, 'trips'),
      };

    case 'revenue':
      return {
        ...baseData,
        type: 'revenue',
        summary: {
          totalRevenue: 111900,
          collectedRevenue: 98250,
          outstandingRevenue: 13650,
          collectionRate: 87.8,
          averageRevenuePerTrip: 89.52,
          averageRevenuePerDay: 3730,
        },
        byPaymentStatus: [
          { status: 'collected', amount: 98250, percentage: 87.8 },
          { status: 'pending', amount: 8500, percentage: 7.6 },
          { status: 'overdue', amount: 5150, percentage: 4.6 },
        ],
        byFacility: [
          { id: 'FAC-001', name: 'Memorial Hospital', billed: 29750, collected: 26500, outstanding: 3250 },
          { id: 'FAC-002', name: 'City Dialysis Center', billed: 31500, collected: 28000, outstanding: 3500 },
          { id: 'FAC-003', name: 'Regional Medical Center', billed: 18700, collected: 15200, outstanding: 3500 },
          { id: 'FAC-004', name: 'Heart Care Clinic', billed: 13600, collected: 13600, outstanding: 0 },
          { id: 'FAC-005', name: 'Cancer Treatment Center', billed: 8500, collected: 6450, outstanding: 2050 },
        ],
        dailyBreakdown: generateDailyData(startDate, endDate, 'revenue'),
      };

    case 'drivers':
      return {
        ...baseData,
        type: 'drivers',
        summary: {
          totalDrivers: 15,
          activeDrivers: 12,
          totalTrips: 1180,
          averageTripsPerDriver: 98,
          totalHours: 2450,
          averageRating: 4.7,
        },
        driverPerformance: [
          { id: 'DRV-001', name: 'John Smith', trips: 145, hours: 285, rating: 4.9, onTimeRate: 97 },
          { id: 'DRV-002', name: 'Mike Johnson', trips: 132, hours: 260, rating: 4.8, onTimeRate: 95 },
          { id: 'DRV-003', name: 'Sarah Williams', trips: 128, hours: 250, rating: 4.7, onTimeRate: 96 },
          { id: 'DRV-004', name: 'David Lee', trips: 115, hours: 225, rating: 4.6, onTimeRate: 93 },
          { id: 'DRV-005', name: 'Emily Davis', trips: 108, hours: 210, rating: 4.8, onTimeRate: 98 },
        ],
        complianceStatus: {
          fullCompliance: 10,
          expiringDocuments: 3,
          expiredDocuments: 2,
        },
      };

    case 'operations':
      return {
        ...baseData,
        type: 'operations',
        summary: {
          onTimePickupRate: 94.2,
          onTimeDropoffRate: 92.8,
          averageWaitTime: 8.5,
          averageTripDuration: 32,
          utilizationRate: 78.5,
        },
        performanceMetrics: {
          pickupPerformance: [
            { range: 'On Time (±5 min)', count: 1110, percentage: 94.2 },
            { range: 'Slightly Late (5-15 min)', count: 52, percentage: 4.4 },
            { range: 'Late (>15 min)', count: 18, percentage: 1.5 },
          ],
          peakHours: [
            { hour: '8-9 AM', trips: 185, utilization: 95 },
            { hour: '9-10 AM', trips: 165, utilization: 88 },
            { hour: '1-2 PM', trips: 145, utilization: 78 },
            { hour: '2-3 PM', trips: 155, utilization: 82 },
            { hour: '3-4 PM', trips: 175, utilization: 92 },
          ],
        },
        issues: {
          cancellations: 45,
          noShows: 25,
          complaints: 8,
          accidents: 0,
        },
      };

    default:
      return {
        ...baseData,
        type: 'unknown',
        error: 'Unknown report type',
      };
  }
};

const generateDailyData = (startDate: string, endDate: string, type: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const baseValue = type === 'revenue' ? 3500 : 40;
    const variance = Math.random() * 0.4 - 0.2; // ±20% variance

    days.push({
      date: d.toISOString().split('T')[0],
      value: Math.round(baseValue * (1 + variance)),
    });
  }

  return days;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type') || 'trips';
  const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
  const format = searchParams.get('format') || 'json';

  // Validate report type
  const validTypes = ['trips', 'revenue', 'drivers', 'operations', 'compliance'];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid report type. Must be one of: ${validTypes.join(', ')}`,
      },
      { status: 400 }
    );
  }

  // Generate report data
  const reportData = generateReportData(type, startDate, endDate);

  // Handle different output formats
  if (format === 'csv') {
    // In a real implementation, convert to CSV format
    return NextResponse.json({
      success: true,
      message: 'CSV export would be generated here',
      downloadUrl: `/api/v1/reports/download?type=${type}&startDate=${startDate}&endDate=${endDate}&format=csv`,
    });
  }

  if (format === 'pdf') {
    // In a real implementation, generate PDF
    return NextResponse.json({
      success: true,
      message: 'PDF export would be generated here',
      downloadUrl: `/api/v1/reports/download?type=${type}&startDate=${startDate}&endDate=${endDate}&format=pdf`,
    });
  }

  return NextResponse.json({
    success: true,
    data: reportData,
  });
}

// Schedule a report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      type,
      name,
      frequency,
      recipients,
      filters,
    } = body;

    // Validate required fields
    if (!type || !name || !frequency || !recipients?.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, name, frequency, recipients',
        },
        { status: 400 }
      );
    }

    // Create scheduled report
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
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create scheduled report',
      },
      { status: 500 }
    );
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
