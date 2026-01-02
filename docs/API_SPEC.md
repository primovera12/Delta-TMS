# API Specification - Wheelchair Transportation Platform

> **Version:** 2.0
> **Base URL:** `/api/v1`
> **Last Updated:** January 2026

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Patients](#3-patients)
4. [Trips](#4-trips)
5. [Drivers](#5-drivers)
6. [Facilities](#6-facilities)
7. [Payments](#7-payments)
8. [Invoices](#8-invoices)
9. [Notifications](#9-notifications)
10. [Admin](#10-admin)
11. [Analytics](#11-analytics)

---

## API Conventions

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { ... }
  }
}
```

### Pagination

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource conflict |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 1. Authentication

### POST /auth/register

Register a new user.

**Request:**
```json
{
  "email": "patient@example.com",
  "phone": "+15551234567",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Smith",
  "role": "PATIENT",
  "dateOfBirth": "1950-05-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "patient@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "PATIENT",
      "status": "PENDING_VERIFICATION"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 900
  }
}
```

---

### POST /auth/login

Login with email and password.

**Request:**
```json
{
  "email": "patient@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 900,
    "requires2FA": false
  }
}
```

---

### POST /auth/login/phone

Login with phone number (sends OTP).

**Request:**
```json
{
  "phone": "+15551234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent to phone",
    "expiresIn": 300
  }
}
```

---

### POST /auth/verify-otp

Verify phone OTP.

**Request:**
```json
{
  "phone": "+15551234567",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

---

### POST /auth/refresh

Refresh access token.

**Request:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "expiresIn": 900
  }
}
```

---

### POST /auth/logout

Logout and invalidate session.

**Request:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### POST /auth/forgot-password

Request password reset.

**Request:**
```json
{
  "email": "patient@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Reset link sent to email"
  }
}
```

---

### POST /auth/reset-password

Reset password with token.

**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

### POST /auth/2fa/setup

Initialize 2FA setup.

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "otpauth://totp/WheelchairTransport:user@example.com?secret=..."
  }
}
```

---

### POST /auth/2fa/enable

Enable 2FA with verification code.

**Request:**
```json
{
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "backupCodes": ["code1", "code2", ...]
  }
}
```

---

### POST /auth/2fa/verify

Verify 2FA code during login.

**Request:**
```json
{
  "code": "123456",
  "tempToken": "temporary-token-from-login"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

---

## 2. Users

### GET /users/me

Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "patient@example.com",
    "phone": "+15551234567",
    "firstName": "John",
    "lastName": "Smith",
    "role": "PATIENT",
    "status": "ACTIVE",
    "elderMode": false,
    "textSize": "normal",
    "highContrast": false,
    "smsNotificationsEnabled": true,
    "emailNotificationsEnabled": true,
    "medicalProfile": { ... },
    "loyaltyAccount": { ... }
  }
}
```

---

### PUT /users/me

Update current user profile.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "elderMode": true,
  "textSize": "large"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

---

### PUT /users/me/password

Change password.

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

---

### GET /users/me/medical

Get medical profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "mobilityAids": ["wheelchair"],
    "wheelchairType": "manual",
    "oxygenRequired": false,
    "weightLbs": 180,
    "medicalConditions": ["diabetes", "hypertension"],
    "medications": ["metformin", "lisinopril"],
    "allergies": ["penicillin"],
    "emergencyContactName": "Jane Smith",
    "emergencyContactPhone": "+15559876543",
    "emergencyContactRelationship": "spouse"
  }
}
```

---

### PUT /users/me/medical

Update medical profile.

**Request:**
```json
{
  "mobilityAids": ["wheelchair"],
  "oxygenRequired": true,
  "emergencyContactName": "Jane Smith",
  "emergencyContactPhone": "+15559876543"
}
```

---

### GET /users/me/addresses

Get saved addresses.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "label": "Home",
      "addressLine1": "123 Main St",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77001",
      "latitude": 29.7604,
      "longitude": -95.3698,
      "isPrimary": true
    }
  ]
}
```

---

### POST /users/me/addresses

Add saved address.

**Request:**
```json
{
  "label": "Doctor's Office",
  "addressLine1": "456 Medical Center Dr",
  "city": "Houston",
  "state": "TX",
  "zipCode": "77002",
  "latitude": 29.7893,
  "longitude": -95.3890,
  "contactName": "Dr. Johnson",
  "contactPhone": "+15551112222",
  "facilityType": "doctor"
}
```

---

### PUT /users/me/addresses/:id

Update saved address.

---

### DELETE /users/me/addresses/:id

Delete saved address.

---

### GET /users/me/payment-methods

Get saved payment methods.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "CARD",
      "brand": "Visa",
      "lastFourDigits": "4242",
      "expiryMonth": 12,
      "expiryYear": 2026,
      "isDefault": true,
      "nickname": "Personal Visa"
    }
  ]
}
```

---

### POST /users/me/payment-methods

Add payment method.

**Request:**
```json
{
  "stripePaymentMethodId": "pm_xxx",
  "nickname": "Work Card",
  "isDefault": false
}
```

---

### DELETE /users/me/payment-methods/:id

Remove payment method.

---

### GET /users/me/loyalty

Get loyalty account.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentPoints": 2500,
    "lifetimePoints": 5000,
    "tier": "SILVER",
    "tierProgress": 50,
    "nextTier": "GOLD",
    "pointsToNextTier": 2500,
    "referralCode": "JOHNS123",
    "referralCount": 3
  }
}
```

---

## 3. Patients

### GET /patients

List patients (for dispatchers/admins).

**Query Parameters:**
- `search` - Search by name or phone
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": { ... }
}
```

---

### GET /patients/:id

Get patient details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+15551234567",
    "email": "john@example.com",
    "medicalProfile": { ... },
    "savedAddresses": [...],
    "totalTrips": 25,
    "lastTripDate": "2026-01-10"
  }
}
```

---

### POST /patients

