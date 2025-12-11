# Claude Code Execution Prompt - nevermisslead.com SMS Compliance

**Ready to Execute: YES**

Copy everything below and paste into Claude Code:

---

You are implementing A2P 10DLC SMS compliance for nevermisslead.com (Next.js production app).

**Tech Stack (FIXED):**
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database: Supabase
- Email: Proton Mail → support@cherysolutions.com
- SMS: Existing Twilio account (number already purchased)

**CRITICAL: Read these reference files first**
- ~NEVERMISSLEAD-template/reference/PRIVACY_POLICY.md
- ~NEVERMISSLEAD-template/reference/SMS_OPTIN_COPY.md
- ~NEVERMISSLEAD-template/reference/COMPLIANCE_PRP.md

**YOUR TASK: Implement 6 sequential steps**

---

## STEP 1: Privacy Policy Page (10 min)
Create `/app/privacy/page.tsx`

Requirements:
- Copy content from ~NEVERMISSLEAD-template/reference/PRIVACY_POLICY.md
- Style with Tailwind CSS to match nevermisslead.com design
- Mobile responsive (test on mobile)
- All links work
- Update email to: support@cherysolutions.com (already done in reference file)

Verification:
- Page renders at /privacy without 404
- No console errors
- Readable on mobile & desktop

---

## STEP 2: SMS Opt-In Checkbox Component (15 min)
Create `/components/SMSOptInCheckbox.tsx`

Requirements:
- React component with TypeScript
- Unchecked by default
- Use exact text from ~/Desktop/NEVERMISSLEAD_SMS_OPTIN_COPY.md (Option A)
- "Privacy Policy" link opens /privacy in new tab
- Export as default

Exact text:
☐ Yes, text me lead confirmations & appointment updates  
Message and data rates may apply. Text STOP to opt-out.  
Read our Privacy Policy

---

## STEP 3: Integrate into Signup Form (15 min)

Find existing signup form component and:
- Import SMSOptInCheckbox component
- Position below phone number input
- Bind checkbox to form state: `sms_opted_in`
- Add form validation (prevent submit without checkbox)
- Show error: "Please opt in to SMS to receive lead notifications"
- On form submit, capture:
  - phone_number
  - sms_opted_in (boolean)
  - sms_opt_in_timestamp (now())
  - sms_opt_in_ip_address (from request)
  - user_agent (from request headers)

---

## STEP 4: Supabase Schema & Save Consent (15 min)

Create migration file with this SQL:

```sql
-- Add SMS consent columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS (
  sms_phone_number VARCHAR(15),
  sms_opted_in BOOLEAN DEFAULT FALSE,
  sms_opt_in_timestamp TIMESTAMP WITH TIME ZONE,
  sms_opt_in_method VARCHAR(50) DEFAULT 'web_form',
  sms_opt_in_ip_address VARCHAR(45),
  sms_consent_record JSONB
);

-- Create consent audit log table
CREATE TABLE IF NOT EXISTS sms_consent_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  consent_version VARCHAR(20) DEFAULT '1.0'
);

CREATE INDEX IF NOT EXISTS idx_sms_consent_audit_user_id ON sms_consent_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_consent_audit_timestamp ON sms_consent_audit(timestamp);
```

Run migration in Supabase console.

On form submission, save:
- Update users: sms_phone_number, sms_opted_in=true, sms_opt_in_timestamp, sms_opt_in_ip_address, sms_consent_record (JSON with full details)
- Insert into sms_consent_audit: action='opted_in', timestamp, ip_address, user_agent

---

## STEP 5: Twilio Webhook Handler (20 min)
Create `/app/api/twilio/incoming-sms/route.ts`

Requirements:
- POST endpoint
- Receive incoming SMS from Twilio
- Parse message body for keywords: STOP, HELP, CONFIRM
- Handle each:

  **STOP:**
  - Update user in Supabase: sms_opted_in = false
  - Insert audit log: action='opted_out'
  - Reply SMS: "✓ nevermisslead.com: You've been unsubscribed from all SMS messages. You won't receive leads or alerts. To resubscribe, text START or visit nevermisslead.com. We hope to see you back!"

  **HELP:**
  - Reply SMS: "nevermisslead.com SMS Support: • Text STOP = Unsubscribe from all messages • Text START = Resubscribe to notifications • Email: support@cherysolutions.com • Phone: (678) 788-7281"

  **CONFIRM:**
  - Update user in Supabase: sms_opted_in = true
  - Insert audit log: action='confirmed'
  - Reply SMS: "✓ nevermisslead.com: Your SMS notifications are active! You'll receive lead alerts here. Text STOP to opt-out or HELP for support. Welcome aboard!"

  **DEFAULT (no keyword):**
  - Reply SMS: "nevermisslead.com: Reply STOP to opt-out, HELP for support."

