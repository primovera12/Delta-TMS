# Pricing Engine Specification

> **Version:** 2.0 (Cleaned up from legacy codebase)
> **Last Updated:** January 2026
> **Status:** Canonical source of truth

---

## Overview

This document defines the **single source of truth** for all pricing calculations. The legacy codebase had inconsistencies between frontend and backend — this spec resolves them.

---

## 1. Base Pricing Configuration

### Core Rates

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Base Fare** | $25.00 | Flat fee applied to every trip |
| **Per Mile Rate** | $2.50 | Charged for each mile traveled |
| **Per Minute Rate** | $0.50 | Charged for estimated travel time |
| **Minimum Fare** | $15.00 | Minimum charge regardless of calculation |

### Implementation

```typescript
// lib/pricing/config.ts
export const PRICING_CONFIG = {
  BASE_FARE: 25.00,
  PER_MILE_RATE: 2.50,
  PER_MINUTE_RATE: 0.50,
  MINIMUM_FARE: 15.00,
} as const;
```

---

## 2. Vehicle Type Base Fares

Different vehicle types have different base fares that **replace** the standard base fare.

| Vehicle Type | Base Fare | Per Mile | Description |
|--------------|-----------|----------|-------------|
| **Standard Sedan** | $15.00 | $2.50 | Ambulatory patients only |
| **Wheelchair Accessible** | $25.00 | $2.50 | Standard wheelchair van |
| **Stretcher Van** | $45.00 | $3.00 | Stretcher/gurney transport |
| **Bariatric Vehicle** | $55.00 | $3.50 | Heavy-duty wheelchair van |

### Implementation

```typescript
// lib/pricing/config.ts
export const VEHICLE_PRICING = {
  SEDAN: {
    baseFare: 15.00,
    perMileRate: 2.50,
  },
  WHEELCHAIR_ACCESSIBLE: {
    baseFare: 25.00,
    perMileRate: 2.50,
  },
  STRETCHER_VAN: {
    baseFare: 45.00,
    perMileRate: 3.00,
  },
  BARIATRIC_VEHICLE: {
    baseFare: 55.00,
    perMileRate: 3.50,
  },
} as const;
```

---

## 3. Accessibility & Equipment Surcharges

Surcharges are **additive** — multiple can apply to a single trip.

| Equipment/Service | Surcharge | When Applied |
|-------------------|-----------|--------------|
| **Wheelchair Required** | $15.00 | Patient uses wheelchair |
| **Stretcher Required** | $25.00 | Patient requires stretcher |
| **Oxygen Equipment** | $10.00 | Oxygen tank/concentrator needed |
| **Bariatric Equipment** | $20.00 | Bariatric wheelchair/equipment |
| **Medical Escort** | $20.00 | Medical professional accompanies |
| **IV Support** | $15.00 | IV fluids during transport |
| **Transfer Assistance** | $8.00 | Extra help getting in/out |
| **Additional Companion** | $5.00 | Family member/aide rides along |

### Implementation

```typescript
// lib/pricing/config.ts
export const SURCHARGES = {
  WHEELCHAIR: 15.00,
  STRETCHER: 25.00,
  OXYGEN: 10.00,
  BARIATRIC: 20.00,
  MEDICAL_ESCORT: 20.00,
  IV_SUPPORT: 15.00,
  TRANSFER_ASSISTANCE: 8.00,
  COMPANION: 5.00,
} as const;
```

---

## 4. Time-Based Multipliers

Only **ONE** multiplier applies per trip, based on priority order.

| Time Period | Multiplier | Increase | Hours |
|-------------|------------|----------|-------|
| **Holiday** | 1.3x | +30% | Specific dates (see below) |
| **Rush Hour Morning** | 1.5x | +50% | 7:00 AM - 9:00 AM (weekdays) |
| **Rush Hour Evening** | 1.5x | +50% | 5:00 PM - 7:00 PM (weekdays) |
| **Late Night** | 1.4x | +40% | 10:00 PM - 6:00 AM |
| **Weekend** | 1.2x | +20% | Saturday & Sunday (all day) |
| **Standard** | 1.0x | None | All other times |

### Priority Order

```
1. Holiday (highest priority — always applies if holiday)
2. Rush Hour (weekdays only)
3. Late Night
4. Weekend
5. Standard (fallback)
```

### Recognized Holidays

| Holiday | Date |
|---------|------|
| New Year's Day | January 1 |
| Independence Day | July 4 |
| Thanksgiving | 4th Thursday of November |
| Christmas Eve | December 24 |
| Christmas Day | December 25 |

### Implementation

