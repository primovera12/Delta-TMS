'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Navigation,
  AlertCircle,
  CheckCircle,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock data
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const scheduledTrips = [
  {
    id: 'TR-20260115-001',
    date: '2026-01-15',
    time: '10:30 AM',
    patient: 'John Smith',
    patientPhone: '(555) 111-2222',
    pickup: {
      address: '123 Main St, Houston, TX',
      time: '10:30 AM',
    },
    dropoff: {
      address: 'Memorial Hospital, 1234 Medical Center Dr',
      time: '11:00 AM',
    },
    vehicleType: 'wheelchair',
    status: 'scheduled',
    notes: 'Patient needs assistance with wheelchair',
    willCall: false,
  },
  {
    id: 'TR-20260115-002',
    date: '2026-01-15',
    time: '12:00 PM',
    patient: 'Mary Jones',
    patientPhone: '(555) 222-3333',
    pickup: {
      address: '456 Oak Ave, Houston, TX',
      time: '12:00 PM',
    },
    dropoff: {
      address: 'City Dialysis Center, 789 Health Blvd',
      time: '12:30 PM',
    },
    vehicleType: 'wheelchair',
    status: 'scheduled',
    notes: '',
    willCall: false,
  },
  {
    id: 'TR-20260115-003',
    date: '2026-01-15',
    time: '2:30 PM',
    patient: 'Robert Brown',
    patientPhone: '(555) 333-4444',
    pickup: {
      address: 'City Dialysis Center, 789 Health Blvd',
      time: '2:30 PM',
    },
    dropoff: {
      address: '456 Oak Ave, Houston, TX',
      time: '3:00 PM',
    },
    vehicleType: 'wheelchair',
    status: 'scheduled',
    notes: 'Return trip',
    willCall: true,
  },
  {
    id: 'TR-20260116-001',
    date: '2026-01-16',
    time: '8:00 AM',
    patient: 'Emily Davis',
    patientPhone: '(555) 444-5555',
    pickup: {
      address: '321 Elm St, Houston, TX',
      time: '8:00 AM',
    },
    dropoff: {
      address: 'Cancer Treatment Center, 567 Oncology Way',
      time: '8:45 AM',
    },
    vehicleType: 'wheelchair',
    status: 'scheduled',
    notes: 'Weekly appointment',
    willCall: false,
  },
  {
    id: 'TR-20260116-002',
    date: '2026-01-16',
    time: '11:30 AM',
    patient: 'William Taylor',
    patientPhone: '(555) 555-6666',
    pickup: {
      address: '555 Cedar Lane, Houston, TX',
      time: '11:30 AM',
    },
    dropoff: {
      address: 'Heart Care Clinic, 890 Cardio Dr',
      time: '12:00 PM',
    },
    vehicleType: 'wheelchair',
    status: 'scheduled',
    notes: '',
    willCall: false,
  },
];

const driverStats = {
  tripsToday: 3,
  tripsThisWeek: 18,
  hoursScheduled: 42,
  nextTrip: '10:30 AM',
};

export default function DriverSchedulePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

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

  const weekDates = getWeekDates(currentDate);

  const goToPreviousWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const goToNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const goToThisWeek = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getTripsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledTrips.filter((trip) => trip.date === dateStr);
  };

  const selectedDateTrips = getTripsForDate(selectedDate);

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Schedule</h1>
          <p className="text-sm text-gray-500">View your upcoming trips and schedule</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{driverStats.tripsToday}</p>
                <p className="text-sm text-gray-500">Trips Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{driverStats.tripsThisWeek}</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{driverStats.hoursScheduled}h</p>
                <p className="text-sm text-gray-500">Hours Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Timer className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{driverStats.nextTrip}</p>
                <p className="text-sm text-gray-500">Next Trip</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
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
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dayTrips = getTripsForDate(date);
              const dayLabel = weekDays[index];

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    isSelected(date)
                      ? 'bg-primary-600 text-white'
                      : isToday(date)
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-xs font-medium opacity-80">{dayLabel}</div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                  {dayTrips.length > 0 && (
                    <div
                      className={`mt-1 text-xs font-medium ${
                        isSelected(date) ? 'text-white/80' : 'text-primary-600'
                      }`}
                    >
                      {dayTrips.length} trip{dayTrips.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {formatDateHeader(selectedDate)}
          </h2>
          <Badge variant={selectedDateTrips.length > 0 ? 'info' : 'secondary'}>
            {selectedDateTrips.length} trip{selectedDateTrips.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {selectedDateTrips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No trips scheduled for this day</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {selectedDateTrips.map((trip, index) => (
              <Card key={trip.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Time Column */}
                    <div className="text-center min-w-[80px]">
                      <div className="flex items-center justify-center gap-1 text-gray-400 text-sm mb-1">
                        <span className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{trip.time}</p>
                      <Badge
                        variant={trip.status === 'scheduled' ? 'info' : 'success'}
                        size="sm"
                        className="mt-1"
                      >
                        {trip.status}
                      </Badge>
                    </div>

                    <div className="h-full w-px bg-gray-200" />

                    {/* Trip Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{trip.patient}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{trip.patientPhone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {trip.willCall && (
                            <Badge variant="warning" size="sm">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Will-Call
                            </Badge>
                          )}
                          <Badge variant="secondary" size="sm">
                            {trip.vehicleType}
                          </Badge>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            <div className="h-2 w-2 rounded-full bg-success-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                            <p className="text-sm text-gray-600">{trip.pickup.address}</p>
                            <p className="text-xs text-gray-400">{trip.pickup.time}</p>
                          </div>
                        </div>
                        <div className="ml-1 h-4 border-l-2 border-dashed border-gray-200" />
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            <div className="h-2 w-2 rounded-full bg-error-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Dropoff</p>
                            <p className="text-sm text-gray-600">{trip.dropoff.address}</p>
                            <p className="text-xs text-gray-400">{trip.dropoff.time}</p>
                          </div>
                        </div>
                      </div>

                      {trip.notes && (
                        <p className="text-sm text-gray-500 italic mb-3">
                          Note: {trip.notes}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Link href={`/driver/trips/${trip.id}`}>
                          <Button size="sm">
                            <Navigation className="h-4 w-4 mr-2" />
                            Start Trip
                          </Button>
                        </Link>
                        <Button variant="secondary" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Patient
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
