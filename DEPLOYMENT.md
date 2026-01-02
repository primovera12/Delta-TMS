# Deployment Guide - Delta TMS

> **Platform:** Vercel
> **Database:** PostgreSQL (Neon/Supabase recommended)
> **Last Updated:** January 2, 2026

## Prerequisites

Before deploying, ensure you have:
- [ ] Vercel account with Pro/Team plan (for cron jobs)
- [ ] PostgreSQL database (Neon, Supabase, or similar)
- [ ] Stripe account with API keys
- [ ] Twilio account with SMS-enabled phone number
- [ ] SendGrid account for transactional emails
- [ ] Google Cloud account with Maps API enabled

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd Delta-TMS
npm install
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual credentials. See `.env.example` for all required variables.

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Local Development

```bash
npm run dev
```

## Production Deployment (Vercel)

### Step 1: Connect Repository

1. Log in to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Select the `main` branch for production

### Step 2: Configure Environment Variables

In Vercel Project Settings > Environment Variables, add:

**Required Variables:**
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random 32-character secret |
| `NEXTAUTH_URL` | Your production URL (e.g., https://delta-tms.vercel.app) |
| `STRIPE_SECRET_KEY` | Stripe secret key (live mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number |
| `SENDGRID_API_KEY` | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Sender email address |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key |

**Optional Variables:**
| Variable | Description |
|----------|-------------|
| `QUICKBOOKS_CLIENT_ID` | QuickBooks OAuth client ID |
| `QUICKBOOKS_CLIENT_SECRET` | QuickBooks OAuth secret |
| `SENTRY_DSN` | Sentry error tracking DSN |

### Step 3: Configure Build Settings

Vercel should auto-detect settings from `vercel.json`:
- Build Command: `prisma generate && next build`
- Framework: Next.js

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

### Step 5: Setup Webhooks

**Stripe Webhooks:**
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/v1/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.failed`, `invoice.paid`, `invoice.payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

**Twilio Webhooks:**
1. Go to Twilio Console > Phone Numbers
2. Configure webhook URL: `https://your-domain.vercel.app/api/v1/webhooks/twilio`

### Step 6: Verify Cron Jobs

Vercel cron jobs are configured in `vercel.json`:
- Daily reminders: 8:00 AM UTC
- Invoice reminders: 9:00 AM UTC

Note: Cron jobs require Vercel Pro/Team plan.

## Database Setup

### Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npm run db:push`

### Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy connection string (pooled) to `DATABASE_URL`
4. Copy direct connection to `DIRECT_URL`

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test user authentication flow
- [ ] Test payment processing with Stripe test mode
- [ ] Verify SMS delivery with Twilio
- [ ] Test email delivery with SendGrid
- [ ] Verify Google Maps autocomplete works
- [ ] Check cron job execution in Vercel logs
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificate (automatic with Vercel)
- [ ] Set up monitoring/alerting

## Monitoring

### Vercel Analytics
Enable in Project Settings > Analytics for:
- Page views and web vitals
- Edge and serverless function performance

### Error Tracking
Recommended: Set up Sentry for error tracking:
1. Create Sentry project
2. Add `SENTRY_DSN` environment variable
3. Install `@sentry/nextjs` package

## Rollback

To rollback to a previous deployment:
1. Go to Vercel Dashboard > Deployments
2. Find the stable deployment
3. Click "..." > "Promote to Production"

## Scaling Considerations

### Database
- Enable connection pooling for serverless functions
- Consider read replicas for heavy read workloads
- Set up automated backups

### API Routes
- Implement rate limiting (see SECURITY.md)
- Consider edge caching for static data
- Use Vercel's edge functions for latency-sensitive routes

### Static Assets
- Images are optimized automatically by Next.js
- Consider CDN for large file uploads

## Support

For deployment issues:
- Vercel: [vercel.com/help](https://vercel.com/help)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma: [prisma.io/docs](https://prisma.io/docs)
