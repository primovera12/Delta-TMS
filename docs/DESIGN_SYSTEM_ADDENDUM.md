# Design System - ADDENDUM

> **Supplements:** DESIGN_SYSTEM.md
> **Additional Components:** 35+
> **Total System Components:** 90+

This addendum defines additional UI components needed for the complete platform.

---

## Additional Form Components

### F.11 SearchableSelect

Select dropdown with search/filter capability.

```tsx
<SearchableSelect
  options={patients}
  value={selectedPatient}
  onChange={setSelectedPatient}
  placeholder="Search patients..."
  searchPlaceholder="Type to filter..."
  renderOption={(patient) => (
    <div className="flex items-center gap-2">
      <Avatar size="sm" name={patient.name} />
      <div>
        <div className="font-medium">{patient.name}</div>
        <div className="text-sm text-muted">{patient.phone}</div>
      </div>
    </div>
  )}
/>
```

---

### F.12 MultiSelect

Select multiple options with chips display.

```tsx
<MultiSelect
  options={[
    { value: "wheelchair", label: "Wheelchair" },
    { value: "oxygen", label: "Oxygen" },
    { value: "stretcher", label: "Stretcher" }
  ]}
  value={selectedNeeds}
  onChange={setSelectedNeeds}
  placeholder="Select medical needs..."
/>
```

---

### F.13 DateRangePicker

Select a date range (for reports, filters).

```tsx
<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onChange={({ start, end }) => {}}
  presets={[
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Custom", value: "custom" }
  ]}
/>
```

---

### F.14 TimeSlotPicker

Pick from available time slots (visual grid).

```tsx
<TimeSlotPicker
  date={selectedDate}
  slots={[
    { time: "8:00 AM", available: true },
    { time: "8:30 AM", available: true },
    { time: "9:00 AM", available: false, reason: "Rush hour" },
    { time: "9:30 AM", available: true }
  ]}
  value={selectedTime}
  onChange={setSelectedTime}
  interval={30}
/>
```

---

### F.15 SignatureCapture

Canvas for capturing signatures.

```tsx
<SignatureCapture
  width={400}
  height={150}
  onCapture={(dataUrl, name) => {}}
  nameRequired={true}
  placeholder="Sign here"
/>
```

**Features:**
- Touch and mouse drawing
- Clear button
- Name input field
- Save as PNG data URL

---

### F.16 FileUpload

Drag-and-drop file upload area.

```tsx
<FileUpload
  accept={["image/*", "application/pdf"]}
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={(files) => {}}
  multiple={false}
>
  <UploadIcon />
  <p>Drag & drop or click to upload</p>
  <p className="text-sm text-muted">Max 5MB, PDF or image</p>
</FileUpload>
```

---

### F.17 RatingInput

Star rating input component.

```tsx
<RatingInput
  value={rating}
  onChange={setRating}
  max={5}
  size="lg"
  allowHalf={false}
/>
```

---

## Additional Data Display Components

### D.7 VehicleCard

Display vehicle information.

```tsx
<VehicleCard
  vehicle={{
    id: "uuid",
    make: "Ford",
    model: "Transit",
    year: 2023,
    licensePlate: "ABC-1234",
    type: "WHEELCHAIR_ACCESSIBLE",
    status: "in_service",
    driver: { name: "Mike Johnson" },
    capabilities: ["wheelchair", "lift", "oxygen"]
  }}
  onView={() => {}}
  onEdit={() => {}}
  showDriver={true}
/>
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🚐 Ford Transit 2023      [In Service] │
│ License: ABC-1234                       │
│ Type: Wheelchair Accessible             │
│ ♿ 🛗 🫁                                │
│ Driver: Mike Johnson                    │
│                    [View] [Edit]        │
└─────────────────────────────────────────┘
```

---

### D.8 FacilityCard

Display facility information.

```tsx
<FacilityCard
  facility={{
    name: "Sunrise Nursing Home",
    type: "nursing_home",
    address: "123 Care St, Houston TX",
    phone: "(713) 555-1234",
    patientCount: 45,
    activeRides: 3,
    billingType: "MONTHLY_INVOICE"
  }}
  onView={() => {}}
  onBook={() => {}}
/>
```

---

### D.9 PaymentMethodCard

Display saved payment method.

```tsx
<PaymentMethodCard
  method={{
    id: "uuid",
    type: "CARD",
    brand: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2027,
    isDefault: true
  }}
  onSetDefault={() => {}}
  onDelete={() => {}}
  selectable={true}
  selected={isSelected}
  onSelect={() => {}}
/>
```

---

### D.10 LoyaltyStatusCard

Display loyalty program status.

```tsx
<LoyaltyStatusCard
  account={{
    tier: "GOLD",
    currentPoints: 4500,
    lifetimePoints: 12000,
    nextTier: "PLATINUM",
    nextTierThreshold: 15000,
    referralCode: "JOHN2026"
  }}
  onRedeem={() => {}}
  onViewHistory={() => {}}
/>
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🏆 GOLD Member                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 4,500 points                            │
│                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ 12K/15K to Plat │
│                                         │
│ Referral Code: JOHN2026  [Copy]         │
│              [Redeem Points]            │
└─────────────────────────────────────────┘
```

