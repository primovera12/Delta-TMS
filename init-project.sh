#!/bin/bash
# ============================================================
# Wheelchair Transportation Platform - Project Initializer
# ============================================================
# This script sets up the complete project structure
# Run this ONCE at the start of your project
# ============================================================

set -e  # Exit on error

echo "🚀 Initializing Wheelchair Transportation Platform..."
echo ""

# ============================================================
# Step 1: Check if we're in the right directory
# ============================================================
if [ ! -d "docs" ]; then
    echo "❌ Error: 'docs' folder not found."
    echo "   Make sure you're in the root of your GitHub repo."
    exit 1
fi

echo "✅ Found docs folder"

# ============================================================
# Step 2: Initialize Next.js project (if not exists)
# ============================================================
if [ ! -f "package.json" ]; then
    echo ""
    echo "📦 Creating Next.js 15 project..."
    
    # Create package.json manually to control versions
    cat > package.json << 'EOF'
{
  "name": "wheelchair-transport",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "parse-tasks": "npx tsx scripts/task-parser.ts",
    "orchestrate": "npx tsx scripts/orchestrator.ts next",
    "orchestrate:continuous": "npx tsx scripts/orchestrator.ts continuous",
    "orchestrate:status": "npx tsx scripts/orchestrator.ts status",
    "approve-checkpoint": "npx tsx scripts/orchestrator.ts approve"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.10.0",
    "next-auth": "^5.0.0-beta.4",
    "@auth/prisma-adapter": "^2.0.0",
    "@tanstack/react-query": "^5.20.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.3.0",
    "@radix-ui/react-alert-dialog": "^1.0.0",
    "@radix-ui/react-avatar": "^1.0.0",
    "@radix-ui/react-checkbox": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-label": "^2.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.0",
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-switch": "^1.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "sonner": "^1.3.0",
    "@anthropic-ai/sdk": "^0.27.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/bcryptjs": "^2.4.0",
    "prisma": "^5.10.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0",
    "tsx": "^4.7.0"
  }
}
EOF
    echo "✅ Created package.json"
else
    echo "✅ package.json already exists"
fi

# ============================================================
# Step 3: Create Next.js config
# ============================================================
if [ ! -f "next.config.js" ]; then
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
EOF
    echo "✅ Created next.config.js"
fi

# ============================================================
# Step 4: Create TypeScript config
# ============================================================
if [ ! -f "tsconfig.json" ]; then
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    echo "✅ Created tsconfig.json"
fi

# ============================================================
# Step 5: Create Tailwind config with brand colors
# ============================================================
if [ ! -f "tailwind.config.ts" ]; then
    cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from BRAND_GUIDELINES.md
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',  // Primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        gray: {
          50: '#f9fafb',   // Background
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',  // Secondary text
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',  // Primary text
          900: '#111827',
          950: '#030712',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
EOF
    echo "✅ Created tailwind.config.ts"
fi

# ============================================================
# Step 6: Create PostCSS config
# ============================================================
if [ ! -f "postcss.config.js" ]; then
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    echo "✅ Created postcss.config.js"
fi

# ============================================================
# Step 7: Create Prisma schema
# ============================================================
mkdir -p prisma

cat > prisma/schema.prisma << 'EOF'
// Wheelchair Transportation Platform
// Database Schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================================
// AUTHENTICATION & USERS
// ============================================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  phone         String?   @unique
  phoneVerified Boolean   @default(false)
  passwordHash  String?
  firstName     String
  lastName      String
  role          Role      @default(PATIENT)
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  patient       Patient?
  driver        Driver?
  facilityStaff FacilityStaff?
  
  @@index([email])
  @@index([role])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================================
// ENUMS
// ============================================================

enum Role {
  SUPER_ADMIN
  ADMIN
  OPERATIONS_MANAGER
  DISPATCHER
  DRIVER
  FACILITY_ADMIN
  FACILITY_STAFF
  FAMILY_MEMBER
  PATIENT
}

