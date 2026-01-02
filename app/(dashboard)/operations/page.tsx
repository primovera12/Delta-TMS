'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Car,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Truck,
  Calendar,
  TrendingUp,
  ArrowRight,
  Wrench,
  FileText,
  Timer,
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockStats = {
  activeRides: 24,
  driversOnDuty: 18,
  availableDrivers: 6,
  completedToday: 87,
  pendingAssignment: 5,
  conflicts: 2,
  latePickups: 1,
  maintenanceDue: 3,
};

const mockActiveRides = [
  { id: 'TRP-1001', patient: 'John Smith', driver: 'Michael J.', status: 'en_route', eta: '10 min', pickup: '123 Main St' },
  { id: 'TRP-1002', patient: 'Mary Johnson', driver: 'Sarah K.', status: 'at_pickup', eta: '-', pickup: 'Metro Hospital' },
  { id: 'TRP-1003', patient: 'Robert Davis', driver: 'David L.', status: 'in_transit', eta: '15 min', pickup: '456 Oak Ave' },
  { id: 'TRP-1004', patient: 'Jennifer Wilson', driver: 'Lisa M.', status: 'en_route', eta: '22 min', pickup: 'Dialysis Center' },
];

const mockAlerts = [
  { id: 1, type: 'warning', message: 'Driver Mike T. running 15 min late for pickup', time: '5 min ago' },
  { id: 2, type: 'conflict', message: 'Schedule conflict detected for Vehicle #12', time: '12 min ago' },
  { id: 3, type: 'maintenance', message: 'Vehicle #08 oil change due in 500 miles', time: '1 hour ago' },
  { id: 4, type: 'info', message: '3 new time-off requests pending approval', time: '2 hours ago' },
];

const mockDriverStatus = [
  { name: 'Michael Johnson', status: 'on_trip', trips: 4, vehicle: 'VEH-042' },
  { name: 'Sarah Kim', status: 'available', trips: 3, vehicle: 'VEH-015' },
  { name: 'David Lee', status: 'on_trip', trips: 5, vehicle: 'VEH-023' },
  { name: 'Lisa Martinez', status: 'break', trips: 2, vehicle: 'VEH-031' },
  { name: 'James Wilson', status: 'available', trips: 4, vehicle: 'VEH-007' },
];

export default function OperationsDashboardPage() {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      en_route: 'bg-blue-100 text-blue-800',
      at_pickup: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      on_trip: 'bg-green-100 text-green-800',
      available: 'bg-blue-100 text-blue-800',
      break: 'bg-orange-100 text-orange-800',
      offline: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'conflict':
        return <Clock className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="text-gray-600">Real-time operations overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/operations/map">
            <Button>
              <MapPin className="h-4 w-4 mr-2" />
              Live Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rides</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.activeRides}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Car className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5 from this time yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drivers On Duty</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.driversOnDuty}</p>
                <p className="text-sm text-gray-500">{mockStats.availableDrivers} available</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.completedToday}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={72} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">72% of daily target</p>
            </div>
          </CardContent>
        </Card>

        <Card className={mockStats.conflicts > 0 ? 'border-red-200' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issues</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockStats.pendingAssignment + mockStats.conflicts + mockStats.latePickups}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-sm space-y-1">
              <p className="text-yellow-600">{mockStats.pendingAssignment} pending assignment</p>
              <p className="text-red-600">{mockStats.conflicts} conflicts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Active Rides */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Active Rides</CardTitle>
              <Link href="/operations/schedule">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActiveRides.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{ride.patient}</p>
                        <p className="text-sm text-gray-500">{ride.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{ride.driver}</p>
                        <p className="text-sm text-gray-500">ETA: {ride.eta}</p>
                      </div>
                      <Badge className={getStatusColor(ride.status)}>
                        {ride.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Driver Status Grid */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Driver Status</CardTitle>
              <Link href="/operations/drivers">
                <Button variant="ghost" size="sm">
                  Manage <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {mockDriverStatus.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        driver.status === 'available' ? 'bg-green-500' :
                        driver.status === 'on_trip' ? 'bg-blue-500' :
                        driver.status === 'break' ? 'bg-orange-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.vehicle} • {driver.trips} trips</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(driver.status)} variant="secondary">
                      {driver.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts & Quick Actions */}
        <div className="space-y-4">
          {/* Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/operations/schedule">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs">Schedule</span>
                  </Button>
                </Link>
                <Link href="/operations/drivers">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Drivers</span>
                  </Button>
                </Link>
                <Link href="/operations/timesheets">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                    <Timer className="h-5 w-5" />
                    <span className="text-xs">Timesheets</span>
                  </Button>
                </Link>
                <Link href="/operations/maintenance">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                    <Wrench className="h-5 w-5" />
                    <span className="text-xs">Maintenance</span>
                  </Button>
                </Link>
                <Link href="/operations/routes">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs">Routes</span>
                  </Button>
                </Link>
                <Link href="/operations/shifts">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                    <Clock className="h-5 w-5" />
                    <span className="text-xs">Shifts</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Due */}
          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Maintenance Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm">VEH-008</span>
                  <span className="text-xs text-orange-600">Oil change - 500 mi</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm">VEH-015</span>
                  <span className="text-xs text-orange-600">Tire rotation - 3 days</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm">VEH-023</span>
                  <span className="text-xs text-orange-600">Inspection - 1 week</span>
                </div>
              </div>
              <Link href="/operations/maintenance">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View All Maintenance
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
