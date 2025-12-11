# 🚀 NEVERMISSLEAD CLIENT ONBOARDING CHECKLIST
**Goal: Client site live in <30 minutes from signup to deployment**

---

## 📊 OVERVIEW

### Onboarding Timeline (30 Minutes Total)
- **Pre-Work (before client signup):** 5 min - Collect client information via Google Form
- **Phase 1 - Database Setup:** 3 min
- **Phase 2 - Config Generation:** 8 min
- **Phase 3 - Twilio Setup:** 3 min (defer webhook config)
- **Phase 4 - Vercel Deployment:** 5 min
- **Phase 5 - DNS Configuration:** 2 min (client does this)
- **Phase 6 - Twilio Webhook Config:** 2 min (after deployment)
- **Phase 7 - Testing:** 5 min
- **Phase 8 - Client Delivery:** 2 min

### Prerequisites
- ✅ Google Form for client intake (CLIENT_INTAKE_FORM.md)
- ✅ Supabase account with shared database configured
- ✅ Twilio account with API credentials
- ✅ Vercel account
- ✅ Proton Mail SMTP configured (support@cherysolutions.com)
- ✅ PROJECT_SECRETS_REFERENCE.txt file with all credentials

---

## 📋 PHASE 0: PRE-WORK (Before Client Signs Up)
**Time: 5 minutes**

### ☐ Step 0.1: Send Google Form to Client
- [ ] Send Google Form link to client for intake information
- [ ] Form includes:
  - Business name, phone, email, address
  - Industry type (HVAC, Plumbing, Electrical, etc.)
  - Service descriptions (8 services)
  - Service areas (cities/counties)
  - Business hours
  - FAQ questions/answers (5-10)
  - Logo upload
  - Preferred colors (or industry defaults)
  - SMS auto-response message
- [ ] **Time: 2 min** (for you to send form)
- [ ] **Time: 15-20 min** (for client to complete - happens async)

### ☐ Step 0.2: Review Form Responses
- [ ] Check that Google Form response has all required fields
- [ ] Download uploaded logo file
- [ ] Note any missing information to follow up
- [ ] **Time: 3 min**

**✅ Pre-Work Complete** → Proceed to Phase 1

---

## 🗄️ PHASE 1: SUPABASE DATABASE SETUP
**Time: 3 minutes**

### ☐ Step 1.1: Generate Client ID
- [ ] Open Supabase project: https://app.supabase.com/project/xgfkhrxabdkjkzduvqnu
- [ ] Navigate to Table Editor → `clients` table
- [ ] Click "Insert" → "Insert row"
- [ ] Fill in client details:
  ```sql
  slug: "client-slug"               # Lowercase, no spaces (e.g., "atlanta-plumbing")
  business_name: "Business Name"
  phone: "(xxx) xxx-xxxx"           # From Google Form
  email: "info@clientbusiness.com"  # From Google Form
  status: "trial"                   # or "active"
  monthly_price: 297.00
  setup_fee: 497.00                 # or 0.00 if waived
  ```
- [ ] Click "Save" → Copy the generated `id` (UUID)
- [ ] **Time: 2 min**

### ☐ Step 1.2: Update Client Registry (Optional)
- [ ] Open `/config/client-registry.json`
- [ ] Add new client entry:
  ```json
  {
    "slug": "client-slug",
    "clientId": "uuid-from-step-1.1",
    "businessName": "Business Name",
    "enabled": true,
    "deployedAt": null
  }
  ```
- [ ] Save file
- [ ] **Time: 1 min**

**✅ Database Setup Complete** → Client ID generated and saved

---

## 📝 PHASE 2: CONFIG FILE GENERATION
**Time: 8 minutes**

### ☐ Step 2.1: Create Client Config Directory
- [ ] Navigate to project root
- [ ] Run:
  ```bash
  cd /path/to/nevermisslead-template
  mkdir -p config/clients
  mkdir -p public/assets/[client-slug]
  ```
- [ ] **Time: 30 sec**

