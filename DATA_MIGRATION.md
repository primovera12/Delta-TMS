# Data Migration Plan - Delta TMS

> **Document Version:** 1.0
> **Last Updated:** January 2, 2026
> **Status:** Ready for Review

## Overview

This document outlines the plan for migrating from mock/development data to production data in Delta TMS.

## Migration Phases

### Phase 1: Database Setup (Day 1)

#### 1.1 Production Database Provisioning
- [ ] Create production PostgreSQL database (Neon/Supabase)
- [ ] Configure connection pooling for serverless
- [ ] Set up automated backups
- [ ] Enable SSL/TLS encryption

#### 1.2 Schema Migration
```bash
# Generate Prisma client
npm run db:generate

# Apply schema to production database
npx prisma db push --accept-data-loss

# Alternatively, use migrations for controlled deployment
npx prisma migrate deploy
```

#### 1.3 Verify Schema
```bash
# Open Prisma Studio to verify schema
npx prisma studio
```

### Phase 2: Remove Mock Data (Day 2)

#### 2.1 API Routes with Mock Data

The following files contain mock data that needs to be replaced with Prisma queries:

| File | Description | Priority |
|------|-------------|----------|
| `app/api/v1/drivers/route.ts` | Driver list and management | High |
| `app/api/v1/patients/route.ts` | Patient data | High |
| `app/api/v1/trips/route.ts` | Trip management | High |
| `app/api/v1/trips/[id]/route.ts` | Individual trip operations | High |
| `app/api/v1/facilities/route.ts` | Facility management | Medium |
| `app/api/v1/invoices/route.ts` | Invoice handling | Medium |
| `app/api/v1/payments/route.ts` | Payment records | Medium |
| `app/api/v1/vehicles/route.ts` | Vehicle fleet | Medium |
| `app/api/v1/notifications/route.ts` | Notifications | Low |
| `app/api/v1/reports/route.ts` | Reporting | Low |

#### 2.2 Migration Pattern

For each API route, replace mock data:

**Before (Mock Data):**
```typescript
const drivers = [
  { id: 'DRV-001', name: 'John Smith', ... },
  ...
];

export async function GET() {
  return NextResponse.json({ data: drivers });
}
```

**After (Prisma):**
```typescript
import { prisma } from '@/lib/db';

export async function GET() {
  const drivers = await prisma.driver.findMany({
    include: { user: true, vehicle: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ data: drivers });
}
```

### Phase 3: Initial Data Seeding (Day 3)

#### 3.1 Required Seed Data

Create `prisma/seed.ts` for essential data:

```typescript
// prisma/seed.ts
import { prisma } from '../lib/db';
import { hash } from 'bcryptjs';

async function main() {
  // 1. Create Admin User
  const hashedPassword = await hash('secure-admin-password', 12);

  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  // 2. Create Default Service Types
  await prisma.serviceType.createMany({
    data: [
      { name: 'Ambulatory', code: 'AMB', baseRate: 35.00 },
      { name: 'Wheelchair', code: 'WC', baseRate: 50.00 },
      { name: 'Stretcher', code: 'STR', baseRate: 150.00 },
      { name: 'Bariatric', code: 'BAR', baseRate: 175.00 },
    ],
    skipDuplicates: true,
  });

  // 3. Create Default Notification Templates
  await prisma.notificationTemplate.createMany({
    data: [
      {
        name: 'trip_reminder',
        type: 'SMS',
        subject: 'Trip Reminder',
        body: 'Reminder: Your trip is scheduled for {{date}} at {{time}}.',
      },
      {
        name: 'trip_confirmed',
        type: 'SMS',
        subject: 'Trip Confirmed',
        body: 'Your trip has been confirmed. Driver: {{driver}}. Vehicle: {{vehicle}}.',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### 3.2 Run Seed
```bash
npm run db:seed
```

### Phase 4: Historical Data Import (Day 4-5)

If migrating from an existing system:

#### 4.1 Data Export from Legacy System
- Export patients to CSV/JSON
- Export facilities and contracts
- Export historical trips
- Export driver records

#### 4.2 Import Scripts

Create import scripts in `scripts/` directory:

```typescript
// scripts/import-patients.ts
import { prisma } from '../lib/db';
import fs from 'fs';

