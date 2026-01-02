# Development Roadmap - ADDENDUM

> **This document supplements DEVELOPMENT_ROADMAP.md**
> **Added:** January 2026
> **Features:** Multi-stop trips, Round trips, Will-call, Appointment booking, Standing orders

---

## Overview of Added Features

These features were identified as critical for operations and need to be integrated into the development roadmap:

| Feature | Priority | Integrate Into |
|---------|----------|----------------|
| Multi-stop trips | HIGH | Days 14-16 (Booking Form) |
| Round trip booking | HIGH | Days 14-16 (Booking Form) |
| Appointment-time booking | HIGH | Days 14-16 (Booking Form) |
| Will-call returns | HIGH | Days 14-16 + Day 17 (Quick Book) |
| Duplicate booking check | HIGH | Day 14 (Patient Selection) |
| Standing orders | HIGH | Days 73-74 (Facility Portal) |
| Holiday calendar admin | MEDIUM | Day 30 (Pricing Settings) |
| Service area config | MEDIUM | Day 48 (System Settings) |
| Call logging | MEDIUM | Day 10 (Dispatcher Dashboard) |

---

## Updated Day 14: Create Ride Form Part 1 (Enhanced)

**Add to existing objectives:**

4. Add booking type selection
5. Add duplicate booking check

**Enhanced Claude Code Prompt - Add to Day 14:**
```
Enhance the ride booking form with trip type selection:

1. After Step 1 (Patient), add Booking Type selector:
- "Standard Booking" - Single trip, set pickup time
- "Appointment Booking" - Set appointment time, calculate pickup
- "Round Trip" - Outbound + return
- "Multi-Stop" - Multiple pickups/dropoffs

2. For "Appointment Booking":
- Show appointment time picker instead of pickup time
- "Arrive X minutes before" dropdown (15, 30, 45, 60)
- System calculates pickup time based on:
  - Distance
  - Time of day
  - Buffer time
- Display: "Pickup at [calculated time] to arrive by [appointment time]"

3. Duplicate check (add to Step 1 after patient selection):
- Call GET /api/v1/trips/check-duplicate?patientId=X&date=Y
- If duplicate found, show warning:
  - "This patient already has a ride on this date"
  - Show existing trip details
  - "Continue anyway" / "Cancel" buttons
- Warning is dismissible but logged

4. Create duplicate check API:
GET /api/v1/trips/check-duplicate
- Query: patientId, date, time (optional)
- Returns: { hasDuplicate, existingTrips: Trip[] }
- Check trips within 2 hours of requested time
```

**New Deliverables:**
- [ ] Booking type selector
- [ ] Appointment booking mode
- [ ] Duplicate check warning
- [ ] Duplicate check API

---

## Updated Day 15: Create Ride Form Part 2 (Enhanced)

**Add to existing objectives:**

4. Add multi-stop configuration
5. Enhance round trip flow

**Enhanced Claude Code Prompt - Add to Day 15:**
```
Enhance the ride booking form for multi-stop and round trips:

1. For "Multi-Stop" booking type, replace Step 2-3 with Stops Builder:
- Dynamic list of stops
- Each stop has:
  - Stop number (reorderable)
  - Stop type: Pickup / Dropoff / Both
  - Address (autocomplete)
  - Contact name/phone
  - Instructions
  - Passengers boarding/alighting at this stop
- "Add Stop" button (max 5 stops)
- "Remove Stop" button (min 2 stops)
- Drag-and-drop reordering
- Show running distance/time as stops are added
- Validate: at least one pickup and one dropoff

2. Passenger management for multi-stop:
- "Add Passenger" button
- Each passenger has:
  - Name (search existing or add new)
  - Which stop they board
  - Which stop they alight
  - Individual requirements (wheelchair, etc.)
- Visual: show passenger flow through stops

3. For "Round Trip", enhance Step 4 (Schedule):
- Outbound section:
  - Pickup time OR appointment time
- Return section:
  - "Scheduled Return" (set specific time)
  - "Will-Call Return" (patient calls when ready)
  - "No Return" (one way only after all)
- If will-call:
  - Expected ready time (estimate)
  - Will-call expiry (default: 8 hours)
  - Show: "Patient will call 713-555-1234 when ready"

4. Pricing preview updates:
- For multi-stop: show additional stop fees
- For round trip: show both legs
- For will-call: show "Return fare calculated when activated"

5. Create TripStop model interactions:
- When adding stops, calculate:
  - Distance between each stop
  - Duration between each stop
  - Total trip distance
  - Total trip duration
```

**New Deliverables:**
- [ ] Multi-stop builder UI
- [ ] Passenger assignment to stops
- [ ] Round trip with will-call option
- [ ] Running distance/time calculation

