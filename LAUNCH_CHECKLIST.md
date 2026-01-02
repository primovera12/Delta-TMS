# Launch Checklist - Delta TMS

> **Document Version:** 1.0
> **Last Updated:** January 2, 2026
> **Target Launch:** [TBD]

## Overview

This document provides a comprehensive checklist for launching Delta TMS to production. Follow each section in order to ensure a smooth go-live.

---

## Phase 1: Pre-Launch (T-7 Days)

### 1.1 Code & Deployment
- [ ] All features complete and tested
- [ ] Code frozen (no new features)
- [ ] All PRs merged to main branch
- [ ] Production build succeeds locally
- [ ] Vercel production deployment configured
- [ ] Environment variables set in Vercel

### 1.2 Database
- [ ] Production database provisioned
- [ ] Connection pooling configured
- [ ] SSL/TLS enabled
- [ ] Prisma schema pushed to production
- [ ] Seed data applied
- [ ] Backups configured and tested
- [ ] Point-in-time recovery enabled

### 1.3 Third-Party Services
- [ ] **Stripe**: Production keys configured
- [ ] **Twilio/SendGrid**: Production SMS/Email verified
- [ ] **Google Maps**: Production API key with restrictions
- [ ] **Sentry**: Error tracking configured
- [ ] **Analytics**: Google Analytics / Mixpanel enabled
- [ ] All webhooks updated to production URLs

### 1.4 Domain & SSL
- [ ] Production domain purchased/configured
- [ ] DNS pointed to Vercel
- [ ] SSL certificate active
- [ ] www redirect configured
- [ ] Subdomains configured (api., staging.)

### 1.5 Security
- [ ] SECURITY.md checklist completed
- [ ] All API routes authenticated
- [ ] Rate limiting enabled
- [ ] CORS configured for production domain only
- [ ] Security headers verified
- [ ] Dependency audit passed (`npm audit`)
- [ ] Secrets rotated from development

---

## Phase 2: Final Verification (T-3 Days)

### 2.1 UAT Sign-Off
- [ ] All critical test cases passed
- [ ] All high priority test cases passed
- [ ] No critical/high defects open
- [ ] Sign-off received from:
  - [ ] QA Lead
  - [ ] Product Owner
  - [ ] Operations Lead
  - [ ] Finance Lead

### 2.2 Performance Verification
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] No memory leaks detected
- [ ] Mobile performance acceptable
- [ ] CDN caching working

### 2.3 Integration Tests
- [ ] Payment flow end-to-end (Stripe test → production)
- [ ] SMS notifications sending
- [ ] Email notifications sending
- [ ] GPS tracking working
- [ ] Map rendering correctly
- [ ] Cron jobs scheduled

### 2.4 Data Readiness
- [ ] Production data imported (if migrating)
- [ ] User accounts created
- [ ] Facilities configured
- [ ] Drivers onboarded
- [ ] Service rates configured
- [ ] Data verified against source

---

## Phase 3: Go-Live Day (T-0)

### 3.1 Pre-Launch Morning
| Time | Task | Owner | Status |
|------|------|-------|--------|
| 06:00 | Final backup of any legacy system | DBA | [ ] |
| 06:30 | Verify production environment healthy | DevOps | [ ] |
| 07:00 | Verify all services running | DevOps | [ ] |
| 07:30 | Clear any test data from production | DBA | [ ] |
| 08:00 | Final sync of any new data | DBA | [ ] |

### 3.2 Launch Sequence
| Time | Task | Owner | Status |
|------|------|-------|--------|
| 08:30 | Update DNS to point to production | DevOps | [ ] |
| 08:35 | Verify DNS propagation starting | DevOps | [ ] |
| 08:45 | Test login on production URL | QA | [ ] |
| 09:00 | Test critical path: Trip booking | QA | [ ] |
| 09:15 | Test critical path: Driver workflow | QA | [ ] |
| 09:30 | Test critical path: Payment | QA | [ ] |
| 09:45 | **GREEN LIGHT for user access** | PM | [ ] |

### 3.3 Validation Checklist
- [ ] Users can log in
- [ ] Dashboard loads correctly
- [ ] Trip booking works
- [ ] Driver app functional
- [ ] Payments process successfully
- [ ] Notifications sending
- [ ] Maps displaying
- [ ] Reports generating

---

## Phase 4: Post-Launch Monitoring

### 4.1 First Hour
- [ ] Monitor error rates in Sentry
- [ ] Watch API response times
- [ ] Check database performance
- [ ] Monitor support channels
- [ ] Verify cron jobs executing

### 4.2 First Day
- [ ] Review all error logs
- [ ] Check payment reconciliation
- [ ] Monitor user feedback
- [ ] Address any urgent issues
- [ ] Document any incidents