### ☐ Step 2.2: Generate Config File (Manual)
- [ ] Copy `config/config.template.json` → `config/clients/[client-slug].json`
- [ ] Fill in all fields using Google Form responses:
  - [ ] `slug`: client-slug
  - [ ] `clientId`: UUID from Phase 1
  - [ ] `businessInfo`: Name, phone, email, address, hours
  - [ ] `hero`: Headline, subheadline, CTAs
  - [ ] `trustBadges`: 4-5 badges
  - [ ] `about`: Company story, features
  - [ ] `services`: 8 services (title, icon, description)
  - [ ] `faq`: 5-10 questions/answers
  - [ ] `serviceAreas`: Cities and counties
  - [ ] `businessHours`: Weekly schedule
  - [ ] `socialProof`: Testimonials (if provided)
  - [ ] `sms.autoResponse`: SMS message
  - [ ] `branding.colors`: Primary, secondary, accent
  - [ ] `seo`: Page title, meta description, keywords
- [ ] **Time: 5 min** (manual fill-in)

**OR** use automation script (if available):
```bash
node scripts/generate-config.js --form-response=path/to/response.json --output=config/clients/[slug].json
```
- [ ] **Time: 1 min** (automated)

### ☐ Step 2.3: Upload Client Assets
- [ ] Save client logo to `/public/assets/[client-slug]/logo.png`
- [ ] Optimize logo (< 100KB, transparent PNG)
- [ ] Find/select hero background image:
  - Option A: Use Unsplash.com (search "[industry] worker")
  - Option B: Use client-provided image
- [ ] Update `hero.backgroundImage` in config file
- [ ] **Time: 2 min**

### ☐ Step 2.4: Validate Config File
- [ ] Run validation:
  ```bash
  npm run validate-config -- config/clients/[client-slug].json
  ```
- [ ] Fix any validation errors
- [ ] **Time: 30 sec**

**✅ Config File Complete** → Ready for deployment

---

## 📞 PHASE 3: TWILIO PHONE NUMBER SETUP
**Time: 3 minutes**

### ☐ Step 3.1: Purchase Twilio Phone Number
- [ ] Log in to Twilio Console: https://console.twilio.com
- [ ] Navigate to: Phone Numbers → Manage → Buy a number
- [ ] Search for number:
  - [ ] Country: United States
  - [ ] Area code: Client's preferred area code (from form)
  - [ ] Capabilities: ✅ Voice ✅ SMS ✅ MMS
- [ ] Click "Buy" on desired number
- [ ] **Cost: $2.75/month**
- [ ] **Time: 1 min**

### ☐ Step 3.2: Save Phone Number
- [ ] Copy purchased number (format: +1xxxxxxxxxx)
- [ ] Update Supabase `clients` table:
  ```sql
  UPDATE clients
  SET twilio_phone_number = '+1xxxxxxxxxx'
  WHERE id = 'client-uuid';
  ```
- [ ] Save to PROJECT_SECRETS_REFERENCE.txt
- [ ] **Time: 1 min**

### ☐ Step 3.3: Defer Webhook Configuration
- [ ] **DO NOT configure webhooks yet** (need deployed URL first)
- [ ] Add reminder to configure webhooks in Phase 6
- [ ] **Time: Skipped** (done after deployment)

**✅ Twilio Number Purchased** → Webhooks will be configured after deployment

---

## 🚀 PHASE 4: VERCEL DEPLOYMENT
**Time: 5 minutes**

### ☐ Step 4.1: Commit Config Changes to Git
- [ ] Stage changes:
  ```bash
  git add config/clients/[client-slug].json
  git add public/assets/[client-slug]/
  git add config/client-registry.json  # if updated
  ```
- [ ] Commit:
  ```bash
  git commit -m "Add [Client Name] configuration"
  ```
- [ ] Push to GitHub:
  ```bash
  git push origin main
  ```
- [ ] **Time: 1 min**

### ☐ Step 4.2: Create New Vercel Project
**Option A: Via Vercel Dashboard (Recommended for first-time)**
- [ ] Go to: https://vercel.com/new
- [ ] Click "Import Git Repository"
- [ ] Select: `nevermisslead-template` repository
- [ ] Project Name: `client-slug` (or custom domain name)
- [ ] Framework Preset: Next.js
- [ ] Root Directory: `./` (leave default)
- [ ] **Time: 1 min**

**Option B: Via Vercel CLI (Faster for experienced users)**
```bash
vercel --name client-slug
```

