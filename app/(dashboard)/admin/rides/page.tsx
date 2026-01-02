'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Car,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Phone,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Trip {
  id: string;
  tripNumber: string;
  status: string;
  tripType: string;
  scheduledPickupTime: string;
  actualPickupTime: string | null;
  completedAt: string | null;
  pickupAddress: {
    addressLine1: string;
    city: string;
    state: string;
  };
  dropoffAddress: {
    addressLine1: string;
    city: string;
    state: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  driver: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  } | null;
  estimatedFare: number;
  actualFare: number | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  CONFIRMED: 'bg-primary-100 text-primary-700',
  ASSIGNED: 'bg-info-100 text-info-700',
  DRIVER_EN_ROUTE: 'bg-warning-100 text-warning-700',
  DRIVER_ARRIVED: 'bg-purple-100 text-purple-700',
  IN_PROGRESS: 'bg-success-100 text-success-700',
  COMPLETED: 'bg-success-100 text-success-700',
  CANCELLED: 'bg-error-100 text-error-700',
  NO_SHOW: 'bg-error-100 text-error-700',
};

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'default'> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  ASSIGNED: 'default',
  DRIVER_EN_ROUTE: 'warning',
  DRIVER_ARRIVED: 'warning',
  IN_PROGRESS: 'success',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  NO_SHOW: 'destructive',
};

// Mock data for demonstration
const mockTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'TR-20260102-001',
    status: 'IN_PROGRESS',
    tripType: 'ONE_WAY',
    scheduledPickupTime: new Date().toISOString(),
    actualPickupTime: new Date().toISOString(),
    completedAt: null,
    pickupAddress: { addressLine1: '123 Oak Street', city: 'Houston', state: 'TX' },
    dropoffAddress: { addressLine1: 'Memorial Hospital', city: 'Houston', state: 'TX' },
    patient: { id: '1', firstName: 'John', lastName: 'Smith', phone: '(555) 123-4567' },
    driver: { id: '1', user: { firstName: 'Mike', lastName: 'Johnson' } },
    estimatedFare: 45.00,
    actualFare: null,
  },
  {
    id: '2',
    tripNumber: 'TR-20260102-002',
    status: 'ASSIGNED',
    tripType: 'ROUND_TRIP',
    scheduledPickupTime: new Date(Date.now() + 3600000).toISOString(),
    actualPickupTime: null,
    completedAt: null,
    pickupAddress: { addressLine1: '456 Elm Ave', city: 'Houston', state: 'TX' },
    dropoffAddress: { addressLine1: 'Dialysis Center', city: 'Houston', state: 'TX' },
    patient: { id: '2', firstName: 'Mary', lastName: 'Williams', phone: '(555) 234-5678' },
    driver: { id: '2', user: { firstName: 'Sarah', lastName: 'Davis' } },
    estimatedFare: 72.50,
    actualFare: null,
  },
  {
    id: '3',
    tripNumber: 'TR-20260102-003',
    status: 'COMPLETED',
    tripType: 'ONE_WAY',
    scheduledPickupTime: new Date(Date.now() - 7200000).toISOString(),
    actualPickupTime: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 5400000).toISOString(),
    pickupAddress: { addressLine1: '789 Pine Road', city: 'Houston', state: 'TX' },
    dropoffAddress: { addressLine1: 'Medical Center', city: 'Houston', state: 'TX' },
    patient: { id: '3', firstName: 'Robert', lastName: 'Brown', phone: '(555) 345-6789' },
    driver: { id: '3', user: { firstName: 'Tom', lastName: 'Wilson' } },
    estimatedFare: 38.00,
    actualFare: 42.50,
  },
  {
    id: '4',
    tripNumber: 'TR-20260102-004',
    status: 'PENDING',
    tripType: 'ONE_WAY',
    scheduledPickupTime: new Date(Date.now() + 7200000).toISOString(),
    actualPickupTime: null,
    completedAt: null,
    pickupAddress: { addressLine1: '321 Maple Lane', city: 'Houston', state: 'TX' },
    dropoffAddress: { addressLine1: 'City Hospital', city: 'Houston', state: 'TX' },
    patient: { id: '4', firstName: 'Emily', lastName: 'Garcia', phone: '(555) 456-7890' },
    driver: null,
    estimatedFare: 55.00,
    actualFare: null,
  },
];

