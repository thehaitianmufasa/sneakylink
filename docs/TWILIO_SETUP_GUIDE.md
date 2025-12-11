# 📞 TWILIO SETUP GUIDE - NUMBER PROVISIONING & WEBHOOK CONFIGURATION
**Complete guide for purchasing Twilio numbers and configuring call/SMS tracking**

---

## 📊 OVERVIEW

### What Twilio Does for NeverMissLead
- **Call Tracking**: Records all inbound calls with voicemail
- **SMS Tracking**: Logs all text messages and sends auto-responses
- **Lead Attribution**: Tracks which calls/texts convert to leads
- **Voicemail Recording**: Captures voicemail messages for follow-up
- **A2P 10DLC Compliance**: SMS consent tracking for carrier approval

### Cost Per Client
- **Phone Number**: $2.75/month (local number)
- **Voice Calls**: $0.013/min (inbound) + $0.013/min (outbound if forwarding)
- **SMS**: $0.0079/message (inbound) + $0.0079/message (outbound auto-response)
- **Estimated Total**: ~$10/month per client (average usage)

---

## 🔧 PART 1: TWILIO ACCOUNT SETUP (One-Time)

### ☐ Step 1.1: Create Twilio Account
- [ ] Go to: https://www.twilio.com/try-twilio
- [ ] Sign up with business email
- [ ] Verify email and phone number
- [ ] Complete account verification
- [ ] **Time: 5 min**

### ☐ Step 1.2: Upgrade to Paid Account
- [ ] Navigate to: Console → Billing
- [ ] Add credit card or payment method
- [ ] Initial credit: $20 recommended
- [ ] Set auto-recharge: $20 when balance < $5
- [ ] **Time: 3 min**

### ☐ Step 1.3: Get API Credentials
- [ ] Go to: Console → Account → API credentials
- [ ] Copy **Account SID** (starts with AC...)
- [ ] Copy **Auth Token** (click "Show" to reveal)
- [ ] Save both to `PROJECT_SECRETS_REFERENCE.txt`
- [ ] **CRITICAL**: Keep Auth Token secret!
- [ ] **Time: 1 min**

**✅ One-Time Setup Complete** → Now you can buy numbers for each client

---

## 📞 PART 2: PURCHASE PHONE NUMBER (Per Client)

### ☐ Step 2.1: Navigate to Phone Number Search
- [ ] Log in to Twilio Console: https://console.twilio.com
- [ ] Navigate to: Phone Numbers → Manage → Buy a number
- [ ] **Time: 30 sec**

### ☐ Step 2.2: Search for Number
- [ ] **Country**: United States
- [ ] **Number Type**: Local
- [ ] **Area Code**: Client's preferred area code (from intake form)
- [ ] **Capabilities** (CHECK ALL):
  - [x] Voice
  - [x] SMS
  - [x] MMS (optional but recommended)
- [ ] **Search**: Click "Search"
- [ ] **Time: 30 sec**

### ☐ Step 2.3: Select Number
- [ ] Review available numbers
- [ ] Look for:
  - Easy to remember digits
  - No offensive patterns
  - Local area code matching client's region
- [ ] Click "Buy" on selected number
- [ ] **Cost: $2.75/month** (billed to your account)
- [ ] **Time: 30 sec**

### ☐ Step 2.4: Confirm Purchase
- [ ] Review purchase summary
- [ ] Click "Buy this number"
- [ ] **Confirmation**: Number is now active
- [ ] **Copy phone number**: +1xxxxxxxxxx
- [ ] **Time: 30 sec**

### ☐ Step 2.5: Save Number to Database
- [ ] Open Supabase project
- [ ] Navigate to: Table Editor → `clients` table
- [ ] Find client record by slug or name
- [ ] Update `twilio_phone_number` field:
  ```sql
  UPDATE clients
  SET twilio_phone_number = '+1xxxxxxxxxx',
      twilio_forward_to = '+1yyyyyyyyyy'  # Client's real number (optional)
  WHERE slug = 'client-slug';
  ```
- [ ] **Time: 1 min**

