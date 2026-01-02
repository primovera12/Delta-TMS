# Development Roadmap - Wheelchair Transportation Platform

> **Schedule:** 3 hours/day, 5 days/week (15 hours/week)
> **Start Date:** [Your Start Date]
> **Total Estimated Duration:** 20 weeks (100 working days)

---

## Overview

### Phase Breakdown

| Phase | Focus | Duration | Weeks |
|-------|-------|----------|-------|
| Phase 1 | Foundation & Setup | 1 week | 1 |
| Phase 2 | Core Operations | 5 weeks | 2-6 |
| Phase 3 | Driver Portal | 2 weeks | 7-8 |
| Phase 4 | Admin & Settings | 2 weeks | 9-10 |
| Phase 5 | Billing & Invoicing | 2 weeks | 11-12 |
| Phase 6 | Operations Manager | 2 weeks | 13-14 |
| Phase 7 | Facility Portal | 2 weeks | 15-16 |
| Phase 8 | Patient & Family | 2 weeks | 17-18 |
| Phase 9 | Polish & Launch | 2 weeks | 19-20 |

---

## Pre-Development Checklist

Before Day 1, ensure you have:

- [ ] GitHub repository created
- [ ] Claude Code connected to repo
- [ ] Vercel account ready
- [ ] Supabase or Neon database provisioned
- [ ] Stripe account (test mode)
- [ ] Twilio account (test credentials)
- [ ] Google Maps API key
- [ ] Domain name (optional for now)

---

# PHASE 1: Foundation & Setup (Week 1)

## Week 1 Goals
- Project scaffolding
- Database schema
- Authentication system
- Base UI components

---

### Day 1 (3 hours) - Project Setup

**Objectives:**
1. Initialize Next.js 15 project with App Router
2. Configure TypeScript
3. Set up Tailwind CSS
4. Install and configure Shadcn/ui
5. Set up project structure

**Claude Code Prompt:**
```
Create a new Next.js 15 project with:
- App Router
- TypeScript (strict mode)
- Tailwind CSS
- ESLint + Prettier

Then set up shadcn/ui with the following configuration:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Create this folder structure:
/app
  /(auth)
  /(dashboard)
    /dispatcher
    /driver
    /admin
    /operations
    /facility
    /patient
    /family
  /api/v1
/components
  /ui (shadcn components)
  /forms
  /layout
  /domain (business-specific components)
/lib
  /db
  /auth
  /services
  /utils
  /validations
/prisma
/types
/hooks
/stores
```

**Deliverables:**
- [ ] Next.js project running on localhost
- [ ] Tailwind configured
- [ ] Shadcn/ui initialized
- [ ] Folder structure created

---

### Day 2 (3 hours) - Database Schema Part 1

**Objectives:**
1. Set up Prisma
2. Create User and Role models
3. Create Patient/MedicalProfile models
4. Create SavedAddress model

**Claude Code Prompt:**
```
Set up Prisma with PostgreSQL. Create schema with these models:

1. User model with fields:
- id (uuid)
- email (unique)
- phone (unique)
- passwordHash
- firstName, lastName
- role (enum: SUPER_ADMIN, ADMIN, OPERATIONS_MANAGER, DISPATCHER, DRIVER, FACILITY_STAFF, FAMILY_MEMBER, PATIENT)
- status (enum: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION)
- emailVerified, phoneVerified (boolean)
- createdAt, updatedAt, lastLogin

2. MedicalProfile model linked to User:
- mobilityNeeds (array)
- wheelchairRequired, stretcherRequired, oxygenRequired, bariatricRequired (boolean)
- weightLbs
- medicalConditions, medications, allergies (arrays)
- emergencyContactName, emergencyContactPhone, emergencyContactRelationship

3. SavedAddress model linked to User:
- label, addressLine1, addressLine2, city, state, zipCode
- latitude, longitude
- googlePlaceId
- facilityType, facilityPhone, facilityContactPerson
- specialInstructions
- isPrimary (boolean)

Add proper indexes and relations.
```

**Deliverables:**
- [ ] Prisma installed and configured
- [ ] User model complete
- [ ] MedicalProfile model complete
- [ ] SavedAddress model complete

---

### Day 3 (3 hours) - Database Schema Part 2

**Objectives:**
1. Create Driver and Vehicle models
2. Create Facility and FacilityStaff models
3. Create FamilyRelationship model

**Claude Code Prompt:**
```
Add these models to Prisma schema:

1. DriverProfile linked to User:
- licenseNumber (unique), licenseExpiry
- backgroundCheckStatus, backgroundCheckDate
- drugTestStatus, drugTestDate
- cprCertified, cprExpiry
- firstAidCertified, firstAidExpiry
- rating, totalTrips, completedTrips, cancelledTrips
- status (enum: OFFLINE, ONLINE, BUSY, ON_TRIP, BREAK)
- currentLocationLatitude, currentLocationLongitude, lastLocationUpdate
- stripeAccountId (for payouts)

2. Vehicle model linked to DriverProfile:
- make, model, year, color, licensePlate, vin (unique)
- vehicleType (enum: SEDAN, WHEELCHAIR_ACCESSIBLE, STRETCHER_VAN, BARIATRIC)
- seatingCapacity
- wheelchairAccessible, stretcherCapable, oxygenEquipped (boolean)
- insuranceProvider, insurancePolicyNumber, insuranceExpiry
- registrationExpiry, inspectionExpiry
- isActive, lastMaintenance, nextMaintenanceDue

3. Facility model:
- name, phone, email
- addressLine1, addressLine2, city, state, zipCode
- billingType (enum: PAY_PER_RIDE, MONTHLY_INVOICE)
- status

4. FacilityStaff linking User to Facility

5. FamilyRelationship linking User to User:
- patientId, familyMemberId
- relationshipType
- canBookTrips, canViewMedical, canModifyProfile (permissions)
```

**Deliverables:**
- [ ] DriverProfile and Vehicle models
- [ ] Facility model
- [ ] FamilyRelationship model
- [ ] All relations properly set up

---

### Day 4 (3 hours) - Database Schema Part 3

**Objectives:**
1. Create Trip model (core business entity)
2. Create TripStatusHistory model
3. Create PaymentMethod model
4. Create initial seed data

