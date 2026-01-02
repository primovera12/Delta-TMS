# Master Development Guide - Wheelchair Transportation Platform

> **Your Complete Roadmap for Claude Code Development**
> **Last Updated:** January 2026
> **Package Version:** 3.0 (Complete)

---

## Document Inventory (18 Documents)

You now have a COMPLETE specification package:

### Core Development Documents

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `DEVELOPMENT_ROADMAP.md` | 100-day build plan | Daily — know what to build |
| `ROADMAP_ADDENDUM.md` | Additional features (multi-stop, will-call) | Days 91-100 |
| `DATABASE_SCHEMA.prisma` | Complete Prisma schema (65+ models) | Database setup, migrations |
| `API_SPEC.md` | All 170+ endpoints | When building API routes |

### UI/UX Documents

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `SCREEN_CATALOG.md` | All 186 screens defined | Reference for scope |
| `DESIGN_SYSTEM.md` | 56 core components | When building components |
| `DESIGN_SYSTEM_ADDENDUM.md` | 129 additional components | Extended components |
| `BRAND_GUIDELINES.md` | Stripe-style visual specs | Every UI element |
| `ACCESSIBILITY_SPEC.md` | Elder Mode + WCAG | Every component/screen |

### Business Logic Documents

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `PRICING_ENGINE.md` | Complete pricing formulas | Quote/fare calculations |
| `WORKFLOWS.md` | Step-by-step feature flows | Understanding user journeys |

### Technical Architecture

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `TECH_STACK.md` | All technology decisions | Project setup, dependencies |
| `SYSTEM_ARCHITECTURE.md` | System diagrams & flows | Understanding architecture |
| `SPECIFICATIONS_COMPLETE.md` | All feature specifications | Detailed implementation |

### Audit & Reference

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `FEATURE_AUDIT.md` | Feature verification (199 features) | Checking completeness |
| `UI_AUDIT.md` | Screen/component audit | Ensuring coverage |
| `README.md` | Download guide | Initial setup |
| `MASTER_GUIDE.md` | This document | Daily reference |

---

## Quick Stats

| Metric | Count |
|--------|-------|
| Screens (Pages) | 155 |
| Screens (Modals) | 31 |
| **Total Screens** | **186** |
| UI Components | 185 |
| Database Models | 65+ |
| API Endpoints | 170+ |
| Features Specified | 199 |
| Documents | 18 |
| Development Days | 100 |

---

## Document Reading Order

When starting the project, read documents in this order:

### First: Understand the Architecture (Day 0)
```
1. MASTER_GUIDE.md      ← You are here
2. TECH_STACK.md        ← All technology choices
3. SYSTEM_ARCHITECTURE.md ← How everything connects
4. WORKFLOWS.md         ← User flows for major features
```

### Second: Understand What to Build
```
5. DEVELOPMENT_ROADMAP.md ← Day-by-day plan
6. SCREEN_CATALOG.md     ← All screens listed
7. FEATURE_AUDIT.md      ← All features verified
```

### Third: Understand How to Build It
```
8. DATABASE_SCHEMA.prisma ← Database design
9. API_SPEC.md           ← All API endpoints
10. SPECIFICATIONS_COMPLETE.md ← Detailed specs
```

### Fourth: Understand How It Looks
```
11. BRAND_GUIDELINES.md   ← Visual design system
12. DESIGN_SYSTEM.md      ← Core components
13. DESIGN_SYSTEM_ADDENDUM.md ← All other components
14. ACCESSIBILITY_SPEC.md ← Accessibility requirements
```

---

## The Plan: How to Work with Claude Code

### Step 1: Setup (Day 1)

1. **Create a fresh GitHub repo** for this project
2. **Connect Claude Code** to the repo
3. **Upload all spec documents** to the repo root in a `/docs` folder:
   ```
   /docs
     MASTER_GUIDE.md
     DEVELOPMENT_ROADMAP.md
     ROADMAP_ADDENDUM.md
     SCREEN_CATALOG.md
     DESIGN_SYSTEM.md
     DESIGN_SYSTEM_ADDENDUM.md
     BRAND_GUIDELINES.md
     ACCESSIBILITY_SPEC.md
     PRICING_ENGINE.md
     DATABASE_SCHEMA.prisma
     API_SPEC.md
     TECH_STACK.md
     SYSTEM_ARCHITECTURE.md
     WORKFLOWS.md
     SPECIFICATIONS_COMPLETE.md
     FEATURE_AUDIT.md
     UI_AUDIT.md
   ```

