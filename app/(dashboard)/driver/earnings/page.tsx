'use client';

import * as React from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Car,
  ChevronDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/domain/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const earningsSummary = {
  thisWeek: 1285.50,
  lastWeek: 1142.00,
  thisMonth: 4520.75,
  pending: 285.50,
  tripsThisWeek: 28,
  hoursThisWeek: 42.5,
};

const weeklyEarnings = [
  { day: 'Mon', earnings: 185.50, trips: 5 },
  { day: 'Tue', earnings: 210.00, trips: 6 },
  { day: 'Wed', earnings: 165.00, trips: 4 },
  { day: 'Thu', earnings: 225.50, trips: 6 },
  { day: 'Fri', earnings: 195.00, trips: 5 },
  { day: 'Sat', earnings: 85.50, trips: 2 },
  { day: 'Sun', earnings: 0, trips: 0 },
];

const recentPayments = [
  {
    id: 'PAY-001',
    date: '2026-01-12',
    period: 'Jan 6 - Jan 12, 2026',
    amount: 1142.00,
    trips: 26,
    status: 'paid',
  },
  {
    id: 'PAY-002',
    date: '2026-01-05',
    period: 'Dec 30 - Jan 5, 2026',
    amount: 1089.50,
    trips: 24,
    status: 'paid',
  },
  {
    id: 'PAY-003',
    date: '2025-12-29',
    period: 'Dec 23 - Dec 29, 2025',
    amount: 985.00,
    trips: 22,
    status: 'paid',
  },
  {
    id: 'PAY-004',
    date: '2025-12-22',
    period: 'Dec 16 - Dec 22, 2025',
    amount: 1210.75,
    trips: 28,
    status: 'paid',
  },
];

const tripEarnings = [
  {
    id: 'TR-20260115-012',
    date: '2026-01-15',
    time: '10:30 AM',
    patient: 'John Smith',
    route: 'Main St → Memorial Hospital',
    fare: 85.50,
    status: 'completed',
  },
  {
    id: 'TR-20260115-008',
    date: '2026-01-15',
    time: '9:00 AM',
    patient: 'Mary Wilson',
    route: 'Oak Ave → Dialysis Center',
    fare: 65.00,
    status: 'completed',
  },
  {
    id: 'TR-20260115-005',
    date: '2026-01-15',
    time: '8:00 AM',
    patient: 'James Brown',
    route: 'Pine Rd → City Clinic',
    fare: 55.00,
    status: 'completed',
  },
  {
    id: 'TR-20260114-045',
    date: '2026-01-14',
    time: '3:30 PM',
    patient: 'Susan Miller',
    route: 'Elm St → General Hospital',
    fare: 75.00,
    status: 'completed',
  },
  {
    id: 'TR-20260114-042',
    date: '2026-01-14',
    time: '2:00 PM',
    patient: 'Robert Taylor',
    route: 'Cedar Lane → Heart Center',
    fare: 95.00,
    status: 'completed',
  },
];

export default function DriverEarningsPage() {
  const weeklyChange = ((earningsSummary.thisWeek - earningsSummary.lastWeek) / earningsSummary.lastWeek) * 100;
  const maxEarnings = Math.max(...weeklyEarnings.map((d) => d.earnings));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Earnings</h1>
          <p className="text-sm text-gray-500">Track your earnings and payment history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Calendar className="h-4 w-4 mr-2" />
            This Week
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="This Week"
          value={`$${earningsSummary.thisWeek.toFixed(2)}`}
          change={Math.round(weeklyChange)}
          trend={weeklyChange >= 0 ? 'up' : 'down'}
          changeLabel="vs last week"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="This Month"
          value={`$${earningsSummary.thisMonth.toFixed(2)}`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Trips This Week"
          value={earningsSummary.tripsThisWeek}
          icon={<Car className="h-6 w-6" />}
        />
        <StatCard
          title="Hours This Week"
          value={`${earningsSummary.hoursThisWeek}h`}
          icon={<Clock className="h-6 w-6" />}
        />
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {weeklyEarnings.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    ${day.earnings.toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500">{day.trips} trips</span>
                </div>
                <div
                  className="w-full bg-primary-500 rounded-t-lg transition-all"
                  style={{
                    height: `${maxEarnings > 0 ? (day.earnings / maxEarnings) * 150 : 0}px`,
                    minHeight: day.earnings > 0 ? '4px' : '0px',
                  }}
                />
                <span className="mt-2 text-sm text-gray-600">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="trips">
        <TabsList>
          <TabsTrigger value="trips">Trip Earnings</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Trips</CardTitle>
              <Badge variant="info">{tripEarnings.length} trips</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripEarnings.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-success-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{trip.patient}</p>
                          <span className="text-xs text-gray-400 font-mono">{trip.id}</span>
                        </div>
                        <p className="text-sm text-gray-500">{trip.route}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${trip.fare.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{trip.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">Weekly Payment</p>
                          <Badge variant="success" size="sm">Paid</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{payment.period}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{payment.trips} trips</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pending Earnings */}
      {earningsSummary.pending > 0 && (
        <Card className="border-warning-200 bg-warning-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="font-medium text-warning-900">Pending Earnings</p>
                  <p className="text-sm text-warning-700">
                    Will be included in your next payment
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-warning-900">
                ${earningsSummary.pending.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
