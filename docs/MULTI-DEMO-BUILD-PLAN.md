# 🚀 MULTI-DEMO BUILD PLAN
**Building 3 Demo Sites: Plumbing, HVAC, Electrical**

**Created:** November 3, 2025
**Timeline:** 4-6 hours
**Status:** 🟡 IN PROGRESS

---

## 📋 MASTER CHECKLIST

### **PHASE 1: Homepage Showcase** ⏳
- [ ] Create new showcase landing page at `/app/page.tsx`
- [ ] Design hero section highlighting all 3 demo niches
- [ ] Add 3 demo cards (Plumbing, HVAC, Electrical) with CTAs
- [ ] Include social proof and business model overview
- [ ] Test responsive design (mobile/tablet/desktop)

**Expected Time:** 2 hours
**Deliverable:** nevermisslead.com showcases all 3 demos

---

### **PHASE 2: HVAC Route** ⏳
- [ ] Create `/app/hvac/page.tsx`
- [ ] Move existing page logic from `/app/page.tsx` to HVAC route
- [ ] Verify HVAC config loading from `nevermisslead.json`
- [ ] Test HVAC route at `http://localhost:3000/hvac`
- [ ] Ensure all sections render correctly

**Expected Time:** 30 minutes
**Deliverable:** nevermisslead.com/hvac fully functional

---

### **PHASE 3: Plumbing Configuration** ⏳
- [ ] Copy `/config/clients/nevermisslead.json` to `plumbing.json`
- [ ] Update business name to "NeverMissLead Plumbing"
- [ ] Customize hero copy for plumbing emergencies
- [ ] Update 8 services to plumbing-specific services
- [ ] Customize testimonials for plumbing context
- [ ] Update FAQ for plumbing industry
- [ ] Change color scheme to blue/white theme
- [ ] Update SEO metadata for plumbing keywords
- [ ] Validate JSON syntax

**Expected Time:** 1 hour
**Deliverable:** `/config/clients/plumbing.json` ready

**Services to Include:**
1. Emergency Pipe Repair
2. Drain Cleaning & Unclogging
3. Water Heater Repair & Installation
4. Sewer Line Services
5. Leak Detection & Repair
6. Toilet & Faucet Repair
7. Garbage Disposal Service
8. Plumbing Maintenance Plans

---

### **PHASE 4: Plumbing Route** ⏳
- [ ] Create `/app/plumbing/page.tsx`
- [ ] Load plumbing config from `plumbing.json`
- [ ] Use same PageContent component (reusable)
- [ ] Test plumbing route at `http://localhost:3000/plumbing`
- [ ] Verify form submissions work
- [ ] Check all sections render with plumbing content

**Expected Time:** 30 minutes
**Deliverable:** nevermisslead.com/plumbing fully functional

---

### **PHASE 5: Electrical Configuration** ⏳
- [ ] Copy `/config/clients/nevermisslead.json` to `electrical.json`
- [ ] Update business name to "NeverMissLead Electrical"
- [ ] Customize hero copy for electrical emergencies
- [ ] Update 8 services to electrical-specific services
- [ ] Customize testimonials for electrical context
- [ ] Update FAQ for electrical industry
- [ ] Change color scheme to yellow/black theme
- [ ] Update SEO metadata for electrical keywords
- [ ] Validate JSON syntax

**Expected Time:** 1 hour
**Deliverable:** `/config/clients/electrical.json` ready

**Services to Include:**
1. Emergency Electrical Repair
2. Electrical Panel Upgrades
3. Circuit Breaker Services
4. EV Charging Station Installation
5. Solar Panel Installation
6. Smart Home Automation
7. Lighting Installation & Repair
8. Electrical Safety Inspections

---

### **PHASE 6: Electrical Route** ⏳
- [ ] Create `/app/electrical/page.tsx`
- [ ] Load electrical config from `electrical.json`
- [ ] Use same PageContent component (reusable)
- [ ] Test electrical route at `http://localhost:3000/electrical`
- [ ] Verify form submissions work
- [ ] Check all sections render with electrical content

