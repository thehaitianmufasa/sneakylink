# PRP: Twilio Auto-Connect Call with SMS Backup
**Project:** NeverMissLead Template  
**Repository:** thehaitianmufasa/nevermisslead-template  
**Date:** November 24, 2025  
**Estimated Time:** 45-60 minutes

---

## 🎯 OBJECTIVE
Implement auto-connect call system where incoming calls instantly connect to owner's phone. If owner doesn't answer within 30 seconds, lead hears voicemail prompt (existing transcription preserved) and receives auto-SMS: "Thanks for calling, will reach out shortly."

---

## 📋 USER STORIES

### Story 1: Instant Call Connection
**As a** business owner  
**I want** incoming calls to automatically ring my personal phone  
**So that** I can answer leads in real-time without manual callback

**Acceptance Criteria:**
- Lead calls business number → Owner's phone rings immediately
- Call shows business number to lead (not personal number)
- Owner answers → connected to lead seamlessly
- Call duration and outcome logged to Supabase

### Story 2: Voicemail Transcription Backup
**As a** business owner  
**I want** voicemail transcription to still work if I miss the call  
**So that** I can read what the lead said without listening to audio

**Acceptance Criteria:**
- Owner doesn't answer within 30 seconds → Lead hears voicemail prompt
- Lead leaves message → Transcribed via Twilio
- Transcription SMS'd to owner (existing flow preserved)
- Voicemail URL and transcription saved to Supabase

### Story 3: Auto-SMS to Lead
**As a** lead who called  
**I want** confirmation my call was received  
**So that** I know the business will respond

**Acceptance Criteria:**
- Lead calls but owner doesn't answer → Auto-SMS sent
- SMS content: "Thanks for calling [Business Name], we'll reach out shortly"
- SMS sent from business Twilio number
- SMS logged to Supabase with timestamp

---

## 🏗️ TECHNICAL DESIGN

### Architecture Overview
```
Lead Calls → Twilio → Webhook → TwiML Logic:
  ├─ Option A: Owner Answers
  │   ├─ Connect to owner's phone
  │   ├─ Log call details to Supabase
  │   └─ End call
  └─ Option B: No Answer (30s timeout)
      ├─ Play voicemail prompt
      ├─ Record message + transcribe
      ├─ SMS transcription to owner
      ├─ Auto-SMS to lead ("Thanks for calling...")
      └─ Log all to Supabase
```

### Files to Create/Modify

#### 1. `/app/api/twilio/voice/route.ts` (MODIFY)
**Current:** Returns static TwiML for voicemail recording  
**New:** Add `<Dial>` with timeout, fallback to existing voicemail logic

**Key Changes:**
```typescript
// Add to TwiML response:
<Dial timeout="30" action="/api/twilio/dial-status">
  <Number>${process.env.OWNER_PHONE_NUMBER}</Number>
</Dial>
// If no answer, falls through to existing voicemail recording logic
```

#### 2. `/app/api/twilio/dial-status/route.ts` (CREATE NEW)
**Purpose:** Handle dial outcome (answered, busy, no-answer, failed)  
**Actions:**
- Log call outcome to Supabase (calls table)
- If `DialCallStatus !== "completed"` → Send auto-SMS to lead
- Return TwiML to continue to voicemail (existing flow)

**SMS Content:**
```
"Thanks for calling ${clientConfig.business.name}. Sorry I couldn't pick up right now. I'll call you back today. Thanks again!"
```

#### 3. `/app/api/twilio/sms/route.ts` (NO CHANGES)
**Preserve:** Existing SMS webhook for lead responses  

#### 4. `/app/api/twilio/status/route.ts` (MODIFY)
**Add:** Call duration and completion status logging  
**New Fields:** `dial_status`, `connected_to_owner`, `owner_answered_at`

---

## 📊 DATABASE CHANGES

### Update `calls` Table Schema
```sql
ALTER TABLE calls ADD COLUMN IF NOT EXISTS dial_status TEXT; 
-- Values: 'completed', 'no-answer', 'busy', 'failed'

ALTER TABLE calls ADD COLUMN IF NOT EXISTS connected_to_owner BOOLEAN DEFAULT false;

ALTER TABLE calls ADD COLUMN IF NOT EXISTS owner_answered_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE calls ADD COLUMN IF NOT EXISTS auto_sms_sent BOOLEAN DEFAULT false;
-- Track if "Thanks for calling" SMS was sent
```

