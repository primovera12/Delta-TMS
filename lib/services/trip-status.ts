/**
 * Trip Status Management Service
 * Handles trip status transitions with validation and side effects
 */

import { TripStatus } from '@prisma/client';

// Valid status transitions
const validTransitions: Record<TripStatus, TripStatus[]> = {
  PENDING: [TripStatus.CONFIRMED, TripStatus.CANCELLED],
  CONFIRMED: [TripStatus.ASSIGNED, TripStatus.CANCELLED],
  ASSIGNED: [TripStatus.DRIVER_EN_ROUTE, TripStatus.CANCELLED],
  DRIVER_EN_ROUTE: [TripStatus.DRIVER_ARRIVED, TripStatus.CANCELLED],
  DRIVER_ARRIVED: [TripStatus.IN_PROGRESS, TripStatus.NO_SHOW, TripStatus.CANCELLED],
  IN_PROGRESS: [TripStatus.COMPLETED, TripStatus.CANCELLED],
  COMPLETED: [], // Terminal state
  CANCELLED: [], // Terminal state
  NO_SHOW: [], // Terminal state
};

// Status display information
export const statusInfo: Record<TripStatus, { label: string; color: string; description: string }> = {
  PENDING: {
    label: 'Pending',
    color: 'amber',
    description: 'Awaiting confirmation',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'blue',
    description: 'Confirmed, awaiting driver assignment',
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'purple',
    description: 'Driver assigned, awaiting pickup time',
  },
  DRIVER_EN_ROUTE: {
    label: 'Driver En Route',
    color: 'cyan',
    description: 'Driver is on the way to pickup',
  },
  DRIVER_ARRIVED: {
    label: 'Driver Arrived',
    color: 'emerald',
    description: 'Driver has arrived at pickup location',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'green',
    description: 'Trip is currently in progress',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'gray',
    description: 'Trip has been completed',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'red',
    description: 'Trip has been cancelled',
  },
  NO_SHOW: {
    label: 'No Show',
    color: 'rose',
    description: 'Passenger did not show up',
  },
};

// Driver-initiated status updates
export const driverActions: Record<TripStatus, { nextStatus: TripStatus; label: string; confirmText?: string }[]> = {
  PENDING: [],
  CONFIRMED: [],
  ASSIGNED: [
    { nextStatus: TripStatus.DRIVER_EN_ROUTE, label: 'Start En Route' },
  ],
  DRIVER_EN_ROUTE: [
    { nextStatus: TripStatus.DRIVER_ARRIVED, label: 'Arrived at Pickup' },
  ],
  DRIVER_ARRIVED: [
    { nextStatus: TripStatus.IN_PROGRESS, label: 'Start Trip' },
    { nextStatus: TripStatus.NO_SHOW, label: 'Mark No Show', confirmText: 'Are you sure the passenger is a no-show?' },
  ],
  IN_PROGRESS: [
    { nextStatus: TripStatus.COMPLETED, label: 'Complete Trip' },
  ],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

/**
 * Check if a status transition is valid
 */
export function isValidTransition(currentStatus: TripStatus, newStatus: TripStatus): boolean {
  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Get available next statuses for a trip
 */
export function getAvailableTransitions(currentStatus: TripStatus): TripStatus[] {
  return validTransitions[currentStatus] || [];
}

/**
 * Get driver actions available for a status
 */
export function getDriverActions(currentStatus: TripStatus) {
  return driverActions[currentStatus] || [];
}

/**
 * Check if a status is terminal (no further transitions)
 */
export function isTerminalStatus(status: TripStatus): boolean {
  return validTransitions[status]?.length === 0;
}

/**
 * Get status display info
 */
export function getStatusInfo(status: TripStatus) {
  return statusInfo[status];
}

/**
 * Calculate expected timestamps based on status
 */
export function getStatusTimestampField(status: TripStatus): string | null {
  switch (status) {
    case TripStatus.IN_PROGRESS:
      return 'actualPickupTime';
    case TripStatus.COMPLETED:
      return 'actualDropoffTime';
    case TripStatus.CANCELLED:
      return 'cancelledAt';
    default:
      return null;
  }
}

/**
 * Determine if status update requires location
 */
export function requiresLocation(status: TripStatus): boolean {
  const locationRequiredStatuses: TripStatus[] = [
    TripStatus.DRIVER_EN_ROUTE,
    TripStatus.DRIVER_ARRIVED,
    TripStatus.IN_PROGRESS,
    TripStatus.COMPLETED,
  ];
  return locationRequiredStatuses.includes(status);
}

/**
 * Status update request type
 */
export interface StatusUpdateRequest {
  tripId: string;
  newStatus: TripStatus;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  signature?: {
    url: string;
    name: string;
  };
  cancellationReason?: string;
}

/**
 * Status update result type
 */
export interface StatusUpdateResult {
  success: boolean;
  previousStatus: TripStatus;
  newStatus: TripStatus;
  timestamp: Date;
  error?: string;
}
