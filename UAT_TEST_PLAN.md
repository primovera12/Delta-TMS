# User Acceptance Testing (UAT) Plan - Delta TMS

> **Document Version:** 1.0
> **Last Updated:** January 2, 2026
> **Status:** Ready for Testing

## Overview

This document outlines the User Acceptance Testing plan for Delta TMS. UAT ensures the system meets business requirements and is ready for production use.

## Testing Scope

### Portals to Test
1. **Dispatcher Portal** - Trip management, scheduling, driver assignment
2. **Driver Portal** - Trip acceptance, navigation, status updates
3. **Admin Portal** - System configuration, user management, billing
4. **Patient Portal** - Trip booking, history, profile management
5. **Family Portal** - Patient oversight, trip monitoring
6. **Facility Portal** - Scheduling, billing, reports

## Test Environment

### Prerequisites
- [ ] Staging environment deployed with production-like data
- [ ] Test user accounts created for each role
- [ ] Test payment credentials configured (Stripe test mode)
- [ ] Mobile devices available for driver app testing
- [ ] SMS/Email test endpoints configured

### Test Accounts

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Super Admin | admin@test.deltatms.com | [Provided separately] | Full access |
| Dispatcher | dispatcher@test.deltatms.com | [Provided separately] | Operations |
| Driver | driver@test.deltatms.com | [Provided separately] | Mobile testing |
| Patient | patient@test.deltatms.com | [Provided separately] | Booking flow |
| Family | family@test.deltatms.com | [Provided separately] | Oversight |
| Facility | facility@test.deltatms.com | [Provided separately] | Scheduling |

---

## Test Cases

### Module 1: Authentication & Authorization

#### TC-AUTH-001: User Login
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Valid user account exists |

**Steps:**
1. Navigate to `/login`
2. Enter valid email and password
3. Click "Sign In"

**Expected Results:**
- [ ] User is redirected to appropriate dashboard based on role
- [ ] Session is created
- [ ] User name appears in header

---

#### TC-AUTH-002: Password Reset
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User account exists |

**Steps:**
1. Click "Forgot Password" on login page
2. Enter email address
3. Click "Send Reset Link"
4. Check email for reset link
5. Click link and enter new password
6. Login with new password

**Expected Results:**
- [ ] Reset email is received within 5 minutes
- [ ] Link expires after 24 hours
- [ ] New password works
- [ ] Old password no longer works

---

#### TC-AUTH-003: Role-Based Access Control
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Accounts for each role |

**Steps:**
1. Login as each role
2. Verify accessible menu items
3. Attempt to access restricted URLs directly

**Expected Results:**
- [ ] Dispatcher: Dispatch, Trips, Drivers, Map, Reports
- [ ] Driver: My Trips, Navigation, Earnings
- [ ] Patient: Book Trip, My Trips, Profile
- [ ] Admin: Full access including Settings, Users, Billing
- [ ] Restricted pages show 403 or redirect

---

### Module 2: Trip Management (Dispatcher)

#### TC-TRIP-001: Create New Trip
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Logged in as Dispatcher |

**Steps:**
1. Navigate to Dispatch > New Trip
2. Search and select patient
3. Enter pickup address
4. Enter destination address
5. Select date and time
6. Select service type (Ambulatory/Wheelchair/Stretcher)
7. Add special instructions
8. Click "Create Trip"

**Expected Results:**
- [ ] Trip appears in schedule
- [ ] Trip ID is generated (format: TRP-XXXXXX)
- [ ] Status is "Scheduled"
- [ ] Addresses are geocoded correctly
- [ ] Distance and duration are calculated

---

#### TC-TRIP-002: Assign Driver to Trip
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Unassigned trip exists, driver is available |

**Steps:**
1. Open trip details
2. Click "Assign Driver"
3. Review available drivers list
4. Select appropriate driver
5. Confirm assignment

**Expected Results:**
- [ ] Driver receives notification
- [ ] Trip status changes to "Assigned"
- [ ] Driver appears on trip card
- [ ] Vehicle is linked to trip

---

#### TC-TRIP-003: Cancel Trip
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Scheduled or assigned trip exists |

**Steps:**
1. Open trip details
2. Click "Cancel Trip"
3. Select cancellation reason
4. Add notes
5. Confirm cancellation

**Expected Results:**
- [ ] Trip status changes to "Cancelled"
- [ ] Driver is notified (if assigned)
- [ ] Patient is notified
- [ ] Cancellation reason is recorded
- [ ] Trip is removed from active schedule

---

#### TC-TRIP-004: Modify Trip
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Scheduled trip exists |

**Steps:**
1. Open trip details
2. Click "Edit"
3. Modify pickup time
4. Modify destination
5. Save changes

**Expected Results:**
- [ ] Changes are saved
- [ ] Driver is notified of changes
- [ ] Audit log records modification
- [ ] New distance/duration calculated

