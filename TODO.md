# TODO - NEVERMISSLEAD DEVELOPMENT CHECKLIST

**Project:** NeverMissLead - Contractor Website Template
**Total Estimated Time:** 22 hours over 5 days

---

## ✅ PHASE 0: FOUNDATION SETUP (2 hours) - **COMPLETE**

- [x] Create project directory `/Users/mufasa/Desktop/Nevermisslead-project/`
- [x] Initialize Git repository
- [x] Create `.gitignore` file
- [x] Create folder structure (`docs/`, `config/`, `sql/`)
- [x] Copy 6 reference PDFs to `/docs/reference/`
- [x] Create `README.md` with project overview
- [x] Create `PRD.md` with complete product requirements
- [x] Create `CLAUDE.md` for project tracking
- [x] Create `TODO.md` (this file)
- [x] Create GitHub repository (nevermisslead-template)
- [x] Push initial commit to GitHub
- [x] Create `DEPLOYMENT-GUIDE.md`
- [ ] Create `client-registry.json` template

**Validation:**
- [x] Git initialized with `.gitignore`
- [x] GitHub repo created (private)
- [x] All core docs committed
- [ ] Can clone repo to fresh directory

---

## ✅ PHASE 1: NEXT.JS PROJECT SETUP (1 hour) - **COMPLETE**

- [x] Initialize Next.js 14 with App Router + TypeScript + Tailwind
  ```bash
  npx create-next-app@latest nevermisslead-template --typescript --tailwind --app --no-src-dir
  ```
- [x] Install dependencies:
  ```bash
  npm install @supabase/supabase-js twilio react-hook-form zod @hookform/resolvers lucide-react
  ```
- [x] Configure Tailwind with design system (tailwind.config.js)
  - [x] Add primary color: `#234654`
  - [x] Add secondary color: `#F5A05C`
  - [x] Add Inter font from Google Fonts
  - [x] Add custom spacing scale
- [x] Create folder structure:
  - [x] `/app/api/leads/`
  - [x] `/app/api/twilio/voice/`
  - [x] `/app/api/twilio/sms/`
  - [x] `/app/api/twilio/status/`
  - [x] `/components/sections/`
  - [x] `/components/ui/`
  - [x] `/lib/supabase/`
  - [x] `/lib/twilio/`
  - [x] `/lib/utils/`
  - [x] `/config/clients/`
  - [x] `/public/clients/`
- [x] Create `.env.local.example` with all required variables
- [x] Test dev server runs: `npm run dev`

**Validation:**
- [x] Server starts on `localhost:3000`
- [x] Tailwind CSS working
- [x] TypeScript compiles with no errors
- [x] Folder structure matches plan

---

## ✅ PHASE 2: CONFIGURATION SYSTEM (1 hour) - **COMPLETE**

- [x] Create TypeScript interface `/lib/types/client-config.ts`
  - [x] Define `ClientConfig` interface
  - [x] Define nested types (Hero, About, Service, etc.)
- [x] Create Zod validation schema `/lib/schemas/client-config.schema.ts`
  - [x] Validate all required fields
  - [x] Validate data types
  - [x] Validate phone numbers, URLs, emails
- [x] Create config loader `/lib/config-loader.ts`
  - [x] Read `CLIENT_SLUG` from env
  - [x] Load corresponding JSON file
  - [x] Validate with Zod schema
  - [x] Return typed config
- [x] Create demo client config `/config/clients/demo-client.json`
  - [x] Fill in all 12 sections
  - [x] Use placeholder content
  - [x] Include sample images paths
- [x] Create config template `/config/site.config.template.json`

**Validation:**
- [x] Can switch clients by changing `CLIENT_SLUG` env var
- [x] TypeScript autocomplete works for config
- [x] Zod validation catches invalid configs
- [x] No hardcoded content in components

---

## ⏳ PHASE 3: UI COMPONENTS (2 hours)

