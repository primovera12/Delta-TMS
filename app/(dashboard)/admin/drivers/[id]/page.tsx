'use client';

import * as React from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar,
  Clock,
  Star,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Navigation,
  Edit2,
  MoreHorizontal,
  ArrowLeft,
  Activity,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/domain/stat-card';
import Link from 'next/link';

// Mock driver data
const driver = {
  id: 'DRV-001',
  name: 'John Smith',
  email: 'jsmith@example.com',
  phone: '(555) 123-4567',
  address: '456 Oak Street, Houston, TX 77001',
  status: 'active',
  hireDate: '2024-03-15',
  employeeType: 'full_time',
  vehicleAssigned: {
    id: 'VEH-001',
    make: 'Toyota',
    model: 'Sienna',
    year: 2023,
    licensePlate: 'ABC-1234',
    type: 'wheelchair',
  },
  documents: [
    { type: 'drivers_license', name: 'Driver\'s License', status: 'valid', expiry: '2027-03-15' },
    { type: 'medical_cert', name: 'Medical Certificate', status: 'valid', expiry: '2026-06-20' },
    { type: 'background_check', name: 'Background Check', status: 'valid', expiry: '2026-03-15' },
    { type: 'drug_test', name: 'Drug Test', status: 'valid', expiry: '2026-02-01' },
    { type: 'cpr_cert', name: 'CPR Certification', status: 'expiring_soon', expiry: '2026-01-25' },
    { type: 'first_aid', name: 'First Aid Training', status: 'valid', expiry: '2026-08-10' },
  ],
  stats: {
    totalTrips: 1847,
    tripsThisMonth: 142,
    rating: 4.9,
    totalRatings: 1203,
    onTimeRate: 96.5,
    completionRate: 99.2,
    earnings: {
      thisMonth: 4850,
      lastMonth: 4620,
      ytd: 52400,
    },
  },
  schedule: {
    monday: { start: '06:00', end: '14:00' },
    tuesday: { start: '06:00', end: '14:00' },
    wednesday: { start: '06:00', end: '14:00' },
    thursday: { start: '06:00', end: '14:00' },
    friday: { start: '06:00', end: '14:00' },
    saturday: null,
    sunday: null,
  },
  recentTrips: [
    {
      id: 'TR-20260115-042',
      date: '2026-01-15',
      time: '10:30 AM',
      pickup: '123 Main St, Houston, TX',
      dropoff: 'Memorial Hospital',
      status: 'completed',
      rating: 5,
    },
    {
      id: 'TR-20260115-038',
      date: '2026-01-15',
      time: '9:00 AM',
      pickup: '789 Health Blvd',
      dropoff: 'City Dialysis Center',
      status: 'completed',
      rating: 5,
    },
    {
      id: 'TR-20260114-089',
      date: '2026-01-14',
      time: '3:30 PM',
      pickup: 'Heart Care Clinic',
      dropoff: '456 Elm St',
      status: 'completed',
      rating: 4,
    },
    {
      id: 'TR-20260114-072',
      date: '2026-01-14',
      time: '1:00 PM',
      pickup: '123 Main St',
      dropoff: 'Regional Medical Center',
      status: 'completed',
      rating: 5,
    },
  ],
  notes: [
    {
      id: 1,
      date: '2026-01-10',
      author: 'Admin',
      text: 'Excellent driver, consistently receives positive feedback from patients.',
    },
    {
      id: 2,
      date: '2025-11-15',
      author: 'Dispatcher',
      text: 'Recommended for training new drivers on patient handling procedures.',
    },
  ],
};

const statusColors = {
  active: 'success',
  inactive: 'secondary',
  suspended: 'error',
  on_leave: 'warning',
} as const;

const docStatusColors = {
  valid: 'success',
  expiring_soon: 'warning',
  expired: 'error',
} as const;

export default function AdminDriverDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Driver Profile Header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {driver.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-gray-900">{driver.name}</h1>
                  <Badge variant={statusColors[driver.status as keyof typeof statusColors]}>
                    {driver.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-gray-500 mb-3">{driver.id}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {driver.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {driver.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Hired {new Date(driver.hireDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="secondary">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Trips"
          value={driver.stats.totalTrips.toLocaleString()}
          change={8}
          changeLabel="this month"
          trend="up"
          icon={<Navigation className="h-6 w-6" />}
        />
        <StatCard
          title="Rating"
          value={driver.stats.rating.toFixed(1)}
          change={0.1}
          changeLabel="vs last month"
          trend="up"
          icon={<Star className="h-6 w-6" />}
        />
        <StatCard
          title="On-Time Rate"
          value={`${driver.stats.onTimeRate}%`}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Monthly Earnings"
          value={`$${driver.stats.earnings.thisMonth.toLocaleString()}`}
          change={5}
          changeLabel="vs last month"
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Vehicle Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-400" />
                  Assigned Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                {driver.vehicleAssigned ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {driver.vehicleAssigned.year} {driver.vehicleAssigned.make}{' '}
                          {driver.vehicleAssigned.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          {driver.vehicleAssigned.licensePlate}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {driver.vehicleAssigned.type}
                      </Badge>
                    </div>
                    <Link href={`/admin/vehicles/${driver.vehicleAssigned.id}`}>
                      <Button variant="secondary" size="sm" className="w-full">
                        View Vehicle Details
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No vehicle assigned</p>
                    <Button size="sm">Assign Vehicle</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-medium text-gray-900">
                      {driver.stats.completionRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success-500"
                      style={{ width: `${driver.stats.completionRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">On-Time Rate</span>
                    <span className="font-medium text-gray-900">
                      {driver.stats.onTimeRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: `${driver.stats.onTimeRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">Patient Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning-500 fill-warning-500" />
                      <span className="font-medium text-gray-900">{driver.stats.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({driver.stats.totalRatings} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" />
                Recent Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {driver.recentTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {trip.pickup} → {trip.dropoff}
                        </p>
                        <p className="text-xs text-gray-500">
                          {trip.date} at {trip.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {trip.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-warning-500 fill-warning-500" />
                          <span className="text-sm">{trip.rating}</span>
                        </div>
                      )}
                      <Badge variant="success" size="sm">
                        {trip.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driver.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{note.author}</span>
                      <span className="text-xs text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{note.text}</p>
                  </div>
                ))}
                <Button variant="secondary" className="w-full">
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-400" />
                  Compliance Documents
                </CardTitle>
                <Button size="sm">
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {driver.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        doc.status === 'valid'
                          ? 'bg-success-100'
                          : doc.status === 'expiring_soon'
                          ? 'bg-warning-100'
                          : 'bg-error-100'
                      }`}>
                        {doc.status === 'valid' ? (
                          <CheckCircle className={`h-5 w-5 text-success-600`} />
                        ) : doc.status === 'expiring_soon' ? (
                          <AlertCircle className={`h-5 w-5 text-warning-600`} />
                        ) : (
                          <XCircle className={`h-5 w-5 text-error-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Expires: {new Date(doc.expiry).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={docStatusColors[doc.status as keyof typeof docStatusColors]}
                        size="sm"
                      >
                        {doc.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Navigation className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {driver.stats.totalTrips.toLocaleString()} total trips
                </p>
                <Link href={`/admin/trips?driver=${driver.id}`}>
                  <Button variant="secondary">View All Trips</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  Weekly Schedule
                </CardTitle>
                <Button size="sm" variant="secondary">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(driver.schedule).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                    {hours ? (
                      <span className="text-gray-600">
                        {hours.start} - {hours.end}
                      </span>
                    ) : (
                      <Badge variant="secondary">Off</Badge>
                    )}
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