export default function AdminRidesPage() {
  const [trips, setTrips] = React.useState<Trip[]>(mockTrips);
  const [pagination, setPagination] = React.useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: mockTrips.length,
    totalPages: 1,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('today');

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate stats
  const stats = React.useMemo(() => {
    return {
      total: trips.length,
      active: trips.filter(t => ['IN_PROGRESS', 'DRIVER_EN_ROUTE', 'DRIVER_ARRIVED'].includes(t.status)).length,
      completed: trips.filter(t => t.status === 'COMPLETED').length,
      pending: trips.filter(t => ['PENDING', 'CONFIRMED', 'ASSIGNED'].includes(t.status)).length,
      cancelled: trips.filter(t => ['CANCELLED', 'NO_SHOW'].includes(t.status)).length,
    };
  }, [trips]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rides Overview</h1>
          <p className="text-sm text-gray-500">View and manage all transportation rides</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dispatcher/trips/new">
              <Car className="h-4 w-4 mr-2" />
              New Ride
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-error-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                <p className="text-sm text-gray-500">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by trip #, patient, driver, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v)}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({stats.cancelled})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Rides Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No rides found</h3>
              <p className="text-gray-500 mb-4">
                {debouncedSearch || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No rides scheduled for today'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Trip</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Patient</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Route</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Driver</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Time</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Fare</th>
                      <th className="text-right p-4 font-medium text-gray-500 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr
                        key={trip.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <Link
                              href={`/admin/rides/${trip.id}`}
                              className="font-medium text-gray-900 hover:text-primary-600"
                            >
                              {trip.tripNumber}
                            </Link>
                            <p className="text-xs text-gray-500">{trip.tripType.replace('_', ' ')}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback>
                                {trip.patient.firstName[0]}{trip.patient.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {trip.patient.firstName} {trip.patient.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{trip.patient.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex flex-col">
                              <span className="text-gray-900 truncate max-w-[150px]">
                                {trip.pickupAddress.addressLine1}
                              </span>
                              <div className="flex items-center gap-1 text-gray-500">
                                <ArrowRight className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">
                                  {trip.dropoffAddress.addressLine1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {trip.driver ? (
                            <div className="flex items-center gap-2">
                              <Avatar size="sm">
                                <AvatarFallback>
                                  {trip.driver.user.firstName[0]}{trip.driver.user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-900">
                                {trip.driver.user.firstName} {trip.driver.user.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{formatTime(trip.scheduledPickupTime)}</p>
                            <p className="text-xs text-gray-500">{formatDate(trip.scheduledPickupTime)}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[trip.status] || 'bg-gray-100 text-gray-700'}`}>
                            {trip.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium text-gray-900">
                            ${(trip.actualFare || trip.estimatedFare).toFixed(2)}
                          </p>
                          {trip.actualFare && trip.actualFare !== trip.estimatedFare && (
                            <p className="text-xs text-gray-500 line-through">
                              ${trip.estimatedFare.toFixed(2)}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/rides/${trip.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Trip</DropdownMenuItem>
                              {!trip.driver && (
                                <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                              )}
                              <DropdownMenuItem>Contact Patient</DropdownMenuItem>
                              {trip.driver && (
                                <DropdownMenuItem>Contact Driver</DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {['PENDING', 'CONFIRMED', 'ASSIGNED'].includes(trip.status) && (
                                <>
                                  <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                  <DropdownMenuItem className="text-error-600">
                                    Cancel Trip
                                  </DropdownMenuItem>
                                </>
                              )}
                              {trip.status === 'COMPLETED' && (
                                <DropdownMenuItem>Process Refund</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} rides
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