```typescript
// lib/pricing/config.ts
export const TIME_MULTIPLIERS = {
  HOLIDAY: 1.3,
  RUSH_HOUR: 1.5,
  LATE_NIGHT: 1.4,
  WEEKEND: 1.2,
  STANDARD: 1.0,
} as const;

export const RUSH_HOURS = {
  MORNING_START: 7,  // 7:00 AM
  MORNING_END: 9,    // 9:00 AM
  EVENING_START: 17, // 5:00 PM
  EVENING_END: 19,   // 7:00 PM
} as const;

export const LATE_NIGHT = {
  START: 22, // 10:00 PM
  END: 6,    // 6:00 AM
} as const;

export const HOLIDAYS = [
  { month: 0, day: 1 },   // New Year's Day (Jan 1)
  { month: 6, day: 4 },   // Independence Day (Jul 4)
  { month: 10, day: null, week: 4, weekday: 4 }, // Thanksgiving (4th Thursday Nov)
  { month: 11, day: 24 }, // Christmas Eve (Dec 24)
  { month: 11, day: 25 }, // Christmas Day (Dec 25)
] as const;
```

---

## 5. Fees & Penalties

| Fee Type | Amount | When Applied |
|----------|--------|--------------|
| **Cancellation (24+ hrs)** | $0.00 | Free cancellation |
| **Cancellation (2-24 hrs)** | $10.00 | Flat fee |
| **Cancellation (<2 hrs)** | $25.00 | Flat fee |
| **No-Show** | 50% of fare | Patient not present |
| **Waiting Time** | $0.50/min | After 10 min free wait |

### Implementation

```typescript
// lib/pricing/config.ts
export const FEES = {
  CANCELLATION_24_PLUS_HOURS: 0.00,
  CANCELLATION_2_TO_24_HOURS: 10.00,
  CANCELLATION_UNDER_2_HOURS: 25.00,
  NO_SHOW_PERCENTAGE: 0.50, // 50% of fare
  WAITING_TIME_PER_MINUTE: 0.50,
  FREE_WAITING_MINUTES: 10,
} as const;
```

---

## 6. Discounts (Future Implementation)

| Discount Type | Amount | Eligibility |
|---------------|--------|-------------|
| **Senior (65+)** | 10% off | Age verified |
| **Frequent User** | 15% off | 10+ trips/month |
| **Family Plan** | 20% off | 2+ family members |
| **Facility Contract** | Custom | Negotiated rate |

**Note:** Discounts are NOT currently implemented but are planned for Phase 4.

---

## 7. Loyalty Program

### Points Earning

| Action | Points |
|--------|--------|
| Per $1 spent | 10 points |
| 5-star rating given | 50 points |
| Referral (new user) | 500 points |
| First trip bonus | 200 points |

### Tier Thresholds

| Tier | Points Required | Multiplier |
|------|-----------------|------------|
| **Bronze** | 0 | 1.0x |
| **Silver** | 1,000 | 1.25x |
| **Gold** | 5,000 | 1.5x |
| **Platinum** | 15,000 | 2.0x |

### Redemption

- **Rate:** 100 points = $1.00 credit
- **Minimum redemption:** 500 points ($5.00)

### Implementation

```typescript
// lib/pricing/config.ts
export const LOYALTY = {
  POINTS_PER_DOLLAR: 10,
  RATING_BONUS: 50,
  REFERRAL_BONUS: 500,
  FIRST_TRIP_BONUS: 200,
  REDEMPTION_RATE: 100, // points per $1
  MIN_REDEMPTION: 500,
  TIERS: {
    BRONZE: { threshold: 0, multiplier: 1.0 },
    SILVER: { threshold: 1000, multiplier: 1.25 },
    GOLD: { threshold: 5000, multiplier: 1.5 },
    PLATINUM: { threshold: 15000, multiplier: 2.0 },
  },
} as const;
```

---

## 8. The Calculation Formula

### Master Formula

```
TOTAL_FARE = MAX(
  (BASE_FARE + DISTANCE_FARE + TIME_FARE + SURCHARGES) × TIME_MULTIPLIER,
  MINIMUM_FARE
)
```

### Step-by-Step

```
1. Get BASE_FARE based on vehicle type
2. Calculate DISTANCE_FARE = miles × perMileRate
3. Calculate TIME_FARE = minutes × $0.50
4. Sum SURCHARGES (wheelchair, oxygen, etc.)
5. Calculate SUBTOTAL = BASE + DISTANCE + TIME + SURCHARGES
6. Get TIME_MULTIPLIER based on scheduled time
7. Calculate TOTAL = SUBTOTAL × TIME_MULTIPLIER
8. Apply MINIMUM_FARE if TOTAL < MINIMUM
9. Round to 2 decimal places
```

### Duration Estimation

```typescript
// Estimate travel time from distance
function estimateDuration(distanceMiles: number): number {
  // Assume 25 mph average in city traffic
  const hours = distanceMiles / 25;
  const minutes = Math.round(hours * 60);
  return minutes;
}
```

---

## 9. Complete Implementation

