# Design System - Wheelchair Transportation Platform

> **Version:** 1.0
> **Last Updated:** January 2026
> **Tech:** Tailwind CSS + Shadcn/ui + Radix UI

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Core Components](#5-core-components)
6. [Form Components](#6-form-components)
7. [Data Display Components](#7-data-display-components)
8. [Navigation Components](#8-navigation-components)
9. [Feedback Components](#9-feedback-components)
10. [Domain-Specific Components](#10-domain-specific-components)
11. [Page Templates](#11-page-templates)
12. [Accessibility Requirements](#12-accessibility-requirements)
13. [Responsive Breakpoints](#13-responsive-breakpoints)

---

## 1. Design Principles

### Core Principles

1. **Clarity Over Cleverness**
   - Staff will use this under pressure (phone calls, urgent bookings)
   - Every action should be obvious
   - No hidden features or mystery icons

2. **Speed of Use**
   - Minimize clicks for common actions
   - Keyboard shortcuts for power users
   - Quick-book flow under 30 seconds

3. **Error Prevention**
   - Validate before problems occur
   - Clear conflict warnings (driver already booked)
   - Confirmation for destructive actions

4. **Accessibility First**
   - WCAG 2.1 AA compliance minimum
   - Works for staff with varying abilities
   - Large touch targets for mobile/tablet

5. **Consistent Patterns**
   - Same component = same behavior everywhere
   - Predictable layouts
   - Unified visual language

---

## 2. Color System

### Brand Colors

```css
/* Primary - Used for main actions, branding */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Secondary - Used for secondary actions */
--secondary-50: #f8fafc;
--secondary-100: #f1f5f9;
--secondary-200: #e2e8f0;
--secondary-300: #cbd5e1;
--secondary-400: #94a3b8;
--secondary-500: #64748b;  /* Main */
--secondary-600: #475569;
--secondary-700: #334155;
--secondary-800: #1e293b;
--secondary-900: #0f172a;
```

### Semantic Colors

```css
/* Success - Completed, confirmed, online */
--success-50: #f0fdf4;
--success-100: #dcfce7;
--success-500: #22c55e;  /* Main */
--success-600: #16a34a;
--success-700: #15803d;

/* Warning - Attention needed, pending */
--warning-50: #fffbeb;
--warning-100: #fef3c7;
--warning-500: #f59e0b;  /* Main */
--warning-600: #d97706;
--warning-700: #b45309;

/* Error - Errors, cancelled, critical */
--error-50: #fef2f2;
--error-100: #fee2e2;
--error-500: #ef4444;  /* Main */
--error-600: #dc2626;
--error-700: #b91c1c;

/* Info - Informational, neutral */
--info-50: #eff6ff;
--info-100: #dbeafe;
--info-500: #3b82f6;  /* Main */
--info-600: #2563eb;
--info-700: #1d4ed8;
```

### Ride Status Colors

```css
--status-pending: #f59e0b;      /* Amber */
--status-confirmed: #3b82f6;   /* Blue */
--status-assigned: #8b5cf6;    /* Purple */
--status-driver-on-way: #06b6d4; /* Cyan */
--status-driver-arrived: #10b981; /* Emerald */
--status-in-progress: #22c55e; /* Green */
--status-completed: #16a34a;   /* Dark Green */
--status-cancelled: #ef4444;   /* Red */
--status-no-show: #dc2626;     /* Dark Red */
```

### Driver Status Colors

```css
--driver-online: #22c55e;      /* Green */
--driver-offline: #6b7280;     /* Gray */
--driver-busy: #f59e0b;        /* Amber */
--driver-on-trip: #3b82f6;     /* Blue */
--driver-break: #8b5cf6;       /* Purple */
```

### Background & Surface

```css
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-tertiary: #f1f5f9;
--bg-inverse: #0f172a;

--surface-card: #ffffff;
--surface-elevated: #ffffff;
--surface-overlay: rgba(0, 0, 0, 0.5);
```

### Border Colors

```css
--border-default: #e2e8f0;
--border-muted: #f1f5f9;
--border-strong: #cbd5e1;
--border-focus: #3b82f6;
```

---

## 3. Typography

### Font Family

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes

```css
--text-xs: 0.75rem;     /* 12px - Labels, captions */
--text-sm: 0.875rem;    /* 14px - Secondary text */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-xl: 1.25rem;     /* 20px - Subheadings */
--text-2xl: 1.5rem;     /* 24px - Section headers */
--text-3xl: 1.875rem;   /* 30px - Page titles */
--text-4xl: 2.25rem;    /* 36px - Hero text */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Text Styles

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| `heading-1` | 2xl-3xl | bold | Page titles |
| `heading-2` | xl-2xl | semibold | Section headers |
| `heading-3` | lg | semibold | Card titles |
| `body` | base | normal | Default body text |
| `body-sm` | sm | normal | Secondary text |
| `label` | sm | medium | Form labels |
| `caption` | xs | normal | Help text, timestamps |
| `code` | sm | mono | Code, IDs |

---

## 4. Spacing & Layout

### Spacing Scale

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-default: 0.375rem; /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Pill */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-default: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

---

## 5. Core Components

### 5.1 Button

**Variants:**
| Variant | Use Case |
|---------|----------|
| `primary` | Main actions (Book Ride, Save, Confirm) |
| `secondary` | Secondary actions (Cancel, Back) |
| `outline` | Tertiary actions, less emphasis |
| `ghost` | Minimal style, icons, navigation |
| `destructive` | Dangerous actions (Delete, Cancel Ride) |
| `link` | Text-only, inline actions |

**Sizes:**
| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | 12px | 14px |
| `default` | 40px | 16px | 14px |
| `lg` | 48px | 24px | 16px |
| `xl` | 56px | 32px | 18px |

**States:** Default, Hover, Active, Disabled, Loading

```tsx
<Button variant="primary" size="default">
  Book Ride
</Button>

<Button variant="destructive" size="sm">
  <Trash2 className="w-4 h-4 mr-2" />
  Cancel
</Button>

<Button variant="primary" loading>
  Processing...
</Button>
```

---

### 5.2 Card

**Variants:**
- `default` - Standard card with border
- `elevated` - Card with shadow
- `interactive` - Hover state, clickable
- `selected` - Currently selected item

```tsx
<Card>
  <CardHeader>
    <CardTitle>Upcoming Rides</CardTitle>
    <CardDescription>Today's schedule</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

---

### 5.3 Badge

**Variants for Status:**
```tsx
<Badge variant="pending">Pending</Badge>
<Badge variant="confirmed">Confirmed</Badge>
<Badge variant="assigned">Assigned</Badge>
<Badge variant="in-progress">In Progress</Badge>
<Badge variant="completed">Completed</Badge>
<Badge variant="cancelled">Cancelled</Badge>
```

**Variants for Roles:**
```tsx
<Badge variant="admin">Admin</Badge>
<Badge variant="driver">Driver</Badge>
<Badge variant="facility">Facility</Badge>
```

---

### 5.4 Avatar

**Sizes:** `xs` (24px), `sm` (32px), `md` (40px), `lg` (48px), `xl` (64px)

```tsx
<Avatar size="md">
  <AvatarImage src="/driver.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

{/* With status indicator */}
<Avatar size="md" status="online">
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

### 5.5 Icon

**Icon Library:** Lucide React

**Sizes:**
- `xs`: 12px
- `sm`: 16px
- `md`: 20px
- `lg`: 24px
- `xl`: 32px

**Common Icons:**
| Icon | Use Case |
|------|----------|
| `Wheelchair` | Wheelchair accessibility |
| `BedDouble` | Stretcher |
| `Wind` | Oxygen |
| `Car` | Vehicle |
| `User` | Patient/Person |
| `Users` | Facility/Group |
| `MapPin` | Location |
| `Clock` | Time/Schedule |
| `Phone` | Contact |
| `CreditCard` | Payment |
| `CheckCircle` | Success |
| `AlertCircle` | Warning |
| `XCircle` | Error |
| `ChevronRight` | Navigation |
| `Plus` | Add |
| `Search` | Search |
| `Filter` | Filters |
| `Calendar` | Date picker |
| `Navigation` | Active navigation |

---

## 6. Form Components

### 6.1 Input

**Types:** text, email, phone, password, number, search

**States:** Default, Focus, Disabled, Error, Success

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    type="email"
    placeholder="patient@email.com"
    error={errors.email}
  />
  <FormMessage>{errors.email}</FormMessage>
</div>
```

---

### 6.2 Select

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select vehicle type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="wheelchair">Wheelchair Accessible</SelectItem>
    <SelectItem value="stretcher">Stretcher Van</SelectItem>
    <SelectItem value="bariatric">Bariatric Vehicle</SelectItem>
  </SelectContent>
</Select>
```

---

### 6.3 Checkbox

```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="wheelchair" />
  <Label htmlFor="wheelchair">Wheelchair Required</Label>
</div>
```

---

### 6.4 Radio Group

```tsx
<RadioGroup defaultValue="one-way">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="one-way" id="one-way" />
    <Label htmlFor="one-way">One Way</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="round-trip" id="round-trip" />
    <Label htmlFor="round-trip">Round Trip</Label>
  </div>
</RadioGroup>
```

---

### 6.5 Switch

```tsx
<div className="flex items-center justify-between">
  <Label htmlFor="oxygen">Oxygen Required</Label>
  <Switch id="oxygen" />
</div>
```

---

### 6.6 Textarea

```tsx
<div className="space-y-2">
  <Label htmlFor="notes">Special Instructions</Label>
  <Textarea 
    id="notes"
    placeholder="Enter any special requirements..."
    rows={3}
  />
</div>
```

---

### 6.7 Date Picker

```tsx
<DatePicker
  selected={date}
  onChange={setDate}
  minDate={new Date()}
  placeholderText="Select pickup date"
/>
```

---

### 6.8 Time Picker

```tsx
<TimePicker
  value={time}
  onChange={setTime}
  interval={15} /* 15-minute intervals */
/>
```

---

### 6.9 Phone Input

```tsx
<PhoneInput
  country="US"
  value={phone}
  onChange={setPhone}
  placeholder="(555) 123-4567"
/>
```

---

### 6.10 Address Autocomplete

```tsx
<AddressAutocomplete
  value={address}
  onChange={setAddress}
  onSelect={handleAddressSelect}
  placeholder="Enter pickup address"
  serviceArea="TX" /* Restrict to Texas */
/>
```

---

## 7. Data Display Components

### 7.1 Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Ride #</TableHead>
      <TableHead>Patient</TableHead>
      <TableHead>Pickup</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rides.map(ride => (
      <TableRow key={ride.id}>
        <TableCell>{ride.number}</TableCell>
        <TableCell>{ride.patient.name}</TableCell>
        <TableCell>{ride.pickupAddress}</TableCell>
        <TableCell><Badge variant={ride.status}>{ride.status}</Badge></TableCell>
        <TableCell><Button size="sm">View</Button></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### 7.2 Data List / Description List

```tsx
<DescriptionList>
  <DescriptionItem>
    <DescriptionTerm>Patient</DescriptionTerm>
    <DescriptionDetails>John Smith</DescriptionDetails>
  </DescriptionItem>
  <DescriptionItem>
    <DescriptionTerm>Phone</DescriptionTerm>
    <DescriptionDetails>(555) 123-4567</DescriptionDetails>
  </DescriptionItem>
</DescriptionList>
```

---

### 7.3 Stat Card

```tsx
<StatCard
  title="Today's Rides"
  value={42}
  change={+12}
  changeLabel="vs yesterday"
  icon={<Car />}
/>
```

---

### 7.4 Timeline

```tsx
<Timeline>
  <TimelineItem status="completed" time="9:00 AM">
    Ride confirmed
  </TimelineItem>
  <TimelineItem status="completed" time="9:15 AM">
    Driver assigned: Mike Johnson
  </TimelineItem>
  <TimelineItem status="active" time="9:45 AM">
    Driver on the way
  </TimelineItem>
  <TimelineItem status="pending" time="10:00 AM">
    Estimated arrival
  </TimelineItem>
</Timeline>
```

---

### 7.5 Empty State

```tsx
<EmptyState
  icon={<Calendar />}
  title="No rides scheduled"
  description="There are no rides scheduled for today."
  action={<Button>Create Ride</Button>}
/>
```

---

### 7.6 Calendar

```tsx
<Calendar
  mode="day" /* day | week | month */
  events={rides}
  onEventClick={handleRideClick}
  onSlotClick={handleCreateRide}
/>
```

---

## 8. Navigation Components

### 8.1 Sidebar

```tsx
<Sidebar>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  <SidebarNav>
    <SidebarNavItem href="/dispatcher" icon={<LayoutDashboard />}>
      Dashboard
    </SidebarNavItem>
    <SidebarNavItem href="/dispatcher/rides" icon={<Car />}>
      Rides
    </SidebarNavItem>
    {/* ... */}
  </SidebarNav>
  <SidebarFooter>
    <UserMenu />
  </SidebarFooter>
</Sidebar>
```

---

### 8.2 Top Bar

```tsx
<TopBar>
  <TopBarTitle>Dispatcher Dashboard</TopBarTitle>
  <TopBarActions>
    <NotificationBell count={3} />
    <UserDropdown />
  </TopBarActions>
</TopBar>
```

---

### 8.3 Tabs

```tsx
<Tabs defaultValue="upcoming">
  <TabsList>
    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
    <TabsTrigger value="completed">Completed</TabsTrigger>
  </TabsList>
  <TabsContent value="upcoming">{/* ... */}</TabsContent>
  <TabsContent value="active">{/* ... */}</TabsContent>
  <TabsContent value="completed">{/* ... */}</TabsContent>
</Tabs>
```

---

### 8.4 Breadcrumbs

```tsx
<Breadcrumbs>
  <BreadcrumbItem href="/dispatcher">Dashboard</BreadcrumbItem>
  <BreadcrumbItem href="/dispatcher/rides">Rides</BreadcrumbItem>
  <BreadcrumbItem current>Ride #TR-20260115-001</BreadcrumbItem>
</Breadcrumbs>
```

---

### 8.5 Pagination

```tsx
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={setPage}
/>
```

---

## 9. Feedback Components

### 9.1 Toast / Notification

```tsx
toast.success("Ride booked successfully!");
toast.error("Payment failed. Please try again.");
toast.warning("Driver is running 10 minutes late.");
toast.info("New ride request received.");
```

---

### 9.2 Alert

```tsx
<Alert variant="warning">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Driver Conflict</AlertTitle>
  <AlertDescription>
    Mike Johnson is already assigned to another ride at 10:00 AM.
  </AlertDescription>
</Alert>
```

---

### 9.3 Dialog / Modal

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Assign Driver</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Assign Driver</DialogTitle>
      <DialogDescription>
        Select a driver for this ride.
      </DialogDescription>
    </DialogHeader>
    {/* Driver list */}
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm Assignment</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 9.4 Sheet / Drawer

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Filters</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filter Rides</SheetTitle>
    </SheetHeader>
    {/* Filter form */}
  </SheetContent>
</Sheet>
```

---

### 9.5 Skeleton Loader

```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-4 w-32" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-24 w-full" />
  </CardContent>
</Card>
```

---

### 9.6 Progress

```tsx
<Progress value={65} label="Profile Complete" />
```

---

### 9.7 Spinner

```tsx
<Spinner size="sm" /> /* 16px */
<Spinner size="md" /> /* 24px */
<Spinner size="lg" /> /* 32px */
```

---

## 10. Domain-Specific Components

### 10.1 Ride Card

```tsx
<RideCard
  rideNumber="TR-20260115-001"
  patient={{ name: "John Smith", phone: "(555) 123-4567" }}
  pickup={{ address: "123 Main St", time: "10:00 AM" }}
  dropoff={{ address: "456 Hospital Dr" }}
  status="confirmed"
  driver={{ name: "Mike Johnson", avatar: "/mike.jpg" }}
  vehicleType="wheelchair"
  fare={85.50}
  onView={() => {}}
  onAssign={() => {}}
/>
```

---

### 10.2 Driver Card

```tsx
<DriverCard
  driver={{
    name: "Mike Johnson",
    avatar: "/mike.jpg",
    rating: 4.8,
    totalTrips: 234,
    status: "online",
    vehicle: "2022 Toyota Sienna - White"
  }}
  currentRide={null}
  onAssign={() => {}}
  onViewSchedule={() => {}}
/>
```

---

### 10.3 Patient Card

```tsx
<PatientCard
  patient={{
    name: "John Smith",
    phone: "(555) 123-4567",
    medicalNeeds: ["wheelchair", "oxygen"],
    lastRide: "Jan 10, 2026"
  }}
  onBook={() => {}}
  onView={() => {}}
/>
```

---

### 10.4 Price Breakdown

```tsx
<PriceBreakdown
  baseFare={25.00}
  distanceFare={31.25}
  distanceMiles={12.5}
  perMileRate={2.50}
  timeFare={17.50}
  timeMinutes={35}
  perMinuteRate={0.50}
  surcharges={[
    { label: "Wheelchair", amount: 15.00 }
  ]}
  multiplier={1.0}
  total={88.75}
/>
```

---

### 10.5 Address Display

```tsx
<AddressDisplay
  label="Pickup"
  address="123 Main St, Houston, TX 77001"
  contact={{ name: "Jane Doe", phone: "(555) 987-6543" }}
  instructions="Ring doorbell, wait for aide"
/>
```

---

### 10.6 Status Timeline

```tsx
<RideStatusTimeline
  statuses={[
    { status: "pending", time: "9:00 AM", completed: true },
    { status: "confirmed", time: "9:05 AM", completed: true },
    { status: "assigned", time: "9:10 AM", completed: true },
    { status: "driver_on_way", time: "9:30 AM", completed: true },
    { status: "driver_arrived", time: "9:50 AM", current: true },
    { status: "in_progress", time: null, completed: false },
    { status: "completed", time: null, completed: false },
  ]}
/>
```

---

### 10.7 Driver Availability Row

```tsx
<DriverAvailabilityRow
  driver={{
    name: "Mike Johnson",
    status: "online",
    currentLocation: "Downtown Houston",
    nextRide: { time: "11:00 AM", location: "Memorial Hospital" }
  }}
  conflictCheck={{
    available: true,
    conflicts: []
  }}
  onSelect={() => {}}
/>
```

---

### 10.8 Quick Book Form

```tsx
<QuickBookForm
  onSubmit={handleBooking}
  defaultPatient={existingPatient}
  showPricePreview={true}
/>
```

---

### 10.9 Invoice Card

```tsx
<InvoiceCard
  invoice={{
    number: "INV-2026-001",
    facility: "Sunrise Nursing Home",
    amount: 1250.00,
    dueDate: "Feb 15, 2026",
    status: "pending"
  }}
  onView={() => {}}
  onSend={() => {}}
/>
```

---

### 10.10 Map Component

```tsx
<RideMap
  pickup={{ lat: 29.7604, lng: -95.3698 }}
  dropoff={{ lat: 29.7893, lng: -95.3890 }}
  driverLocation={{ lat: 29.7700, lng: -95.3750, heading: 45 }}
  showRoute={true}
/>
```

---

### 10.11 Multi-Stop Builder

Drag-and-drop interface for building multi-stop trips.

```tsx
<MultiStopBuilder
  stops={[
    { order: 0, type: "pickup", address: "123 Home St", passengers: ["John Smith"] },
    { order: 1, type: "pickup", address: "456 Oak Ave", passengers: ["Mary Jones"] },
    { order: 2, type: "dropoff", address: "Dialysis Center", passengers: ["John Smith", "Mary Jones"] }
  ]}
  onStopsChange={handleStopsChange}
  onAddStop={() => {}}
  onRemoveStop={(index) => {}}
  maxStops={5}
  showDistances={true}
/>
```

**Features:**
- Drag-and-drop reordering
- Stop type badges (Pickup/Dropoff/Both)
- Running distance between stops
- Passenger assignment per stop
- Add/remove stop buttons
- Address autocomplete inline

---

### 10.12 Passenger Flow Diagram

Visual representation of passengers through multi-stop trip.

```tsx
<PassengerFlowDiagram
  stops={stops}
  passengers={[
    { name: "John Smith", boardsAt: 0, alightsAt: 2 },
    { name: "Mary Jones", boardsAt: 1, alightsAt: 2 }
  ]}
/>
```

---

### 10.13 Will-Call Card

Card showing active will-call trip waiting for activation.

```tsx
<WillCallCard
  trip={{
    tripNumber: "TR-20260115-003",
    patientName: "John Smith",
    location: "Memorial Hospital - Main Lobby",
    expectedReadyTime: "2:00 PM",
    waitingTime: "45 min"
  }}
  urgencyLevel="normal" // "normal" | "warning" | "urgent"
  onActivate={() => {}}
  onCall={() => {}}
  onCancel={() => {}}
/>
```

**States:**
- Normal: Waiting < 2 hours (green border)
- Warning: Waiting 2-4 hours (yellow border)
- Urgent: Waiting > 4 hours (red border)

---

### 10.14 Will-Call Activation Modal

Modal for activating a will-call trip.

```tsx
<WillCallActivationModal
  trip={trip}
  open={isOpen}
  onClose={() => {}}
  onActivate={(notes) => {}}
/>
```

**Contents:**
- Patient name and location
- Time waiting indicator
- Notes field
- "Patient is ready for pickup" confirmation
- Available drivers preview
- Estimated pickup time

---

### 10.15 Appointment Time Calculator

Shows calculated pickup time based on appointment.

```tsx
<AppointmentTimeCalculator
  pickupAddress="123 Home St, Houston TX"
  dropoffAddress="Memorial Hospital, Houston TX"
  appointmentTime="10:00 AM"
  arriveBeforeMinutes={15}
  onPickupTimeCalculated={(time) => {}}
/>
```

**Display:**
```
Appointment: 10:00 AM at Memorial Hospital
Arrive by:   9:45 AM (15 min before)
Travel time: 30 min
────────────────────────────
Pickup at:   9:15 AM ← calculated
```

---

### 10.16 Standing Order Card

Card showing a standing order (recurring schedule).

```tsx
<StandingOrderCard
  order={{
    orderNumber: "SO-00001",
    patientName: "John Smith",
    schedule: "Mon, Wed, Fri at 8:00 AM",
    route: "Home → Dialysis Center",
    includeReturn: true,
    isWillCallReturn: true,
    status: "active",
    nextTripDate: "Jan 15, 2026"
  }}
  onEdit={() => {}}
  onPause={() => {}}
  onSkipDate={() => {}}
/>
```

---

### 10.17 Standing Order Calendar

Calendar showing generated trips from standing order.

```tsx
<StandingOrderCalendar
  orderId="uuid"
  trips={generatedTrips}
  skippedDates={["2026-01-20"]}
  onSkipDate={(date) => {}}
  onUnskipDate={(date) => {}}
  onViewTrip={(tripId) => {}}
/>
```

**Features:**
- Month calendar view
- Trip days highlighted
- Skipped days shown differently
- Click day to skip/unskip
- Click trip to view details

---

### 10.18 Duplicate Booking Warning

Alert shown when potential duplicate is detected.

```tsx
<DuplicateBookingWarning
  existingTrips={[
    {
      tripNumber: "TR-20260115-001",
      scheduledTime: "9:00 AM",
      route: "Home → Hospital"
    }
  ]}
  onContinue={() => {}}
  onCancel={() => {}}
/>
```

---

### 10.19 Trip Type Selector

Radio/button group for selecting trip type.

```tsx
<TripTypeSelector
  value="MULTI_STOP"
  onChange={(type) => {}}
  options={[
    { value: "ONE_WAY", label: "One Way", icon: ArrowRight },
    { value: "ROUND_TRIP", label: "Round Trip", icon: ArrowLeftRight },
    { value: "MULTI_STOP", label: "Multi-Stop", icon: MapPin }
  ]}
/>
```

---

### 10.20 Round Trip Return Options

Options for configuring return trip.

```tsx
<RoundTripReturnOptions
  value={{ type: "WILL_CALL", expectedTime: "2:00 PM" }}
  onChange={(options) => {}}
/>
```

**Options:**
- Scheduled Return (with time picker)
- Will-Call Return (with expected time estimate)
- No Return (one-way only)

---

### 10.21 Call Log Entry

Quick entry form for logging calls.

```tsx
<CallLogEntry
  onSubmit={(entry) => {}}
  defaultCallerPhone=""
  patientLookup={true}
/>
```

**Fields:**
- Caller phone (with patient lookup)
- Call type (Booking, Will-Call, Inquiry, Complaint)
- Quick notes
- Outcome (Trip Booked, Info Provided, etc.)

---

### 10.22 Service Area Map

Map for viewing/editing service boundaries.

```tsx
<ServiceAreaMap
  polygon={geoJsonPolygon}
  editable={true}
  onPolygonChange={(polygon) => {}}
  checkAddress={selectedAddress}
/>
```

**Features:**
- Display service area polygon
- Edit mode: draw/modify boundary
- Check if address is in area
- Show out-of-area indicator

---

### 10.23 Holiday Calendar Manager

Calendar for managing holiday dates.

```tsx
<HolidayCalendarManager
  holidays={[
    { date: "2026-01-01", name: "New Year's Day", multiplier: 1.3, isClosed: false },
    { date: "2026-12-25", name: "Christmas Day", multiplier: 1.0, isClosed: true }
  ]}
  onAddHoliday={(holiday) => {}}
  onEditHoliday={(id, holiday) => {}}
  onDeleteHoliday={(id) => {}}
/>
```

---

## 11. Page Templates

### 11.1 Dashboard Layout

```
┌─────────────────────────────────────────────┐
│ TopBar                                      │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │  Main Content Area               │
│          │                                  │
│          │  ┌─────────┐ ┌─────────┐         │
│          │  │StatCard │ │StatCard │ ...     │
│          │  └─────────┘ └─────────┘         │
│          │                                  │
│          │  ┌───────────────────────────┐   │
│          │  │ Main Content / Table      │   │
│          │  │                           │   │
│          │  └───────────────────────────┘   │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

---

### 11.2 List Page Layout

```
┌─────────────────────────────────────────────┐
│ Breadcrumbs                                 │
├─────────────────────────────────────────────┤
│ Page Title                     [+ Create]   │
├─────────────────────────────────────────────┤
│ [Search...          ] [Filters] [Export]    │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Table / List                            │ │
│ │                                         │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Pagination                                  │
└─────────────────────────────────────────────┘
```

---

### 11.3 Detail Page Layout

```
┌─────────────────────────────────────────────┐
│ Breadcrumbs                                 │
├─────────────────────────────────────────────┤
│ ← Back    Page Title    [Edit] [Delete]     │
├──────────────────────────┬──────────────────┤
│                          │                  │
│  Main Info               │  Sidebar         │
│  (Cards, Details)        │  (Status,        │
│                          │   Timeline,      │
│                          │   Quick Actions) │
│                          │                  │
└──────────────────────────┴──────────────────┘
```

---

### 11.4 Form Page Layout

```
┌─────────────────────────────────────────────┐
│ Breadcrumbs                                 │
├─────────────────────────────────────────────┤
│ Page Title                                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Form Section 1                        │  │
│  │ [Input] [Input]                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Form Section 2                        │  │
│  │ [Input] [Input]                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│                    [Cancel] [Save]          │
└─────────────────────────────────────────────┘
```

---

## 12. Accessibility Requirements

### Minimum Requirements (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | 4.5:1 for normal text, 3:1 for large text |
| Focus Visible | 2px solid ring on all interactive elements |
| Keyboard Navigation | All actions accessible via keyboard |
| Screen Reader | ARIA labels on all interactive elements |
| Touch Targets | Minimum 44x44px on mobile |
| Error Messages | Associated with inputs via aria-describedby |
| Loading States | aria-busy and aria-live for dynamic content |
| Skip Links | Skip to main content link |
| Form Labels | All inputs have visible labels |
| Alt Text | All images have descriptive alt text |

---

## 13. Responsive Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Large phones, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Layout Changes by Breakpoint

| Component | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|-----------|-----------------|---------------------|-------------------|
| Sidebar | Hidden (hamburger menu) | Collapsed icons | Expanded |
| Tables | Card view | Scrollable | Full |
| Forms | Single column | Two column | Two column |
| Stats | Stack vertically | 2x2 grid | 4 in row |
| Modals | Full screen | Centered | Centered |

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Core Components | 5 |
| Form Components | 10 |
| Data Display | 6 |
| Navigation | 5 |
| Feedback | 7 |
| Domain-Specific | 23 |
| **Total** | **56** |

**Note:** Additional components are defined in DESIGN_SYSTEM_ADDENDUM.md

---

*This design system is the single source of truth for all UI decisions.*
