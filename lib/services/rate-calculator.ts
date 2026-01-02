/**
 * Rate Calculator Service
 * Calculates trip costs based on distance, service type, time, and additional fees
 */

export type ServiceType = 'wheelchair' | 'ambulatory' | 'stretcher' | 'bariatric';

export type TripType = 'one_way' | 'round_trip' | 'multi_stop';

export interface RateConfig {
  // Base rates by service type
  baseRates: Record<ServiceType, number>;

  // Per-mile rates by service type
  perMileRates: Record<ServiceType, number>;

  // Minimum charges
  minimumCharge: number;

  // Time-based fees
  waitTimePerMinute: number;
  afterHoursMultiplier: number;
  weekendMultiplier: number;
  holidayMultiplier: number;

  // Additional fees
  additionalStopFee: number;
  attendantFee: number;
  oxygenFee: number;
  stairsFee: number; // per flight
  noShowFee: number;
  cancelFee: number; // if cancelled within X hours

  // Discounts
  roundTripDiscount: number; // percentage
  standingOrderDiscount: number; // percentage
}

// Default rate configuration
export const defaultRateConfig: RateConfig = {
  baseRates: {
    wheelchair: 45.00,
    ambulatory: 35.00,
    stretcher: 85.00,
    bariatric: 95.00,
  },
  perMileRates: {
    wheelchair: 3.50,
    ambulatory: 2.75,
    stretcher: 4.50,
    bariatric: 5.00,
  },
  minimumCharge: 55.00,
  waitTimePerMinute: 0.75,
  afterHoursMultiplier: 1.25,
  weekendMultiplier: 1.15,
  holidayMultiplier: 1.50,
  additionalStopFee: 15.00,
  attendantFee: 10.00,
  oxygenFee: 15.00,
  stairsFee: 10.00,
  noShowFee: 45.00,
  cancelFee: 25.00,
  roundTripDiscount: 0.10,
  standingOrderDiscount: 0.05,
};

export interface TripDetails {
  serviceType: ServiceType;
  tripType: TripType;
  distanceMiles: number;
  estimatedWaitMinutes?: number;
  pickupDateTime: Date;
  additionalStops?: number;
  hasAttendant?: boolean;
  requiresOxygen?: boolean;
  stairFlights?: number;
  isStandingOrder?: boolean;
}

export interface RateBreakdown {
  baseCharge: number;
  mileageCharge: number;
  waitTimeCharge: number;
  additionalStopsFee: number;
  attendantFee: number;
  oxygenFee: number;
  stairsFee: number;
  timeMultiplier: number;
  multiplierReason?: string;
  subtotal: number;
  discounts: {
    roundTrip: number;
    standingOrder: number;
    total: number;
  };
  total: number;
  perLegTotal?: number; // For round trips
}

// US Federal holidays for a given year
function getFederalHolidays(year: number): Date[] {
  const holidays: Date[] = [];

  // New Year's Day
  holidays.push(new Date(year, 0, 1));

  // MLK Day (3rd Monday of January)
  holidays.push(getNthWeekday(year, 0, 1, 3));

  // Presidents Day (3rd Monday of February)
  holidays.push(getNthWeekday(year, 1, 1, 3));

  // Memorial Day (last Monday of May)
  holidays.push(getLastWeekday(year, 4, 1));

  // Independence Day
  holidays.push(new Date(year, 6, 4));

  // Labor Day (1st Monday of September)
  holidays.push(getNthWeekday(year, 8, 1, 1));

  // Columbus Day (2nd Monday of October)
  holidays.push(getNthWeekday(year, 9, 1, 2));

  // Veterans Day
  holidays.push(new Date(year, 10, 11));

  // Thanksgiving (4th Thursday of November)
  holidays.push(getNthWeekday(year, 10, 4, 4));

  // Christmas
  holidays.push(new Date(year, 11, 25));

  return holidays;
}

function getNthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  let day = 1 + (weekday - firstWeekday + 7) % 7 + (n - 1) * 7;
  return new Date(year, month, day);
}

function getLastWeekday(year: number, month: number, weekday: number): Date {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  const diff = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month, lastDay.getDate() - diff);
}