---

### D.11 DocumentCard

Display uploaded document with expiry.

```tsx
<DocumentCard
  document={{
    type: "license",
    name: "Driver's License",
    fileUrl: "/uploads/license.pdf",
    uploadedAt: "2025-12-01",
    expiryDate: "2026-06-15",
    status: "verified"
  }}
  onView={() => {}}
  onReplace={() => {}}
  onDelete={() => {}}
  showExpiry={true}
/>
```

**Expiry States:**
- Valid (green): > 90 days to expiry
- Expiring Soon (yellow): 30-90 days
- Expiring (orange): < 30 days
- Expired (red): Past expiry

---

### D.12 ExpiryAlertBadge

Badge showing expiry warning.

```tsx
<ExpiryAlertBadge
  expiryDate="2026-02-15"
  type="license" // "license" | "insurance" | "certification"
  showDaysRemaining={true}
/>
```

**Display:**
- `⚠️ Expires in 30 days`
- `🔴 Expired`
- `✅ Valid` (if > 90 days)

---

### D.13 TripSummaryCard

Compact trip card for lists.

```tsx
<TripSummaryCard
  trip={{
    tripNumber: "TR-20260115-001",
    scheduledTime: "9:00 AM",
    patient: "John Smith",
    pickup: "123 Home St",
    dropoff: "Memorial Hospital",
    status: "ASSIGNED",
    driver: "Mike J.",
    tripType: "ROUND_TRIP"
  }}
  onClick={() => {}}
  showDriver={true}
  compact={false}
/>
```

---

### D.14 ETADisplay

Show estimated time of arrival.

```tsx
<ETADisplay
  eta="2026-01-15T09:45:00Z"
  status="on_time" // "on_time" | "delayed" | "early"
  delayMinutes={0}
  showCountdown={true}
/>
```

**Display:**
- On time: `ETA: 9:45 AM ✓`
- Delayed: `ETA: 10:00 AM (15 min delay) ⚠️`
- Early: `ETA: 9:30 AM (15 min early) ✓`

---

### D.15 DistanceDisplay

Show distance and duration.

```tsx
<DistanceDisplay
  miles={12.5}
  minutes={35}
  showBoth={true}
  size="md"
/>
```

**Display:** `12.5 mi • 35 min`

---

### D.16 QuoteExpiryTimer

Countdown timer for quote validity.

```tsx
<QuoteExpiryTimer
  expiresAt="2026-01-15T10:30:00Z"
  onExpired={() => {}}
  warningThreshold={300} // 5 minutes
/>
```

**Display:**
- Normal: `Quote valid for 25:30`
- Warning: `⚠️ Quote expires in 4:30`
- Expired: `Quote expired - refresh for new price`

---

### D.17 DriverScheduleTimeline

Visual timeline of driver's day.

```tsx
<DriverScheduleTimeline
  date="2026-01-15"
  trips={[
    { id: "1", startTime: "8:00", endTime: "9:30", patient: "John S.", status: "completed" },
    { id: "2", startTime: "10:00", endTime: "11:30", patient: "Mary J.", status: "in_progress" },
    { id: "3", startTime: "14:00", endTime: "15:30", patient: "Bob K.", status: "scheduled" }
  ]}
  currentTime="10:45"
  onTripClick={(tripId) => {}}
/>
```

**Visual:**
```
8AM   9AM   10AM   11AM   12PM   1PM   2PM   3PM
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
█████████   ████████████        ███████████
John S.     Mary J. ◄ NOW       Bob K.
```

---

### D.18 EmergencyContactCard

Display emergency contact info.

```tsx
<EmergencyContactCard
  contact={{
    name: "Jane Smith",
    relationship: "Daughter",
    phone: "(713) 555-9876"
  }}
  isPrimary={true}
  onCall={() => {}}
  onEdit={() => {}}
/>
```

---

### D.19 NotificationItem

Single notification in a list.

```tsx
<NotificationItem
  notification={{
    id: "uuid",
    type: "driver_assigned",
    title: "Driver Assigned",
    message: "Mike J. has been assigned to trip TR-001",
    timestamp: "2026-01-15T09:30:00Z",
    read: false,
    actionUrl: "/dispatcher/rides/uuid"
  }}
  onClick={() => {}}
  onDismiss={() => {}}
/>
```

---

## Additional Navigation Components

### N.6 Stepper

Multi-step progress indicator.

```tsx
<Stepper
  steps={[
    { label: "Patient", completed: true },
    { label: "Pickup", completed: true },
    { label: "Dropoff", current: true },
    { label: "Schedule", completed: false },
    { label: "Review", completed: false }
  ]}
  orientation="horizontal" // or "vertical"
/>
```

---

### N.7 ActionMenu

Three-dot dropdown menu for row actions.

```tsx
<ActionMenu
  items={[
    { label: "View Details", icon: Eye, onClick: () => {} },
    { label: "Edit", icon: Edit, onClick: () => {} },
    { type: "separator" },
    { label: "Cancel Ride", icon: X, onClick: () => {}, variant: "destructive" }
  ]}
/>
```