**Claude Code Prompt:**
```
Add these models to Prisma schema:

1. Trip model (this is the core entity):
- id (uuid), tripNumber (unique, format: TR-YYYYMMDD-XXXX)
- passengerId (User), bookedById (User), driverId (DriverProfile), facilityId (optional)
- Pickup: addressLine1, addressLine2, city, state, zip, latitude, longitude, contactName, contactPhone, instructions
- Dropoff: same fields as pickup
- scheduledPickupTime, estimatedArrivalTime, actualPickupTime, actualDropoffTime
- distanceMiles, estimatedDurationMinutes, actualDurationMinutes
- vehicleType, passengerCount
- wheelchairRequired, stretcherRequired, oxygenRequired, bariatricRequired (boolean)
- baseFare, distanceFare, timeFare, waitingTimeFare, accessibilitySurcharge, multiplierApplied, totalFare, tipAmount
- status (enum: PENDING, CONFIRMED, ASSIGNED, DRIVER_ON_WAY, DRIVER_ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW)
- paymentStatus (enum: PENDING, AUTHORIZED, CAPTURED, FAILED, REFUNDED, INVOICED)
- cancellationReason, cancellationFee
- driverNotes, patientNotes, facilityNotes, specialRequirements
- isRecurring, recurringPatternId

2. TripStatusHistory:
- tripId, status, changedById (User), notes, createdAt

3. PaymentMethod linked to User:
- stripePaymentMethodId, type (enum: CARD, APPLE_PAY, GOOGLE_PAY, BANK)
- brand, lastFourDigits, expiryMonth, expiryYear
- isDefault, nickname

4. Create seed file with:
- 1 Super Admin user
- 2 Dispatcher users
- 3 Driver users with vehicles
- 1 Facility with 2 staff
- 5 Patient users with medical profiles

Use test data but realistic addresses in Houston, TX.
```

**Deliverables:**
- [ ] Trip model complete
- [ ] TripStatusHistory model
- [ ] PaymentMethod model
- [ ] Seed file with test data
- [ ] Database migrated and seeded

---

### Day 5 (3 hours) - Authentication System

**Objectives:**
1. Set up NextAuth.js v5 (Auth.js)
2. Create login/register API routes
3. Create auth middleware
4. Set up session handling

**Claude Code Prompt:**
```
Set up authentication with NextAuth.js v5:

1. Configure NextAuth with:
- Credentials provider (email + password)
- JWT strategy
- Role-based session data

2. Create these API routes:
POST /api/v1/auth/register - Register new user
POST /api/v1/auth/login - Login (handled by NextAuth)
POST /api/v1/auth/logout - Logout
GET /api/v1/auth/me - Get current user

3. Create middleware that:
- Protects dashboard routes
- Redirects based on user role
- Handles session refresh

4. Create auth utility functions:
- hashPassword, verifyPassword
- generateOTP, verifyOTP
- Role permission checker

5. Role-based redirects:
- SUPER_ADMIN, ADMIN → /admin
- OPERATIONS_MANAGER → /operations
- DISPATCHER → /dispatcher
- DRIVER → /driver
- FACILITY_STAFF → /facility
- FAMILY_MEMBER → /family
- PATIENT → /patient

Use bcryptjs for password hashing.
Session should include: userId, email, role, firstName, lastName.
```

**Deliverables:**
- [ ] NextAuth configured
- [ ] Login/register API routes
- [ ] Auth middleware
- [ ] Role-based redirects working
- [ ] Session includes user role

---

# PHASE 2: Core Operations (Weeks 2-6)

## Week 2 Goals
- Base layout components
- Login/Register pages
- Dispatcher dashboard skeleton

---

### Day 6 (3 hours) - Base Layout Components

**Objectives:**
1. Create Sidebar component
2. Create TopBar component
3. Create main dashboard layout
4. Create responsive behavior

**Claude Code Prompt:**
```
Create the main layout components:

1. Sidebar component with:
- Logo at top
- Navigation items (icon + label)
- Collapsible on desktop
- Hidden on mobile (hamburger menu trigger)
- User info + logout at bottom
- Active state highlighting
- Role-based menu items (different menu for different roles)

2. TopBar component with:
- Hamburger menu button (mobile)
- Page title
- Notification bell with badge
- User dropdown menu (profile, settings, logout)

3. DashboardLayout that combines:
- Sidebar
- TopBar
- Main content area with proper padding
- Mobile drawer for sidebar

4. Make it responsive:
- Mobile: Full-screen sidebar drawer
- Tablet: Collapsed sidebar (icons only)
- Desktop: Expanded sidebar

Use Shadcn Sheet for mobile sidebar.
```

**Deliverables:**
- [ ] Sidebar component
- [ ] TopBar component
- [ ] DashboardLayout wrapper
- [ ] Mobile responsive

---

### Day 7 (3 hours) - Login Page

**Objectives:**
1. Create login page UI
2. Connect to auth API
3. Handle loading/error states
4. Add "remember me" functionality

**Claude Code Prompt:**
```
Create the login page at /login:

1. Centered card layout with:
- Company logo
- "Welcome back" heading
- Email input with validation
- Password input with show/hide toggle
- "Remember me" checkbox
- "Forgot password?" link
- Login button with loading state
- "Don't have an account? Contact admin" text

2. Form handling:
- Use React Hook Form + Zod validation
- Email: required, valid format
- Password: required, min 8 chars
- Show inline validation errors

3. Auth integration:
- Call NextAuth signIn on submit
- Show toast on error
- Redirect to role-appropriate dashboard on success

4. States:
- Default
- Loading (button spinner)
- Error (toast + field highlighting)

Make it look professional and clean.
Mobile responsive.
```

**Deliverables:**
- [ ] Login page complete
- [ ] Form validation working
- [ ] Auth integration working
- [ ] Redirects working

---

### Day 8 (3 hours) - Core UI Components Part 1

**Objectives:**
1. Add all needed Shadcn components
2. Create Button variants
3. Create Card variants
4. Create Badge variants (status colors)

**Claude Code Prompt:**
```
Set up core UI components:

1. Add these Shadcn components:
- button, card, badge, avatar
- input, label, textarea, select
- checkbox, radio-group, switch
- dialog, sheet, dropdown-menu
- table, tabs, toast
- skeleton, progress, separator
- tooltip, popover

2. Extend Button with custom variants:
- Add "destructive-outline" variant
- Add "xl" size (56px height)
- Add loading prop with spinner

3. Create StatusBadge component with variants:
- pending (amber)
- confirmed (blue)
- assigned (purple)
- driver-on-way (cyan)
- driver-arrived (emerald)
- in-progress (green)
- completed (dark green)
- cancelled (red)
- no-show (dark red)

4. Create DriverStatusBadge:
- online (green)
- offline (gray)
- busy (amber)
- on-trip (blue)
- break (purple)

5. Create RoleBadge for user roles
```

**Deliverables:**
- [ ] All Shadcn components installed
- [ ] StatusBadge component
- [ ] DriverStatusBadge component
- [ ] RoleBadge component

---

### Day 9 (3 hours) - Core UI Components Part 2

**Objectives:**
1. Create StatCard component
2. Create EmptyState component
3. Create PageHeader component
4. Create DataTable wrapper