Create new patient (dispatcher/admin).

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+15551234567",
  "email": "john@example.com",
  "dateOfBirth": "1950-05-15",
  "medicalProfile": {
    "wheelchairRequired": true,
    "oxygenRequired": false,
    "emergencyContactName": "Jane Smith",
    "emergencyContactPhone": "+15559876543"
  }
}
```

---

### PUT /patients/:id

Update patient.

---

### GET /patients/:id/trips

Get patient's trip history.

**Query Parameters:**
- `status` - Filter by status
- `page` - Page number
- `limit` - Items per page

---

## 4. Trips

### POST /trips/quote

Get price quote for a trip.

**Request:**
```json
{
  "pickupLatitude": 29.7604,
  "pickupLongitude": -95.3698,
  "dropoffLatitude": 29.7893,
  "dropoffLongitude": -95.3890,
  "scheduledTime": "2026-01-15T10:00:00Z",
  "vehicleType": "WHEELCHAIR_ACCESSIBLE",
  "wheelchairRequired": true,
  "oxygenRequired": false,
  "companionCount": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "baseFare": 25.00,
    "distanceFare": 12.50,
    "distanceMiles": 5.0,
    "timeFare": 6.00,
    "estimatedMinutes": 12,
    "surcharges": [
      { "label": "Wheelchair", "amount": 15.00 },
      { "label": "Companion(s) × 1", "amount": 5.00 }
    ],
    "surchargeTotal": 20.00,
    "subtotal": 63.50,
    "timeMultiplier": 1.0,
    "timeMultiplierLabel": "",
    "timeMultiplierAmount": 0,
    "totalFare": 63.50,
    "breakdown": [...],
    "validUntil": "2026-01-15T09:30:00Z"
  }
}
```

---

### POST /trips

Create a new trip.

**Request:**
```json
{
  "passengerId": "uuid",
  
  "pickupAddressLine1": "123 Main St",
  "pickupCity": "Houston",
  "pickupState": "TX",
  "pickupZipCode": "77001",
  "pickupLatitude": 29.7604,
  "pickupLongitude": -95.3698,
  "pickupContactName": "John Smith",
  "pickupContactPhone": "+15551234567",
  "pickupInstructions": "Ring doorbell twice",
  
  "dropoffAddressLine1": "456 Hospital Dr",
  "dropoffCity": "Houston",
  "dropoffState": "TX",
  "dropoffZipCode": "77002",
  "dropoffLatitude": 29.7893,
  "dropoffLongitude": -95.3890,
  "dropoffContactName": "Dr. Johnson",
  "dropoffContactPhone": "+15559998888",
  
  "scheduledPickupTime": "2026-01-15T10:00:00Z",
  "vehicleType": "WHEELCHAIR_ACCESSIBLE",
  "wheelchairRequired": true,
  "oxygenRequired": false,
  "passengerCount": 1,
  "companionCount": 1,
  
  "paymentMethodId": "uuid",
  "patientNotes": "Patient has mobility issues"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "uuid",
      "tripNumber": "TR-20260115-0001",
      "status": "PENDING",
      "totalFare": 63.50,
      ...
    },
    "paymentAuthorized": true
  }
}
```

---

### GET /trips

List trips.

**Query Parameters:**
- `status` - Filter by status (comma-separated for multiple)
- `dateFrom` - Start date filter
- `dateTo` - End date filter
- `driverId` - Filter by driver
- `passengerId` - Filter by passenger
- `search` - Search by trip number or patient name
- `page` - Page number
- `limit` - Items per page
- `sort` - Sort field (default: scheduledPickupTime)
- `order` - Sort order (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tripNumber": "TR-20260115-0001",
      "status": "CONFIRMED",
      "scheduledPickupTime": "2026-01-15T10:00:00Z",
      "passenger": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Smith",
        "phone": "+15551234567"
      },
      "pickupAddressLine1": "123 Main St",
      "pickupCity": "Houston",
      "dropoffAddressLine1": "456 Hospital Dr",
      "dropoffCity": "Houston",
      "driver": null,
      "totalFare": 63.50,
      "paymentStatus": "AUTHORIZED"
    }
  ],
  "pagination": { ... }
}
```

---

### GET /trips/:id

Get trip details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tripNumber": "TR-20260115-0001",
    "status": "CONFIRMED",
    
    "passenger": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+15551234567",
      "medicalProfile": { ... }
    },
    
    "bookedBy": {
      "id": "uuid",
      "firstName": "Dispatcher",
      "lastName": "One"
    },
    
    "driver": null,
    
    "pickupAddressLine1": "123 Main St",
    "pickupCity": "Houston",
    "pickupState": "TX",
    "pickupZipCode": "77001",
    "pickupLatitude": 29.7604,
    "pickupLongitude": -95.3698,
    "pickupContactName": "John Smith",
    "pickupContactPhone": "+15551234567",
    "pickupInstructions": "Ring doorbell twice",
    
    "dropoffAddressLine1": "456 Hospital Dr",
    ...
    
    "scheduledPickupTime": "2026-01-15T10:00:00Z",
    "estimatedArrivalTime": null,
    
    "distanceMiles": 5.0,
    "estimatedDurationMinutes": 12,
    
    "vehicleType": "WHEELCHAIR_ACCESSIBLE",
    "wheelchairRequired": true,
    "oxygenRequired": false,
    
    "baseFare": 25.00,
    "distanceFare": 12.50,
    "timeFare": 6.00,
    "accessibilitySurcharge": 20.00,
    "timeMultiplier": 1.0,
    "totalFare": 63.50,
    "priceBreakdown": [...],
    
    "paymentStatus": "AUTHORIZED",
    "paymentMethod": {
      "type": "CARD",
      "brand": "Visa",
      "lastFourDigits": "4242"
    },
    
    "statusHistory": [
      {
        "previousStatus": null,
        "newStatus": "PENDING",
        "createdAt": "2026-01-14T15:30:00Z",
        "changedBy": { ... }
      },
      {
        "previousStatus": "PENDING",
        "newStatus": "CONFIRMED",
        "createdAt": "2026-01-14T15:31:00Z",
        "changedBy": { ... }
      }
    ],
    
    "createdAt": "2026-01-14T15:30:00Z"
  }
}
```

---

### PUT /trips/:id

Update trip.

**Request:**
```json
{
  "scheduledPickupTime": "2026-01-15T11:00:00Z",
  "patientNotes": "Updated notes"
}
```

---

### PUT /trips/:id/status

Update trip status.

**Request:**
```json
{
  "status": "CONFIRMED",
  "notes": "Confirmed with patient"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": { ... },
    "notificationsSent": ["SMS_BOOKING_CONFIRMATION"]
  }
}
```

---

### POST /trips/:id/assign

Assign driver to trip.

**Request:**
```json
{
  "driverId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": { ... },
    "driver": {
      "id": "uuid",
      "firstName": "Mike",
      "lastName": "Driver",
      "phone": "+15557778888",
      "rating": 4.9,
      "vehicle": {
        "make": "Toyota",
        "model": "Sienna",
        "color": "White",
        "licensePlate": "ABC123"
      }
    },
    "estimatedArrivalTime": "2026-01-15T10:05:00Z"
  }
}
```

---

### PUT /trips/:id/cancel

Cancel a trip.

**Request:**
```json
{
  "reason": "Patient requested cancellation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": { ... },
    "cancellationFee": 10.00,
    "refundAmount": 53.50
  }
}
```

---

### POST /trips/:id/rate

Rate a completed trip.

**Request:**
```json
{
  "rating": 5,
  "feedback": "Driver was very helpful and on time"
}
```

---

### POST /trips/:id/notify

Send notification for trip.

**Request:**
```json
{
  "type": "REMINDER_24H"
}
```

---

### GET /trips/:id/notifications

Get notification history for trip.

---

## 5. Drivers

### GET /drivers

List drivers.

**Query Parameters:**
- `status` - Filter by status (ONLINE, OFFLINE, etc.)
- `vehicleType` - Filter by vehicle type
- `search` - Search by name
- `available` - Show only available drivers
- `datetime` - Check availability for specific datetime
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "firstName": "Mike",
        "lastName": "Driver",
        "phone": "+15557778888"
      },
      "status": "ONLINE",
      "rating": 4.9,
      "totalTrips": 500,
      "completedTrips": 495,
      "currentLatitude": 29.7500,
      "currentLongitude": -95.3600,
      "vehicles": [
        {
          "id": "uuid",
          "make": "Toyota",
          "model": "Sienna",
          "year": 2022,
          "color": "White",
          "licensePlate": "ABC123",
          "vehicleType": "WHEELCHAIR_ACCESSIBLE",
          "wheelchairAccessible": true
        }
      ]
    }
  ]
}
```

---

### GET /drivers/available

Get available drivers for a specific time and vehicle type.

