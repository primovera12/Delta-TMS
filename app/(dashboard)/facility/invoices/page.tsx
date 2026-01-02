'use client';

import * as React from 'react';
import {
  FileText,
  Search,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/domain/stat-card';

// Mock data
const invoiceSummary = {
  outstanding: 8450.00,
  paid: 45230.00,
  overdue: 1250.00,
  thisMonth: 12680.00,
};

const invoices = [
  {
    id: 'INV-2026-001',
    date: '2026-01-01',
    dueDate: '2026-01-31',
    period: 'December 2025',
    trips: 85,
    amount: 12680.00,
    status: 'pending',
  },
  {
    id: 'INV-2025-012',
    date: '2025-12-01',
    dueDate: '2025-12-31',
    period: 'November 2025',
    trips: 78,
    amount: 11450.00,
    status: 'paid',
    paidDate: '2025-12-28',
  },
  {
    id: 'INV-2025-011',
    date: '2025-11-01',
    dueDate: '2025-11-30',
    period: 'October 2025',
    trips: 82,
    amount: 11980.00,
    status: 'paid',
    paidDate: '2025-11-25',
  },
  {
    id: 'INV-2025-010',
    date: '2025-10-01',
    dueDate: '2025-10-31',
    period: 'September 2025',
    trips: 75,
    amount: 10800.00,
    status: 'paid',
    paidDate: '2025-10-29',
  },
  {
    id: 'INV-2025-009',
    date: '2025-09-01',
    dueDate: '2025-09-30',
    period: 'August 2025',
    trips: 68,
    amount: 9850.00,
    status: 'overdue',
  },
];

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
  draft: 'secondary',
};

export default function FacilityInvoicesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const invoiceCounts = {
    all: invoices.length,
    pending: invoices.filter((i) => i.status === 'pending').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500">View and manage your transport invoices</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Outstanding"
          value={`$${invoiceSummary.outstanding.toLocaleString()}`}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Paid This Year"
          value={`$${invoiceSummary.paid.toLocaleString()}`}
          icon={<CheckCircle className="h-6 w-6" />}
        />
        <StatCard
          title="Overdue"
          value={`$${invoiceSummary.overdue.toLocaleString()}`}
          icon={<AlertCircle className="h-6 w-6" />}
        />
        <StatCard
          title="This Month"
          value={`$${invoiceSummary.thisMonth.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({invoiceCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({invoiceCounts.pending})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({invoiceCounts.paid})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({invoiceCounts.overdue})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Invoices List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Invoice</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Period</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Trips</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Due Date</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-right p-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invoice.id}</p>
                          <p className="text-sm text-gray-500">{invoice.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900">{invoice.period}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900">{invoice.trips} trips</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900">{invoice.dueDate}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariants[invoice.status]}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'No invoices for the selected filter'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredInvoices.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing 1 to {filteredInvoices.length} of {filteredInvoices.length} invoices
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Payment Terms</p>
              <p className="font-medium text-gray-900">Net 30</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Contract Discount</p>
              <p className="font-medium text-success-600">15% applied</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            For billing questions, please contact our billing department at billing@delta-tms.com or call (713) 555-0100.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