function isHoliday(date: Date): boolean {
  const holidays = getFederalHolidays(date.getFullYear());
  return holidays.some(
    (h) =>
      h.getFullYear() === date.getFullYear() &&
      h.getMonth() === date.getMonth() &&
      h.getDate() === date.getDate()
  );
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isAfterHours(date: Date): boolean {
  const hours = date.getHours();
  // After hours: before 6am or after 6pm
  return hours < 6 || hours >= 18;
}

/**
 * Calculate the rate for a trip
 */
export function calculateTripRate(
  details: TripDetails,
  config: RateConfig = defaultRateConfig
): RateBreakdown {
  const {
    serviceType,
    tripType,
    distanceMiles,
    estimatedWaitMinutes = 0,
    pickupDateTime,
    additionalStops = 0,
    hasAttendant = false,
    requiresOxygen = false,
    stairFlights = 0,
    isStandingOrder = false,
  } = details;

  // Base charge
  const baseCharge = config.baseRates[serviceType];

  // Mileage charge
  const mileageCharge = distanceMiles * config.perMileRates[serviceType];

  // Wait time charge
  const waitTimeCharge = estimatedWaitMinutes * config.waitTimePerMinute;

  // Additional fees
  const additionalStopsFee = additionalStops * config.additionalStopFee;
  const attendantFee = hasAttendant ? config.attendantFee : 0;
  const oxygenFee = requiresOxygen ? config.oxygenFee : 0;
  const stairsFee = stairFlights * config.stairsFee;

  // Time multiplier
  let timeMultiplier = 1.0;
  let multiplierReason: string | undefined;

  if (isHoliday(pickupDateTime)) {
    timeMultiplier = config.holidayMultiplier;
    multiplierReason = 'Holiday rate';
  } else if (isWeekend(pickupDateTime)) {
    timeMultiplier = config.weekendMultiplier;
    multiplierReason = 'Weekend rate';
  } else if (isAfterHours(pickupDateTime)) {
    timeMultiplier = config.afterHoursMultiplier;
    multiplierReason = 'After-hours rate';
  }

  // Calculate subtotal before multiplier
  const baseSubtotal =
    baseCharge + mileageCharge + waitTimeCharge + additionalStopsFee + attendantFee + oxygenFee + stairsFee;

  // Apply multiplier to base + mileage only (not to fixed fees)
  const adjustedBase = (baseCharge + mileageCharge) * timeMultiplier;
  const subtotal = adjustedBase + waitTimeCharge + additionalStopsFee + attendantFee + oxygenFee + stairsFee;

  // Calculate discounts
  let roundTripDiscount = 0;
  let standingOrderDiscount = 0;

  if (tripType === 'round_trip') {
    roundTripDiscount = subtotal * config.roundTripDiscount;
  }

  if (isStandingOrder) {
    standingOrderDiscount = (subtotal - roundTripDiscount) * config.standingOrderDiscount;
  }

  const totalDiscounts = roundTripDiscount + standingOrderDiscount;

  // Calculate total
  let total = subtotal - totalDiscounts;

  // Apply minimum charge if applicable
  if (total < config.minimumCharge) {
    total = config.minimumCharge;
  }

  // For round trips, multiply by 2
  let perLegTotal: number | undefined;
  if (tripType === 'round_trip') {
    perLegTotal = total;
    total = total * 2;
  }

  return {
    baseCharge,
    mileageCharge,
    waitTimeCharge,
    additionalStopsFee,
    attendantFee,
    oxygenFee,
    stairsFee,
    timeMultiplier,
    multiplierReason,
    subtotal,
    discounts: {
      roundTrip: roundTripDiscount,
      standingOrder: standingOrderDiscount,
      total: totalDiscounts,
    },
    total,
    perLegTotal,
  };
}

/**
 * Format rate breakdown as a string for display
 */
export function formatRateBreakdown(breakdown: RateBreakdown): string {
  const lines: string[] = [];

  lines.push(`Base Charge: $${breakdown.baseCharge.toFixed(2)}`);

  if (breakdown.mileageCharge > 0) {
    lines.push(`Mileage: $${breakdown.mileageCharge.toFixed(2)}`);
  }

  if (breakdown.waitTimeCharge > 0) {
    lines.push(`Wait Time: $${breakdown.waitTimeCharge.toFixed(2)}`);
  }

  if (breakdown.additionalStopsFee > 0) {
    lines.push(`Additional Stops: $${breakdown.additionalStopsFee.toFixed(2)}`);
  }

  if (breakdown.attendantFee > 0) {
    lines.push(`Attendant: $${breakdown.attendantFee.toFixed(2)}`);
  }

  if (breakdown.oxygenFee > 0) {
    lines.push(`Oxygen: $${breakdown.oxygenFee.toFixed(2)}`);
  }

  if (breakdown.stairsFee > 0) {
    lines.push(`Stairs: $${breakdown.stairsFee.toFixed(2)}`);
  }

  if (breakdown.timeMultiplier > 1) {
    lines.push(`${breakdown.multiplierReason}: ${(breakdown.timeMultiplier * 100 - 100).toFixed(0)}% surcharge`);
  }

  lines.push(`Subtotal: $${breakdown.subtotal.toFixed(2)}`);

  if (breakdown.discounts.total > 0) {
    if (breakdown.discounts.roundTrip > 0) {
      lines.push(`Round Trip Discount: -$${breakdown.discounts.roundTrip.toFixed(2)}`);
    }
    if (breakdown.discounts.standingOrder > 0) {
      lines.push(`Standing Order Discount: -$${breakdown.discounts.standingOrder.toFixed(2)}`);
    }
  }

  if (breakdown.perLegTotal) {
    lines.push(`Per Leg: $${breakdown.perLegTotal.toFixed(2)}`);
    lines.push(`Total (Round Trip): $${breakdown.total.toFixed(2)}`);
  } else {
    lines.push(`Total: $${breakdown.total.toFixed(2)}`);
  }

  return lines.join('\n');
}

/**
 * Calculate no-show fee
 */
export function calculateNoShowFee(config: RateConfig = defaultRateConfig): number {
  return config.noShowFee;
}

/**
 * Calculate cancellation fee based on hours before trip
 */
export function calculateCancellationFee(
  tripDateTime: Date,
  cancellationTime: Date,
  config: RateConfig = defaultRateConfig
): number {
  const hoursBeforeTrip = (tripDateTime.getTime() - cancellationTime.getTime()) / (1000 * 60 * 60);

  // Free cancellation if more than 2 hours before
  if (hoursBeforeTrip >= 2) {
    return 0;
  }

  return config.cancelFee;
}

/**
 * Estimate mileage cost for quick quotes
 */
export function estimateTripCost(
  distanceMiles: number,
  serviceType: ServiceType,
  config: RateConfig = defaultRateConfig
): { min: number; max: number } {
  const base = config.baseRates[serviceType];
  const mileage = distanceMiles * config.perMileRates[serviceType];

  const baseCost = Math.max(base + mileage, config.minimumCharge);

  // Add a range for potential additional fees
  return {
    min: baseCost,
    max: baseCost * 1.3, // Account for potential after-hours, wait time, etc.
  };
}