4. **Tell Claude Code about the docs:**
   ```
   Read all the documents in /docs folder. These are the specifications
   for the wheelchair transportation platform we're building.
   
   Priority docs to understand first:
   - MASTER_GUIDE.md = This guide - how to use everything
   - TECH_STACK.md = Technology decisions and versions
   - SYSTEM_ARCHITECTURE.md = How components connect
   - DEVELOPMENT_ROADMAP.md = Day-by-day build plan
   
   When building features:
   - WORKFLOWS.md = Step-by-step user flows
   - SPECIFICATIONS_COMPLETE.md = Detailed feature specs
   - API_SPEC.md = All API endpoints
   
   When building UI:
   - BRAND_GUIDELINES.md = Stripe-style visual design
   - DESIGN_SYSTEM.md + ADDENDUM = All components
   - ACCESSIBILITY_SPEC.md = Accessibility requirements
   
   Always follow these specs when building any component or screen.
   ```

---

### Step 2: Daily Workflow

Each day, follow this pattern:

```
1. Open DEVELOPMENT_ROADMAP.md
2. Find today's tasks (e.g., "Day 5")
3. Copy the Claude Code prompt for that day
4. Paste into Claude Code
5. Review the output
6. Test it works
7. Commit to git
8. Move to next task
```

**Example - Day 8:**
```
Today is Day 8 of our wheelchair transportation project.

According to DEVELOPMENT_ROADMAP.md, today's task is:
"Core UI Components Part 1"

Please:
1. Read the BRAND_GUIDELINES.md for exact styling specs
2. Read the DESIGN_SYSTEM.md for component list
3. Build the Button, Card, Badge, and Avatar components
4. Follow the Stripe-style aesthetics from BRAND_GUIDELINES.md
5. Include all accessibility requirements from ACCESSIBILITY_SPEC.md
```

---

### Step 3: When Building Any Feature

Reference the appropriate workflow:

```
I'm building [FEATURE NAME].

Please:
1. Read WORKFLOWS.md section [X] for the user flow
2. Read SPECIFICATIONS_COMPLETE.md for detailed specs
3. Reference API_SPEC.md for endpoints needed
4. Reference DATABASE_SCHEMA.prisma for data models
5. Follow BRAND_GUIDELINES.md for visual styling
6. Follow ACCESSIBILITY_SPEC.md for accessibility

Build this feature: [description]
```

---

### Step 4: When Building Any Screen

Always give Claude Code this context:

```
I'm building [SCREEN NAME] from SCREEN_CATALOG.md.

Please:
1. Follow BRAND_GUIDELINES.md for visual styling (Stripe-style)
2. Follow ACCESSIBILITY_SPEC.md for accessibility
3. Reference DESIGN_SYSTEM.md for which components to use
4. Match the functionality described in DEVELOPMENT_ROADMAP.md

Build this screen: [description]
```

---

### Step 5: Quality Checkpoints

After each major feature (weekly), verify:

- [ ] **Visual:** Does it look like Stripe? (Clean, spacious, professional)
- [ ] **Accessible:** Can you tab through everything? Are colors high contrast?
- [ ] **Functional:** Does the feature actually work?
- [ ] **Responsive:** Does it work on mobile?
- [ ] **Consistent:** Do all components match the design system?

---

## Key Document Cross-References

### When Building Bookings
| Need | Document | Section |
|------|----------|---------|
| Booking flow | WORKFLOWS.md | 1. Booking Workflows |
| Booking API | API_SPEC.md | 4. Trips |
| Trip models | DATABASE_SCHEMA.prisma | Trip, TripStop |
| Booking screens | SCREEN_CATALOG.md | Dispatcher Portal |
| Pricing logic | PRICING_ENGINE.md | All |

### When Building Payments
| Need | Document | Section |
|------|----------|---------|
| Payment flow | WORKFLOWS.md | 4. Payment Workflows |
| Stripe setup | TECH_STACK.md | 7.1 Payment Processing |
| Payment API | API_SPEC.md | 7. Payments |
| Payment specs | SPECIFICATIONS_COMPLETE.md | 4. Payments & Billing |

### When Building Driver Features
| Need | Document | Section |
|------|----------|---------|
| Driver flows | WORKFLOWS.md | 3. Driver Workflows |
| Driver API | API_SPEC.md | 5. Drivers |
| Driver screens | SCREEN_CATALOG.md | Driver Portal |
| Location tracking | SPECIFICATIONS_COMPLETE.md | 2. Real-Time Features |

### When Building Real-Time Features
| Need | Document | Section |
|------|----------|---------|
| WebSocket spec | SPECIFICATIONS_COMPLETE.md | 2.1 WebSocket Implementation |
| Geofencing | SPECIFICATIONS_COMPLETE.md | 2.2 Geofencing Alerts |
| Architecture | SYSTEM_ARCHITECTURE.md | 6. Real-Time Architecture |
| Tech choices | TECH_STACK.md | 6. Real-Time |

---

## File Structure for the Project