### ☐ Step 2.6: Save to Config & Secrets
- [ ] Add to `PROJECT_SECRETS_REFERENCE.txt`:
  ```
  [Client Name] - client-slug
  Twilio Number: +1xxxxxxxxxx
  Purchased: 2025-11-22
  ```
- [ ] **Time: 30 sec**

**✅ Phone Number Purchased** → Total time: ~3 minutes

---

## 🔗 PART 3: CONFIGURE WEBHOOKS (After Deployment)

**CRITICAL: Only configure webhooks AFTER the client's site is deployed to Vercel**

### Why Wait?
- Webhooks need a live URL to send data to
- Testing locally won't work (Twilio can't reach `http://localhost`)
- Configure webhooks as the LAST step before testing

---

### ☐ Step 3.1: Get Production URL
- [ ] Verify client site is deployed on Vercel
- [ ] Production URL formats:
  - Custom domain: `https://clientdomain.com`
  - Vercel domain: `https://client-slug.vercel.app`
  - Subdomain: `https://client-slug.nevermisslead.com`
- [ ] **Test URL**: Visit in browser → should load site
- [ ] **Time: 1 min**

---

### ☐ Step 3.2: Navigate to Phone Number Settings
- [ ] Log in to Twilio Console: https://console.twilio.com
- [ ] Navigate to: Phone Numbers → Manage → Active numbers
- [ ] Click on the client's phone number (+1xxxxxxxxxx)
- [ ] **Time: 30 sec**

---

### ☐ Step 3.3: Configure VOICE Webhook

#### A. Set Voice URL
- [ ] Scroll to **"Voice Configuration"** section
- [ ] **Configure With**: Webhook, TwiML Bin, Function, Studio Flow, or Proxy
  - Select: **Webhooks, TwiML Bins, Functions, and Studio Flows**
- [ ] **A CALL COMES IN**:
  - **Webhook**: `https://clientdomain.com/api/twilio/voice`
  - **HTTP Method**: POST
- [ ] **Time: 1 min**

#### B. Set Status Callback (Optional but Recommended)
- [ ] Scroll to **"Status Callback URL"**
- [ ] **Webhook**: `https://clientdomain.com/api/twilio/status`
- [ ] **HTTP Method**: POST
- [ ] **Events to Log**: Select all
- [ ] **Time: 30 sec**

**What This Does**:
- Inbound calls → Plays voicemail greeting (from `/api/twilio/voice`)
- Records voicemail (max 60 seconds)
- Saves call log to database (`call_logs` table)
- Transcribes voicemail (optional)
- Updates call status as call progresses

---

### ☐ Step 3.4: Configure SMS Webhook

#### A. Set SMS URL
- [ ] Scroll to **"Messaging Configuration"** section
- [ ] **Configure With**: Webhook, TwiML Bin, Function, Studio Flow, or Proxy
  - Select: **Webhooks, TwiML Bins, Functions, and Studio Flows**
- [ ] **A MESSAGE COMES IN**:
  - **Webhook**: `https://clientdomain.com/api/twilio/sms`
  - **HTTP Method**: POST
- [ ] **Time: 1 min**

**What This Does**:
- Inbound SMS → Logs to database (`sms_logs` table)
- Sends auto-response (from config `sms.autoResponse`)
- Tracks SMS consent for A2P 10DLC compliance
- Links SMS to lead if phone number matches

---

### ☐ Step 3.5: Save Configuration
- [ ] Scroll to bottom of page
- [ ] Click **"Save Configuration"** or **"Save"**
- [ ] Wait for confirmation message
- [ ] **Time: 30 sec**

**✅ Webhooks Configured** → Total time: ~3 minutes

---

## 📞 PART 3.6: ENABLE AUTO-CONNECT CALLS (OPTIONAL)

**What is Auto-Connect?**
- Incoming calls ring the owner's personal phone immediately
- If owner answers within 30 seconds → connected to lead
- If owner doesn't answer → voicemail + auto-SMS to lead ("Thanks for calling, I'll call you back today")

