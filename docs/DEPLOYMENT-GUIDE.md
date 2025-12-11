# DEPLOYMENT GUIDE - New Client Setup

**Time Estimate:** 25-30 minutes per client
**Difficulty:** Intermediate
**Prerequisites:** Supabase, Twilio, and Vercel accounts

---

## PREREQUISITES CHECKLIST

Before starting, ensure you have:

- [ ] Client onboarding form completed (50 questions)
- [ ] All photos and logo files downloaded
- [ ] Supabase account (https://supabase.com)
- [ ] Twilio account (https://twilio.com)
- [ ] Vercel account (https://vercel.com)
- [ ] GitHub repository with template
- [ ] Client's domain registered (or will use subdomain)

---

## STEP 1: CREATE SUPABASE PROJECT (5 minutes)

### 1.1 Create New Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name:** `[client-slug]-website` (e.g., `atlanta-hvac-website`)
   - **Database Password:** Generate strong password (**SAVE THIS!**)
   - **Region:** Choose closest to client (e.g., `East US (North Virginia)`)
   - **Pricing Plan:** Free tier initially (upgrade to Pro at $25/month when ready)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### 1.2 Save Connection Details

Once project is ready:

1. Go to **Project Settings → API**
2. Copy and save to `PROJECT_SECRETS_REFERENCE.txt`:

```
Client: [Business Name]
Supabase Project: [client-slug]-website
Supabase URL: https://xxxxx.supabase.co
Supabase Anon Key: eyJhbGc...
Supabase Service Role Key: eyJhbGc...
Database Password: [from step 1.1]
```

### 1.3 Create Database Tables

1. Go to **SQL Editor**
2. Click **"New query"**
3. Copy/paste the contents of `/sql/schema.sql`
4. Click **"Run"**
5. Verify tables created: Go to **Table Editor** → Should see 3 tables

### 1.4 Test Database Connection

1. Go to **Table Editor → leads**
2. Click **"Insert row"**
3. Add test data:
   - `full_name`: "Test Lead"
   - `phone`: "555-555-5555"
   - `message`: "Test message"
4. Click **"Save"**
5. Verify row appears
6. Delete test row

✅ **Supabase setup complete**

---

## STEP 2: PURCHASE TWILIO NUMBER (5 minutes)

### 2.1 Buy Phone Number

1. Go to https://console.twilio.com
2. Click **Phone Numbers → Buy a number**
3. Search criteria:
   - **Country:** United States
   - **Area Code:** [Client's preferred area code from form]
   - **Capabilities:**
     - ☑ Voice
     - ☑ SMS
     - ☑ MMS
4. Click **Search**
5. Select a number with good digits (avoid hard-to-remember)
6. Click **Buy**
7. Confirm purchase ($2.75/month)

### 2.2 Save Number Details

Copy to `PROJECT_SECRETS_REFERENCE.txt`:

```
Twilio Phone Number: +1 (404) 555-0123
Twilio Number SID: PNxxxxxxxxxxxx
Purchased: [date]
Forwards to: [client's real phone number]
```

### 2.3 Configure Webhooks

**Skip this for now** - we'll come back after Vercel deployment

✅ **Twilio number purchased (configuration pending)**

---

## STEP 3: PREPARE CLIENT FILES (10 minutes)

### 3.1 Create Client Config File

1. Create file: `/config/clients/[client-slug].json`
2. Example: `/config/clients/atlanta-hvac.json`
3. Use `/config/site.config.template.json` as starting point
4. Fill in all sections from onboarding form:
   - Business info
   - Branding (colors, logo path)
   - Hero content
   - About section
   - Services (8 services)
   - Trust badges (5 badges)
   - Process steps (5 steps)
   - FAQs (3-5 questions)
   - Service areas
   - Hours of operation
   - SMS auto-response message
   - Supabase connection details (from Step 1.2)

### 3.2 Upload Client Assets

1. Create folder: `/public/clients/[client-slug]/`
2. Upload files:
   ```
   /public/clients/[client-slug]/
   ├── logo.png
   ├── hero.jpg
   ├── about.jpg
   └── gallery/
       ├── 1.jpg
       ├── 2.jpg
       ├── 3.jpg
       ├── 4.jpg
       ├── 5.jpg
       ├── 6.jpg
       ├── 7.jpg
       └── 8.jpg
   ```

### 3.3 Optimize Images

**Requirements:**
- Logo: <100KB, transparent background (PNG)
- Hero: <500KB, 1920x1080 (JPG)
- About: <300KB, 1200x800 (JPG)
- Gallery: <300KB each, 1200x800 (JPG)

**Tool:** Use https://tinypng.com or ImageOptim

### 3.4 Create Environment Variables File

Create `.env.local` (**DO NOT COMMIT THIS**):

```
# Supabase (from Step 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Twilio (from Step 2)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+14045550123

# Client Config
CLIENT_SLUG=atlanta-hvac

# App URL (update after deployment)
NEXT_PUBLIC_APP_URL=https://atlantahvac.com
```

✅ **Client files prepared**

---

## STEP 4: DEPLOY TO VERCEL (5 minutes)

### 4.1 Commit Changes to Git

```bash
git add .
git commit -m "Add atlanta-hvac client"
git push origin main
```

### 4.2 Create New Vercel Project

**Recommended:** Deploy as separate project for client isolation

1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. **Import Git Repository:**
   - Select your template repo
   - Click **"Import"**
4. **Configure Project:**
   - **Project Name:** `atlanta-hvac-website`
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
5. **Environment Variables:**
   Click "Add" for each variable from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `CLIENT_SLUG`
   - `NEXT_PUBLIC_APP_URL` (use Vercel URL for now)
6. Click **"Deploy"**
7. Wait 2-3 minutes for build

### 4.3 Get Vercel URL

After deployment:
1. Copy the Vercel URL: `https://atlanta-hvac-website.vercel.app`
2. Test it: Open in browser, verify site loads

### 4.4 Configure Custom Domain (if client has one)

1. In Vercel project, go to **Settings → Domains**
2. Click **"Add"**
3. Enter client's domain: `atlantahvac.com`
4. Vercel will show DNS records to configure

✅ **Deployed to Vercel**

---

## STEP 5: CONFIGURE DNS (5 minutes)

### 5.1 Get DNS Records from Vercel

From Step 4.4, copy these records:

**For Root Domain (atlantahvac.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.19.19`

**For WWW Subdomain (www.atlantahvac.com):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### 5.2 Update DNS at Domain Registrar

1. Log into client's domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS settings
3. Add/update records from Step 5.1
4. Save changes

### 5.3 Wait for DNS Propagation

- Takes 5 minutes to 48 hours (usually 15-30 minutes)
- Check status: https://dnschecker.org
- Enter domain: `atlantahvac.com`
- Wait for green checkmarks globally

### 5.4 Verify SSL Certificate

1. Once DNS propagates, Vercel auto-issues SSL
2. Check: `https://atlantahvac.com` should work with padlock icon
3. If SSL pending, wait 10 more minutes

✅ **Domain configured and live**

---

## STEP 6: CONFIGURE TWILIO WEBHOOKS (5 minutes)

### 6.1 Get Webhook URLs

Your site is now live at: `https://atlantahvac.com`

**Webhook URLs:**
- Voice: `https://atlantahvac.com/api/twilio/voice`
- SMS: `https://atlantahvac.com/api/twilio/sms`
- Status: `https://atlantahvac.com/api/twilio/status`

### 6.2 Configure Voice Webhook

1. Go to https://console.twilio.com
2. Click **Phone Numbers → Manage → Active Numbers**
3. Click the number purchased in Step 2
4. Scroll to **Voice Configuration:**
   - **A CALL COMES IN:** Webhook
   - **URL:** `https://atlantahvac.com/api/twilio/voice`
   - **HTTP:** POST
5. Scroll to **Call Status Changes:**
   - **URL:** `https://atlantahvac.com/api/twilio/status`
   - **HTTP:** POST
6. Click **"Save configuration"**

### 6.3 Configure SMS Webhook

1. Same page, scroll to **Messaging Configuration:**
   - **A MESSAGE COMES IN:** Webhook
   - **URL:** `https://atlantahvac.com/api/twilio/sms`
   - **HTTP:** POST
2. Click **"Save configuration"**

### 6.4 Test Twilio Integration

**Test Call:**
1. Call the Twilio tracking number from your phone
2. Should forward to client's real number
3. Check Supabase → `call_logs` table → verify row created

**Test SMS:**
1. Text the Twilio tracking number
2. Should receive auto-response SMS
3. Check Supabase → `sms_logs` table → verify row created

✅ **Twilio configured and working**

---

## STEP 7: FINAL TESTING (5 minutes)

### 7.1 Test Form Submission

1. Go to `https://atlantahvac.com`
2. Fill out the contact form
3. Submit
4. Check Supabase → `leads` table → verify row created

### 7.2 Test All Pages

- [ ] Homepage loads
- [ ] All images display
- [ ] All sections visible
- [ ] Mobile responsive (test on phone)
- [ ] Form submits successfully
- [ ] No console errors (check browser dev tools)

### 7.3 Test Phone/SMS

- [ ] Call tracking number → forwards correctly
- [ ] Text tracking number → auto-response received
- [ ] All logs appear in Supabase

### 7.4 Performance Check

1. Go to https://pagespeed.web.dev
2. Enter: `https://atlantahvac.com`
3. Run test
4. **Target scores:**
   - Performance: 80+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

✅ **All tests passing**

---

## STEP 8: DELIVER TO CLIENT (5 minutes)

### 8.1 Send Client Email

**Subject:** Your Website is Live! 🎉

```
Hi [Client Name],

Great news! Your website is now live at:
https://atlantahvac.com

Your tracking phone number:
(404) 555-0123

This number forwards to your main line: (404) 555-0100

What happens now:
✓ When customers call your tracking number, it forwards to you
✓ If you miss a call, they automatically get a text message
✓ When someone fills out your contact form, their info is saved
✓ All leads are tracked in your dashboard (login info below)

Important Numbers:
- Tracking Number: (404) 555-0123 (use this on ALL marketing)
- Your Real Number: (404) 555-0100 (calls forward here)

Monthly Billing:
- Starts: [date]
- Amount: $297/month
- Payment method: [from form]

Need any changes? Just reply to this email.

Welcome aboard!
```

### 8.2 Update Internal Tracking

Add to `/config/client-registry.json`:
- Client name
- Domain
- Tracking phone number
- Supabase project URL
- Launch date
- Monthly billing date
- Status: Active

### 8.3 Schedule 48-Hour Follow-Up

Set reminder to check in:
- "How's the site working?"
- "Getting any calls/leads?"
- "Need any changes?"

✅ **Client delivered and happy**

---

## TROUBLESHOOTING

### Issue: Vercel build fails

**Solution:**
- Check build logs in Vercel
- Verify all environment variables set
- Check for typos in client config file
- Test build locally: `npm run build`

### Issue: DNS not propagating

**Solution:**
- Wait longer (up to 48 hours max)
- Clear browser cache
- Test on different device/network
- Verify DNS records are correct (dnschecker.org)

### Issue: SSL certificate pending

**Solution:**
- Wait 10-15 minutes after DNS propagates
- Vercel auto-issues SSL, be patient
- If >1 hour, contact Vercel support

### Issue: Twilio calls not forwarding

**Solution:**
- Verify webhook URL is correct
- Check Twilio logs: Console → Monitor → Logs
- Test webhook endpoint manually
- Verify client's real phone number accepts calls

### Issue: Form not submitting

**Solution:**
- Check browser console for errors
- Verify Supabase credentials in Vercel env vars
- Test Supabase connection directly
- Check Supabase table permissions (RLS policies)

### Issue: Images not loading

**Solution:**
- Verify images in `/public/clients/[slug]/` folder
- Check file names match config file exactly
- Optimize large images (<500KB)
- Clear cache and hard refresh

---

## DEPLOYMENT CHECKLIST SUMMARY

For each new client:

**Supabase (5 min):**
- [ ] Create project
- [ ] Run SQL to create tables
- [ ] Save credentials

**Twilio (5 min):**
- [ ] Buy phone number
- [ ] Save number details
- [ ] Configure webhooks (after deployment)

**Files (10 min):**
- [ ] Create config file
- [ ] Upload images
- [ ] Create .env.local

**Deploy (5 min):**
- [ ] Commit to Git
- [ ] Deploy to Vercel
- [ ] Add environment variables

**DNS (5 min):**
- [ ] Configure domain registrar
- [ ] Wait for propagation
- [ ] Verify SSL

**Twilio Setup (5 min):**
- [ ] Add voice webhook
- [ ] Add SMS webhook
- [ ] Test calls and SMS

**Test (5 min):**
- [ ] Form submission
- [ ] Call forwarding
- [ ] SMS auto-response
- [ ] Mobile responsive

**Deliver (5 min):**
- [ ] Email client
- [ ] Update tracking sheet
- [ ] Schedule follow-up

**Total: 30 minutes per client**

---

**Last Updated:** January 2025
**Next Review:** After first client deployment
