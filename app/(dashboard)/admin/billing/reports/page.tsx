'use client';

import * as React from 'react';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  FileText,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/domain/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const revenueData = {
  thisMonth: 125750.00,
  lastMonth: 112500.00,
  thisQuarter: 345250.00,
  lastQuarter: 310000.00,
  ytd: 125750.00,
};

const monthlyRevenue = [
  { month: 'Aug', revenue: 98500, collected: 95000 },
  { month: 'Sep', revenue: 105000, collected: 102000 },
  { month: 'Oct', revenue: 115000, collected: 110000 },
  { month: 'Nov', revenue: 108000, collected: 105500 },
  { month: 'Dec', revenue: 112500, collected: 108000 },
  { month: 'Jan', revenue: 125750, collected: 98250 },
];

const facilityRevenue = [
  { name: 'Memorial Hospital', revenue: 42500, percentage: 33.8, trips: 450 },
  { name: 'City Dialysis Center', revenue: 35250, percentage: 28.0, trips: 520 },
  { name: 'Regional Medical Center', revenue: 22000, percentage: 17.5, trips: 280 },
  { name: 'Heart Care Clinic', revenue: 15000, percentage: 11.9, trips: 180 },
  { name: 'Cancer Treatment Center', revenue: 11000, percentage: 8.8, trips: 140 },
];

const vehicleTypeRevenue = [
  { type: 'Wheelchair', revenue: 52500, percentage: 41.8, trips: 620 },
  { type: 'Ambulatory', revenue: 38250, percentage: 30.4, trips: 580 },
  { type: 'Stretcher', revenue: 28000, percentage: 22.3, trips: 240 },
  { type: 'Bariatric', revenue: 7000, percentage: 5.5, trips: 45 },
];

const agingReport = [
  { range: 'Current (0-30 days)', amount: 32750, invoices: 18, percentage: 72.4 },
  { range: '31-60 days', amount: 8500, invoices: 5, percentage: 18.8 },
  { range: '61-90 days', amount: 3000, invoices: 2, percentage: 6.6 },
  { range: 'Over 90 days', amount: 1000, invoices: 1, percentage: 2.2 },
];

const topPayingFacilities = [
  { name: 'Memorial Hospital', amount: 42500, onTime: 98, avgDays: 12 },
  { name: 'City Dialysis Center', amount: 35250, onTime: 95, avgDays: 14 },
  { name: 'Regional Medical Center', amount: 22000, onTime: 85, avgDays: 22 },
  { name: 'Heart Care Clinic', amount: 15000, onTime: 100, avgDays: 8 },
  { name: 'Cancer Treatment Center', amount: 11000, onTime: 92, avgDays: 16 },
];

export default function BillingReportsPage() {
  const [dateRange, setDateRange] = React.useState('this-month');

  const monthlyChange = ((revenueData.thisMonth - revenueData.lastMonth) / revenueData.lastMonth) * 100;
  const quarterlyChange = ((revenueData.thisQuarter - revenueData.lastQuarter) / revenueData.lastQuarter) * 100;
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));
  const totalAging = agingReport.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Billing Reports</h1>
          <p className="text-sm text-gray-500">Financial analytics and revenue insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue This Month"
          value={`$${revenueData.thisMonth.toLocaleString()}`}
          trend={monthlyChange >= 0 ? 'up' : 'down'}
          change={Math.round(monthlyChange)}
          changeLabel="vs last month"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Revenue This Quarter"
          value={`$${revenueData.thisQuarter.toLocaleString()}`}
          trend={quarterlyChange >= 0 ? 'up' : 'down'}
          change={Math.round(quarterlyChange)}
          changeLabel="vs last quarter"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Outstanding Balance"
          value={`$${totalAging.toLocaleString()}`}
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Collection Rate"
          value="94.2%"
          trend="up"
          change={2}
          changeLabel="vs last month"
          icon={<BarChart3 className="h-6 w-6" />}
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monthly Revenue</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary-500" />
              <span className="text-sm text-gray-500">Billed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success-500" />
              <span className="text-sm text-gray-500">Collected</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-4">
            {monthlyRevenue.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 justify-center">
                  <div className="text-xs text-gray-500">
                    ${(month.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="w-full flex gap-1">
                  <div
                    className="flex-1 bg-primary-500 rounded-t-lg transition-all"
                    style={{
                      height: `${(month.revenue / maxRevenue) * 180}px`,
                    }}
                  />
                  <div
                    className="flex-1 bg-success-500 rounded-t-lg transition-all"
                    style={{
                      height: `${(month.collected / maxRevenue) * 180}px`,
                    }}
                  />
                </div>
                <span className="mt-2 text-sm text-gray-600">{month.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="facility">
        <TabsList>
          <TabsTrigger value="facility">By Facility</TabsTrigger>
          <TabsTrigger value="vehicle">By Vehicle Type</TabsTrigger>
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
        </TabsList>

        <TabsContent value="facility" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Facility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {facilityRevenue.map((facility, index) => (
                  <div key={facility.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {facility.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          ${facility.revenue.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({facility.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${facility.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{facility.trips} trips</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Paying Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPayingFacilities.map((facility) => (
                    <div
                      key={facility.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{facility.name}</p>
                          <p className="text-sm text-gray-500">
                            Avg payment: {facility.avgDays} days
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${facility.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={facility.onTime >= 95 ? 'success' : facility.onTime >= 85 ? 'warning' : 'error'}
                          size="sm"
                        >
                          {facility.onTime}% on-time
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehicle" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Vehicle Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicleTypeRevenue.map((type) => (
                  <div key={type.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {type.type}
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          ${type.revenue.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({type.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{type.trips} trips</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Fare by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleTypeRevenue.map((type) => {
                    const avgFare = type.revenue / type.trips;
                    return (
                      <div
                        key={type.type}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{type.type}</p>
                          <p className="text-sm text-gray-500">{type.trips} trips</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${avgFare.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">avg per trip</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="aging" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Accounts Receivable Aging</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agingReport.map((range) => (
                    <div
                      key={range.range}
                      className="p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{range.range}</span>
                        <Badge
                          variant={
                            range.range.includes('Current')
                              ? 'success'
                              : range.range.includes('31-60')
                              ? 'warning'
                              : 'error'
                          }
                        >
                          {range.percentage}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          ${range.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {range.invoices} invoice{range.invoices !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            range.range.includes('Current')
                              ? 'bg-success-500'
                              : range.range.includes('31-60')
                              ? 'bg-warning-500'
                              : 'bg-error-500'
                          }`}
                          style={{ width: `${range.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Outstanding</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${totalAging.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-lg bg-success-50 border border-success-200">
                    <p className="text-sm text-success-700">Collected On-Time</p>
                    <p className="text-2xl font-bold text-success-900">92.4%</p>
                    <div className="flex items-center gap-1 text-sm text-success-600 mt-1">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>+3.2% vs last month</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
                    <p className="text-sm text-warning-700">Days Sales Outstanding</p>
                    <p className="text-2xl font-bold text-warning-900">18 days</p>
                    <div className="flex items-center gap-1 text-sm text-success-600 mt-1">
                      <ArrowDownRight className="h-4 w-4" />
                      <span>-2 days vs last month</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Collection Trend</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Paid within 15 days', value: 65 },
                      { label: 'Paid within 30 days', value: 25 },
                      { label: 'Paid after 30 days', value: 8 },
                      { label: 'Still Outstanding', value: 2 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <div className="w-32 flex justify-between text-sm">
                          <span className="text-gray-500">{item.label}</span>
                          <span className="font-medium text-gray-900">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