```typescript
// lib/services/pricing.ts

import {
  PRICING_CONFIG,
  VEHICLE_PRICING,
  SURCHARGES,
  TIME_MULTIPLIERS,
  RUSH_HOURS,
  LATE_NIGHT,
  HOLIDAYS,
  FEES,
} from '@/lib/pricing/config';

interface QuoteRequest {
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  scheduledTime: Date;
  vehicleType: 'SEDAN' | 'WHEELCHAIR_ACCESSIBLE' | 'STRETCHER_VAN' | 'BARIATRIC_VEHICLE';
  wheelchairRequired?: boolean;
  stretcherRequired?: boolean;
  oxygenRequired?: boolean;
  bariatricEquipment?: boolean;
  medicalEscort?: boolean;
  ivSupport?: boolean;
  transferAssistance?: boolean;
  companionCount?: number;
}

interface QuoteBreakdown {
  label: string;
  amount: number;
}

interface QuoteResult {
  baseFare: number;
  distanceFare: number;
  distanceMiles: number;
  timeFare: number;
  estimatedMinutes: number;
  surcharges: QuoteBreakdown[];
  surchargeTotal: number;
  subtotal: number;
  timeMultiplier: number;
  timeMultiplierLabel: string;
  timeMultiplierAmount: number;
  totalFare: number;
  breakdown: QuoteBreakdown[];
  validUntil: Date;
}

export class PricingService {
  
  /**
   * Generate a price quote for a trip
   */
  static async calculateQuote(request: QuoteRequest): Promise<QuoteResult> {
    const breakdown: QuoteBreakdown[] = [];
    
    // ========== STEP 1: BASE FARE ==========
    const vehiclePricing = VEHICLE_PRICING[request.vehicleType];
    const baseFare = vehiclePricing.baseFare;
    breakdown.push({ label: 'Base fare', amount: baseFare });
    
    // ========== STEP 2: DISTANCE FARE ==========
    const distanceMiles = await this.calculateDistance(
      request.pickupLatitude,
      request.pickupLongitude,
      request.dropoffLatitude,
      request.dropoffLongitude
    );
    const distanceFare = distanceMiles * vehiclePricing.perMileRate;
    breakdown.push({ 
      label: `Distance (${distanceMiles.toFixed(1)} mi × $${vehiclePricing.perMileRate.toFixed(2)})`, 
      amount: distanceFare 
    });
    
    // ========== STEP 3: TIME FARE ==========
    const estimatedMinutes = this.estimateDuration(distanceMiles);
    const timeFare = estimatedMinutes * PRICING_CONFIG.PER_MINUTE_RATE;
    breakdown.push({ 
      label: `Time (${estimatedMinutes} min × $${PRICING_CONFIG.PER_MINUTE_RATE.toFixed(2)})`, 
      amount: timeFare 
    });
    
    // ========== STEP 4: SURCHARGES ==========
    const surcharges: QuoteBreakdown[] = [];
    
    if (request.wheelchairRequired) {
      surcharges.push({ label: 'Wheelchair', amount: SURCHARGES.WHEELCHAIR });
    }
    if (request.stretcherRequired) {
      surcharges.push({ label: 'Stretcher', amount: SURCHARGES.STRETCHER });
    }
    if (request.oxygenRequired) {
      surcharges.push({ label: 'Oxygen equipment', amount: SURCHARGES.OXYGEN });
    }
    if (request.bariatricEquipment) {
      surcharges.push({ label: 'Bariatric equipment', amount: SURCHARGES.BARIATRIC });
    }
    if (request.medicalEscort) {
      surcharges.push({ label: 'Medical escort', amount: SURCHARGES.MEDICAL_ESCORT });
    }
    if (request.ivSupport) {
      surcharges.push({ label: 'IV support', amount: SURCHARGES.IV_SUPPORT });
    }
    if (request.transferAssistance) {
      surcharges.push({ label: 'Transfer assistance', amount: SURCHARGES.TRANSFER_ASSISTANCE });
    }
    if (request.companionCount && request.companionCount > 0) {
      const companionTotal = request.companionCount * SURCHARGES.COMPANION;
      surcharges.push({ 
        label: `Companion(s) × ${request.companionCount}`, 
        amount: companionTotal 
      });
    }
    
    const surchargeTotal = surcharges.reduce((sum, s) => sum + s.amount, 0);
    surcharges.forEach(s => breakdown.push(s));
    
    // ========== STEP 5: SUBTOTAL ==========
    const subtotal = baseFare + distanceFare + timeFare + surchargeTotal;
    
    // ========== STEP 6: TIME MULTIPLIER ==========
    const { multiplier: timeMultiplier, label: timeMultiplierLabel } = 
      this.getTimeMultiplier(request.scheduledTime);
    
    let timeMultiplierAmount = 0;
    if (timeMultiplier > 1) {
      timeMultiplierAmount = subtotal * (timeMultiplier - 1);
      breakdown.push({ 
        label: timeMultiplierLabel, 
        amount: timeMultiplierAmount 
      });
    }
    
    // ========== STEP 7: TOTAL WITH MINIMUM ==========
    let totalFare = subtotal * timeMultiplier;
    
    if (totalFare < PRICING_CONFIG.MINIMUM_FARE) {
      const adjustment = PRICING_CONFIG.MINIMUM_FARE - totalFare;
      breakdown.push({ label: 'Minimum fare adjustment', amount: adjustment });
      totalFare = PRICING_CONFIG.MINIMUM_FARE;
    }
    
    // ========== STEP 8: ROUND AND RETURN ==========
    totalFare = Math.round(totalFare * 100) / 100;
    
    // Quote valid for 30 minutes
    const validUntil = new Date(Date.now() + 30 * 60 * 1000);
    
    return {
      baseFare,
      distanceFare: Math.round(distanceFare * 100) / 100,
      distanceMiles: Math.round(distanceMiles * 10) / 10,
      timeFare: Math.round(timeFare * 100) / 100,
      estimatedMinutes,
      surcharges,
      surchargeTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      timeMultiplier,
      timeMultiplierLabel,
      timeMultiplierAmount: Math.round(timeMultiplierAmount * 100) / 100,
      totalFare,
      breakdown,
      validUntil,
    };
  }
  
  /**
   * Calculate distance using Google Maps Distance Matrix API
   */
  private static async calculateDistance(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number
  ): Promise<number> {
    // TODO: Implement Google Maps Distance Matrix API call
    // For now, calculate straight-line distance and add 30% for road routing
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(dropoffLat - pickupLat);
    const dLng = this.toRad(dropoffLng - pickupLng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(pickupLat)) * Math.cos(this.toRad(dropoffLat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const straightLine = R * c;
    
    // Add 30% for actual road distance
    return straightLine * 1.3;
  }
  
  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  /**
   * Estimate travel duration from distance
   */
  private static estimateDuration(distanceMiles: number): number {
    // Assume 25 mph average in city traffic
    const hours = distanceMiles / 25;
    return Math.round(hours * 60);
  }
  
  /**
   * Get the applicable time multiplier
   */
  private static getTimeMultiplier(date: Date): { multiplier: number; label: string } {
    // Priority 1: Holiday
    if (this.isHoliday(date)) {
      return { multiplier: TIME_MULTIPLIERS.HOLIDAY, label: 'Holiday rate (+30%)' };
    }
    
    const hour = date.getHours();
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Priority 2: Rush hour (weekdays only)
    if (!isWeekend && this.isRushHour(hour)) {
      return { multiplier: TIME_MULTIPLIERS.RUSH_HOUR, label: 'Rush hour (+50%)' };
    }
    
    // Priority 3: Late night
    if (this.isLateNight(hour)) {
      return { multiplier: TIME_MULTIPLIERS.LATE_NIGHT, label: 'Late night (+40%)' };
    }
    
    // Priority 4: Weekend
    if (isWeekend) {
      return { multiplier: TIME_MULTIPLIERS.WEEKEND, label: 'Weekend rate (+20%)' };
    }
    
    // Default: Standard
    return { multiplier: TIME_MULTIPLIERS.STANDARD, label: '' };
  }
  
  private static isHoliday(date: Date): boolean {
    const month = date.getMonth();
    const day = date.getDate();
    
    for (const holiday of HOLIDAYS) {
      if (holiday.month === month) {
        if (holiday.day !== null && holiday.day === day) {
          return true;
        }
        // Handle Thanksgiving (4th Thursday of November)
        if (holiday.week && holiday.weekday !== undefined) {
          const firstDay = new Date(date.getFullYear(), month, 1);
          const firstWeekday = firstDay.getDay();
          const targetDay = 1 + ((holiday.weekday - firstWeekday + 7) % 7) + (holiday.week - 1) * 7;
          if (day === targetDay) return true;
        }
      }
    }
    return false;
  }
  
  private static isRushHour(hour: number): boolean {
    return (
      (hour >= RUSH_HOURS.MORNING_START && hour < RUSH_HOURS.MORNING_END) ||
      (hour >= RUSH_HOURS.EVENING_START && hour < RUSH_HOURS.EVENING_END)
    );
  }
  
  private static isLateNight(hour: number): boolean {
    return hour >= LATE_NIGHT.START || hour < LATE_NIGHT.END;
  }
  
  /**
   * Calculate cancellation fee
   */
  static calculateCancellationFee(
    scheduledTime: Date,
    cancellationTime: Date = new Date()
  ): number {
    const hoursUntilTrip = (scheduledTime.getTime() - cancellationTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilTrip >= 24) {
      return FEES.CANCELLATION_24_PLUS_HOURS;
    } else if (hoursUntilTrip >= 2) {
      return FEES.CANCELLATION_2_TO_24_HOURS;
    } else {
      return FEES.CANCELLATION_UNDER_2_HOURS;
    }
  }
  
  /**
   * Calculate no-show fee
   */
  static calculateNoShowFee(totalFare: number): number {
    return Math.round(totalFare * FEES.NO_SHOW_PERCENTAGE * 100) / 100;
  }
  
  /**
   * Calculate waiting time fee
   */
  static calculateWaitingFee(waitingMinutes: number): number {
    const chargeableMinutes = Math.max(0, waitingMinutes - FEES.FREE_WAITING_MINUTES);
    return Math.round(chargeableMinutes * FEES.WAITING_TIME_PER_MINUTE * 100) / 100;
  }
}
```

