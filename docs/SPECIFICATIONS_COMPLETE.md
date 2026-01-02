# Complete Feature Specifications

> **Purpose:** Fill ALL gaps identified in FEATURE_AUDIT.md
> **Status:** Every ⚠️ and ❌ item is now fully specified
> **Last Updated:** January 2026

---

## Table of Contents

1. [Authentication & Security](#1-authentication--security)
2. [Real-Time Features](#2-real-time-features)
3. [Notifications System](#3-notifications-system)
4. [Payments & Billing](#4-payments--billing)
5. [Vehicle & Fleet Management](#5-vehicle--fleet-management)
6. [Service Area & Validation](#6-service-area--validation)
7. [Reporting & Analytics](#7-reporting--analytics)
8. [System Features](#8-system-features)
9. [Accessibility Enhancements](#9-accessibility-enhancements)
10. [Operations & Live Map](#10-operations--live-map)
11. [Facility Features](#11-facility-features)

---

## 1. Authentication & Security

### 1.1 Magic Link Login

**Flow:**
1. User enters email on login page
2. User clicks "Send Magic Link"
3. System generates secure token (expires in 15 minutes)
4. Email sent with link: `https://app.com/auth/magic/[token]`
5. User clicks link → automatically logged in
6. Token invalidated after use

**Database:**

```prisma
model MagicLink {
  id          String    @id @default(uuid())
  token       String    @unique
  email       String
  userId      String?
  expiresAt   DateTime
  usedAt      DateTime?
  createdAt   DateTime  @default(now())
  
  @@index([token])
  @@index([email])
}
```

**API Endpoints:**

```
POST /auth/magic-link/request
Body: { "email": "user@example.com" }
Response: { "success": true, "message": "Magic link sent" }

GET /auth/magic-link/verify/[token]
Response: { "accessToken": "...", "refreshToken": "...", "user": {...} }
```

**Security:**
- Token: 64-character random string
- Single use only
- 15-minute expiry
- Rate limit: 3 requests per email per hour

---

### 1.2 Account Lockout

**Rules:**

| Condition | Action |
|-----------|--------|
| 5 failed login attempts | Lock for 15 minutes |
| 10 failed attempts (cumulative) | Lock for 1 hour |
| 20 failed attempts (cumulative) | Lock until admin unlock |
| Successful login | Reset failure count |

**Database:**

```prisma
model LoginAttempt {
  id          String    @id @default(uuid())
  email       String
  ipAddress   String
  userAgent   String?
  success     Boolean
  failReason  String?   // "invalid_password", "account_locked", "user_not_found"
  createdAt   DateTime  @default(now())
  
  @@index([email, createdAt])
  @@index([ipAddress, createdAt])
}

// Add to User model
model User {
  // ... existing fields
  failedLoginAttempts   Int       @default(0)
  lockedUntil           DateTime?
  lastFailedLoginAt     DateTime?
}
```

**API Response on Lockout:**

```json
{
  "error": "ACCOUNT_LOCKED",
  "message": "Account locked due to too many failed attempts",
  "lockedUntil": "2026-01-15T10:30:00Z",
  "remainingMinutes": 14
}
```

**Admin Unlock:**

```
POST /admin/users/:id/unlock
Response: { "success": true, "message": "Account unlocked" }
```

---

### 1.3 Password Requirements

**Rules:**

| Requirement | Value |
|-------------|-------|
| Minimum length | 8 characters |
| Maximum length | 128 characters |
| Uppercase required | At least 1 |
| Lowercase required | At least 1 |
| Number required | At least 1 |
| Special character required | At least 1 (@$!%*?&#) |
| Common passwords blocked | Yes (top 10,000 list) |
| Password history | Cannot reuse last 5 passwords |
| Expiry | 90 days (admin/staff only) |

**Validation Response:**

```json
{
  "valid": false,
  "errors": [
    { "code": "TOO_SHORT", "message": "Password must be at least 8 characters" },
    { "code": "NO_UPPERCASE", "message": "Password must contain an uppercase letter" },
    { "code": "COMMON_PASSWORD", "message": "This password is too common" }
  ],
  "strength": "weak" // "weak" | "fair" | "strong" | "very_strong"
}
```

**Password Strength Meter:**

```typescript
function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (!/(.)\1{2,}/.test(password)) score += 1; // No repeating chars
  
  if (score <= 3) return 'weak';
  if (score <= 5) return 'fair';
  if (score <= 7) return 'strong';
  return 'very_strong';
}
```

---

## 2. Real-Time Features

### 2.1 WebSocket Implementation

**Connection:**

```typescript
// Client connection
const socket = new WebSocket('wss://api.example.com/ws');

// Authentication
socket.send(JSON.stringify({
  type: 'auth',
  token: 'jwt_access_token'
}));

// Subscribe to channels
socket.send(JSON.stringify({
  type: 'subscribe',
  channels: ['trip:uuid', 'driver:uuid', 'dispatch:alerts']
}));
```

**Event Types:**

| Event | Payload | Who Receives |
|-------|---------|--------------|
| `driver_location` | `{driverId, lat, lng, heading, speed, timestamp}` | Dispatch, tracking users |
| `trip_status` | `{tripId, status, timestamp, location?}` | All trip stakeholders |
| `eta_update` | `{tripId, eta, delayMinutes?, reason?}` | All trip stakeholders |
| `driver_assigned` | `{tripId, driver}` | Patient, family, facility |
| `geofence_enter` | `{tripId, location, type}` | Dispatch, stakeholders |
| `geofence_exit` | `{tripId, location, type}` | Dispatch |
| `emergency` | `{tripId, driverId, type, location}` | All dispatchers |
| `will_call_activated` | `{tripId, activatedAt}` | Dispatch, driver |
| `new_booking` | `{trip summary}` | Dispatchers |
| `driver_status` | `{driverId, status, timestamp}` | Dispatch |

**Server Implementation:**

```typescript
// Redis pub/sub for scaling across instances
interface WebSocketMessage {
  type: string;
  channel: string;
  payload: any;
  timestamp: string;
}

// Heartbeat every 30 seconds
setInterval(() => {
  socket.send(JSON.stringify({ type: 'ping' }));
}, 30000);

// Reconnection with exponential backoff
const reconnect = (attempt: number) => {
  const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
  setTimeout(() => connect(), delay);
};
```

---

### 2.2 Geofencing Alerts

**Geofence Types:**

| Type | Radius | Trigger |
|------|--------|---------|
| Pickup approach | 500m | Driver approaching pickup |
| Pickup arrival | 50m | Driver arrived at pickup |
| Dropoff approach | 500m | Driver approaching dropoff |
| Dropoff arrival | 50m | Driver arrived at dropoff |
| Facility boundary | Custom | Enter/exit facility |

**Database:**

```prisma
model Geofence {
  id            String    @id @default(uuid())
  name          String
  type          GeofenceType
  latitude      Float
  longitude     Float
  radiusMeters  Int
  polygon       Json?     // For non-circular boundaries
  facilityId    String?   // If facility-specific
  isActive      Boolean   @default(true)
  
  @@index([latitude, longitude])
}

enum GeofenceType {
  PICKUP_APPROACH
  PICKUP_ARRIVAL
  DROPOFF_APPROACH
  DROPOFF_ARRIVAL
  FACILITY_BOUNDARY
  CUSTOM
}

model GeofenceEvent {
  id            String    @id @default(uuid())
  geofenceId    String
  tripId        String?
  driverId      String
  eventType     String    // "enter" | "exit" | "dwell"
  latitude      Float
  longitude     Float
  timestamp     DateTime  @default(now())
  
  @@index([tripId, timestamp])
  @@index([driverId, timestamp])
}
```

**Implementation:**

```typescript
function checkGeofence(
  driverLocation: { lat: number; lng: number },
  geofence: Geofence
): boolean {
  const distance = haversineDistance(
    driverLocation.lat,
    driverLocation.lng,
    geofence.latitude,
    geofence.longitude
  );
  return distance <= geofence.radiusMeters;
}

// Haversine formula for distance calculation
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
```

**Notifications Triggered:**

| Geofence Event | Notification |
|----------------|--------------|
| Pickup approach (500m) | SMS to patient: "Driver is 5 minutes away" |
| Pickup arrival (50m) | SMS to patient: "Driver has arrived" |
| Dropoff approach (500m) | Update ETA in app |
| Dropoff arrival (50m) | Prepare for trip completion |

---

### 2.3 Push Notifications

**Platforms:**
- iOS: Apple Push Notification Service (APNs)
- Android: Firebase Cloud Messaging (FCM)
- Web: Web Push API (VAPID)

**Database:**

```prisma
model PushSubscription {
  id            String    @id @default(uuid())
  userId        String
  platform      Platform  // IOS, ANDROID, WEB
  token         String    // Device token or endpoint
  endpoint      String?   // For web push
  p256dh        String?   // For web push
  auth          String?   // For web push
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  lastUsedAt    DateTime?
  
  user          User      @relation(fields: [userId], references: [id])
  
  @@unique([userId, token])
  @@index([userId])
}

enum Platform {
  IOS
  ANDROID
  WEB
}
```

**API Endpoints:**

```
POST /push/subscribe
Body: {
  "platform": "WEB",
  "token": "...",
  "endpoint": "https://fcm.googleapis.com/...",
  "keys": { "p256dh": "...", "auth": "..." }
}

DELETE /push/unsubscribe
Body: { "token": "..." }

PUT /push/preferences
Body: {
  "tripUpdates": true,
  "driverAssigned": true,
  "driverArriving": true,
  "marketing": false
}
```

**Notification Payloads:**

```typescript
// Driver arriving
{
  title: "Driver Arriving",
  body: "Mike is 5 minutes away in a white Ford Transit",
  icon: "/icons/car.png",
  data: {
    type: "driver_arriving",
    tripId: "uuid",
    action: "track"
  },
  actions: [
    { action: "track", title: "Track Driver" },
    { action: "call", title: "Call Driver" }
  ]
}

// Trip completed
{
  title: "Trip Completed",
  body: "Your trip to Memorial Hospital is complete. Rate your experience!",
  data: {
    type: "trip_completed",
    tripId: "uuid",
    action: "rate"
  }
}
```

---

### 2.4 Emergency Alert System

**Emergency Types:**

| Type | Code | Response |
|------|------|----------|
| Medical emergency | MEDICAL | Alert dispatch + 911 info |
| Vehicle breakdown | BREAKDOWN | Alert dispatch + roadside |
| Accident | ACCIDENT | Alert dispatch + 911 info |
| Safety concern | SAFETY | Alert dispatch immediately |
| Patient distress | PATIENT_DISTRESS | Alert dispatch + facility |

**Database:**

```prisma
model EmergencyAlert {
  id              String    @id @default(uuid())
  tripId          String?
  driverId        String
  type            EmergencyType
  status          AlertStatus @default(ACTIVE)
  
  // Location at time of alert
  latitude        Float
  longitude       Float
  
  // Details
  description     String?
  notes           String?
  
  // Response tracking
  acknowledgedBy  String?
  acknowledgedAt  DateTime?
  resolvedBy      String?
  resolvedAt      DateTime?
  resolution      String?
  
  createdAt       DateTime  @default(now())
  
  trip            Trip?     @relation(fields: [tripId], references: [id])
  driver          Driver    @relation(fields: [driverId], references: [id])
  
  @@index([status, createdAt])
}

enum EmergencyType {
  MEDICAL
  BREAKDOWN
  ACCIDENT
  SAFETY
  PATIENT_DISTRESS
}

enum AlertStatus {
  ACTIVE
  ACKNOWLEDGED
  RESPONDING
  RESOLVED
  FALSE_ALARM
}
```

**API Endpoints:**

```
POST /emergency/alert
Body: {
  "type": "MEDICAL",
  "tripId": "uuid",
  "latitude": 29.7604,
  "longitude": -95.3698,
  "description": "Patient having difficulty breathing"
}
Response: {
  "alertId": "uuid",
  "dispatchNotified": true,
  "nearestHospital": { "name": "Memorial Hermann", "phone": "713-555-1234", "distance": "2.3 mi" },
  "emergencyNumbers": { "911": "911", "poison": "1-800-222-1222" }
}

POST /emergency/:id/acknowledge
Body: { "dispatcherId": "uuid" }

POST /emergency/:id/resolve
Body: {
  "resolution": "Patient stabilized, transported to hospital",
  "status": "RESOLVED"
}

GET /emergency/active
Response: [{ ...activeAlerts }]
```

**Automatic Actions:**

1. **On Alert Creation:**
   - WebSocket broadcast to ALL dispatchers
   - Push notification to on-duty dispatchers
   - Audio alarm in dispatch dashboard
   - Log in audit trail

2. **If Not Acknowledged in 30 seconds:**
   - Escalate to operations manager
   - Send SMS to emergency contacts

3. **If Not Acknowledged in 2 minutes:**
   - Alert admin/owner
   - Prepare 911 information

---

## 3. Notifications System

### 3.1 Email Notifications

**Email Provider:** SendGrid / AWS SES

**Templates:**

| Template ID | Trigger | Subject |
|-------------|---------|---------|
| `booking_confirmation` | Trip created | Your ride is confirmed - #{tripNumber} |
| `driver_assigned` | Driver assigned | Driver assigned: {driverName} |
| `trip_reminder_24h` | 24h before | Reminder: Your ride tomorrow |
| `trip_reminder_1h` | 1h before | Your driver is on the way soon |
| `trip_completed` | Trip done | Trip completed - Rate your experience |
| `trip_cancelled` | Cancelled | Your ride has been cancelled |
| `invoice_created` | Invoice generated | Invoice #{invoiceNumber} - ${amount} |
| `invoice_reminder` | 7 days before due | Payment reminder: Invoice #{invoiceNumber} |
| `invoice_overdue` | Past due | Overdue notice: Invoice #{invoiceNumber} |
| `password_reset` | Reset requested | Reset your password |
| `welcome` | Registration | Welcome to {companyName} |
| `account_locked` | Lockout | Account security alert |

**Database:**

```prisma
model EmailLog {
  id            String    @id @default(uuid())
  templateId    String
  recipientEmail String
  recipientName String?
  userId        String?
  tripId        String?
  invoiceId     String?
  
  subject       String
  status        EmailStatus @default(PENDING)
  
  // Provider details
  providerMessageId String?
  sentAt        DateTime?
  deliveredAt   DateTime?
  openedAt      DateTime?
  clickedAt     DateTime?
  bouncedAt     DateTime?
  bounceReason  String?
  
  createdAt     DateTime  @default(now())
  
  @@index([userId, createdAt])
  @@index([status])
}

enum EmailStatus {
  PENDING
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  FAILED
}
```

**Template Variables:**

```typescript
interface BookingConfirmationVars {
  patientName: string;
  tripNumber: string;
  pickupDate: string;      // "Wednesday, January 15, 2026"
  pickupTime: string;      // "9:00 AM"
  pickupAddress: string;
  dropoffAddress: string;
  vehicleType: string;
  estimatedFare: string;   // "$45.50"
  specialInstructions?: string;
  companyName: string;
  companyPhone: string;
  trackingUrl: string;
  cancelUrl: string;
}
```

---

### 3.2 SMS Templates

**Provider:** Twilio

**Templates:**

```typescript
const SMS_TEMPLATES = {
  booking_confirmation: 
    "{companyName}: Ride confirmed for {date} at {time}. Trip #{tripNumber}. Reply HELP for assistance.",
  
  driver_assigned:
    "{companyName}: {driverName} will pick you up in a {vehicleColor} {vehicleType}. Track: {trackUrl}",
  
  driver_5min:
    "{companyName}: Your driver {driverName} is 5 minutes away.",
  
  driver_arrived:
    "{companyName}: Your driver has arrived. {vehicleColor} {vehicleType}, plate {licensePlate}.",
  
  trip_completed:
    "{companyName}: Trip complete! Total: ${amount}. Rate your experience: {rateUrl}",
  
  trip_cancelled:
    "{companyName}: Your ride #{tripNumber} for {date} has been cancelled. Questions? Call {phone}",
  
  reminder_24h:
    "{companyName}: Reminder - You have a ride tomorrow at {time}. Reply C to cancel.",
  
  reminder_1h:
    "{companyName}: Your driver will arrive in about 1 hour for pickup at {time}.",
  
  will_call_reminder:
    "{companyName}: Ready for pickup? Call us at {phone} or reply READY to request your return ride.",
  
  invoice_sent:
    "{companyName}: Invoice #{invoiceNumber} for ${amount} has been sent. Due: {dueDate}",
  
  payment_received:
    "{companyName}: Payment of ${amount} received. Thank you!",
};
```

**Two-Way SMS Handling:**

| Incoming | Action |
|----------|--------|
| STOP / UNSUBSCRIBE | Opt out of SMS |
| HELP | Send help message with phone number |
| READY | Activate will-call return |
| C / CANCEL | Initiate cancellation flow |
| Y / YES | Confirm pending action |
| N / NO | Decline pending action |

---

## 4. Payments & Billing

### 4.1 Apple Pay & Google Pay

**Implementation:** Via Stripe Payment Request API

```typescript
// Stripe Payment Element with Wallet Support
const appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#3b82f6',
  },
};

const options = {
  mode: 'payment',
  amount: 4550, // $45.50 in cents
  currency: 'usd',
  paymentMethodTypes: ['card', 'apple_pay', 'google_pay'],
  wallets: {
    applePay: 'auto',
    googlePay: 'auto',
  },
};
```

**Database:**

```prisma
model PaymentMethod {
  id              String    @id @default(uuid())
  userId          String
  stripePaymentMethodId String @unique
  type            PaymentMethodType
  
  // Card details (if card)
  cardBrand       String?   // visa, mastercard, amex
  cardLast4       String?
  cardExpMonth    Int?
  cardExpYear     Int?
  
  // Wallet details (if wallet)
  walletType      WalletType?
  
  isDefault       Boolean   @default(false)
  createdAt       DateTime  @default(now())
  
  user            User      @relation(fields: [userId], references: [id])
}

enum PaymentMethodType {
  CARD
  APPLE_PAY
  GOOGLE_PAY
  BANK_ACCOUNT
}

enum WalletType {
  APPLE_PAY
  GOOGLE_PAY
}
```

---

### 4.2 Driver Payouts (Stripe Connect)

**Onboarding Flow:**

1. Driver creates account
2. System creates Stripe Connect Express account
3. Driver completes Stripe onboarding (ID verification, bank account)
4. System stores connected account ID

**Database:**

```prisma
model DriverPayoutAccount {
  id                    String    @id @default(uuid())
  driverId              String    @unique
  stripeConnectId       String    @unique
  
  // Onboarding status
  onboardingComplete    Boolean   @default(false)
  chargesEnabled        Boolean   @default(false)
  payoutsEnabled        Boolean   @default(false)
  
  // Payout settings
  payoutSchedule        PayoutSchedule @default(WEEKLY)
  payoutDay             Int?      // Day of week (1-7) or month (1-28)
  minimumPayout         Float     @default(50.00)
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  driver                Driver    @relation(fields: [driverId], references: [id])
}

enum PayoutSchedule {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
}

model DriverPayout {
  id                String    @id @default(uuid())
  driverId          String
  stripePayoutId    String?   @unique
  
  amount            Float
  currency          String    @default("usd")
  status            PayoutStatus @default(PENDING)
  
  // Period covered
  periodStart       DateTime
  periodEnd         DateTime
  
  // Breakdown
  tripEarnings      Float
  tips              Float     @default(0)
  bonuses           Float     @default(0)
  deductions        Float     @default(0)
  
  // Timing
  scheduledFor      DateTime
  initiatedAt       DateTime?
  completedAt       DateTime?
  failedAt          DateTime?
  failureReason     String?
  
  createdAt         DateTime  @default(now())
  
  driver            Driver    @relation(fields: [driverId], references: [id])
  
  @@index([driverId, status])
  @@index([scheduledFor])
}

enum PayoutStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
  CANCELLED
}

model DriverEarning {
  id              String    @id @default(uuid())
  driverId        String
  tripId          String
  payoutId        String?
  
  type            EarningType
  amount          Float
  description     String?
  
  createdAt       DateTime  @default(now())
  
  driver          Driver    @relation(fields: [driverId], references: [id])
  trip            Trip      @relation(fields: [tripId], references: [id])
  payout          DriverPayout? @relation(fields: [payoutId], references: [id])
  
  @@index([driverId, createdAt])
}

enum EarningType {
  TRIP_BASE
  TRIP_MILEAGE
  TRIP_TIME
  TIP
  BONUS
  ADJUSTMENT
  DEDUCTION
}
```

**API Endpoints:**

```
POST /drivers/me/payout-account/setup
Response: { "onboardingUrl": "https://connect.stripe.com/..." }

GET /drivers/me/payout-account
Response: {
  "onboardingComplete": true,
  "chargesEnabled": true,
  "payoutsEnabled": true,
  "payoutSchedule": "WEEKLY",
  "nextPayoutDate": "2026-01-20",
  "pendingBalance": 523.45
}

GET /drivers/me/earnings
Query: ?startDate=2026-01-01&endDate=2026-01-15
Response: {
  "totalEarnings": 1250.00,
  "tripEarnings": 1150.00,
  "tips": 85.00,
  "bonuses": 15.00,
  "deductions": 0,
  "trips": 28,
  "breakdown": [...]
}

GET /drivers/me/payouts
Response: [{ ...payout history }]

POST /drivers/me/payouts/instant
Body: { "amount": 100.00 }
Response: { "payoutId": "uuid", "fee": 1.50, "netAmount": 98.50 }
```

**Payout Calculation:**

```typescript
function calculateDriverPayout(driverId: string, periodStart: Date, periodEnd: Date) {
  const earnings = await getEarningsForPeriod(driverId, periodStart, periodEnd);
  
  const tripEarnings = earnings
    .filter(e => e.type === 'TRIP_BASE' || e.type === 'TRIP_MILEAGE' || e.type === 'TRIP_TIME')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const tips = earnings
    .filter(e => e.type === 'TIP')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const bonuses = earnings
    .filter(e => e.type === 'BONUS')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const deductions = earnings
    .filter(e => e.type === 'DEDUCTION')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const total = tripEarnings + tips + bonuses - deductions;
  
  return {
    tripEarnings,
    tips,
    bonuses,
    deductions,
    total
  };
}
```

---

### 4.3 QuickBooks Integration

**Sync Operations:**

| Direction | Data | Frequency |
|-----------|------|-----------|
| Export | Invoices | Real-time on create |
| Export | Payments | Real-time on receive |
| Export | Customers (Facilities) | On create/update |
| Import | Payment status | Daily sync |

**Database:**

```prisma
model QuickBooksSync {
  id                String    @id @default(uuid())
  entityType        String    // "invoice", "payment", "customer"
  entityId          String    // Our ID
  quickBooksId      String    // QB ID
  lastSyncAt        DateTime
  lastSyncStatus    SyncStatus
  lastSyncError     String?
  
  @@unique([entityType, entityId])
  @@index([lastSyncAt])
}

enum SyncStatus {
  SYNCED
  PENDING
  FAILED
  CONFLICT
}

model QuickBooksConfig {
  id                String    @id @default(uuid())
  realmId           String    @unique // QuickBooks company ID
  accessToken       String    // Encrypted
  refreshToken      String    // Encrypted
  tokenExpiresAt    DateTime
  
  // Mapping
  incomeAccountId   String?
  receivableAccountId String?
  defaultTaxCodeId  String?
  
  isActive          Boolean   @default(true)
  lastSyncAt        DateTime?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

**API Endpoints:**

```
POST /integrations/quickbooks/connect
Response: { "authUrl": "https://appcenter.intuit.com/..." }

GET /integrations/quickbooks/callback
Query: ?code=...&realmId=...

POST /integrations/quickbooks/sync
Body: { "entityType": "invoices", "entityIds": ["uuid1", "uuid2"] }

GET /integrations/quickbooks/status
Response: {
  "connected": true,
  "companyName": "ABC Transport LLC",
  "lastSyncAt": "2026-01-15T10:30:00Z",
  "pendingSync": 5,
  "failedSync": 0
}

POST /integrations/quickbooks/disconnect
```

**Invoice Sync Payload:**

```typescript
interface QuickBooksInvoice {
  Line: [{
    Amount: number;
    Description: string;
    DetailType: "SalesItemLineDetail";
    SalesItemLineDetail: {
      ItemRef: { value: string };
      Qty: number;
      UnitPrice: number;
    }
  }];
  CustomerRef: { value: string };
  DueDate: string;
  DocNumber: string; // Our invoice number
  TxnDate: string;
  BillEmail: { Address: string };
  PrivateNote: string;
}
```

---

## 5. Vehicle & Fleet Management

### 5.1 Inspection Scheduling

**Inspection Types:**

| Type | Frequency | Required By |
|------|-----------|-------------|
| Pre-trip | Daily | Driver before first trip |
| Post-trip | Daily | Driver after last trip |
| Weekly safety | Weekly | Operations |
| Monthly maintenance | Monthly | Mechanic |
| DOT inspection | Annual | DOT certified |

**Database:**

```prisma
model InspectionSchedule {
  id              String    @id @default(uuid())
  vehicleId       String
  inspectionType  InspectionType
  frequency       InspectionFrequency
  lastCompleted   DateTime?
  nextDue         DateTime
  assignedTo      String?   // Driver or mechanic user ID
  
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
  
  @@index([nextDue])
}

enum InspectionType {
  PRE_TRIP
  POST_TRIP
  WEEKLY_SAFETY
  MONTHLY_MAINTENANCE
  DOT_ANNUAL
  STATE_SAFETY
}

enum InspectionFrequency {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  ANNUAL
}

model VehicleInspection {
  id              String    @id @default(uuid())
  vehicleId       String
  scheduleId      String?
  inspectorId     String    // Driver or mechanic
  type            InspectionType
  
  // Status
  status          InspectionStatus @default(IN_PROGRESS)
  passedAll       Boolean?
  
  // Checklist results
  checklistItems  Json      // Array of { item, passed, notes, photoUrl? }
  
  // Issues found
  issuesFound     VehicleIssue[]
  
  // Timing
  startedAt       DateTime  @default(now())
  completedAt     DateTime?
  
  // Location (for pre-trip)
  latitude        Float?
  longitude       Float?
  odometerReading Int?
  
  notes           String?
  signatureUrl    String?   // Driver signature
  
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
  inspector       User      @relation(fields: [inspectorId], references: [id])
}

enum InspectionStatus {
  IN_PROGRESS
  PASSED
  FAILED
  NEEDS_REVIEW
}

model VehicleIssue {
  id              String    @id @default(uuid())
  vehicleId       String
  inspectionId    String?
  reportedBy      String
  
  category        IssueCategory
  severity        IssueSeverity
  description     String
  photoUrls       String[]
  
  status          IssueStatus @default(OPEN)
  
  // Resolution
  resolvedBy      String?
  resolvedAt      DateTime?
  resolution      String?
  cost            Float?
  
  createdAt       DateTime  @default(now())
  
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
  inspection      VehicleInspection? @relation(fields: [inspectionId], references: [id])
}

enum IssueCategory {
  ENGINE
  BRAKES
  TIRES
  LIGHTS
  WHEELCHAIR_LIFT
  INTERIOR
  EXTERIOR
  SAFETY_EQUIPMENT
  OTHER
}

enum IssueSeverity {
  LOW         // Cosmetic, can wait
  MEDIUM      // Should fix soon
  HIGH        // Fix before next use
  CRITICAL    // Vehicle out of service
}

enum IssueStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  WONT_FIX
}
```

**Pre-Trip Checklist Items:**

```typescript
const PRE_TRIP_CHECKLIST = [
  { category: 'exterior', item: 'Tires (tread depth, pressure, damage)', required: true },
  { category: 'exterior', item: 'Lights (headlights, brake, turn signals)', required: true },
  { category: 'exterior', item: 'Mirrors (clean, properly adjusted)', required: true },
  { category: 'exterior', item: 'Windshield (cracks, wipers)', required: true },
  { category: 'exterior', item: 'Body damage (dents, scratches)', required: false },
  
  { category: 'interior', item: 'Seat belts functional', required: true },
  { category: 'interior', item: 'Dashboard warning lights', required: true },
  { category: 'interior', item: 'Horn working', required: true },
  { category: 'interior', item: 'Climate control working', required: true },
  { category: 'interior', item: 'Cleanliness', required: false },
  
  { category: 'wheelchair', item: 'Lift/ramp operational', required: true },
  { category: 'wheelchair', item: 'Wheelchair securement straps', required: true },
  { category: 'wheelchair', item: 'Lift door seals properly', required: true },
  
  { category: 'safety', item: 'First aid kit present', required: true },
  { category: 'safety', item: 'Fire extinguisher (charged)', required: true },
  { category: 'safety', item: 'Emergency triangles', required: true },
  { category: 'safety', item: 'Spill kit', required: false },
  
  { category: 'fluids', item: 'Fuel level adequate', required: true },
  { category: 'fluids', item: 'Oil level', required: false },
  { category: 'fluids', item: 'Coolant level', required: false },
];
```

---

### 5.2 Maintenance Tracking

**Database:**

```prisma
model MaintenanceSchedule {
  id              String    @id @default(uuid())
  vehicleId       String
  
  // Schedule type
  type            MaintenanceType
  description     String
  
  // Trigger
  triggerType     MaintenanceTrigger
  intervalMiles   Int?      // Every X miles
  intervalDays    Int?      // Every X days
  
  // Current status
  lastCompletedAt DateTime?
  lastMileage     Int?
  nextDueAt       DateTime?
  nextDueMileage  Int?
  
  // Estimated cost
  estimatedCost   Float?
  estimatedDuration Int?    // Minutes
  
  isActive        Boolean   @default(true)
  
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
}

enum MaintenanceType {
  OIL_CHANGE
  TIRE_ROTATION
  BRAKE_SERVICE
  TRANSMISSION_SERVICE
  COOLANT_FLUSH
  AIR_FILTER
  FUEL_FILTER
  SPARK_PLUGS
  BATTERY_CHECK
  WHEELCHAIR_LIFT_SERVICE
  AC_SERVICE
  GENERAL_INSPECTION
  OTHER
}

enum MaintenanceTrigger {
  MILEAGE
  TIME
  BOTH     // Whichever comes first
}

model MaintenanceRecord {
  id              String    @id @default(uuid())
  vehicleId       String
  scheduleId      String?
  
  type            MaintenanceType
  description     String
  
  // Service details
  serviceDate     DateTime
  mileageAtService Int
  
  performedBy     String?   // Mechanic/shop name
  performedById   String?   // If internal user
  location        String?
  
  // Costs
  laborCost       Float     @default(0)
  partsCost       Float     @default(0)
  totalCost       Float
  
  // Parts used
  partsUsed       Json?     // Array of { partName, partNumber, quantity, cost }
  
  // Documentation
  notes           String?
  invoiceUrl      String?
  receiptUrl      String?
  
  createdAt       DateTime  @default(now())
  
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
}
```

**Maintenance Alerts:**

```typescript
async function checkMaintenanceAlerts() {
  const alerts = [];
  
  // Check mileage-based maintenance
  const vehicles = await getActiveVehicles();
  
  for (const vehicle of vehicles) {
    const schedules = await getMaintenanceSchedules(vehicle.id);
    
    for (const schedule of schedules) {
      const milesUntilDue = schedule.nextDueMileage - vehicle.currentMileage;
      const daysUntilDue = differenceInDays(schedule.nextDueAt, new Date());
      
      if (milesUntilDue <= 500 || daysUntilDue <= 7) {
        alerts.push({
          vehicleId: vehicle.id,
          vehicleName: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
          maintenanceType: schedule.type,
          severity: milesUntilDue <= 0 || daysUntilDue <= 0 ? 'CRITICAL' : 'WARNING',
          message: `${schedule.description} due in ${milesUntilDue} miles or ${daysUntilDue} days`,
        });
      }
    }
  }
  
  return alerts;
}
```

---

### 5.3 Document Expiry Alerts

**Alert Schedule:**

| Days Before Expiry | Action |
|-------------------|--------|
| 90 days | Email to admin + in-app alert |
| 60 days | Email + SMS to admin |
| 30 days | Daily reminder, flag vehicle |
| 14 days | Email to operations manager |
| 7 days | Critical alert, consider vehicle out-of-service |
| 0 days | Vehicle automatically marked unavailable |

**Database:**

```prisma
model DocumentExpiryAlert {
  id              String    @id @default(uuid())
  documentType    String    // "vehicle_insurance", "driver_license", etc.
  documentId      String
  ownerId         String    // Vehicle or driver ID
  ownerType       String    // "vehicle" or "driver"
  
  expiryDate      DateTime
  alertsSent      Int       @default(0)
  lastAlertSentAt DateTime?
  
  status          AlertStatus @default(PENDING)
  acknowledgedBy  String?
  acknowledgedAt  DateTime?
  
  createdAt       DateTime  @default(now())
  
  @@index([expiryDate])
  @@index([status])
}
```

**Cron Job:**

```typescript
// Run daily at 8 AM
async function checkDocumentExpiries() {
  const today = new Date();
  
  // Check all document types
  const documentTypes = [
    { model: 'VehicleDocument', ownerType: 'vehicle' },
    { model: 'DriverDocument', ownerType: 'driver' },
  ];
  
  for (const { model, ownerType } of documentTypes) {
    const expiringDocs = await prisma[model].findMany({
      where: {
        expiryDate: {
          lte: addDays(today, 90),
          gt: today,
        },
        isActive: true,
      },
    });
    
    for (const doc of expiringDocs) {
      const daysUntilExpiry = differenceInDays(doc.expiryDate, today);
      
      if (shouldSendAlert(daysUntilExpiry, doc)) {
        await sendExpiryAlert(doc, daysUntilExpiry, ownerType);
      }
    }
  }
  
  // Auto-deactivate expired
  await deactivateExpiredDocuments();
}

function shouldSendAlert(daysUntil: number, doc: Document): boolean {
  const alertDays = [90, 60, 30, 14, 7, 3, 1, 0];
  return alertDays.includes(daysUntil);
}
```

---

### 5.4 Mileage Tracking

**Database:**

```prisma
model MileageLog {
  id              String    @id @default(uuid())
  vehicleId       String
  driverId        String?
  tripId          String?
  
  // Reading
  readingType     MileageReadingType
  odometerReading Int
  
  // Calculated
  milesDriven     Int?      // Delta from previous reading
  
  // Location
  latitude        Float?
  longitude       Float?
  location        String?
  
  // Photo proof
  photoUrl        String?
  
  notes           String?
  recordedAt      DateTime  @default(now())
  
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id])
  driver          Driver?   @relation(fields: [driverId], references: [id])
  trip            Trip?     @relation(fields: [tripId], references: [id])
  
  @@index([vehicleId, recordedAt])
}

enum MileageReadingType {
  START_OF_DAY
  END_OF_DAY
  TRIP_START
  TRIP_END
  FUEL_STOP
  MANUAL
}
```

**API Endpoints:**

```
POST /vehicles/:id/mileage
Body: {
  "odometerReading": 45230,
  "readingType": "START_OF_DAY",
  "photoUrl": "https://...",
  "latitude": 29.7604,
  "longitude": -95.3698
}

GET /vehicles/:id/mileage
Query: ?startDate=2026-01-01&endDate=2026-01-31
Response: {
  "totalMiles": 2450,
  "averageDaily": 79,
  "logs": [...]
}

GET /reports/mileage
Query: ?vehicleId=uuid&startDate=...&endDate=...
Response: {
  "summary": {
    "totalMiles": 2450,
    "businessMiles": 2400,
    "personalMiles": 50,
    "fuelEfficiency": 18.5 // mpg
  },
  "byDriver": [...],
  "byDay": [...]
}
```

---

## 6. Service Area & Validation

### 6.1 Address Validation Against Service Area

**Implementation:**

```typescript
interface ServiceAreaConfig {
  polygon: GeoJSON.Polygon;
  bufferMiles: number;     // Allow addresses slightly outside
  strictMode: boolean;     // Reject vs warn
}

async function validateAddress(
  address: Address,
  config: ServiceAreaConfig
): Promise<AddressValidationResult> {
  // Geocode address
  const geocoded = await geocodeAddress(address);
  
  if (!geocoded.success) {
    return {
      valid: false,
      error: 'GEOCODE_FAILED',
      message: 'Could not verify this address',
    };
  }
  
  // Check if in service area
  const point = turf.point([geocoded.lng, geocoded.lat]);
  const bufferedPolygon = turf.buffer(config.polygon, config.bufferMiles, { units: 'miles' });
  const isInArea = turf.booleanPointInPolygon(point, bufferedPolygon);
  
  if (!isInArea) {
    if (config.strictMode) {
      return {
        valid: false,
        error: 'OUT_OF_SERVICE_AREA',
        message: 'This address is outside our service area',
        coordinates: { lat: geocoded.lat, lng: geocoded.lng },
      };
    } else {
      // Calculate distance to nearest point in service area
      const distance = calculateDistanceToServiceArea(point, config.polygon);
      
      return {
        valid: true,
        warning: 'OUTSIDE_SERVICE_AREA',
        message: `This address is ${distance.toFixed(1)} miles outside our normal service area`,
        outOfAreaFee: calculateOutOfAreaFee(distance),
        coordinates: { lat: geocoded.lat, lng: geocoded.lng },
      };
    }
  }
  
  return {
    valid: true,
    coordinates: { lat: geocoded.lat, lng: geocoded.lng },
    formattedAddress: geocoded.formattedAddress,
  };
}
```

**API Endpoint:**

```
POST /addresses/validate
Body: {
  "street": "123 Main St",
  "city": "Houston",
  "state": "TX",
  "zipCode": "77001"
}
Response: {
  "valid": true,
  "inServiceArea": true,
  "coordinates": { "lat": 29.7604, "lng": -95.3698 },
  "formattedAddress": "123 Main St, Houston, TX 77001",
  "outOfAreaFee": null
}

// Or if outside:
Response: {
  "valid": true,
  "inServiceArea": false,
  "warning": "Address is 3.2 miles outside service area",
  "outOfAreaFee": 15.00,
  "coordinates": { "lat": 29.9000, "lng": -95.5000 }
}
```

---

### 6.2 Out-of-Area Fee Handling

**Fee Structure:**

| Distance Outside | Fee |
|-----------------|-----|
| 0-5 miles | $15.00 |
| 5-10 miles | $25.00 |
| 10-15 miles | $40.00 |
| 15-20 miles | $60.00 |
| 20+ miles | Request quote / decline |

**Database:**

```prisma
model ServiceArea {
  id              String    @id @default(uuid())
  name            String
  polygon         Json      // GeoJSON polygon
  isActive        Boolean   @default(true)
  isPrimary       Boolean   @default(false)
  
  // Fee settings
  allowOutOfArea  Boolean   @default(true)
  maxOutOfAreaMiles Float   @default(20)
  outOfAreaFees   Json      // Array of { maxMiles, fee }
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Pricing Integration:**

```typescript
function calculateTripPrice(trip: TripInput): PriceBreakdown {
  const basePrice = calculateBasePrice(trip);
  
  // Check service area
  const pickupValidation = await validateAddress(trip.pickupAddress, serviceAreaConfig);
  const dropoffValidation = await validateAddress(trip.dropoffAddress, serviceAreaConfig);
  
  let outOfAreaFee = 0;
  
  if (!pickupValidation.inServiceArea) {
    outOfAreaFee = Math.max(outOfAreaFee, pickupValidation.outOfAreaFee || 0);
  }
  
  if (!dropoffValidation.inServiceArea) {
    outOfAreaFee = Math.max(outOfAreaFee, dropoffValidation.outOfAreaFee || 0);
  }
  
  return {
    ...basePrice,
    outOfAreaFee,
    total: basePrice.total + outOfAreaFee,
  };
}
```

---

## 7. Reporting & Analytics

### 7.1 CSV/Excel Export

**Exportable Reports:**

| Report | Fields | Formats |
|--------|--------|---------|
| Trips | All trip details | CSV, XLSX, PDF |
| Revenue | Date, trips, revenue, fees | CSV, XLSX |
| Driver Performance | Name, trips, rating, earnings | CSV, XLSX |
| Invoices | All invoice details | CSV, XLSX, PDF |
| Patient List | Name, contact, medical needs | CSV, XLSX |
| Facility Summary | Trips, spending, patients | CSV, XLSX |

**API Endpoints:**

```
POST /reports/export
Body: {
  "reportType": "trips",
  "format": "xlsx",
  "filters": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "status": ["COMPLETED"],
    "driverId": null
  },
  "columns": ["tripNumber", "date", "patient", "driver", "fare"]
}
Response: {
  "exportId": "uuid",
  "status": "processing",
  "estimatedSeconds": 30
}

GET /reports/export/:id
Response: {
  "exportId": "uuid",
  "status": "completed",
  "downloadUrl": "https://...",
  "expiresAt": "2026-01-15T12:00:00Z",
  "rowCount": 1500,
  "fileSize": 245000
}
```

**Implementation:**

```typescript
import ExcelJS from 'exceljs';

async function exportToExcel(data: any[], columns: ColumnDef[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');
  
  // Add headers
  worksheet.columns = columns.map(col => ({
    header: col.label,
    key: col.key,
    width: col.width || 15,
  }));
  
  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };
  
  // Add data
  worksheet.addRows(data);
  
  // Auto-filter
  worksheet.autoFilter = {
    from: 'A1',
    to: `${String.fromCharCode(64 + columns.length)}1`,
  };
  
  return workbook.xlsx.writeBuffer();
}
```

---

### 7.2 Actual vs Estimated Comparison

**Database:**

```prisma
model TripEstimateAccuracy {
  id                  String    @id @default(uuid())
  tripId              String    @unique
  
  // Estimated values
  estimatedDistance   Float     // miles
  estimatedDuration   Int       // minutes
  estimatedFare       Float
  estimatedPickupTime DateTime
  
  // Actual values
  actualDistance      Float?
  actualDuration      Int?
  actualFare          Float?
  actualPickupTime    DateTime?
  
  // Variances
  distanceVariance    Float?    // percentage
  durationVariance    Float?    // percentage
  fareVariance        Float?    // percentage
  pickupVariance      Int?      // minutes early/late
  
  // Contributing factors
  trafficCondition    String?   // "light", "moderate", "heavy"
  weatherCondition    String?
  routeDeviation      Boolean?
  notes               String?
  
  createdAt           DateTime  @default(now())
  
  trip                Trip      @relation(fields: [tripId], references: [id])
}
```

**Calculation:**

```typescript
async function calculateTripAccuracy(tripId: string): Promise<TripAccuracy> {
  const trip = await getCompletedTrip(tripId);
  
  const distanceVariance = ((trip.actualDistance - trip.estimatedDistance) / trip.estimatedDistance) * 100;
  const durationVariance = ((trip.actualDuration - trip.estimatedDuration) / trip.estimatedDuration) * 100;
  const fareVariance = ((trip.actualFare - trip.estimatedFare) / trip.estimatedFare) * 100;
  const pickupVariance = differenceInMinutes(trip.actualPickupTime, trip.estimatedPickupTime);
  
  return {
    tripId,
    distanceVariance: Math.round(distanceVariance * 10) / 10,
    durationVariance: Math.round(durationVariance * 10) / 10,
    fareVariance: Math.round(fareVariance * 10) / 10,
    pickupVariance,
    isAccurate: Math.abs(durationVariance) <= 15 && Math.abs(pickupVariance) <= 10,
  };
}
```

**Analytics Dashboard:**

```
GET /analytics/accuracy
Query: ?startDate=2026-01-01&endDate=2026-01-31
Response: {
  "summary": {
    "totalTrips": 2500,
    "accurateTrips": 2125,
    "accuracyRate": 85.0,
    "averagePickupVariance": 4.2, // minutes
    "averageDurationVariance": 8.5 // percentage
  },
  "byTimeOfDay": [
    { "hour": 8, "accuracyRate": 82.0, "avgPickupVariance": 5.1 },
    { "hour": 9, "accuracyRate": 78.0, "avgPickupVariance": 7.2 },
    // ...
  ],
  "byDriver": [...],
  "worstRoutes": [
    { "from": "Downtown", "to": "Medical Center", "avgVariance": 15.2 }
  ]
}
```

---

## 8. System Features

### 8.1 Rate Limiting

**Limits:**

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Password reset | 3 requests | 1 hour |
| API (authenticated) | 100 requests | 1 minute |
| API (public) | 20 requests | 1 minute |
| File upload | 10 requests | 1 minute |
| Report export | 5 requests | 1 hour |
| Webhooks | 1000 events | 1 minute |

**Response Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

**Rate Limit Exceeded Response:**

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

**Implementation:**

```typescript
import { RateLimiterRedis } from 'rate-limiter-flexible';

const rateLimiters = {
  auth: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl:auth',
    points: 5,
    duration: 60,
  }),
  api: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl:api',
    points: 100,
    duration: 60,
  }),
};

async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.user?.id || req.ip;
  const limiter = req.path.startsWith('/auth') ? rateLimiters.auth : rateLimiters.api;
  
  try {
    const result = await limiter.consume(key);
    res.set({
      'X-RateLimit-Limit': limiter.points,
      'X-RateLimit-Remaining': result.remainingPoints,
      'X-RateLimit-Reset': Math.floor(Date.now() / 1000) + result.msBeforeNext / 1000,
    });
    next();
  } catch (error) {
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(error.msBeforeNext / 1000),
    });
  }
}
```

---

### 8.2 Error Handling

**Error Response Format:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "phone", "message": "Phone number is required" }
    ],
    "requestId": "req_abc123",
    "timestamp": "2026-01-15T10:30:00Z"
  }
}
```

**Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Maintenance/overload |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `TRIP_CONFLICT` | 409 | Driver already assigned |
| `OUT_OF_SERVICE_AREA` | 400 | Address outside area |
| `ACCOUNT_LOCKED` | 423 | Account is locked |

**Global Error Handler:**

```typescript
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  // Log error
  logger.error({
    requestId,
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });
  
  // Send Sentry/error tracking
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(err, { extra: { requestId } });
  }
  
  // Determine response
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details,
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: err.message,
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  // Default 500 error
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId,
      timestamp: new Date().toISOString(),
    },
  });
}
```

---

### 8.3 Background Jobs

**Job Types:**

| Job | Schedule | Description |
|-----|----------|-------------|
| `generate-standing-order-trips` | Daily 12:00 AM | Create trips from standing orders |
| `send-trip-reminders` | Every 15 min | Send 24h and 1h reminders |
| `expire-will-calls` | Every hour | Expire old will-call trips |
| `check-document-expiry` | Daily 8:00 AM | Send expiry alerts |
| `check-maintenance-due` | Daily 8:00 AM | Send maintenance alerts |
| `sync-quickbooks` | Every 30 min | Sync invoices/payments |
| `calculate-driver-payouts` | Weekly Sunday 11 PM | Calculate weekly payouts |
| `process-payouts` | Weekly Monday 6 AM | Initiate Stripe payouts |
| `cleanup-expired-tokens` | Daily 3:00 AM | Remove old auth tokens |
| `generate-reports` | Daily 1:00 AM | Pre-generate common reports |
| `backup-database` | Daily 2:00 AM | Database backup |

**Database:**

```prisma
model ScheduledJob {
  id              String    @id @default(uuid())
  jobType         String
  status          JobStatus @default(PENDING)
  
  // Schedule
  scheduledFor    DateTime
  startedAt       DateTime?
  completedAt     DateTime?
  
  // Execution
  attempts        Int       @default(0)
  maxAttempts     Int       @default(3)
  lastError       String?
  
  // Payload
  payload         Json?
  result          Json?
  
  // Reference
  referenceId     String?   // Related entity ID
  referenceType   String?   // "standing_order", "invoice", etc.
  
  createdAt       DateTime  @default(now())
  
  @@index([status, scheduledFor])
  @@index([jobType, status])
}

enum JobStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

model JobLog {
  id              String    @id @default(uuid())
  jobId           String
  level           String    // "info", "warn", "error"
  message         String
  data            Json?
  timestamp       DateTime  @default(now())
  
  job             ScheduledJob @relation(fields: [jobId], references: [id])
  
  @@index([jobId, timestamp])
}
```

**Implementation (Bull Queue):**

```typescript
import Queue from 'bull';

const jobQueues = {
  tripReminders: new Queue('trip-reminders', redisUrl),
  standingOrders: new Queue('standing-orders', redisUrl),
  payouts: new Queue('payouts', redisUrl),
  notifications: new Queue('notifications', redisUrl),
};

// Schedule recurring jobs
jobQueues.tripReminders.add({}, { repeat: { cron: '*/15 * * * *' } }); // Every 15 min
jobQueues.standingOrders.add({}, { repeat: { cron: '0 0 * * *' } }); // Daily midnight

// Process jobs
jobQueues.tripReminders.process(async (job) => {
  const trips = await getTripsNeedingReminder();
  
  for (const trip of trips) {
    await sendTripReminder(trip);
  }
  
  return { processed: trips.length };
});

// Retry failed jobs
jobQueues.payouts.on('failed', async (job, err) => {
  if (job.attemptsMade < job.opts.attempts) {
    await job.retry();
  } else {
    await notifyAdminOfFailedJob(job, err);
  }
});
```

**Admin API:**

```
GET /admin/jobs
Query: ?status=FAILED&jobType=payouts
Response: { "jobs": [...] }

POST /admin/jobs/:id/retry
Response: { "success": true }

POST /admin/jobs/:id/cancel
Response: { "success": true }

GET /admin/jobs/stats
Response: {
  "pending": 15,
  "running": 2,
  "completedToday": 145,
  "failedToday": 3,
  "byType": {
    "tripReminders": { "pending": 0, "completed": 96, "failed": 0 },
    "standingOrders": { "pending": 0, "completed": 1, "failed": 0 }
  }
}
```

---

## 9. Accessibility Enhancements

### 9.1 Voice Commands (Web Speech API)

**Supported Commands:**

| Command | Action |
|---------|--------|
| "Book a ride" | Open booking form |
| "Show my rides" | Navigate to rides list |
| "Track my ride" | Open current ride tracking |
| "Call driver" | Initiate call to driver |
| "Cancel ride" | Open cancellation dialog |
| "Help" | Open help/FAQ |
| "Go back" | Navigate back |
| "Scroll down/up" | Scroll page |
| "Read page" | Read main content aloud |

**Implementation:**

```typescript
class VoiceCommands {
  private recognition: SpeechRecognition;
  private synthesis: SpeechSynthesis;
  
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.synthesis = window.speechSynthesis;
    
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    
    this.recognition.onresult = this.handleResult.bind(this);
  }
  
  start() {
    this.recognition.start();
    this.speak('Voice commands activated. Say "help" for available commands.');
  }
  
  stop() {
    this.recognition.stop();
  }
  
  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    this.synthesis.speak(utterance);
  }
  
  handleResult(event: SpeechRecognitionEvent) {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    
    const commands: Record<string, () => void> = {
      'book a ride': () => router.push('/book'),
      'show my rides': () => router.push('/rides'),
      'track my ride': () => router.push('/track'),
      'call driver': () => this.callDriver(),
      'cancel ride': () => this.openCancelDialog(),
      'help': () => this.listCommands(),
      'go back': () => router.back(),
      'scroll down': () => window.scrollBy(0, 300),
      'scroll up': () => window.scrollBy(0, -300),
      'read page': () => this.readPageContent(),
    };
    
    for (const [command, action] of Object.entries(commands)) {
      if (transcript.includes(command)) {
        this.speak(`Executing: ${command}`);
        action();
        return;
      }
    }
    
    this.speak("Sorry, I didn't understand that command. Say 'help' for available commands.");
  }
  
  listCommands() {
    this.speak('Available commands: Book a ride, Show my rides, Track my ride, Call driver, Cancel ride, Go back, Scroll down, Scroll up, Read page');
  }
}
```

**Settings:**

```typescript
interface VoiceSettings {
  enabled: boolean;
  voiceSpeed: 'slow' | 'normal' | 'fast';
  voicePitch: 'low' | 'normal' | 'high';
  confirmActions: boolean;  // Require confirmation for destructive actions
  readNotifications: boolean;
}
```

---

## 10. Operations & Live Map

### 10.1 Live Map Implementation

**Technology:** Google Maps JavaScript API + WebSocket

**Features:**

| Feature | Description |
|---------|-------------|
| Driver markers | Real-time position with heading |
| Trip routes | Active trip routes displayed |
| Status colors | Markers colored by driver status |
| Clustering | Cluster nearby drivers at zoom levels |
| Geofences | Display service area boundaries |
| Trip info | Click driver for trip details |
| Filters | Filter by status, vehicle type |
| Auto-center | Center on active area |

**Implementation:**

```typescript
interface MapDriver {
  id: string;
  name: string;
  status: DriverStatus;
  location: { lat: number; lng: number };
  heading: number;
  speed: number;
  currentTrip?: {
    id: string;
    tripNumber: string;
    status: TripStatus;
    pickup: { lat: number; lng: number };
    dropoff: { lat: number; lng: number };
    patientName: string;
  };
  vehicle: {
    type: VehicleType;
    licensePlate: string;
  };
  lastUpdate: Date;
}