---

### N.8 FilterPanel

Collapsible filter sidebar/panel.

```tsx
<FilterPanel
  open={isOpen}
  onClose={() => {}}
  onApply={(filters) => {}}
  onReset={() => {}}
>
  <FilterSection title="Status">
    <CheckboxGroup options={statusOptions} />
  </FilterSection>
  <FilterSection title="Date Range">
    <DateRangePicker />
  </FilterSection>
  <FilterSection title="Vehicle Type">
    <CheckboxGroup options={vehicleOptions} />
  </FilterSection>
</FilterPanel>
```

---

### N.9 SortDropdown

Sort options dropdown.

```tsx
<SortDropdown
  options={[
    { value: "date_desc", label: "Newest First" },
    { value: "date_asc", label: "Oldest First" },
    { value: "patient_asc", label: "Patient A-Z" },
    { value: "status", label: "Status" }
  ]}
  value={sortOption}
  onChange={setSortOption}
/>
```

---

## Additional Action Components

### A.1 PhoneCallButton

Click-to-call button.

```tsx
<PhoneCallButton
  phone="+15551234567"
  label="Call Patient"
  size="sm"
/>
```

---

### A.2 SMSButton

Click-to-text button.

```tsx
<SMSButton
  phone="+15551234567"
  message="Your driver is on the way!"
  label="Send SMS"
/>
```

---

### A.3 CopyButton

Copy text to clipboard.

```tsx
<CopyButton
  text="TR-20260115-001"
  successMessage="Trip number copied!"
/>
```

---

### A.4 NavigationButton

Open navigation app (Google Maps/Waze).

```tsx
<NavigationButton
  destination={{ lat: 29.7604, lng: -95.3698 }}
  address="123 Main St, Houston TX"
  app="auto" // "google" | "apple" | "waze" | "auto"
/>
```

---

### A.5 ConfirmationDialog

Reusable confirmation modal.

```tsx
<ConfirmationDialog
  open={isOpen}
  onClose={() => {}}
  onConfirm={() => {}}
  title="Cancel Ride?"
  description="This will cancel the ride and may incur a cancellation fee."
  confirmLabel="Yes, Cancel Ride"
  cancelLabel="Keep Ride"
  variant="destructive"
/>
```

---

### A.6 DeleteConfirmation

Delete confirmation with type-to-confirm.

```tsx
<DeleteConfirmation
  open={isOpen}
  onClose={() => {}}
  onConfirm={() => {}}
  itemName="Standing Order SO-00001"
  typeToConfirm={true}
  confirmText="DELETE"
/>
```

---

## Map Components

### M.1 DriverLocationMarker

Driver marker on map.

```tsx
<DriverLocationMarker
  position={{ lat: 29.7604, lng: -95.3698 }}
  heading={45}
  status="on_trip"
  driver={{ name: "Mike J.", vehicle: "Ford Transit" }}
  onClick={() => {}}
/>
```

---

### M.2 StopMarker

Stop marker for multi-stop trips.

```tsx
<StopMarker
  position={{ lat: 29.7604, lng: -95.3698 }}
  stopOrder={1}
  stopType="PICKUP"
  status="COMPLETED"
  label="John Smith"
/>
```

**Colors:**
- Pickup: Blue
- Dropoff: Green
- Completed: Gray
- Current: Pulsing

---

### M.3 RoutePolyline

Route line between points.

```tsx
<RoutePolyline
  points={[
    { lat: 29.7604, lng: -95.3698 },
    { lat: 29.7700, lng: -95.3750 },
    { lat: 29.7893, lng: -95.3890 }
  ]}
  color="primary"
  dashed={false}
  animated={true}
/>
```

---

### M.4 ServiceAreaOverlay

Service area polygon overlay.

```tsx
<ServiceAreaOverlay
  polygon={geoJsonPolygon}
  fillColor="blue"
  fillOpacity={0.1}
  strokeColor="blue"
  strokeWidth={2}
/>
```

---

## Specialized Domain Components

### SD.1 VehicleTypeSelector

Visual vehicle type selection.

```tsx
<VehicleTypeSelector
  value="WHEELCHAIR_ACCESSIBLE"
  onChange={setVehicleType}
  options={[
    { value: "SEDAN", label: "Sedan", icon: Car, description: "Ambulatory patients" },
    { value: "WHEELCHAIR_ACCESSIBLE", label: "Wheelchair Van", icon: Wheelchair, description: "Standard wheelchair" },
    { value: "STRETCHER_VAN", label: "Stretcher Van", icon: Bed, description: "Stretcher transport" },
    { value: "BARIATRIC_VEHICLE", label: "Bariatric", icon: Scale, description: "Heavy-duty" }
  ]}
  showDescriptions={true}
/>
```

---

### SD.2 MedicalNeedsChecklist

Checkbox list for medical requirements.

```tsx
<MedicalNeedsChecklist
  value={{ wheelchair: true, oxygen: true, stretcher: false }}
  onChange={setMedicalNeeds}
  showIcons={true}
  showDescriptions={false}
/>
```

---

### SD.3 PatientSearchAutocomplete

Search and select patient with preview.

