'use client';

import * as React from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  Clock,
  DollarSign,
  FileText,
  Filter,
  RefreshCw,
  PieChart,
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

interface ReportMetric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
}

interface TripSummary {
  month: string;
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

interface PatientActivity {
  patientName: string;
  totalTrips: number;
  lastTrip: string;
  transportType: string;
}

const metrics: ReportMetric[] = [
  {
    label: 'Total Trips',
    value: '342',
    change: 8.5,
    changeLabel: 'vs last month',
    icon: Car,
    color: 'bg-primary-100 text-primary-600',
  },
  {
    label: 'Active Patients',
    value: '67',
    change: 3.2,
    changeLabel: 'vs last month',
    icon: Users,
    color: 'bg-success-100 text-success-600',
  },
  {
    label: 'Total Spend',
    value: '$8,540',
    change: -2.1,
    changeLabel: 'vs last month',
    icon: DollarSign,
    color: 'bg-warning-100 text-warning-600',
  },
  {
    label: 'On-Time Rate',
    value: '94.2%',
    change: 1.5,
    changeLabel: 'vs last month',
    icon: Clock,
    color: 'bg-info-100 text-info-600',
  },
];

const tripSummary: TripSummary[] = [
  { month: 'Aug', total: 285, completed: 268, cancelled: 12, noShow: 5 },
  { month: 'Sep', total: 312, completed: 295, cancelled: 10, noShow: 7 },
  { month: 'Oct', total: 298, completed: 280, cancelled: 14, noShow: 4 },
  { month: 'Nov', total: 324, completed: 305, cancelled: 11, noShow: 8 },
  { month: 'Dec', total: 315, completed: 298, cancelled: 13, noShow: 4 },
  { month: 'Jan', total: 342, completed: 322, cancelled: 15, noShow: 5 },
];

const patientActivity: PatientActivity[] = [
  { patientName: 'Robert Johnson', totalTrips: 24, lastTrip: '2024-01-15', transportType: 'Wheelchair' },
  { patientName: 'Mary Williams', totalTrips: 18, lastTrip: '2024-01-14', transportType: 'Ambulatory' },
  { patientName: 'James Wilson', totalTrips: 16, lastTrip: '2024-01-12', transportType: 'Stretcher' },
  { patientName: 'Elizabeth Brown', totalTrips: 14, lastTrip: '2024-01-15', transportType: 'Wheelchair' },
  { patientName: 'Thomas Anderson', totalTrips: 12, lastTrip: '2024-01-10', transportType: 'Ambulatory' },
];

const tripsByType = [
  { type: 'Ambulatory', count: 145, percentage: 42 },
  { type: 'Wheelchair', count: 112, percentage: 33 },
  { type: 'Stretcher', count: 65, percentage: 19 },
  { type: 'Bariatric', count: 20, percentage: 6 },
];

export default function FacilityReportsPage() {
  const [dateRange, setDateRange] = React.useState('30d');
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = (format: string) => {
    // Simulate export
    console.log(`Exporting report as ${format}`);
  };

  const maxTrips = Math.max(...tripSummary.map((d) => d.total));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">View transportation analytics and insights</p>
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
          <Button variant="secondary" onClick={() => handleExport('pdf')}>
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
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
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
        {/* Trip Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-500" />
              Trip Volume
            </CardTitle>
            <CardDescription>Monthly trip breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {tripSummary.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5" style={{ height: `${(month.total / maxTrips) * 100}%` }}>
                    <div
                      className="w-full bg-success-500 rounded-t"
                      style={{ height: `${(month.completed / month.total) * 100}%` }}
                    />
                    <div
                      className="w-full bg-warning-500"
                      style={{ height: `${(month.cancelled / month.total) * 100}%` }}
                    />
                    <div
                      className="w-full bg-error-500 rounded-b"
                      style={{ height: `${(month.noShow / month.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{month.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-success-500" />
                <span className="text-xs text-gray-500">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-warning-500" />
                <span className="text-xs text-gray-500">Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-error-500" />
                <span className="text-xs text-gray-500">No Show</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trips by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-info-500" />
              Trips by Transport Type
            </CardTitle>
            <CardDescription>Distribution this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tripsByType.map((type, index) => {
                const colors = ['bg-primary-500', 'bg-success-500', 'bg-warning-500', 'bg-info-500'];
                return (
                  <div key={type.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{type.type}</span>
                      <span className="text-sm text-gray-500">{type.count} trips ({type.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index]} rounded-full transition-all duration-500`}
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-success-500" />
            Top Patient Activity
          </CardTitle>
          <CardDescription>Patients with most trips this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Transport Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Trips</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Trip</th>
                </tr>
              </thead>
              <tbody>
                {patientActivity.map((patient, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {patient.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{patient.patientName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{patient.transportType}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{patient.totalTrips}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(patient.lastTrip).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-500" />
            Available Reports
          </CardTitle>
          <CardDescription>Download detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Trip Summary Report', description: 'Complete trip details with status breakdown', icon: Car },
              { name: 'Patient Activity Report', description: 'Trip history by patient', icon: Users },
              { name: 'Billing Summary', description: 'Cost breakdown and invoice details', icon: DollarSign },
              { name: 'On-Time Performance', description: 'Punctuality metrics and trends', icon: Clock },
              { name: 'Standing Orders Report', description: 'Recurring trip schedules', icon: Calendar },
              { name: 'Custom Report', description: 'Build your own report', icon: BarChart3 },
            ].map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.name}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleExport('pdf')}
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