- Return TwiML response with MessagingResponse

Error handling:
- Log errors to console
- Return HTTP 200 to Twilio even on error (don't retry)
- Catch Supabase update failures

Verification:
- Endpoint is live: POST /app/api/twilio/incoming-sms
- Send test SMS from real phone to Twilio number
- Receive auto-reply within 30 seconds
- Check Supabase audit log updated

---

## STEP 6: Email Confirmation (Optional but recommended) (15 min)

Create email template from ~/Desktop/NEVERMISSLEAD_SMS_OPTIN_COPY.md (Email Confirmation section)

On signup form submit:
- Send confirmation email to user_email
- From: support@cherysolutions.com
- Include SMS confirmation link (generates one-time token)
- Link triggers verification endpoint

Example token generation:
```ts
const token = Buffer.from(JSON.stringify({
  user_id: userId,
  phone: phoneNumber,
  timestamp: Date.now()
})).toString('base64');
```

Link in email: `https://nevermisslead.com/api/confirm-sms?token=${token}`

Optional: Also send SMS confirmation from Twilio at same time

---

## REQUIREMENTS (Non-Negotiable)

1. **Test Coverage:** 80%+ minimum (unit + integration tests)
2. **Error Handling:** Try/catch all Twilio + Supabase operations
3. **Secrets:** No hardcoded API keys. Use:
   - process.env.TWILIO_ACCOUNT_SID
   - process.env.TWILIO_AUTH_TOKEN
   - process.env.TWILIO_PHONE_NUMBER
   - process.env.SUPABASE_URL
   - process.env.SUPABASE_ANON_KEY
   - process.env.PROTON_MAIL_API_KEY

4. **Compliance:** All copy must match reference files EXACTLY (word-for-word)
5. **Security:** Validate all incoming data (Twilio webhook, form inputs)
6. **Logging:** Log all opt-in/opt-out events (audit trail)

---

## VERIFICATION CHECKLIST (Test Locally First)

Before proceeding to production:

- [ ] Privacy policy page renders at /privacy
- [ ] SMSOptInCheckbox component compiles without errors
- [ ] Signup form requires checkbox to submit
- [ ] Form validation error shows when unchecked
- [ ] User data saves to Supabase on submit
- [ ] Supabase audit log records opt-in event
- [ ] POST /api/twilio/incoming-sms receives SMS payload
- [ ] Send "STOP" SMS from real phone → Supabase updates + auto-reply sent
- [ ] Send "HELP" SMS from real phone → auto-reply sent
- [ ] Send "CONFIRM" SMS from real phone → Supabase updates + auto-reply sent
- [ ] Check Twilio logs for success
- [ ] Check Supabase audit_log table populated

---

## DEPLOYMENT CHECKLIST

After local verification:

1. Merge PR to main/production
2. Run Supabase migrations in production
3. Deploy to Vercel
4. Test /privacy page live
5. Test signup form end-to-end
6. Configure Twilio webhook URL in console (point to production /api/twilio/incoming-sms)
7. Test SMS auto-replies on production number
8. Monitor logs for errors

---

## FILES YOU REFERENCE

~NEVERMISSLEAD-template/reference/PRIVACY_POLICY.md  
~NEVERMISSLEAD-template/reference/SMS_OPTIN_COPY.md  
~NEVERMISSLEAD-template/reference/A2P_10DLC_SMS_COMPLIANCE_PRP.md  

---

## QUESTIONS?

If you need:
- Database schema help → check PRP Step 4
- Twilio TwiML format → check Twilio docs
- Supabase client setup → use @supabase/supabase-js
- Email provider → Proton Mail API or resend.com

Ready to start? Confirm you understand all 6 steps, then begin Step 1.
