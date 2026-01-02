# Claude Code Web - Master Prompt

Copy and paste this prompt into Claude Code Web at [claude.ai/code](https://claude.ai/code) after connecting your GitHub repository.

---

## 🚀 THE PROMPT

```
I have a complete specification package for a wheelchair transportation platform in the /docs folder.

READ THESE DOCUMENTS FIRST to understand the project:
1. /docs/MASTER_GUIDE.md - Overview of all documents and how to use them
2. /docs/TECH_STACK.md - All technology choices and versions
3. /docs/SYSTEM_ARCHITECTURE.md - System diagrams and how components connect
4. /docs/WORKFLOWS.md - Step-by-step flows for all major features
5. /docs/DEVELOPMENT_ROADMAP.md - 100-day build plan with daily tasks

YOUR MISSION: Build this entire application autonomously, following the specifications exactly.

═══════════════════════════════════════════════════════════════════
PHASE 1: PROJECT INITIALIZATION (Do this first)
═══════════════════════════════════════════════════════════════════

1. Initialize Next.js 15 project:
   - TypeScript enabled
   - App Router (not Pages)
   - Tailwind CSS
   - src/ directory: NO (use root app/ directory)

2. Install all dependencies from /docs/TECH_STACK.md section 12

3. Set up Prisma:
   - Copy /docs/DATABASE_SCHEMA.prisma to /prisma/schema.prisma
   - Run: npx prisma generate
   - Run: npx prisma db push

4. Configure Tailwind with brand colors from /docs/BRAND_GUIDELINES.md:
   - Primary blue: #2563eb
   - Gray scale: as specified
   - Custom shadows: shadow-card, shadow-card-hover

5. Create folder structure per /docs/MASTER_GUIDE.md:
   /app/(auth)/ - Login, register, forgot-password
   /app/(dashboard)/ - All portal pages
   /app/api/v1/ - API routes
   /components/ui/ - Base components
   /components/domain/ - Business components
   /lib/ - Utilities and services

═══════════════════════════════════════════════════════════════════
PHASE 2: BUILD THE APPLICATION
═══════════════════════════════════════════════════════════════════

Follow /docs/DEVELOPMENT_ROADMAP.md day by day:

DAYS 1-10: Foundation
- Project setup, configuration
- Core UI components (Button, Input, Card, etc.)
- Layout components (Sidebar, Topbar)

DAYS 11-15: Authentication
- Login page with email/password
- Registration flow (4 steps)
- Forgot password flow
- Auth API routes
- Dashboard layout

DAYS 16-30: Dispatcher Portal
- Dashboard with KPIs
- Trip booking form (multi-step)
- Trip list and details
- Driver assignment
- Patient management
- Live map view

DAYS 31-45: Driver Portal
- Driver dashboard
- Trip queue and details
- Navigation integration
- Status updates
- Pre-trip inspections

DAYS 46-60: Admin Portal
- User management
- Pricing configuration
- Vehicle fleet management
- Reports and analytics
- System settings

DAYS 61-75: Facility Portal
- Facility dashboard
- Patient management
- Trip booking for patients
- Invoice viewing
- Standing orders

DAYS 76-85: Patient & Family Portals
- Patient self-booking
- Trip history
- Family member access
- Loyalty program

DAYS 86-100: Advanced Features & Polish
- Multi-stop trips
- Will-call returns
- Real-time tracking
- Push notifications
- Final testing

═══════════════════════════════════════════════════════════════════
FOR EVERY FEATURE YOU BUILD:
═══════════════════════════════════════════════════════════════════

1. Read the workflow in /docs/WORKFLOWS.md
2. Check API endpoints in /docs/API_SPEC.md
3. Follow UI design in /docs/BRAND_GUIDELINES.md
4. Use components from /docs/DESIGN_SYSTEM.md
5. Include accessibility per /docs/ACCESSIBILITY_SPEC.md
6. Reference detailed specs in /docs/SPECIFICATIONS_COMPLETE.md

═══════════════════════════════════════════════════════════════════
COMMIT STRATEGY:
═══════════════════════════════════════════════════════════════════

- Commit after each day's tasks are complete
- Use format: "Day X: [Brief description]"
- Create a PR at the end of each phase (every ~15 days)

═══════════════════════════════════════════════════════════════════
IMPORTANT NOTES:
═══════════════════════════════════════════════════════════════════

- The DATABASE_URL and DIRECT_URL environment variables are configured
- Follow the Stripe-inspired design aesthetic (clean, spacious, professional)
- All components must be accessible (WCAG 2.1 AA)
- Support Elder Mode (larger text, higher contrast)
- Use Prisma for all database operations
- Use React Query for data fetching
- Use Zustand for client state

DO NOT STOP until all 100 days of the roadmap are complete.
Start with Phase 1 now.
```

---

## 📝 Notes

- Make sure your environment variables are set before starting
- Claude Code Web will create commits and PRs automatically
- You can monitor progress in real-time
- If it stops, you can continue by saying "Continue from where you left off"

---

## 🔑 Required Environment Variables

Set these in Claude Code Web's environment configuration:

```
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Replace:
- `[PROJECT-REF]` with your Supabase project reference
- `[PASSWORD]` with your database password
- `[REGION]` with your Supabase region (e.g., us-east-1)
