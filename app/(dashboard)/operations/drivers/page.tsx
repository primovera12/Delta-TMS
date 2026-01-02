'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Star,
} from 'lucide-react';

// Mock driver data
const mockDrivers = [
  {
    id: 'DRV-001',
    name: 'Michael Johnson',
    phone: '(555) 234-5678',
    status: 'on_trip',
    shift: 'Morning',
    shiftTime: '6:00 AM - 2:00 PM',
    vehicle: 'VEH-042',
    vehicleType: 'Wheelchair Van',
    tripsToday: 4,
    tripsScheduled: 6,
    currentLocation: 'Downtown',
    rating: 4.8,
    onTime: 96,
  },
  {
    id: 'DRV-002',
    name: 'Sarah Kim',
    phone: '(555) 345-6789',
    status: 'available',
    shift: 'Morning',
    shiftTime: '6:00 AM - 2:00 PM',
    vehicle: 'VEH-015',
    vehicleType: 'Sedan',
    tripsToday: 3,
    tripsScheduled: 5,
    currentLocation: 'North Side',
    rating: 4.9,
    onTime: 98,
  },
  {
    id: 'DRV-003',
    name: 'David Lee',
    phone: '(555) 456-7890',
    status: 'on_trip',
    shift: 'Morning',
    shiftTime: '6:00 AM - 2:00 PM',
    vehicle: 'VEH-023',
    vehicleType: 'Stretcher',
    tripsToday: 5,
    tripsScheduled: 7,
    currentLocation: 'East District',
    rating: 4.7,
    onTime: 94,
  },
  {
    id: 'DRV-004',
    name: 'Lisa Martinez',
    phone: '(555) 567-8901',
    status: 'break',
    shift: 'Morning',
    shiftTime: '6:00 AM - 2:00 PM',
    vehicle: 'VEH-031',
    vehicleType: 'Wheelchair Van',
    tripsToday: 2,
    tripsScheduled: 4,
    currentLocation: 'HQ',
    rating: 4.6,
    onTime: 92,
  },
  {
    id: 'DRV-005',
    name: 'James Wilson',
    phone: '(555) 678-9012',
    status: 'available',
    shift: 'Afternoon',
    shiftTime: '2:00 PM - 10:00 PM',
    vehicle: 'VEH-007',
    vehicleType: 'Sedan',
    tripsToday: 0,
    tripsScheduled: 5,
    currentLocation: 'South Gate',
    rating: 4.8,
    onTime: 97,
  },
  {
    id: 'DRV-006',
    name: 'Emily Chen',
    phone: '(555) 789-0123',
    status: 'on_trip',
    shift: 'Morning',
    shiftTime: '6:00 AM - 2:00 PM',
    vehicle: 'VEH-019',
    vehicleType: 'Wheelchair Van',
    tripsToday: 4,
    tripsScheduled: 5,
    currentLocation: 'Medical Center',
    rating: 4.9,
    onTime: 99,
  },
];

const mockTimeOffRequests = [
  { id: 1, driver: 'Michael Johnson', dates: 'Jan 20-22', reason: 'Personal', status: 'pending' },
  { id: 2, driver: 'Sarah Kim', dates: 'Jan 25', reason: 'Medical', status: 'pending' },
  { id: 3, driver: 'David Lee', dates: 'Feb 1-3', reason: 'Vacation', status: 'approved' },
];

export default function OperationsDriversPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShift, setFilterShift] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      on_trip: 'bg-green-100 text-green-800',
      available: 'bg-blue-100 text-blue-800',
      break: 'bg-orange-100 text-orange-800',
      offline: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      on_trip: 'bg-green-500',
      available: 'bg-blue-500',
      break: 'bg-orange-500',
      offline: 'bg-gray-400',
    };
    return colors[status] || 'bg-gray-400';
  };

  const filteredDrivers = mockDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    const matchesShift = filterShift === 'all' || driver.shift === filterShift;
    return matchesSearch && matchesStatus && matchesShift;
  });

  const statusCounts = {
    total: mockDrivers.length,
    on_trip: mockDrivers.filter(d => d.status === 'on_trip').length,
    available: mockDrivers.filter(d => d.status === 'available').length,
    break: mockDrivers.filter(d => d.status === 'break').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Schedules</h1>
          <p className="text-gray-600">Manage driver availability, shifts, and assignments</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('all')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <User className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('on_trip')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Trip</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.on_trip}</p>
              </div>
              <Car className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('available')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.available}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setFilterStatus('break')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Break</p>
                <p className="text-2xl font-bold text-orange-600">{statusCounts.break}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="drivers">
        <TabsList>
          <TabsTrigger value="drivers">Active Drivers</TabsTrigger>
          <TabsTrigger value="schedule">Shift Schedule</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search drivers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on_trip">On Trip</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="break">On Break</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterShift} onValueChange={setFilterShift}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Driver List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/operations/drivers/${driver.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(driver.status)}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{driver.name}</p>
                            <Badge className={getStatusColor(driver.status)}>
                              {driver.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {driver.shiftTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {driver.vehicle} ({driver.vehicleType})
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {driver.currentLocation}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Trips Today</p>
                          <p className="font-semibold">{driver.tripsToday} / {driver.tripsScheduled}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Rating</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            {driver.rating}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">On-Time</p>
                          <p className="font-semibold text-green-600">{driver.onTime}%</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Shift Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Morning Shift (6:00 AM - 2:00 PM)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {mockDrivers.filter(d => d.shift === 'Morning').map(driver => (
                      <div key={driver.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot(driver.status)}`} />
                          <span className="font-medium">{driver.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{driver.vehicle}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Afternoon Shift (2:00 PM - 10:00 PM)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {mockDrivers.filter(d => d.shift === 'Afternoon').map(driver => (
                      <div key={driver.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot(driver.status)}`} />
                          <span className="font-medium">{driver.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{driver.vehicle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeoff" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Time Off Requests</CardTitle>
              <Badge variant="secondary">{mockTimeOffRequests.filter(r => r.status === 'pending').length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTimeOffRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{request.driver}</p>
                      <p className="text-sm text-gray-500">{request.dates} • {request.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">Deny</Button>
                          <Button size="sm">Approve</Button>
                        </>
                      )}
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
