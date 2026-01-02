'use client';

import * as React from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Car,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Mock trip history data
const tripHistory = [
  {
    id: 'TR-20260115-001',
    date: '2026-01-15',
    pickupTime: '10:30 AM',
    dropoffTime: '11:00 AM',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'Memorial Hospital, 1234 Medical Center Dr',
    driverName: 'John Smith',
    vehicleType: 'Wheelchair',
    status: 'completed',
    rating: 5,
    fare: 85.00,
  },
  {
    id: 'TR-20260113-001',
    date: '2026-01-13',
    pickupTime: '2:00 PM',
    dropoffTime: '2:35 PM',
    pickup: 'City Dialysis Center, 789 Health Blvd',
    dropoff: '123 Main St, Houston, TX',
    driverName: 'Mike Johnson',
    vehicleType: 'Wheelchair',
    status: 'completed',
    rating: 4,
    fare: 75.00,
  },
  {
    id: 'TR-20260113-002',
    date: '2026-01-13',
    pickupTime: '8:00 AM',
    dropoffTime: '8:30 AM',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'City Dialysis Center, 789 Health Blvd',
    driverName: 'Mike Johnson',
    vehicleType: 'Wheelchair',
    status: 'completed',
    rating: 5,
    fare: 75.00,
  },
  {
    id: 'TR-20260110-001',
    date: '2026-01-10',
    pickupTime: '9:00 AM',
    dropoffTime: null,
    pickup: '123 Main St, Houston, TX',
    dropoff: 'Heart Care Clinic, 890 Cardio Dr',
    driverName: null,
    vehicleType: 'Wheelchair',
    status: 'cancelled',
    cancellationReason: 'Patient request',
    rating: null,
    fare: 0,
  },
  {
    id: 'TR-20260108-001',
    date: '2026-01-08',
    pickupTime: '11:00 AM',
    dropoffTime: '11:45 AM',
    pickup: '123 Main St, Houston, TX',
    dropoff: 'Regional Medical Center, 567 Healthcare Way',
    driverName: 'Sarah Williams',
    vehicleType: 'Wheelchair',
    status: 'completed',
    rating: 5,
    fare: 95.00,
  },
  {
    id: 'TR-20260106-001',
    date: '2026-01-06',
    pickupTime: '2:30 PM',
    dropoffTime: '3:00 PM',
    pickup: 'City Dialysis Center, 789 Health Blvd',
    dropoff: '123 Main St, Houston, TX',
    driverName: 'John Smith',
    vehicleType: 'Wheelchair',
    status: 'completed',
    rating: 5,
    fare: 75.00,
  },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'error' | 'warning' | 'secondary' }> = {
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  no_show: { label: 'No Show', variant: 'warning' },
};

export default function PatientTripHistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateRange, setDateRange] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const filteredTrips = tripHistory.filter((trip) => {
    const matchesSearch =
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoff.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;

    // Date range filter (simplified)
    let matchesDate = true;
    if (dateRange !== 'all') {
      const tripDate = new Date(trip.date);
      const now = new Date();
      if (dateRange === '7days') {
        matchesDate = tripDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        matchesDate = tripDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90days') {
        matchesDate = tripDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const completedTrips = tripHistory.filter((t) => t.status === 'completed').length;
  const totalSpent = tripHistory
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.fare, 0);
  const averageRating =
    tripHistory
      .filter((t) => t.rating)
      .reduce((sum, t) => sum + (t.rating || 0), 0) /
    tripHistory.filter((t) => t.rating).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trip History</h1>
          <p className="text-sm text-gray-500">View your past transportation trips</p>
        </div>
        <Button variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Download History
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedTrips}</p>
                <p className="text-sm text-gray-500">Completed Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-gray-500">Avg. Driver Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip List */}
      <div className="space-y-4">
        {paginatedTrips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No trips found</p>
            </CardContent>
          </Card>
        ) : (
          paginatedTrips.map((trip) => {
            const status = statusConfig[trip.status];

            return (
              <Card key={trip.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Trip Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{trip.date}</span>
                        </div>
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                        <span className="font-mono text-xs text-gray-400">{trip.id}</span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-success-500" />
                          <div className="h-8 border-l border-dashed border-gray-300" />
                          <div className="h-2 w-2 rounded-full bg-error-500" />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{trip.pickup}</p>
                            <p className="text-xs text-gray-500">Pickup: {trip.pickupTime}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{trip.dropoff}</p>
                            {trip.dropoffTime && (
                              <p className="text-xs text-gray-500">Dropoff: {trip.dropoffTime}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trip Meta */}
                    <div className="flex flex-col items-end gap-2">
                      {trip.status === 'completed' && (
                        <>
                          <p className="text-lg font-bold text-gray-900">
                            ${trip.fare.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" size="sm">
                              <Car className="h-3 w-3 mr-1" />
                              {trip.vehicleType}
                            </Badge>
                          </div>
                          {trip.driverName && (
                            <p className="text-sm text-gray-500">Driver: {trip.driverName}</p>
                          )}
                          {trip.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < trip.rating!
                                      ? 'text-warning-500 fill-warning-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {trip.status === 'cancelled' && trip.cancellationReason && (
                        <p className="text-sm text-gray-500">
                          Reason: {trip.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredTrips.length)} of{' '}
            {filteredTrips.length} trips
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
