'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Repeat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

interface TimeOffRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const mockAvailability: TimeSlot[] = [
  { id: '1', dayOfWeek: 1, startTime: '06:00', endTime: '14:00', isRecurring: true },
  { id: '2', dayOfWeek: 2, startTime: '06:00', endTime: '14:00', isRecurring: true },
  { id: '3', dayOfWeek: 3, startTime: '06:00', endTime: '14:00', isRecurring: true },
  { id: '4', dayOfWeek: 4, startTime: '06:00', endTime: '14:00', isRecurring: true },
  { id: '5', dayOfWeek: 5, startTime: '06:00', endTime: '14:00', isRecurring: true },
];

const mockTimeOff: TimeOffRequest[] = [
  { id: '1', startDate: '2024-02-01', endDate: '2024-02-02', reason: 'Personal', status: 'approved' },
  { id: '2', startDate: '2024-02-15', endDate: '2024-02-15', reason: 'Doctor appointment', status: 'pending' },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  const time = `${hours.toString().padStart(2, '0')}:${minutes}`;
  const displayHour = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  return { value: time, label: `${displayHour}:${minutes} ${ampm}` };
});

export default function DriverAvailabilityPage() {
  const [availability, setAvailability] = React.useState<TimeSlot[]>(mockAvailability);
  const [timeOffRequests, setTimeOffRequests] = React.useState<TimeOffRequest[]>(mockTimeOff);
  const [isAddSlotOpen, setIsAddSlotOpen] = React.useState(false);
  const [isTimeOffOpen, setIsTimeOffOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedWeek, setSelectedWeek] = React.useState(new Date());

  const [newSlot, setNewSlot] = React.useState({
    dayOfWeek: 1,
    startTime: '06:00',
    endTime: '14:00',
    isRecurring: true,
  });

  const [newTimeOff, setNewTimeOff] = React.useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSaveAvailability = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleAddSlot = () => {
    const slot: TimeSlot = {
      id: Date.now().toString(),
      ...newSlot,
    };
    setAvailability([...availability, slot]);
    setIsAddSlotOpen(false);
    setNewSlot({ dayOfWeek: 1, startTime: '06:00', endTime: '14:00', isRecurring: true });
  };

  const handleRemoveSlot = (id: string) => {
    setAvailability(availability.filter((s) => s.id !== id));
  };

  const handleRequestTimeOff = async () => {
    const request: TimeOffRequest = {
      id: Date.now().toString(),
      ...newTimeOff,
      status: 'pending',
    };
    setTimeOffRequests([...timeOffRequests, request]);
    setIsTimeOffOpen(false);
    setNewTimeOff({ startDate: '', endDate: '', reason: '' });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const displayHour = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getWeekDates = () => {
    const start = new Date(selectedWeek);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const availabilityByDay = DAYS_OF_WEEK.map((day, index) => ({
    day,
    dayIndex: index,
    slots: availability.filter((s) => s.dayOfWeek === index),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Availability</h1>
          <p className="text-sm text-gray-500">Set your working hours and request time off</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsTimeOffOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Request Time Off
          </Button>
          <Button onClick={handleSaveAvailability} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-500" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>Set your regular working hours</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsAddSlotOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilityByDay.map(({ day, dayIndex, slots }) => (
              <div key={day} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-28 flex-shrink-0">
                  <p className="font-medium text-gray-900">{day}</p>
                  <p className="text-xs text-gray-500">
                    {slots.length > 0 ? `${slots.length} slot(s)` : 'Off'}
                  </p>
                </div>
                <div className="flex-1">
                  {slots.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No availability set</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg"
                        >
                          <Clock className="h-4 w-4 text-primary-600" />
                          <span className="text-sm font-medium text-primary-700">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                          {slot.isRecurring && (
                            <Repeat className="h-3 w-3 text-primary-500" />
                          )}
                          <button
                            onClick={() => handleRemoveSlot(slot.id)}
                            className="ml-1 text-primary-400 hover:text-error-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Week View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Week View</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedWeek);
                  newDate.setDate(newDate.getDate() - 7);
                  setSelectedWeek(newDate);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedWeek(new Date())}
              >
                This Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedWeek);
                  newDate.setDate(newDate.getDate() + 7);
                  setSelectedWeek(newDate);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const daySlots = availability.filter((s) => s.dayOfWeek === index);
              const isToday = date.toDateString() === new Date().toDateString();
              const hasTimeOff = timeOffRequests.some((t) => {
                const start = new Date(t.startDate);
                const end = new Date(t.endDate);
                return date >= start && date <= end && t.status === 'approved';
              });

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    isToday
                      ? 'border-primary-300 bg-primary-50'
                      : hasTimeOff
                      ? 'border-warning-200 bg-warning-50'
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-xs text-gray-500">{DAYS_OF_WEEK[index].slice(0, 3)}</p>
                  <p className={`text-lg font-semibold ${isToday ? 'text-primary-700' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </p>
                  {hasTimeOff ? (
                    <Badge variant="warning" className="text-xs mt-1">Time Off</Badge>
                  ) : daySlots.length > 0 ? (
                    <p className="text-xs text-success-600 mt-1">Available</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Off</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time Off Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-warning-500" />
            Time Off Requests
          </CardTitle>
          <CardDescription>Your pending and approved time off requests</CardDescription>
        </CardHeader>
        <CardContent>
          {timeOffRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No time off requests</p>
          ) : (
            <div className="space-y-3">
              {timeOffRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      request.status === 'approved'
                        ? 'bg-success-100'
                        : request.status === 'pending'
                        ? 'bg-warning-100'
                        : 'bg-error-100'
                    }`}>
                      {request.status === 'approved' ? (
                        <Check className="h-5 w-5 text-success-600" />
                      ) : request.status === 'pending' ? (
                        <Clock className="h-5 w-5 text-warning-600" />
                      ) : (
                        <X className="h-5 w-5 text-error-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(request.startDate).toLocaleDateString()}
                        {request.startDate !== request.endDate &&
                          ` - ${new Date(request.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-500">{request.reason}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Time Slot Dialog */}
      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Availability Slot</DialogTitle>
            <DialogDescription>
              Set your available working hours for a specific day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select
                value={newSlot.dayOfWeek.toString()}
                onValueChange={(v) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select
                  value={newSlot.startTime}
                  onValueChange={(v) => setNewSlot({ ...newSlot, startTime: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Select
                  value={newSlot.endTime}
                  onValueChange={(v) => setNewSlot({ ...newSlot, endTime: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Recurring Weekly</p>
                <p className="text-sm text-gray-500">Repeat this schedule every week</p>
              </div>
              <Switch
                checked={newSlot.isRecurring}
                onCheckedChange={(checked) => setNewSlot({ ...newSlot, isRecurring: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSlotOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSlot}>Add Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Time Off Dialog */}
      <Dialog open={isTimeOffOpen} onOpenChange={setIsTimeOffOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
            <DialogDescription>
              Submit a time off request for approval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <input
                  id="startDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newTimeOff.startDate}
                  onChange={(e) => setNewTimeOff({ ...newTimeOff, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <input
                  id="endDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newTimeOff.endDate}
                  onChange={(e) => setNewTimeOff({ ...newTimeOff, endDate: e.target.value })}
                  min={newTimeOff.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select
                value={newTimeOff.reason}
                onValueChange={(v) => setNewTimeOff({ ...newTimeOff, reason: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-info-50 border border-info-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-info-600 mt-0.5" />
                <p className="text-sm text-info-800">
                  Time off requests require manager approval. You'll be notified once your request is reviewed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTimeOffOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRequestTimeOff}
              disabled={!newTimeOff.startDate || !newTimeOff.endDate || !newTimeOff.reason}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
