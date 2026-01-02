# Wheelchair Transportation Platform - Specification Package

> **Version:** 3.0 (Complete)
> **Last Updated:** January 2026
> **Total Documents:** 18
> **Total Size:** ~630 KB

---

## 📦 Package Contents (18 Documents)

Download ALL files below and upload to your GitHub repo's `/docs` folder.

| # | File | Purpose | Size |
|---|------|---------|------|
| 1 | `MASTER_GUIDE.md` | 🎯 **START HERE** - How to use these docs | 14 KB |
| 2 | `DEVELOPMENT_ROADMAP.md` | Day-by-day development plan (100 days) | 50 KB |
| 3 | `ROADMAP_ADDENDUM.md` | Added features (multi-stop, will-call) | 17 KB |
| 4 | `SCREEN_CATALOG.md` | All 186 screens with routes | 24 KB |
| 5 | `DESIGN_SYSTEM.md` | Core UI components (56) | 33 KB |
| 6 | `DESIGN_SYSTEM_ADDENDUM.md` | Additional UI components (129) | 27 KB |
| 7 | `BRAND_GUIDELINES.md` | Stripe-inspired visual design | 22 KB |
| 8 | `ACCESSIBILITY_SPEC.md` | Elder Mode + WCAG requirements | 24 KB |
| 9 | `PRICING_ENGINE.md` | Complete pricing logic | 35 KB |
| 10 | `DATABASE_SCHEMA.prisma` | Full Prisma schema (65+ models) | 71 KB |
| 11 | `API_SPEC.md` | REST API (170+ endpoints) | 59 KB |
| 12 | `TECH_STACK.md` | **Technology decisions & versions** | 26 KB |
| 13 | `SYSTEM_ARCHITECTURE.md` | **System diagrams & data flows** | 71 KB |
| 14 | `WORKFLOWS.md` | **Step-by-step feature workflows** | 65 KB |
| 15 | `SPECIFICATIONS_COMPLETE.md` | **ALL remaining feature specs** | 64 KB |
| 16 | `FEATURE_AUDIT.md` | Feature verification (199 features) | 15 KB |
| 17 | `UI_AUDIT.md` | Screen & component audit | 13 KB |
| 18 | `README.md` | This file - download guide | 8 KB |

**Total:** ~630 KB

---

## 🚀 Quick Start

### 1. Download Package
Download the ZIP file containing all 18 documents.

### 2. Create GitHub Repo
```bash
mkdir wheelchair-transport
cd wheelchair-transport
git init
```

### 3. Add Docs to /docs Folder
```
wheelchair-transport/
├── docs/
│   ├── MASTER_GUIDE.md          ← Start here!
│   ├── TECH_STACK.md            ← Tech decisions
│   ├── SYSTEM_ARCHITECTURE.md   ← How it connects
│   ├── WORKFLOWS.md             ← Feature flows
│   ├── DEVELOPMENT_ROADMAP.md   ← Daily plan
│   └── ... (all 18 files)
```

### 4. Tell Claude Code
```
Read all the documents in /docs folder. These are the specifications
for the wheelchair transportation platform we're building.

Start with MASTER_GUIDE.md for an overview of how to use the docs,
then TECH_STACK.md for technology choices.
```

### 5. Start Building
Open `DEVELOPMENT_ROADMAP.md` and start with Day 1!

---

## 📊 What's In This Package

### Complete Coverage

| Category | Count |
|----------|-------|
| **Screens** | 186 (155 pages + 31 modals) |
| **UI Components** | 185 |
| **Database Models** | 65+ |
| **API Endpoints** | 170+ |
| **Features** | 199 |
| **Workflows** | 25+ |
| **Diagrams** | 20+ |

### Technology Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind CSS
- **Backend:** Next.js API Routes + Prisma
- **Database:** PostgreSQL + Redis
- **Auth:** NextAuth.js v5
- **Payments:** Stripe (Cards, Apple Pay, Google Pay, Connect)
- **SMS:** Twilio
- **Email:** SendGrid
- **Maps:** Google Maps Platform
- **Real-time:** Socket.io

### Features Covered

