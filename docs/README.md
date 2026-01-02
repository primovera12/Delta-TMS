# Wheelchair Transportation Platform - Specification Package

> **Version:** 3.0 (Final)
> **Last Updated:** January 2026
> **Total Documents:** 17
> **For Use With:** Claude Code Web (claude.ai/code)

---

## 📦 Document List

| # | File | Purpose | Size |
|---|------|---------|------|
| 1 | `MASTER_GUIDE.md` | 🎯 **START HERE** - How to use these docs | 14 KB |
| 2 | `DEVELOPMENT_ROADMAP.md` | Day-by-day development plan (100 days) | 50 KB |
| 3 | `ROADMAP_ADDENDUM.md` | Additional features (multi-stop, will-call) | 17 KB |
| 4 | `DATABASE_SCHEMA.prisma` | Full Prisma schema (65+ models) | 71 KB |
| 5 | `API_SPEC.md` | REST API (170+ endpoints) | 59 KB |
| 6 | `TECH_STACK.md` | Technology decisions & versions | 26 KB |
| 7 | `SYSTEM_ARCHITECTURE.md` | System diagrams & data flows | 71 KB |
| 8 | `WORKFLOWS.md` | Step-by-step feature workflows | 65 KB |
| 9 | `SPECIFICATIONS_COMPLETE.md` | All feature specifications | 64 KB |
| 10 | `SCREEN_CATALOG.md` | All 186 screens with routes | 24 KB |
| 11 | `DESIGN_SYSTEM.md` | Core UI components (56) | 33 KB |
| 12 | `DESIGN_SYSTEM_ADDENDUM.md` | Additional UI components (129) | 35 KB |
| 13 | `BRAND_GUIDELINES.md` | Stripe-inspired visual design | 22 KB |
| 14 | `ACCESSIBILITY_SPEC.md` | Elder Mode + WCAG requirements | 24 KB |
| 15 | `PRICING_ENGINE.md` | Complete pricing logic | 35 KB |
| 16 | `FEATURE_AUDIT.md` | Feature verification (199 features) | 15 KB |
| 17 | `UI_AUDIT.md` | Screen & component audit | 13 KB |

---

## 📊 Platform Statistics

| Metric | Count |
|--------|-------|
| **Screens** | 186 (155 pages + 31 modals) |
| **UI Components** | 185 |
| **Database Models** | 65+ |
| **API Endpoints** | 170+ |
| **Features** | 199 |
| **Development Days** | 100 |

---

## 🚀 How to Use with Claude Code Web

### Step 1: Set Up Your Repository

Your repo structure should be:
```
your-repo/
└── docs/
    ├── MASTER_GUIDE.md
    ├── DEVELOPMENT_ROADMAP.md
    ├── DATABASE_SCHEMA.prisma
    └── ... (all 17 files)
```

### Step 2: Configure Environment Variables

In Claude Code Web, you'll need:
- `DATABASE_URL` - Supabase pooled connection (port 6543)
- `DIRECT_URL` - Supabase direct connection (port 5432)

### Step 3: Start Claude Code Web

1. Go to [claude.ai/code](https://claude.ai/code)
2. Connect your GitHub repository
3. Use the prompt from `CLAUDE_CODE_PROMPT.md`

---

## 🔧 Technology Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase), Redis
- **Auth:** NextAuth.js v5
- **Payments:** Stripe (Connect for driver payouts)
- **SMS:** Twilio
- **Email:** SendGrid
- **Maps:** Google Maps Platform
- **Real-time:** Socket.io

---

## 📖 Reading Order

1. `MASTER_GUIDE.md` - Overview
2. `TECH_STACK.md` - Technology choices
3. `SYSTEM_ARCHITECTURE.md` - How it connects
4. `WORKFLOWS.md` - Feature flows
5. `DEVELOPMENT_ROADMAP.md` - Build plan

---

*Built for autonomous AI development with Claude Code*