---

## 10. Example Calculations

### Example 1: Standard Wheelchair Trip (Weekday 2 PM)

```
Vehicle: Wheelchair Accessible
Distance: 10 miles
Wheelchair Required: Yes

BASE_FARE:        $25.00
DISTANCE:         10 × $2.50 = $25.00
TIME:             24 min × $0.50 = $12.00
WHEELCHAIR:       $15.00
─────────────────────────────
SUBTOTAL:         $77.00
MULTIPLIER:       1.0x (standard)
─────────────────────────────
TOTAL:            $77.00
```

### Example 2: Rush Hour Trip with Oxygen (Weekday 8 AM)

```
Vehicle: Wheelchair Accessible
Distance: 10 miles
Wheelchair Required: Yes
Oxygen Required: Yes

BASE_FARE:        $25.00
DISTANCE:         10 × $2.50 = $25.00
TIME:             24 min × $0.50 = $12.00
WHEELCHAIR:       $15.00
OXYGEN:           $10.00
─────────────────────────────
SUBTOTAL:         $87.00
MULTIPLIER:       1.5x (rush hour)
RUSH HOUR FEE:    $87.00 × 0.5 = $43.50
─────────────────────────────
TOTAL:            $130.50
```

### Example 3: Weekend Stretcher Transport (Saturday 11 AM)

