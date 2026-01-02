'use client';

import * as React from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Car,
  Users,
  Clock,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/domain/stat-card';

// Mock data
const overviewStats = {
  totalTrips: 3240,
  totalRevenue: 128450,
  activeDrivers: 42,
  avgTripRating: 4.7,
  onTimeRate: 94.2,
  avgTripDuration: 28,
};

const monthlyData = [
  { month: 'Jul', trips: 2850, revenue: 98500 },
  { month: 'Aug', trips: 2920, revenue: 102300 },
  { month: 'Sep', trips: 3050, revenue: 108900 },
  { month: 'Oct', trips: 3180, revenue: 115600 },
  { month: 'Nov', trips: 3100, revenue: 112400 },
  { month: 'Dec', trips: 3240, revenue: 128450 },
];

const tripsByType = [
  { type: 'Ambulatory', count: 1450, percentage: 45 },
  { type: 'Wheelchair', count: 1100, percentage: 34 },
  { type: 'Stretcher', count: 520, percentage: 16 },
  { type: 'Bariatric', count: 170, percentage: 5 },
];

const topDrivers = [
  { name: 'John Smith', trips: 145, rating: 4.9, revenue: 8520 },
  { name: 'Sarah Williams', trips: 138, rating: 4.8, revenue: 7890 },
  { name: 'Mike Johnson', trips: 132, rating: 4.9, revenue: 7650 },
  { name: 'Lisa Chen', trips: 128, rating: 4.7, revenue: 7420 },
  { name: 'David Lee', trips: 125, rating: 4.8, revenue: 7180 },
];

const topFacilities = [
  { name: 'Memorial Hospital', trips: 420, revenue: 24500 },
  { name: 'City Dialysis Center', trips: 385, revenue: 18200 },
  { name: 'Senior Care Facility', trips: 310, revenue: 15800 },
  { name: 'General Hospital', trips: 285, revenue: 16400 },
  { name: 'Heart Center', trips: 240, revenue: 14200 },
];

const recentReports = [
  {
    id: '1',
    name: 'Monthly Operations Report',
    type: 'operations',
    date: '2026-01-01',
    status: 'ready',
  },
  {
    id: '2',
    name: 'Driver Performance Q4 2025',
    type: 'performance',
    date: '2026-01-01',
    status: 'ready',
  },
  {
    id: '3',
    name: 'Financial Summary December',
    type: 'financial',
    date: '2026-01-01',
    status: 'ready',
  },
  {
    id: '4',
    name: 'Compliance Audit Report',
    type: 'compliance',
    date: '2025-12-15',
    status: 'ready',
  },
];

const reportTypes = [
  { id: 'operations', name: 'Operations Report', icon: BarChart3 },
  { id: 'financial', name: 'Financial Report', icon: DollarSign },
  { id: 'drivers', name: 'Driver Performance', icon: Users },
  { id: 'facilities', name: 'Facility Report', icon: FileText },
  { id: 'compliance', name: 'Compliance Report', icon: FileText },
  { id: 'custom', name: 'Custom Report', icon: PieChart },
];

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = React.useState('this_month');
  const maxTrips = Math.max(...monthlyData.map((d) => d.trips));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">View performance metrics and generate reports</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-44">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_quarter">This Quarter</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Trips"
          value={overviewStats.totalTrips.toLocaleString()}
          change={12}
          trend="up"
          icon={<Car className="h-6 w-6" />}
        />
        <StatCard
          title="Revenue"
          value={`$${overviewStats.totalRevenue.toLocaleString()}`}
          change={15}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Active Drivers"
          value={overviewStats.activeDrivers}
          change={5}
          trend="up"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Avg Rating"
          value={overviewStats.avgTripRating}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="On-Time Rate"
          value={`${overviewStats.onTimeRate}%`}
          change={2}
          trend="up"
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Avg Duration"
          value={`${overviewStats.avgTripDuration}m`}
          icon={<Clock className="h-6 w-6" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center mb-2">
                    <span className="text-xs text-gray-500">{month.trips}</span>
                  </div>
                  <div
                    className="w-full bg-primary-500 rounded-t-lg transition-all"
                    style={{
                      height: `${(month.trips / maxTrips) * 180}px`,
                    }}
                  />
                  <span className="mt-2 text-sm text-gray-600">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trips by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Trips by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tripsByType.map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{item.type}</span>
                    <span className="text-gray-500">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Drivers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Drivers</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <div
                  key={driver.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{driver.trips} trips</span>
                        <span>•</span>
                        <span>{driver.rating} rating</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${driver.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Facilities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Facilities</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFacilities.map((facility, index) => (
                <div
                  key={facility.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center text-sm font-bold text-success-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{facility.name}</p>
                      <p className="text-sm text-gray-500">{facility.trips} trips</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${facility.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                >
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">Generate PDF/Excel</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Reports</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">Generated {report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{report.status}</Badge>
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
