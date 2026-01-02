'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  User,
  Car,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Coffee,
  Sun,
  Moon,
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

// Mock data
const drivers = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    vehicleType: 'Wheelchair',
    phone: '(555) 123-4567',
    status: 'active',
  },
  {
    id: 'DRV-002',
    name: 'Mike Johnson',
    vehicleType: 'Stretcher',
    phone: '(555) 234-5678',
    status: 'active',
  },
  {
    id: 'DRV-003',
    name: 'Sarah Williams',
    vehicleType: 'Wheelchair',
    phone: '(555) 345-6789',
    status: 'active',
  },
  {
    id: 'DRV-004',
    name: 'David Lee',
    vehicleType: 'Ambulatory',
    phone: '(555) 456-7890',
    status: 'active',
  },
  {
    id: 'DRV-005',
    name: 'Emily Davis',
    vehicleType: 'Wheelchair',
    phone: '(555) 567-8901',
    status: 'active',
  },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate mock availability data
const generateAvailability = () => {
  const availability: Record<string, Record<string, { available: boolean; shift?: string; note?: string }>> = {};

  drivers.forEach((driver) => {
    availability[driver.id] = {};
    weekDays.forEach((day, index) => {
      // Simulate different availability patterns
      if (day === 'Sun') {
        availability[driver.id][day] = { available: false, note: 'Day off' };
      } else if (day === 'Sat' && driver.id !== 'DRV-001') {
        availability[driver.id][day] = { available: false, note: 'Day off' };
      } else {
        const shifts = ['morning', 'afternoon', 'full'];
        const randomShift = shifts[Math.floor(Math.random() * shifts.length)];
        availability[driver.id][day] = { available: true, shift: randomShift };
      }
    });
  });

  return availability;
};

const initialAvailability = generateAvailability();

const shiftLabels: Record<string, { label: string; icon: typeof Sun; time: string }> = {
  morning: { label: 'Morning', icon: Sun, time: '6 AM - 2 PM' },
  afternoon: { label: 'Afternoon', icon: Coffee, time: '2 PM - 10 PM' },
  full: { label: 'Full Day', icon: Clock, time: '6 AM - 10 PM' },
};

export default function DriverAvailabilityPage() {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const [availability, setAvailability] = React.useState(initialAvailability);
  const [selectedDriver, setSelectedDriver] = React.useState<string | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const goToPreviousWeek = () => {
    setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const goToNextWeek = () => {
    setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const goToThisWeek = () => {
    setCurrentWeek(new Date());
  };

  const toggleAvailability = (driverId: string, day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [driverId]: {
        ...prev[driverId],
        [day]: {
          ...prev[driverId]?.[day],
          available: !prev[driverId]?.[day]?.available,
        },
      },
    }));
  };

  const updateShift = (driverId: string, day: string, shift: string) => {
    setAvailability((prev) => ({
      ...prev,
      [driverId]: {
        ...prev[driverId],
        [day]: {
          available: true,
          shift,
        },
      },
    }));
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const getAvailableCount = (day: string) => {
    return drivers.filter((d) => availability[d.id]?.[day]?.available).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Driver Availability</h1>
          <p className="text-sm text-gray-500">Manage driver schedules and availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Calendar className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Off
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={goToThisWeek}>
                  This Week
                </Button>
                <Button variant="ghost" size="sm" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-semibold text-gray-900">{formatWeekRange()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-success-500" />
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gray-300" />
                <span className="text-sm text-gray-600">Unavailable</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Driver
                </th>
                {weekDates.map((date, index) => (
                  <th
                    key={index}
                    className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex flex-col items-center">
                      <span>{weekDays[index]}</span>
                      <span className="text-gray-400 font-normal mt-1">
                        {date.getDate()}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Summary Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-500">
                  Available Drivers
                </td>
                {weekDays.map((day) => (
                  <td key={day} className="px-3 py-3 text-center">
                    <Badge
                      variant={getAvailableCount(day) >= 3 ? 'success' : getAvailableCount(day) >= 2 ? 'warning' : 'error'}
                    >
                      {getAvailableCount(day)} / {drivers.length}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Driver Rows */}
              {drivers.map((driver) => (
                <tr
                  key={driver.id}
                  className={`hover:bg-gray-50 ${selectedDriver === driver.id ? 'bg-primary-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
                    >
                      <Avatar size="sm">
                        <AvatarFallback>
                          {driver.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.vehicleType}</p>
                      </div>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const dayAvailability = availability[driver.id]?.[day];
                    const isAvailable = dayAvailability?.available;
                    const shift = dayAvailability?.shift;
                    const ShiftIcon = shift ? shiftLabels[shift]?.icon : null;

                    return (
                      <td key={day} className="px-3 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => toggleAvailability(driver.id, day)}
                            className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                              isAvailable
                                ? 'bg-success-100 text-success-600 hover:bg-success-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {isAvailable ? (
                              ShiftIcon ? <ShiftIcon className="h-5 w-5" /> : <Check className="h-5 w-5" />
                            ) : (
                              <X className="h-5 w-5" />
                            )}
                          </button>
                          {isAvailable && shift && (
                            <span className="text-xs text-gray-500">
                              {shiftLabels[shift]?.label}
                            </span>
                          )}
                          {!isAvailable && dayAvailability?.note && (
                            <span className="text-xs text-gray-400">
                              {dayAvailability.note}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Selected Driver Details */}
      {selectedDriver && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Edit Schedule - {drivers.find((d) => d.id === selectedDriver)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-7">
              {weekDays.map((day) => {
                const dayAvailability = availability[selectedDriver]?.[day];

                return (
                  <div key={day} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{day}</label>
                    <Select
                      value={
                        dayAvailability?.available
                          ? dayAvailability.shift || 'full'
                          : 'off'
                      }
                      onValueChange={(value) => {
                        if (value === 'off') {
                          setAvailability((prev) => ({
                            ...prev,
                            [selectedDriver]: {
                              ...prev[selectedDriver],
                              [day]: { available: false, note: 'Day off' },
                            },
                          }));
                        } else {
                          updateShift(selectedDriver, day, value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Day Off</SelectItem>
                        <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2 PM - 10 PM)</SelectItem>
                        <SelectItem value="full">Full Day (6 AM - 10 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setSelectedDriver(null)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <User className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
                <p className="text-sm text-gray-500">Active Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.reduce((sum, d) => {
                    return sum + weekDays.filter((day) => availability[d.id]?.[day]?.available).length;
                  }, 0)}
                </p>
                <p className="text-sm text-gray-500">Scheduled Shifts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {weekDays.filter((day) => getAvailableCount(day) < 2).length}
                </p>
                <p className="text-sm text-gray-500">Low Coverage Days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-sm text-gray-500">Week Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