enum TripStatus {
  PENDING
  CONFIRMED
  ASSIGNED
  DRIVER_EN_ROUTE
  DRIVER_ARRIVED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum TripType {
  ONE_WAY
  ROUND_TRIP
  MULTI_STOP
  WILL_CALL
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
  INVOICED
  PAID
}

enum PaymentMethod {
  CARD
  CASH
  INVOICE
  APPLE_PAY
  GOOGLE_PAY
}

enum VehicleType {
  WHEELCHAIR_VAN
  STRETCHER_VAN
  AMBULATORY
}

enum DriverStatus {
  OFFLINE
  ONLINE
  AVAILABLE
  ASSIGNED
  EN_ROUTE
  ON_TRIP
  BREAK
}

// ============================================================
// PATIENTS
// ============================================================

model Patient {
  id                String   @id @default(cuid())
  userId            String   @unique
  dateOfBirth       DateTime?
  medicalNotes      String?  @db.Text
  mobilityAids      String[] // wheelchair, walker, etc.
  requiresOxygen    Boolean  @default(false)
  requiresWheelchair Boolean @default(true)
  defaultPickupAddress  Json?
  defaultDropoffAddress Json?
  emergencyContact  Json?    // { name, phone, relationship }
  insuranceInfo     Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  trips             Trip[]
  facilityId        String?
  facility          Facility? @relation(fields: [facilityId], references: [id])

  @@index([facilityId])
}

// ============================================================
// DRIVERS
// ============================================================

model Driver {
  id                 String       @id @default(cuid())
  userId             String       @unique
  licenseNumber      String
  licenseExpiry      DateTime
  vehicleId          String?
  status             DriverStatus @default(OFFLINE)
  currentLocation    Json?        // { lat, lng, timestamp }
  isAvailable        Boolean      @default(false)
  rating             Float        @default(5.0)
  totalTrips         Int          @default(0)
  documentsVerified  Boolean      @default(false)
  backgroundCheckPassed Boolean   @default(false)
  stripeConnectId    String?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  // Relations
  user               User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  vehicle            Vehicle?     @relation(fields: [vehicleId], references: [id])
  trips              Trip[]

  @@index([status])
  @@index([isAvailable])
}

// ============================================================
// VEHICLES
// ============================================================

model Vehicle {
  id                String      @id @default(cuid())
  type              VehicleType
  make              String
  model             String
  year              Int
  licensePlate      String      @unique
  vin               String?     @unique
  color             String?
  wheelchairCapacity Int        @default(1)
  hasRamp           Boolean     @default(false)
  hasLift           Boolean     @default(true)
  hasOxygenSupport  Boolean     @default(false)
  isActive          Boolean     @default(true)
  lastInspection    DateTime?
  insuranceExpiry   DateTime?
  registrationExpiry DateTime?
  currentMileage    Int         @default(0)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  // Relations
  drivers           Driver[]
  trips             Trip[]

  @@index([type])
  @@index([isActive])
}

// ============================================================
// FACILITIES
// ============================================================

model Facility {
  id                String   @id @default(cuid())
  name              String
  type              String   // hospital, nursing_home, dialysis_center, etc.
  address           Json     // { street, city, state, zip, lat, lng }
  phone             String?
  email             String?
  billingEmail      String?
  contractRate      Float?   // Discount percentage
  paymentTerms      Int      @default(30) // Days
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  staff             FacilityStaff[]
  patients          Patient[]
  trips             Trip[]
  invoices          Invoice[]

  @@index([type])
}

model FacilityStaff {
  id                String   @id @default(cuid())
  userId            String   @unique
  facilityId        String
  department        String?
  canBookRides      Boolean  @default(true)
  canViewAllRides   Boolean  @default(false)
  canManagePatients Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  facility          Facility @relation(fields: [facilityId], references: [id])

  @@index([facilityId])
}

// ============================================================
// TRIPS
// ============================================================

model Trip {
  id                 String        @id @default(cuid())
  tripNumber         String        @unique // TR-YYYYMMDD-XXXX
  type               TripType      @default(ONE_WAY)
  status             TripStatus    @default(PENDING)
  
  // Patient & Booking
  patientId          String
  bookedById         String        // User who booked
  facilityId         String?
  
  // Schedule
  scheduledPickupAt  DateTime
  scheduledDropoffAt DateTime?
  appointmentTime    DateTime?
  
  // Addresses
  pickupAddress      Json          // { street, city, state, zip, lat, lng, notes }
  dropoffAddress     Json
  
  // Assignment
  driverId           String?
  vehicleId          String?
  assignedAt         DateTime?
  
  // Execution
  driverEnRouteAt    DateTime?
  driverArrivedAt    DateTime?
  pickedUpAt         DateTime?
  droppedOffAt       DateTime?
  completedAt        DateTime?
  
  // Pricing
  estimatedDistance  Float?        // miles
  estimatedDuration  Int?          // minutes
  baseFare           Float         @default(0)
  distanceCharge     Float         @default(0)
  timeCharge         Float         @default(0)
  surcharges         Json?         // [{ type, amount, description }]
  totalFare          Float         @default(0)
  
  // Payment
  paymentStatus      PaymentStatus @default(PENDING)
  paymentMethod      PaymentMethod?
  stripePaymentId    String?
  paidAmount         Float         @default(0)
  
  // Metadata
  specialInstructions String?      @db.Text
  internalNotes      String?       @db.Text
  cancelReason       String?
  cancelledAt        DateTime?
  cancelledById      String?
  
  // Will-call & Round trip
  isWillCall         Boolean       @default(false)
  willCallActivatedAt DateTime?
  linkedTripId       String?       // For round trips
  
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  // Relations
  patient            Patient       @relation(fields: [patientId], references: [id])
  driver             Driver?       @relation(fields: [driverId], references: [id])
  vehicle            Vehicle?      @relation(fields: [vehicleId], references: [id])
  facility           Facility?     @relation(fields: [facilityId], references: [id])
  linkedTrip         Trip?         @relation("LinkedTrips", fields: [linkedTripId], references: [id])
  linkedFrom         Trip[]        @relation("LinkedTrips")
  stops              TripStop[]
  payments           Payment[]

  @@index([status])
  @@index([patientId])
  @@index([driverId])
  @@index([facilityId])
  @@index([scheduledPickupAt])
  @@index([tripNumber])
}

model TripStop {
  id                String   @id @default(cuid())
  tripId            String
  sequence          Int      // Order of stop
  address           Json
  type              String   // pickup, dropoff, stop
  scheduledAt       DateTime?
  arrivedAt         DateTime?
  departedAt        DateTime?
  waitTimeMinutes   Int      @default(0)
  notes             String?

  // Relations
  trip              Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)