**Query Parameters:**
- `datetime` - Scheduled pickup time (required)
- `vehicleType` - Required vehicle type (required)
- `duration` - Estimated trip duration in minutes (required)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "driver": { ... },
      "available": true,
      "conflicts": [],
      "distanceFromPickup": 2.5,
      "estimatedArrival": 8,
      "score": 95
    },
    {
      "driver": { ... },
      "available": false,
      "conflicts": [
        {
          "tripId": "uuid",
          "tripNumber": "TR-20260115-0003",
          "pickupTime": "2026-01-15T09:30:00Z",
          "dropoffTime": "2026-01-15T10:30:00Z"
        }
      ],
      "distanceFromPickup": 5.0,
      "estimatedArrival": 15,
      "score": 60
    }
  ]
}
```

---

### GET /drivers/:id

Get driver details.

---

### GET /drivers/:id/schedule

Get driver's schedule for a day.

**Query Parameters:**
- `date` - Date to get schedule for (default: today)

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-01-15",
    "driver": { ... },
    "trips": [
      {
        "id": "uuid",
        "tripNumber": "TR-20260115-0001",
        "scheduledPickupTime": "2026-01-15T08:00:00Z",
        "estimatedDropoffTime": "2026-01-15T08:45:00Z",
        "status": "COMPLETED",
        "pickupAddress": "123 Main St",
        "dropoffAddress": "456 Hospital Dr"
      },
      {
        "id": "uuid",
        "tripNumber": "TR-20260115-0005",
        "scheduledPickupTime": "2026-01-15T10:00:00Z",
        "estimatedDropoffTime": "2026-01-15T10:30:00Z",
        "status": "ASSIGNED",
        "pickupAddress": "789 Oak St",
        "dropoffAddress": "321 Clinic Ave"
      }
    ],
    "stats": {
      "totalTrips": 5,
      "completedTrips": 2,
      "totalMiles": 45.5,
      "totalEarnings": 325.00
    }
  }
}
```

---

### GET /drivers/:id/conflicts

Check for scheduling conflicts.

**Query Parameters:**
- `startTime` - Start of time window
- `endTime` - End of time window

**Response:**
```json
{
  "success": true,
  "data": {
    "hasConflict": true,
    "conflicts": [
      {
        "tripId": "uuid",
        "tripNumber": "TR-20260115-0003",
        "scheduledPickupTime": "2026-01-15T09:30:00Z",
        "estimatedDropoffTime": "2026-01-15T10:30:00Z",
        "pickupAddress": "...",
        "dropoffAddress": "..."
      }
    ]
  }
}
```

---

### POST /drivers/location

Update driver's current location (called by driver app).

**Request:**
```json
{
  "latitude": 29.7500,
  "longitude": -95.3600,
  "heading": 180,
  "speed": 25
}
```

---

### PUT /drivers/status

Update driver's status.

**Request:**
```json
{
  "status": "ONLINE"
}
```

---

### POST /drivers/clock-in

Clock in for shift.

**Response:**
```json
{
  "success": true,
  "data": {
    "timesheet": {
      "id": "uuid",
      "date": "2026-01-15",
      "clockInTime": "2026-01-15T07:00:00Z"
    }
  }
}
```

---

### POST /drivers/clock-out

Clock out from shift.

**Response:**
```json
{
  "success": true,
  "data": {
    "timesheet": {
      "id": "uuid",
      "date": "2026-01-15",
      "clockInTime": "2026-01-15T07:00:00Z",
      "clockOutTime": "2026-01-15T17:00:00Z",
      "totalMinutes": 600
    }
  }
}
```

---

### GET /drivers/me/trips

Get current driver's trips.

**Query Parameters:**
- `date` - Filter by date (default: today)
- `status` - Filter by status

---

### GET /drivers/me/earnings

Get current driver's earnings.

**Query Parameters:**
- `period` - "today", "week", "month", "custom"
- `startDate` - For custom period
- `endDate` - For custom period

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "totalEarnings": 1250.00,
    "totalTrips": 35,
    "totalMiles": 420.5,
    "totalHours": 42,
    "byDay": [
      { "date": "2026-01-13", "earnings": 180.00, "trips": 5 },
      { "date": "2026-01-14", "earnings": 210.00, "trips": 6 },
      ...
    ]
  }
}
```

---

## 6. Facilities

### GET /facilities

List facilities.

**Query Parameters:**
- `search` - Search by name
- `type` - Filter by type (hospital, nursing_home, etc.)
- `active` - Filter active only
- `page`, `limit`

---

### GET /facilities/:id

Get facility details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Memorial Hospital",
    "type": "hospital",
    "phone": "+15551234567",
    "email": "transport@memorial.com",
    "addressLine1": "1234 Medical Center Dr",
    "city": "Houston",
    "state": "TX",
    "zipCode": "77030",
    "billingType": "MONTHLY_INVOICE",
    "staff": [...],
    "patientCount": 45,
    "totalTrips": 250,
    "outstandingBalance": 2500.00
  }
}
```

---

### POST /facilities

Create facility (admin only).

---

### PUT /facilities/:id

Update facility.

---

### GET /facilities/:id/patients

Get facility's patient roster.

---

### POST /facilities/:id/patients

Add patient to facility roster.

---

### GET /facilities/:id/trips

Get facility's trips.

---

### GET /facilities/:id/invoices

Get facility's invoices.

---

## 7. Payments

### POST /payments/create-intent

Create Stripe PaymentIntent.

**Request:**
```json
{
  "tripId": "uuid",
  "paymentMethodId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

---

### POST /payments/confirm

Confirm payment.

**Request:**
```json
{
  "tripId": "uuid",
  "paymentIntentId": "pi_xxx"
}
```

---

### POST /payments/capture

Capture authorized payment (after trip completion).

**Request:**
```json
{
  "tripId": "uuid"
}
```

---

### POST /payments/refund

Issue refund.

**Request:**
```json
{
  "tripId": "uuid",
  "amount": 50.00,
  "reason": "Trip cancelled"
}
```

---

## 8. Invoices

### GET /invoices

List invoices.

**Query Parameters:**
- `facilityId` - Filter by facility
- `status` - Filter by status
- `dateFrom`, `dateTo` - Date range
- `page`, `limit`

---

### POST /invoices/generate

Generate invoice for facility.

**Request:**
```json
{
  "facilityId": "uuid",
  "periodStart": "2026-01-01",
  "periodEnd": "2026-01-31"
}
```

---

### GET /invoices/:id

Get invoice details.

---

### POST /invoices/:id/send

Send invoice to facility.

---

### POST /invoices/:id/mark-paid

Mark invoice as paid.

**Request:**
```json
{
  "paymentDate": "2026-02-01",
  "paymentMethod": "check",
  "referenceNumber": "CHK-12345"
}
```

---

### GET /invoices/:id/pdf

Download invoice as PDF.

---

## 9. Notifications

### POST /notifications/send

Send manual notification.

**Request:**
```json
{
  "userId": "uuid",
  "channel": "SMS",
  "type": "CUSTOM",
  "message": "Your ride has been rescheduled to 2:00 PM"
}
```

---

### GET /notifications/templates

Get notification templates.

---

### PUT /notifications/templates/:id

Update notification template (admin).

---

## 10. Admin

### GET /admin/dashboard

Get admin dashboard stats.

**Query Parameters:**
- `dateFrom` - Start date
- `dateTo` - End date

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "todayTrips": 42,
      "todayRevenue": 3250.00,
      "activeTrips": 8,
      "pendingTrips": 15,
      "completedToday": 31,
      "onlineDrivers": 12,
      "pendingPayments": 3
    },
    "ridesChart": [
      { "date": "2026-01-09", "count": 38 },
      { "date": "2026-01-10", "count": 45 },
      ...
    ],
    "revenueChart": [
      { "date": "2026-01-09", "amount": 2980.00 },
      { "date": "2026-01-10", "amount": 3450.00 },
      ...
    ],
    "recentActivity": [...]
  }
}
```

