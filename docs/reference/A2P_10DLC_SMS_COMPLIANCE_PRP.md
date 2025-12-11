# PRP: A2P 10DLC SMS Compliance Integration - nevermisslead.com
**Project:** nevermisslead.com SMS Campaign Setup  
**Objective:** Integrate Twilio A2P 10DLC-compliant SMS opt-in + privacy policy into signup flow  
**Status:** Ready for Claude Code Execution  
**Created:** November 10, 2025

---

## ✅ Questions Answered

1. **Tech Stack:** Next.js + TypeScript + Tailwind ✓
2. **SMS Auto-replies:** Existing Twilio account ✓
3. **Database:** Supabase ✓
4. **Email service:** Proton Mail → support@cherysolutions.com ✓
5. **Twilio number:** Already purchased ✓

---

## 📋 User Stories

### US1: Privacy Policy Deployment
**As a** nevermisslead.com owner  
**I want** a complete privacy policy on the website  
**So that** Twilio A2P 10DLC registration approves our campaign without rejection

**Acceptance Criteria:**
- Privacy policy accessible at `/privacy` route
- Contains all 8 required sections (mobile data non-sharing, data use, SMS charges, opt-out, help, compliance, security, contact)
- Linked from signup form checkbox
- Mobile responsive
- Renders on all browsers without errors

---

### US2: SMS Opt-In Checkbox Integration
**As a** local service business signing up  
**I want** a clear checkbox to opt into SMS notifications  
**So that** I receive lead confirmations without carrier blocking or Twilio rejecting the campaign

**Acceptance Criteria:**
- Checkbox appears on signup form (unchecked by default)
- Contains: "Message and data rates may apply. Text STOP to opt-out."
- Links to privacy policy
- Form prevents submission without opting in (validation)
- Checkbox state saved to database with timestamp
- Matches Option A copy exactly for Twilio approval

---

### US3: Opt-Out/Help SMS Auto-Replies
**As a** business that opts out of SMS  
**I want** automatic confirmations when I text STOP/HELP  
**So that** I have proof of unsubscription and know how to get help

**Acceptance Criteria:**
- STOP keyword triggers unsubscribe confirmation
- HELP keyword triggers support contact info
- Auto-replies sent within 30 seconds
- Configured in Twilio messaging service
- Responses match copy exactly (NEVERMISSLEAD_SMS_OPTIN_COPY.md)

---

## 🏗️ Technical Design

### Architecture
```
nevermisslead.com Signup Form
    ↓
[Phone Number Input]
    ↓
[SMS Opt-In Checkbox] ← Links to /privacy page
    ↓
[Form Validation] ← Requires checkbox checked
    ↓
[Save to Supabase: phone + opt_in_timestamp + consent_record]
    ↓
[Trigger Email Confirmation Flow (Proton Mail)]
    ↓
[Twilio SMS Auto-Reply: Confirmation + Help Keywords]
```

### Database Schema Addition (Supabase)
```sql
-- Add to users/leads table if not present:
ALTER TABLE users ADD COLUMN IF NOT EXISTS (
  sms_phone_number VARCHAR(15),
  sms_opted_in BOOLEAN DEFAULT FALSE,
  sms_opt_in_timestamp TIMESTAMP,
  sms_opt_in_method VARCHAR(50), -- 'web_form'
  sms_opt_in_ip_address VARCHAR(45),
  sms_consent_record JSON -- Store full consent data for audit
);

-- Create audit log table for compliance
CREATE TABLE IF NOT EXISTS sms_consent_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50), -- 'opted_in', 'opted_out'
  timestamp TIMESTAMP DEFAULT now(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  consent_version VARCHAR(20)
);
```

### Frontend Components

#### 1. Privacy Policy Page
- **File:** `/app/privacy/page.tsx` (Next.js App Router)
- **Content:** Full HTML from NEVERMISSLEAD_PRIVACY_POLICY.md
- **Route:** `GET /privacy`
- **Styling:** Match nevermisslead.com design system

#### 2. SMS Opt-In Checkbox
- **File:** `/components/SMSOptInCheckbox.tsx` (React)
- **Location:** Signup form, below phone number input
- **Behavior:**
  - Uncontrolled checkbox (unchecked by default)
  - Form validation: prevent submit if unchecked
  - On change: capture state + IP address
  - Link text: opens privacy policy in new tab