```
Vehicle: Stretcher Van
Distance: 15 miles
Stretcher Required: Yes
Medical Escort: Yes

BASE_FARE:        $45.00
DISTANCE:         15 × $3.00 = $45.00
TIME:             36 min × $0.50 = $18.00
STRETCHER:        $25.00
MEDICAL ESCORT:   $20.00
─────────────────────────────
SUBTOTAL:         $153.00
MULTIPLIER:       1.2x (weekend)
WEEKEND FEE:      $153.00 × 0.2 = $30.60
─────────────────────────────
TOTAL:            $183.60
```

### Example 4: Minimum Fare Applied

```
Vehicle: Sedan
Distance: 1 mile

BASE_FARE:        $15.00
DISTANCE:         1 × $2.50 = $2.50
TIME:             2 min × $0.50 = $1.00
─────────────────────────────
SUBTOTAL:         $18.50
(Above minimum, no adjustment)
─────────────────────────────
TOTAL:            $18.50
```

---

## 11. Admin Configuration

All pricing values should be configurable through the admin panel:

### Base Rates
- Base fare per vehicle type
- Per mile rate per vehicle type
- Per minute rate
- Minimum fare

### Surcharges
- Each surcharge amount
- Enable/disable surcharges

### Time Multipliers
- Each multiplier value
- Rush hour time ranges
- Late night time range
- Holiday dates

### Fees
- Cancellation fee tiers
- No-show percentage
- Waiting time rate
- Free waiting minutes

---

## 12. Database Storage

Pricing configuration should be stored in database for admin editability:

```sql
-- Store current pricing config
CREATE TABLE pricing_config (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Log all pricing changes
CREATE TABLE pricing_audit_log (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES pricing_config(id),
  changed_by UUID REFERENCES users(id),
  previous_value JSONB,
  new_value JSONB,
  changed_at TIMESTAMP DEFAULT NOW()
);
```

---

## 13. Multi-Stop Trip Pricing

Multi-stop trips have additional fees and distance calculations.

### Additional Stop Fee

| Stops | Fee | Calculation |
|-------|-----|-------------|
| 2 stops | $0.00 | Base trip (pickup → dropoff) |
| 3 stops | $10.00 | +1 additional stop |
| 4 stops | $20.00 | +2 additional stops |
| 5 stops | $30.00 | +3 additional stops |

**Formula:** `additionalStopFee = max(0, (totalStops - 2)) × $10.00`

### Distance Calculation for Multi-Stop

```
TOTAL_DISTANCE = sum of distances between consecutive stops

Example:
Stop 0 (Pickup A) → Stop 1 (Pickup B): 3 miles
Stop 1 (Pickup B) → Stop 2 (Dropoff C): 8 miles
TOTAL_DISTANCE = 3 + 8 = 11 miles
```

### Time Calculation for Multi-Stop

```
TOTAL_TIME = sum of travel times + sum of expected wait times at stops

Example:
Stop 0 → Stop 1: 10 min travel
Stop 1: 5 min wait (for passenger boarding)
Stop 1 → Stop 2: 20 min travel
TOTAL_TIME = 10 + 5 + 20 = 35 minutes
```

### Implementation

