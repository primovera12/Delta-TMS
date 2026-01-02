'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Car,
  Filter,
  Download,
  Plus,
} from 'lucide-react';

// Mock schedule data
const mockSchedule = {
  '2024-01-15': [
    { id: 'TRP-1001', time: '7:00 AM', patient: 'John Smith', driver: 'Michael J.', type: 'Pickup', status: 'completed' },
    { id: 'TRP-1002', time: '8:30 AM', patient: 'Mary Johnson', driver: 'Sarah K.', type: 'Round Trip', status: 'completed' },
    { id: 'TRP-1003', time: '9:00 AM', patient: 'Robert Davis', driver: 'David L.', type: 'Pickup', status: 'in_progress' },
    { id: 'TRP-1004', time: '10:00 AM', patient: 'Jennifer Wilson', driver: 'Lisa M.', type: 'Dropoff', status: 'scheduled' },
    { id: 'TRP-1005', time: '11:30 AM', patient: 'William Brown', driver: 'Michael J.', type: 'Round Trip', status: 'scheduled' },
    { id: 'TRP-1006', time: '1:00 PM', patient: 'Susan Miller', driver: 'James W.', type: 'Pickup', status: 'scheduled' },
    { id: 'TRP-1007', time: '2:30 PM', patient: 'Thomas Anderson', driver: 'Sarah K.', type: 'Round Trip', status: 'scheduled' },
    { id: 'TRP-1008', time: '3:00 PM', patient: 'Patricia White', driver: 'David L.', type: 'Dropoff', status: 'scheduled' },
    { id: 'TRP-1009', time: '4:30 PM', patient: 'Richard Lee', driver: 'Emily C.', type: 'Pickup', status: 'scheduled' },
  ],
};

const hours = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'];

const drivers = [
  { id: 'DRV-001', name: 'Michael J.', color: 'bg-blue-500' },
  { id: 'DRV-002', name: 'Sarah K.', color: 'bg-green-500' },
  { id: 'DRV-003', name: 'David L.', color: 'bg-purple-500' },
  { id: 'DRV-004', name: 'Lisa M.', color: 'bg-orange-500' },
  { id: 'DRV-005', name: 'James W.', color: 'bg-pink-500' },
  { id: 'DRV-006', name: 'Emily C.', color: 'bg-cyan-500' },
];

export default function OperationsSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-15'));
  const [view, setView] = useState<'day' | 'week'>('day');
  const [filterDriver, setFilterDriver] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDriverColor = (driverName: string) => {
    const driver = drivers.find(d => d.name === driverName);
    return driver?.color || 'bg-gray-500';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const trips = mockSchedule['2024-01-15'] || [];
  const filteredTrips = filterDriver === 'all' ? trips : trips.filter(t => t.driver === filterDriver);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Calendar</h1>
          <p className="text-gray-600">Manage and view all scheduled rides</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Trip
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterDriver} onValueChange={setFilterDriver}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by driver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.name}>{driver.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border">
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('day')}
            >
              Day
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Timeline View */}
        <div className="col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {hours.map((hour) => {
                  const hourTrips = filteredTrips.filter(t => t.time.includes(hour.replace(' ', '')));
                  return (
                    <div key={hour} className="flex min-h-[80px]">
                      <div className="w-20 p-3 text-sm text-gray-500 border-r bg-gray-50">
                        {hour}
                      </div>
                      <div className="flex-1 p-2 space-y-2">
                        {hourTrips.map((trip) => (
                          <div
                            key={trip.id}
                            className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(trip.status)}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getDriverColor(trip.driver)}`} />
                                <span className="font-medium text-sm">{trip.patient}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {trip.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {trip.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {trip.driver}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trips</span>
                  <span className="font-semibold">{trips.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {trips.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {trips.filter(t => t.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled</span>
                  <span className="font-semibold text-purple-600">
                    {trips.filter(t => t.status === 'scheduled').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Legend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {drivers.map((driver) => {
                  const driverTrips = trips.filter(t => t.driver === driver.name);
                  return (
                    <div key={driver.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${driver.color}`} />
                        <span className="text-sm">{driver.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {driverTrips.length} trips
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Add */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Add Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Patient name" />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