const DRIVER_STATUS_COLORS = {
  ONLINE: '#22c55e',      // Green
  OFFLINE: '#6b7280',     // Gray
  ON_TRIP: '#3b82f6',     // Blue
  BREAK: '#f59e0b',       // Amber
};

class LiveMap {
  private map: google.maps.Map;
  private markers: Map<string, google.maps.Marker> = new Map();
  private routes: Map<string, google.maps.Polyline> = new Map();
  private infoWindow: google.maps.InfoWindow;
  private socket: WebSocket;
  
  constructor(element: HTMLElement) {
    this.map = new google.maps.Map(element, {
      center: { lat: 29.7604, lng: -95.3698 }, // Houston
      zoom: 11,
      mapTypeControl: false,
    });
    
    this.infoWindow = new google.maps.InfoWindow();
    this.connectWebSocket();
  }
  
  connectWebSocket() {
    this.socket = new WebSocket('wss://api.example.com/ws');
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'driver_location') {
        this.updateDriverMarker(data.payload);
      }
    };
  }
  
  updateDriverMarker(driver: MapDriver) {
    let marker = this.markers.get(driver.id);
    
    if (!marker) {
      marker = new google.maps.Marker({
        map: this.map,
        icon: this.getDriverIcon(driver),
      });
      
      marker.addListener('click', () => this.showDriverInfo(driver));
      this.markers.set(driver.id, marker);
    }
    
    marker.setPosition(driver.location);
    marker.setIcon(this.getDriverIcon(driver));
    
    // Update route if on trip
    if (driver.currentTrip) {
      this.updateTripRoute(driver);
    }
  }
  
  getDriverIcon(driver: MapDriver): google.maps.Icon {
    return {
      url: `/icons/vehicle-${driver.vehicle.type.toLowerCase()}.svg`,
      scaledSize: new google.maps.Size(40, 40),
      rotation: driver.heading,
    };
  }
  
  showDriverInfo(driver: MapDriver) {
    const content = `
      <div class="p-4">
        <h3 class="font-bold">${driver.name}</h3>
        <p>${driver.vehicle.licensePlate}</p>
        <p>Status: ${driver.status}</p>
        ${driver.currentTrip ? `
          <div class="mt-2 pt-2 border-t">
            <p><strong>Current Trip:</strong> ${driver.currentTrip.tripNumber}</p>
            <p>Patient: ${driver.currentTrip.patientName}</p>
            <p>Status: ${driver.currentTrip.status}</p>
          </div>
        ` : ''}
        <button onclick="viewDriverDetail('${driver.id}')" class="mt-2 btn-primary">
          View Details
        </button>
      </div>
    `;
    
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, this.markers.get(driver.id));
  }
}
```

---

## 11. Facility Features

### 11.1 Bulk Booking

**Use Case:** Facility books 10 patients for dialysis at same time

**Database:**

```prisma
model BulkBooking {
  id              String    @id @default(uuid())
  facilityId      String
  createdBy       String
  
  // Shared details
  scheduledDate   DateTime  @db.Date
  pickupTime      String    // "08:00"
  dropoffAddress  String
  dropoffLat      Float
  dropoffLng      Float
  
  // Status
  status          BulkBookingStatus @default(DRAFT)
  totalTrips      Int
  confirmedTrips  Int       @default(0)
  failedTrips     Int       @default(0)
  
  // Errors
  errors          Json?
  
  processedAt     DateTime?
  createdAt       DateTime  @default(now())
  
  trips           Trip[]
  facility        Facility  @relation(fields: [facilityId], references: [id])
}