---

### GET /admin/users

List all users.

**Query Parameters:**
- `role` - Filter by role
- `status` - Filter by status
- `search` - Search by name/email/phone
- `page`, `limit`

---

### POST /admin/users

Create user (admin).

---

### GET /admin/users/:id

Get user details.

---

### PUT /admin/users/:id

Update user.

---

### PUT /admin/users/:id/status

Change user status.

**Request:**
```json
{
  "status": "SUSPENDED",
  "reason": "Policy violation"
}
```

---

### POST /admin/users/:id/reset-password

Reset user's password.

---

### GET /admin/pricing

Get pricing configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "default",
    "config": {
      "baseFare": 25.00,
      "perMileRate": 2.50,
      "perMinuteRate": 0.50,
      "minimumFare": 15.00,
      "surcharges": {
        "wheelchair": 15.00,
        "stretcher": 25.00,
        "oxygen": 10.00,
        "bariatric": 20.00
      },
      "timeMultipliers": {
        "rushHour": 1.5,
        "weekend": 1.2,
        "holiday": 1.3,
        "lateNight": 1.4
      },
      "rushHours": {
        "morningStart": 7,
        "morningEnd": 9,
        "eveningStart": 17,
        "eveningEnd": 19
      }
    },
    "isActive": true
  }
}
```

---

### PUT /admin/pricing

Update pricing configuration.

---

### GET /admin/audit-log

Get audit log.

**Query Parameters:**
- `userId` - Filter by user
- `action` - Filter by action (CREATE, UPDATE, DELETE)
- `entityType` - Filter by entity type
- `dateFrom`, `dateTo`
- `page`, `limit`

---

## 11. Analytics

### GET /analytics/trips

Get trip analytics.

**Query Parameters:**
- `period` - "day", "week", "month", "year"
- `dateFrom`, `dateTo`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTrips": 1250,
    "completedTrips": 1180,
    "cancelledTrips": 45,
    "noShows": 25,
    "completionRate": 94.4,
    "averageFare": 65.50,
    "totalRevenue": 77315.00,
    "averageTripDistance": 8.5,
    "averageTripDuration": 22,
    "byVehicleType": [
      { "type": "WHEELCHAIR_ACCESSIBLE", "count": 850, "revenue": 52000 },
      { "type": "STRETCHER_VAN", "count": 300, "revenue": 21000 }
    ],
    "byDayOfWeek": [
      { "day": "Monday", "count": 180 },
      { "day": "Tuesday", "count": 195 },
      ...
    ],
    "byHour": [
      { "hour": 8, "count": 120 },
      { "hour": 9, "count": 145 },
      ...
    ]
  }
}
```

---

### GET /analytics/drivers

Get driver analytics.

**Query Parameters:**
- `driverId` - Specific driver (optional)
- `period`
- `dateFrom`, `dateTo`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDrivers": 30,
    "activeDrivers": 25,
    "averageRating": 4.7,
    "totalTripsCompleted": 1180,
    "averageTripsPerDriver": 47,
    "topDrivers": [
      { "driver": {...}, "trips": 85, "rating": 4.9, "revenue": 5500 }
    ],
    "performanceDistribution": {
      "excellent": 20,
      "good": 7,
      "needsImprovement": 3
    }
  }
}
```

---

### GET /analytics/revenue

Get revenue analytics.

**Query Parameters:**
- `period`
- `dateFrom`, `dateTo`
- `groupBy` - "day", "week", "month"

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 77315.00,
    "averageDailyRevenue": 2577.17,
    "revenueBySource": {
      "individual": 45000.00,
      "facility": 32315.00
    },
    "revenueByVehicleType": {...},
    "timeline": [
      { "date": "2026-01-01", "revenue": 2450.00 },
      { "date": "2026-01-02", "revenue": 2680.00 },
      ...
    ]
  }
}
```

---

### GET /analytics/export

Export data as CSV.

**Query Parameters:**
- `type` - "trips", "revenue", "drivers", "invoices"
- `dateFrom`, `dateTo`
- `format` - "csv", "xlsx"

**Response:** File download

---

## WebSocket Events

### Connection