  @@index([tripId])
  @@unique([tripId, sequence])
}

// ============================================================
// PAYMENTS & INVOICES
// ============================================================

model Payment {
  id                String        @id @default(cuid())
  tripId            String
  amount            Float
  method            PaymentMethod
  status            PaymentStatus @default(PENDING)
  stripePaymentId   String?
  stripeRefundId    String?
  processedAt       DateTime?
  failureReason     String?
  metadata          Json?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Relations
  trip              Trip          @relation(fields: [tripId], references: [id])

  @@index([tripId])
  @@index([status])
}

model Invoice {
  id                String        @id @default(cuid())
  invoiceNumber     String        @unique // INV-YYYYMM-XXXX
  facilityId        String
  periodStart       DateTime
  periodEnd         DateTime
  subtotal          Float
  discount          Float         @default(0)
  tax               Float         @default(0)
  total             Float
  status            String        @default("DRAFT") // DRAFT, SENT, PAID, OVERDUE
  dueDate           DateTime
  paidAt            DateTime?
  sentAt            DateTime?
  pdfUrl            String?
  quickbooksId      String?
  notes             String?       @db.Text
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Relations
  facility          Facility      @relation(fields: [facilityId], references: [id])
  lineItems         InvoiceLineItem[]

  @@index([facilityId])
  @@index([status])
}

model InvoiceLineItem {
  id                String   @id @default(cuid())
  invoiceId         String
  description       String
  quantity          Int      @default(1)
  unitPrice         Float
  amount            Float
  tripId            String?  // Reference to trip if applicable

  // Relations
  invoice           Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
}

// ============================================================
// PRICING CONFIGURATION
// ============================================================

model PricingConfig {
  id                String   @id @default(cuid())
  name              String   // e.g., "Houston Metro", "Default"
  isDefault         Boolean  @default(false)
  isActive          Boolean  @default(true)
  
  // Base rates
  baseFare          Float    @default(25.00)
  perMileRate       Float    @default(2.50)
  perMinuteRate     Float    @default(0.50)
  minimumFare       Float    @default(35.00)
  
  // Surcharges
  wheelchairFee     Float    @default(15.00)
  stretcherFee      Float    @default(50.00)
  oxygenFee         Float    @default(10.00)
  waitTimePerMin    Float    @default(0.75)
  afterHoursPercent Float    @default(25.00)
  weekendPercent    Float    @default(15.00)
  holidayPercent    Float    @default(50.00)
  
  // Additional stops
  additionalStopFee Float    @default(10.00)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([isDefault])
  @@index([isActive])
}
EOF

