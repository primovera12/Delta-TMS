# Screen Catalog - Wheelchair Transportation Platform

> **Total Screens:** 215 (180 pages + 35 modals)
> **Last Updated:** January 2026

---

## Table of Contents

1. [Public Pages](#1-public-pages) (7 screens)
2. [Authentication](#2-authentication) (9 screens)
3. [Super Admin Portal](#3-super-admin-portal) (28 screens)
4. [Admin Portal](#4-admin-portal) (20 screens)
5. [Operations Manager Portal](#5-operations-manager-portal) (22 screens)
6. [Dispatcher Portal](#6-dispatcher-portal) (24 screens)
7. [Driver Portal](#7-driver-portal) (22 screens)
8. [Facility Staff Portal](#8-facility-staff-portal) (20 screens)
9. [Family Member Portal](#9-family-member-portal) (10 screens)
10. [Patient Portal](#10-patient-portal) (10 screens)
11. [System Pages](#11-system-pages) (8 screens)
12. [Shared Modals](#12-shared-modals) (35 modals)

---

## 1. Public Pages

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 1.1 | Landing Page | `/` | Hero, services overview, CTAs, testimonials |
| 1.2 | Services | `/services` | Detailed service descriptions, vehicle types |
| 1.3 | Pricing | `/pricing` | Transparent pricing breakdown, quote CTA |
| 1.4 | About Us | `/about` | Company story, mission, certifications |
| 1.5 | Contact | `/contact` | Contact form, phone, address, hours |
| 1.6 | FAQ | `/faq` | Frequently asked questions accordion |
| 1.7 | Service Areas | `/areas` | Map of covered areas, city list |

---

## 2. Authentication

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 2.1 | Login | `/login` | Email/password, magic link option, role-based redirect |
| 2.2 | Register - Step 1 | `/register` | Account type selection (Patient, Family, Facility) |
| 2.3 | Register - Step 2 | `/register/info` | Personal info (name, email, phone) |
| 2.4 | Register - Step 3 | `/register/verify` | Phone verification via SMS OTP |
| 2.5 | Register - Step 4 | `/register/complete` | Password creation, terms acceptance |
| 2.6 | Forgot Password | `/forgot-password` | Email input, send reset link |
| 2.7 | Reset Password | `/reset-password/[token]` | New password form |
| 2.8 | Two-Factor Auth | `/2fa` | Enter 2FA code (shown after login if enabled) |
| 2.9 | Verify Email | `/verify-email/[token]` | Email verification confirmation |

---

## 3. Super Admin Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 3.1 | Dashboard | `/super-admin` | System-wide KPIs, revenue, alerts, quick actions |
| 3.2 | User Management | `/super-admin/users` | All users list, filters, search, CRUD |
| 3.3 | User Detail | `/super-admin/users/[id]` | View/edit user, permissions, activity log |
| 3.4 | Role Management | `/super-admin/roles` | Define roles, assign permissions |
| 3.5 | Staff Management | `/super-admin/staff` | Internal staff list, add/remove |
| 3.6 | System Settings | `/super-admin/settings` | Company info, branding, defaults |
| 3.7 | Pricing Settings | `/super-admin/settings/pricing` | All pricing rules, surcharges, multipliers |
| 3.8 | Notification Settings | `/super-admin/settings/notifications` | SMS/email templates, triggers |
| 3.9 | Integrations | `/super-admin/integrations` | Stripe, Twilio, QuickBooks, Google Maps |
| 3.10 | Billing & Invoices | `/super-admin/billing` | All invoices, payment tracking, QuickBooks sync |
| 3.11 | Audit Log | `/super-admin/audit` | All system actions, who did what when |
| 3.12 | Service Areas | `/super-admin/areas` | Define/edit service areas, zones |
| 3.13 | Holiday Calendar | `/super-admin/settings/holidays` | Manage holiday dates and pricing |
| 3.14 | Service Configuration | `/super-admin/settings/service` | Hours, booking rules, will-call settings |
| 3.15 | Contract Rates | `/super-admin/settings/contracts` | Facility-specific pricing contracts |
| 3.16 | API Keys Management | `/super-admin/api-keys` | Create/revoke API keys for integrations |
| 3.17 | Webhook Configuration | `/super-admin/webhooks` | Configure event webhooks |
| 3.18 | SMS/Email Logs | `/super-admin/communications` | View all sent messages |
| 3.19 | System Health | `/super-admin/health` | Server status, uptime, errors |
| 3.20 | Feature Flags | `/super-admin/features` | Enable/disable features by role |
| 3.21 | Data Export | `/super-admin/export` | Export data (GDPR compliance) |
| 3.22 | Import Wizard | `/super-admin/import` | Import patients, facilities, drivers |
| 3.23 | Changelog | `/super-admin/changelog` | System updates log |

---

## 4. Admin Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 4.1 | Dashboard | `/admin` | Daily stats, active rides, revenue, alerts |
| 4.2 | Rides Overview | `/admin/rides` | All rides list, filters (status, date, driver) |
| 4.3 | Ride Detail | `/admin/rides/[id]` | Full ride info, timeline, edit, cancel |
| 4.4 | Drivers List | `/admin/drivers` | All drivers, status, rating, vehicles |
| 4.5 | Driver Detail | `/admin/drivers/[id]` | Profile, schedule, performance, vehicles |
| 4.6 | Vehicles | `/admin/vehicles` | Fleet list, maintenance status, documents |
| 4.7 | Facilities | `/admin/facilities` | Facility accounts, contacts, patients |
| 4.8 | Facility Detail | `/admin/facilities/[id]` | Facility info, staff, patients, invoices |
| 4.9 | Reports | `/admin/reports` | Revenue, trips, driver performance, exports |
| 4.10 | Notifications Center | `/admin/notifications` | System alerts, failed payments, issues |
| 4.11 | Complaints | `/admin/complaints` | Customer complaints list |
| 4.12 | Complaint Detail | `/admin/complaints/[id]` | Handle specific complaint |
| 4.13 | Refunds | `/admin/refunds` | Process refund requests |
| 4.14 | Insurance Claims | `/admin/claims` | Track insurance claims |
| 4.15 | Compliance Dashboard | `/admin/compliance` | HIPAA, ADA compliance tracking |
| 4.16 | Contract Management | `/admin/contracts` | Facility contracts, terms |

---

## 5. Operations Manager Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 5.1 | Dashboard | `/operations` | Today's ops overview, conflicts, alerts |
| 5.2 | Live Map | `/operations/map` | Real-time driver locations, active rides |
| 5.3 | Schedule Calendar | `/operations/schedule` | Calendar view of all rides, drag-drop |
| 5.4 | Driver Schedules | `/operations/drivers` | Driver availability, shifts, conflicts |
| 5.5 | Driver Schedule Detail | `/operations/drivers/[id]` | Single driver's full schedule |
| 5.6 | Route Optimizer | `/operations/routes` | Multi-ride route optimization |
| 5.7 | Timesheets | `/operations/timesheets` | All staff timesheets, approval |
| 5.8 | Timesheet Detail | `/operations/timesheets/[id]` | Single employee timesheet |
| 5.9 | Shift Manager | `/operations/shifts` | Create/edit shifts, assign staff |
| 5.10 | Vehicle Maintenance | `/operations/maintenance` | Maintenance schedule, due items |
| 5.11 | Maintenance Detail | `/operations/maintenance/[id]` | Single vehicle maintenance record |
| 5.12 | Fuel Tracking | `/operations/fuel` | Fleet fuel logs, costs |
| 5.13 | Mileage Reports | `/operations/mileage` | Vehicle mileage tracking |
| 5.14 | Incident Reports | `/operations/incidents` | All accidents, issues |
| 5.15 | Incident Detail | `/operations/incidents/[id]` | Single incident report |
| 5.16 | Driver Training | `/operations/training` | Training records, certifications |

---

## 6. Dispatcher Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 6.1 | Dashboard | `/dispatcher` | Quick stats, incoming requests, active rides, will-calls |
| 6.2 | Create Ride | `/dispatcher/rides/new` | Multi-step ride booking form (all trip types) |
| 6.3 | Rides List | `/dispatcher/rides` | All rides, quick filters, search |
| 6.4 | Ride Detail | `/dispatcher/rides/[id]` | View/edit ride, reassign driver, notes |
| 6.5 | Quick Book | `/dispatcher/quick-book` | Simplified one-page booking for calls |
| 6.6 | Patient Lookup | `/dispatcher/patients` | Search patients, view history |
| 6.7 | Patient Detail | `/dispatcher/patients/[id]` | Patient info, medical needs, past rides |
| 6.8 | Add Patient | `/dispatcher/patients/new` | Create new patient record |
| 6.9 | Driver Availability | `/dispatcher/drivers` | Which drivers are available now |
| 6.10 | Assign Driver | `/dispatcher/rides/[id]/assign` | Driver selection with conflict check |
| 6.11 | Payment Collection | `/dispatcher/rides/[id]/payment` | Collect payment over phone (Stripe) |
| 6.12 | Multi-Stop Builder | `/dispatcher/rides/new/multi-stop` | Build multi-stop trip with passengers |
| 6.13 | Will-Call Manager | `/dispatcher/will-calls` | Active will-calls, activate, manage |
| 6.14 | Call Log | `/dispatcher/calls` | Log incoming/outgoing calls |
| 6.15 | Shift Notes | `/dispatcher/notes` | Handoff notes between shifts |
| 6.16 | Trip Cancellation | `/dispatcher/rides/[id]/cancel` | Cancel with reason, calculate fees |
| 6.17 | Trip Reschedule | `/dispatcher/rides/[id]/reschedule` | Change date/time with availability check |
| 6.18 | Trip Modification | `/dispatcher/rides/[id]/modify` | Change trip details (address, needs) |
| 6.19 | Batch Operations | `/dispatcher/batch` | Bulk cancel, assign, update multiple trips |
| 6.20 | Price Quote | `/dispatcher/quote` | Generate quote without booking |

---

## 7. Driver Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 7.1 | Dashboard | `/driver` | Today's rides, earnings, status toggle |
| 7.2 | My Rides | `/driver/rides` | Upcoming and past rides list |
| 7.3 | Ride Detail | `/driver/rides/[id]` | Full ride info, navigation, patient needs |
| 7.4 | Active Ride | `/driver/rides/[id]/active` | In-progress ride view, status updates |
| 7.5 | My Schedule | `/driver/schedule` | Calendar view of assigned rides |
| 7.6 | My Earnings | `/driver/earnings` | Earnings history, payouts |
| 7.7 | My Timesheet | `/driver/timesheet` | Clock in/out, hours log |
| 7.8 | My Vehicle | `/driver/vehicle` | Vehicle info, documents, maintenance |
| 7.9 | Profile | `/driver/profile` | Personal info, certifications, documents |
| 7.10 | Notifications | `/driver/notifications` | Messages from dispatch, alerts |
| 7.11 | Pre-Trip Inspection | `/driver/inspection` | Daily vehicle safety check |
| 7.12 | Incident Report | `/driver/incident` | Report accident/issue |
| 7.13 | Documents | `/driver/documents` | Upload license, insurance, certs |
| 7.14 | Training | `/driver/training` | View/complete training modules |
| 7.15 | Background Check | `/driver/background` | Background check status |
| 7.16 | Tax Documents | `/driver/tax` | 1099s, tax information |
| 7.17 | Availability | `/driver/availability` | Set weekly availability hours |
| 7.18 | Time Off Requests | `/driver/time-off` | Request and view PTO |

---

## 8. Facility Staff Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 8.1 | Dashboard | `/facility` | Today's rides, patient count, quick book |
| 8.2 | Book Ride | `/facility/book` | Multi-step booking for facility patient |
| 8.3 | Our Patients | `/facility/patients` | Facility patient roster |
| 8.4 | Patient Detail | `/facility/patients/[id]` | Patient info, medical needs, ride history |
| 8.5 | Add Patient | `/facility/patients/new` | Add patient to facility roster |
| 8.6 | Our Rides | `/facility/rides` | All rides booked by facility |
| 8.7 | Ride Detail | `/facility/rides/[id]` | Ride status, tracking, details |
| 8.8 | Invoices | `/facility/invoices` | Facility invoices, payment status |
| 8.9 | Standing Orders | `/facility/standing-orders` | Recurring schedules list |
| 8.10 | Standing Order Detail | `/facility/standing-orders/[id]` | View/edit recurring schedule |
| 8.11 | Create Standing Order | `/facility/standing-orders/new` | Set up new recurring schedule |
| 8.12 | Bulk Booking | `/facility/book/bulk` | Book multiple patients at once |
| 8.13 | Reports | `/facility/reports` | Trip reports, spending analysis |
| 8.14 | Contract Details | `/facility/contract` | View contract terms, rates |
| 8.15 | Feedback | `/facility/feedback` | Rate service, submit feedback |
| 8.16 | Import Patients | `/facility/import` | Bulk patient import from CSV |

---

## 9. Family Member Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 9.1 | Dashboard | `/family` | Linked patients, upcoming rides, quick book |
| 9.2 | My Patients | `/family/patients` | List of linked patients (e.g., parents) |
| 9.3 | Patient Detail | `/family/patients/[id]` | Patient info, medical needs, permissions |
| 9.4 | Book Ride | `/family/book` | Book ride for linked patient |
| 9.5 | Rides | `/family/rides` | All rides for linked patients |
| 9.6 | Ride Tracking | `/family/rides/[id]` | Real-time tracking, driver info |
| 9.7 | Trip Feedback | `/family/rides/[id]/feedback` | Rate completed trip |
| 9.8 | Payment History | `/family/payments` | Payment records |
| 9.9 | Settings | `/family/settings` | Notification preferences |
| 9.10 | Help/Support | `/family/help` | FAQ, contact support |

---

## 10. Patient Portal

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 10.1 | Dashboard | `/patient` | Upcoming rides, quick book, loyalty points |
| 10.2 | Book Ride | `/patient/book` | Multi-step self-booking |
| 10.3 | My Rides | `/patient/rides` | Ride history and upcoming |
| 10.4 | Ride Tracking | `/patient/rides/[id]` | Real-time tracking during ride |
| 10.5 | My Profile | `/patient/profile` | Personal info, medical needs, addresses |
| 10.6 | Payment Methods | `/patient/payment` | Saved cards, add new |
| 10.7 | Trip Feedback | `/patient/rides/[id]/feedback` | Rate completed trip |
| 10.8 | Loyalty Rewards | `/patient/rewards` | Points, redemption options |
| 10.9 | Settings | `/patient/settings` | Notification preferences |
| 10.10 | Help/Support | `/patient/help` | FAQ, contact support |

---

## 11. System Pages

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 11.1 | 404 Not Found | `/404` | Page not found error |
| 11.2 | 500 Server Error | `/500` | Server error page |
| 11.3 | Maintenance Mode | `/maintenance` | Scheduled maintenance notice |
| 11.4 | Account Settings | `/settings/account` | Profile, change password |
| 11.5 | Security Settings | `/settings/security` | 2FA setup, active sessions |
| 11.6 | Notification Preferences | `/settings/notifications` | Email, SMS, push preferences |
| 11.7 | Print Trip Manifest | `/print/manifest/[date]` | Printable daily driver manifest |
| 11.8 | Print Invoice | `/print/invoice/[id]` | Printable invoice |
| 11.9 | Print Receipt | `/print/receipt/[id]` | Printable payment receipt |
| 11.10 | Terms of Service | `/terms` | Terms and conditions |

---

## 12. Shared Modals & Overlays

These appear as modals or overlays across multiple portals:

| # | Component | Description |
|---|-----------|-------------|
| S.1 | Address Autocomplete Modal | Google Places address picker |
| S.2 | Driver Assignment Modal | Select driver with availability check |
| S.3 | Payment Modal | Stripe payment form |
| S.4 | Confirmation Modal | "Are you sure?" dialogs |
| S.5 | Ride Quote Preview | Price breakdown before confirm |
| S.6 | Patient Quick Add | Add patient inline |
| S.7 | Notes/Comments Drawer | Add notes to ride |
| S.8 | Notification Toast | Success/error messages |
| S.9 | Filter Drawer | Advanced filters for lists |
| S.10 | Date/Time Picker | Schedule date and time |
| S.11 | Multi-Stop Builder Modal | Add/edit stops with drag-drop |
| S.12 | Passenger Assignment Modal | Assign passengers to stops |
| S.13 | Will-Call Activation Modal | Activate will-call trip |
| S.14 | Appointment Time Calculator | Calculate pickup from appointment time |
| S.15 | Duplicate Booking Warning | Alert for potential duplicate |
| S.16 | Round Trip Options Modal | Configure return trip (scheduled/will-call) |
| S.17 | Standing Order Skip Modal | Skip specific date with reason |
| S.18 | Call Log Quick Entry | Log a call quickly |
| S.19 | Service Area Map | View/edit service boundary |
| S.20 | Cancel Trip Modal | Cancellation reason, fee preview |
| S.21 | Reschedule Modal | Date/time picker with availability |
| S.22 | Refund Modal | Process refund with amount |
| S.23 | Complaint Modal | Log customer complaint |
| S.24 | Incident Report Modal | Quick incident logging |
| S.25 | Inspection Checklist Modal | Pre-trip inspection form |
| S.26 | Document Upload Modal | Upload with type and expiry |
| S.27 | Training Completion Modal | Mark training complete |
| S.28 | Feedback/Rating Modal | Star rating + comments |
| S.29 | Session Management Modal | View/revoke active sessions |
| S.30 | 2FA Setup Modal | Configure two-factor auth |
| S.31 | Bulk Action Confirm Modal | Confirm batch operations |

---

## Screen Count by Role

| Role | Screen Count |
|------|--------------|
| Public | 7 |
| Authentication | 9 |
| Super Admin | 23 |
| Admin | 16 |
| Operations Manager | 16 |
| Dispatcher | 20 |
| Driver | 18 |
| Facility Staff | 16 |
| Family Member | 10 |
| Patient | 10 |
| System Pages | 10 |
| **Pages Subtotal** | **155** |
| Shared Modals | 31 |
| **GRAND TOTAL** | **186** |

---

## Priority Order for Development

### Phase 1: Core Operations (Days 1-30)
1. Login (2.1)
2. Dispatcher Dashboard (6.1)
3. Quick Book (6.5)
4. Create Ride (6.2)
5. Rides List (6.3)
6. Ride Detail (6.4)
7. Patient Lookup (6.6)
8. Add Patient (6.8)
9. Driver Availability (6.9)
10. Assign Driver (6.10)
11. Payment Collection (6.11)
12. Driver Dashboard (7.1)
13. Driver My Rides (7.2)
14. Driver Ride Detail (7.3)
15. Driver Active Ride (7.4)
16. Pre-Trip Inspection (7.11)
17. Operations Dashboard (5.1)
18. Schedule Calendar (5.3)
19. Pricing Settings (3.7)
20. Will-Call Manager (6.13)
21. Multi-Stop Builder (6.12)

### Phase 2: Admin & Extended Features (Days 31-60)
- Full Admin portal (4.1-4.20)
- Operations Manager features (5.1-5.22)
- Timesheets (5.7-5.8)
- Driver earnings & payouts (7.6, 7.17-7.19)
- Driver documents (7.13)
- Invoicing (8.8)
- Standing Orders (8.9-8.11)
- Emergency Alert System (6.21-6.24)
- Vehicle Maintenance (5.13-5.16)

### Phase 3: External Portals (Days 61-80)
- Facility portal (8.1-8.20)
- Family portal (9.1-9.10)
- Patient self-service (10.1-10.10)
- Bulk Booking (8.17-8.18)
- Contract Management (8.19-8.20)

### Phase 4: Polish & Advanced (Days 81-100)
- Live map (5.2)
- Route optimizer (5.6)
- Public pages (1.1-1.7)
- Reports & analytics
- System health & monitoring (3.24-3.28)
- Compliance dashboards
- QuickBooks Integration (3.21-3.23)
- Document Expiry Management (5.19-5.22)

---

## Additional Screens by Feature

### Emergency Management (Dispatcher)

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 6.21 | Emergency Dashboard | `/dispatcher/emergencies` | Active emergencies, history, quick actions |
| 6.22 | Emergency Detail | `/dispatcher/emergencies/[id]` | Full emergency info, response timeline |
| 6.23 | Emergency Map View | `/dispatcher/emergencies/map` | Live map with emergency locations |
| 6.24 | Emergency Response | `/dispatcher/emergencies/[id]/respond` | Acknowledge, escalate, resolve |

### Driver Payouts (Driver Portal)

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 7.17 | Payout Dashboard | `/driver/payouts` | Summary, pending, history |
| 7.18 | Payout Detail | `/driver/payouts/[id]` | Full breakdown, trips included |
| 7.19 | Bank Setup | `/driver/payouts/setup` | Stripe Connect onboarding |
| 7.20 | Earnings History | `/driver/earnings` | Daily/weekly earnings breakdown |
| 7.21 | Tax Documents | `/driver/tax-documents` | 1099s, annual summaries |
| 7.22 | Instant Payout | `/driver/payouts/instant` | Request instant payout |

### Vehicle Maintenance (Operations)

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 5.13 | Maintenance Dashboard | `/operations/maintenance` | Due items, alerts, calendar |
| 5.14 | Maintenance Schedule | `/operations/maintenance/schedule` | All scheduled maintenance |
| 5.15 | Maintenance Record | `/operations/maintenance/[id]` | Record details, receipts |
| 5.16 | Add Maintenance | `/operations/maintenance/new` | Log completed maintenance |
| 5.17 | Inspection Results | `/operations/inspections` | All inspection reports |
| 5.18 | Inspection Detail | `/operations/inspections/[id]` | Full checklist results |
| 5.19 | Document Expiry | `/operations/expiry` | All expiring documents |
| 5.20 | Expiry Calendar | `/operations/expiry/calendar` | Calendar view of expirations |
| 5.21 | Vehicle Issues | `/operations/issues` | Open vehicle issues |
| 5.22 | Issue Detail | `/operations/issues/[id]` | Issue details, resolution |

### Facility Bulk & Contracts

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 8.17 | Bulk Booking | `/facility/bulk-book` | Multi-patient booking wizard |
| 8.18 | Bulk Booking Status | `/facility/bulk-book/[id]` | Processing status, results |
| 8.19 | Contract Details | `/facility/contract` | View contract terms, rates |
| 8.20 | Volume Dashboard | `/facility/volume` | Monthly trips, tier progress |

### Super Admin - Integrations

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 3.21 | QuickBooks Setup | `/super-admin/integrations/quickbooks` | OAuth connection, mapping |
| 3.22 | QuickBooks Sync | `/super-admin/integrations/quickbooks/sync` | Sync status, errors |
| 3.23 | Integration Logs | `/super-admin/integrations/logs` | All integration activity |
| 3.24 | System Jobs | `/super-admin/jobs` | Background job monitor |
| 3.25 | Job Detail | `/super-admin/jobs/[id]` | Job execution details |
| 3.26 | System Health | `/super-admin/health` | Server status, metrics |
| 3.27 | API Usage | `/super-admin/api-usage` | API calls, rate limits |
| 3.28 | Feature Flags | `/super-admin/features` | Toggle features on/off |

### Admin - Compliance

| # | Screen Name | Route | Description |
|---|-------------|-------|-------------|
| 4.17 | Compliance Dashboard | `/admin/compliance` | Overview of compliance status |
| 4.18 | Driver Compliance | `/admin/compliance/drivers` | Driver certifications status |
| 4.19 | Vehicle Compliance | `/admin/compliance/vehicles` | Vehicle inspections status |
| 4.20 | Compliance Reports | `/admin/compliance/reports` | Generate compliance reports |

---

## Additional Modals

| # | Modal Name | Trigger | Description |
|---|------------|---------|-------------|
| M.32 | Emergency Create | Emergency button | Create new emergency alert |
| M.33 | Emergency Acknowledge | Emergency card | Acknowledge emergency |
| M.34 | Emergency Resolve | Emergency detail | Mark emergency resolved |
| M.35 | Instant Payout | Payout dashboard | Request instant payout with fee |

---

## Screen Count Summary

| Portal | Page Count | New Screens |
|--------|------------|-------------|
| Public | 7 | - |
| Auth | 9 | - |
| Super Admin | 28 | +5 (integrations, jobs) |
| Admin | 20 | +4 (compliance) |
| Operations | 22 | +6 (maintenance, expiry) |
| Dispatcher | 24 | +4 (emergency) |
| Driver | 22 | +4 (payouts) |
| Facility | 20 | +4 (bulk, contracts) |
| Family | 10 | - |
| Patient | 10 | - |
| System | 8 | -2 (consolidated) |
| **Total Pages** | **180** | **+25** |
| Modals | 35 | +4 |
| **Grand Total** | **215** | **+29** |

---

*This catalog serves as the definitive list of screens to design and build.*