enum BulkBookingStatus {
  DRAFT
  PROCESSING
  COMPLETED
  PARTIAL_SUCCESS
  FAILED
}
```

**API:**

```
POST /facilities/:id/bulk-booking
Body: {
  "scheduledDate": "2026-01-15",
  "pickupTime": "08:00",
  "dropoffAddress": "Dialysis Center, 456 Medical Dr",
  "dropoffLat": 29.7893,
  "dropoffLng": -95.3890,
  "patients": [
    { "patientId": "uuid1", "pickupAddressId": "addr1" },
    { "patientId": "uuid2", "pickupAddressId": "addr2" },
    { "patientId": "uuid3", "pickupAddressId": "addr3" }
  ],
  "includeReturn": true,
  "returnType": "WILL_CALL"
}
Response: {
  "bulkBookingId": "uuid",
  "status": "PROCESSING",
  "totalTrips": 3
}

GET /facilities/:id/bulk-booking/:bookingId
Response: {
  "id": "uuid",
  "status": "COMPLETED",
  "totalTrips": 3,
  "confirmedTrips": 3,
  "failedTrips": 0,
  "trips": [
    { "tripId": "uuid", "tripNumber": "TR-001", "patientName": "John Smith", "status": "CONFIRMED" },
    { "tripId": "uuid", "tripNumber": "TR-002", "patientName": "Mary Jones", "status": "CONFIRMED" },
    { "tripId": "uuid", "tripNumber": "TR-003", "patientName": "Bob Wilson", "status": "CONFIRMED" }
  ]
}
```

---

### 11.2 Custom Contract Rates

**Database:**

```prisma
model FacilityContract {
  id              String    @id @default(uuid())
  facilityId      String    @unique
  
  // Contract terms
  startDate       DateTime  @db.Date
  endDate         DateTime? @db.Date
  autoRenew       Boolean   @default(true)
  
  // Pricing type
  pricingType     ContractPricingType
  
  // Custom rates (if CUSTOM)
  baseFare        Float?
  perMileRate     Float?
  perMinuteRate   Float?
  minimumFare     Float?
  
  // Discount (if DISCOUNT)
  discountPercent Float?
  
  // Volume pricing (if VOLUME)
  volumeTiers     Json?     // Array of { minTrips, discountPercent }
  
  // Billing
  billingCycle    BillingCycle @default(MONTHLY)
  paymentTerms    Int       @default(30)  // Net 30
  creditLimit     Float?
  
  // Surcharge overrides
  surchargeOverrides Json?  // { "wheelchair": 10.00, "oxygen": 5.00 }
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  facility        Facility  @relation(fields: [facilityId], references: [id])
}