### 4.3 First Week
| Day | Focus | Owner |
|-----|-------|-------|
| 1 | Stability monitoring | DevOps |
| 2 | Performance tuning | Backend |
| 3 | User feedback review | Product |
| 4 | Bug fixes if needed | Dev Team |
| 5 | Operations review | Ops Lead |
| 6-7 | Documentation updates | All |

---

## Rollback Plan

### Triggers for Rollback
- Critical functionality not working (login, trips, payments)
- Data corruption detected
- Performance degradation > 50%
- Security incident detected

### Rollback Procedure

```bash
# 1. Announce rollback to team
# Slack: @channel ROLLBACK INITIATED - Delta TMS

# 2. Revert Vercel deployment
vercel rollback

# 3. If database changes need reverting
pg_restore -d delta_tms_prod backup_pre_launch.dump

# 4. Update DNS if needed (legacy system)
# Point back to legacy system

# 5. Notify stakeholders
# Send status update email
```

### Rollback Contacts
| Role | Name | Phone | Backup |
|------|------|-------|--------|
| DevOps Lead | [Name] | [Phone] | [Backup] |
| DBA | [Name] | [Phone] | [Backup] |
| Project Manager | [Name] | [Phone] | [Backup] |

---

## Communication Plan

### Pre-Launch Communications

| Audience | Channel | Timing | Message |
|----------|---------|--------|---------|
| All Staff | Email | T-7 days | Launch announcement |
| Drivers | App + SMS | T-3 days | Training reminder |
| Facilities | Email | T-3 days | What to expect |
| Patients | Email | T-1 day | New system intro |

### Launch Day Communications

| Event | Audience | Channel | Owner |
|-------|----------|---------|-------|
| Go-Live | All Staff | Slack | PM |
| Go-Live | Clients | Email | Sales |
| Issues | Internal | Slack #incidents | DevOps |
| Resolution | All | Email | PM |

### Post-Launch Support

**Support Channels:**
- In-app chat: Enabled for all users
- Email: support@deltatms.com
- Phone: [Support Number] (8 AM - 8 PM)
- Emergency: [Emergency Line] (24/7)

---

## Team Assignments

### Launch Day Roles

| Role | Primary | Backup | Responsibilities |
|------|---------|--------|------------------|
| Launch Commander | [PM Name] | [Backup] | Overall coordination |
| Technical Lead | [Dev Name] | [Backup] | Code issues |
| DevOps Lead | [DevOps Name] | [Backup] | Infrastructure |
| DBA | [DBA Name] | [Backup] | Database issues |
| QA Lead | [QA Name] | [Backup] | Validation |
| Support Lead | [Support Name] | [Backup] | User issues |

### On-Call Schedule (First Week)

| Day | Primary | Secondary |
|-----|---------|-----------|
| Mon | [Name] | [Name] |
| Tue | [Name] | [Name] |
| Wed | [Name] | [Name] |
| Thu | [Name] | [Name] |
| Fri | [Name] | [Name] |
| Sat | [Name] | [Name] |
| Sun | [Name] | [Name] |

---

## Success Metrics

### Day 1 Targets
- [ ] Zero critical incidents
- [ ] < 5 high severity issues
- [ ] 95% uptime
- [ ] < 10 support tickets

### Week 1 Targets
- [ ] 99% uptime
- [ ] All scheduled trips completed
- [ ] Payment processing working
- [ ] No data integrity issues

### Month 1 Targets
- [ ] User adoption > 80%
- [ ] Trip booking success rate > 95%
- [ ] Customer satisfaction > 4/5
- [ ] All legacy system decommissioned

---

## Post-Mortem Template

To be completed within 48 hours of launch:

```markdown
# Delta TMS Launch Post-Mortem

## Summary
- Launch Date/Time:
- Overall Status: [Success/Partial/Issues]

## What Went Well
-
-
-

## What Could Be Improved
-
-
-

## Incidents
| Incident | Severity | Resolution Time | Root Cause |
|----------|----------|-----------------|------------|
| | | | |

## Action Items
| Item | Owner | Due Date |
|------|-------|----------|
| | | |

## Lessons Learned
-
-
-
```

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Technical Lead | | | |
| Operations Lead | | | |
| Executive Sponsor | | | |

---

## Appendix: Quick Reference

### Important URLs
| Environment | URL |
|-------------|-----|
| Production | https://app.deltatms.com |
| Staging | https://staging.deltatms.com |
| Vercel Dashboard | https://vercel.com/[team]/delta-tms |
| Sentry | https://sentry.io/[org]/delta-tms |
| Stripe Dashboard | https://dashboard.stripe.com |

### Emergency Procedures
1. **Site Down**: Contact DevOps Lead → Check Vercel status → Check database
2. **Payments Failing**: Check Stripe dashboard → Verify API keys → Contact Stripe
3. **Data Issue**: Stop writes → DBA investigation → Restore from backup if needed
4. **Security Incident**: Isolate affected systems → Document → Engage security team

---

*Last reviewed: January 2, 2026*
