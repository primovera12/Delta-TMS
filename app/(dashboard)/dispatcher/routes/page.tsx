'use client';

import * as React from 'react';
import {
  MapPin,
  Car,
  Navigation,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Route,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
  Zap,
  MoreVertical,
  Eye,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Trip {
  id: string;
  patientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  appointmentTime: string | null;
  status: string;
  tripType: string;
  estimatedMiles: number;
  estimatedDuration: number;
}

interface DriverRoute {
  driverId: string;
  driverName: string;
  vehicleType: string;
  trips: Trip[];
  totalMiles: number;
  totalDuration: number;
  efficiency: number;
  startTime: string;
  endTime: string;
}

// Mock data for route overview
const mockDriverRoutes: DriverRoute[] = [
  {
    driverId: 'DRV-001',
    driverName: 'John Smith',
    vehicleType: 'Wheelchair',
    trips: [
      {
        id: 'TR-001',
        patientName: 'Mary Johnson',
        pickupAddress: '123 Oak St, Houston TX',
        dropoffAddress: 'Memorial Hospital, Houston TX',
        pickupTime: '06:30',
        appointmentTime: '07:00',
        status: 'scheduled',
        tripType: 'medical',
        estimatedMiles: 8.5,
        estimatedDuration: 25,
      },
      {
        id: 'TR-002',
        patientName: 'Robert Williams',
        pickupAddress: 'Memorial Hospital, Houston TX',
        dropoffAddress: '456 Pine Ave, Houston TX',
        pickupTime: '07:30',
        appointmentTime: null,
        status: 'scheduled',
        tripType: 'return',
        estimatedMiles: 6.2,
        estimatedDuration: 18,
      },
      {
        id: 'TR-003',
        patientName: 'Helen Davis',
        pickupAddress: '789 Elm Blvd, Houston TX',
        dropoffAddress: 'Dialysis Center, Houston TX',
        pickupTime: '08:15',
        appointmentTime: '09:00',
        status: 'scheduled',
        tripType: 'medical',
        estimatedMiles: 12.3,
        estimatedDuration: 35,
      },
    ],
    totalMiles: 27.0,
    totalDuration: 138,
    efficiency: 92,
    startTime: '06:30',
    endTime: '12:30',
  },
  {
    driverId: 'DRV-002',
    driverName: 'Mike Johnson',
    vehicleType: 'Stretcher',
    trips: [
      {
        id: 'TR-004',
        patientName: 'James Wilson',
        pickupAddress: 'Sunrise Nursing Home, Houston TX',
        dropoffAddress: 'Methodist Hospital, Houston TX',
        pickupTime: '07:00',
        appointmentTime: '08:00',
        status: 'in_progress',
        tripType: 'medical',
        estimatedMiles: 15.1,
        estimatedDuration: 40,
      },
      {
        id: 'TR-005',
        patientName: 'Patricia Brown',
        pickupAddress: 'Methodist Hospital, Houston TX',
        dropoffAddress: 'Sunset Care Facility, Houston TX',
        pickupTime: '09:00',
        appointmentTime: null,
        status: 'scheduled',
        tripType: 'return',
        estimatedMiles: 11.8,
        estimatedDuration: 32,
      },
    ],
    totalMiles: 26.9,
    totalDuration: 112,
    efficiency: 85,
    startTime: '07:00',
    endTime: '11:00',
  },
  {
    driverId: 'DRV-003',
    driverName: 'Sarah Williams',
    vehicleType: 'Wheelchair',
    trips: [
      {
        id: 'TR-006',
        patientName: 'Linda Taylor',
        pickupAddress: '321 Maple Rd, Houston TX',
        dropoffAddress: 'VA Hospital, Houston TX',
        pickupTime: '08:00',
        appointmentTime: '09:00',
        status: 'scheduled',
        tripType: 'medical',
        estimatedMiles: 18.5,
        estimatedDuration: 45,
      },
    ],
    totalMiles: 18.5,
    totalDuration: 45,
    efficiency: 78,
    startTime: '08:00',
    endTime: '10:00',
  },
];

const optimizationSuggestions = [
  {
    id: 1,
    type: 'route_swap',
    severity: 'high',
    description: 'Swap Trip TR-003 with TR-006 to reduce total mileage by 8.2 miles',
    savings: '8.2 mi / 15 min',
    drivers: ['John Smith', 'Sarah Williams'],
  },
  {
    id: 2,
    type: 'schedule_gap',
    severity: 'medium',
    description: 'Mike Johnson has 45-minute gap between trips. Consider adding nearby trip.',
    savings: 'Improve utilization',
    drivers: ['Mike Johnson'],
  },
  {
    id: 3,
    type: 'late_risk',
    severity: 'warning',
    description: 'Trip TR-001 pickup time may be tight due to morning traffic on I-45',
    savings: 'Suggest 10 min earlier pickup',
    drivers: ['John Smith'],
  },
];

export default function RouteOverviewPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [driverRoutes, setDriverRoutes] = React.useState<DriverRoute[]>(mockDriverRoutes);
  const [selectedDriver, setSelectedDriver] = React.useState<string>('all');
  const [expandedRoute, setExpandedRoute] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setSelectedDate(new Date());
    } else {
      const days = direction === 'prev' ? -1 : 1;
      setSelectedDate(new Date(selectedDate.getTime() + days * 24 * 60 * 60 * 1000));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate totals
  const totalTrips = driverRoutes.reduce((sum, dr) => sum + dr.trips.length, 0);
  const totalMiles = driverRoutes.reduce((sum, dr) => sum + dr.totalMiles, 0);
  const avgEfficiency = driverRoutes.length > 0
    ? Math.round(driverRoutes.reduce((sum, dr) => sum + dr.efficiency, 0) / driverRoutes.length)
    : 0;
  const activeDrivers = driverRoutes.length;

  const filteredRoutes = selectedDriver === 'all'
    ? driverRoutes
    : driverRoutes.filter((dr) => dr.driverId === selectedDriver);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Route Overview</h1>
          <p className="text-sm text-gray-500">Daily route planning and optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Share2 className="h-4 w-4 mr-2" />
            Share Routes
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Optimize All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Route className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
                <p className="text-sm text-gray-500">Total Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalMiles.toFixed(1)} mi</p>
                <p className="text-sm text-gray-500">Total Miles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{avgEfficiency}%</p>
                <p className="text-sm text-gray-500">Avg Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeDrivers}</p>
                <p className="text-sm text-gray-500">Active Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigateDate('today')}>
                  Today
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-semibold text-gray-900">{formatDate(selectedDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {driverRoutes.map((dr) => (
                    <SelectItem key={dr.driverId} value={dr.driverId}>
                      {dr.driverName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      {optimizationSuggestions.length > 0 && (
        <Card className="border-warning-200 bg-warning-50">
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning-600" />
              Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {optimizationSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-start justify-between p-3 bg-white rounded-lg border border-warning-200"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      suggestion.severity === 'high'
                        ? 'bg-error-100'
                        : suggestion.severity === 'medium'
                        ? 'bg-warning-100'
                        : 'bg-info-100'
                    }`}
                  >
                    {suggestion.severity === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-warning-600" />
                    ) : suggestion.type === 'route_swap' ? (
                      <Route className="h-4 w-4 text-primary-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-info-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{suggestion.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="success" size="sm">
                        {suggestion.savings}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Affects: {suggestion.drivers.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm">Apply</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Route Timeline */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Route List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : filteredRoutes.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center">
                  <Route className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">No routes scheduled for this date</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRoutes.map((route) => (
              <Card key={route.driverId}>
                <CardHeader className="py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="md">
                        <AvatarFallback>
                          {route.driverName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{route.driverName}</h3>
                          <Badge variant="secondary" size="sm">
                            {route.vehicleType}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatTime(route.startTime)} - {formatTime(route.endTime)} •{' '}
                          {route.trips.length} trips • {route.totalMiles.toFixed(1)} mi
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          route.efficiency >= 90
                            ? 'success'
                            : route.efficiency >= 80
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {route.efficiency}% efficient
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View on Map
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Zap className="h-4 w-4 mr-2" />
                            Optimize Route
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Route
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="space-y-3">
                    {route.trips.map((trip, index) => (
                      <div key={trip.id} className="relative">
                        {/* Connecting line */}
                        {index < route.trips.length - 1 && (
                          <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200" />
                        )}

                        <div className="flex gap-4">
                          {/* Time indicator */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                trip.status === 'in_progress'
                                  ? 'bg-warning-100'
                                  : trip.status === 'completed'
                                  ? 'bg-success-100'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <Car
                                className={`h-4 w-4 ${
                                  trip.status === 'in_progress'
                                    ? 'text-warning-600'
                                    : trip.status === 'completed'
                                    ? 'text-success-600'
                                    : 'text-gray-400'
                                }`}
                              />
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {formatTime(trip.pickupTime)}
                            </span>
                          </div>

                          {/* Trip details */}
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">
                                    {trip.patientName}
                                  </span>
                                  <Badge
                                    variant={
                                      trip.status === 'in_progress'
                                        ? 'warning'
                                        : trip.status === 'completed'
                                        ? 'success'
                                        : 'secondary'
                                    }
                                    size="sm"
                                  >
                                    {trip.status.replace('_', ' ')}
                                  </Badge>
                                </div>

                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-3.5 w-3.5 text-success-500" />
                                    <span>{trip.pickupAddress}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <ArrowRight className="h-3.5 w-3.5 text-gray-400 ml-0.5" />
                                    <span className="text-xs text-gray-400">
                                      {trip.estimatedMiles} mi • {formatDuration(trip.estimatedDuration)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-3.5 w-3.5 text-error-500" />
                                    <span>{trip.dropoffAddress}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right text-sm">
                                {trip.appointmentTime && (
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Appt: {formatTime(trip.appointmentTime)}</span>
                                  </div>
                                )}
                                <Badge variant="secondary" size="sm" className="mt-1">
                                  {trip.tripType}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Map Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary-600" />
                Route Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Map Placeholder */}
              <div className="relative h-[400px] bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Grid lines to simulate map */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="gray"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Route lines (mock) */}
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Route 1 */}
                    <path
                      d="M 50 100 Q 100 150 150 120 T 250 180"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                    {/* Route 2 */}
                    <path
                      d="M 80 200 Q 150 180 200 220 T 280 250"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                    {/* Route 3 */}
                    <path
                      d="M 100 300 Q 180 280 220 320"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  </svg>

                  {/* Driver markers */}
                  {filteredRoutes.map((route, index) => (
                    <div
                      key={route.driverId}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${30 + index * 20}%`,
                        top: `${30 + index * 15}%`,
                      }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 shadow-lg">
                        <Car className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                        <span className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">
                          {route.driverName.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Center message */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                      <p className="text-sm font-medium text-gray-700">Route Visualization</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Connect to Google Maps for live routes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Summary */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Route Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredRoutes.map((route) => (
                <div
                  key={route.driverId}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {route.driverName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{route.driverName}</p>
                      <p className="text-xs text-gray-500">
                        {route.trips.length} trips • {route.totalMiles.toFixed(1)} mi
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      route.efficiency >= 90
                        ? 'bg-success-100 text-success-600'
                        : route.efficiency >= 80
                        ? 'bg-warning-100 text-warning-600'
                        : 'bg-error-100 text-error-600'
                    }`}
                  >
                    <span className="text-sm font-bold">{route.efficiency}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