```tsx
<PatientSearchAutocomplete
  value={selectedPatient}
  onChange={setSelectedPatient}
  onAddNew={() => {}}
  showMedicalNeeds={true}
  showLastRide={true}
  placeholder="Search by name or phone..."
/>
```

**Dropdown Item:**
```
┌─────────────────────────────────────────┐
│ 👤 John Smith         ♿ 🫁            │
│    (713) 555-1234                       │
│    Last ride: Jan 10, 2026              │
└─────────────────────────────────────────┘
```

---

### SD.4 InvoiceLineItem

Single line item on invoice.

```tsx
<InvoiceLineItem
  item={{
    tripNumber: "TR-20260115-001",
    date: "Jan 15, 2026",
    patient: "John Smith",
    route: "Home → Hospital",
    amount: 85.50
  }}
  editable={false}
/>
```

---

### SD.5 TimesheetRow

Single row in timesheet.

```tsx
<TimesheetRow
  entry={{
    date: "Jan 15, 2026",
    clockIn: "7:00 AM",
    clockOut: "5:00 PM",
    breakMinutes: 60,
    totalHours: 9,
    trips: 8,
    miles: 145.5,
    status: "pending"
  }}
  onApprove={() => {}}
  onReject={() => {}}
  onEdit={() => {}}
/>
```

---

### SD.6 EarningsCard

Driver earnings summary card.

```tsx
<EarningsCard
  period="This Week"
  earnings={{
    gross: 1250.00,
    trips: 28,
    miles: 425,
    hours: 42,
    avgPerTrip: 44.64,
    avgPerHour: 29.76
  }}
  onViewDetails={() => {}}
/>
```

---

### SD.7 ShiftNoteCard

Dispatcher shift handoff note.

```tsx
<ShiftNoteCard
  note={{
    author: "Jane D.",
    shiftType: "Morning",
    date: "Jan 15, 2026",
    notes: "Mrs. Johnson's trip rescheduled to 2pm. Driver Mike called in sick.",
    urgentItems: "Need replacement driver for afternoon routes"
  }}
  onEdit={() => {}}
/>
```

---

## Component Count Summary

| Category | Base | Addendum | Total |
|----------|------|----------|-------|
| Core Components | 5 | 0 | 5 |
| Form Components | 10 | 10 | 20 |
| Data Display | 6 | 18 | 24 |
| Navigation | 5 | 4 | 9 |
| Feedback | 7 | 8 | 15 |
| Domain-Specific | 23 | 25 | 48 |
| Action Components | 0 | 6 | 6 |
| Map Components | 1 | 6 | 7 |
| System Components | 0 | 12 | 12 |
| **Total** | **56** | **89** | **145** |

---

## NEW: Emergency & Safety Components

### EmergencyAlertBanner

Full-width emergency alert displayed at top of dispatch screen.

```tsx
<EmergencyAlertBanner
  alert={{
    id: "em-001",
    type: "MEDICAL",
    driver: "Mike Johnson",
    patient: "John Smith",
    tripNumber: "TR-001",
    location: { lat: 29.76, lng: -95.36 },
    timestamp: new Date(),
    status: "ACTIVE"
  }}
  onAcknowledge={() => {}}
  onViewMap={() => {}}
  onCallDriver={() => {}}
/>
```

**States:**
- ACTIVE: Red pulsing, audio alarm
- ACKNOWLEDGED: Orange, handling indicator
- RESOLVED: Green, dismissible

---

### EmergencyButton

Driver app emergency trigger button.

```tsx
<EmergencyButton
  onPress={() => showEmergencyDialog()}
  size="lg"
  pulsing={false}
/>
```

---

### EmergencyTypeSelector

Emergency type selection during alert creation.

```tsx
<EmergencyTypeSelector
  selected={emergencyType}
  onSelect={setEmergencyType}
  options={[
    { type: "MEDICAL", icon: Heart, label: "Medical Emergency" },
    { type: "BREAKDOWN", icon: Car, label: "Vehicle Breakdown" },
    { type: "ACCIDENT", icon: AlertTriangle, label: "Accident" },
    { type: "SAFETY", icon: Shield, label: "Safety Concern" },
    { type: "PATIENT_DISTRESS", icon: User, label: "Patient Distress" }
  ]}
/>
```

---

## NEW: Inspection Components

### InspectionChecklist

Pre-trip/post-trip inspection checklist.

```tsx
<InspectionChecklist
  items={[
    { id: "tires", category: "Exterior", label: "Tires - tread & pressure", required: true },
    { id: "lights", category: "Exterior", label: "Lights - all working", required: true },
    { id: "lift", category: "Wheelchair", label: "Lift operates smoothly", required: true }
  ]}
  values={checklistValues}
  onChange={setChecklistValues}
  onAddNote={(itemId) => {}}
  onTakePhoto={(itemId) => {}}
/>
```

---

### InspectionSummary

Summary view of completed inspection.

```tsx
<InspectionSummary
  inspection={{
    id: "insp-001",
    type: "PRE_TRIP",
    vehicle: "Unit 15 - Ford Transit",
    inspector: "Mike Johnson",
    date: new Date(),
    status: "PASSED",
    passedItems: 18,
    failedItems: 0,
    odometerReading: 45230
  }}
  onViewDetails={() => {}}
/>
```

