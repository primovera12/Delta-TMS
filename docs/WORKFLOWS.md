# Feature Workflows - Wheelchair Transportation Platform

> **Version:** 1.0
> **Last Updated:** January 2026
> **Purpose:** Step-by-step workflows for every major feature

---

## Table of Contents

1. [Booking Workflows](#1-booking-workflows)
2. [Trip Execution Workflows](#2-trip-execution-workflows)
3. [Driver Workflows](#3-driver-workflows)
4. [Payment Workflows](#4-payment-workflows)
5. [Facility Workflows](#5-facility-workflows)
6. [Admin Workflows](#6-admin-workflows)
7. [Notification Workflows](#7-notification-workflows)
8. [Emergency Workflows](#8-emergency-workflows)

---

## 1. Booking Workflows

### 1.1 Standard One-Way Booking

```
DISPATCHER/PATIENT BOOKS A RIDE
================================

Step 1: Patient Information
┌─────────────────────────────────────────┐
│  1. Search existing patient by phone    │
│  2. If found → Load patient details     │
│  3. If not found → Create new patient   │
│     - Name, Phone, DOB                  │
│     - Medical needs (wheelchair, O2)    │
│     - Emergency contact                 │
└───────────────────┬─────────────────────┘
                    ▼
Step 2: Trip Type Selection
┌─────────────────────────────────────────┐
│  Select trip type:                      │
│  ○ One-Way                              │
│  ○ Round Trip                           │
│  ○ Multi-Stop                           │
│  ○ Will-Call Return                     │
└───────────────────┬─────────────────────┘
                    ▼
Step 3: Pickup Address
┌─────────────────────────────────────────┐
│  1. Enter address OR select saved       │
│  2. Google Places autocomplete          │
│  3. Validate in service area            │
│     - If outside → Show warning + fee   │
│  4. Add pickup instructions             │
│  5. Set contact person at pickup        │
└───────────────────┬─────────────────────┘
                    ▼
Step 4: Dropoff Address
┌─────────────────────────────────────────┐
│  1. Enter address OR select saved       │
│  2. Validate in service area            │
│  3. Add dropoff instructions            │
└───────────────────┬─────────────────────┘
                    ▼
Step 5: Schedule
┌─────────────────────────────────────────┐
│  Select scheduling mode:                │
│  ○ Pickup Time → "Pick me up at 9 AM"   │
│  ○ Appointment Time → "Arrive by 10 AM" │
│  ○ ASAP → "As soon as possible"         │
│                                         │
│  If Appointment:                        │
│  - Calculate backwards from appt time   │
│  - Subtract travel + buffer             │
│  - Show calculated pickup time          │
└───────────────────┬─────────────────────┘
                    ▼
Step 6: Vehicle & Requirements
┌─────────────────────────────────────────┐
│  Auto-selected based on medical needs:  │
│  - Wheelchair → Wheelchair Van          │
│  - Stretcher → Stretcher Van            │
│  - Bariatric → Bariatric Vehicle        │
│                                         │
│  Additional options:                    │
│  □ Oxygen needed                        │
│  □ Attendant riding along               │
└───────────────────┬─────────────────────┘
                    ▼
Step 7: Price Quote
┌─────────────────────────────────────────┐
│  Calculate and display:                 │
│  ┌─────────────────────────────────┐   │
│  │ Base Fare:           $25.00     │   │
│  │ Distance (12.5 mi):  $31.25     │   │
│  │ Time (35 min):       $17.50     │   │
│  │ Wheelchair:          $15.00     │   │
│  │ ───────────────────────────     │   │
│  │ Total:               $88.75     │   │
│  │                                 │   │
│  │ Quote valid for 30 minutes      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Check for duplicates:                  │
│  - Same patient, same day, similar time │
│  - Show warning if found                │
└───────────────────┬─────────────────────┘
                    ▼
Step 8: Payment
┌─────────────────────────────────────────┐
│  Payment options:                       │
│  ○ Pay Now (Card on file)               │
│  ○ Pay Now (New card)                   │
│  ○ Pay Later (Cash to driver)           │
│  ○ Invoice Facility (if applicable)     │
│                                         │
│  If Pay Now:                            │
│  - Create Stripe PaymentIntent          │
│  - Authorize (don't capture yet)        │
└───────────────────┬─────────────────────┘
                    ▼
Step 9: Confirmation
┌─────────────────────────────────────────┐
│  1. Create Trip record in database      │
│  2. Generate trip number (TR-YYYYMMDD-X)│
│  3. Send confirmation SMS to patient    │
│  4. Send email confirmation (if email)  │
│  5. Add to dispatch queue               │
│  6. Show confirmation screen            │
│     - Trip number                       │
│     - Pickup time                       │
│     - Tracking link                     │
└─────────────────────────────────────────┘
```

### 1.2 Round Trip Booking

```
ROUND TRIP BOOKING
==================

Steps 1-6: Same as One-Way
                    ▼
Step 7: Return Trip Options
┌─────────────────────────────────────────┐
│  Return trip type:                      │
│  ○ Scheduled Return                     │
│    → Set specific pickup time           │
│    → "Pick me up at 2 PM"               │
│                                         │
│  ○ Will-Call Return                     │
│    → Patient calls when ready           │
│    → Set expected ready time (estimate) │
│    → "Probably around 2 PM"             │
│                                         │
│  ○ No Return (just outbound)            │
└───────────────────┬─────────────────────┘
                    ▼
Step 8: Create Linked Trips
┌─────────────────────────────────────────┐
│  System creates TWO trips:              │
│                                         │
│  Trip 1 (Outbound):                     │
│  - Home → Hospital                      │
│  - 9:00 AM pickup                       │
│  - linkedTripId → Trip 2                │
│                                         │
│  Trip 2 (Return):                       │
│  - Hospital → Home                      │
│  - If Scheduled: 2:00 PM pickup         │
│  - If Will-Call: Status = WILL_CALL     │
│  - linkedTripId → Trip 1                │
└───────────────────┬─────────────────────┘
                    ▼
Step 9: Price Both Trips
┌─────────────────────────────────────────┐
│  Outbound:  $88.75                      │
│  Return:    $88.75                      │
│  ─────────────────                      │
│  Total:     $177.50                     │
│                                         │
│  Note: Can apply round-trip discount    │
└───────────────────┬─────────────────────┘
                    ▼
Step 10: Confirmation
┌─────────────────────────────────────────┐
│  Confirm both trips:                    │
│                                         │
│  "Your rides are confirmed:             │
│   #TR-001: Home→Hospital @ 9:00 AM      │
│   #TR-002: Hospital→Home @ Will-Call"   │
└─────────────────────────────────────────┘
```

### 1.3 Multi-Stop Trip Booking

```
MULTI-STOP TRIP BOOKING
=======================

Step 1-2: Patient Info & Trip Type
                    ▼
Step 3: Build Stop List
┌─────────────────────────────────────────┐
│  Add stops (minimum 2, maximum 5):      │
│                                         │
│  Stop 1: [123 Home St]                  │
│          Type: PICKUP                   │
│          Passengers: [John Smith ▼]     │
│                                         │
│  Stop 2: [456 Oak Ave]                  │
│          Type: PICKUP                   │
│          Passengers: [Mary Jones ▼]     │
│                                         │
│  Stop 3: [Dialysis Center]              │
│          Type: DROPOFF                  │
│          Passengers: [John, Mary ▼]     │
│                                         │
│  [+ Add Stop]                           │
│                                         │
│  ↕ Drag to reorder stops                │
└───────────────────┬─────────────────────┘
                    ▼
Step 4: Passenger Flow Visualization
┌─────────────────────────────────────────┐
│  Passenger Flow:                        │
│                                         │
│  Stop 1 ──┬── John boards              │
│           │                             │
│  Stop 2 ──┼── Mary boards              │
│           │                             │
│  Stop 3 ──┴── John & Mary exit         │
│                                         │
│  Vehicle capacity check: OK ✓           │
│  (2 passengers, wheelchair van holds 2) │
└───────────────────┬─────────────────────┘
                    ▼
Step 5: Multi-Stop Pricing
┌─────────────────────────────────────────┐
│  Base Fare:                    $25.00   │
│  Stop 1 → Stop 2 (3.2 mi):     $8.00   │
│  Stop 2 → Stop 3 (8.1 mi):    $20.25   │
│  Wait time (5 min @ Stop 2):   $2.50   │
│  Additional stop fee:          $5.00   │
│  Wheelchair (×2 passengers):  $30.00   │
│  ─────────────────────────────────      │
│  Total:                       $90.75   │
└───────────────────┬─────────────────────┘
                    ▼
Step 6-9: Schedule, Payment, Confirm (same as one-way)
```

### 1.4 Will-Call Activation

```
WILL-CALL RETURN ACTIVATION
===========================

Initial State: Trip exists with status = WILL_CALL
                    ▼
Trigger: Patient calls dispatch OR texts "READY"
                    ▼
Step 1: Locate Will-Call Trip
┌─────────────────────────────────────────┐
│  Dispatcher searches:                   │
│  - By patient phone number              │
│  - By trip number                       │
│  - By patient name                      │
│                                         │
│  Shows active will-calls:               │
│  ┌─────────────────────────────────┐   │
│  │ TR-002 | John Smith             │   │
│  │ Memorial Hospital, Main Lobby   │   │
│  │ Waiting since: 45 minutes       │   │
│  │ [Activate] [Call] [Cancel]      │   │
│  └─────────────────────────────────┘   │
└───────────────────┬─────────────────────┘
                    ▼
Step 2: Activate Will-Call
┌─────────────────────────────────────────┐
│  Click [Activate]:                      │
│                                         │
│  1. Update trip status → CONFIRMED      │
│  2. Set willCallActivatedAt = now       │
│  3. Show available drivers              │
│  4. Calculate ETA based on drivers      │
│                                         │
│  "Patient ready for pickup              │
│   Nearest driver: 15 min away           │
│   Assign driver now?"                   │
└───────────────────┬─────────────────────┘
                    ▼
Step 3: Assign Driver
┌─────────────────────────────────────────┐
│  Select available driver:               │
│  ○ Mike J. - 15 min away (recommended)  │
│  ○ Sarah K. - 22 min away               │
│  ○ Tom B. - 30 min away                 │
│                                         │
│  [Assign & Notify]                      │
└───────────────────┬─────────────────────┘
                    ▼
Step 4: Notifications
┌─────────────────────────────────────────┐
│  1. SMS to patient:                     │
│     "Driver Mike is on the way.         │
│      ETA: 15 minutes. Track: [link]"    │
│                                         │
│  2. Push notification to driver         │
│                                         │
│  3. WebSocket update to dispatch        │
└─────────────────────────────────────────┘
```

---

## 2. Trip Execution Workflows

### 2.1 Driver Trip Execution

```
DRIVER EXECUTES A TRIP
======================

Pre-Trip (Day Before / Morning)
┌─────────────────────────────────────────┐
│  1. Driver opens app                    │
│  2. Sees assigned trips for today       │
│  3. Reviews trip details:               │
│     - Patient name & needs              │
│     - Pickup/dropoff addresses          │
│     - Special instructions              │
│     - Appointment time (if any)         │
└───────────────────┬─────────────────────┘
                    ▼
Start of Day
┌─────────────────────────────────────────┐
│  1. Driver goes ONLINE                  │
│  2. Complete pre-trip inspection        │
│     - Check tires, lights, lift         │
│     - Sign off on checklist             │
│  3. App starts GPS broadcasting         │
└───────────────────┬─────────────────────┘
                    ▼
Trip Start
┌─────────────────────────────────────────┐
│  1. Tap "Start Trip" on first ride      │
│  2. Tap "Navigate" → Opens Google Maps  │
│  3. Status → DRIVER_EN_ROUTE            │
│  4. Patient receives SMS:               │
│     "Driver on the way"                 │
│  5. Live tracking begins                │
└───────────────────┬─────────────────────┘
                    ▼
Approaching Pickup (Geofence: 500m)
┌─────────────────────────────────────────┐
│  1. System detects driver near pickup   │
│  2. Automatic SMS to patient:           │
│     "Driver 5 minutes away"             │
│  3. ETA updates in real-time            │
└───────────────────┬─────────────────────┘
                    ▼
Arrived at Pickup (Geofence: 50m)
┌─────────────────────────────────────────┐
│  1. App prompts: "Confirm Arrival?"     │
│  2. Driver taps "Arrived"               │
│  3. Status → DRIVER_ARRIVED             │
│  4. SMS to patient:                     │
│     "Driver has arrived"                │
│  5. Wait timer starts (for no-shows)    │
└───────────────────┬─────────────────────┘
                    ▼
Patient Pickup
┌─────────────────────────────────────────┐
│  1. Patient boards vehicle              │
│  2. Driver secures wheelchair (if appl) │
│  3. Driver taps "Patient Picked Up"     │
│  4. Status → IN_PROGRESS                │
│  5. Navigate to dropoff                 │
└───────────────────┬─────────────────────┘
                    ▼
In Transit
┌─────────────────────────────────────────┐
│  1. GPS tracking continues              │
│  2. ETA updates sent to stakeholders    │
│  3. Family can watch live tracking      │
│  4. Dispatch can monitor progress       │
└───────────────────┬─────────────────────┘
                    ▼
Approaching Dropoff (Geofence: 500m)
┌─────────────────────────────────────────┐
│  1. "Approaching destination" shown     │
│  2. Prepare for arrival                 │
└───────────────────┬─────────────────────┘
                    ▼
Arrived at Dropoff
┌─────────────────────────────────────────┐
│  1. Driver taps "Arrived at Dropoff"    │
│  2. Assist patient exiting vehicle      │
│  3. Ensure patient is safely received   │
└───────────────────┬─────────────────────┘
                    ▼
Complete Trip
┌─────────────────────────────────────────┐
│  1. Driver taps "Complete Trip"         │
│  2. Status → COMPLETED                  │
│  3. If cash payment:                    │
│     - Enter amount collected            │
│  4. Capture signature (optional)        │
│  5. Trip summary shown                  │
│  6. Payment captured (if card)          │
│  7. Receipt sent to patient             │
│  8. Rating request sent (later)         │
└───────────────────┬─────────────────────┘
                    ▼
Next Trip
┌─────────────────────────────────────────┐
│  App shows next assigned trip           │
│  Or returns to available status         │
└─────────────────────────────────────────┘
```

### 2.2 No-Show Workflow

```
PASSENGER NO-SHOW
=================

Driver Arrived → Wait Timer Starts
                    ▼
After 10 Minutes Waiting
┌─────────────────────────────────────────┐
│  App prompts:                           │
│  "Patient not present. Options:"        │
│                                         │
│  [Wait More] [Call Patient] [No-Show]   │
└───────────────────┬─────────────────────┘
                    ▼
If Driver Selects "No-Show"
┌─────────────────────────────────────────┐
│  1. Confirm with dispatch               │
│  2. Driver adds notes (required)        │
│  3. Trip status → NO_SHOW               │
│  4. No-show fee charged (if applicable) │
│  5. Record in patient history           │
│  6. Alert dispatchers                   │
│  7. Attempt to contact patient          │
└─────────────────────────────────────────┘
```

---

## 3. Driver Workflows

### 3.1 Driver Onboarding

```
NEW DRIVER ONBOARDING
=====================

Step 1: Application
┌─────────────────────────────────────────┐
│  Driver submits application:            │
│  - Personal info                        │
│  - Driver's license                     │
│  - Vehicle info (if own vehicle)        │
│  - Consent to background check          │
└───────────────────┬─────────────────────┘
                    ▼
Step 2: Background Check
┌─────────────────────────────────────────┐
│  1. Submit to Checkr/similar service    │
│  2. DMV check                           │
│  3. Criminal background                 │
│  4. Drug screening (if required)        │
│  5. Wait 3-5 business days              │
└───────────────────┬─────────────────────┘
                    ▼
Step 3: Document Upload
┌─────────────────────────────────────────┐
│  Required documents:                    │
│  ☐ Driver's license (front & back)     │
│  ☐ Auto insurance                       │
│  ☐ Vehicle registration                 │
│  ☐ CPR certification                    │
│  ☐ Wheelchair securement cert           │
└───────────────────┬─────────────────────┘
                    ▼
Step 4: Stripe Connect Setup
┌─────────────────────────────────────────┐
│  1. Redirect to Stripe Connect          │
│  2. Driver provides:                    │
│     - Identity verification             │
│     - Bank account for payouts          │
│  3. Stripe verifies identity            │
│  4. Account activated for payouts       │
└───────────────────┬─────────────────────┘
                    ▼
Step 5: Training
┌─────────────────────────────────────────┐
│  Complete required modules:             │
│  ☐ App usage training                   │
│  ☐ Wheelchair securement                │
│  ☐ Patient assistance                   │
│  ☐ Emergency procedures                 │
│  ☐ HIPAA basics                         │
│  ☐ Customer service                     │
└───────────────────┬─────────────────────┘
                    ▼
Step 6: Approval
┌─────────────────────────────────────────┐
│  Admin reviews:                         │
│  ✓ Background check passed              │
│  ✓ All documents uploaded & verified    │
│  ✓ Stripe Connect active                │
│  ✓ Training completed                   │
│                                         │
│  → Approve driver                       │
│  → Account activated                    │
│  → Welcome email sent                   │
└─────────────────────────────────────────┘
```

### 3.2 Pre-Trip Inspection

```
DAILY PRE-TRIP INSPECTION
=========================

Driver Opens App → Start Shift
                    ▼
Inspection Required
┌─────────────────────────────────────────┐
│  "Complete pre-trip inspection          │
│   before starting trips"                │
│                                         │
│  [Begin Inspection]                     │
└───────────────────┬─────────────────────┘
                    ▼
Exterior Checklist
┌─────────────────────────────────────────┐
│  ☐ Tires - Check tread & pressure       │
│  ☐ Lights - Headlights, brake, turn     │
│  ☐ Mirrors - Clean & adjusted           │
│  ☐ Windshield - No cracks               │
│  ☐ Body - Note any damage               │
│                                         │
│  If issue found:                        │
│  [Take Photo] [Add Note]                │
└───────────────────┬─────────────────────┘
                    ▼
Interior Checklist
┌─────────────────────────────────────────┐
│  ☐ Seat belts - All functional          │
│  ☐ Dashboard - No warning lights        │
│  ☐ Horn - Working                       │
│  ☐ Climate control - Working            │
│  ☐ Cleanliness - Acceptable             │
└───────────────────┬─────────────────────┘
                    ▼
Wheelchair Equipment Checklist
┌─────────────────────────────────────────┐
│  ☐ Lift/ramp - Operates smoothly        │
│  ☐ Securement straps - Good condition   │
│  ☐ Lift door - Seals properly           │
│  ☐ Tie-downs - All present & working    │
└───────────────────┬─────────────────────┘
                    ▼
Safety Equipment Checklist
┌─────────────────────────────────────────┐
│  ☐ First aid kit - Present & stocked    │
│  ☐ Fire extinguisher - Charged          │
│  ☐ Emergency triangles - Present        │
│  ☐ Spill kit - Present (optional)       │
└───────────────────┬─────────────────────┘
                    ▼
Enter Odometer Reading
┌─────────────────────────────────────────┐
│  Current odometer: [___________]        │
│                                         │
│  [Take Photo of Odometer]               │
└───────────────────┬─────────────────────┘
                    ▼
Sign & Submit
┌─────────────────────────────────────────┐
│  "I certify this vehicle is safe"       │
│                                         │
│  [Sign Here: ___________________]       │
│                                         │
│  [Submit Inspection]                    │
└───────────────────┬─────────────────────┘
                    ▼
Results
┌─────────────────────────────────────────┐
│  All passed:                            │
│  → Driver can start trips               │
│                                         │
│  Issues found:                          │
│  → Alert sent to operations             │
│  → May require maintenance before trips │
└─────────────────────────────────────────┘
```

---

## 4. Payment Workflows

### 4.1 Individual Payment

```
INDIVIDUAL TRIP PAYMENT
=======================

At Booking (Pre-Authorization)
┌─────────────────────────────────────────┐
│  1. Customer provides card              │
│  2. Create Stripe PaymentIntent         │
│  3. Amount = estimated fare             │
│  4. capture_method = 'manual'           │
│  5. Authorize payment (hold funds)      │
│  6. Store paymentIntentId on trip       │
└───────────────────┬─────────────────────┘
                    ▼
Trip Completes
┌─────────────────────────────────────────┐
│  1. Calculate final fare                │
│     (may differ from estimate)          │
│  2. Retrieve PaymentIntent              │
│  3. If final < authorized:              │
│     - Capture final amount only         │
│  4. If final > authorized:              │
│     - Capture full auth                 │
│     - Create new charge for diff        │
│     - Or absorb difference              │
└───────────────────┬─────────────────────┘
                    ▼
Post-Payment
┌─────────────────────────────────────────┐
│  1. Update trip.paymentStatus = PAID    │
│  2. Record payment in database          │
│  3. Send receipt via SMS/email          │
│  4. Award loyalty points                │
│  5. Calculate driver earnings           │
└─────────────────────────────────────────┘
```

### 4.2 Facility Monthly Invoice

```
FACILITY MONTHLY INVOICING
==========================

Throughout Month
┌─────────────────────────────────────────┐
│  Trips completed for facility:          │
│  - Trip 1: $45.00                       │
│  - Trip 2: $72.50                       │
│  - Trip 3: $38.00                       │
│  - ... (many trips)                     │
│  - Trip N: $55.00                       │
│                                         │
│  All trips have paymentStatus=INVOICED  │
└───────────────────┬─────────────────────┘
                    ▼
End of Month (Cron Job)
┌─────────────────────────────────────────┐
│  1. Query all INVOICED trips for month  │
│  2. Group by facility                   │
│  3. Apply contract rates (if any)       │
│  4. Calculate totals                    │
│  5. Generate invoice record             │
└───────────────────┬─────────────────────┘
                    ▼
Invoice Generation
┌─────────────────────────────────────────┐
│  Invoice #INV-2026-001                  │
│  ─────────────────────────────          │
│  Facility: Sunrise Nursing Home         │
│  Period: January 1-31, 2026             │
│  ─────────────────────────────          │
│  28 trips                               │
│  Subtotal: $1,456.50                    │
│  Volume discount (10%): -$145.65        │
│  ─────────────────────────────          │
│  Total Due: $1,310.85                   │
│  Due Date: February 15, 2026 (Net 15)   │
└───────────────────┬─────────────────────┘
                    ▼
Generate PDF
┌─────────────────────────────────────────┐
│  1. Create PDF from template            │
│  2. Include trip details                │
│  3. Store in S3                         │
│  4. Link URL in invoice record          │
└───────────────────┬─────────────────────┘
                    ▼
Sync to QuickBooks
┌─────────────────────────────────────────┐
│  1. Create QB Invoice                   │
│  2. Map customer (facility)             │
│  3. Add line items                      │
│  4. Store QB invoice ID                 │
└───────────────────┬─────────────────────┘
                    ▼
Send Invoice
┌─────────────────────────────────────────┐
│  1. Email to facility billing contact   │
│  2. Include PDF attachment              │
│  3. Payment link (optional online pay)  │
│  4. Record email sent timestamp         │
└───────────────────┬─────────────────────┘
                    ▼
Payment Tracking
┌─────────────────────────────────────────┐
│  Day 7: Reminder email                  │
│  Day 14: Second reminder                │
│  Day 15: Due date                       │
│  Day 16+: Overdue notices               │
│  Day 30: Escalation to admin            │
│  Day 45: Service suspension warning     │
└───────────────────┬─────────────────────┘
                    ▼
Payment Received
┌─────────────────────────────────────────┐
│  1. Record payment                      │
│  2. Update invoice status = PAID        │
│  3. Sync to QuickBooks                  │
│  4. Update all trip records             │
│  5. Send payment confirmation           │
└─────────────────────────────────────────┘
```

### 4.3 Driver Weekly Payout

```
WEEKLY DRIVER PAYOUT
====================

Sunday 11 PM - Cron Job Triggers
                    ▼
Step 1: Calculate Earnings
┌─────────────────────────────────────────┐
│  For each active driver:                │
│                                         │
│  Query completed trips this week:       │
│  - Trip earnings (base + per-mile)      │
│  - Tips received                        │
│  - Bonuses earned                       │
│                                         │
│  Deductions:                            │
│  - Any chargebacks                      │
│  - Equipment charges                    │
│  - Other deductions                     │
│                                         │
│  Net payout = earnings - deductions     │
└───────────────────┬─────────────────────┘
                    ▼
Step 2: Create Payout Record
┌─────────────────────────────────────────┐
│  Driver: Mike Johnson                   │
│  Period: Jan 8-14, 2026                 │
│  ─────────────────────────────          │
│  Trip Earnings:      $1,150.00          │
│  Tips:                  $85.00          │
│  Bonuses:               $25.00          │
│  ─────────────────────────────          │
│  Gross:              $1,260.00          │
│  Deductions:             $0.00          │
│  ─────────────────────────────          │
│  Net Payout:         $1,260.00          │
│                                         │
│  Status: PENDING                        │
└───────────────────┬─────────────────────┘
                    ▼
Monday 6 AM - Process Payouts
┌─────────────────────────────────────────┐
│  For each pending payout:               │
│                                         │
│  1. Check driver Stripe Connect status  │
│  2. If payouts_enabled = true:          │
│     - Create Stripe Transfer            │
│     - Funds go to Connect account       │
│  3. Update payout status = PROCESSING   │
└───────────────────┬─────────────────────┘
                    ▼
Stripe Processes Transfer (1-2 days)
                    ▼
Webhook: payout.paid
┌─────────────────────────────────────────┐
│  1. Receive Stripe webhook              │
│  2. Update payout status = PAID         │
│  3. Record completedAt timestamp        │
│  4. Notify driver (optional)            │
└───────────────────┬─────────────────────┘
                    ▼
Driver Receives Funds
┌─────────────────────────────────────────┐
│  Funds deposited to driver's bank       │
│  (typically 2-3 business days total)    │
└─────────────────────────────────────────┘
```

---

## 5. Facility Workflows

### 5.1 Standing Order Creation

```
CREATE RECURRING SCHEDULE
=========================

Facility Staff Opens Standing Orders
                    ▼
Step 1: Select Patient
┌─────────────────────────────────────────┐
│  Choose patient from facility roster:   │
│  [Search patients...]                   │
│                                         │
│  Selected: John Smith                   │
│  Medical: Wheelchair, Dialysis patient  │
└───────────────────┬─────────────────────┘
                    ▼
Step 2: Set Schedule
┌─────────────────────────────────────────┐
│  Frequency:                             │
│  ○ Daily                                │
│  ○ Weekly                               │
│  ● Specific days                        │
│                                         │
│  Days: ☑ Mon ☐ Tue ☑ Wed ☐ Thu ☑ Fri   │
│                                         │
│  Pickup Time: [08:00 AM]                │
│                                         │
│  Start Date: [Jan 15, 2026]             │
│  End Date:   [None - Ongoing]           │
└───────────────────┬─────────────────────┘
                    ▼
Step 3: Set Route
┌─────────────────────────────────────────┐
│  Pickup: [Patient's Home Address]       │
│                                         │
│  Dropoff: [Dialysis Center]             │
│                                         │
│  Include return trip?                   │
│  ● Yes - Will-Call (patient calls)      │
│  ○ Yes - Scheduled (set return time)    │
│  ○ No - One-way only                    │
└───────────────────┬─────────────────────┘
                    ▼
Step 4: Review & Confirm
┌─────────────────────────────────────────┐
│  Standing Order Summary:                │
│  ─────────────────────────────          │
│  Patient: John Smith                    │
│  Schedule: Mon, Wed, Fri at 8:00 AM     │
│  Route: Home → Dialysis Center          │
│  Return: Will-Call                      │
│  Starts: January 15, 2026               │
│  ─────────────────────────────          │
│  Est. Cost per trip: $65.00             │
│                                         │
│  [Create Standing Order]                │
└───────────────────┬─────────────────────┘
                    ▼
System Creates Standing Order
┌─────────────────────────────────────────┐
│  1. Save StandingOrder record           │
│  2. Generate trips for next 14 days     │
│  3. Show calendar of upcoming trips     │
│  4. Confirmation notification           │
└─────────────────────────────────────────┘
```

### 5.2 Standing Order Trip Generation

```
AUTOMATIC TRIP GENERATION
=========================

Daily Cron Job (12:00 AM)
                    ▼
For Each Active Standing Order
┌─────────────────────────────────────────┐
│  1. Get standing order details          │
│  2. Check days of week                  │
│  3. Look 14 days ahead                  │
│  4. Find days without existing trips    │
└───────────────────┬─────────────────────┘
                    ▼
Generate Missing Trips
┌─────────────────────────────────────────┐
│  Standing Order: SO-00001               │
│  Schedule: Mon, Wed, Fri                │
│                                         │
│  Existing trips through: Jan 21         │
│  Need to generate for: Jan 22-28        │
│                                         │
│  Creating:                              │
│  - Jan 22 (Wed) ✓                       │
│  - Jan 24 (Fri) ✓                       │
│  - Jan 27 (Mon) ✓                       │
└───────────────────┬─────────────────────┘
                    ▼
For Each New Trip
┌─────────────────────────────────────────┐
│  1. Create Trip record                  │
│  2. Link to StandingOrder               │
│  3. Copy route from template            │
│  4. Set pickup time                     │
│  5. Calculate price                     │
│  6. Status = CONFIRMED                  │
│  7. Create return trip (if applicable)  │
└───────────────────┬─────────────────────┘
                    ▼
Handle Holidays
┌─────────────────────────────────────────┐
│  Check if trip date is a holiday:       │
│  - If closed: Skip generation           │
│  - If open with multiplier: Apply rate  │
│                                         │
│  Check if date is skipped:              │
│  - Facility may have pre-skipped dates  │
│  - Don't generate if skipped            │
└─────────────────────────────────────────┘
```

---

## 6. Admin Workflows

### 6.1 Pricing Configuration

```
UPDATE PRICING RULES
====================

Admin Opens Pricing Settings
                    ▼
Base Rates Section
┌─────────────────────────────────────────┐
│  Base Rates (per trip):                 │
│  ┌─────────────────────────────────┐   │
│  │ Sedan:              [$20.00]    │   │
│  │ Wheelchair Van:     [$25.00]    │   │
│  │ Stretcher Van:      [$45.00]    │   │
│  │ Bariatric Vehicle:  [$35.00]    │   │
│  └─────────────────────────────────┘   │
└───────────────────┬─────────────────────┘
                    ▼
Distance & Time Rates
┌─────────────────────────────────────────┐
│  Per-Mile Rates:                        │
│  ┌─────────────────────────────────┐   │
│  │ Sedan:              [$2.00]     │   │
│  │ Wheelchair Van:     [$2.50]     │   │
│  │ Stretcher Van:      [$3.50]     │   │
│  │ Bariatric Vehicle:  [$3.00]     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Per-Minute Rate:       [$0.50]         │
│  Minimum Fare:          [$35.00]        │
└───────────────────┬─────────────────────┘
                    ▼
Surcharges
┌─────────────────────────────────────────┐
│  ☑ Wheelchair:          [$15.00]        │
│  ☑ Oxygen:              [$10.00]        │
│  ☑ Stretcher:           [$25.00]        │
│  ☑ Attendant:           [$10.00]        │
│  ☑ After Hours:         [$20.00]        │
│  ☑ Additional Stop:     [$5.00]         │
└───────────────────┬─────────────────────┘
                    ▼
Time Multipliers
┌─────────────────────────────────────────┐
│  Rush Hour (7-9 AM, 4-7 PM):            │
│  ☑ Enabled    Multiplier: [1.25]        │
│                                         │
│  Holiday:                               │
│  ☑ Enabled    Multiplier: [1.30]        │
│                                         │
│  Late Night (11 PM - 5 AM):             │
│  ☑ Enabled    Multiplier: [1.40]        │
└───────────────────┬─────────────────────┘
                    ▼
Save & Preview
┌─────────────────────────────────────────┐
│  Test new pricing:                      │
│  [Sample: 10 miles, 30 min, wheelchair] │
│                                         │
│  Old price: $72.50                      │
│  New price: $78.75                      │
│                                         │
│  [Save Changes]  [Cancel]               │
└───────────────────┬─────────────────────┘
                    ▼
On Save
┌─────────────────────────────────────────┐
│  1. Validate all values                 │
│  2. Update pricing config               │
│  3. Log change in audit trail           │
│  4. New prices effective immediately    │
│  5. Existing quotes still valid         │
└─────────────────────────────────────────┘
```

---

## 7. Notification Workflows

### 7.1 SMS Notification Flow

```
SENDING AN SMS
==============

Trigger Event (e.g., Driver Assigned)
                    ▼
Check User Preferences
┌─────────────────────────────────────────┐
│  User notification settings:            │
│  - SMS enabled: Yes                     │
│  - Phone verified: Yes                  │
│  - Opted out: No                        │
│                                         │
│  If any check fails → Skip notification │
└───────────────────┬─────────────────────┘
                    ▼
Prepare Message
┌─────────────────────────────────────────┐
│  1. Load template: driver_assigned      │
│  2. Fill in variables:                  │
│     - {company}: "ABC Transport"        │
│     - {driver}: "Mike Johnson"          │
│     - {vehicle}: "White Ford Transit"   │
│     - {trackUrl}: "https://..."         │
│  3. Result:                             │
│     "ABC Transport: Mike Johnson will   │
│      pick you up in a White Ford        │
│      Transit. Track: https://..."       │
└───────────────────┬─────────────────────┘
                    ▼
Send via Twilio
┌─────────────────────────────────────────┐
│  1. Call Twilio Messages.create()       │
│  2. From: Company phone number          │
│  3. To: Patient phone                   │
│  4. Body: Prepared message              │
└───────────────────┬─────────────────────┘
                    ▼
Log Result
┌─────────────────────────────────────────┐
│  1. Store in SmsLog table:              │
│     - recipientPhone                    │
│     - messageBody                       │
│     - twilioSid                         │
│     - status                            │
│     - timestamp                         │
│  2. If failed, retry up to 3 times      │
└─────────────────────────────────────────┘
```

### 7.2 Trip Reminder Flow

```
AUTOMATED REMINDERS
===================

Cron Job: Every 15 Minutes
                    ▼
Find Trips Needing 24h Reminder
┌─────────────────────────────────────────┐
│  Query trips where:                     │
│  - scheduledPickupTime BETWEEN          │
│    now + 23h 45m AND now + 24h 15m      │
│  - reminder24hSent = false              │
│  - status IN (CONFIRMED, ASSIGNED)      │
└───────────────────┬─────────────────────┘
                    ▼
For Each Trip
┌─────────────────────────────────────────┐
│  1. Send SMS reminder                   │
│  2. Set reminder24hSent = true          │
│  3. Log notification                    │
└───────────────────┬─────────────────────┘
                    ▼
Find Trips Needing 1h Reminder
┌─────────────────────────────────────────┐
│  Query trips where:                     │
│  - scheduledPickupTime BETWEEN          │
│    now + 45m AND now + 1h 15m           │
│  - reminder1hSent = false               │
│  - status IN (CONFIRMED, ASSIGNED)      │
└───────────────────┬─────────────────────┘
                    ▼
For Each Trip
┌─────────────────────────────────────────┐
│  1. Send SMS reminder                   │
│  2. Set reminder1hSent = true           │
│  3. Log notification                    │
└─────────────────────────────────────────┘
```

---

## 8. Emergency Workflows

### 8.1 Emergency Alert

```
DRIVER TRIGGERS EMERGENCY
=========================

Driver Presses Emergency Button
                    ▼
App Captures Context
┌─────────────────────────────────────────┐
│  Automatically captured:                │
│  - Current GPS location                 │
│  - Active trip ID                       │
│  - Timestamp                            │
│  - Driver ID                            │
│                                         │
│  Driver selects type:                   │
│  ○ Medical Emergency                    │
│  ○ Vehicle Breakdown                    │
│  ○ Accident                             │
│  ○ Safety Concern                       │
│  ○ Patient Distress                     │
│                                         │
│  Optional: Add description              │
└───────────────────┬─────────────────────┘
                    ▼
Create Emergency Alert
┌─────────────────────────────────────────┐
│  1. Insert EmergencyAlert record        │
│  2. Status = ACTIVE                     │
│  3. Type = MEDICAL (or selected)        │
│  4. Location = current GPS              │
└───────────────────┬─────────────────────┘
                    ▼
Immediate Notifications
┌─────────────────────────────────────────┐
│  1. WebSocket broadcast to ALL dispatch │
│     - Audio alarm plays in browser      │
│     - Alert popup with details          │
│                                         │
│  2. Push notification to:               │
│     - On-duty dispatchers               │
│     - Operations manager                │
│                                         │
│  3. SMS to backup contacts (if config)  │
└───────────────────┬─────────────────────┘
                    ▼
Dispatch Response
┌─────────────────────────────────────────┐
│  Dispatcher sees alert:                 │
│  ┌─────────────────────────────────┐   │
│  │ 🚨 EMERGENCY ALERT              │   │
│  │ Driver: Mike Johnson             │   │
│  │ Type: Medical Emergency          │   │
│  │ Trip: TR-20260115-042            │   │
│  │ Patient: John Smith              │   │
│  │ Location: [Map Link]             │   │
│  │                                  │   │
│  │ [Acknowledge] [Call Driver]      │   │
│  │ [Call 911] [View on Map]         │   │
│  └─────────────────────────────────┘   │
└───────────────────┬─────────────────────┘
                    ▼
Acknowledge Alert
┌─────────────────────────────────────────┐
│  1. Dispatcher clicks [Acknowledge]     │
│  2. Status → ACKNOWLEDGED               │
│  3. Record acknowledgedBy, timestamp    │
│  4. Stop audio alarm                    │
│  5. Other dispatchers see "Handling"    │
└───────────────────┬─────────────────────┘
                    ▼
If Not Acknowledged in 30 Seconds
┌─────────────────────────────────────────┐
│  1. Escalate to operations manager      │
│  2. Send SMS to manager's phone         │
│  3. Increase alarm urgency              │
└───────────────────┬─────────────────────┘
                    ▼
Resolution
┌─────────────────────────────────────────┐
│  Dispatcher resolves emergency:         │
│                                         │
│  Resolution notes: [____________]       │
│  911 called: ○ Yes ● No                │
│  Patient status: [____________]         │
│                                         │
│  [Resolve Emergency]                    │
│                                         │
│  1. Status → RESOLVED                   │
│  2. Record resolution details           │
│  3. Close alert across all screens      │
│  4. Add to incident report              │
└─────────────────────────────────────────┘
```

---

## Quick Reference: Status Transitions

### Trip Status Flow
```
PENDING → CONFIRMED → ASSIGNED → DRIVER_EN_ROUTE → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED
    │          │           │           │                │                │
    └──────────┴───────────┴───────────┴────────────────┴────────────────┴──→ CANCELLED
                                                        │
                                                        └──────────────────→ NO_SHOW
```

### Payment Status Flow
```
PENDING → AUTHORIZED → CAPTURED → (COMPLETED)
    │          │           │
    │          │           └──→ PARTIALLY_REFUNDED
    │          │           └──→ REFUNDED
    │          └──────────────→ FAILED
    └─────────────────────────→ INVOICED → PAID
```

### Driver Status Flow
```
OFFLINE ←→ ONLINE ←→ AVAILABLE ←→ ASSIGNED ←→ EN_ROUTE ←→ ON_TRIP
                         ↑                                    │
                         └────────────────────────────────────┘
                                        │
                                        ↓
                                      BREAK
```

---

*These workflows cover all major user journeys in the system.*
