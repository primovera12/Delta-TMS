/**
 * Timesheet Service
 * Handles driver clock in/out and timesheet management
 */

export interface TimesheetEntry {
  id: string;
  driverId: string;
  date: Date;
  clockInTime: Date;
  clockOutTime: Date | null;
  breakStartTime: Date | null;
  breakEndTime: Date | null;
  totalBreakMinutes: number;
  totalMinutes: number | null;
  totalMiles: number | null;
  totalTrips: number | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
}

export interface ClockStatus {
  isClockedIn: boolean;
  isOnBreak: boolean;
  currentEntry: TimesheetEntry | null;
  todayStats: {
    hoursWorked: number;
    tripsCompleted: number;
    milesDriven: number;
    earnings: number;
  };
}

/**
 * Calculate total minutes worked (excluding breaks)
 */
export function calculateWorkMinutes(
  clockIn: Date,
  clockOut: Date | null,
  breakMinutes: number = 0
): number {
  const end = clockOut || new Date();
  const totalMinutes = Math.floor((end.getTime() - clockIn.getTime()) / (1000 * 60));
  return Math.max(0, totalMinutes - breakMinutes);
}

/**
 * Format hours and minutes for display
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Calculate break duration
 */
export function calculateBreakMinutes(
  breakStart: Date | null,
  breakEnd: Date | null
): number {
  if (!breakStart) return 0;
  const end = breakEnd || new Date();
  return Math.floor((end.getTime() - breakStart.getTime()) / (1000 * 60));
}

/**
 * Validate clock in/out times
 */
export function validateTimesheetEntry(entry: Partial<TimesheetEntry>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!entry.clockInTime) {
    errors.push('Clock in time is required');
  }

  if (entry.clockOutTime && entry.clockInTime) {
    if (new Date(entry.clockOutTime) < new Date(entry.clockInTime)) {
      errors.push('Clock out time cannot be before clock in time');
    }
  }

  if (entry.breakStartTime && entry.breakEndTime) {
    if (new Date(entry.breakEndTime) < new Date(entry.breakStartTime)) {
      errors.push('Break end time cannot be before break start time');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if driver can clock in (business rules)
 */
export function canClockIn(
  hasActiveEntry: boolean,
  serviceStartHour: number = 5,
  serviceEndHour: number = 23
): { allowed: boolean; reason?: string } {
  if (hasActiveEntry) {
    return { allowed: false, reason: 'Already clocked in' };
  }

  const now = new Date();
  const hour = now.getHours();

  if (hour < serviceStartHour || hour >= serviceEndHour) {
    return {
      allowed: false,
      reason: `Clock in is only available between ${serviceStartHour}:00 and ${serviceEndHour}:00`,
    };
  }

  return { allowed: true };
}

/**
 * Check if driver can clock out
 */
export function canClockOut(
  hasActiveEntry: boolean,
  isOnBreak: boolean
): { allowed: boolean; reason?: string } {
  if (!hasActiveEntry) {
    return { allowed: false, reason: 'Not clocked in' };
  }

  if (isOnBreak) {
    return { allowed: false, reason: 'Please end your break first' };
  }

  return { allowed: true };
}
