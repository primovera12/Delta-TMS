'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  AlertCircle,
  Trash2,
  Edit,
  Repeat,
  Coffee,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface Driver {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

interface Shift {
  id: string;
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: string;
  status: string;
  notes: string | null;
  isRecurring: boolean;
  driver: Driver;
}

const SHIFT_TYPES = [
  { value: 'regular', label: 'Regular', icon: Clock, color: 'bg-primary-100 text-primary-700' },
  { value: 'morning', label: 'Morning', icon: Sun, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'afternoon', label: 'Afternoon', icon: Coffee, color: 'bg-orange-100 text-orange-700' },
  { value: 'evening', label: 'Evening', icon: Moon, color: 'bg-indigo-100 text-indigo-700' },
  { value: 'overtime', label: 'Overtime', icon: Clock, color: 'bg-red-100 text-red-700' },
  { value: 'on_call', label: 'On Call', icon: AlertCircle, color: 'bg-gray-100 text-gray-700' },
];

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  started: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-red-100 text-red-700',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ShiftManagementPage() {
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentWeek, setCurrentWeek] = React.useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });

  // Dialog state
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [selectedShift, setSelectedShift] = React.useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedDriver, setSelectedDriver] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    driverId: '',
    date: '',
    startTime: '06:00',
    endTime: '14:00',
    shiftType: 'regular',
    notes: '',
    isRecurring: false,
    recurrenceDays: [] as string[],
    recurrenceWeeks: '4',
  });

  const getWeekDates = React.useCallback(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeek]);

  const weekDates = getWeekDates();

  const fetchShifts = React.useCallback(async () => {
    try {
      setLoading(true);
      const startDate = weekDates[0].toISOString();
      const endDate = weekDates[6].toISOString();

      const response = await fetch(
        `/api/v1/shifts?startDate=${startDate}&endDate=${endDate}&limit=500`
      );
      const data = await response.json();

      if (data.success) {
        setShifts(data.data.shifts);
      }
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
    } finally {
      setLoading(false);
    }
  }, [weekDates]);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/v1/drivers?status=active&limit=100');
      const data = await response.json();

      if (data.success) {
        setDrivers(data.data.drivers);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  };

  React.useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  React.useEffect(() => {
    fetchDrivers();
  }, []);

  const navigateWeek = (direction: 'prev' | 'next' | 'current') => {
    if (direction === 'current') {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day;
      setCurrentWeek(new Date(today.setDate(diff)));
    } else {
      const days = direction === 'prev' ? -7 : 7;
      setCurrentWeek(new Date(currentWeek.getTime() + days * 24 * 60 * 60 * 1000));
    }
  };

  const formatWeekRange = () => {
    const startStr = weekDates[0].toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endStr = weekDates[6].toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${startStr} - ${endStr}`;
  };

  const getShiftsForDriverAndDate = (driverId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(
      (shift) =>
        shift.driverId === driverId &&
        new Date(shift.date).toISOString().split('T')[0] === dateStr
    );
  };

  const openCreateDialog = (date: Date, driverId?: string) => {
    setSelectedDate(date);
    setFormData({
      driverId: driverId || '',
      date: date.toISOString().split('T')[0],
      startTime: '06:00',
      endTime: '14:00',
      shiftType: 'regular',
      notes: '',
      isRecurring: false,
      recurrenceDays: [],
      recurrenceWeeks: '4',
    });
    setShowCreateDialog(true);
  };

  const openEditDialog = (shift: Shift) => {
    setSelectedShift(shift);
    setFormData({
      driverId: shift.driverId,
      date: new Date(shift.date).toISOString().split('T')[0],
      startTime: shift.startTime,
      endTime: shift.endTime,
      shiftType: shift.shiftType,
      notes: shift.notes || '',
      isRecurring: shift.isRecurring,
      recurrenceDays: [],
      recurrenceWeeks: '4',
    });
    setShowEditDialog(true);
  };

  const handleCreateShift = async () => {
    if (!formData.driverId || !formData.date || !formData.startTime || !formData.endTime) {
      return;
    }

    try {
      setIsSubmitting(true);

      let recurrenceRule = null;
      if (formData.isRecurring && formData.recurrenceDays.length > 0) {
        recurrenceRule = `FREQ=WEEKLY;BYDAY=${formData.recurrenceDays.join(',')};COUNT=${formData.recurrenceWeeks}`;
      }

      const response = await fetch('/api/v1/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: formData.driverId,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          shiftType: formData.shiftType,
          notes: formData.notes || null,
          isRecurring: formData.isRecurring,
          recurrenceRule,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateDialog(false);
        fetchShifts();
      }
    } catch (error) {
      console.error('Failed to create shift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateShift = async () => {
    if (!selectedShift) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/v1/shifts/${selectedShift.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: formData.startTime,
          endTime: formData.endTime,
          shiftType: formData.shiftType,
          notes: formData.notes || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowEditDialog(false);
        setSelectedShift(null);
        fetchShifts();
      }
    } catch (error) {
      console.error('Failed to update shift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShift = async (shiftId: string, deleteRecurring = false) => {
    try {
      const url = deleteRecurring
        ? `/api/v1/shifts/${shiftId}?deleteRecurring=true`
        : `/api/v1/shifts/${shiftId}`;

      const response = await fetch(url, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setShowEditDialog(false);
        setSelectedShift(null);
        fetchShifts();
      }
    } catch (error) {
      console.error('Failed to delete shift:', error);
    }
  };

  const handleStatusUpdate = async (shiftId: string, status: string) => {
    try {
      const response = await fetch('/api/v1/shifts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [shiftId], status }),
      });

      const data = await response.json();
      if (data.success) {
        fetchShifts();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getShiftTypeInfo = (type: string) => {
    return SHIFT_TYPES.find((t) => t.value === type) || SHIFT_TYPES[0];
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate stats
  const totalShifts = shifts.length;
  const confirmedShifts = shifts.filter((s) => s.status === 'confirmed').length;
  const scheduledShifts = shifts.filter((s) => s.status === 'scheduled').length;
  const recurringShifts = shifts.filter((s) => s.isRecurring).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Shift Management</h1>
          <p className="text-sm text-gray-500">Schedule and manage driver shifts</p>
        </div>
        <Button onClick={() => openCreateDialog(new Date())}>
          <Plus className="h-4 w-4 mr-2" />
          Add Shift
        </Button>
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
                <p className="text-2xl font-bold text-gray-900">{totalShifts}</p>
                <p className="text-sm text-gray-500">Total Shifts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{scheduledShifts}</p>
                <p className="text-sm text-gray-500">Pending Confirmation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{confirmedShifts}</p>
                <p className="text-sm text-gray-500">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Repeat className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{recurringShifts}</p>
                <p className="text-sm text-gray-500">Recurring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigateWeek('current')}>
                  This Week
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-semibold text-gray-900">{formatWeekRange()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger className="w-48">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.user.firstName} {driver.user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : drivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No active drivers found</p>
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48 sticky left-0 bg-gray-50 z-10">
                    Driver
                  </th>
                  {weekDates.map((date, index) => {
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    return (
                      <th
                        key={index}
                        className={`px-2 py-3 text-center text-xs font-medium uppercase tracking-wider min-w-[120px] ${
                          isToday ? 'bg-primary-50 text-primary-700' : 'text-gray-500'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span>{WEEKDAYS[index]}</span>
                          <span className="text-lg font-bold mt-1">
                            {date.getDate()}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {drivers
                  .filter((d) => selectedDriver === 'all' || selectedDriver === '' || d.id === selectedDriver)
                  .map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                          <Avatar size="sm">
                            <AvatarFallback>
                              {driver.user.firstName[0]}
                              {driver.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {driver.user.firstName} {driver.user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      {weekDates.map((date, index) => {
                        const dayShifts = getShiftsForDriverAndDate(driver.id, date);
                        const isToday =
                          date.toDateString() === new Date().toDateString();

                        return (
                          <td
                            key={index}
                            className={`px-2 py-2 align-top ${
                              isToday ? 'bg-primary-50' : ''
                            }`}
                          >
                            <div className="space-y-1 min-h-[60px]">
                              {dayShifts.map((shift) => {
                                const typeInfo = getShiftTypeInfo(shift.shiftType);
                                return (
                                  <button
                                    key={shift.id}
                                    onClick={() => openEditDialog(shift)}
                                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${typeInfo.color} hover:opacity-80`}
                                  >
                                    <div className="flex items-center gap-1">
                                      {shift.isRecurring && (
                                        <Repeat className="h-3 w-3 flex-shrink-0" />
                                      )}
                                      <span className="truncate">
                                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                      </span>
                                    </div>
                                    <Badge
                                      className={`mt-1 text-[10px] ${
                                        STATUS_COLORS[shift.status] || ''
                                      }`}
                                    >
                                      {shift.status}
                                    </Badge>
                                  </button>
                                );
                              })}
                              <button
                                onClick={() => openCreateDialog(date, driver.id)}
                                className="w-full text-center py-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-xs"
                              >
                                <Plus className="h-3 w-3 mx-auto" />
                              </button>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Create Shift Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Shift</DialogTitle>
            <DialogDescription>
              Create a new shift assignment for a driver.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Driver</Label>
              <Select
                value={formData.driverId}
                onValueChange={(v) => setFormData({ ...formData, driverId: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.user.firstName} {driver.user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Shift Type</Label>
              <Select
                value={formData.shiftType}
                onValueChange={(v) => setFormData({ ...formData, shiftType: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHIFT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isRecurring: checked === true })
                }
              />
              <Label htmlFor="recurring">Recurring shift</Label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-3 pl-6">
                <div>
                  <Label className="text-sm">Repeat on days</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const days = formData.recurrenceDays.includes(day)
                            ? formData.recurrenceDays.filter((d) => d !== day)
                            : [...formData.recurrenceDays, day];
                          setFormData({ ...formData, recurrenceDays: days });
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          formData.recurrenceDays.includes(day)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>For how many weeks</Label>
                  <Select
                    value={formData.recurrenceWeeks}
                    onValueChange={(v) => setFormData({ ...formData, recurrenceWeeks: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 weeks</SelectItem>
                      <SelectItem value="4">4 weeks</SelectItem>
                      <SelectItem value="8">8 weeks</SelectItem>
                      <SelectItem value="12">12 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateShift} disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogDescription>
              Modify shift details or update status.
            </DialogDescription>
          </DialogHeader>
          {selectedShift && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  {selectedShift.driver.user.firstName} {selectedShift.driver.user.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedShift.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Shift Type</Label>
                <Select
                  value={formData.shiftType}
                  onValueChange={(v) => setFormData({ ...formData, shiftType: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIFT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={selectedShift.status}
                  onValueChange={(v) => handleStatusUpdate(selectedShift.id, v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="started">Started</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special instructions..."
                  className="mt-1"
                />
              </div>

              {selectedShift.isRecurring && (
                <div className="flex items-center gap-2 text-sm text-info-600">
                  <Repeat className="h-4 w-4" />
                  <span>This is a recurring shift</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => selectedShift && handleDeleteShift(selectedShift.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              {selectedShift?.isRecurring && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => selectedShift && handleDeleteShift(selectedShift.id, true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete All
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateShift} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