```javascript
const socket = io('wss://api.example.com', {
  auth: { token: 'access_token' }
});
```

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_trip` | `{ tripId }` | Join trip tracking room |
| `leave_trip` | `{ tripId }` | Leave trip tracking room |
| `driver_location` | `{ tripId, lat, lng, heading }` | Driver sends location |
| `update_status` | `{ tripId, status, notes }` | Driver updates status |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `trip_update` | `{ trip }` | Trip data changed |
| `driver_assigned` | `{ trip, driver, vehicle, eta }` | Driver assigned |
| `driver_location` | `{ lat, lng, heading, eta }` | Real-time location |
| `status_changed` | `{ tripId, status, timestamp }` | Status update |
| `driver_arrived` | `{ tripId, driver }` | Driver at pickup |
| `trip_completed` | `{ tripId, fare }` | Trip finished |

---

## 12. Multi-Stop & Advanced Trip Booking

### POST /trips/multi-stop

Create a multi-stop trip.

**Request:**
```json
{
  "tripType": "MULTI_STOP",
  "vehicleType": "WHEELCHAIR_ACCESSIBLE",
  "wheelchairRequired": true,
  
  "stops": [
    {
      "stopOrder": 0,
      "stopType": "PICKUP",
      "addressLine1": "123 Home St",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77001",
      "latitude": 29.7604,
      "longitude": -95.3698,
      "contactName": "John Smith",
      "contactPhone": "+15551234567",
      "scheduledTime": "2026-01-15T08:00:00Z",
      "instructions": "Ring doorbell twice",
      "passengers": [
        {
          "firstName": "John",
          "lastName": "Smith",
          "isPrimary": true,
          "wheelchairRequired": true,
          "boarding": true,
          "alighting": false
        }
      ]
    },
    {
      "stopOrder": 1,
      "stopType": "PICKUP",
      "addressLine1": "456 Oak Ave",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77002",
      "latitude": 29.7700,
      "longitude": -95.3800,
      "contactName": "Mary Johnson",
      "contactPhone": "+15559876543",
      "instructions": "Apartment 2B",
      "passengers": [
        {
          "firstName": "Mary",
          "lastName": "Johnson",
          "isPrimary": false,
          "wheelchairRequired": true,
          "boarding": true,
          "alighting": false
        }
      ]
    },
    {
      "stopOrder": 2,
      "stopType": "DROPOFF",
      "addressLine1": "789 Dialysis Center Dr",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77030",
      "latitude": 29.7100,
      "longitude": -95.4000,
      "placeName": "DaVita Dialysis Center",
      "placeType": "dialysis",
      "passengers": [
        {
          "firstName": "John",
          "lastName": "Smith",
          "alighting": true
        },
        {
          "firstName": "Mary",
          "lastName": "Johnson",
          "alighting": true
        }
      ]
    }
  ],
  
  "paymentMethodId": "uuid",
  "bookingNotes": "Both patients going to same dialysis appointment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "uuid",
      "tripNumber": "TR-20260115-0001",
      "tripType": "MULTI_STOP",
      "status": "PENDING",
      "totalStops": 3,
      "stops": [...],
      "passengers": [...],
      "totalDistanceMiles": 12.5,
      "estimatedDurationMinutes": 45,
      "baseFare": 25.00,
      "distanceFare": 31.25,
      "additionalStopsFee": 10.00,
      "totalFare": 85.50,
      "priceBreakdown": [...]
    }
  }
}
```

---

### POST /trips/round-trip

Create a round trip (outbound + return).

**Request:**
```json
{
  "tripType": "ROUND_TRIP",
  
  "pickupAddressLine1": "123 Home St",
  "pickupCity": "Houston",
  "pickupState": "TX",
  "pickupZipCode": "77001",
  "pickupLatitude": 29.7604,
  "pickupLongitude": -95.3698,
  "pickupContactName": "John Smith",
  "pickupContactPhone": "+15551234567",
  
  "dropoffAddressLine1": "456 Hospital Dr",
  "dropoffCity": "Houston",
  "dropoffState": "TX",
  "dropoffZipCode": "77030",
  "dropoffLatitude": 29.7100,
  "dropoffLongitude": -95.4000,
  "dropoffPlaceName": "Memorial Hospital",
  
  "outboundPickupTime": "2026-01-15T08:00:00Z",
  
  "returnType": "SCHEDULED",
  "returnPickupTime": "2026-01-15T14:00:00Z",
  
  "vehicleType": "WHEELCHAIR_ACCESSIBLE",
  "wheelchairRequired": true,
  
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Smith",
      "isPrimary": true,
      "wheelchairRequired": true
    }
  ],
  
  "paymentMethodId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "outboundTrip": {
      "id": "uuid-outbound",
      "tripNumber": "TR-20260115-0001",
      "tripType": "ROUND_TRIP",
      "linkedTripId": "uuid-return",
      "scheduledPickupTime": "2026-01-15T08:00:00Z",
      "totalFare": 65.00
    },
    "returnTrip": {
      "id": "uuid-return",
      "tripNumber": "TR-20260115-0002",
      "tripType": "ROUND_TRIP",
      "linkedTripId": "uuid-outbound",
      "scheduledPickupTime": "2026-01-15T14:00:00Z",
      "totalFare": 65.00
    },
    "combinedFare": 130.00,
    "paymentAuthorized": true
  }
}
```

---

### POST /trips/will-call-return

Create a will-call return trip (patient calls when ready).

**Request:**
```json
{
  "tripType": "WILL_CALL",
  
  "pickupAddressLine1": "456 Hospital Dr",
  "pickupCity": "Houston",
  "pickupState": "TX",
  "pickupZipCode": "77030",
  "pickupLatitude": 29.7100,
  "pickupLongitude": -95.4000,
  "pickupPlaceName": "Memorial Hospital",
  
  "dropoffAddressLine1": "123 Home St",
  "dropoffCity": "Houston",
  "dropoffState": "TX",
  "dropoffZipCode": "77001",
  "dropoffLatitude": 29.7604,
  "dropoffLongitude": -95.3698,
  
  "linkedTripId": "uuid-outbound-trip",
  
  "expectedReadyTime": "2026-01-15T14:00:00Z",
  
  "vehicleType": "WHEELCHAIR_ACCESSIBLE",
  "wheelchairRequired": true,
  
  "passengerId": "uuid",
  "paymentMethodId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "uuid",
      "tripNumber": "TR-20260115-0003",
      "tripType": "WILL_CALL",
      "status": "PENDING",
      "isWillCall": true,
      "willCallExpiresAt": "2026-01-15T22:00:00Z",
      "totalFare": 65.00
    },
    "instructions": "Patient should call 713-555-1234 when ready for pickup"
  }
}
```

---

### POST /trips/:id/activate-will-call

Activate a will-call trip (patient is ready).

**Request:**
```json
{
  "callerName": "John Smith",
  "callerPhone": "+15551234567",
  "notes": "Patient is in lobby"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "uuid",
      "status": "CONFIRMED",
      "isWillCall": true,
      "willCallActivatedAt": "2026-01-15T13:45:00Z"
    },
    "estimatedPickupTime": "2026-01-15T14:15:00Z",
    "assignedDriver": null
  }
}
```

---

### POST /trips/by-appointment

Create a trip based on appointment time (calculates pickup time).

**Request:**
```json
{
  "pickupAddressLine1": "123 Home St",
  "pickupCity": "Houston",
  "pickupState": "TX",
  "pickupZipCode": "77001",
  "pickupLatitude": 29.7604,
  "pickupLongitude": -95.3698,
  
  "dropoffAddressLine1": "456 Hospital Dr",
  "dropoffCity": "Houston",
  "dropoffState": "TX",
  "dropoffZipCode": "77030",
  "dropoffLatitude": 29.7100,
  "dropoffLongitude": -95.4000,
  
  "appointmentTime": "2026-01-15T10:00:00Z",
  "arriveMinutesBefore": 15,
  
  "vehicleType": "WHEELCHAIR_ACCESSIBLE",
  "wheelchairRequired": true,
  
  "passengerId": "uuid",
  "paymentMethodId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "uuid",
      "tripNumber": "TR-20260115-0001",
      "appointmentTime": "2026-01-15T10:00:00Z",
      "scheduledPickupTime": "2026-01-15T09:15:00Z",
      "estimatedArrivalTime": "2026-01-15T09:45:00Z",
      "totalFare": 65.00
    },
    "calculation": {
      "appointmentTime": "10:00 AM",
      "arriveBy": "9:45 AM (15 min before)",
      "estimatedTravelTime": "30 minutes",
      "calculatedPickupTime": "9:15 AM"
    }
  }
}
```

---

### GET /trips/check-duplicate

Check if patient already has a booking.

**Query Parameters:**
- `patientId` (required) - Patient user ID
- `date` (required) - Date to check (YYYY-MM-DD)
- `pickupTime` - Optional time to check proximity

**Response:**
```json
{
  "success": true,
  "data": {
    "hasDuplicate": true,
    "duplicateTrips": [
      {
        "tripId": "uuid",
        "tripNumber": "TR-20260115-0001",
        "scheduledPickupTime": "2026-01-15T09:00:00Z",
        "status": "CONFIRMED",
        "pickupAddress": "123 Home St",
        "dropoffAddress": "456 Hospital Dr"
      }
    ],
    "suggestion": "Patient already has a trip scheduled at 9:00 AM"
  }
}
```

---

### PUT /trips/:id/stops/:stopId

Update a specific stop on a trip.

**Request:**
```json
{
  "scheduledTime": "2026-01-15T08:30:00Z",
  "instructions": "Updated: Use back entrance",
  "contactPhone": "+15559999999"
}
```

---

### POST /trips/:id/stops

Add a stop to an existing trip.

**Request:**
```json
{
  "stopOrder": 2,
  "stopType": "PICKUP",
  "addressLine1": "789 New Stop Ave",
  "city": "Houston",
  "state": "TX",
  "zipCode": "77003",
  "latitude": 29.7500,
  "longitude": -95.3500,
  "passengers": [
    {
      "firstName": "New",
      "lastName": "Passenger",
      "wheelchairRequired": false
    }
  ]
}
```

---

### DELETE /trips/:id/stops/:stopId

Remove a stop from a trip.

---

## 13. Standing Orders (Recurring Trips)

### GET /standing-orders

List standing orders.

**Query Parameters:**
- `facilityId` - Filter by facility
- `patientId` - Filter by patient
- `active` - Filter active only (default: true)
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "SO-00001",
      "facilityPatient": {
        "firstName": "John",
        "lastName": "Smith"
      },
      "frequency": "weekly",
      "daysOfWeek": ["MONDAY", "WEDNESDAY", "FRIDAY"],
      "pickupTime": "08:00",
      "pickupAddress": "123 Home St, Houston TX",
      "dropoffAddress": "Dialysis Center, Houston TX",
      "includeReturn": true,
      "isReturnWillCall": true,
      "isActive": true,
      "startDate": "2026-01-01",
      "endDate": null,
      "nextTripDate": "2026-01-15"
    }
  ]
}
```