- **Copy:** Use Option A from NEVERMISSLEAD_SMS_OPTIN_COPY.md

#### 3. Form Validation
- **Validation Rule:** `sms_opt_in === true` OR show error: "Please opt in to SMS to receive lead notifications"
- **Implementation:** Add to existing form validation logic

#### 4. Twilio Webhook Handler
- **File:** `/app/api/twilio/incoming-sms/route.ts`
- **Purpose:** Handle incoming SMS (STOP, HELP, CONFIRM keywords)
- **Response:** Auto-reply messages via TwiML

---

## 🔧 Implementation Steps

### Step 1: Deploy Privacy Policy Page
**Time:** 10 min  
**Tasks:**
1. Create `/app/privacy/page.tsx` (Next.js App Router)
2. Copy content from NEVERMISSLEAD_PRIVACY_POLICY.md
3. Add styling to match nevermisslead.com design system (Tailwind)
4. Test rendering on mobile + desktop
5. Verify all links work (esp. privacy policy internal link)

**Definition of Done:**
- [ ] Privacy page renders without errors
- [ ] Mobile responsive (tested on iPhone 12, Pixel 6)
- [ ] All text is readable
- [ ] Links work and don't have 404s

---

### Step 2: Create SMS Opt-In Checkbox Component
**Time:** 15 min  
**Tasks:**
1. Create `/components/SMSOptInCheckbox.tsx` (React component)
2. Import checkbox from existing UI library (shadcn/ui, etc.)
3. Add label with exact copy from Option A
4. Link "Privacy Policy" text to `/privacy`
5. Export component for reuse

**Definition of Done:**
- [ ] Component renders without errors
- [ ] Checkbox is unchecked by default
- [ ] Privacy Policy link opens `/privacy` in new tab
- [ ] Copy matches exactly (word-for-word)

---

### Step 3: Integrate into Signup Form
**Time:** 15 min  
**Tasks:**
1. Import SMSOptInCheckbox component into signup form
2. Position below phone number field
3. Bind checkbox value to form state (e.g., `sms_opted_in`)
4. Add form validation: require checkbox = true
5. Show validation error if unchecked at submit
6. Capture IP address + user agent on submit

**Definition of Done:**
- [ ] Checkbox appears in correct location on signup form
- [ ] Form prevents submit without checking checkbox
- [ ] Error message appears if unchecked: "Please opt in to SMS..."
- [ ] Form data includes: phone, sms_opted_in, timestamp, ip_address, user_agent

---

### Step 4: Save Consent Record to Supabase
**Time:** 15 min  
**Tasks:**
1. Add SMS consent fields to Supabase schema (see schema above)
2. On form submit, insert/update record:
   - `sms_opted_in = true`
   - `sms_opt_in_timestamp = now()`
   - `sms_opt_in_method = 'web_form'`
   - `sms_opt_in_ip_address = req.ip`
3. Insert audit log record with full consent details
4. Test database insert (verify data saves correctly)

**Definition of Done:**
- [ ] User data saves to Supabase with sms_opted_in = true
- [ ] Timestamp is accurate (seconds, not days)
- [ ] IP address captured (for Twilio compliance audit)
- [ ] Audit log entry created

---

### Step 5: Set Up Twilio SMS Auto-Replies
**Time:** 20 min  
**Tasks:**
1. Go to Twilio Console → Messaging → Services → Your Service
2. Add Incoming Message Handler (webhook)
3. Create endpoint: `POST /app/api/twilio/incoming-sms/route.ts`
4. Parse incoming message keyword (STOP, HELP, CONFIRM)
5. Handle each keyword:
   - **STOP:** Update Supabase (`sms_opted_in = false`), send confirmation SMS
   - **HELP:** Send help info SMS
   - **CONFIRM:** Update Supabase (`sms_opted_in = true`), send welcome SMS
6. Return TwiML response with auto-reply message
7. Test with actual SMS (send text to Twilio number from phone)

**Definition of Done:**
- [ ] Webhook endpoint receives incoming SMS correctly
- [ ] STOP keyword triggers opt-out + confirmation
- [ ] HELP keyword triggers support response
- [ ] CONFIRM keyword triggers welcome message
- [ ] Auto-replies sent within 30 seconds
- [ ] Supabase updated correctly on each action

---