**Benefits**:
- 40-60% of calls answered live (vs 0% with voicemail-only)
- Faster response time = higher conversion rate
- Lead still gets voicemail option if owner unavailable

---

### ☐ Step 3.6.1: Add Owner Phone Number
- [ ] Open Vercel project for this client
- [ ] Navigate to: Settings → Environment Variables
- [ ] Add new variable:
  - **Name**: `OWNER_PHONE_NUMBER`
  - **Value**: `+1xxxxxxxxxx` (owner's personal phone in E.164 format)
  - **Environments**: Production, Preview (optional)
- [ ] Click "Save"
- [ ] **Time: 1 min**

### ☐ Step 3.6.2: (Optional) Customize Auto-SMS Template
- [ ] Add another environment variable:
  - **Name**: `AUTO_SMS_TEMPLATE`
  - **Value**: `Thanks for calling {business_name}. Sorry I couldn't pick up right now. I'll call you back today. Thanks again!`
  - **Note**: Use `{business_name}` as placeholder for client's business name
- [ ] Click "Save"
- [ ] **Time: 30 sec**

### ☐ Step 3.6.3: Redeploy Application
- [ ] Trigger redeployment to apply new environment variables
- [ ] Options:
  - Push new commit to GitHub (triggers auto-deploy)
  - OR: Vercel Dashboard → Deployments → [Latest] → ⋯ → Redeploy
- [ ] Wait for deployment to complete (~1 min)
- [ ] **Time: 2 min**

### ☐ Step 3.6.4: Test Auto-Connect Flow
- [ ] **Test Case 1: Owner Answers**
  1. Call the Twilio number
  2. Owner's phone should ring immediately
  3. Owner answers → connected to lead
  4. No voicemail, no auto-SMS
  5. Check database: `call_logs.dial_status = 'completed'`, `connected_to_owner = true`

- [ ] **Test Case 2: Owner Doesn't Answer**
  1. Call the Twilio number
  2. Wait 30 seconds (owner doesn't answer)
  3. Voicemail prompt plays
  4. Lead receives auto-SMS: "Thanks for calling [Business Name]..."
  5. Check database: `call_logs.dial_status = 'no-answer'`, `auto_sms_sent = true`

- [ ] **Time: 3 min**

**✅ Auto-Connect Enabled** → Calls now ring owner's phone first

---

### Database Fields (Auto-Connect)
When auto-connect is enabled, these fields are logged in `call_logs` table:
- **`dial_status`**: `completed`, `no-answer`, `busy`, `failed`, `canceled`
- **`connected_to_owner`**: `true` if owner answered, `false` otherwise
- **`owner_answered_at`**: Timestamp when owner picked up (NULL if didn't answer)
- **`auto_sms_sent`**: `true` if "Thanks for calling" SMS was sent to lead

---

### Cost Impact (Auto-Connect)
**Per Call**:
- Dial attempt to owner: ~$0.01 if answered, ~$0.004 if not answered
- Auto-SMS to lead (if missed): $0.0079
- Voicemail transcription (if missed): $0.05 (existing)

**Example (100 calls/month)**:
- 60 answered immediately: 60 × $0.01 = $0.60
- 40 missed → voicemail: 40 × ($0.004 + $0.0079 + $0.05) = $2.48
- **Total: ~$3.08/month additional cost** (negligible compared to conversion gain)

---

### Disable Auto-Connect
To disable auto-connect and return to voicemail-only:
1. Remove `OWNER_PHONE_NUMBER` from Vercel environment variables
2. Redeploy application
3. Incoming calls will go straight to voicemail (original behavior)

---

## ✅ PART 4: VERIFY WEBHOOK CONFIGURATION

### ☐ Step 4.1: Test Voice Webhook
- [ ] Call the Twilio number: +1xxxxxxxxxx
- [ ] **Expected**:
  - Greeting plays: "Thank you for calling [Business Name]..."
  - Beep sounds
  - You can leave a voicemail (max 60 sec)
- [ ] Leave test voicemail
- [ ] **Time: 1 min**

### ☐ Step 4.2: Check Call Log in Database
- [ ] Open Supabase project
- [ ] Navigate to: Table Editor → `call_logs` table
- [ ] Filter by `twilio_phone_number` = '+1xxxxxxxxxx'
- [ ] **Expected**: New record with:
  - `twilio_call_sid` (unique ID)
  - `from_number` (your test phone)
  - `to_number` (+1xxxxxxxxxx)
  - `status` (completed)
  - `recording_url` (voicemail recording)
- [ ] **Time: 1 min**

### ☐ Step 4.3: Test SMS Webhook
- [ ] Text the Twilio number: +1xxxxxxxxxx
- [ ] Message: "Test SMS"
- [ ] **Expected**:
  - Auto-response received within seconds
  - Message says: "[Business Name] received your message..."
- [ ] **Time: 30 sec**

### ☐ Step 4.4: Check SMS Log in Database
- [ ] Open Supabase → Table Editor → `sms_logs` table
- [ ] Filter by `to_number` = '+1xxxxxxxxxx'
- [ ] **Expected**: 2 records:
  1. **Inbound**: Your test message
  2. **Outbound**: Auto-response (is_auto_response = true)
- [ ] **Time: 1 min**

### ☐ Step 4.5: Check Twilio Logs (If Issues)
- [ ] Go to: Twilio Console → Monitor → Logs → Errors
- [ ] Check for recent webhook errors
- [ ] Common errors:
  - 404: Wrong webhook URL
  - 500: Application error (check Vercel logs)
  - Timeout: Webhook took >15 seconds
- [ ] **Time: 1 min** (if needed)

**✅ Webhooks Verified** → Call and SMS tracking working

---

## 🤖 PART 5: A2P 10DLC REGISTRATION (For SMS at Scale)

**What is A2P 10DLC?**
- **A2P**: Application-to-Person (automated SMS)
- **10DLC**: 10-Digit Long Code (regular phone numbers)
- **Why**: Carriers require registration to prevent spam
- **When**: Required when sending SMS at scale (>5-10/day)

### ☐ Step 5.1: Register Your Business
- [ ] Navigate to: Twilio Console → Messaging → Regulatory Compliance
- [ ] Click "Get Started" under A2P 10DLC
- [ ] Fill in business information:
  - Legal business name
  - EIN (Tax ID)
  - Business address
  - Industry
  - Website
- [ ] **Cost**: $4 one-time registration fee
- [ ] **Time: 5 min**

### ☐ Step 5.2: Register SMS Campaign
- [ ] Navigate to: Messaging → Regulatory Compliance → A2P 10DLC
- [ ] Click "Create Campaign"
- [ ] Campaign details:
  - **Name**: NeverMissLead Lead Notifications
  - **Description**: "Automated notifications for service request confirmations and appointment reminders"
  - **Use Case**: Low Volume Mixed
  - **Sample Messages**:
    - "Thanks for requesting a quote from [Business]! We received your information and will contact you within 24 hours."
    - "Your appointment with [Business] is confirmed for [Date] at [Time]. Reply STOP to opt out."
- [ ] **Consent URL**: `https://nevermisslead.com/signup` (static signup page)
- [ ] **Cost**: $10/month per campaign
- [ ] **Time: 10 min**

### ☐ Step 5.3: Assign Numbers to Campaign
- [ ] Select registered campaign
- [ ] Click "Assign Numbers"
- [ ] Select all client phone numbers
- [ ] Submit for carrier approval
- [ ] **Time: 2 min**

### ☐ Step 5.4: Wait for Approval
- [ ] **Timeline**: 1-5 business days
- [ ] **Status**: Monitor in Twilio Console
- [ ] **During wait**: SMS still works but may have lower throughput
- [ ] **After approval**: Full SMS capabilities unlocked
- [ ] **Time: Wait 1-5 days**

**✅ A2P 10DLC Approved** → Full SMS capabilities

---

## 🔧 AUTOMATION SCRIPTS (Optional)

### Manual vs. Automated

**Manual (via Twilio Console)**:
- **Time**: 3 min per number
- **Good for**: Small batches (1-5 clients)
- **Pros**: Visual, easy to verify

**Automated (via API Script)**:
- **Time**: 30 sec per number
- **Good for**: Large batches (10+ clients)
- **Pros**: Fast, consistent, repeatable

---

### Using `provision-twilio-number.js` Script

**Prerequisites**:
```bash
# Install dependencies
cd scripts
npm install twilio

# Set environment variables
export TWILIO_ACCOUNT_SID=ACxxxx
export TWILIO_AUTH_TOKEN=xxxx
```

**Usage**:
```bash
# Search for available numbers in area code
node scripts/provision-twilio-number.js \
  --areaCode=404 \
  --search

# Purchase specific number
node scripts/provision-twilio-number.js \
  --number=+14045551234 \
  --buy

# Configure webhooks
node scripts/provision-twilio-number.js \
  --number=+14045551234 \
  --webhookUrl=https://clientdomain.com \
  --configure
```

**Output**:
```
✅ Number purchased: +1 (404) 555-1234
✅ Voice webhook configured
✅ SMS webhook configured
✅ Status callback configured
✅ Total cost: $2.75/month
```

---

## 🚨 TROUBLESHOOTING

### Issue: "Unable to create record" when buying number
**Cause**: Payment method not set or insufficient balance
**Solution**:
1. Go to: Console → Billing
2. Add/update payment method
3. Add credit manually: $20 minimum
4. Retry number purchase

---

### Issue: Webhook returns 404 error
**Cause**: Incorrect webhook URL or site not deployed
**Solution**:
1. Verify site is live: `curl https://clientdomain.com`
2. Check exact webhook URL format: `https://domain.com/api/twilio/voice` (no trailing slash)
3. Test webhook manually:
   ```bash
   curl -X POST https://clientdomain.com/api/twilio/voice \
     -d "From=+15551234567" \
     -d "To=+14045551234"
   ```

---

### Issue: Voicemail not recording
**Cause**: Missing `recordingStatusCallback` or recording disabled
**Solution**:
1. Check `/api/twilio/voice` endpoint
2. Verify TwiML includes `<Record>` verb
3. Check Vercel logs for errors

---

### Issue: SMS auto-response not sending
**Cause**: SMS disabled in config or TWILIO_PHONE_NUMBER not set
**Solution**:
1. Check Vercel env vars: `TWILIO_PHONE_NUMBER=+1xxxxxxxxxx`
2. Check config: `sms.enabled = true`
3. Check Vercel logs for errors in `/api/twilio/sms`

---

### Issue: A2P 10DLC campaign rejected
**Cause**: Missing consent URL or unclear use case
**Solution**:
1. Ensure static signup page exists: `https://nevermisslead.com/signup`
2. Signup page must have:
   - SMS opt-in checkbox
   - Clear consent language
   - Privacy policy link
   - Phone number field
3. Resubmit campaign with corrected consent URL

---

## 📚 RELATED DOCUMENTATION

- **ONBOARDING_CHECKLIST.md** - Full onboarding workflow
- **TESTING_CHECKLIST.md** - How to test call/SMS tracking
- **TROUBLESHOOTING.md** - General error solutions

---

## 📊 SUMMARY CHECKLIST

**One-Time Setup**:
- [ ] Create Twilio account
- [ ] Upgrade to paid account
- [ ] Save API credentials
- [ ] (Optional) Register for A2P 10DLC

**Per Client** (repeat for each):
- [ ] Purchase phone number in client's area code ($2.75/mo)
- [ ] Save number to database and secrets file
- [ ] Deploy client site to Vercel (get production URL)
- [ ] Configure voice webhook: `/api/twilio/voice`
- [ ] Configure SMS webhook: `/api/twilio/sms`
- [ ] Configure status callback: `/api/twilio/status`
- [ ] Test call tracking (leave voicemail)
- [ ] Test SMS auto-response
- [ ] Verify logs in Supabase database

**Total Time**: ~6 minutes per client (manual) or ~2 minutes (automated)

---

**Last Updated**: November 22, 2025
**Twilio Version**: API 2010-04-01
**Cost Per Client**: ~$10/month (number + average usage)