---

## Updated Day 16: Create Ride Form Part 3 (Enhanced)

**Add to existing objectives:**

4. Handle multi-stop trip creation
5. Handle linked round trips
6. Handle will-call returns

**Enhanced Claude Code Prompt - Add to Day 16:**
```
Complete trip creation with all booking types:

1. Step 6 Review - show different summaries by type:

For MULTI_STOP:
- Stop-by-stop itinerary:
  "Stop 1 (Pickup): 123 Home St - John Smith boards
   Stop 2 (Pickup): 456 Oak Ave - Mary Johnson boards
   Stop 3 (Dropoff): Dialysis Center - All passengers alight"
- Total distance and time
- Price breakdown including additional stop fees

For ROUND_TRIP:
- "Outbound" card: pickup → dropoff, time
- "Return" card: 
  - If scheduled: dropoff → pickup, time
  - If will-call: "Will-Call Return (patient calls when ready)"
- Combined fare

2. Create Trip API enhancements:

POST /api/v1/trips (for multi-stop):
```json
{
  "tripType": "MULTI_STOP",
  "stops": [
    { "stopOrder": 0, "stopType": "PICKUP", "address": {...}, "passengers": [...] },
    { "stopOrder": 1, "stopType": "PICKUP", "address": {...}, "passengers": [...] },
    { "stopOrder": 2, "stopType": "DROPOFF", "address": {...}, "passengers": [...] }
  ],
  ...
}
```

POST /api/v1/trips/round-trip:
```json
{
  "outbound": { "pickupTime": "...", "pickup": {...}, "dropoff": {...} },
  "return": { 
    "type": "SCHEDULED" | "WILL_CALL",
    "pickupTime": "..." // only if SCHEDULED
  },
  ...
}
```
- Creates two linked Trip records
- Links via linkedTripId field
- For will-call: creates return trip with status PENDING, isWillCall=true

3. Success screen variations:
- Multi-stop: "Multi-stop trip booked - X stops"
- Round trip: "Round trip booked"
  - If will-call: "Return trip will activate when patient calls"
  - Show will-call phone number prominently
- Show both trip numbers for round trip
```

**New Deliverables:**
- [ ] Multi-stop review display
- [ ] Round trip review display
- [ ] Multi-stop trip creation API
- [ ] Round trip creation API (creates linked trips)
- [ ] Will-call trip creation

---

## Updated Day 17: Quick Book Form (Enhanced)

**Add to existing objectives:**

5. Add will-call activation
6. Add appointment-time mode

**Enhanced Claude Code Prompt - Add to Day 17:**
```
Enhance Quick Book with all booking modes:

1. Add booking mode toggle at top:
- "By Pickup Time" (default)
- "By Appointment Time"
- "Will-Call Return"

2. "By Appointment Time" mode:
- Appointment time picker
- "Arrive before" selector (15/30/45/60 min)
- Shows calculated pickup time
- Updates price preview with calculated time

3. "Will-Call Return" mode (for activating existing will-call trips):
- Search for patient's pending will-call trips
- Shows list: "John Smith - return from Memorial Hospital"
- One-click to activate
- Opens mini-form:
  - Confirm patient is ready
  - Any notes
  - "Activate Will-Call" button
- Triggers:
  - Updates trip status
  - Assigns available driver
  - Sends notifications

4. Add "Include Return" toggle:
- When booking standard trip
- Checkbox: "Add return trip"
- If checked:
  - Return type: "Scheduled" / "Will-Call"
  - Return time (if scheduled)

5. Will-call activation API:
POST /api/v1/trips/[id]/activate-will-call
```json
{
  "callerName": "John Smith",
  "callerPhone": "+15551234567",
  "notes": "Patient is in lobby"
}
```
- Updates willCallActivatedAt
- Changes status to CONFIRMED
- Triggers driver assignment workflow
- Sends notifications

6. Active will-calls panel:
- Sidebar or collapsible section
- Shows all active will-call trips
- For each: patient name, location, expected time
- "Time waiting" indicator
- Quick "Activate" button
```

**New Deliverables:**
- [ ] Booking mode toggle
- [ ] Appointment-time mode
- [ ] Will-call activation flow
- [ ] Include return toggle
- [ ] Active will-calls panel

---

## New Days 73-74: Standing Orders (Facility Portal)

**Replace/enhance existing Day 73-74:**

### Day 73 (3 hours) - Standing Orders System

**Objectives:**
1. Create standing order model and API
2. Create standing order list page
3. Create standing order form