---

### IssueReportCard

Vehicle issue report card.

```tsx
<IssueReportCard
  issue={{
    id: "issue-001",
    category: "WHEELCHAIR_LIFT",
    severity: "HIGH",
    description: "Lift door not sealing properly",
    reportedBy: "Mike Johnson",
    reportedAt: new Date(),
    status: "OPEN",
    photos: ["url1", "url2"]
  }}
  onResolve={() => {}}
  onEscalate={() => {}}
/>
```

---

## NEW: Maintenance Components

### MaintenanceScheduleCard

Upcoming maintenance item.

```tsx
<MaintenanceScheduleCard
  item={{
    type: "OIL_CHANGE",
    vehicle: "Unit 15",
    dueDate: new Date(),
    dueMileage: 50000,
    currentMileage: 49500,
    estimatedCost: 75,
    urgency: "soon" // "ok" | "soon" | "overdue"
  }}
  onSchedule={() => {}}
/>
```

---

### MaintenanceRecordRow

Maintenance history record.

```tsx
<MaintenanceRecordRow
  record={{
    type: "BRAKE_SERVICE",
    date: new Date(),
    mileage: 45000,
    cost: 450,
    performedBy: "Joe's Auto Shop",
    notes: "Replaced front brake pads and rotors"
  }}
  onViewReceipt={() => {}}
/>
```

---

### MileageInput

Odometer reading input with photo capture.

```tsx
<MileageInput
  value={odometerReading}
  onChange={setOdometerReading}
  previousReading={45100}
  onTakePhoto={handlePhoto}
  photoUrl={photoUrl}
/>
```

---

## NEW: Payout Components

### PayoutSummaryCard

Driver weekly payout summary.

```tsx
<PayoutSummaryCard
  payout={{
    period: "Jan 8-14, 2026",
    tripEarnings: 1150,
    tips: 85,
    bonuses: 25,
    deductions: 0,
    netAmount: 1260,
    status: "PAID",
    paidDate: new Date()
  }}
  onViewDetails={() => {}}
/>
```

---

### EarningsBreakdown

Detailed earnings breakdown.

```tsx
<EarningsBreakdown
  earnings={[
    { type: "TRIP_BASE", amount: 800, trips: 25 },
    { type: "TRIP_MILEAGE", amount: 250, miles: 125 },
    { type: "TRIP_TIME", amount: 100, minutes: 400 },
    { type: "TIP", amount: 85, count: 12 },
    { type: "BONUS", amount: 25, description: "Perfect rating bonus" }
  ]}
  total={1260}
/>
```

---

### PayoutTimeline

Visual timeline of payout processing.

```tsx
<PayoutTimeline
  events={[
    { stage: "calculated", date: new Date(), completed: true },
    { stage: "processing", date: new Date(), completed: true },
    { stage: "sent", date: new Date(), completed: true },
    { stage: "deposited", date: null, completed: false, eta: "Jan 17" }
  ]}
/>
```

---

## NEW: Geofence Components

### GeofenceMapOverlay

Map overlay showing geofence boundaries.

```tsx
<GeofenceMapOverlay
  geofences={[
    { type: "PICKUP_APPROACH", center: pickup, radius: 500, color: "yellow" },
    { type: "PICKUP_ARRIVAL", center: pickup, radius: 50, color: "green" }
  ]}
  driverLocation={driverLocation}
/>
```

---

### GeofenceAlert

Geofence entry/exit alert.

```tsx
<GeofenceAlert
  type="PICKUP_APPROACH"
  message="Driver is 5 minutes away"
  timestamp={new Date()}
  dismissable
  onDismiss={() => {}}
/>
```

---

## NEW: Contract & Invoice Components

### ContractSummaryCard

Facility contract overview.

```tsx
<ContractSummaryCard
  contract={{
    facility: "Sunrise Nursing Home",
    pricingType: "VOLUME",
    discount: "10% (50+ trips/month)",
    billingCycle: "Monthly",
    paymentTerms: "Net 30",
    startDate: new Date("2025-01-01"),
    autoRenew: true
  }}
  onEdit={() => {}}
  onViewTrips={() => {}}
/>
```

---

### InvoiceStatusBadge

Invoice status with visual indicator.

```tsx
<InvoiceStatusBadge status="OVERDUE" daysOverdue={5} />
// Variations: DRAFT, SENT, VIEWED, PAID, OVERDUE, VOID
```

---

### PaymentReminderCard

Invoice payment reminder.

```tsx
<PaymentReminderCard
  invoice={{
    number: "INV-2026-001",
    facility: "Sunrise Nursing",
    amount: 1310.85,
    dueDate: new Date(),
    daysUntilDue: -5, // negative = overdue
    remindersSent: 2
  }}
  onSendReminder={() => {}}
  onMarkPaid={() => {}}
  onViewInvoice={() => {}}
/>
```

---

## NEW: Standing Order Components

### StandingOrderCard

Recurring schedule summary.