async function importPatients() {
  const data = JSON.parse(fs.readFileSync('data/patients.json', 'utf-8'));

  for (const patient of data) {
    await prisma.user.create({
      data: {
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone,
        role: 'PATIENT',
        status: 'ACTIVE',
        medicalProfile: {
          create: {
            mobilityAids: patient.mobilityAids,
            oxygenRequired: patient.oxygenRequired,
            // ... other fields
          },
        },
      },
    });
  }

  console.log(`Imported ${data.length} patients`);
}

importPatients();
```

### Phase 5: Data Verification (Day 6)

#### 5.1 Verification Checklist

- [ ] All users can log in successfully
- [ ] Patient records are complete and accurate
- [ ] Driver records have correct certifications
- [ ] Facility contracts are properly linked
- [ ] Historical trips are correctly imported
- [ ] Invoice data matches source records

#### 5.2 Verification Queries

```sql
-- Count records by table
SELECT 'users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'trips', COUNT(*) FROM "Trip"
UNION ALL
SELECT 'drivers', COUNT(*) FROM "Driver"
UNION ALL
SELECT 'facilities', COUNT(*) FROM "Facility";

-- Verify relationships
SELECT COUNT(*) FROM "Trip" WHERE "patientId" IS NULL;
SELECT COUNT(*) FROM "Trip" WHERE "driverId" IS NULL AND status != 'SCHEDULED';
```

### Phase 6: Cutover (Day 7)

#### 6.1 Pre-Cutover Checklist
- [ ] All data verified and validated
- [ ] Backup of legacy system completed
- [ ] All team members notified of cutover
- [ ] Support team briefed on new system

#### 6.2 Cutover Steps
1. Set legacy system to read-only mode
2. Final data sync (if any changes since last import)
3. Update DNS/routing to new system
4. Verify production system is operational
5. Test critical workflows

#### 6.3 Go-Live Verification
- [ ] User login works
- [ ] Trip booking works
- [ ] Driver app receives trips
- [ ] Payment processing works
- [ ] Email/SMS notifications work

## Rollback Plan

### Triggers for Rollback
- Data corruption detected
- Critical functionality not working
- Performance issues affecting operations

### Rollback Procedure
1. Announce rollback to team
2. Redirect traffic to legacy system
3. Document issues encountered
4. Plan remediation

### Data Recovery
```bash
# Restore from backup
pg_restore -d delta_tms backup.dump

# Or use point-in-time recovery if available
```

## Timeline Summary

| Day | Phase | Activities |
|-----|-------|------------|
| 1 | Setup | Database provisioning, schema migration |
| 2 | Code | Replace mock data with Prisma queries |
| 3 | Seed | Initial data seeding |
| 4-5 | Import | Historical data import |
| 6 | Verify | Data verification and testing |
| 7 | Cutover | Go-live |

## Responsible Parties

| Role | Responsibilities |
|------|-----------------|
| Database Admin | Database setup, backups, optimization |
| Backend Developer | API updates, import scripts |
| QA Lead | Data verification, testing |
| Project Manager | Coordination, communication |
| Support Lead | User training, issue handling |

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Data loss | Multiple backups, test restores |
| Downtime | Off-hours migration, quick rollback |
| Data mismatch | Thorough verification, checksums |
| Performance issues | Load testing before cutover |

## Post-Migration

### Week 1 After Go-Live
- Monitor system performance
- Address user-reported issues
- Verify scheduled jobs (cron) are running
- Check payment reconciliation

### Week 2-4
- Gather user feedback
- Optimize slow queries
- Archive legacy system
- Update documentation