**Claude Code Prompt:**
```
Create standing orders system at /facility/standing-orders:

1. Standing Order list page:
- PageHeader: "Standing Orders (Recurring Schedules)"
- Filter bar:
  - Patient search
  - Active / Inactive toggle
  - Day of week filter
- Table columns:
  - Patient name
  - Schedule (e.g., "Mon, Wed, Fri at 8:00 AM")
  - Route (pickup → dropoff)
  - Include return (yes/no, will-call indicator)
  - Next trip date
  - Status badge (Active/Paused)
  - Actions (Edit, Pause, Delete)

2. Create Standing Order form (/facility/standing-orders/new):
Step 1: Patient
- Select from facility's patient roster
- Shows patient's medical needs

Step 2: Schedule
- Frequency: Daily / Weekly / Bi-weekly / Monthly
- If weekly: day checkboxes (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- If monthly: day of month selector
- Pickup time
- OR Appointment time (with arrive-before buffer)
- Start date
- End date (optional)

Step 3: Route
- Pickup address (from patient's saved or new)
- Dropoff address
- Include return trip toggle
  - If yes: Scheduled time OR Will-call
- Vehicle type
- Special instructions

Step 4: Review
- Summary of schedule
- "Trips will be auto-generated X days in advance"
- Price estimate per trip
- "Create Standing Order" button

3. Standing Order API:
POST /api/v1/standing-orders
GET /api/v1/standing-orders (query: facilityId, patientId, active)
GET /api/v1/standing-orders/[id]
PUT /api/v1/standing-orders/[id]
DELETE /api/v1/standing-orders/[id] (soft delete - set inactive)

4. Standing Order service:
- createStandingOrder(): Creates order + generates initial trips
- generateTripsForOrder(orderId, fromDate, toDate): Creates Trip records
- Skip dates handling: Track dates to skip in standingOrderSkips table
```

**Deliverables:**
- [ ] Standing order list page
- [ ] Standing order creation form
- [ ] Standing order API endpoints
- [ ] Trip generation service

---

### Day 74 (3 hours) - Standing Order Management

**Objectives:**
1. Standing order detail view
2. Skip date functionality
3. Auto-generation background job

**Claude Code Prompt:**
```
Enhance standing orders management:

1. Standing Order detail page (/facility/standing-orders/[id]):
- Header: Patient name, schedule summary
- Status controls: Active/Pause toggle
- Schedule section:
  - Visual calendar showing scheduled days
  - Can click day to skip/unskip
- Route section:
  - Map preview of route
  - Edit route button
- Generated Trips section:
  - List of upcoming trips from this order
  - Status of each
  - Can cancel individual trips

2. Skip date functionality:
- Click on calendar day → "Skip this date" modal
- Enter reason (optional)
- Skipped dates shown differently on calendar
- API: POST /api/v1/standing-orders/[id]/skip
  Body: { date, reason }
- API: DELETE /api/v1/standing-orders/[id]/skip/[date] (unskip)

3. Edit standing order:
- Edit any field
- "Apply to future trips only" option
- Changes don't affect already-booked trips

4. Background job for trip generation:
- Runs nightly at 2 AM
- For each active standing order:
  - Check generateDaysInAdvance setting
  - Generate trips up to that date
  - Skip dates in skip list
  - Skip holidays (check HolidayCalendar)
- Log job execution

5. Standing order dashboard widget:
- Show in facility dashboard
- "X standing orders active"
- "X trips generated this week"
- Alert if any orders have no upcoming trips

6. Bulk actions:
- Select multiple orders
- "Pause Selected"
- "Generate Trips Now"
```

**Deliverables:**
- [ ] Standing order detail page
- [ ] Skip date functionality
- [ ] Trip generation background job
- [ ] Dashboard widget
- [ ] Bulk actions

---

## Updated Day 30: Admin Pricing Settings (Enhanced)

**Add to existing objectives:**

6. Holiday calendar management
7. Service hours configuration

**Enhanced Claude Code Prompt - Add to Day 30:**
```
Add to pricing settings page:

1. Holiday Calendar section:
- List of configured holidays
- Each shows: date, name, price multiplier, hours (if modified)
- "Add Holiday" button
- Holiday form:
  - Date picker
  - Holiday name
  - Service options:
    - "Open with modified hours" (set hours)
    - "Closed" (no service)
  - If open: price multiplier slider (1.0x - 2.0x)
- Edit / Delete buttons
- Import common US holidays button

2. Holiday Calendar API:
GET /api/v1/admin/holidays?year=2026
POST /api/v1/admin/holidays
PUT /api/v1/admin/holidays/[id]
DELETE /api/v1/admin/holidays/[id]

3. Pricing engine integration:
- getTimeMultiplier() checks HolidayCalendar
- If date is holiday and closed: reject booking
- If date is holiday and open: apply multiplier
```