```typescript
export function calculateMultiStopPrice(
  stops: TripStop[],
  vehicleType: VehicleType,
  requirements: TripRequirements,
  pickupTime: Date
): PriceBreakdown {
  // Calculate distances between consecutive stops
  let totalDistance = 0;
  let totalDuration = 0;
  
  for (let i = 0; i < stops.length - 1; i++) {
    const segment = getDistanceAndDuration(
      stops[i].coordinates,
      stops[i + 1].coordinates
    );
    totalDistance += segment.miles;
    totalDuration += segment.minutes;
    totalDuration += stops[i].expectedWaitMinutes || 0;
  }
  
  // Additional stop fee
  const additionalStops = Math.max(0, stops.length - 2);
  const additionalStopFee = additionalStops * 10.00;
  
  // Calculate base price using total distance/duration
  const basePrice = calculateBasePrice(
    totalDistance,
    totalDuration,
    vehicleType,
    requirements,
    pickupTime
  );
  
  return {
    ...basePrice,
    additionalStopsFee: additionalStopFee,
    totalStops: stops.length,
    totalFare: basePrice.totalFare + additionalStopFee,
  };
}
```

---

## 14. Round Trip Pricing

Round trips are priced as two separate trips with optional discounts.

### Pricing Rules

| Scenario | Pricing |
|----------|---------|
| **Standard Round Trip** | Full fare × 2 |
| **Round Trip Discount** | 10% off return leg (configurable) |
| **Will-Call Return** | Return priced when activated |

### Will-Call Return Pricing

- Return trip fare calculated at time of activation
- Uses current pricing config (not quote-time config)
- Time multiplier based on activation time
- Quote shown is **estimate only**

### Implementation

```typescript
export function calculateRoundTripPrice(
  outboundTrip: TripDetails,
  returnTrip: TripDetails,
  isWillCall: boolean
): RoundTripPriceBreakdown {
  const outboundPrice = calculateTripPrice(outboundTrip);
  
  if (isWillCall) {
    // Return is estimated only
    const estimatedReturn = calculateTripPrice(returnTrip);
    return {
      outbound: outboundPrice,
      return: {
        ...estimatedReturn,
        isEstimate: true,
        note: "Final price calculated when will-call activated"
      },
      combinedFare: outboundPrice.totalFare, // Only charge outbound now
      returnFareEstimate: estimatedReturn.totalFare,
    };
  }
  
  // Scheduled return - apply discount
  const returnPrice = calculateTripPrice(returnTrip);
  const returnDiscount = returnPrice.totalFare * 0.10; // 10% discount
  
  return {
    outbound: outboundPrice,
    return: {
      ...returnPrice,
      discountAmount: returnDiscount,
      discountReason: "Round trip return discount",
      totalFare: returnPrice.totalFare - returnDiscount,
    },
    combinedFare: outboundPrice.totalFare + (returnPrice.totalFare - returnDiscount),
  };
}
```

---

## 15. Booking Time Rules

### Minimum Lead Time

| Booking Type | Minimum Lead Time | Description |
|--------------|-------------------|-------------|
| **Standard Booking** | 2 hours | Normal advance booking |
| **ASAP Booking** | 30 minutes | Urgent requests |
| **Same-Day Cutoff** | By 8 PM | For next-day service |

### Maximum Advance Booking

| Rule | Value |
|------|-------|
| **Standard trips** | 90 days in advance |
| **Standing orders** | 365 days in advance |

### Service Hours

| Setting | Default Value |
|---------|---------------|
| **Service Start** | 5:00 AM |
| **Service End** | 11:00 PM |
| **Time Zone** | America/Chicago (Central) |

### After-Hours Handling

```typescript
export function validateBookingTime(
  requestedPickupTime: Date,
  isAsap: boolean,
  serviceConfig: ServiceConfig
): BookingTimeValidation {
  const now = new Date();
  const minLeadTime = isAsap 
    ? serviceConfig.asapLeadTimeMinutes 
    : serviceConfig.minLeadTimeMinutes;
  
  const earliestAllowed = addMinutes(now, minLeadTime);
  const latestAllowed = addDays(now, serviceConfig.maxAdvanceBookingDays);
  
  // Check service hours
  const pickupHour = requestedPickupTime.getHours();
  const withinServiceHours = 
    pickupHour >= serviceConfig.serviceStartHour &&
    pickupHour < serviceConfig.serviceEndHour;
  
  // Check if holiday
  const isHoliday = checkHolidayCalendar(requestedPickupTime);
  const holidayInfo = isHoliday ? getHolidayInfo(requestedPickupTime) : null;
  
  if (isHoliday && holidayInfo?.isClosed) {
    return {
      valid: false,
      error: `Service closed on ${holidayInfo.name}`,
    };
  }
  
  if (requestedPickupTime < earliestAllowed) {
    return {
      valid: false,
      error: `Minimum ${minLeadTime} minutes lead time required`,
      earliestAvailable: earliestAllowed,
    };
  }
  
  if (requestedPickupTime > latestAllowed) {
    return {
      valid: false,
      error: `Maximum ${serviceConfig.maxAdvanceBookingDays} days advance booking`,
    };
  }
  
  if (!withinServiceHours) {
    return {
      valid: false,
      error: `Service hours are ${serviceConfig.serviceStartHour}:00 - ${serviceConfig.serviceEndHour}:00`,
    };
  }
  
  return { valid: true };
}
```