- [ ] Create `/components/ui/button.tsx`
  - [ ] Primary variant (orange background)
  - [ ] Phone variant (white with border)
  - [ ] Hover states
  - [ ] Loading state
  - [ ] TypeScript props
- [ ] Create `/components/ui/card.tsx`
  - [ ] Service card variant
  - [ ] Trust badge variant
  - [ ] Hover animations
- [ ] Create `/components/ui/section-container.tsx`
  - [ ] Consistent padding (80px desktop, 40px mobile)
  - [ ] Max-width 1200px
  - [ ] Centered content
- [ ] Create `/components/ui/form-input.tsx`
  - [ ] Text input
  - [ ] Textarea
  - [ ] Error states
  - [ ] Integration with React Hook Form
- [ ] Test each component in isolation

**Validation:**
- [ ] All UI components render correctly
- [ ] Hover states work
- [ ] Mobile responsive
- [ ] Matches design specs from PDF
- [ ] No console warnings

---

## ⏳ PHASE 4: SECTION COMPONENTS (4 hours)

### Section 1: Header
- [ ] Create `/components/sections/Header.tsx`
- [ ] Implement sticky behavior
- [ ] Logo (left) + Nav (center) + Phone + CTA (right)
- [ ] Hamburger menu for mobile
- [ ] Smooth scroll to sections

### Section 2: Hero
- [ ] Create `/components/sections/Hero.tsx`
- [ ] Two-column layout (50/50)
- [ ] Left: Headline + Subheadline + Description + Form
- [ ] Right: Hero image
- [ ] Integrate lead form (build in Phase 7)
- [ ] Mobile: Stack vertically

### Section 3: Trust Badges
- [ ] Create `/components/sections/TrustBadges.tsx`
- [ ] Single row, 5 badges
- [ ] Read from config
- [ ] Responsive (stack on mobile)

### Section 4: About Us
- [ ] Create `/components/sections/About.tsx`
- [ ] Two-column layout (60/40)
- [ ] Left: Heading + description
- [ ] Right: About image
- [ ] Optional: 3 stat badges

### Section 5: Services
- [ ] Create `/components/sections/Services.tsx`
- [ ] Responsive grid (3 cols desktop, 1 col mobile)
- [ ] 8 service cards
- [ ] Read from config
- [ ] Hover effects (orange border + shadow)

### Section 6: Process
- [ ] Create `/components/sections/Process.tsx`
- [ ] 5 steps in horizontal flow
- [ ] Icons + titles
- [ ] Connecting arrows between steps
- [ ] Mobile: Stack vertically

### Section 7: Gallery
- [ ] Create `/components/sections/Gallery.tsx`
- [ ] Masonry grid (4 cols desktop, 2 mobile)
- [ ] 8-12 images from config
- [ ] "See all photos" link
- [ ] Optional: Lightbox on click

### Section 8: Reviews
- [ ] Create `/components/sections/Reviews.tsx`
- [ ] Background image with overlay
- [ ] Google Reviews iframe embed
- [ ] "Leave us a review" button
- [ ] Star rating display

### Section 9: FAQ
- [ ] Create `/components/sections/FAQ.tsx`
- [ ] Two-column layout (60/40)
- [ ] Left: Accordion FAQ items
- [ ] Right: FAQ image
- [ ] Click to expand/collapse

### Section 10: Service Areas
- [ ] Create `/components/sections/ServiceAreas.tsx`
- [ ] Two-column layout (50/50)
- [ ] Left: Google Maps embed
- [ ] Right: List of areas
- [ ] Mobile: Stack vertically

### Section 11: Final CTA
- [ ] Create `/components/sections/FinalCTA.tsx`
- [ ] Full-width section with background
- [ ] Large heading + subheading
- [ ] Prominent CTA button
- [ ] Decorative images

### Section 12: Footer
- [ ] Create `/components/sections/Footer.tsx`
- [ ] Five columns
  - [ ] Column 1: Logo + contact + CTA
  - [ ] Column 2: Business links
  - [ ] Column 3: Services list
  - [ ] Column 4: Service areas
  - [ ] Column 5: Operating hours