### ☐ Step 4.3: Configure Environment Variables
- [ ] In Vercel project settings → Environment Variables
- [ ] Add ALL variables from `.env.template`:
  ```
  # Supabase (same for all clients)
  NEXT_PUBLIC_SUPABASE_URL=https://xgfkhrxabdkjkzduvqnu.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

  # Twilio (same account, different number per client)
  TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
  TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
  TWILIO_PHONE_NUMBER=+1xxxxxxxxxx  # From Phase 3

  # Email (same for all clients)
  SMTP_HOST=smtp.protonmail.com
  SMTP_PORT=587
  SMTP_USER=support@cherysolutions.com
  SMTP_PASS=xxxxxxxxxx
  NOTIFICATION_EMAIL=support@cherysolutions.com

  # Client-specific
  CLIENT_SLUG=client-slug  # CRITICAL: Must match config filename
  NEXT_PUBLIC_APP_URL=https://clientdomain.com  # Or subdomain

  # Feature toggles
  ENABLE_EMAIL_NOTIFICATIONS=true
  ENABLE_SMS_NOTIFICATIONS=false  # Enable after A2P 10DLC approval
  ```
- [ ] Apply to all environments (Production, Preview, Development)
- [ ] **Time: 2 min**

### ☐ Step 4.4: Deploy
- [ ] Click "Deploy" in Vercel dashboard
- [ ] Wait for build to complete (~2 min)
- [ ] Copy deployment URL: `https://client-slug.vercel.app`
- [ ] Test URL to verify site loads
- [ ] **Time: 3 min** (includes build time)

**✅ Site Deployed** → Now available at Vercel URL

---

## 🌐 PHASE 5: CUSTOM DOMAIN SETUP
**Time: 2-5 minutes (mostly client work)**

### ☐ Step 5.1: Add Domain to Vercel
- [ ] In Vercel project → Settings → Domains
- [ ] Click "Add"
- [ ] Enter client's domain: `clientdomain.com`
- [ ] Click "Add"
- [ ] Vercel will show DNS records needed
- [ ] **Time: 1 min**

### ☐ Step 5.2: Configure DNS (Client Does This)
- [ ] Send DNS instructions to client (DOMAIN_SETUP_GUIDE.md)
- [ ] Client needs to add:
  ```
  Type: A
  Name: @
  Value: 76.76.19.19

  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```