---

## 16. Service Area Validation

### Service Area Configuration

Service area is defined as a GeoJSON polygon stored in ServiceConfig.

```typescript
interface ServiceAreaConfig {
  polygon: GeoJSON.Polygon;  // Service boundary
  allowOutOfArea: boolean;   // Allow bookings outside area
  outOfAreaFee: number;      // Fee if outside area
}
```

### Address Validation

```typescript
export function validateAddress(
  coordinates: { lat: number; lng: number },
  serviceConfig: ServiceConfig
): AddressValidation {
  const isInArea = pointInPolygon(
    [coordinates.lng, coordinates.lat],
    serviceConfig.serviceAreaPolygon
  );
  
  if (isInArea) {
    return {
      valid: true,
      inServiceArea: true,
      outOfAreaFee: 0,
    };
  }
  
  if (!serviceConfig.allowOutOfArea) {
    return {
      valid: false,
      inServiceArea: false,
      error: "Address is outside service area",
    };
  }
  
  return {
    valid: true,
    inServiceArea: false,
    outOfAreaFee: serviceConfig.outOfAreaFee,
    warning: `Address is outside service area. Additional fee: $${serviceConfig.outOfAreaFee}`,
  };
}
```

---

## 17. Appointment-Time Booking Calculation

When booking by appointment time, pickup time is calculated backwards.

### Calculation Formula

```
PICKUP_TIME = APPOINTMENT_TIME - TRAVEL_TIME - BUFFER_TIME

Where:
- APPOINTMENT_TIME: When patient needs to arrive
- TRAVEL_TIME: Estimated drive time (from Google Maps)
- BUFFER_TIME: Configurable (default 15 min)
```

### Implementation

```typescript
export function calculatePickupTimeForAppointment(
  pickupAddress: Address,
  dropoffAddress: Address,
  appointmentTime: Date,
  bufferMinutes: number = 15
): PickupTimeCalculation {
  // Get travel time from Google Maps
  const route = await getDistanceAndDuration(pickupAddress, dropoffAddress);
  
  // Add buffer for traffic variability
  const trafficBuffer = Math.ceil(route.minutes * 0.2); // 20% buffer
  
  // Calculate required pickup time
  const totalLeadMinutes = route.minutes + trafficBuffer + bufferMinutes;
  const pickupTime = subMinutes(appointmentTime, totalLeadMinutes);
  
  // Calculate arrival time (for display)
  const arrivalTime = subMinutes(appointmentTime, bufferMinutes);
  
  return {
    pickupTime,
    arrivalTime,
    appointmentTime,
    travelTimeMinutes: route.minutes,
    bufferMinutes,
    explanation: `Pickup at ${format(pickupTime, 'h:mm a')} to arrive by ${format(arrivalTime, 'h:mm a')} (${bufferMinutes} min before appointment)`
  };
}
```

---

## 18. Will-Call Pricing Rules

### Quote vs Final Price

| Stage | Price Status |
|-------|--------------|
| **At Booking** | Estimate only |
| **At Activation** | Final price calculated |
| **Time Multiplier** | Based on activation time |

### Will-Call Expiry

- Default expiry: 8 hours from expected ready time
- Expired will-calls are automatically cancelled
- No cancellation fee for expired will-calls

### Implementation

```typescript
export function activateWillCall(
  trip: Trip,
  activationTime: Date
): WillCallActivation {
  // Recalculate price at activation time
  const finalPrice = calculateTripPrice({
    ...trip,
    scheduledPickupTime: activationTime,
  });
  
  return {
    tripId: trip.id,
    originalEstimate: trip.totalFare,
    finalPrice: finalPrice.totalFare,
    priceDifference: finalPrice.totalFare - trip.totalFare,
    activatedAt: activationTime,
    timeMultiplierApplied: finalPrice.timeMultiplier,
  };
}
```

---

## 19. Booking Time Validation Rules

### Same-Day Booking Rules

| Rule | Default | Description |
|------|---------|-------------|
| **Minimum Lead Time** | 2 hours | Earliest pickup = now + 2 hours |
| **ASAP Lead Time** | 30 minutes | For urgent "ASAP" bookings only |
| **Same-Day Cutoff** | 2 hours before close | No bookings within 2 hours of service end |

### Advance Booking Rules

| Rule | Default | Description |
|------|---------|-------------|
| **Maximum Advance** | 90 days | Can't book more than 90 days out |
| **Standing Orders** | 365 days | Recurring can extend to 1 year |

### Service Hours