- [ ] Bottom bar: Privacy | Terms
- [ ] Mobile: Stack columns

### Homepage Integration
- [ ] Update `/app/page.tsx` to render all 12 sections
- [ ] Load config based on `CLIENT_SLUG`
- [ ] Pass config props to each section

**Validation:**
- [ ] Full page renders with demo client config
- [ ] All 12 sections visible
- [ ] Mobile responsive on real device
- [ ] No console errors
- [ ] Lighthouse performance score 80+

---

## ⏳ PHASE 5: DATABASE SCHEMA (1 hour)

- [ ] Create `/sql/schema.sql`
  - [ ] `leads` table with all fields
  - [ ] `call_logs` table
  - [ ] `sms_logs` table
  - [ ] Indexes for performance
  - [ ] Enable Row Level Security (RLS)
- [ ] Create `/docs/guides/SUPABASE-SETUP.md`
  - [ ] Step-by-step Supabase project creation
  - [ ] How to run schema.sql
  - [ ] How to get connection credentials
- [ ] Test SQL script runs without errors

**Validation:**
- [ ] SQL script runs cleanly
- [ ] All 3 tables created
- [ ] Indexes created
- [ ] RLS enabled
- [ ] Can manually insert test data

---

## ⏳ PHASE 6: API ROUTES (3 hours)

### Lead Submission API
- [ ] Create `/app/api/leads/route.ts`
- [ ] Define Zod schema for validation
- [ ] Connect to Supabase
- [ ] Insert lead into `leads` table
- [ ] Return success/error JSON
- [ ] Log IP address and user agent
- [ ] Test with Postman

### Twilio Voice Webhook
- [ ] Create `/app/api/twilio/voice/route.ts`
- [ ] Parse Twilio webhook payload
- [ ] Log call to `call_logs` table
- [ ] Return TwiML to forward call
- [ ] Forward to client's real phone number
- [ ] Test with Twilio console

### Twilio SMS Webhook
- [ ] Create `/app/api/twilio/sms/route.ts`
- [ ] Parse incoming SMS
- [ ] Log to `sms_logs` table
- [ ] Send auto-response SMS (from config)
- [ ] Return 200 OK
- [ ] Test with Twilio console

### Twilio Status Webhook
- [ ] Create `/app/api/twilio/status/route.ts`
- [ ] Update `call_logs` with duration
- [ ] Update call status
- [ ] Return 200 OK

### Supabase Client
- [ ] Create `/lib/supabase/client.ts`
- [ ] Initialize Supabase client
- [ ] Export for use in API routes

### Twilio Client
- [ ] Create `/lib/twilio/client.ts`
- [ ] Initialize Twilio client
- [ ] Export for use in API routes

**Validation:**
- [ ] Form submission saves to Supabase
- [ ] Can test all webhooks with Postman
- [ ] Error handling works (try invalid data)
- [ ] TypeScript types correct
- [ ] No console errors

---

## ⏳ PHASE 7: LEAD CAPTURE FORM (2 hours)

- [ ] Create `/components/forms/LeadForm.tsx`
- [ ] Implement React Hook Form
- [ ] Create Zod validation schema
  - [ ] `full_name`: Required, min 2 chars
  - [ ] `phone`: Optional, valid format
  - [ ] `email`: Optional, valid email
  - [ ] `message`: Required, min 10 chars
- [ ] Connect to `/api/leads`
- [ ] Add loading state during submission
- [ ] Add success message
- [ ] Add error message
- [ ] Prevent duplicate submissions
- [ ] Reset form after success
- [ ] Integrate into Hero component

**Validation:**
- [ ] Form validates correctly (test invalid inputs)
- [ ] Submits to Supabase successfully
- [ ] User sees success message
- [ ] Can't spam submit button
- [ ] Works on mobile
- [ ] Keyboard navigation works
- [ ] Error messages clear