---

### POST /standing-orders

Create a standing order.

**Request:**
```json
{
  "facilityId": "uuid",
  "facilityPatientId": "uuid",
  
  "frequency": "weekly",
  "daysOfWeek": ["MONDAY", "WEDNESDAY", "FRIDAY"],
  
  "pickupTime": "08:00",
  "appointmentTime": "09:00",
  
  "pickupAddressLine1": "123 Home St",
  "pickupCity": "Houston",
  "pickupState": "TX",
  "pickupZipCode": "77001",
  "pickupLatitude": 29.7604,
  "pickupLongitude": -95.3698,
  
  "dropoffAddressLine1": "456 Dialysis Center",
  "dropoffCity": "Houston",
  "dropoffState": "TX",
  "dropoffZipCode": "77030",
  "dropoffLatitude": 29.7100,
  "dropoffLongitude": -95.4000,
  
  "includeReturn": true,
  "isReturnWillCall": true,
  
  "vehicleType": "WHEELCHAIR_ACCESSIBLE",
  "wheelchairRequired": true,
  
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  
  "generateDaysInAdvance": 7,
  
  "specialInstructions": "Patient needs extra time for transfers"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "standingOrder": {
      "id": "uuid",
      "orderNumber": "SO-00001",
      "isActive": true
    },
    "generatedTrips": [
      {
        "tripNumber": "TR-20260115-0001",
        "scheduledPickupTime": "2026-01-15T08:00:00Z",
        "type": "outbound"
      },
      {
        "tripNumber": "TR-20260115-0002",
        "type": "will_call_return"
      }
    ],
    "nextGenerationDate": "2026-01-08"
  }
}
```

---

### GET /standing-orders/:id

Get standing order details.

---

### PUT /standing-orders/:id

Update standing order.

---

### DELETE /standing-orders/:id

Deactivate standing order (soft delete).

---

### POST /standing-orders/:id/generate

Manually generate trips from standing order.

**Request:**
```json
{
  "fromDate": "2026-01-15",
  "toDate": "2026-01-31"
}
```

---

### POST /standing-orders/:id/skip

Skip a specific date.

**Request:**
```json
{
  "date": "2026-01-20",
  "reason": "Patient hospitalized"
}
```

---

## 14. Service Configuration

### GET /admin/service-config

Get service configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "default",
    "region": "houston",
    "serviceStartHour": 5,
    "serviceEndHour": 23,
    "timezone": "America/Chicago",
    "minLeadTimeMinutes": 120,
    "asapLeadTimeMinutes": 30,
    "maxAdvanceBookingDays": 90,
    "maxStopsPerTrip": 5,
    "additionalStopFee": 10.00,
    "willCallExpiryHours": 8,
    "willCallReminderMinutes": 240,
    "serviceAreaPolygon": [...],
    "allowOutOfArea": false,
    "freeCancellationHours": 24,
    "lateCancellationFee": 10.00,
    "veryLateCancellationFee": 25.00,
    "veryLateCancellationHours": 2
  }
}
```

---

### PUT /admin/service-config

Update service configuration.

**Request:**
```json
{
  "serviceStartHour": 6,
  "serviceEndHour": 22,
  "minLeadTimeMinutes": 90,
  "additionalStopFee": 15.00
}
```

---

### GET /admin/service-config/validate-address

Check if address is within service area.

**Query Parameters:**
- `latitude` (required)
- `longitude` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "inServiceArea": true,
    "nearestBoundaryMiles": 5.2,
    "outOfAreaFee": 0
  }
}
```

---

## 15. Holiday Calendar

### GET /admin/holidays

Get holiday calendar.

**Query Parameters:**
- `year` - Filter by year (default: current year)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "date": "2026-01-01",
      "name": "New Year's Day",
      "isClosed": false,
      "priceMultiplier": 1.3,
      "modifiedStartHour": 8,
      "modifiedEndHour": 18,
      "isActive": true
    },
    {
      "id": "uuid",
      "date": "2026-12-25",
      "name": "Christmas Day",
      "isClosed": true,
      "priceMultiplier": 1.0,
      "isActive": true
    }
  ]
}
```

---

### POST /admin/holidays

Add holiday.

**Request:**
```json
{
  "date": "2026-07-04",
  "name": "Independence Day",
  "isClosed": false,
  "priceMultiplier": 1.3,
  "modifiedStartHour": 8,
  "modifiedEndHour": 20
}
```

---

### PUT /admin/holidays/:id

Update holiday.

---

### DELETE /admin/holidays/:id

Remove holiday.

---

## 16. Dispatcher Tools

### POST /dispatcher/calls

Log a call.

**Request:**
```json
{
  "callerPhone": "+15551234567",
  "callerName": "John Smith",
  "patientId": "uuid",
  "callType": "booking",
  "callDirection": "inbound",
  "duration": 180,
  "outcome": "trip_booked",
  "tripId": "uuid",
  "notes": "Booked dialysis appointment transport"
}
```

---

### GET /dispatcher/calls

Get call log.

**Query Parameters:**
- `dispatcherId` - Filter by dispatcher
- `callType` - Filter by type
- `dateFrom`, `dateTo`
- `page`, `limit`

---

### POST /dispatcher/shift-notes

Create shift handoff note.

**Request:**
```json
{
  "shiftDate": "2026-01-15",
  "shiftType": "morning",
  "notes": "Mrs. Johnson's trip was rescheduled to 2pm. Driver Mike called in sick.",
  "urgentItems": "Need to find replacement driver for afternoon routes"
}
```

---

### GET /dispatcher/shift-notes

Get shift notes.

**Query Parameters:**
- `date` - Filter by date
- `shiftType` - Filter by shift

---

### GET /dispatcher/dashboard

Get dispatcher dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "todayStats": {
      "totalTrips": 45,
      "pending": 5,
      "confirmed": 12,
      "inProgress": 8,
      "completed": 18,
      "cancelled": 2
    },
    "upcomingTrips": [...],
    "unassignedTrips": [...],
    "activeWillCalls": [
      {
        "tripId": "uuid",
        "tripNumber": "TR-20260115-0003",
        "patientName": "John Smith",
        "location": "Memorial Hospital",
        "expectedReadyTime": "2026-01-15T14:00:00Z",
        "status": "waiting"
      }
    ],
    "driverStatuses": [...],
    "alerts": [
      {
        "type": "will_call_expiring",
        "message": "Will-call for John Smith expires in 1 hour",
        "tripId": "uuid"
      }
    ]
  }
}
```

---

## 17. Driver Tools (Additional)

