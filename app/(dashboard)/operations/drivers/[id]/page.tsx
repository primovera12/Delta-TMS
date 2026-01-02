'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Car,
  Clock,
  Calendar,
  Star,
  MapPin,
  Award,
  FileText,
  Edit,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

// Mock driver detail
const mockDriverDetail = {
  id: 'DRV-001',
  name: 'Michael Johnson',
  email: 'mjohnson@deltamed.com',
  phone: '(555) 234-5678',
  status: 'on_trip',
  avatar: null,
  hireDate: '2021-03-15',
  yearsExperience: 3,
  licenseNumber: 'DL-12345678',
  licenseExpiry: '2025-03-15',
  vehicle: {
    id: 'VEH-042',
    type: 'Wheelchair Van',
    make: 'Ford',
    model: 'Transit',
    year: 2022,
  },
  shift: {
    name: 'Morning',
    time: '6:00 AM - 2:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  stats: {
    tripsToday: 4,
    tripsScheduled: 6,
    tripsThisMonth: 124,
    hoursThisWeek: 38,
    rating: 4.8,
    onTimeRate: 96,
    totalMiles: 2450,
    incidentsYTD: 1,
  },
  certifications: [
    { name: 'CPR Certification', status: 'active', expiry: '2024-06-15' },
    { name: 'First Aid', status: 'active', expiry: '2024-06-15' },
    { name: 'Wheelchair Safety', status: 'active', expiry: '2024-09-01' },
    { name: 'Defensive Driving', status: 'active', expiry: '2025-01-01' },
  ],
  trainingProgress: {
    completed: 5,
    total: 5,
    courses: [
      { name: 'Defensive Driving', completed: true },
      { name: 'Patient Handling', completed: true },
      { name: 'HIPAA Compliance', completed: true },
      { name: 'Wheelchair Equipment', completed: true },
      { name: 'Emergency Procedures', completed: true },
    ],
  },
  recentTrips: [
    { id: 'TRP-1001', date: '2024-01-15', patient: 'John Smith', status: 'completed', rating: 5 },
    { id: 'TRP-1002', date: '2024-01-15', patient: 'Mary Johnson', status: 'completed', rating: 5 },
    { id: 'TRP-1003', date: '2024-01-15', patient: 'Robert Davis', status: 'in_progress', rating: null },
  ],
  timeOffRequests: [
    { dates: 'Jan 20-22', reason: 'Personal', status: 'pending' },
  ],
};

export default function OperationsDriverDetailPage() {
  const params = useParams();
  const router = useRouter();

  const driver = mockDriverDetail;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      on_trip: 'bg-green-100 text-green-800',
      available: 'bg-blue-100 text-blue-800',
      break: 'bg-orange-100 text-orange-800',
      offline: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      expiring: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
                <Badge className={getStatusColor(driver.status)}>
                  {driver.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-gray-600">{driver.id} • Hired {driver.hireDate}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500">
              <Star className="h-5 w-5 fill-yellow-500" />
              <span className="text-2xl font-bold">{driver.stats.rating}</span>
            </div>
            <p className="text-sm text-gray-500">Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{driver.stats.onTimeRate}%</p>
            <p className="text-sm text-gray-500">On-Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{driver.stats.tripsThisMonth}</p>
            <p className="text-sm text-gray-500">Trips (Month)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{driver.stats.hoursThisWeek}h</p>
            <p className="text-sm text-gray-500">Hours (Week)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{driver.stats.totalMiles.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Miles (Month)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{driver.stats.incidentsYTD}</p>
            <p className="text-sm text-gray-500">Incidents (YTD)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="history">Trip History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Contact & License Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contact & License Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{driver.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">License #</span>
                        <span className="font-mono">{driver.licenseNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Expires</span>
                        <span>{driver.licenseExpiry}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Assigned Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{driver.vehicle.id}</p>
                      <p className="text-sm text-gray-500">
                        {driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}
                      </p>
                    </div>
                    <Badge variant="outline">{driver.vehicle.type}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Trips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {driver.recentTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{trip.patient}</p>
                          <p className="text-sm text-gray-500">{trip.id} • {trip.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {trip.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span>{trip.rating}</span>
                            </div>
                          )}
                          <Badge className={getStatusColor(trip.status)}>
                            {trip.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              {/* Current Shift */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Current Shift Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{driver.shift.name} Shift</p>
                          <p className="text-sm text-gray-500">{driver.shift.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <Badge
                            key={day}
                            variant={driver.shift.days.includes(day) ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Trips Completed</span>
                      <span className="font-bold">{driver.stats.tripsToday}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Trips Remaining</span>
                      <span className="font-bold">{driver.stats.tripsScheduled - driver.stats.tripsToday}</span>
                    </div>
                    <Progress
                      value={(driver.stats.tripsToday / driver.stats.tripsScheduled) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Time Off Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Time Off Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {driver.timeOffRequests.length > 0 ? (
                    <div className="space-y-3">
                      {driver.timeOffRequests.map((request, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{request.dates}</p>
                            <p className="text-sm text-gray-500">{request.reason}</p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No pending requests</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              {/* Training Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Training Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Courses Completed</span>
                      <span className="font-bold">
                        {driver.trainingProgress.completed}/{driver.trainingProgress.total}
                      </span>
                    </div>
                    <Progress
                      value={(driver.trainingProgress.completed / driver.trainingProgress.total) * 100}
                      className="h-2"
                    />
                    <div className="space-y-2">
                      {driver.trainingProgress.courses.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{course.name}</span>
                          {course.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {driver.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-gray-500">Expires: {cert.expiry}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Complete trip history will be displayed here</p>
                  <p className="text-sm text-gray-400 mt-2">Filter by date range</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rating</span>
                    <span className="font-medium">{driver.stats.rating}/5.0</span>
                  </div>
                  <Progress value={driver.stats.rating * 20} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On-Time Rate</span>
                    <span className="font-medium">{driver.stats.onTimeRate}%</span>
                  </div>
                  <Progress value={driver.stats.onTimeRate} className="h-2" />
                </div>
                <div className="pt-4 border-t text-center">
                  <Badge className="bg-green-100 text-green-800">
                    Top Performer
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Timesheets
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Car className="h-4 w-4 mr-2" />
                Change Vehicle
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Incidents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