**Claude Code Prompt:**
```
Create these reusable components:

1. StatCard component:
Props: title, value, change (number), changeLabel, icon, trend (up/down)
- Shows title, large value, change percentage with color
- Icon in top right
- Subtle background

2. EmptyState component:
Props: icon, title, description, action (button)
- Centered layout
- Large icon (muted color)
- Title and description
- Optional action button

3. PageHeader component:
Props: title, description, breadcrumbs, actions
- Title (h1 style)
- Optional description
- Breadcrumb trail
- Right-aligned action buttons

4. DataTable wrapper that includes:
- Search input
- Filter dropdown trigger
- Column visibility toggle
- Pagination
- Loading skeleton state
- Empty state when no data

Use TanStack Table (react-table) for the table logic.
```

**Deliverables:**
- [ ] StatCard component
- [ ] EmptyState component
- [ ] PageHeader component
- [ ] DataTable with search/filter/pagination

---

### Day 10 (3 hours) - Dispatcher Dashboard UI

**Objectives:**
1. Create dispatcher dashboard page
2. Add stat cards (today's rides, active, completed)
3. Add quick actions section
4. Add upcoming rides preview

**Claude Code Prompt:**
```
Create the dispatcher dashboard at /dispatcher:

1. Page layout with:
- PageHeader: "Dashboard" title, today's date
- 4 StatCards in a row:
  - Today's Rides (total count)
  - Active Now (in-progress count)
  - Completed (today's completed)
  - Pending (awaiting confirmation)

2. Quick Actions section:
- Large "Book New Ride" button (primary)
- "Quick Book" button (opens simplified form)
- "View All Rides" link

3. Upcoming Rides section:
- List of next 5 rides (time order)
- Each shows: time, patient name, pickup address (truncated), status badge
- "View All" link

4. Recent Activity section:
- Last 5 status changes
- Shows: time, ride number, what changed

Use mock data for now. We'll connect to API later.
Make it responsive (cards stack on mobile).
```

**Deliverables:**
- [ ] Dispatcher dashboard page
- [ ] Stat cards with mock data
- [ ] Quick actions
- [ ] Upcoming rides list

---

## Week 3 Goals
- Pricing engine
- Create ride flow (multi-step form)
- Quote calculation

---

### Day 11 (3 hours) - Pricing Engine Part 1

**Objectives:**
1. Create PricingConfig model in database
2. Create pricing calculation service
3. Create API endpoint for quote generation

**Claude Code Prompt:**
```
Create the pricing engine:

1. Add PricingConfig model to Prisma:
- id, name (e.g., "default", "houston")
- baseFare (decimal)
- perMileRate (decimal)
- perMinuteRate (decimal)
- minimumFare (decimal)
- wheelchairSurcharge (decimal)
- stretcherSurcharge (decimal)
- oxygenSurcharge (decimal)
- bariatricSurcharge (decimal)
- rushHourMultiplier (decimal)
- rushHourStart, rushHourEnd (time strings)
- weekendMultiplier (decimal)
- holidayMultiplier (decimal)
- lateNightMultiplier (decimal)
- lateNightStart, lateNightEnd (time strings)
- isActive (boolean)
- createdAt, updatedAt

2. Create /lib/services/pricing.ts with:
- calculateQuote(trip: QuoteRequest): QuoteResult
- getActiveMultiplier(datetime: Date): number
- getSurcharges(requirements: MedicalRequirements): Surcharge[]
- formatPriceBreakdown(quote: QuoteResult): FormattedBreakdown

3. The calculation formula:
total = baseFare + (distance * perMileRate) + (time * perMinuteRate)
total += sum of applicable surcharges
total *= time multiplier (if applicable)
total = max(total, minimumFare)

4. Create API route:
POST /api/v1/trips/quote
Request: { pickup, dropoff, scheduledTime, requirements }
Response: { quote with full breakdown }

Use Google Maps Distance Matrix API for distance/duration.
```

**Deliverables:**
- [ ] PricingConfig model
- [ ] Pricing calculation service
- [ ] Quote API endpoint
- [ ] Handles multipliers and surcharges

---

### Day 12 (3 hours) - Pricing Engine Part 2

**Objectives:**
1. Create PriceBreakdown component
2. Test pricing calculations
3. Create admin pricing API endpoints

**Claude Code Prompt:**
```
Complete the pricing engine:

1. Create PriceBreakdown component:
Props: quote (QuoteResult)
- Shows each line item:
  - Base fare: $XX.XX
  - Distance (X.X mi × $X.XX): $XX.XX
  - Time (XX min × $X.XX): $XX.XX
  - Wheelchair accessibility: $XX.XX (if applicable)
  - Other surcharges...
  - Rush hour (1.5×): Applied (if applicable)
  - Separator line
  - Total: $XX.XX (bold, larger)
- Clean, receipt-like styling

2. Create admin API endpoints:
GET /api/v1/admin/pricing - Get all pricing configs
GET /api/v1/admin/pricing/active - Get active config
POST /api/v1/admin/pricing - Create new config
PUT /api/v1/admin/pricing/[id] - Update config
DELETE /api/v1/admin/pricing/[id] - Delete config

3. Create unit tests for pricing calculations:
- Test base calculation
- Test each surcharge type
- Test each multiplier
- Test minimum fare enforcement
- Test combined scenarios

4. Seed default pricing config with these values:
- baseFare: 25.00
- perMileRate: 2.50
- perMinuteRate: 0.50
- minimumFare: 15.00
- wheelchairSurcharge: 15.00
- stretcherSurcharge: 25.00
- oxygenSurcharge: 10.00
- bariatricSurcharge: 20.00
- rushHourMultiplier: 1.5 (7-9 AM, 5-7 PM)
- weekendMultiplier: 1.2
- lateNightMultiplier: 1.4 (10 PM - 6 AM)
```

**Deliverables:**
- [ ] PriceBreakdown component
- [ ] Admin pricing endpoints
- [ ] Unit tests passing
- [ ] Default pricing seeded

---

### Day 13 (3 hours) - Address Autocomplete

**Objectives:**
1. Set up Google Maps integration
2. Create AddressAutocomplete component
3. Create address selection with map preview

**Claude Code Prompt:**
```
Create the address autocomplete system:

1. Set up Google Maps:
- Install @googlemaps/js-api-loader
- Create GoogleMapsProvider context
- Load Maps JavaScript API

2. Create AddressAutocomplete component:
Props: value, onChange, onSelect, placeholder, restrictToState
- Input with search icon
- Debounced API calls (300ms)
- Dropdown with suggestions
- Shows: street, city, state
- On select: returns full address object with lat/lng
- Restrict to Texas (or configurable state)
- Keyboard navigation (arrow keys, enter)
- Loading state
- Error handling

3. Create AddressDisplay component:
Props: address, showMap, editable
- Shows formatted address
- Optional small map preview
- Edit button if editable

4. Create distance calculation utility:
- getDistanceAndDuration(origin, destination): { miles, minutes }
- Uses Distance Matrix API
- Handles errors gracefully

5. Create /api/v1/maps/distance endpoint:
- Accepts origin and destination coords
- Returns distance in miles and duration in minutes
- Caches results (same origin/dest within 24h)
```

**Deliverables:**
- [ ] Google Maps configured
- [ ] AddressAutocomplete component
- [ ] AddressDisplay component
- [ ] Distance calculation working

---

### Day 14 (3 hours) - Create Ride Form Part 1

**Objectives:**
1. Create multi-step form structure
2. Step 1: Patient selection/creation
3. Step 2: Pickup address

**Claude Code Prompt:**
```
Create the ride booking form at /dispatcher/rides/new:

1. Multi-step form structure:
- Step indicator at top (1-6)
- Form content area
- Back/Next buttons at bottom
- Save as draft capability
- Form state persisted in Zustand store

2. Step 1: Patient
- Search existing patients (autocomplete)
- OR "Add New Patient" button
- If adding new:
  - First name, Last name (required)
  - Phone (required, with formatting)
  - Email (optional)
  - Date of birth (optional)
  - Quick medical needs checkboxes:
    - Wheelchair required
    - Stretcher required
    - Oxygen required
    - Bariatric vehicle needed
  - Weight (optional, for bariatric)
  - Emergency contact name/phone
- Selected patient shows as card with info

3. Step 2: Pickup
- AddressAutocomplete for address
- OR select from patient's saved addresses
- Contact name at pickup (pre-filled if available)
- Contact phone at pickup
- Special instructions textarea
- "Save this address" checkbox

Create form validation with Zod.
Use React Hook Form for form state.
```

**Deliverables:**
- [ ] Multi-step form skeleton
- [ ] Step 1: Patient selection
- [ ] Step 2: Pickup address
- [ ] Form state management

---

### Day 15 (3 hours) - Create Ride Form Part 2

**Objectives:**
1. Step 3: Dropoff address
2. Step 4: Schedule (date/time)
3. Step 5: Vehicle requirements

**Claude Code Prompt:**
```
Continue the ride booking form:

1. Step 3: Dropoff
- Same as pickup:
  - AddressAutocomplete
  - OR select from saved addresses
  - Contact name/phone
  - Special instructions
  - "Save this address" checkbox
- Show distance preview (pickup → dropoff)

2. Step 4: Schedule
- Date picker (calendar)
  - Min date: today
  - Max date: 90 days out
  - Highlight dates with existing bookings
- Time picker
  - 15-minute intervals
  - 5:00 AM to 11:00 PM
  - Show if rush hour applies (visual indicator)
- Trip type toggle:
  - One way (default)
  - Round trip (adds return time field)
- Recurring trip option:
  - Toggle to enable
  - Frequency: daily, weekly, specific days
  - End date

3. Step 5: Vehicle Requirements
- Vehicle type selector:
  - Standard Wheelchair Van (default)
  - Stretcher Van
  - Bariatric Vehicle
- Pre-selected based on patient's medical profile
- Number of passengers (1-4)
- Additional equipment checkboxes:
  - Oxygen tank accommodation
  - Extra attendant needed
- Additional notes textarea

Auto-select vehicle type based on patient's needs.
Show warning if vehicle type doesn't match patient needs.
```

**Deliverables:**
- [ ] Step 3: Dropoff complete
- [ ] Step 4: Schedule with date/time pickers
- [ ] Step 5: Vehicle requirements
- [ ] Auto-selection logic working

---

## Week 4 Goals
- Complete ride creation flow
- Payment collection
- Driver assignment

---

### Day 16 (3 hours) - Create Ride Form Part 3

**Objectives:**
1. Step 6: Review & Quote
2. Create trip via API
3. Success confirmation

**Claude Code Prompt:**
```
Complete the ride booking form:

1. Step 6: Review & Confirm
- Summary card showing:
  - Patient info (name, phone, medical needs icons)
  - Pickup address + time
  - Dropoff address
  - Vehicle type
  - Special instructions (if any)
- Price quote section:
  - Call /api/v1/trips/quote
  - Show PriceBreakdown component
  - Quote valid for 30 minutes indicator
- Payment section:
  - If patient has saved cards: select one
  - If facility booking: "Bill to facility" option
  - "Collect payment now" checkbox (default: true for individuals)
  - "Collect payment later" option
- Terms checkbox: "Patient agrees to terms"
- Large "Confirm Booking" button

2. Create Trip API:
POST /api/v1/trips
- Validate all fields
- Calculate final price
- Create trip record with status PENDING
- If payment now: authorize Stripe payment (don't capture yet)
- Create TripStatusHistory entry
- Return created trip

3. Success state:
- Confetti animation (subtle)
- "Ride Booked Successfully!" message
- Trip number displayed prominently
- "Assign Driver" button (goes to assignment)
- "Book Another Ride" button
- "View Ride Details" button

4. Create booking store (Zustand):
- Holds all form state across steps
- Persists to sessionStorage
- Clear on successful booking or explicit cancel
```

**Deliverables:**
- [ ] Step 6: Review complete
- [ ] Quote display integrated
- [ ] Trip creation API
- [ ] Success confirmation
- [ ] Booking store

---

### Day 17 (3 hours) - Quick Book Form

**Objectives:**
1. Create simplified one-page booking form
2. Optimized for phone call workflow
3. Keyboard shortcuts

**Claude Code Prompt:**
```
Create Quick Book at /dispatcher/quick-book:

This is a single-page form optimized for dispatchers taking phone calls.

1. Two-column layout:
Left column:
- Patient search (autocomplete) OR quick add inline
  - If new: just name + phone (minimum required)
- Pickup address (autocomplete)
- Dropoff address (autocomplete)

Right column:
- Date/time picker (combined, compact)
- Vehicle type (icon buttons, quick select)
- Medical needs (checkboxes in row)
- Notes (small textarea)

2. Bottom section:
- Price preview (updates live as fields change)
- "Book Now" button (large, prominent)
- "Book & Assign" button (books then opens assignment modal)

3. Keyboard shortcuts:
- Ctrl/Cmd + Enter: Submit form
- Ctrl/Cmd + N: Focus patient search
- Ctrl/Cmd + P: Focus pickup
- Ctrl/Cmd + D: Focus dropoff
- Tab order optimized for speed

4. Features:
- Auto-fill dropoff contact from pickup
- Remember last used vehicle type
- Show "Frequent destinations" for returning patients
- One-click to use patient's home address

5. After booking:
- Stay on page (don't navigate away)
- Show success toast with ride number
- Form clears, ready for next booking
- "View Details" link in toast
```

**Deliverables:**
- [ ] Quick Book page
- [ ] Single-page optimized form
- [ ] Live price preview
- [ ] Keyboard shortcuts
- [ ] Success handling

---

### Day 18 (3 hours) - Payment Collection

**Objectives:**
1. Set up Stripe integration
2. Create payment collection modal
3. Handle card-not-present transactions

**Claude Code Prompt:**
```
Set up Stripe payment collection:

1. Stripe setup:
- Install @stripe/stripe-js and stripe (server)
- Create Stripe provider/context
- Set up webhook endpoint for events

2. Create PaymentCollectionModal component:
Props: tripId, amount, patientId, onSuccess, onCancel
- Shows trip summary and amount
- If patient has saved cards:
  - List of saved cards (radio select)
  - "Use different card" option
- New card form:
  - Stripe CardElement
  - Billing address (optional)
  - "Save card for future" checkbox
- Loading state during processing
- Error handling with clear messages
- Success state with confirmation

3. API endpoints:
POST /api/v1/payments/create-intent
- Creates Stripe PaymentIntent
- Returns clientSecret

POST /api/v1/payments/confirm
- Confirms payment
- Updates trip paymentStatus

POST /api/v1/payments/save-card
- Saves card as PaymentMethod for patient

4. Handle card-not-present:
- Dispatcher enters card details on behalf of patient
- Manual card entry form
- Proper handling for MOTO (mail order/telephone order)

5. Create saved cards management:
GET /api/v1/users/[id]/payment-methods
POST /api/v1/users/[id]/payment-methods
DELETE /api/v1/users/[id]/payment-methods/[pmId]
```

**Deliverables:**
- [ ] Stripe configured
- [ ] PaymentCollectionModal
- [ ] Card-not-present support
- [ ] Saved cards management

---

### Day 19 (3 hours) - Driver Assignment Part 1

**Objectives:**
1. Create driver availability query
2. Create conflict detection logic
3. Build driver list API

**Claude Code Prompt:**
```
Create driver assignment backend:

1. Driver availability service (/lib/services/drivers.ts):
- getAvailableDrivers(datetime: Date, vehicleType: VehicleType, duration: number)
  - Returns drivers who:
    - Have status ONLINE or will be ONLINE at that time
    - Have a vehicle matching vehicleType
    - Are not already assigned to a trip overlapping that time
  - For each driver, include:
    - Current status
    - Current location (if online)
    - Vehicle info
    - Rating
    - Today's trip count
    - Next scheduled trip (if any)
    - Conflict info (if any)

2. Conflict detection:
- checkDriverConflict(driverId: string, startTime: Date, endTime: Date)
  - Check if driver has any trips during that window
  - Include buffer time (30 min before/after)
  - Return: { hasConflict, conflictingTrips: Trip[] }
  - For each conflict, show: time, pickup, dropoff

3. API endpoints:
GET /api/v1/drivers/available
Query params: datetime, vehicleType, tripDuration
Returns: { drivers: DriverWithAvailability[] }

GET /api/v1/drivers/[id]/conflicts
Query params: startTime, endTime
Returns: { hasConflict, conflicts: Trip[] }

GET /api/v1/drivers/[id]/schedule
Query params: date
Returns: { trips: Trip[] }

4. Scoring algorithm for driver suggestions:
- Proximity to pickup (if location known)
- Rating
- Trips completed today (load balancing)
- Last trip end location → pickup distance
```

**Deliverables:**
- [ ] Driver availability service
- [ ] Conflict detection
- [ ] API endpoints
- [ ] Scoring algorithm

---

### Day 20 (3 hours) - Driver Assignment Part 2

**Objectives:**
1. Create driver assignment modal UI
2. Show conflicts and schedule
3. Implement assignment

**Claude Code Prompt:**
```
Create driver assignment UI:

1. DriverAssignmentModal component:
Props: tripId, trip (pickup, time, vehicle type), onAssign, onCancel

2. Layout:
- Trip summary at top (time, pickup→dropoff, vehicle needed)
- Search/filter bar:
  - Search by driver name
  - Filter by status (online/all)
  - Filter by vehicle type
- Driver list (scrollable):
  - DriverAssignmentRow for each

3. DriverAssignmentRow component:
- Avatar + name + rating (stars)
- Current status badge
- Vehicle info (make, model, type icons)
- Availability indicator:
  - ✅ "Available" (green)
  - ⚠️ "Has trip at 10:00 AM" (amber) - show conflict
  - ❌ "On trip until 11:00 AM" (red)
- "View Schedule" button (expands inline)
- "Assign" button

4. Schedule inline expansion:
- Shows driver's trips for that day
- Timeline format
- Highlight the proposed trip time slot
- Show where new trip would fit

5. Assignment flow:
- Click "Assign"
- If conflict: show warning modal with details
  - "Driver has another trip. Assign anyway?"
- Confirm → POST /api/v1/trips/[id]/assign
- Success → close modal, show toast
- Trip status changes to ASSIGNED

6. API:
POST /api/v1/trips/[id]/assign
Body: { driverId }
- Validates driver and trip
- Updates trip with driver
- Creates TripStatusHistory
- Sends notification to driver (placeholder for now)
```

**Deliverables:**
- [ ] DriverAssignmentModal
- [ ] Driver list with availability
- [ ] Conflict warnings
- [ ] Assignment working

---

## Week 5 Goals
- Rides list and detail pages
- Patient management
- SMS notifications setup

---

### Day 21 (3 hours) - Rides List Page

**Objectives:**
1. Create rides list with filters
2. Implement search and status filters
3. Add pagination

**Claude Code Prompt:**
```
Create rides list at /dispatcher/rides:

1. Page structure:
- PageHeader: "Rides" title, "New Ride" button
- Filter bar:
  - Search input (patient name, ride number)
  - Status filter (multi-select dropdown)
  - Date range picker
  - Driver filter (dropdown)
  - "Clear filters" button
- DataTable with rides
- Pagination

2. Table columns:
- Ride # (clickable → detail page)
- Status (StatusBadge)
- Date/Time
- Patient (name, phone on hover)
- Pickup (truncated address)
- Dropoff (truncated address)
- Driver (avatar + name, or "Unassigned")
- Total ($XX.XX)
- Actions dropdown:
  - View Details
  - Edit
  - Assign Driver (if unassigned)
  - Cancel

3. API endpoint:
GET /api/v1/trips
Query params: search, status[], dateFrom, dateTo, driverId, page, limit
Returns: { trips, total, page, totalPages }

4. Features:
- Click row to go to detail page
- Quick status update from row (dropdown)
- Bulk actions checkbox (future)
- Export to CSV button
- Loading skeleton
- Empty state if no rides

5. Tabs at top:
- All | Today | Upcoming | Completed | Cancelled
- Each is a pre-filtered view
```

**Deliverables:**
- [ ] Rides list page
- [ ] Filters working
- [ ] API endpoint with pagination
- [ ] Status tabs

---

### Day 22 (3 hours) - Ride Detail Page

**Objectives:**
1. Create ride detail page
2. Show all ride information
3. Status timeline
4. Action buttons

**Claude Code Prompt:**
```
Create ride detail at /dispatcher/rides/[id]:

1. Page layout (two columns on desktop):
Left column (2/3 width):
- Ride header: # and status badge
- Trip info card:
  - Pickup: address, contact, instructions, time
  - Dropoff: address, contact, instructions, ETA
  - Map showing route (small)
- Patient info card:
  - Name, phone, email
  - Medical needs icons
  - Emergency contact
  - "View full profile" link
- Driver info card (if assigned):
  - Avatar, name, phone, rating
  - Vehicle: make, model, color, plate
  - "Reassign" button
- Notes section:
  - Patient notes
  - Driver notes
  - Internal notes (editable)

Right column (1/3 width):
- Status card:
  - Current status (large badge)
  - Quick status buttons (if driver role would update)
- Price breakdown card (collapsible)
- Payment status card:
  - Status badge
  - "Collect Payment" button if pending
  - Transaction ID if paid
- Status timeline (vertical):
  - Each status change with time and who changed it

2. Action bar (sticky at bottom on mobile):
- "Edit Ride" button
- "Assign Driver" button (if not assigned)
- "Cancel Ride" button (destructive)
- "Print" button (opens print view)

3. API:
GET /api/v1/trips/[id]
- Returns full trip with relations (patient, driver, statusHistory)

4. Handle cancelled/completed states:
- Show greyed out
- No edit actions
- Show cancellation reason if cancelled
```

**Deliverables:**
- [ ] Ride detail page
- [ ] All sections displaying
- [ ] Status timeline
- [ ] Actions working

---

### Day 23 (3 hours) - Patient Management

**Objectives:**
1. Create patients list page
2. Create patient detail page
3. Create/edit patient forms

**Claude Code Prompt:**
```
Create patient management:

1. Patients list at /dispatcher/patients:
- Search by name, phone, email
- Table columns:
  - Name (clickable)
  - Phone
  - Medical needs (icons)
  - Total rides
  - Last ride date
  - Actions (View, Book Ride)
- "Add Patient" button in header

2. Patient detail at /dispatcher/patients/[id]:
- Header: name, quick actions
- Tabs:
  - Overview: personal info, medical profile, emergency contact
  - Rides: list of all rides (paginated)
  - Saved Addresses: list with edit/delete
  - Payment Methods: list with edit/delete
  - Notes: internal notes about patient

3. Edit patient modal:
- Personal info section
- Medical profile section
- Emergency contact section
- Validation with Zod

4. Add patient page at /dispatcher/patients/new:
- Full form (similar to edit)
- After save: redirect to patient detail

5. API endpoints:
GET /api/v1/patients - List with search/pagination
GET /api/v1/patients/[id] - Full patient detail
POST /api/v1/patients - Create
PUT /api/v1/patients/[id] - Update
GET /api/v1/patients/[id]/rides - Patient's rides
POST /api/v1/patients/[id]/addresses - Add address
DELETE /api/v1/patients/[id]/addresses/[addressId] - Remove address
```

**Deliverables:**
- [ ] Patients list page
- [ ] Patient detail page
- [ ] Create/edit forms
- [ ] API endpoints

---

### Day 24 (3 hours) - SMS Notifications Part 1

**Objectives:**
1. Set up Twilio integration
2. Create notification service
3. Create SMS templates

**Claude Code Prompt:**
```
Set up SMS notifications:

1. Twilio setup:
- Install twilio package
- Create Twilio client utility
- Environment variables for credentials

2. Create notification service (/lib/services/notifications.ts):
- sendSMS(to: string, message: string): Promise<boolean>
- sendBookingConfirmation(trip: Trip): Promise<void>
- sendDriverAssigned(trip: Trip): Promise<void>
- sendDriverOnWay(trip: Trip): Promise<void>
- sendDriverArrived(trip: Trip): Promise<void>
- sendTripCompleted(trip: Trip): Promise<void>
- sendTripCancelled(trip: Trip, reason: string): Promise<void>
- sendReminder(trip: Trip, hoursUntil: number): Promise<void>

3. SMS templates (store in database for editability):
Create NotificationTemplate model:
- id, type (enum), channel (SMS/EMAIL), subject (for email), body
- Variables: {patientName}, {tripNumber}, {driverName}, {pickupTime}, etc.

Default templates:
- BOOKING_CONFIRMATION: "Your ride {tripNumber} is confirmed for {pickupDate} at {pickupTime}. Pickup: {pickupAddress}. Questions? Call {companyPhone}"
- DRIVER_ASSIGNED: "Your driver {driverName} will pick you up in a {vehicleColor} {vehicleMake} {vehicleModel} (plate: {licensePlate})"
- DRIVER_ON_WAY: "Your driver is on the way! ETA: {eta} minutes"
- DRIVER_ARRIVED: "Your driver has arrived at {pickupAddress}. Please come out when ready."
- TRIP_COMPLETED: "Ride complete! Total: ${totalFare}. Thank you for riding with us."
- TRIP_CANCELLED: "Your ride {tripNumber} has been cancelled. {cancellationReason}"
- REMINDER_24H: "Reminder: You have a ride tomorrow at {pickupTime}. Reply HELP for support."
- REMINDER_1H: "Reminder: Your ride is in 1 hour at {pickupTime}. Driver: {driverName}"

4. Create notification log:
Create NotificationLog model:
- tripId, userId, channel, type, content, status, sentAt, errorMessage
```

**Deliverables:**
- [ ] Twilio configured
- [ ] Notification service
- [ ] SMS templates in database
- [ ] Notification logging

---

### Day 25 (3 hours) - SMS Notifications Part 2

**Objectives:**
1. Trigger notifications on status changes
2. Create driver notifications
3. Test SMS flow

**Claude Code Prompt:**
```
Complete SMS notification system:

1. Hook notifications into trip status changes:
- When trip created → send BOOKING_CONFIRMATION to patient
- When driver assigned → send DRIVER_ASSIGNED to patient, send NEW_TRIP to driver
- When status → DRIVER_ON_WAY → send DRIVER_ON_WAY to patient
- When status → DRIVER_ARRIVED → send DRIVER_ARRIVED to patient
- When status → COMPLETED → send TRIP_COMPLETED to patient
- When trip cancelled → send TRIP_CANCELLED to patient and driver

2. Driver notification templates:
- NEW_TRIP: "New ride assigned: {pickupTime} at {pickupAddress}. Patient: {patientName}. Tap to view details."
- TRIP_CANCELLED_DRIVER: "Ride {tripNumber} at {pickupTime} has been cancelled."
- REMINDER_DRIVER: "Reminder: Pickup at {pickupTime} - {pickupAddress}. Patient: {patientName}, {patientPhone}"

3. Create notification preferences:
Add to User model:
- smsNotificationsEnabled (boolean, default true)
- emailNotificationsEnabled (boolean, default true)
- reminderHoursBefore (int, default 24)

Check preferences before sending.

4. Create manual notification sending:
- Button on ride detail: "Send Reminder"
- Opens modal to select template
- Preview before sending
- Log the send

5. Create API endpoints:
POST /api/v1/trips/[id]/notify
Body: { type: 'REMINDER_24H' | 'CUSTOM', customMessage?: string }

GET /api/v1/trips/[id]/notifications
Returns: notification history for this trip

6. Error handling:
- Retry failed sends (3 attempts)
- Log all failures
- Don't block trip actions if notification fails
```

**Deliverables:**
- [ ] Auto-notifications on status change
- [ ] Driver notifications
- [ ] Manual notification sending
- [ ] Notification history

---

## Week 6 Goals
- Driver status updates
- Finish dispatcher portal
- Basic admin functions

---

### Day 26 (3 hours) - Driver Status Updates API

**Objectives:**
1. Create status update endpoints
2. Create status update service
3. Add location update endpoint

**Claude Code Prompt:**
```
Create trip status update system:

1. Status update service (/lib/services/tripStatus.ts):
- updateStatus(tripId: string, newStatus: TripStatus, userId: string, notes?: string)
  - Validate status transition is allowed
  - Update trip status
  - Create TripStatusHistory entry
  - Trigger appropriate notifications
  - Update actualPickupTime/actualDropoffTime if relevant
  - Return updated trip

2. Valid status transitions:
PENDING → CONFIRMED, CANCELLED
CONFIRMED → ASSIGNED, CANCELLED
ASSIGNED → DRIVER_ON_WAY, CANCELLED
DRIVER_ON_WAY → DRIVER_ARRIVED, CANCELLED
DRIVER_ARRIVED → IN_PROGRESS, NO_SHOW, CANCELLED
IN_PROGRESS → COMPLETED, CANCELLED
(COMPLETED, CANCELLED, NO_SHOW are terminal states)

3. API endpoints:
PUT /api/v1/trips/[id]/status
Body: { status, notes }
- Validates caller has permission (driver for their trips, dispatcher for all)
- Validates transition
- Returns updated trip

POST /api/v1/drivers/location
Body: { latitude, longitude, heading }
- Updates driver's current location
- Used for tracking (will build real-time later)

4. When each status is set:
- DRIVER_ON_WAY: record departureTime
- DRIVER_ARRIVED: send notification
- IN_PROGRESS: record actualPickupTime
- COMPLETED: record actualDropoffTime, trigger payment capture
- CANCELLED: record cancellationTime, handle refund/fee

5. Add to DriverProfile:
- lastLocationLatitude
- lastLocationLongitude
- lastLocationHeading
- lastLocationUpdatedAt
```

**Deliverables:**
- [ ] Status update service
- [ ] Valid transitions enforced
- [ ] API endpoints
- [ ] Location update endpoint

---

### Day 27 (3 hours) - Driver Availability View

**Objectives:**
1. Create driver availability page
2. Show today's assignments per driver
3. Quick driver assignment from list

**Claude Code Prompt:**
```
Create driver availability view at /dispatcher/drivers:

1. Page layout:
- PageHeader: "Driver Availability", date picker for selected day
- Filter bar:
  - Search by driver name
  - Filter by status (Online, Offline, All)
  - Filter by vehicle type
- Driver cards grid or list

2. DriverAvailabilityCard for each driver:
- Header: avatar, name, status badge
- Vehicle info row: type icons, current vehicle
- Today's stats: X rides, $XXX earned
- Schedule preview:
  - Timeline showing today's trips
  - Time blocks for each assigned ride
  - Gaps show availability
- Action buttons:
  - "View Full Schedule"
  - "Assign to Ride" (if ride selected)

3. Create a ride context:
- If dispatcher came here from a ride that needs assignment
- Show banner at top: "Assigning driver for Ride #XXX"
- Highlight compatible drivers
- "Assign" button on each compatible driver

4. Driver detail modal (click on driver):
- Full schedule for selected day
- List of all trips with times
- Contact info
- Performance stats

5. API:
GET /api/v1/drivers
Query: date, status, vehicleType, search
Returns: drivers with today's schedule

GET /api/v1/drivers/[id]/schedule
Query: date
Returns: { driver, trips: Trip[], stats: { ridesCount, earnings } }
```

**Deliverables:**
- [ ] Driver availability page
- [ ] Driver cards with schedules
- [ ] Quick assignment flow
- [ ] Driver detail modal

---

### Day 28 (3 hours) - Admin Dashboard

**Objectives:**
1. Create admin dashboard page
2. Add key metrics
3. Add recent activity feed

**Claude Code Prompt:**
```
Create admin dashboard at /admin:

1. Page structure:
- PageHeader: "Admin Dashboard", date range selector
- Stats grid (2 rows × 4 cols):
  Row 1:
  - Today's Rides (count, vs yesterday %)
  - Active Rides (in-progress count)
  - Revenue Today ($, vs yesterday %)
  - Completed Today (count)
  Row 2:
  - This Week's Rides (count)
  - Week Revenue ($)
  - Active Drivers (online count)
  - Pending Payments (count, alert if > 0)

2. Charts row (using Recharts):
- Rides over time (line chart, last 7 days)
- Revenue over time (bar chart, last 7 days)

3. Two-column bottom section:
Left: Recent Rides
- Last 10 rides
- Quick info: time, patient, status, driver
- "View All" link

Right: Activity Feed
- Last 15 activities
- Format: "{User} {action} {subject} - {time ago}"
- Examples:
  - "John D. booked ride #TR-123 - 5 min ago"
  - "Driver Mike updated status to In Progress - 10 min ago"
  - "Payment received for ride #TR-122 - 1 hour ago"

4. Quick Actions card:
- "Create Ride" button
- "View All Rides" button
- "Manage Drivers" button
- "View Reports" button

5. API endpoint:
GET /api/v1/admin/dashboard
Query: dateFrom, dateTo
Returns: {
  stats: { todayRides, activeRides, todayRevenue, ... },
  ridesChart: [{ date, count }],
  revenueChart: [{ date, amount }],
  recentRides: Trip[],
  recentActivity: Activity[]
}
```

**Deliverables:**
- [ ] Admin dashboard page
- [ ] Stats cards
- [ ] Charts
- [ ] Activity feed

---

### Day 29 (3 hours) - Admin User Management

**Objectives:**
1. Create users list page
2. Create/edit user forms
3. Role and status management

**Claude Code Prompt:**
```
Create user management at /admin/users:

1. Users list page:
- Tabs: All | Staff | Drivers | Patients | Facilities
- Search by name, email, phone
- Filter by role, status
- Table columns:
  - Name (clickable)
  - Email
  - Phone
  - Role (RoleBadge)
  - Status (badge)
  - Created date
  - Last login
  - Actions

2. User detail modal (click on user):
- Personal info
- Role and status (editable for admin)
- Quick actions:
  - Reset password
  - Suspend/Activate
  - Impersonate (super admin only)

3. Create user drawer:
- Select role first (changes form fields)
- Personal info
- If Driver: license info, vehicle assignment
- If Facility Staff: facility assignment
- Password (auto-generate or set)
- Send welcome email checkbox

4. Edit user:
- Same as create, pre-filled
- Can change role (with confirmation)
- Can reset password

5. API endpoints:
GET /api/v1/admin/users - List with filters
POST /api/v1/admin/users - Create
PUT /api/v1/admin/users/[id] - Update
PUT /api/v1/admin/users/[id]/status - Change status
POST /api/v1/admin/users/[id]/reset-password - Reset password

6. Audit logging:
- Log all user management actions
- Who changed what, when
```

**Deliverables:**
- [ ] Users list with tabs
- [ ] User detail modal
- [ ] Create/edit forms
- [ ] Role management

---

### Day 30 (3 hours) - Admin Pricing Settings

**Objectives:**
1. Create pricing settings page
2. Editable pricing configuration
3. Preview calculations

**Claude Code Prompt:**
```
Create pricing settings at /admin/settings/pricing:

1. Page layout:
- PageHeader: "Pricing Configuration"
- Active config indicator

2. Base Pricing card:
- Base Fare: $ input
- Per Mile Rate: $ input
- Per Minute Rate: $ input
- Minimum Fare: $ input
- All with inline edit

3. Accessibility Surcharges card:
- Wheelchair: $ input
- Stretcher: $ input
- Oxygen Equipment: $ input
- Bariatric Vehicle: $ input

4. Time Multipliers card:
- Rush Hour Morning: toggle + multiplier + time range
- Rush Hour Evening: toggle + multiplier + time range
- Weekend: toggle + multiplier
- Holiday: toggle + multiplier
- Late Night: toggle + multiplier + time range

5. Quote Preview card:
- Mini form: distance, duration, options
- Shows calculated quote in real-time
- Helps verify settings are correct

6. Save button (sticky at bottom):
- "Save Changes" (shows unsaved indicator)
- Confirmation modal
- Updates active config

7. History/Versions (future):
- List of past configs
- Can restore previous

8. API:
GET /api/v1/admin/pricing/active - Get current config
PUT /api/v1/admin/pricing/active - Update config

Use React Hook Form for the entire settings form.
Debounce the preview calculation.
```

**Deliverables:**
- [ ] Pricing settings page
- [ ] All rates editable
- [ ] Time multipliers
- [ ] Quote preview
- [ ] Save functionality

---

# End of Detailed Daily Plan (Days 1-30)

## Remaining Phases Overview (Days 31-100)

### Phase 3: Driver Portal (Days 31-40)
- Day 31: Driver dashboard layout
- Day 32: Driver's rides list
- Day 33: Active ride view
- Day 34: Status update buttons
- Day 35: Driver profile page
- Day 36: Driver timesheet view
- Day 37: Clock in/out functionality
- Day 38: Driver earnings page
- Day 39: Driver notifications
- Day 40: Driver mobile optimization

### Phase 4: Admin & Settings (Days 41-50)
- Day 41: Vehicles management
- Day 42: Facilities management
- Day 43: Facility detail and staff
- Day 44: Reports page - basic
- Day 45: Reports - trip exports
- Day 46: Reports - revenue exports
- Day 47: Notification templates admin
- Day 48: System settings page
- Day 49: Audit log viewer
- Day 50: Admin polish and fixes

### Phase 5: Billing & Invoicing (Days 51-60)
- Day 51: Invoice model and generation
- Day 52: Invoice creation service
- Day 53: Invoice list page
- Day 54: Invoice detail and PDF
- Day 55: Invoice email sending
- Day 56: Payment tracking
- Day 57: QuickBooks integration setup
- Day 58: QuickBooks sync
- Day 59: Overdue payment alerts
- Day 60: Billing dashboard

### Phase 6: Operations Manager (Days 61-70)
- Day 61: Operations dashboard
- Day 62: Live map view
- Day 63: Schedule calendar (full)
- Day 64: Drag-drop scheduling
- Day 65: Conflict visualization
- Day 66: Timesheets list
- Day 67: Timesheet approval
- Day 68: Shift management
- Day 69: Route overview
- Day 70: Operations polish

### Phase 7: Facility Portal (Days 71-80)
- Day 71: Facility layout and nav
- Day 72: Facility dashboard
- Day 73: Patient roster
- Day 74: Book ride for patient
- Day 75: Facility's rides list
- Day 76: Ride tracking
- Day 77: Facility invoices
- Day 78: Facility staff management
- Day 79: Facility settings
- Day 80: Facility polish

### Phase 8: Patient & Family (Days 81-90)
- Day 81: Patient registration flow
- Day 82: Patient dashboard
- Day 83: Patient book ride
- Day 84: Patient ride tracking
- Day 85: Patient profile
- Day 86: Family member linking
- Day 87: Family dashboard
- Day 88: Family book for patient
- Day 89: Payment methods
- Day 90: Patient/family polish

### Phase 9: Polish & Launch (Days 91-100)
- Day 91: Performance optimization
- Day 92: Error handling polish
- Day 93: Loading states everywhere
- Day 94: Mobile responsiveness audit
- Day 95: Accessibility audit
- Day 96: Security review
- Day 97: Production environment setup
- Day 98: Data migration plan
- Day 99: User acceptance testing
- Day 100: Launch preparation

---

## Key Milestones

| Milestone | Day | Week | What's Working |
|-----------|-----|------|----------------|
| **First Login** | 7 | 2 | Auth system complete |
| **First Ride Booked** | 17 | 4 | Can create rides with pricing |
| **First Payment** | 18 | 4 | Stripe payments working |
| **First Driver Assignment** | 20 | 4 | Full booking→assignment flow |
| **Dispatcher MVP** | 30 | 6 | Dispatchers can work |
| **Driver MVP** | 40 | 8 | Drivers can use the app |
| **Admin MVP** | 50 | 10 | Admins can manage |
| **Invoicing Working** | 60 | 12 | Facilities can be billed |
| **Operations MVP** | 70 | 14 | Ops managers can schedule |
| **Facility MVP** | 80 | 16 | Facilities can self-serve |
| **Patient MVP** | 90 | 18 | Patients can self-book |
| **Launch Ready** | 100 | 20 | Production deployment |

---

## After Launch (Ongoing)

- Real-time GPS tracking (WebSocket)
- Mobile apps (React Native)
- Loyalty program
- Advanced analytics
- Route optimization
- Recurring rides automation
- Multi-region support

---

*This roadmap is your guide. Adjust as needed, but stick to the phase order.*