---

### Module 3: Driver Workflow

#### TC-DRV-001: Accept Trip
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Trip assigned to driver |

**Steps:**
1. Login as driver
2. View pending trips
3. Click on trip card
4. Review trip details
5. Click "Accept"

**Expected Results:**
- [ ] Trip status changes to "Confirmed"
- [ ] Trip appears in "Today's Trips"
- [ ] Patient receives confirmation notification
- [ ] Navigation option becomes available

---

#### TC-DRV-002: Start Trip
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Accepted trip, near pickup location |

**Steps:**
1. Navigate to pickup location
2. Click "Arrived at Pickup"
3. Verify patient identity
4. Click "Start Trip"

**Expected Results:**
- [ ] Trip status changes to "In Progress"
- [ ] Timer starts
- [ ] GPS tracking activates
- [ ] Dispatcher sees real-time location

---

#### TC-DRV-003: Complete Trip
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Trip in progress, at destination |

**Steps:**
1. Click "Arrived at Destination"
2. Assist patient as needed
3. Collect signature (if required)
4. Click "Complete Trip"
5. Add any notes

**Expected Results:**
- [ ] Trip status changes to "Completed"
- [ ] Actual duration recorded
- [ ] Mileage captured
- [ ] Signature saved (if collected)
- [ ] Invoice generated

---

#### TC-DRV-004: Report Issue During Trip
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Trip in progress |

**Steps:**
1. Click "Report Issue"
2. Select issue type
3. Add description
4. Take photo (if applicable)
5. Submit report

**Expected Results:**
- [ ] Dispatcher receives alert
- [ ] Issue is logged with trip
- [ ] Photo is uploaded
- [ ] Status update options appear

---

### Module 4: Patient Portal

#### TC-PAT-001: Book New Trip
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Logged in as patient |

**Steps:**
1. Navigate to "Book Trip"
2. Select saved pickup address or enter new
3. Enter destination
4. Select date and appointment time
5. Choose service type
6. Add special requirements
7. Submit booking

**Expected Results:**
- [ ] Confirmation number displayed
- [ ] Email confirmation sent
- [ ] Trip appears in "My Trips"
- [ ] Dispatcher notified of new booking

---

#### TC-PAT-002: View Trip History
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Patient has completed trips |

**Steps:**
1. Navigate to "My Trips"
2. Click "Past Trips" tab
3. Click on a trip to view details

**Expected Results:**
- [ ] All past trips are listed
- [ ] Sorted by date (newest first)
- [ ] Details include driver, time, cost
- [ ] Can view receipt

---

#### TC-PAT-003: Update Profile
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Logged in as patient |

**Steps:**
1. Navigate to Settings > Profile
2. Update phone number
3. Update medical information
4. Save changes

**Expected Results:**
- [ ] Changes are saved
- [ ] Confirmation message displayed
- [ ] Medical info appears in future bookings

---

### Module 5: Billing & Invoicing

#### TC-BILL-001: Generate Invoice
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Completed trip exists |

**Steps:**
1. Navigate to Billing > Invoices
2. Select completed trip
3. Click "Generate Invoice"
4. Review invoice details
5. Send to patient/facility

**Expected Results:**
- [ ] Invoice generated with correct line items
- [ ] Tax calculated correctly
- [ ] PDF can be downloaded
- [ ] Email sent to recipient

---

#### TC-BILL-002: Process Payment
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Invoice exists, Stripe test mode |

**Steps:**
1. Open invoice
2. Click "Record Payment"
3. Enter payment method (Card: 4242 4242 4242 4242)
4. Process payment

**Expected Results:**
- [ ] Payment processed successfully
- [ ] Invoice marked as "Paid"
- [ ] Receipt generated
- [ ] Payment appears in reports

---

#### TC-BILL-003: Facility Billing Report
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Facility has completed trips |

**Steps:**
1. Navigate to Reports > Facility Billing
2. Select facility
3. Select date range
4. Generate report

**Expected Results:**
- [ ] All trips for facility listed
- [ ] Totals calculated correctly
- [ ] Export to PDF/Excel works
- [ ] Matches individual invoices

---

### Module 6: Reports & Analytics

#### TC-RPT-001: Daily Operations Report
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Trips exist for date range |

**Steps:**
1. Navigate to Reports
2. Select "Daily Operations"
3. Select date
4. Generate report

**Expected Results:**
- [ ] Total trips count accurate
- [ ] Completed vs cancelled breakdown
- [ ] On-time performance calculated
- [ ] Driver utilization shown

---

#### TC-RPT-002: Revenue Report
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Paid invoices exist |

**Steps:**
1. Navigate to Reports > Revenue
2. Select date range
3. Generate report

**Expected Results:**
- [ ] Total revenue accurate
- [ ] Breakdown by service type
- [ ] Breakdown by facility
- [ ] Export functionality works