```tsx
<StandingOrderCard
  order={{
    id: "so-001",
    patient: "John Smith",
    schedule: "Mon, Wed, Fri at 8:00 AM",
    route: "Home → Dialysis Center",
    returnType: "Will-Call",
    status: "ACTIVE",
    nextTrip: new Date()
  }}
  onEdit={() => {}}
  onPause={() => {}}
  onViewTrips={() => {}}
/>
```

---

### StandingOrderCalendar

Calendar view of generated trips.

```tsx
<StandingOrderCalendar
  orderId="so-001"
  trips={generatedTrips}
  onSkipDate={(date) => {}}
  onRestoreDate={(date) => {}}
/>
```

---

## NEW: Bulk Booking Components

### BulkBookingWizard

Multi-patient booking wizard.

```tsx
<BulkBookingWizard
  step={currentStep}
  patients={selectedPatients}
  destination={destination}
  date={selectedDate}
  time={pickupTime}
  onAddPatient={handleAddPatient}
  onRemovePatient={handleRemovePatient}
  onSubmit={handleBulkBook}
/>
```

---

### BulkBookingProgress

Bulk booking processing progress.

```tsx
<BulkBookingProgress
  total={10}
  completed={7}
  failed={1}
  inProgress={2}
  errors={[
    { patient: "Jane Doe", error: "No available drivers" }
  ]}
/>
```

---

## NEW: Document Expiry Components

### ExpiryAlertCard

Document expiry warning card.

```tsx
<ExpiryAlertCard
  document={{
    type: "DRIVER_LICENSE",
    owner: "Mike Johnson",
    expiryDate: new Date(),
    daysUntilExpiry: 14,
    urgency: "warning" // "ok" | "warning" | "critical" | "expired"
  }}
  onRenew={() => {}}
  onSnooze={() => {}}
/>
```

---

### ExpiryCalendar

Calendar showing upcoming expirations.

```tsx
<ExpiryCalendar
  expirations={[
    { date: new Date(), type: "license", count: 2 },
    { date: addDays(new Date(), 30), type: "insurance", count: 1 }
  ]}
  onDateClick={(date) => {}}
/>
```

---

## NEW: Real-Time Components

### ConnectionStatusIndicator

WebSocket connection status.

```tsx
<ConnectionStatusIndicator
  status="connected" // "connected" | "connecting" | "disconnected" | "error"
  latency={45} // ms
  onReconnect={() => {}}
/>
```

---

### LiveUpdateBadge

Indicates live data freshness.

```tsx
<LiveUpdateBadge
  lastUpdate={new Date()}
  updating={false}
/>
```

---

### ETACountdown

Live ETA countdown display.

```tsx
<ETACountdown
  eta={new Date()}
  status="on_time" // "on_time" | "delayed" | "early"
  delayMinutes={0}
/>
```

---

## NEW: QuickBooks Components

### QuickBooksSyncStatus

QuickBooks integration status.

```tsx
<QuickBooksSyncStatus
  connected={true}
  lastSync={new Date()}
  pendingItems={5}
  failedItems={0}
  onSync={() => {}}
  onDisconnect={() => {}}
/>
```

---

### SyncErrorCard

Sync error details.

```tsx
<SyncErrorCard
  error={{
    entityType: "invoice",
    entityId: "INV-001",
    errorMessage: "Customer not found in QuickBooks",
    timestamp: new Date()
  }}
  onRetry={() => {}}
  onSkip={() => {}}
/>
```

---

## NEW: Background Job Components

### JobStatusCard

Background job status monitor.

```tsx
<JobStatusCard
  job={{
    type: "standing_order_trips",
    status: "running",
    progress: 45,
    startedAt: new Date(),
    estimatedCompletion: new Date()
  }}
  onCancel={() => {}}
/>
```

---

### JobQueueDashboard

Overview of job queues.

```tsx
<JobQueueDashboard
  queues={[
    { name: "notifications", pending: 12, processing: 2, failed: 0 },
    { name: "invoices", pending: 0, processing: 1, failed: 0 },
    { name: "payouts", pending: 25, processing: 0, failed: 1 }
  ]}
  onViewQueue={(queue) => {}}
/>
```

---

## NEW: Accessibility Components

### VoiceCommandIndicator

Voice command listening indicator.

```tsx
<VoiceCommandIndicator
  listening={true}
  lastCommand="Book a ride"
  onToggle={() => {}}
/>
```

---

### AccessibilityToolbar

Accessibility settings quick access.

```tsx
<AccessibilityToolbar
  settings={{
    fontSize: "large",
    highContrast: false,
    reducedMotion: true,
    screenReader: false
  }}
  onChange={updateSettings}
/>
```

---

## NEW: Emergency & Alert Components

### EmergencyAlertBanner

Full-width emergency alert banner for dispatch.

```tsx
<EmergencyAlertBanner
  alert={{
    id: "uuid",
    type: "MEDICAL",
    driverName: "Mike Johnson",
    tripNumber: "TR-001",
    location: { lat: 29.76, lng: -95.37 },
    timestamp: "2026-01-15T10:30:00Z"
  }}
  onAcknowledge={() => {}}
  onViewMap={() => {}}
  onCallDriver={() => {}}
/>
```

---