**Expected Time:** 30 minutes
**Deliverable:** nevermisslead.com/electrical fully functional

---

### **PHASE 7: Local Testing** ⏳
- [ ] Start dev server: `npm run dev`
- [ ] Test homepage: `http://localhost:3000`
- [ ] Test HVAC demo: `http://localhost:3000/hvac`
- [ ] Test plumbing demo: `http://localhost:3000/plumbing`
- [ ] Test electrical demo: `http://localhost:3000/electrical`
- [ ] Submit test lead on each demo
- [ ] Verify email notifications work
- [ ] Check responsive design on all pages
- [ ] Verify all navigation links work
- [ ] Check console for errors

**Expected Time:** 30 minutes
**Deliverable:** All 4 pages working locally

---

### **PHASE 8: Git Commit** ⏳
- [ ] Stage all changes: `git add .`
- [ ] Create descriptive commit message
- [ ] Commit: `git commit -m "Add plumbing and electrical demo sites with showcase homepage"`
- [ ] Verify commit includes all new files

**Expected Time:** 5 minutes
**Deliverable:** Clean Git commit ready to push

---

### **PHASE 9: Deploy to Production** ⏳
- [ ] Push to GitHub: `git push origin master`
- [ ] Wait for Vercel auto-deploy (~2 minutes)
- [ ] Verify deployment succeeded in Vercel dashboard
- [ ] Test production URL: `https://nevermisslead.com`
- [ ] Test production HVAC: `https://nevermisslead.com/hvac`
- [ ] Test production plumbing: `https://nevermisslead.com/plumbing`
- [ ] Test production electrical: `https://nevermisslead.com/electrical`

**Expected Time:** 10 minutes
**Deliverable:** All 4 pages live in production

---

### **PHASE 10: Final Verification** ⏳
- [ ] Submit test lead on production plumbing site
- [ ] Submit test lead on production electrical site
- [ ] Verify email notifications arrive
- [ ] Check database for lead records
- [ ] Test mobile responsiveness on all pages
- [ ] Verify SSL certificates working
- [ ] Check page load speeds
- [ ] Document final URLs for user

**Expected Time:** 15 minutes
**Deliverable:** Production-ready demo sites verified

---

## 🎯 SUCCESS CRITERIA

### **Homepage Showcase**
✅ Clean, professional landing page
✅ Clear value proposition
✅ 3 demo cards with working links
✅ Call-to-action buttons
✅ Mobile responsive

### **HVAC Demo**
✅ All 14 sections rendering correctly
✅ Forms submitting successfully
✅ Email notifications working
✅ Responsive design
✅ SEO optimized

### **Plumbing Demo**
✅ Plumbing-specific content and services
✅ Blue/white color scheme
✅ Forms submitting successfully
✅ Email notifications working
✅ Responsive design
✅ SEO optimized for plumbing keywords

### **Electrical Demo**
✅ Electrical-specific content and services
✅ Yellow/black color scheme
✅ Forms submitting successfully
✅ Email notifications working
✅ Responsive design
✅ SEO optimized for electrical keywords

---

## 📂 FILES TO CREATE/MODIFY

### **New Files (6 total)**
```
/app/plumbing/page.tsx              # Plumbing demo route
/app/electrical/page.tsx            # Electrical demo route
/app/hvac/page.tsx                  # HVAC demo route (move existing)
/config/clients/plumbing.json       # Plumbing configuration
/config/clients/electrical.json     # Electrical configuration
/docs/MULTI-DEMO-BUILD-PLAN.md      # This file
```

### **Modified Files (1 total)**
```
/app/page.tsx                       # Transform to showcase landing page
```

---

## 🔧 TECHNICAL APPROACH

### **Route Structure**
```
/app
  page.tsx          → Showcase landing page
  /hvac
    page.tsx        → HVAC demo (loads nevermisslead.json)
  /plumbing
    page.tsx        → Plumbing demo (loads plumbing.json)
  /electrical
    page.tsx        → Electrical demo (loads electrical.json)
```