echo "✅ Created prisma/schema.prisma"

# ============================================================
# Step 8: Create environment file template
# ============================================================
if [ ! -f ".env.example" ]; then
    cat > .env.example << 'EOF'
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand-base64-32"

# Anthropic (for autonomous development)
ANTHROPIC_API_KEY="sk-ant-..."

# Stripe (add later)
# STRIPE_SECRET_KEY="sk_test_..."
# STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."

# Twilio (add later)
# TWILIO_ACCOUNT_SID="AC..."
# TWILIO_AUTH_TOKEN="..."
# TWILIO_PHONE_NUMBER="+1..."

# Google Maps (add later)
# GOOGLE_MAPS_API_KEY="..."
EOF
    echo "✅ Created .env.example"
fi

# ============================================================
# Step 9: Create folder structure
# ============================================================
echo ""
echo "📁 Creating folder structure..."

# App directories
mkdir -p app/\(auth\)/login
mkdir -p app/\(auth\)/register
mkdir -p app/\(auth\)/forgot-password
mkdir -p app/\(dashboard\)/dispatcher
mkdir -p app/\(dashboard\)/driver
mkdir -p app/\(dashboard\)/admin
mkdir -p app/\(dashboard\)/operations
mkdir -p app/\(dashboard\)/facility
mkdir -p app/\(dashboard\)/patient
mkdir -p app/\(dashboard\)/family
mkdir -p app/api/auth/\[...nextauth\]
mkdir -p app/api/v1/trips
mkdir -p app/api/v1/patients
mkdir -p app/api/v1/drivers

# Component directories
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/domain

# Lib directories
mkdir -p lib/db
mkdir -p lib/services
mkdir -p lib/api
mkdir -p lib/hooks
mkdir -p lib/utils

# Other directories
mkdir -p stores
mkdir -p types
mkdir -p styles
mkdir -p public

echo "✅ Created folder structure"

# ============================================================
# Step 10: Create essential files
# ============================================================

# Global CSS
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles from BRAND_GUIDELINES.md */
@layer base {
  :root {
    --background: 249 250 251;
    --foreground: 31 41 55;
  }
  
  body {
    @apply bg-gray-50 text-gray-800 antialiased;
  }
}

@layer utilities {
  .shadow-card {
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }
  
  .shadow-card-hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
}
EOF

# Root layout
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wheelchair Transportation Platform',
  description: 'Professional wheelchair transportation services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# Home page
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Wheelchair Transportation Platform
        </h1>
        <p className="text-gray-500 mb-8">
          Professional wheelchair transportation services
        </p>
        <div className="space-x-4">
          <a 
            href="/login" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Sign In
          </a>
          <a 
            href="/register" 
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  )
}
EOF

# Utility functions
cat > lib/utils/index.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Prisma client
cat > lib/db/index.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
EOF

# ESLint config
cat > .eslintrc.json << 'EOF'
{
  "extends": "next/core-web-vitals"
}
EOF

# Gitignore
cat > .gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
/prisma/migrations

# IDE
.idea
.vscode
EOF

echo "✅ Created essential files"

# ============================================================
# Step 11: Create placeholder pages
# ============================================================

# Login page placeholder
cat > app/\(auth\)/login/page.tsx << 'EOF'
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-card w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign In
        </h1>
        <p className="text-gray-500 text-center">
          Login page - To be built by AI
        </p>
      </div>
    </div>
  )
}
EOF

# Dashboard placeholder
cat > app/\(dashboard\)/dispatcher/page.tsx << 'EOF'
export default function DispatcherDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Dispatcher Dashboard
      </h1>
      <p className="text-gray-500">
        Dashboard - To be built by AI
      </p>
    </div>
  )
}
EOF

echo "✅ Created placeholder pages"

# ============================================================
# Done!
# ============================================================
echo ""
echo "============================================================"
echo "✅ Project initialized successfully!"
echo "============================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Create .env file with your database URLs:"
echo "   cp .env.example .env"
echo "   # Edit .env with your Supabase credentials"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Generate Prisma client and push schema:"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo ""
echo "4. Start development server:"
echo "   npm run dev"
echo ""
echo "5. (Optional) Start autonomous development:"
echo "   npm run parse-tasks"
echo "   npm run orchestrate:continuous"
echo ""
echo "============================================================"