### EmergencyAlertCard

Individual emergency alert in list.

```tsx
<EmergencyAlertCard
  alert={alert}
  onAcknowledge={() => {}}
  onResolve={() => {}}
  onViewDetails={() => {}}
/>
```

---

### GeofenceAlert

Geofence entry/exit notification.

```tsx
<GeofenceAlert
  event={{
    type: "PICKUP_APPROACH",
    tripNumber: "TR-001",
    location: "123 Main St",
    timestamp: "2026-01-15T10:30:00Z",
    eta: "5 minutes"
  }}
/>
```

---

## NEW: Fleet Management Components

### InspectionChecklist

Interactive inspection checklist for drivers.

```tsx
<InspectionChecklist
  items={[
    { id: "tires", label: "Tires - Check tread & pressure", required: true },
    { id: "lights", label: "Lights - Headlights, brake, turn", required: true },
    { id: "lift", label: "Wheelchair lift - Operates smoothly", required: true }
  ]}
  values={checklistState}
  onChange={updateChecklist}
  onPhotoCapture={(itemId) => {}}
/>
```

---

### InspectionResultCard

Summary of completed inspection.

```tsx
<InspectionResultCard
  inspection={{
    type: "PRE_TRIP",
    vehiclePlate: "ABC-1234",
    inspectorName: "Mike Johnson",
    completedAt: "2026-01-15T07:30:00Z",
    passed: true,
    issuesFound: 0
  }}
  onViewDetails={() => {}}
/>
```

---

### MaintenanceScheduleCard

Upcoming maintenance item card.

```tsx
<MaintenanceScheduleCard
  item={{
    type: "OIL_CHANGE",
    vehicle: "2022 Ford Transit",
    dueIn: "500 miles",
    dueMiles: 45500,
    currentMiles: 45000,
    estimatedCost: 75.00
  }}
  onSchedule={() => {}}
/>
```

---

### MaintenanceHistoryItem

Individual maintenance record in history.

```tsx
<MaintenanceHistoryItem
  record={{
    type: "TIRE_ROTATION",
    date: "2026-01-10",
    mileage: 44000,
    cost: 50.00,
    performedBy: "Joe's Auto Shop",
    notes: "Rotated all 4 tires, checked pressure"
  }}
  onViewReceipt={() => {}}
/>
```

---

### VehicleIssueCard

Vehicle issue requiring attention.

```tsx
<VehicleIssueCard
  issue={{
    category: "WHEELCHAIR_LIFT",
    severity: "HIGH",
    description: "Lift makes grinding noise when operating",
    reportedBy: "Mike Johnson",
    reportedAt: "2026-01-15T07:35:00Z",
    photoUrl: "https://..."
  }}
  onMarkResolved={() => {}}
  onAssign={() => {}}
/>
```

---

### MileageLogEntry

Individual mileage reading entry.

```tsx
<MileageLogEntry
  entry={{
    readingType: "START_OF_DAY",
    odometerReading: 45230,
    milesDriven: 85,
    recordedAt: "2026-01-15T07:00:00Z",
    hasPhoto: true
  }}
  onViewPhoto={() => {}}
/>
```

---

### DocumentExpiryCard

Document expiration warning card.

```tsx
<DocumentExpiryCard
  document={{
    type: "VEHICLE_INSURANCE",
    name: "Auto Insurance - ABC-1234",
    expiresAt: "2026-02-15",
    daysUntilExpiry: 30,
    severity: "warning" // "warning" | "critical" | "expired"
  }}
  onRenew={() => {}}
  onUpload={() => {}}
/>
```

---

## NEW: Payout Components

### PayoutSummaryCard

Driver payout summary card.

```tsx
<PayoutSummaryCard
  payout={{
    periodStart: "2026-01-08",
    periodEnd: "2026-01-14",
    tripEarnings: 1150.00,
    tips: 85.00,
    bonuses: 25.00,
    deductions: 0,
    netAmount: 1260.00,
    status: "PAID",
    paidAt: "2026-01-16T06:00:00Z"
  }}
  onViewDetails={() => {}}
/>
```

---

### EarningsBreakdown

Detailed earnings breakdown table.

```tsx
<EarningsBreakdown
  earnings={[
    { type: "TRIP_BASE", description: "28 trips completed", amount: 700.00 },
    { type: "TRIP_MILEAGE", description: "245 miles", amount: 367.50 },
    { type: "TRIP_TIME", description: "18.5 hours", amount: 82.50 },
    { type: "TIP", description: "Tips received", amount: 85.00 },
    { type: "BONUS", description: "5-star rating bonus", amount: 25.00 }
  ]}
  total={1260.00}
/>
```

---

### PayoutStatusBadge

Payout status indicator.

```tsx
<PayoutStatusBadge status="PAID" />
<PayoutStatusBadge status="PROCESSING" />
<PayoutStatusBadge status="PENDING" />
<PayoutStatusBadge status="FAILED" />
```

---

## NEW: Bulk Booking Components

### BulkBookingWizard

Multi-step bulk booking form.

```tsx
<BulkBookingWizard
  facilityId="uuid"
  patients={facilityPatients}
  onComplete={(booking) => {}}
  onCancel={() => {}}
/>
```