### Migration File
Create: `/sql/migrations/007_add_call_routing_fields.sql`

---

## 🔧 ENVIRONMENT VARIABLES

### Add to `.env.local` and Vercel
```bash
# Owner's personal phone for call forwarding
OWNER_PHONE_NUMBER="+1234567890"  # Jeff's actual number

# Auto-SMS template (optional override)
AUTO_SMS_TEMPLATE="Thanks for calling {business_name}. Sorry I couldn't pick up right now. I'll call you back today. Thanks again!"
```

---

## 🧪 TESTING PLAN

### Test Case 1: Owner Answers Call
1. Call business Twilio number from test phone
2. **Expected:** Owner's phone rings within 2 seconds
3. Owner answers
4. **Expected:** Connected to lead, business number displayed to lead
5. Check Supabase `calls` table
6. **Expected:** 
   - `dial_status = 'completed'`
   - `connected_to_owner = true`
   - `owner_answered_at` timestamp set
   - `auto_sms_sent = false`

### Test Case 2: Owner Doesn't Answer → Voicemail
1. Call business number, don't answer owner phone
2. **Expected:** After 30s, voicemail prompt plays
3. Leave message "This is a test voicemail"
4. **Expected:** 
   - Voicemail recorded
   - Transcription SMS sent to owner
   - Auto-SMS sent to lead: "Thanks for calling..."
5. Check Supabase
6. **Expected:**
   - `dial_status = 'no-answer'`
   - `connected_to_owner = false`
   - `transcription` contains "test voicemail"
   - `auto_sms_sent = true`

### Test Case 3: Owner Phone Busy
1. Call business number while owner on another call
2. **Expected:** Immediate fallback to voicemail (Twilio detects busy)
3. **Expected:** Auto-SMS sent to lead
4. Check Supabase: `dial_status = 'busy'`

### Test Case 4: Invalid Owner Number
1. Set `OWNER_PHONE_NUMBER` to invalid number
2. Call business number
3. **Expected:** Graceful fallback to voicemail
4. **Expected:** Error logged but no crash
5. Check Supabase: `dial_status = 'failed'`

---

## 🔒 ERROR HANDLING

### Scenario 1: SMS Send Failure
**If:** Twilio SMS API call fails  
**Then:** 
- Log error to console with details
- Still record voicemail and transcription
- Set `auto_sms_sent = false` in database
- Don't block call flow

### Scenario 2: Database Write Failure
**If:** Supabase insert fails  
**Then:**
- Log error but don't interrupt Twilio response
- Return valid TwiML so call continues
- Retry database write in background (optional)

### Scenario 3: Owner Number Not Configured
**If:** `OWNER_PHONE_NUMBER` env var missing  
**Then:**
- Skip `<Dial>` step entirely
- Go straight to voicemail prompt
- Log warning: "Owner phone not configured"

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup (5 min)
- [ ] Create migration file `007_add_call_routing_fields.sql`
- [ ] Run migration on Supabase dev database
- [ ] Verify new columns exist in `calls` table
- [ ] Update TypeScript types in `/lib/supabase/types.ts`

### Phase 2: Voice Webhook Logic (15 min)
- [ ] Modify `/app/api/twilio/voice/route.ts`
- [ ] Add `<Dial>` with 30s timeout
- [ ] Set action URL to `/api/twilio/dial-status`
- [ ] Preserve existing voicemail recording logic as fallback
- [ ] Test locally with ngrok tunnel

### Phase 3: Dial Status Handler (15 min)
- [ ] Create `/app/api/twilio/dial-status/route.ts`
- [ ] Parse `DialCallStatus` from Twilio webhook
- [ ] Log call outcome to Supabase
- [ ] Send auto-SMS if no answer/busy/failed
- [ ] Return TwiML to continue to voicemail
- [ ] Add error handling for SMS failures

### Phase 4: Status Callback Updates (5 min)
- [ ] Modify `/app/api/twilio/status/route.ts`
- [ ] Save `dial_status`, `connected_to_owner`, `owner_answered_at`
- [ ] Handle call duration tracking
- [ ] Test with completed and missed calls