---

## ⏳ PHASE 8: TESTING & QA (1 hour)

- [ ] Create `/docs/PRE-LAUNCH-CHECKLIST.md`
  - [ ] Copy from Pre-Delivery Testing PDF
  - [ ] Adapt for this project
- [ ] Run Lighthouse test
  - [ ] Performance: 80+ target
  - [ ] Accessibility: 90+ target
  - [ ] Best Practices: 90+ target
  - [ ] SEO: 90+ target
- [ ] Test on real mobile device (iPhone/Android)
- [ ] Test in multiple browsers (Chrome, Safari, Firefox)
- [ ] Verify no console errors
- [ ] Test all form validations
- [ ] Check all links work
- [ ] Verify all images load
- [ ] Check mobile responsive on all sections

**Validation:**
- [ ] All Lighthouse scores meet targets
- [ ] Mobile looks good on real device
- [ ] Works in Chrome, Safari, Firefox
- [ ] No console errors or warnings
- [ ] Form submission works end-to-end

---

## ⏳ PHASE 9: DEPLOY SHOWCASE SITE (2 hours)

### Supabase Setup
- [ ] Create Supabase account (if needed)
- [ ] Create new project: `nevermisslead-showcase`
- [ ] Run `schema.sql` in SQL Editor
- [ ] Save connection details (URL, anon key)
- [ ] Test database connection

### Twilio Setup
- [ ] Create Twilio account (if needed)
- [ ] Purchase phone number
- [ ] Save number and credentials
- [ ] Note: Configure webhooks after Vercel deployment

### Vercel Deployment
- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub repo
- [ ] Create new Vercel project
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `TWILIO_ACCOUNT_SID`
  - [ ] `TWILIO_AUTH_TOKEN`
  - [ ] `TWILIO_PHONE_NUMBER`
  - [ ] `CLIENT_SLUG=demo-client`
  - [ ] `NEXT_PUBLIC_APP_URL`
- [ ] Deploy to Vercel
- [ ] Wait for build to complete
- [ ] Get Vercel URL (e.g., nevermisslead.vercel.app)

### Domain Configuration
- [ ] Add `nevermisslead.com` to Vercel project
- [ ] Get DNS records from Vercel
- [ ] Update DNS at domain registrar
  - [ ] A record: @ → 76.76.19.19
  - [ ] CNAME record: www → cname.vercel-dns.com
- [ ] Wait for DNS propagation (15-30 min)
- [ ] Verify SSL certificate issued

### Twilio Webhook Configuration
- [ ] Configure Voice webhook:
  - [ ] URL: `https://nevermisslead.com/api/twilio/voice`
  - [ ] Method: POST
- [ ] Configure SMS webhook:
  - [ ] URL: `https://nevermisslead.com/api/twilio/sms`
  - [ ] Method: POST
- [ ] Configure Status webhook:
  - [ ] URL: `https://nevermisslead.com/api/twilio/status`
  - [ ] Method: POST

### Testing Live Site
- [ ] Visit https://nevermisslead.com
- [ ] Submit lead form → Check Supabase
- [ ] Call tracking number → Verify forwarding
- [ ] Text tracking number → Verify auto-response
- [ ] Check all sections render
- [ ] Test on mobile device
- [ ] Run Lighthouse on live site

**Validation:**
- [ ] https://nevermisslead.com is live
- [ ] SSL certificate active (padlock icon)
- [ ] All features work on live site
- [ ] Form submissions save to Supabase
- [ ] Twilio call/SMS tracking works
- [ ] Can be used as showcase for clients

---

## ⏳ PHASE 10: REPLICATION SYSTEM (2 hours)

- [ ] Create `/docs/guides/DEPLOYMENT-GUIDE.md`
  - [ ] Copy from Setup Automation Script PDF
  - [ ] Adapt for this project
  - [ ] Step-by-step process
  - [ ] Estimated time per step
  - [ ] Troubleshooting section
