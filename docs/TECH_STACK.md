# Technology Stack - Wheelchair Transportation Platform

> **Version:** 1.0
> **Last Updated:** January 2026
> **Purpose:** Complete technology decisions and configurations

---

## Table of Contents

1. [Stack Overview](#1-stack-overview)
2. [Frontend](#2-frontend)
3. [Backend](#3-backend)
4. [Database](#4-database)
5. [Authentication](#5-authentication)
6. [Real-Time](#6-real-time)
7. [External Services](#7-external-services)
8. [DevOps & Infrastructure](#8-devops--infrastructure)
9. [Development Tools](#9-development-tools)
10. [Security](#10-security)
11. [Monitoring & Logging](#11-monitoring--logging)
12. [Package Versions](#12-package-versions)

---

## 1. Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Web App       │   Mobile Web    │   Driver App (PWA)          │
│   (Next.js)     │   (Responsive)  │   (Next.js PWA)             │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                        │
         └─────────────────┼────────────────────────┘
                           │
         ┌─────────────────▼─────────────────┐
         │           API GATEWAY              │
         │        (Next.js API Routes)        │
         └─────────────────┬─────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼───┐            ┌─────▼─────┐          ┌────▼────┐
│ REST  │            │ WebSocket │          │  Cron   │
│  API  │            │  Server   │          │  Jobs   │
└───┬───┘            └─────┬─────┘          └────┬────┘
    │                      │                     │
    └──────────────────────┼─────────────────────┘
                           │
         ┌─────────────────▼─────────────────┐
         │         DATA LAYER                 │
         │   PostgreSQL + Redis + S3          │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────▼─────────────────┐
         │       EXTERNAL SERVICES            │
         │  Stripe│Twilio│Google│SendGrid     │
         └───────────────────────────────────┘
```

### Quick Reference

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 15 + React 19 | Web application |
| Styling | Tailwind CSS + Shadcn/ui | UI components |
| Backend | Next.js API Routes | REST API |
| Database | PostgreSQL 16 | Primary data store |
| ORM | Prisma 5.x | Database access |
| Cache | Redis 7.x | Sessions, cache, pub/sub |
| Auth | NextAuth.js v5 | Authentication |
| Payments | Stripe | Payment processing |
| SMS | Twilio | Text messages |
| Email | SendGrid | Email delivery |
| Maps | Google Maps Platform | Geocoding, routing |
| Storage | AWS S3 / Cloudflare R2 | File storage |
| Hosting | Vercel / AWS | Deployment |
| Real-time | Socket.io | WebSocket connections |

---

## 2. Frontend

### 2.1 Core Framework

```json
{
  "framework": "Next.js 15.x",
  "react": "19.x",
  "typescript": "5.x",
  "node": "20.x LTS"
}
```

**Why Next.js 15?**
- App Router for better layouts
- Server Components for performance
- Built-in API routes
- Excellent TypeScript support
- Vercel deployment optimization
- React 19 concurrent features

### 2.2 UI Framework

```json
{
  "styling": "Tailwind CSS 3.4",
  "components": "Shadcn/ui",
  "primitives": "Radix UI",
  "icons": "Lucide React",
  "fonts": "Inter (Google Fonts)"
}
```

**Component Library Structure:**
```
/components
  /ui              # Shadcn/ui base components
    button.tsx
    input.tsx
    dialog.tsx
    ...
  /domain          # Domain-specific components
    ride-card.tsx
    driver-card.tsx
    price-breakdown.tsx
    ...
  /layouts         # Layout components
    dashboard-layout.tsx
    auth-layout.tsx
    ...
```

### 2.3 State Management

```json
{
  "server-state": "TanStack Query (React Query) v5",
  "client-state": "Zustand 4.x",
  "forms": "React Hook Form + Zod",
  "url-state": "nuqs"
}
```

**State Patterns:**

| State Type | Solution | Use Case |
|------------|----------|----------|
| Server data | TanStack Query | API data, caching |
| UI state | Zustand | Modals, sidebar, theme |
| Form state | React Hook Form | All forms |
| URL state | nuqs | Filters, pagination |
| Auth state | NextAuth session | User session |

### 2.4 Key Frontend Packages

```json
{
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x",
    "typescript": "5.x",
    
    "@tanstack/react-query": "5.x",
    "zustand": "4.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "@hookform/resolvers": "3.x",
    
    "tailwindcss": "3.4.x",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "0.7.x",
    "clsx": "2.x",
    "tailwind-merge": "2.x",
    "lucide-react": "0.x",
    
    "@react-google-maps/api": "2.x",
    "date-fns": "3.x",
    "recharts": "2.x",
    
    "socket.io-client": "4.x",
    "next-auth": "5.x",
    "@stripe/stripe-js": "2.x",
    "@stripe/react-stripe-js": "2.x"
  }
}
```

### 2.5 Folder Structure

```
/app
  /(auth)
    /login
    /register
    /forgot-password
  /(dashboard)
    /dispatcher
    /driver
    /admin
    /operations
    /facility
    /patient
    /family
  /api
    /auth
    /trips
    /drivers
    /patients
    ...

/components
  /ui
  /domain
  /layouts
  /forms

/lib
  /api          # API client functions
  /hooks        # Custom hooks
  /utils        # Utility functions
  /validations  # Zod schemas
  /constants    # Constants

/stores         # Zustand stores
/types          # TypeScript types
/styles         # Global styles
```

---

## 3. Backend

### 3.1 API Architecture

```json
{
  "framework": "Next.js API Routes",
  "validation": "Zod",
  "orm": "Prisma 5.x",
  "auth": "NextAuth.js v5"
}
```

**API Route Structure:**
```
/app/api
  /auth
    /[...nextauth]/route.ts
    /register/route.ts
    /verify-phone/route.ts
  /trips
    /route.ts                 # GET list, POST create
    /[id]/route.ts            # GET, PUT, DELETE single
    /[id]/status/route.ts     # PATCH status
    /[id]/assign/route.ts     # POST assign driver
  /drivers
    /route.ts
    /[id]/route.ts
    /[id]/location/route.ts
    /me/route.ts
  /patients
  /facilities
  /payments
  /admin
  /webhooks
    /stripe/route.ts
    /twilio/route.ts
```

### 3.2 API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ],
    "requestId": "req_abc123"
  }
}
```

### 3.3 Middleware Stack

```typescript
// Middleware execution order
1. Rate Limiting (Redis)
2. Authentication (NextAuth)
3. Authorization (Role check)
4. Validation (Zod)
5. Handler
6. Error Handler
7. Audit Logging
```

### 3.4 Background Jobs

```json
{
  "queue": "BullMQ 5.x",
  "scheduler": "node-cron",
  "redis": "ioredis 5.x"
}
```

**Job Types:**
| Job | Trigger | Description |
|-----|---------|-------------|
| SendSMS | Event | Send SMS notification |
| SendEmail | Event | Send email notification |
| GenerateInvoice | Scheduled | Monthly invoice generation |
| StandingOrderTrips | Daily | Create trips from standing orders |
| TripReminders | Every 15 min | Send trip reminders |
| ExpireWillCalls | Hourly | Expire old will-call trips |
| SyncQuickBooks | Every 30 min | Sync invoices |
| ProcessPayouts | Weekly | Driver payouts |
| CleanupTokens | Daily | Remove expired tokens |

---

## 4. Database

### 4.1 Primary Database

```json
{
  "database": "PostgreSQL 16",
  "orm": "Prisma 5.x",
  "hosting": "Neon / Supabase / AWS RDS"
}
```

**Why PostgreSQL?**
- ACID compliance
- JSON support for flexible data
- PostGIS for geospatial queries
- Excellent performance
- Mature ecosystem

### 4.2 Database Configuration

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions"]
}
```

**Extensions:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- UUID generation
CREATE EXTENSION IF NOT EXISTS "postgis";        -- Geospatial
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Fuzzy search
```

### 4.3 Connection Pooling

```json
{
  "pooler": "PgBouncer / Prisma Accelerate",
  "min_connections": 5,
  "max_connections": 20,
  "idle_timeout": 60
}
```

### 4.4 Cache Layer (Redis)

```json
{
  "database": "Redis 7.x",
  "hosting": "Upstash / Redis Cloud / AWS ElastiCache",
  "use_cases": [
    "Session storage",
    "Rate limiting",
    "API response cache",
    "Real-time pub/sub",
    "Job queues (BullMQ)",
    "Driver locations (hot data)"
  ]
}
```

**Cache Keys Structure:**
```
session:{userId}           # User sessions
rate:{ip}:{endpoint}       # Rate limiting
cache:trip:{tripId}        # Trip cache
driver:location:{driverId} # Real-time location
ws:connections:{userId}    # WebSocket connections
job:queue:{jobType}        # BullMQ queues
```

### 4.5 Database Indexes

```prisma
// Critical indexes for performance
@@index([scheduledPickupTime])          // Trip queries by time
@@index([status, scheduledPickupTime])  // Status filtering
@@index([patientId, createdAt])         // Patient history
@@index([driverId, scheduledPickupTime]) // Driver schedule
@@index([facilityId, status])           // Facility trips
@@index([latitude, longitude])          // Geospatial
```

---

## 5. Authentication

### 5.1 Auth Stack

```json
{
  "library": "NextAuth.js v5 (Auth.js)",
  "session": "JWT + Database sessions",
  "2fa": "TOTP (Google Authenticator)",
  "password": "bcrypt (12 rounds)"
}
```

### 5.2 Auth Providers

| Provider | Use Case |
|----------|----------|
| Credentials | Email/password login |
| Magic Link | Passwordless login |
| Phone (custom) | SMS OTP verification |

### 5.3 Session Configuration

```typescript
// auth.config.ts
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.facilityId = user.facilityId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.facilityId = token.facilityId;
      return session;
    },
  },
};
```

### 5.4 Role-Based Access Control

```typescript
// Role hierarchy
const ROLE_HIERARCHY = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  OPERATIONS_MANAGER: 60,
  DISPATCHER: 40,
  DRIVER: 30,
  FACILITY_STAFF: 20,
  FAMILY_MEMBER: 10,
  PATIENT: 10,
};

// Permission matrix in API routes
const PERMISSIONS = {
  'trips:create': ['SUPER_ADMIN', 'ADMIN', 'DISPATCHER', 'FACILITY_STAFF', 'FAMILY_MEMBER', 'PATIENT'],
  'trips:assign': ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER'],
  'trips:cancel': ['SUPER_ADMIN', 'ADMIN', 'DISPATCHER'],
  'drivers:manage': ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'],
  'billing:view': ['SUPER_ADMIN', 'ADMIN', 'FACILITY_STAFF'],
  'settings:modify': ['SUPER_ADMIN'],
};
```

---

## 6. Real-Time

### 6.1 WebSocket Stack

```json
{
  "server": "Socket.io 4.x",
  "client": "socket.io-client 4.x",
  "adapter": "Redis adapter (for scaling)",
  "transport": ["websocket", "polling"]
}
```

### 6.2 Socket.io Configuration

```typescript
// server
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Redis adapter for horizontal scaling
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));
```

### 6.3 Real-Time Channels

| Channel | Events | Subscribers |
|---------|--------|-------------|
| `dispatch` | new_trip, trip_update, driver_update | Dispatchers |
| `trip:{id}` | status_update, location_update, eta_update | Trip stakeholders |
| `driver:{id}` | new_assignment, trip_update | Specific driver |
| `facility:{id}` | trip_update, booking_confirmation | Facility staff |
| `alerts` | emergency, system_alert | All staff |

### 6.4 Location Updates

```typescript
// Driver location update flow
1. Driver app sends location (every 10 seconds)
2. API receives, validates, stores in Redis
3. If on trip, publish to trip channel
4. Calculate ETA if significant change
5. Update database (throttled, every 60 seconds)
```

---

## 7. External Services

### 7.1 Payment Processing (Stripe)

```json
{
  "service": "Stripe",
  "api_version": "2024-12-18.acacia",
  "features": [
    "Payment Intents",
    "Payment Elements",
    "Apple Pay / Google Pay",
    "Stripe Connect (driver payouts)",
    "Invoicing",
    "Webhooks"
  ]
}
```

**Stripe Products:**
| Product | Use Case |
|---------|----------|
| Payment Intents | Individual trip payments |
| Payment Elements | Checkout UI |
| Connect Express | Driver payout accounts |
| Invoicing | Facility invoices |
| Billing | Subscription (future) |

### 7.2 SMS (Twilio)

```json
{
  "service": "Twilio",
  "products": [
    "Programmable SMS",
    "Phone Number Lookup",
    "Verify (OTP)"
  ],
  "phone_numbers": "1 local number per region"
}
```

**SMS Templates:**
```typescript
const SMS_TEMPLATES = {
  BOOKING_CONFIRMATION: '{company}: Ride confirmed for {date} at {time}. Trip #{number}',
  DRIVER_ASSIGNED: '{company}: {driver} will pick you up. Track: {url}',
  DRIVER_5MIN: '{company}: Your driver is 5 minutes away.',
  DRIVER_ARRIVED: '{company}: Driver arrived. {vehicle}, plate {plate}.',
  OTP: '{company}: Your verification code is {code}. Valid for 10 minutes.',
};
```

### 7.3 Email (SendGrid)

```json
{
  "service": "SendGrid",
  "features": [
    "Transactional Email",
    "Dynamic Templates",
    "Email Validation",
    "Event Webhooks"
  ]
}
```

**Email Templates:**
| Template | Trigger |
|----------|---------|
| Welcome | Registration |
| Booking Confirmation | Trip created |
| Trip Receipt | Trip completed |
| Invoice | Invoice generated |
| Password Reset | Reset requested |

### 7.4 Maps (Google Maps Platform)

```json
{
  "service": "Google Maps Platform",
  "apis": [
    "Maps JavaScript API",
    "Places API",
    "Directions API",
    "Distance Matrix API",
    "Geocoding API"
  ]
}
```

**API Usage:**
| API | Use Case | Est. Monthly Calls |
|-----|----------|-------------------|
| Places Autocomplete | Address input | 10,000 |
| Geocoding | Address validation | 5,000 |
| Directions | Route calculation | 15,000 |
| Distance Matrix | Multi-stop optimization | 5,000 |
| Maps JavaScript | Live tracking display | N/A (sessions) |

### 7.5 Accounting (QuickBooks)

```json
{
  "service": "QuickBooks Online",
  "api": "QuickBooks REST API v3",
  "oauth": "OAuth 2.0",
  "sync": ["Invoices", "Payments", "Customers"]
}
```

### 7.6 File Storage

```json
{
  "service": "AWS S3 / Cloudflare R2",
  "use_cases": [
    "Driver documents",
    "Vehicle photos",
    "Invoice PDFs",
    "Signature captures",
    "Inspection photos"
  ],
  "cdn": "CloudFront / Cloudflare"
}
```

---

## 8. DevOps & Infrastructure

### 8.1 Hosting

```json
{
  "primary": "Vercel",
  "alternatives": ["AWS Amplify", "Railway", "Render"],
  "regions": ["us-east-1 (N. Virginia)"]
}
```

**Vercel Configuration:**
```json
{
  "framework": "nextjs",
  "buildCommand": "prisma generate && next build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*": {
      "maxDuration": 30
    }
  }
}
```

### 8.2 Database Hosting

| Option | Pros | Cons |
|--------|------|------|
| **Neon** (Recommended) | Serverless, auto-scaling, branching | Newer service |
| Supabase | Postgres + extras, good DX | Can be overkill |
| PlanetScale | Great scaling | MySQL only |
| AWS RDS | Full control | More management |

### 8.3 CI/CD Pipeline

```yaml
# GitHub Actions
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 8.4 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_DATABASE_URL="postgresql://..." # For migrations

# Redis
REDIS_URL="redis://..."

# Auth
NEXTAUTH_URL="https://app.example.com"
NEXTAUTH_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Twilio
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."

# SendGrid
SENDGRID_API_KEY="SG..."
SENDGRID_FROM_EMAIL="noreply@example.com"

# Google Maps
GOOGLE_MAPS_API_KEY="AIza..."

# QuickBooks
QUICKBOOKS_CLIENT_ID="..."
QUICKBOOKS_CLIENT_SECRET="..."

# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="..."
AWS_REGION="us-east-1"

# Sentry
SENTRY_DSN="https://..."
```

---

## 9. Development Tools

### 9.1 Code Quality

```json
{
  "linter": "ESLint 9.x",
  "formatter": "Prettier 3.x",
  "git_hooks": "Husky + lint-staged",
  "commit_lint": "Conventional Commits"
}
```

**ESLint Config:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### 9.2 Testing

```json
{
  "unit": "Vitest",
  "integration": "Vitest + Testing Library",
  "e2e": "Playwright",
  "api": "Vitest + Supertest"
}
```

**Test Structure:**
```
/tests
  /unit
    /components
    /lib
    /utils
  /integration
    /api
    /pages
  /e2e
    /flows
      booking.spec.ts
      driver.spec.ts
```

### 9.3 Documentation

```json
{
  "api_docs": "Swagger/OpenAPI 3.0",
  "component_docs": "Storybook 8.x",
  "general_docs": "Markdown in /docs"
}
```

---

## 10. Security

### 10.1 Security Measures

| Layer | Measure |
|-------|---------|
| Transport | HTTPS only, TLS 1.3 |
| Headers | Helmet.js security headers |
| CORS | Strict origin policy |
| CSRF | CSRF tokens on forms |
| XSS | Content Security Policy |
| SQL Injection | Prisma parameterized queries |
| Rate Limiting | Redis-based per IP/user |
| Auth | bcrypt, JWT rotation |
| Secrets | Environment variables only |
| Audit | All actions logged |

### 10.2 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.stripe.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: *.googleapis.com *.gstatic.com *.stripe.com; font-src 'self' fonts.gstatic.com; connect-src 'self' *.stripe.com *.googleapis.com wss://*.example.com; frame-src *.stripe.com *.google.com;"
  }
];
```

### 10.3 Data Protection

```typescript
// Sensitive data handling
- PII encrypted at rest (database)
- Payment data: Never stored (Stripe handles)
- Medical data: HIPAA considerations
- Passwords: bcrypt hashed
- API keys: Environment variables only
- Audit logs: Immutable, retained 7 years
```

---

## 11. Monitoring & Logging

### 11.1 Error Tracking

```json
{
  "service": "Sentry",
  "features": [
    "Error tracking",
    "Performance monitoring",
    "Session replay",
    "Release tracking"
  ]
}
```

### 11.2 Application Monitoring

```json
{
  "metrics": "Vercel Analytics / Datadog",
  "uptime": "Better Uptime / Pingdom",
  "logs": "Vercel Logs / Logtail"
}
```

### 11.3 Logging Strategy

```typescript
// Log levels
const LOG_LEVELS = {
  error: 0,   // Errors that need attention
  warn: 1,    // Warnings
  info: 2,    // Important events
  http: 3,    // HTTP requests
  debug: 4,   // Debug information
};

// What to log
- All API requests (method, path, status, duration)
- Authentication events
- Payment events
- Trip status changes
- Errors with stack traces
- Security events
```

### 11.4 Alerts

| Alert | Threshold | Channel |
|-------|-----------|---------|
| Error rate | >1% | Slack, PagerDuty |
| Response time | >2s p95 | Slack |
| Failed payments | Any | Slack, Email |
| Server down | 1 min | PagerDuty |
| Database connection | Any failure | PagerDuty |

---

## 12. Package Versions

### 12.1 Core Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.3.0"
}
```

### 12.2 Database & ORM

```json
{
  "prisma": "^5.10.0",
  "@prisma/client": "^5.10.0",
  "ioredis": "^5.3.0"
}
```

### 12.3 Authentication

```json
{
  "next-auth": "^5.0.0-beta",
  "@auth/prisma-adapter": "^2.0.0",
  "bcryptjs": "^2.4.3"
}
```

### 12.4 UI Components

```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "latest",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.300.0"
}
```

### 12.5 Data Fetching & State

```json
{
  "@tanstack/react-query": "^5.20.0",
  "zustand": "^4.5.0",
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0"
}
```

### 12.6 External Services

```json
{
  "stripe": "^14.0.0",
  "@stripe/stripe-js": "^2.4.0",
  "@stripe/react-stripe-js": "^2.4.0",
  "twilio": "^4.20.0",
  "@sendgrid/mail": "^8.1.0",
  "@googlemaps/js-api-loader": "^1.16.0"
}
```

### 12.7 Real-Time

```json
{
  "socket.io": "^4.7.0",
  "socket.io-client": "^4.7.0",
  "@socket.io/redis-adapter": "^8.3.0"
}
```

### 12.8 Utilities

```json
{
  "date-fns": "^3.3.0",
  "uuid": "^9.0.0",
  "nanoid": "^5.0.0",
  "lodash": "^4.17.21"
}
```

### 12.9 Development

```json
{
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.2.0",
    "vitest": "^1.2.0",
    "@playwright/test": "^1.41.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push     # Development
npx prisma migrate dev # Create migration

# Run development server
npm run dev

# Run tests
npm run test           # Unit tests
npm run test:e2e       # E2E tests

# Build for production
npm run build

# Lint and format
npm run lint
npm run format
```

---

*This tech stack is optimized for rapid development, scalability, and maintainability.*