---

### Module 7: Real-time Features

#### TC-RT-001: Live Map Tracking
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Trips in progress |

**Steps:**
1. Navigate to Dispatch > Map
2. Observe active trips
3. Click on vehicle marker
4. Monitor position updates

**Expected Results:**
- [ ] All active vehicles visible
- [ ] Positions update in real-time
- [ ] Click shows trip details
- [ ] ETA updates displayed

---

#### TC-RT-002: Notifications
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Various events trigger notifications |

**Steps:**
1. Create a new trip
2. Assign driver
3. Complete trip
4. Check notification bell

**Expected Results:**
- [ ] Trip created notification appears
- [ ] Assignment notification to driver
- [ ] Completion notification to dispatcher
- [ ] Bell shows unread count

---

### Module 8: Mobile Responsiveness

#### TC-MOB-001: Mobile Trip Booking
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Mobile device or emulator |

**Steps:**
1. Open site on mobile browser
2. Login as patient
3. Complete trip booking flow

**Expected Results:**
- [ ] All fields accessible
- [ ] Touch targets adequate (44px+)
- [ ] Forms usable without horizontal scroll
- [ ] Date/time pickers work on mobile

---

#### TC-MOB-002: Driver Mobile Experience
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Mobile device |

**Steps:**
1. Open driver portal on mobile
2. View and accept trip
3. Navigate through trip workflow
4. Complete trip

**Expected Results:**
- [ ] Large, touch-friendly buttons
- [ ] Map displays correctly
- [ ] All status updates work
- [ ] Camera access for photos works

---

### Module 9: Accessibility

#### TC-A11Y-001: Keyboard Navigation
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Keyboard only (no mouse) |

**Steps:**
1. Navigate to login using Tab
2. Complete login
3. Navigate dashboard using keyboard
4. Book a trip using keyboard only

**Expected Results:**
- [ ] All interactive elements focusable
- [ ] Focus visible at all times
- [ ] Skip link works
- [ ] Modal traps focus appropriately

---

#### TC-A11Y-002: Screen Reader Compatibility
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Screen reader active (NVDA/VoiceOver) |

**Steps:**
1. Navigate site with screen reader
2. Complete main workflows
3. Verify form labels read correctly

**Expected Results:**
- [ ] All buttons have accessible names
- [ ] Form fields have labels
- [ ] Status changes announced
- [ ] Errors announced on forms

---

## Test Execution Schedule

| Day | Focus Area | Testers |
|-----|------------|---------|
| 1 | Authentication, Basic Navigation | QA Lead + 1 |
| 2 | Trip Creation & Management | QA Lead + Dispatcher |
| 3 | Driver Workflow | QA + Driver Tester |
| 4 | Patient Portal, Family Portal | QA + End Users |
| 5 | Billing & Payments | QA + Finance |
| 6 | Reports & Mobile | QA Lead |
| 7 | Bug Fixes & Retesting | QA Team |

## Defect Tracking

### Severity Levels

| Level | Description | Resolution Time |
|-------|-------------|-----------------|
| Critical | System unusable, data loss | 4 hours |
| High | Major feature broken | 24 hours |
| Medium | Feature works with workaround | 72 hours |
| Low | Minor issue, cosmetic | Next release |

### Defect Report Template

```
Defect ID: DEF-XXX
Title: [Brief description]
Severity: [Critical/High/Medium/Low]
Test Case: [TC-XXX-XXX]
Steps to Reproduce:
1.
2.
3.
Expected Result:
Actual Result:
Screenshots: [Attach]
Environment: [Browser, OS, Device]
```

## Sign-Off Criteria

### Go/No-Go Checklist

- [ ] All Critical test cases pass
- [ ] 95% of High priority test cases pass
- [ ] No Critical or High defects open
- [ ] Performance acceptable (page load < 3s)
- [ ] All payment flows verified
- [ ] Mobile workflows functional
- [ ] Accessibility requirements met

### Sign-Off Form

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Project Manager | | | |
| Product Owner | | | |
| Operations Lead | | | |
| Finance Lead | | | |

---

## Appendix A: Test Data Requirements

### Patients
- 50 test patients with varied medical requirements
- Mix of ambulatory, wheelchair, and stretcher needs
- Various insurance types

### Drivers
- 10 test drivers with different certifications
- Various vehicle types assigned
- Different availability schedules

### Facilities
- 5 healthcare facilities
- Different contract types
- Various billing arrangements

### Historical Data
- 100 completed trips for reporting tests
- 20 cancelled trips
- Mix of payment statuses

---

## Appendix B: Environment URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| Staging | staging.deltatms.com | UAT Testing |
| QA | qa.deltatms.com | Bug Verification |
| Production | app.deltatms.com | Go-Live |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2, 2026 | Development Team | Initial UAT plan |