### **Config Loading Pattern**
```typescript
// Each demo route follows same pattern
import { getClientConfig } from '@/lib/config-loader';
import { PageContent } from '@/components/PageContent';

export default async function PlumbingPage() {
  const config = await getClientConfig('plumbing'); // Change slug only
  return (
    <main className="min-h-screen bg-white text-dark-gray">
      <PageContent config={config} />
    </main>
  );
}
```

### **Reusable Components**
All 3 demos use the **exact same components**:
- ✅ PageContent (orchestrates all sections)
- ✅ All 14 section components (Header, Hero, Services, etc.)
- ✅ Form components (LeadForm, QuoteModal)
- ✅ UI components (buttons, cards, etc.)

**Only difference:** JSON configuration file

---

## 🎨 DESIGN CUSTOMIZATIONS

### **Plumbing Theme**
- Primary Color: `#1976D2` (Blue - water association)
- Secondary Color: `#0D47A1` (Dark Blue)
- Accent Color: `#42A5F5` (Light Blue)
- Icons: Water drops, pipes, wrenches
- Imagery: Emergency plumbing scenarios

### **Electrical Theme**
- Primary Color: `#FBC02D` (Yellow - electrical caution)
- Secondary Color: `#212121` (Black)
- Accent Color: `#FFD54F` (Light Yellow)
- Icons: Lightning bolts, circuits, light bulbs
- Imagery: Electrical panels, safety equipment

### **HVAC Theme (Existing)**
- Primary Color: `#D32F2F` (Red - heating/emergency)
- Secondary Color: `#1976D2` (Blue - cooling)
- Accent Color: `#F57C00` (Orange)
- Icons: Snowflakes, flames, thermometers
- Imagery: AC units, furnaces, thermostats

---

## 📊 ESTIMATED TIMELINE

| Phase | Task | Time | Cumulative |
|-------|------|------|------------|
| 1 | Homepage Showcase | 2h | 2h |
| 2 | HVAC Route | 0.5h | 2.5h |
| 3 | Plumbing Config | 1h | 3.5h |
| 4 | Plumbing Route | 0.5h | 4h |
| 5 | Electrical Config | 1h | 5h |
| 6 | Electrical Route | 0.5h | 5.5h |
| 7 | Local Testing | 0.5h | 6h |
| 8 | Git Commit | 0.1h | 6.1h |
| 9 | Deploy | 0.2h | 6.3h |
| 10 | Final Verification | 0.25h | 6.5h |

**Total Estimated Time:** 6-7 hours

---

## 🚨 POTENTIAL ISSUES & SOLUTIONS

### **Issue: Form submissions go to wrong client**
**Solution:** Each route loads different config with unique `clientId` and `slug`

### **Issue: Colors don't update**
**Solution:** Colors come from config JSON `branding.colors` object

### **Issue: Email notifications have wrong business name**
**Solution:** Business name comes from `businessInfo.businessName` in config

### **Issue: Images/logos missing**
**Solution:** Keep generic until client onboarding, or use placeholder images

### **Issue: Vercel deployment fails**
**Solution:** Run `npm run build` locally first to catch TypeScript errors

---

## ✅ COMPLETION CRITERIA

**Project is complete when:**
1. ✅ All 4 pages load without errors
2. ✅ Forms submit successfully on all 3 demos
3. ✅ Email notifications work for all 3 demos
4. ✅ Responsive design works on mobile/tablet/desktop
5. ✅ All routes accessible in production
6. ✅ No console errors on any page
7. ✅ Page load times under 3 seconds
8. ✅ All content is niche-specific (no generic placeholders)

---

## 📝 POST-COMPLETION TASKS

After all 3 demos are live:
- [ ] Update CLAUDE.md with new project status
- [ ] Document demo URLs for Facebook ad campaigns
- [ ] Create ad copy templates for each niche
- [ ] Set up Facebook Business Manager campaigns
- [ ] Configure conversion tracking pixels
- [ ] Create lead magnet offers for each niche
- [ ] Prepare sales pitch deck with all 3 demos

---

**Last Updated:** November 3, 2025
**Status:** Task master created, ready to execute Phase 1