**New Deliverables:**
- [ ] Holiday calendar UI
- [ ] Holiday CRUD API
- [ ] Holiday import feature

---

## Updated Day 48: System Settings (Enhanced)

**Add to existing objectives:**

4. Service configuration
5. Service area definition

**Enhanced Claude Code Prompt - Add to Day 48:**
```
Add service configuration to system settings:

1. Service Hours section:
- Service start hour (dropdown, 12 AM - 12 PM)
- Service end hour (dropdown, 12 PM - 12 AM)
- Timezone selector
- "Closed on holidays" toggle

2. Booking Rules section:
- Minimum lead time (hours/minutes input)
- ASAP minimum lead time (minutes)
- Maximum advance booking (days)
- Same-day cutoff time

3. Multi-Stop Settings section:
- Maximum stops per trip (1-10)
- Additional stop fee ($)

4. Will-Call Settings section:
- Will-call expiry (hours)
- Will-call reminder after (hours)
- Default will-call phone number

5. Service Area section:
- Map with polygon drawing tool
- Draw service area boundary
- "Allow out-of-area bookings" toggle
- Out-of-area fee ($)
- Save as GeoJSON

6. Service Config API:
GET /api/v1/admin/service-config
PUT /api/v1/admin/service-config

7. Address validation integration:
- In booking form, when address selected:
- Check if within service area polygon
- If outside and not allowed: show error
- If outside and allowed: show warning + fee
```

**New Deliverables:**
- [ ] Service hours configuration
- [ ] Booking rules configuration
- [ ] Service area map editor
- [ ] Address validation

---

## Updated Day 10: Dispatcher Dashboard (Enhanced)

**Add to existing objectives:**

5. Active will-calls panel
6. Call logging

**Enhanced Claude Code Prompt - Add to Day 10:**
```
Add to dispatcher dashboard:

1. Active Will-Calls panel:
- Collapsible sidebar section or card
- List of all will-call trips waiting
- Each shows:
  - Patient name
  - Location (where they're waiting)
  - Expected ready time
  - Time waiting (color-coded: green < 1hr, yellow 1-2hr, red > 2hr)
  - "Activate" button
- Sorted by time waiting (longest first)
- Count badge on header
- Auto-refreshes every 30 seconds

2. Call Log quick entry:
- "Log Call" button in header
- Quick modal:
  - Caller phone (with lookup)
  - Call type dropdown (Booking, Will-Call, Inquiry, Complaint)
  - Quick notes
  - "Save" button
- Auto-populates caller name if phone matches patient

3. Recent Calls widget:
- Last 5 calls logged
- Shows: time, caller, type, outcome
- Click to view full details

4. Call Log API:
POST /api/v1/dispatcher/calls
GET /api/v1/dispatcher/calls?date=X
```

**New Deliverables:**
- [ ] Active will-calls panel
- [ ] Call logging modal
- [ ] Recent calls widget
- [ ] Call log API

---

## Integration Points Summary

### Booking Form (Days 14-16)
1. ✅ Multi-stop builder
2. ✅ Round trip with will-call
3. ✅ Appointment-time booking
4. ✅ Duplicate check

### Quick Book (Day 17)
1. ✅ Will-call activation
2. ✅ Appointment mode
3. ✅ Include return toggle

### Dispatcher Dashboard (Day 10)
1. ✅ Active will-calls panel
2. ✅ Call logging

### Admin Settings (Day 30 + 48)
1. ✅ Holiday calendar
2. ✅ Service hours
3. ✅ Service area

### Facility Portal (Days 73-74)
1. ✅ Standing orders system
2. ✅ Trip generation

### Driver Portal
- No changes needed - multi-stop trips display as sequence of stops

---

## Database Models Added

Refer to DATABASE_SCHEMA.prisma for:
- `TripStop` - Individual stops within a trip
- `TripPassenger` - Passengers and their boarding/alighting stops
- `StandingOrder` - Recurring trip templates
- `HolidayCalendar` - Holiday dates and settings
- `ServiceConfig` - Service hours, areas, rules
- `CallLog` - Dispatcher call tracking
- `ScheduledJob` - Background job tracking

---

## API Endpoints Added

Refer to API_SPEC.md sections 12-17 for:
- Multi-stop trip creation
- Round trip creation
- Will-call activation
- Appointment-time booking
- Standing order CRUD
- Holiday calendar CRUD
- Service configuration
- Dispatcher tools

---

*Integrate these enhancements into your daily work as you reach each relevant day in the roadmap.*