---

### PatientSelectionGrid

Multi-select grid for bulk patient selection.

```tsx
<PatientSelectionGrid
  patients={patients}
  selectedIds={selectedPatientIds}
  onSelectionChange={setSelectedPatientIds}
  showMedicalNeeds={true}
/>
```

---

### BulkBookingPreview

Preview before confirming bulk booking.

```tsx
<BulkBookingPreview
  booking={{
    date: "2026-01-15",
    pickupTime: "08:00",
    destination: "Dialysis Center",
    patients: [
      { name: "John Smith", pickup: "123 Oak St", estimate: 45.00 },
      { name: "Mary Jones", pickup: "456 Elm Ave", estimate: 52.00 }
    ],
    totalEstimate: 97.00,
    includeReturn: true
  }}
  onConfirm={() => {}}
  onEdit={() => {}}
/>
```

---

### BulkBookingResultCard

Results after processing bulk booking.

```tsx
<BulkBookingResultCard
  result={{
    totalTrips: 10,
    confirmedTrips: 9,
    failedTrips: 1,
    errors: [{ patientName: "Bob Wilson", error: "No available drivers" }]
  }}
  onViewTrips={() => {}}
  onRetryFailed={() => {}}
/>
```

---

## NEW: Standing Order Components

### StandingOrderCard

Standing order summary card.

```tsx
<StandingOrderCard
  order={{
    patientName: "John Smith",
    schedule: "Mon, Wed, Fri @ 8:00 AM",
    route: "Home → Dialysis Center",
    returnType: "WILL_CALL",
    isActive: true,
    nextTrip: "2026-01-15"
  }}
  onEdit={() => {}}
  onPause={() => {}}
  onDelete={() => {}}
/>
```

---

### StandingOrderCalendar

Calendar view of standing order trips.

```tsx
<StandingOrderCalendar
  orders={standingOrders}
  month="2026-01"
  onDayClick={(date, orders) => {}}
  onOrderClick={(order) => {}}
/>
```

---

### ScheduleBuilder

Visual schedule builder for recurring trips.

```tsx
<ScheduleBuilder
  value={{
    daysOfWeek: [1, 3, 5],
    pickupTime: "08:00",
    startDate: "2026-01-15",
    endDate: null
  }}
  onChange={setSchedule}
/>
```

---

## NEW: Contract Rate Components

### ContractRateCard

Facility contract pricing summary.

```tsx
<ContractRateCard
  contract={{
    pricingType: "DISCOUNT",
    discountPercent: 15,
    billingCycle: "MONTHLY",
    paymentTerms: 30,
    startDate: "2026-01-01",
    endDate: null,
    autoRenew: true
  }}
  onEdit={() => {}}
/>
```

---

### VolumeTierTable

Volume-based discount tier display.

```tsx
<VolumeTierTable
  tiers={[
    { minTrips: 0, maxTrips: 49, discount: 0 },
    { minTrips: 50, maxTrips: 99, discount: 5 },
    { minTrips: 100, maxTrips: 199, discount: 10 },
    { minTrips: 200, maxTrips: null, discount: 15 }
  ]}
  currentTrips={127}
/>
```

---

### PriceComparisonTable

Standard vs contract rate comparison.

```tsx
<PriceComparisonTable
  standardRate={{
    baseFare: 25.00,
    perMile: 2.50,
    perMinute: 0.50,
    wheelchairFee: 15.00
  }}
  contractRate={{
    baseFare: 22.00,
    perMile: 2.25,
    perMinute: 0.45,
    wheelchairFee: 12.00
  }}
  savings={127.50}
  savingsPercent={12}
/>
```

---

## NEW: QuickBooks Integration Components

### QuickBooksSyncStatus

QuickBooks connection status display.

```tsx
<QuickBooksSyncStatus
  connected={true}
  companyName="ABC Transport LLC"
  lastSyncAt="2026-01-15T10:30:00Z"
  pendingSync={5}
  failedSync={0}
  onSync={() => {}}
  onDisconnect={() => {}}
/>
```

---

### SyncErrorList

List of failed sync items.

```tsx
<SyncErrorList
  errors={[
    {
      entityType: "Invoice",
      entityId: "INV-001",
      error: "Customer not found in QuickBooks",
      timestamp: "2026-01-15T10:25:00Z"
    }
  ]}
  onRetry={(error) => {}}
  onDismiss={(error) => {}}
/>
```

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Form Components | 20 |
| Data Display | 25 |
| Navigation | 8 |
| Layout | 10 |
| Feedback | 12 |
| Maps | 8 |
| Charts | 10 |
| Domain: Trip | 15 |
| Domain: Driver | 12 |
| Domain: Fleet | 15 |
| Domain: Facility | 10 |
| Domain: Admin | 15 |
| Emergency & Alerts | 8 |
| Accessibility | 5 |
| Payouts | 6 |
| Bulk Booking | 6 |
| Standing Orders | 4 |
| Contracts | 4 |
| QuickBooks | 3 |
| **TOTAL** | **185** |

---

*This addendum ensures the design system covers all UI needs for the complete platform.*