### GET /drivers/me/navigation/:tripId

Get navigation link for trip.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStop": {
      "stopOrder": 0,
      "stopType": "PICKUP",
      "address": "123 Home St, Houston TX 77001",
      "latitude": 29.7604,
      "longitude": -95.3698,
      "instructions": "Ring doorbell twice"
    },
    "navigationLinks": {
      "googleMaps": "https://www.google.com/maps/dir/?api=1&destination=29.7604,-95.3698",
      "appleMaps": "http://maps.apple.com/?daddr=29.7604,-95.3698",
      "waze": "https://waze.com/ul?ll=29.7604,-95.3698&navigate=yes"
    },
    "nextStop": {
      "stopOrder": 1,
      "address": "456 Oak Ave, Houston TX"
    },
    "remainingStops": 2
  }
}
```

---

### PUT /drivers/me/trips/:tripId/stop/:stopOrder

Update stop status.

**Request:**
```json
{
  "status": "ARRIVED",
  "latitude": 29.7604,
  "longitude": -95.3698,
  "notes": "Patient coming down"
}
```

---

### POST /drivers/me/trips/:tripId/complete-stop

Complete current stop and advance to next.

**Request:**
```json
{
  "stopOrder": 0,
  "actualDepartureTime": "2026-01-15T08:15:00Z",
  "passengersBoarded": ["uuid1"],
  "notes": "Picked up on time"
}
```

---

## WebSocket Events (Additional)

### Multi-Stop Events

| Event | Payload | Description |
|-------|---------|-------------|
| `stop_update` | `{ tripId, stopOrder, status, eta }` | Stop status changed |
| `next_stop` | `{ tripId, stopOrder, address, eta }` | Driver moving to next stop |
| `passenger_boarded` | `{ tripId, stopOrder, passengerId }` | Passenger got on |
| `passenger_alighted` | `{ tripId, stopOrder, passengerId }` | Passenger got off |

### Will-Call Events

| Event | Payload | Description |
|-------|---------|-------------|
| `will_call_activated` | `{ tripId, activatedAt }` | Patient ready for pickup |
| `will_call_expiring` | `{ tripId, expiresAt }` | Will-call about to expire |
| `will_call_expired` | `{ tripId }` | Will-call has expired |

---

*This is the complete API specification. All endpoints must follow these contracts.*

---

# Additional API Sections

## 12. Emergency Alerts

### POST /emergencies

Create emergency alert.

**Request:**
```json
{
  "type": "MEDICAL",
  "tripId": "uuid",
  "latitude": 29.7604,
  "longitude": -95.3698,
  "description": "Patient having difficulty breathing"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alertId": "uuid",
    "status": "ACTIVE",
    "dispatchNotified": true,
    "nearestHospital": {
      "name": "Memorial Hermann",
      "phone": "713-555-1234",
      "distance": "2.3 mi"
    }
  }
}
```

---

### GET /emergencies/active

Get all active emergency alerts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "MEDICAL",
      "driver": { "id": "uuid", "name": "Mike Johnson" },
      "trip": { "id": "uuid", "tripNumber": "TR-001" },
      "patient": { "name": "John Smith" },
      "location": { "lat": 29.7604, "lng": -95.3698 },
      "status": "ACTIVE",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST /emergencies/:id/acknowledge

Acknowledge emergency alert.

**Request:**
```json
{
  "dispatcherId": "uuid"
}
```

---

### POST /emergencies/:id/resolve

Resolve emergency alert.

**Request:**
```json
{
  "resolution": "Patient stabilized, transported to hospital",
  "called911": false,
  "notes": "EMT not required"
}
```

---

## 13. Vehicle Inspections

### POST /inspections

Submit vehicle inspection.

**Request:**
```json
{
  "vehicleId": "uuid",
  "type": "PRE_TRIP",
  "odometerReading": 45230,
  "checklistItems": [
    { "id": "tires", "passed": true, "notes": null },
    { "id": "lights", "passed": true, "notes": null },
    { "id": "lift", "passed": false, "notes": "Slow to deploy", "photoUrl": "..." }
  ],
  "signatureUrl": "https://...",
  "latitude": 29.7604,
  "longitude": -95.3698
}
```

---

### GET /inspections

List inspections with filters.

**Query Parameters:**
- `vehicleId` - Filter by vehicle
- `driverId` - Filter by inspector
- `type` - PRE_TRIP, POST_TRIP, etc.
- `status` - PASSED, FAILED, NEEDS_REVIEW
- `startDate`, `endDate` - Date range

---

### GET /inspections/:id

Get inspection details.

---

## 14. Vehicle Maintenance

### GET /vehicles/:id/maintenance

Get maintenance schedule for vehicle.

---

### POST /vehicles/:id/maintenance

Log maintenance record.

**Request:**
```json
{
  "type": "OIL_CHANGE",
  "description": "Full synthetic oil change",
  "serviceDate": "2026-01-15",
  "mileageAtService": 45000,
  "performedBy": "Joe's Auto Shop",
  "laborCost": 45.00,
  "partsCost": 30.00,
  "totalCost": 75.00,
  "notes": "Next change at 50,000 miles",
  "receiptUrl": "https://..."
}
```

---

### GET /maintenance/due

Get all maintenance items due soon.

**Query Parameters:**
- `dueDays` - Items due within X days (default: 30)
- `dueMiles` - Items due within X miles (default: 1000)

---

## 15. Vehicle Issues

### POST /vehicles/:id/issues

Report vehicle issue.

**Request:**
```json
{
  "category": "WHEELCHAIR_LIFT",
  "severity": "HIGH",
  "description": "Lift door not sealing properly",
  "photoUrls": ["https://..."]
}
```

---

### PUT /issues/:id/resolve

Resolve vehicle issue.

**Request:**
```json
{
  "resolution": "Replaced door seal",
  "cost": 150.00
}
```

---

## 16. Document Expiry

### GET /documents/expiring

Get all documents expiring soon.

**Query Parameters:**
- `days` - Expiring within X days (default: 90)
- `type` - driver, vehicle, or all

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "documentType": "DRIVER_LICENSE",
      "ownerId": "uuid",
      "ownerType": "driver",
      "ownerName": "Mike Johnson",
      "expiryDate": "2026-02-15",
      "daysUntilExpiry": 30,
      "alertsSent": 1
    }
  ]
}
```

---

### POST /documents/expiry-alerts/:id/acknowledge

Acknowledge expiry alert.

---

## 17. Driver Payouts

### GET /drivers/me/payout-account

Get driver's payout account status.

**Response:**
```json
{
  "success": true,
  "data": {
    "onboardingComplete": true,
    "chargesEnabled": true,
    "payoutsEnabled": true,
    "payoutSchedule": "WEEKLY",
    "nextPayoutDate": "2026-01-20",
    "pendingBalance": 523.45
  }
}
```

---

### POST /drivers/me/payout-account/setup

Initialize Stripe Connect setup.

**Response:**
```json
{
  "success": true,
  "data": {
    "onboardingUrl": "https://connect.stripe.com/setup/..."
  }
}
```

---

### GET /drivers/me/earnings

Get earnings for period.