### Step 6: Email Confirmation Flow (Optional Enhancement)
**Time:** 15 min  
**Tasks:**
1. Create email template from NEVERMISSLEAD_SMS_OPTIN_COPY.md (Email Confirmation section)
2. On signup form submit: send confirmation email
3. Email includes SMS confirmation link
4. Link in email triggers opt-in verification (webhook)
5. Optional: Send email + SMS confirmation together

**Definition of Done:**
- [ ] Confirmation email sends on signup
- [ ] Email contains opt-in verification link
- [ ] Link works and updates database

---

## ✅ Testing Plan

### Unit Tests
- [ ] SMSOptInCheckbox renders unchecked by default
- [ ] Privacy policy page renders without 404s
- [ ] Form validation rejects submit without opt-in checkbox
- [ ] Consent record saves to Supabase with correct fields

### Integration Tests
- [ ] Signup form → Supabase → Twilio sync works
- [ ] Incoming SMS (STOP) → opt-out in Supabase → auto-reply sent
- [ ] Incoming SMS (HELP) → support message sent
- [ ] Email confirmation → link verification → Supabase update

### E2E Tests (Manual)
- [ ] Sign up without checking SMS box → form rejects
- [ ] Sign up with SMS box checked → data saves to Supabase
- [ ] Send SMS "STOP" from real phone → receive opt-out confirmation
- [ ] Send SMS "HELP" from real phone → receive help info
- [ ] Privacy policy page loads on mobile + desktop

### Compliance Verification
- [ ] Privacy policy contains all 8 required sections
- [ ] Opt-in checkbox copy matches Twilio requirements exactly
- [ ] Opt-out method documented (STOP keyword)
- [ ] Data non-sharing clause is explicit

---

## 🚀 Deployment Steps

### Pre-Deployment Checklist
- [ ] All code tested locally (no console errors)
- [ ] Privacy policy page 100% functional
- [ ] Signup form validation working
- [ ] Supabase schema migrations applied
- [ ] Twilio webhook endpoint configured
- [ ] SMS auto-replies tested with real texts

### Production Deployment
1. Merge PR to main/production branch
2. Run Supabase migrations (add SMS consent fields)
3. Deploy to Vercel
4. Verify `/privacy` page is live
5. Test signup form end-to-end
6. Test Twilio SMS auto-replies
7. Monitor logs for errors

### Post-Deployment
- [ ] Monitor SMS opt-in rate (% of signups checking box)
- [ ] Track STOP/HELP keyword responses
- [ ] Verify Supabase audit logs are recording
- [ ] Check Twilio logs for failed SMS

---

## 📄 Deliverables

- **Privacy Policy Page:** `GET /privacy` (live URL)
- **Updated Signup Form:** SMS opt-in checkbox + validation
- **Supabase Schema:** SMS consent fields added
- **Twilio Webhook:** `/app/api/twilio/incoming-sms/route.ts` (live endpoint)
- **Auto-Reply Responses:** STOP, HELP, CONFIRM handled
- **Compliance Report:** Privacy policy + opt-in copy verified against A2P 10DLC requirements

---

## 🔐 Security & Compliance Notes

### Data Protection
- SMS phone numbers stored encrypted at rest (Supabase encryption)
- Consent records include audit trail (IP, timestamp, user agent)
- GDPR-ready: data retention policy (90 days after opt-out)
- No third-party data sharing (enforced in privacy policy)

### Twilio Compliance
- Explicit opt-in consent (checkbox required)
- Message rates disclosure ("Message and data rates may apply")
- Opt-out method documented (text STOP)
- Privacy policy accessible and linked
- Audit trail maintained for carrier review

---

## ⏱️ Time Estimate

- **Total Implementation:** 1.5 - 2 hours (including testing)
- **Privacy Page:** 10 min
- **Checkbox Component:** 15 min
- **Form Integration:** 15 min
- **Supabase Setup:** 15 min
- **Twilio Webhooks:** 20 min
- **Email Flow (optional):** 15 min
- **Testing:** 20-30 min

---

## 📞 Contact Info (Updated)

**Support & Help:**
- **Email:** support@cherysolutions.com
- **Phone:** (678) 788-7281
- **Business:** Chery Solutions LLC, Atlanta, GA

---

*PRP ready for Claude Code execution. See CLAUDE_CODE_PROMPT.md for implementation instructions.*