- [ ] **Time: 1-30 min** (depends on client's registrar access)
- [ ] **Time: 5-30 min** (DNS propagation)

### ☐ Step 5.3: Verify Domain
- [ ] Once client adds DNS records, wait for propagation
- [ ] Vercel will auto-verify and issue SSL certificate
- [ ] Test: https://clientdomain.com (should load with SSL)
- [ ] **Time: Wait for DNS** (can proceed to Phase 6 while waiting)

**⏳ DNS Propagation in Progress** → Continue to Phase 6

---

## 🔗 PHASE 6: TWILIO WEBHOOK CONFIGURATION
**Time: 2 minutes**

**IMPORTANT: Only do this AFTER Vercel deployment is live**

### ☐ Step 6.1: Configure Voice Webhook
- [ ] Log in to Twilio Console: https://console.twilio.com
- [ ] Navigate to: Phone Numbers → Manage → Active numbers
- [ ] Click on the client's purchased number
- [ ] Scroll to "Voice Configuration"
- [ ] Configure As: Webhook
- [ ] A Call Comes In:
  - [ ] Webhook: `https://clientdomain.com/api/twilio/voice`
  - [ ] HTTP: POST
- [ ] **Time: 1 min**

### ☐ Step 6.2: Configure SMS Webhook
- [ ] In same number configuration page
- [ ] Scroll to "Messaging Configuration"
- [ ] A Message Comes In:
  - [ ] Webhook: `https://clientdomain.com/api/twilio/sms`
  - [ ] HTTP: POST
- [ ] **Time: 30 sec**

### ☐ Step 6.3: Configure Status Callback
- [ ] In same number configuration page
- [ ] Scroll to "Voice Configuration"
- [ ] Status Callback URL:
  - [ ] Webhook: `https://clientdomain.com/api/twilio/status`
  - [ ] HTTP: POST
- [ ] Click "Save"
- [ ] **Time: 30 sec**

**✅ Twilio Webhooks Configured** → Call/SMS tracking now active

---

## ✅ PHASE 7: TESTING & VALIDATION
**Time: 5 minutes**

### ☐ Step 7.1: Test Form Submission
- [ ] Visit: https://clientdomain.com
- [ ] Fill out hero lead form:
  - [ ] Full Name: "Test User"
  - [ ] Phone: Your test number
  - [ ] Message: "Test lead from onboarding"
  - [ ] ✅ SMS opt-in checkbox
- [ ] Click "Get Free Quote" or "Submit"
- [ ] **Expected Result**: Form submits successfully
- [ ] **Time: 1 min**

### ☐ Step 7.2: Verify Lead in Database
- [ ] Open Supabase → Table Editor → `leads` table
- [ ] Filter by client_id: [client-uuid]
- [ ] **Expected Result**: New lead record exists
- [ ] Verify fields: name, phone, message, sms_opted_in
- [ ] **Time: 1 min**

### ☐ Step 7.3: Verify Email Notification
- [ ] Check support@cherysolutions.com inbox
- [ ] **Expected Result**: Email received with subject "New Lead: [Business Name]"
- [ ] Email should include:
  - [ ] Customer name, phone, message
  - [ ] Lead source (website form)
  - [ ] Timestamp
- [ ] **Time: 1 min**

### ☐ Step 7.4: Test Call Tracking
- [ ] Call the client's Twilio number: +1xxxxxxxxxx
- [ ] **Expected Result**: Voicemail greeting plays
- [ ] Leave test voicemail
- [ ] Check Supabase `call_logs` table
- [ ] **Expected Result**: New call record exists
- [ ] **Time: 1 min**

### ☐ Step 7.5: Test SMS Auto-Response
- [ ] Text the client's Twilio number: +1xxxxxxxxxx
- [ ] Message: "Test SMS"
- [ ] **Expected Result**: Auto-response received
- [ ] Check Supabase `sms_logs` table
- [ ] **Expected Result**: 2 SMS records (inbound + outbound)
- [ ] **Time: 1 min**

### ☐ Step 7.6: Mobile Responsive Check
- [ ] Open site on mobile device (or Chrome DevTools mobile view)
- [ ] Check: Navigation, hero, forms, CTAs, footer
- [ ] **Expected Result**: All elements display correctly
- [ ] **Time: 1 min** (skip if tight on time)

**✅ All Tests Passing** → Site is production-ready

---

## 📧 PHASE 8: CLIENT DELIVERY
**Time: 2 minutes**

### ☐ Step 8.1: Send Welcome Email
- [ ] Email client with:
  ```
  Subject: Your NeverMissLead Website is Live! 🚀

  Hi [Client Name],

  Great news! Your new lead generation website is now live:
  🌐 https://clientdomain.com

  📞 Your tracking number: (xxx) xxx-xxxx
  ✅ Email notifications: Enabled (leads go to support@cherysolutions.com)
  📱 SMS auto-response: Enabled

  NEXT STEPS:
  1. Visit your site and test the contact form
  2. Call/text your tracking number to test
  3. Share your new website with customers!

  WHAT'S INCLUDED:
  - Professional website with your branding
  - Call tracking & voicemail recording
  - SMS auto-response
  - Email notifications for every lead
  - 1 hour/month of updates included
  - 24/7 uptime monitoring

  NEED CHANGES?
  Reply to this email with any updates (hours, services, contact info, etc.)
  - First hour of changes: FREE (included in monthly subscription)
  - Additional changes: $60/hour

  BILLING:
  - Setup fee: $497 (or waived with 6-month commitment)
  - Monthly subscription: $297/month
  - Next invoice: [Date]

  Questions? Reply to this email or call (xxx) xxx-xxxx.

  Welcome to NeverMissLead!

  [Your Name]
  CherySolutions
  ```
- [ ] Attach: Quick Start Guide (optional)
- [ ] **Time: 2 min**

### ☐ Step 8.2: Update Client Status
- [ ] Update Supabase `clients` table:
  ```sql
  UPDATE clients
  SET status = 'active',
      custom_domain = 'clientdomain.com',
      deployed_at = NOW()
  WHERE id = 'client-uuid';
  ```
- [ ] Update `config/client-registry.json`:
  ```json
  {
    "deployedAt": "2025-11-22T10:30:00Z",
    "productionUrl": "https://clientdomain.com"
  }
  ```
- [ ] **Time: 1 min**

### ☐ Step 8.3: Schedule Follow-Up
- [ ] Add calendar reminder: 48 hours from now
- [ ] Follow-up tasks:
  - [ ] Check if client received any leads
  - [ ] Ask if they need any changes
  - [ ] Request testimonial/referral (if happy)
- [ ] **Time: 1 min**

**✅ Client Onboarding Complete!** 🎉

---

## 📊 TIME TRACKING SUMMARY

| Phase | Task | Time Estimate | Running Total |
|-------|------|---------------|---------------|
| 0 | Send Google Form | 2 min | 2 min |
| 0 | Review form responses | 3 min | 5 min |
| 1 | Create Supabase client record | 2 min | 7 min |
| 1 | Update client registry | 1 min | 8 min |
| 2 | Create config directory | 0.5 min | 8.5 min |
| 2 | Generate config file (manual) | 5 min | 13.5 min |
| 2 | Upload client assets | 2 min | 15.5 min |
| 2 | Validate config | 0.5 min | 16 min |
| 3 | Purchase Twilio number | 1 min | 17 min |
| 3 | Save phone number | 1 min | 18 min |
| 4 | Commit changes to Git | 1 min | 19 min |
| 4 | Create Vercel project | 1 min | 20 min |
| 4 | Configure environment variables | 2 min | 22 min |
| 4 | Deploy (includes build time) | 3 min | 25 min |
| 5 | Add domain to Vercel | 1 min | 26 min |
| 6 | Configure Twilio voice webhook | 1 min | 27 min |
| 6 | Configure Twilio SMS webhook | 0.5 min | 27.5 min |
| 6 | Configure status callback | 0.5 min | 28 min |
| 7 | Test form submission | 1 min | 29 min |
| 7 | Verify lead in database | 1 min | 30 min |
| 7 | Verify email notification | 1 min | 31 min |
| 7 | Test call tracking | 1 min | 32 min |
| 7 | Test SMS auto-response | 1 min | 33 min |
| 8 | Send welcome email | 2 min | 35 min |
| 8 | Update client status | 1 min | 36 min |

**Total Time: ~36 minutes** (can be reduced to 30 min with automation scripts)

---

## 🔧 OPTIMIZATION TIPS

### How to Get Under 30 Minutes

1. **Use Automation Scripts** (saves 5 min)
   - `generate-config.js` → Auto-generates config from Google Form CSV
   - `setup-supabase-client.js` → Auto-creates database record
   - `deploy-to-vercel.sh` → Automated deployment

2. **Pre-fill Templates** (saves 2 min)
   - Have industry-specific config templates ready
   - Pre-select hero images for common industries
   - Default color schemes by industry

3. **Batch Similar Tasks** (saves 2 min)
   - Create multiple client configs at once
   - Deploy multiple clients in single session
   - Configure multiple Twilio numbers together

4. **Use Subdomain Instead of Custom Domain** (saves 5 min)
   - Deploy to: `client-slug.nevermisslead.com`
   - No DNS configuration needed
   - Instant SSL certificate
   - Offer custom domain as optional upgrade

---

## 🚨 COMMON GOTCHAS & TROUBLESHOOTING

### Issue: Form submission fails with 500 error
**Solution**: Check Vercel environment variables - ensure CLIENT_SLUG matches config filename exactly

### Issue: Email notifications not sending
**Solution**:
1. Check SMTP credentials in Vercel
2. Verify `ENABLE_EMAIL_NOTIFICATIONS=true`
3. Check Proton Mail account is not locked

### Issue: Twilio webhooks not working
**Solution**:
1. Verify webhooks are configured AFTER deployment
2. Check webhook URLs use HTTPS (not HTTP)
3. Ensure URLs don't have trailing slashes

### Issue: DNS not propagating
**Solution**:
1. Wait 5-30 minutes for DNS propagation
2. Use `dig clientdomain.com` to check DNS records
3. Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)

### Issue: Build fails on Vercel
**Solution**:
1. Check for TypeScript errors locally: `npm run build`
2. Verify all required files are committed to Git
3. Check Vercel build logs for specific error

---

## ✅ POST-LAUNCH CHECKLIST (48 Hours Later)

- [ ] Check if client received any leads
- [ ] Verify email notifications are working
- [ ] Ask client for feedback
- [ ] Request any changes or updates
- [ ] Ask for testimonial (if client is happy)
- [ ] Request referrals to other contractors
- [ ] Send invoice for setup fee + first month

---

## 📚 RELATED DOCUMENTATION

- **CLIENT_INTAKE_FORM.md** - Google Form questions template
- **TWILIO_SETUP_GUIDE.md** - Detailed Twilio configuration
- **SUPABASE_CLIENT_SETUP.md** - Database setup instructions
- **DOMAIN_SETUP_GUIDE.md** - DNS configuration guide
- **TESTING_CHECKLIST.md** - Comprehensive testing guide
- **TROUBLESHOOTING.md** - Common issues and solutions

---

**Last Updated**: November 22, 2025
**Target Time**: <30 minutes from signup to deployment
**Success Rate**: Aim for 95%+ first-time deployment success