**Query Parameters:**
- `startDate` - Period start
- `endDate` - Period end

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 1260.00,
    "tripEarnings": 1150.00,
    "tips": 85.00,
    "bonuses": 25.00,
    "deductions": 0,
    "tripCount": 28,
    "breakdown": [
      { "date": "2026-01-08", "trips": 4, "earnings": 180.00, "tips": 12.00 }
    ]
  }
}
```

---

### GET /drivers/me/payouts

Get payout history.

---

### GET /drivers/me/payouts/:id

Get payout details.

---

### POST /drivers/me/payouts/instant

Request instant payout (with fee).

**Request:**
```json
{
  "amount": 100.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payoutId": "uuid",
    "amount": 100.00,
    "fee": 1.50,
    "netAmount": 98.50,
    "estimatedArrival": "2026-01-15T18:00:00Z"
  }
}
```

---

## 18. Facility Bulk Booking

### POST /facilities/:id/bulk-booking

Create bulk booking for multiple patients.

**Request:**
```json
{
  "scheduledDate": "2026-01-15",
  "pickupTime": "08:00",
  "dropoffAddress": "Dialysis Center, 456 Medical Dr",
  "dropoffLat": 29.7893,
  "dropoffLng": -95.3890,
  "patients": [
    { "patientId": "uuid1", "pickupAddressId": "addr1" },
    { "patientId": "uuid2", "pickupAddressId": "addr2" }
  ],
  "includeReturn": true,
  "returnType": "WILL_CALL"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bulkBookingId": "uuid",
    "status": "PROCESSING",
    "totalTrips": 4
  }
}
```

---

### GET /facilities/:id/bulk-booking/:bookingId

Get bulk booking status.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "totalTrips": 4,
    "confirmedTrips": 4,
    "failedTrips": 0,
    "trips": [
      { "tripId": "uuid", "tripNumber": "TR-001", "patientName": "John Smith", "status": "CONFIRMED" }
    ]
  }
}
```

---

## 19. Facility Contracts

### GET /facilities/:id/contract

Get facility contract details.

**Response:**
```json
{
  "success": true,
  "data": {
    "pricingType": "VOLUME",
    "volumeTiers": [
      { "minTrips": 0, "discountPercent": 0 },
      { "minTrips": 50, "discountPercent": 10 },
      { "minTrips": 100, "discountPercent": 15 }
    ],
    "billingCycle": "MONTHLY",
    "paymentTerms": 30,
    "currentMonthTrips": 45,
    "currentDiscount": 0,
    "nextTierAt": 50,
    "startDate": "2025-01-01"
  }
}
```

---

### PUT /admin/facilities/:id/contract

Update facility contract (Admin only).

**Request:**
```json
{
  "pricingType": "VOLUME",
  "volumeTiers": [...],
  "billingCycle": "MONTHLY",
  "paymentTerms": 30,
  "creditLimit": 10000.00
}
```

---

## 20. QuickBooks Integration

### POST /integrations/quickbooks/connect

Initiate QuickBooks OAuth flow.

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://appcenter.intuit.com/..."
  }
}
```

---

### GET /integrations/quickbooks/callback

OAuth callback handler (redirects).

---

### GET /integrations/quickbooks/status

Get integration status.

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "companyName": "ABC Transport LLC",
    "lastSyncAt": "2026-01-15T10:30:00Z",
    "pendingSync": 5,
    "failedSync": 0
  }
}
```

---

### POST /integrations/quickbooks/sync

Trigger manual sync.

**Request:**
```json
{
  "entityType": "invoices",
  "entityIds": ["uuid1", "uuid2"]
}
```

---

### POST /integrations/quickbooks/disconnect

Disconnect QuickBooks integration.

---

## 21. Background Jobs (Admin)

### GET /admin/jobs

List background jobs.

**Query Parameters:**
- `status` - PENDING, RUNNING, COMPLETED, FAILED
- `jobType` - Filter by job type

---

### GET /admin/jobs/:id

Get job details.

---

### POST /admin/jobs/:id/retry

Retry failed job.

---

### POST /admin/jobs/:id/cancel

Cancel pending job.

---

### GET /admin/jobs/stats

Get job queue statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "pending": 15,
    "running": 2,
    "completedToday": 145,
    "failedToday": 3,
    "byType": {
      "tripReminders": { "pending": 0, "completed": 96, "failed": 0 },
      "standingOrders": { "pending": 0, "completed": 1, "failed": 0 }
    }
  }
}
```

---

## 22. Service Areas

### GET /service-areas

List service areas.

---

### POST /service-areas

Create service area.

**Request:**
```json
{
  "name": "Greater Houston",
  "polygon": { "type": "Polygon", "coordinates": [...] },
  "isPrimary": true,
  "allowOutOfArea": true,
  "maxOutOfAreaMiles": 20,
  "outOfAreaFees": [
    { "maxMiles": 5, "fee": 15.00 },
    { "maxMiles": 10, "fee": 25.00 },
    { "maxMiles": 20, "fee": 40.00 }
  ]
}
```

---

### POST /addresses/validate

Validate address against service area.

**Request:**
```json
{
  "street": "123 Main St",
  "city": "Houston",
  "state": "TX",
  "zipCode": "77001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "inServiceArea": true,
    "coordinates": { "lat": 29.7604, "lng": -95.3698 },
    "formattedAddress": "123 Main St, Houston, TX 77001",
    "outOfAreaFee": null
  }
}
```

---

## 23. Mileage Tracking

### POST /vehicles/:id/mileage

Record mileage reading.

**Request:**
```json
{
  "odometerReading": 45230,
  "readingType": "START_OF_DAY",
  "photoUrl": "https://...",
  "latitude": 29.7604,
  "longitude": -95.3698
}
```

---

### GET /vehicles/:id/mileage

Get mileage history.

**Query Parameters:**
- `startDate` - Period start
- `endDate` - Period end

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMiles": 2450,
    "averageDaily": 79,
    "logs": [...]
  }
}
```

---

## WebSocket Events (Complete)

### Emergency Events

| Event | Payload | Description |
|-------|---------|-------------|
| `emergency_alert` | Full alert object | New emergency created |
| `emergency_acknowledged` | `{ alertId, acknowledgedBy }` | Alert acknowledged |
| `emergency_resolved` | `{ alertId, resolution }` | Alert resolved |

### Geofence Events

| Event | Payload | Description |
|-------|---------|-------------|
| `geofence_enter` | `{ tripId, geofenceType, location }` | Driver entered geofence |
| `geofence_exit` | `{ tripId, geofenceType, location }` | Driver exited geofence |

### System Events

| Event | Payload | Description |
|-------|---------|-------------|
| `document_expiring` | `{ documentType, ownerId, daysLeft }` | Document expiring soon |
| `maintenance_due` | `{ vehicleId, maintenanceType }` | Maintenance coming due |
| `payout_processed` | `{ driverId, amount, status }` | Payout status changed |

---

## API Endpoint Summary

| Category | Endpoints |
|----------|-----------|
| Authentication | 8 |
| Users | 12 |
| Patients | 10 |
| Trips | 25 |
| Drivers | 18 |
| Facilities | 12 |
| Payments | 10 |
| Invoices | 8 |
| Notifications | 6 |
| Admin | 15 |
| Analytics | 8 |
| Emergencies | 5 |
| Inspections | 4 |
| Maintenance | 5 |
| Issues | 3 |
| Document Expiry | 2 |
| Driver Payouts | 6 |
| Bulk Booking | 2 |
| Contracts | 2 |
| QuickBooks | 5 |
| Background Jobs | 5 |
| Service Areas | 3 |
| Mileage | 2 |
| **Total** | **~170** |

---

*End of API Specification*