enum ContractPricingType {
  STANDARD      // Use standard pricing
  DISCOUNT      // Percentage off standard
  CUSTOM        // Custom rates
  VOLUME        // Volume-based discounts
  FLAT_RATE     // Flat rate per trip
}

enum BillingCycle {
  WEEKLY
  BIWEEKLY
  MONTHLY
}
```

**Pricing Integration:**

```typescript
async function calculateFacilityPrice(
  trip: TripInput,
  facilityId: string
): Promise<PriceBreakdown> {
  const contract = await getFacilityContract(facilityId);
  
  if (!contract || contract.pricingType === 'STANDARD') {
    return calculateStandardPrice(trip);
  }
  
  switch (contract.pricingType) {
    case 'DISCOUNT':
      const standardPrice = await calculateStandardPrice(trip);
      return {
        ...standardPrice,
        discount: standardPrice.total * (contract.discountPercent / 100),
        total: standardPrice.total * (1 - contract.discountPercent / 100),
        appliedContract: contract.id,
      };
    
    case 'CUSTOM':
      return calculateCustomPrice(trip, contract);
    
    case 'VOLUME':
      const monthlyTrips = await getMonthlyTripCount(facilityId);
      const tier = findVolumeTier(contract.volumeTiers, monthlyTrips);
      const basePrice = await calculateStandardPrice(trip);
      return {
        ...basePrice,
        volumeDiscount: basePrice.total * (tier.discountPercent / 100),
        total: basePrice.total * (1 - tier.discountPercent / 100),
        appliedContract: contract.id,
        volumeTier: tier.name,
      };
    
    case 'FLAT_RATE':
      return {
        baseFare: contract.flatRate,
        total: contract.flatRate,
        appliedContract: contract.id,
      };
  }
}
```

---

## Summary

This specification document covers ALL previously missing or partially specified features:

| Section | Features Specified |
|---------|-------------------|
| Authentication | Magic link, account lockout, password rules |
| Real-Time | WebSocket, geofencing, push notifications, emergency alerts |
| Notifications | Email templates, SMS templates |
| Payments | Apple/Google Pay, driver payouts, QuickBooks |
| Fleet | Inspections, maintenance, document expiry, mileage |
| Service Area | Address validation, out-of-area fees |
| Reporting | Export, actual vs estimated |
| System | Rate limiting, error handling, background jobs |
| Accessibility | Voice commands |
| Operations | Live map implementation |
| Facility | Bulk booking, contract rates |

**All ⚠️ and ❌ items from FEATURE_AUDIT.md are now fully specified.**

---

*This document ensures complete feature coverage before development begins.*