- [ ] Create config generator script `/scripts/generate-client-config.js`
  - [ ] Accept form responses as input
  - [ ] Generate JSON config file
  - [ ] Validate with Zod schema
- [ ] Deploy a test client
  - [ ] Follow deployment guide
  - [ ] Time each step
  - [ ] Document pain points
  - [ ] Refine documentation
- [ ] Create `/docs/guides/CLIENT-CUSTOMIZATION.md`
  - [ ] What can be customized
  - [ ] How to update content
  - [ ] Image requirements
  - [ ] Color scheme changes

**Validation:**
- [ ] Can deploy test client in <30 minutes
- [ ] Test client completely isolated from showcase
- [ ] Documentation clear enough for non-technical person
- [ ] No steps missed in guide
- [ ] Process is repeatable

---

## ⏳ PHASE 11: CLIENT REGISTRY (1 hour)

- [ ] Create `/config/client-registry.json`
  ```json
  {
    "clients": [],
    "totalClients": 0,
    "totalMonthlyRevenue": 0,
    "totalMonthlyCost": 0,
    "totalProfit": 0
  }
  ```
- [ ] Create TypeScript interface for registry
- [ ] Document update process
- [ ] Create simple dashboard view (optional)
  - [ ] List all clients
  - [ ] Show deployment status
  - [ ] Calculate total revenue/profit
- [ ] Add first entry (demo-client)

**Validation:**
- [ ] Registry tracks all important client info
- [ ] Easy to add new clients
- [ ] Can calculate total revenue/profit
- [ ] Version controlled with Git

---

## 🎯 POST-LAUNCH TASKS

### After First Client
- [ ] Create welcome email template
- [ ] Create 48-hour follow-up email template
- [ ] Set up billing system (manual or Stripe)
- [ ] Create client onboarding Google Form

### After 5 Clients
- [ ] Build Google Form → JSON config automation
- [ ] Build Supabase table creation script
- [ ] Build deployment script (semi-automated)
- [ ] Time savings analysis

### After 20 Clients
- [ ] Build CLI deployment tool
- [ ] API integrations (Supabase, Twilio, Vercel)
- [ ] Central admin dashboard
- [ ] Client portal (view leads)
- [ ] Automated billing via Stripe

---

## 📊 PROGRESS TRACKER

**Overall Progress:** 18% (Phase 0 Complete)

| Phase | Status | Progress | Time Spent | Time Remaining |
|-------|--------|----------|------------|----------------|
| 0 - Foundation | ✅ Complete | 100% | 2h | 0h |
| 1 - Next.js Setup | ⏳ Pending | 0% | 0h | 1h |
| 2 - Config System | ⏳ Pending | 0% | 0h | 1h |
| 3 - UI Components | ⏳ Pending | 0% | 0h | 2h |
| 4 - Sections | ⏳ Pending | 0% | 0h | 4h |
| 5 - Database | ⏳ Pending | 0% | 0h | 1h |
| 6 - API Routes | ⏳ Pending | 0% | 0h | 3h |
| 7 - Lead Form | ⏳ Pending | 0% | 0h | 2h |
| 8 - Testing | ⏳ Pending | 0% | 0h | 1h |
| 9 - Deploy Showcase | ⏳ Pending | 0% | 0h | 2h |
| 10 - Replication | ⏳ Pending | 0% | 0h | 2h |
| 11 - Registry | ⏳ Pending | 0% | 0h | 1h |
| **TOTAL** | **In Progress** | **18%** | **2h** | **20h** |

---

## 🚀 NEXT IMMEDIATE ACTIONS

1. ✅ Create GitHub repository
2. ✅ Push Phase 0 files to GitHub
3. ✅ Create DEPLOYMENT-GUIDE.md
4. ✅ Create client-registry.json template
5. ➡️ **START PHASE 1:** Initialize Next.js project

---

**Last Updated:** January 2025
**Status:** Phase 0 Complete - Ready for Phase 1