| Setting | Default | Description |
|---------|---------|-------------|
| **Start Hour** | 5:00 AM | Earliest pickup time |
| **End Hour** | 11:00 PM | Latest pickup time |
| **Timezone** | America/Chicago | Houston timezone |

### Validation Implementation

```typescript
export function validateBookingTime(
  requestedPickupTime: Date,
  isAsap: boolean = false,
  config: ServiceConfig = DEFAULT_SERVICE_CONFIG
): BookingTimeValidation {
  const now = new Date();
  const pickupDate = startOfDay(requestedPickupTime);
  const today = startOfDay(now);
  
  // Check service hours
  const pickupHour = getHours(requestedPickupTime);
  if (pickupHour < config.serviceStartHour || pickupHour >= config.serviceEndHour) {
    return {
      valid: false,
      error: `Pickup time must be between ${config.serviceStartHour}:00 AM and ${config.serviceEndHour}:00 PM`,
      code: 'OUTSIDE_SERVICE_HOURS'
    };
  }
  
  // Check minimum lead time
  const minLeadTime = isAsap ? config.asapLeadTimeMinutes : config.minLeadTimeMinutes;
  const earliestPickup = addMinutes(now, minLeadTime);
  if (requestedPickupTime < earliestPickup) {
    return {
      valid: false,
      error: `Pickup time must be at least ${minLeadTime} minutes from now`,
      code: 'INSUFFICIENT_LEAD_TIME',
      suggestion: earliestPickup
    };
  }
  
  // Check maximum advance booking
  const maxAdvanceDate = addDays(today, config.maxAdvanceBookingDays);
  if (pickupDate > maxAdvanceDate) {
    return {
      valid: false,
      error: `Cannot book more than ${config.maxAdvanceBookingDays} days in advance`,
      code: 'TOO_FAR_ADVANCE'
    };
  }
  
  // Check holiday/closure
  const holiday = await getHoliday(pickupDate);
  if (holiday?.isClosed) {
    return {
      valid: false,
      error: `Service is closed on ${holiday.name}`,
      code: 'HOLIDAY_CLOSED'
    };
  }
  
  // Check modified hours on holidays
  if (holiday && !holiday.isClosed) {
    const modifiedStart = holiday.modifiedStartHour ?? config.serviceStartHour;
    const modifiedEnd = holiday.modifiedEndHour ?? config.serviceEndHour;
    if (pickupHour < modifiedStart || pickupHour >= modifiedEnd) {
      return {
        valid: false,
        error: `On ${holiday.name}, service is ${modifiedStart}:00 AM - ${modifiedEnd}:00 PM`,
        code: 'HOLIDAY_HOURS'
      };
    }
  }
  
  return { valid: true };
}
```

### Service Area Validation

```typescript
export function validateServiceArea(
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number,
  config: ServiceConfig = DEFAULT_SERVICE_CONFIG
): ServiceAreaValidation {
  const pickupInArea = isPointInPolygon(
    [pickupLat, pickupLng],
    config.serviceAreaPolygon
  );
  
  const dropoffInArea = isPointInPolygon(
    [dropoffLat, dropoffLng],
    config.serviceAreaPolygon
  );
  
  if (!pickupInArea || !dropoffInArea) {
    if (!config.allowOutOfArea) {
      return {
        valid: false,
        error: 'Address is outside our service area',
        code: 'OUT_OF_SERVICE_AREA',
        pickupInArea,
        dropoffInArea
      };
    }
    
    // Out of area allowed with fee
    return {
      valid: true,
      warning: 'Address is outside normal service area',
      outOfAreaFee: config.outOfAreaFee,
      pickupInArea,
      dropoffInArea
    };
  }
  
  return { valid: true, pickupInArea: true, dropoffInArea: true };
}
```

---

## 20. Configuration Summary

### ServiceConfig Defaults

```typescript
export const DEFAULT_SERVICE_CONFIG: ServiceConfig = {
  // Service Hours
  serviceStartHour: 5,      // 5 AM
  serviceEndHour: 23,       // 11 PM
  timezone: "America/Chicago",
  
  // Booking Rules
  minLeadTimeMinutes: 120,  // 2 hours
  asapLeadTimeMinutes: 30,  // 30 minutes
  maxAdvanceBookingDays: 90,
  
  // Multi-Stop
  maxStopsPerTrip: 5,
  additionalStopFee: 10.00,
  
  // Will-Call
  willCallExpiryHours: 8,
  willCallReminderMinutes: 240, // 4 hours
  
  // Service Area
  allowOutOfArea: false,
  outOfAreaFee: 25.00,
  
  // Cancellation
  freeCancellationHours: 24,
  lateCancellationFee: 10.00,
  veryLateCancellationFee: 25.00,
  veryLateCancellationHours: 2,
  
  // Round Trip
  roundTripReturnDiscount: 0.10, // 10%
};
```

---

*This is the canonical pricing specification. All implementations must follow these rules.*