### Phase 5: Environment Configuration (5 min)
- [ ] Add `OWNER_PHONE_NUMBER` to `.env.local`
- [ ] Add to Vercel environment variables (production)
- [ ] Document in `/docs/TWILIO_SETUP_GUIDE.md`
- [ ] Verify all demos have correct config

### Phase 6: Testing (15 min)
- [ ] Run all 4 test cases (answered, voicemail, busy, invalid)
- [ ] Verify Supabase logging for each scenario
- [ ] Check SMS delivery to both owner and lead
- [ ] Test voicemail transcription still works
- [ ] Verify no regressions on existing features

---

## 🚀 DEPLOYMENT

### Pre-Deployment
1. Test on local with ngrok tunnel
2. Verify all test cases pass
3. Check no TypeScript errors
4. Review database migration

### Deployment Steps
1. Run database migration on production Supabase
2. Add `OWNER_PHONE_NUMBER` to Vercel env vars
3. Commit changes to GitHub
4. Push to `main` branch
5. Vercel auto-deploys
6. Update Twilio voice webhook URL in console (if changed)
7. Test on production with real phone call

### Rollback Plan
If issues detected:
1. Revert to previous commit
2. Redeploy via Vercel
3. Twilio webhooks will use old logic (still functional)
4. No data loss (database changes are additive)

---

## 📚 REFERENCES

### Twilio Documentation
- [Dial Verb](https://www.twilio.com/docs/voice/twiml/dial)
- [Number Noun](https://www.twilio.com/docs/voice/twiml/number)
- [Record Verb](https://www.twilio.com/docs/voice/twiml/record) (existing)
- [SMS Send](https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource)

### Project Files
- `/docs/TWILIO_SETUP_GUIDE.md` - Webhook configuration
- `/sql/schema.sql` - Database schema
- `/config/clients/hvac.json` - Client config structure

---

## ⚠️ CRITICAL NOTES

1. **Preserve Existing Voicemail Logic:** Don't break current transcription flow
2. **30 Second Timeout:** Balance between giving owner time vs not wasting lead's time
3. **SMS Rate Limits:** Twilio has rate limits, but shouldn't hit them with typical call volume
4. **Phone Number Format:** Must be E.164 format (+1234567890)
5. **Cost Impact:** Twilio charges for:
   - Outbound dial to owner ($0.013/min)
   - SMS to lead ($0.0079 each)
   - Voicemail recording/transcription (existing)

---

## 💰 COST ESTIMATE

**Per Incoming Call:**
- Auto-connect attempt: ~$0.01 (if answered) or ~$0.004 (if no answer after 30s)
- SMS to lead (if missed): $0.0079
- Voicemail transcription (if missed): $0.05 (existing)

**Example Scenario (100 calls/month):**
- 60 answered immediately: 60 × $0.01 = $0.60
- 40 missed → voicemail: 40 × ($0.004 + $0.0079 + $0.05) = $2.48
- **Total:** ~$3.08/month additional cost (negligible)

---

## ✅ SUCCESS CRITERIA

This PRP is complete when:
1. ✅ Owner's phone rings immediately when lead calls
2. ✅ Owner answers → connected seamlessly with business number shown to lead
3. ✅ Owner doesn't answer → voicemail prompt plays after 30s
4. ✅ Voicemail transcription SMS'd to owner (existing flow preserved)
5. ✅ Auto-SMS sent to lead: "Thanks for calling..."
6. ✅ All call outcomes logged to Supabase with correct status
7. ✅ Zero downtime during deployment
8. ✅ All existing features still work (SMS auto-reply, form submissions, etc.)

---

## 🎯 EXPECTED IMPACT

**Before:**
- Lead calls → voicemail → waits for callback
- Owner sees SMS → manually calls back
- Lead may have called competitors already

**After:**
- Lead calls → owner answers instantly (60%+ conversion)
- Lead doesn't wait → immediate human interaction
- If missed → still get voicemail + auto-SMS reassurance
- Faster response time = higher close rate

**Estimated Improvement:**
- 40-60% of calls answered live (vs 0% currently)
- Reduced callback time from 10+ min to instant
- Higher lead satisfaction and conversion

---

**END OF PRP**

**Next Step:** Provide this PRP to Claude Code with:
```bash
Read /path/to/TWILIO_AUTO_CONNECT_CALL_PRP.md and implement the auto-connect call system with SMS backup. Start with Phase 1 database migration.
```