```
wheelchair-transport/
├── docs/                          # Your spec documents (18 files)
│
├── app/                           # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── dispatcher/
│   │   ├── driver/
│   │   ├── admin/
│   │   ├── super-admin/
│   │   ├── operations/
│   │   ├── facility/
│   │   ├── patient/
│   │   └── family/
│   ├── api/v1/
│   │   ├── auth/
│   │   ├── trips/
│   │   ├── drivers/
│   │   ├── patients/
│   │   ├── facilities/
│   │   ├── payments/
│   │   ├── invoices/
│   │   ├── admin/
│   │   └── webhooks/
│   └── layout.tsx
│
├── components/
│   ├── ui/                        # Shadcn + custom base components
│   ├── layout/                    # Layout components
│   └── domain/                    # Business-specific components
│
├── lib/
│   ├── db/                        # Database utilities
│   ├── services/                  # Business logic
│   ├── api/                       # API client functions
│   ├── hooks/                     # Custom React hooks
│   └── utils/                     # Helpers
│
├── stores/                        # Zustand stores
├── types/                         # TypeScript types
├── prisma/
│   └── schema.prisma
├── styles/
│   └── globals.css
├── tailwind.config.ts
└── package.json
```

---

## Milestones & Checkpoints

### Week 2 Checkpoint (Day 10)
- [ ] Login/register working
- [ ] Basic layout with Stripe styling
- [ ] Can navigate between pages
- [ ] Looks professional and clean

### Week 4 Checkpoint (Day 20)
- [ ] Can create a ride with pricing calculation
- [ ] Can assign a driver
- [ ] Payment collection works
- [ ] SMS sends (test mode)

### Week 6 Checkpoint (Day 30)
- [ ] Dispatcher can do their full job
- [ ] All dispatcher screens complete
- [ ] Ready for internal testing

### Week 8 Checkpoint (Day 40)
- [ ] Drivers can use their portal
- [ ] Real-time tracking works
- [ ] Pre-trip inspections work

### Week 12 Checkpoint (Day 60)
- [ ] Invoicing works
- [ ] Facilities can be billed
- [ ] QuickBooks integration

### Week 16 Checkpoint (Day 80)
- [ ] All portals complete
- [ ] Standing orders work
- [ ] Reports working

### Week 20 Checkpoint (Day 100)
- [ ] Patient self-booking works
- [ ] Family portal complete
- [ ] Ready for production launch

---

## Common Issues & Solutions

### "It doesn't look like Stripe"

```
The current implementation doesn't match our Stripe-inspired design.

Please review BRAND_GUIDELINES.md and specifically fix:
1. Background should be #f9fafb (gray-50), not white
2. Cards should have shadow-card, not hard borders
3. Text should be gray-800 for headings, gray-500 for secondary
4. Buttons should be 6px radius with subtle shadow
5. Add more whitespace - use p-6 for card padding
```

### "It's not accessible"

```
This doesn't meet our accessibility requirements.

Please review ACCESSIBILITY_SPEC.md and fix:
1. Add aria-labels to icon-only buttons
2. Ensure 44px minimum touch targets
3. Add visible focus rings
4. Associate labels with form inputs
5. Add skip link to main content
```

### "I don't understand how this feature works"

```
Please read these documents to understand [FEATURE]:
1. WORKFLOWS.md - Find the workflow for [feature]
2. SPECIFICATIONS_COMPLETE.md - Find detailed specs
3. SYSTEM_ARCHITECTURE.md - See how it fits in the system

Then implement according to those specs.
```

### "The component is missing"

```
I need [ComponentName] but it's not in our components yet.

Please create it following:
- DESIGN_SYSTEM.md or DESIGN_SYSTEM_ADDENDUM.md for the component spec
- BRAND_GUIDELINES.md for styling
- ACCESSIBILITY_SPEC.md for accessibility

[describe what the component should do]
```

---

## Your Next Steps

1. **Download the complete spec package** (wheelchair-transport-specs-FINAL.zip)
2. **Set up your GitHub repo**
3. **Upload all docs to /docs folder**
4. **Install dependencies** per TECH_STACK.md
5. **Set up database** using DATABASE_SCHEMA.prisma
6. **Start Day 1** of the DEVELOPMENT_ROADMAP.md

---

## Quick Reference

| Task | Document |
|------|----------|
| What to build today | DEVELOPMENT_ROADMAP.md |
| Understand feature flow | WORKFLOWS.md |
| Find API endpoint | API_SPEC.md |
| Find database model | DATABASE_SCHEMA.prisma |
| What screens exist | SCREEN_CATALOG.md |
| What components to use | DESIGN_SYSTEM.md |
| How to style it | BRAND_GUIDELINES.md |
| How to make it accessible | ACCESSIBILITY_SPEC.md |
| How pricing works | PRICING_ENGINE.md |
| Detailed feature specs | SPECIFICATIONS_COMPLETE.md |
| Tech decisions | TECH_STACK.md |
| System diagrams | SYSTEM_ARCHITECTURE.md |

---

*This is your master guide. Keep it handy throughout development.*
