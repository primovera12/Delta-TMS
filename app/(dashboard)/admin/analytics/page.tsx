'use client';

import * as React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  DollarSign,
  Clock,
  Calendar,
  MapPin,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Download,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Metric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

const metrics: Metric[] = [
  {
    label: 'Total Trips',
    value: '1,847',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: Car,
    color: 'bg-primary-100 text-primary-600',
  },
  {
    label: 'Active Patients',
    value: '342',
    change: 8.2,
    changeLabel: 'vs last month',
    icon: Users,
    color: 'bg-success-100 text-success-600',
  },
  {
    label: 'Revenue',
    value: '$47,250',
    change: 15.3,
    changeLabel: 'vs last month',
    icon: DollarSign,
    color: 'bg-warning-100 text-warning-600',
  },
  {
    label: 'Avg Trip Time',
    value: '32 min',
    change: -5.1,
    changeLabel: 'vs last month',
    icon: Clock,
    color: 'bg-info-100 text-info-600',
  },
];

const tripsByDay: ChartData[] = [
  { label: 'Mon', value: 245 },
  { label: 'Tue', value: 312 },
  { label: 'Wed', value: 287 },
  { label: 'Thu', value: 298 },
  { label: 'Fri', value: 342 },
  { label: 'Sat', value: 198 },
  { label: 'Sun', value: 165 },
];

const tripsByType: ChartData[] = [
  { label: 'Ambulatory', value: 45, color: 'bg-success-500' },
  { label: 'Wheelchair', value: 32, color: 'bg-primary-500' },
  { label: 'Stretcher', value: 15, color: 'bg-warning-500' },
  { label: 'Bariatric', value: 8, color: 'bg-purple-500' },
];

const revenueByMonth: ChartData[] = [
  { label: 'Jan', value: 32000 },
  { label: 'Feb', value: 35000 },
  { label: 'Mar', value: 38000 },
  { label: 'Apr', value: 42000 },
  { label: 'May', value: 45000 },
  { label: 'Jun', value: 47250 },
];

const topDrivers = [
  { name: 'John Smith', trips: 156, rating: 4.9, onTime: 98 },
  { name: 'Sarah Johnson', trips: 142, rating: 4.8, onTime: 96 },
  { name: 'Mike Davis', trips: 138, rating: 4.7, onTime: 94 },
  { name: 'Emily Brown', trips: 125, rating: 4.9, onTime: 97 },
  { name: 'David Wilson', trips: 118, rating: 4.6, onTime: 92 },
];

const topFacilities = [
  { name: 'Memorial Hospital', trips: 245, revenue: 12500 },
  { name: 'City Medical Center', trips: 198, revenue: 9800 },
  { name: 'Regional Dialysis', trips: 167, revenue: 8200 },
  { name: 'Sunrise Nursing Home', trips: 145, revenue: 7100 },
  { name: 'Downtown Clinic', trips: 112, revenue: 5400 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState('30d');
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const maxTrips = Math.max(...tripsByDay.map((d) => d.value));
  const maxRevenue = Math.max(...revenueByMonth.map((d) => d.value));
  const totalTripTypes = tripsByType.reduce((acc, t) => acc + t.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Track performance and key metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          return (
            <Card key={metric.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`h-10 w-10 rounded-lg ${metric.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trips by Day Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-500" />
              Trips by Day of Week
            </CardTitle>
            <CardDescription>Average trips completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {tripsByDay.map((day) => (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary-500 rounded-t-md transition-all duration-300 hover:bg-primary-600"
                    style={{ height: `${(day.value / maxTrips) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{day.label}</span>
                  <span className="text-xs font-medium text-gray-700">{day.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trips by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-success-500" />
              Trips by Transport Type
            </CardTitle>
            <CardDescription>Distribution of trip types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tripsByType.map((type) => (
                <div key={type.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    <span className="text-sm text-gray-500">{type.value}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${type.color} rounded-full transition-all duration-500`}
                      style={{ width: `${type.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Trips This Period</span>
                <span className="font-semibold text-gray-900">1,847</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-warning-500" />
            Revenue Trend
          </CardTitle>
          <CardDescription>Monthly revenue over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-48">
            {revenueByMonth.map((month) => (
              <div key={month.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative">
                  <div
                    className="w-full bg-gradient-to-t from-warning-500 to-warning-300 rounded-t-md transition-all duration-300 hover:from-warning-600 hover:to-warning-400"
                    style={{ height: `${(month.value / maxRevenue) * 160}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{month.label}</span>
                <span className="text-xs font-medium text-gray-700">${(month.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Drivers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              Top Performing Drivers
            </CardTitle>
            <CardDescription>Based on completed trips this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <div key={driver.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{driver.trips} trips</span>
                      <span>{driver.rating} rating</span>
                      <span>{driver.onTime}% on-time</span>
                    </div>
                  </div>
                  <Badge variant="success">{driver.trips} trips</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-success-500" />
              Top Facilities
            </CardTitle>
            <CardDescription>By trip volume this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFacilities.map((facility, index) => (
                <div key={facility.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-success-700">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{facility.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{facility.trips} trips</span>
                      <span>${facility.revenue.toLocaleString()} revenue</span>
                    </div>
                  </div>
                  <Badge variant="secondary">${(facility.revenue / 1000).toFixed(1)}k</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-info-500" />
            Key Performance Indicators
          </CardTitle>
          <CardDescription>Critical metrics for operational efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold text-gray-900">94.2%</p>
              <p className="text-sm text-gray-500 mt-1">On-Time Rate</p>
              <Badge variant="success" className="mt-2">+2.1% vs goal</Badge>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold text-gray-900">98.5%</p>
              <p className="text-sm text-gray-500 mt-1">Completion Rate</p>
              <Badge variant="success" className="mt-2">Above target</Badge>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold text-gray-900">4.7</p>
              <p className="text-sm text-gray-500 mt-1">Avg Patient Rating</p>
              <Badge variant="success" className="mt-2">Excellent</Badge>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold text-gray-900">$25.60</p>
              <p className="text-sm text-gray-500 mt-1">Avg Revenue/Trip</p>
              <Badge variant="warning" className="mt-2">-$1.20 vs target</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
