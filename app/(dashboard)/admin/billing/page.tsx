'use client';

import * as React from 'react';
import {
  DollarSign,
  FileText,
  Download,
  Send,
  Filter,
  Search,
  Plus,
  ChevronDown,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/domain/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Mock data
const billingStats = {
  totalOutstanding: 45250.00,
  overdueAmount: 12500.00,
  paidThisMonth: 125750.00,
  pendingInvoices: 23,
};

const invoices = [
  {
    id: 'INV-2026-0115',
    facility: 'Memorial Hospital',
    facilityId: 'FAC-001',
    amount: 4250.00,
    trips: 45,
    period: 'Jan 1-15, 2026',
    issueDate: '2026-01-15',
    dueDate: '2026-01-30',
    status: 'pending',
  },
  {
    id: 'INV-2026-0114',
    facility: 'City Dialysis Center',
    facilityId: 'FAC-002',
    amount: 8750.00,
    trips: 120,
    period: 'Jan 1-15, 2026',
    issueDate: '2026-01-15',
    dueDate: '2026-01-30',
    status: 'pending',
  },
  {
    id: 'INV-2026-0108',
    facility: 'Regional Medical Center',
    facilityId: 'FAC-003',
    amount: 3200.00,
    trips: 38,
    period: 'Dec 16-31, 2025',
    issueDate: '2026-01-01',
    dueDate: '2026-01-15',
    status: 'overdue',
  },
  {
    id: 'INV-2026-0105',
    facility: 'Heart Care Clinic',
    facilityId: 'FAC-004',
    amount: 2100.00,
    trips: 25,
    period: 'Dec 16-31, 2025',
    issueDate: '2026-01-01',
    dueDate: '2026-01-15',
    status: 'paid',
    paidDate: '2026-01-12',
  },
  {
    id: 'INV-2026-0102',
    facility: 'Memorial Hospital',
    facilityId: 'FAC-001',
    amount: 5100.00,
    trips: 52,
    period: 'Dec 16-31, 2025',
    issueDate: '2026-01-01',
    dueDate: '2026-01-15',
    status: 'paid',
    paidDate: '2026-01-10',
  },
  {
    id: 'INV-2025-1231',
    facility: 'City Dialysis Center',
    facilityId: 'FAC-002',
    amount: 9300.00,
    trips: 128,
    period: 'Dec 1-15, 2025',
    issueDate: '2025-12-16',
    dueDate: '2025-12-31',
    status: 'paid',
    paidDate: '2025-12-28',
  },
];

const facilities = [
  { id: 'FAC-001', name: 'Memorial Hospital', balance: 9350.00, status: 'current' },
  { id: 'FAC-002', name: 'City Dialysis Center', balance: 8750.00, status: 'current' },
  { id: 'FAC-003', name: 'Regional Medical Center', balance: 6400.00, status: 'overdue' },
  { id: 'FAC-004', name: 'Heart Care Clinic', balance: 0, status: 'paid' },
  { id: 'FAC-005', name: 'Cancer Treatment Center', balance: 3250.00, status: 'current' },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'secondary'; icon: typeof CheckCircle }> = {
  paid: { label: 'Paid', variant: 'success', icon: CheckCircle },
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  overdue: { label: 'Overdue', variant: 'error', icon: AlertCircle },
  draft: { label: 'Draft', variant: 'secondary', icon: FileText },
};

export default function AdminBillingPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [facilityFilter, setFacilityFilter] = React.useState<string>('all');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.facility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesFacility = facilityFilter === 'all' || invoice.facilityId === facilityFilter;
    return matchesSearch && matchesStatus && matchesFacility;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Billing & Invoices</h1>
          <p className="text-sm text-gray-500">Manage invoices and track payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/billing/generate">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Outstanding"
          value={`$${billingStats.totalOutstanding.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Overdue Amount"
          value={`$${billingStats.overdueAmount.toLocaleString()}`}
          trend="down"
          change={-15}
          changeLabel="vs last month"
          icon={<AlertCircle className="h-6 w-6" />}
        />
        <StatCard
          title="Paid This Month"
          value={`$${billingStats.paidThisMonth.toLocaleString()}`}
          trend="up"
          change={12}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Pending Invoices"
          value={billingStats.pendingInvoices}
          icon={<FileText className="h-6 w-6" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="facilities">Facility Balances</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice List */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facility
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => {
                      const status = statusConfig[invoice.status];
                      const StatusIcon = status.icon;
                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{invoice.id}</p>
                                <p className="text-sm text-gray-500">{invoice.trips} trips</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">{invoice.facility}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.period}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">
                              ${invoice.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className={invoice.status === 'overdue' ? 'text-error-600 font-medium' : 'text-gray-500'}>
                                {invoice.dueDate}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={status.variant}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/billing/${invoice.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              {invoice.status === 'pending' && (
                                <Button variant="ghost" size="sm">
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Facility Account Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{facility.name}</h3>
                        <p className="text-sm text-gray-500">{facility.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${facility.balance.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Outstanding</p>
                      </div>
                      <Badge
                        variant={
                          facility.status === 'paid'
                            ? 'success'
                            : facility.status === 'overdue'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {facility.status === 'paid'
                          ? 'Paid Up'
                          : facility.status === 'overdue'
                          ? 'Overdue'
                          : 'Current'}
                      </Badge>
                      <Link href={`/admin/facilities/${facility.id}`}>
                        <Button variant="secondary" size="sm">
                          View
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