✅ Multi-role authentication (8 roles)
✅ Trip booking (one-way, round-trip, multi-stop, will-call)
✅ Real-time tracking with WebSocket
✅ Geofencing alerts
✅ Push notifications (iOS, Android, Web)
✅ Emergency alert system
✅ Driver payouts via Stripe Connect
✅ Facility invoicing + QuickBooks sync
✅ Vehicle inspections & maintenance
✅ Document expiry alerts
✅ Standing orders (recurring trips)
✅ Bulk booking for facilities
✅ Contract rates for facilities
✅ Loyalty program
✅ Accessibility (Elder Mode + WCAG 2.1 AA)

---

## 📖 Document Descriptions

### Architecture Documents

| Document | What's Inside |
|----------|---------------|
| **TECH_STACK.md** | All technology decisions, package versions, configurations |
| **SYSTEM_ARCHITECTURE.md** | ASCII diagrams showing system structure, data flows, integrations |
| **WORKFLOWS.md** | Step-by-step flows for booking, payments, driver execution, etc. |

### Development Documents

| Document | What's Inside |
|----------|---------------|
| **DEVELOPMENT_ROADMAP.md** | 100 days broken into tasks with Claude Code prompts |
| **ROADMAP_ADDENDUM.md** | Additional features for days 91-100 |
| **DATABASE_SCHEMA.prisma** | Complete Prisma schema with 65+ models |
| **API_SPEC.md** | All 170+ REST endpoints with request/response examples |

### Design Documents

| Document | What's Inside |
|----------|---------------|
| **SCREEN_CATALOG.md** | All 186 screens organized by portal |
| **DESIGN_SYSTEM.md** | 56 core UI components with specs |
| **DESIGN_SYSTEM_ADDENDUM.md** | 129 additional specialized components |
| **BRAND_GUIDELINES.md** | Stripe-inspired visual design system |
| **ACCESSIBILITY_SPEC.md** | Elder Mode settings + WCAG requirements |

### Specification Documents

| Document | What's Inside |
|----------|---------------|
| **PRICING_ENGINE.md** | Complete fare calculation logic |
| **SPECIFICATIONS_COMPLETE.md** | Detailed specs for auth, real-time, payments, fleet, etc. |

### Audit Documents

| Document | What's Inside |
|----------|---------------|
| **FEATURE_AUDIT.md** | All 199 features with document references |
| **UI_AUDIT.md** | Screen and component counts verified |
| **MASTER_GUIDE.md** | How to use all documents together |

---

## 🎯 Reading Order

### Day 0: Understand the System
```
1. MASTER_GUIDE.md      ← How to use these docs
2. TECH_STACK.md        ← Technology choices
3. SYSTEM_ARCHITECTURE.md ← System diagrams
4. WORKFLOWS.md         ← Feature flows
```

### Day 1+: Start Building
```
5. DEVELOPMENT_ROADMAP.md ← Daily tasks
6. API_SPEC.md           ← Endpoints to build
7. DATABASE_SCHEMA.prisma ← Data models
8. BRAND_GUIDELINES.md   ← Visual styling
```

---

## 💡 Tips for Success

### Tell Claude Code About the Docs
```
You have access to 18 specification documents in /docs.
When building any feature:
1. Check WORKFLOWS.md for the user flow
2. Check SPECIFICATIONS_COMPLETE.md for detailed specs
3. Check API_SPEC.md for endpoints
4. Check DATABASE_SCHEMA.prisma for models
5. Follow BRAND_GUIDELINES.md for styling
```

### When Building a Screen
```
I'm building [Screen Name] from SCREEN_CATALOG.md.
Please reference:
- BRAND_GUIDELINES.md for styling
- DESIGN_SYSTEM.md for components
- ACCESSIBILITY_SPEC.md for accessibility
```

### When Building an API
```
I'm building the [endpoint] from API_SPEC.md.
Please reference:
- DATABASE_SCHEMA.prisma for models
- SPECIFICATIONS_COMPLETE.md for business logic
```

---

## 🔗 Related Resources

- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Stripe API:** https://stripe.com/docs/api
- **Twilio API:** https://www.twilio.com/docs
- **Socket.io:** https://socket.io/docs/v4

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial 11 documents |
| 2.0 | Jan 2026 | Added UI_AUDIT, expanded components |
| 3.0 | Jan 2026 | Added TECH_STACK, SYSTEM_ARCHITECTURE, WORKFLOWS, expanded DATABASE_SCHEMA |

---

*Built with ❤️ for the wheelchair transportation industry*
