# Twilio Webhook Configuration

## Overview
This guide explains how to configure Twilio webhooks for the NeverMissLead phone number to enable call forwarding, voicemail recording, and SMS auto-response.

## Phone Number
- **Number:** +1 (678) 788-7281
- **Purpose:** NeverMissLead HVAC demo showcase

## Required Webhook URLs

### Production (nevermisslead.com)
- **Voice Webhook:** `https://nevermisslead.com/api/twilio/voice`
- **SMS Webhook:** `https://nevermisslead.com/api/twilio/sms`
- **Status Callback:** `https://nevermisslead.com/api/twilio/status`

### Local Development (testing)
- **Voice Webhook:** `http://localhost:3001/api/twilio/voice`
- **SMS Webhook:** `http://localhost:3001/api/twilio/sms`
- **Status Callback:** `http://localhost:3001/api/twilio/status`

**Note:** For local testing, use ngrok to expose localhost:
```bash
ngrok http 3001
# Use the ngrok URL (e.g., https://abc123.ngrok.io) for webhook URLs
```

---

## Manual Configuration (Twilio Console)

### Step 1: Log into Twilio Console
1. Go to https://console.twilio.com
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on `+1 678 788 7281`

### Step 2: Configure Voice Webhooks
Scroll to the **Voice Configuration** section:

- **A Call Comes In:**
  - Webhook: `https://nevermisslead.com/api/twilio/voice`
  - HTTP Method: `POST`

- **Primary Handler Fails:**
  - Leave blank or use fallback URL

- **Status Callback:**
  - Webhook: `https://nevermisslead.com/api/twilio/status`
  - HTTP Method: `POST`

### Step 3: Configure SMS Webhooks
Scroll to the **Messaging** section:

- **A Message Comes In:**
  - Webhook: `https://nevermisslead.com/api/twilio/sms`
  - HTTP Method: `POST`

- **Primary Handler Fails:**
  - Leave blank

### Step 4: Save Configuration
Click **Save** at the bottom of the page.

---

## Automated Configuration (Script)

### Prerequisites
1. Twilio credentials set in `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   NEXT_PUBLIC_APP_URL=https://nevermisslead.com
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install twilio
   ```

### Run the Script
```bash
# Load environment variables and run
export $(cat .env.local | grep -v '^#' | xargs) && node scripts/configure-twilio-webhooks.js
```

The script will:
1. Look up the phone number SID
2. Update voice webhook URL
3. Update SMS webhook URL
4. Update status callback URL
5. Display confirmation

---

## Verification

### Test Voice Webhook
1. Call the number: +1 (678) 788-7281
2. You should hear the voicemail greeting:
   > "Thank you for calling NeverMissLead, powered by CherySolutions..."
3. Leave a message after the tone
4. Check Supabase `call_logs` table for new record

### Test SMS Webhook
1. Send a text message to: +1 (678) 788-7281
2. You should receive an auto-response:
   > "Thanks for texting NeverMissLead powered by CherySolutions. To get a quote please visit [form link]"
3. Check Supabase `sms_logs` table for new record

### Check Logs
- **Twilio Console Logs:** https://console.twilio.com/logs
- **Vercel Logs:** `vercel logs` or check Vercel dashboard
- **Supabase Logs:** Check logs in Supabase dashboard

---

## Troubleshooting

### Webhook Returns 403 Forbidden
- **Cause:** Twilio signature validation failing
- **Fix:** Verify `TWILIO_AUTH_TOKEN` in `.env.local` matches console

### Webhook Returns 500 Internal Server Error
- **Cause:** Database connection issue or missing client
- **Fix:** Check Supabase credentials and verify client exists in database

### No Response from Webhook
- **Cause:** Wrong URL or webhook not reached
- **Fix:** Verify webhook URL in Twilio console, check for typos

### Recording Not Saved
- **Cause:** Status callback not configured
- **Fix:** Set status callback URL in voice configuration

---

## Webhook Endpoints Reference

### `/api/twilio/voice` (POST)
**Purpose:** Handle incoming phone calls

**Parameters:**
- `CallSid` - Unique call identifier
- `From` - Caller's phone number
- `To` - Called number (tracking number)
- `CallStatus` - Current call status
- `Direction` - inbound/outbound

**Response:** TwiML XML for voicemail recording

**Database:** Inserts record in `call_logs` table

---

### `/api/twilio/sms` (POST)
**Purpose:** Handle incoming text messages

**Parameters:**
- `MessageSid` - Unique message identifier
- `From` - Sender's phone number
- `To` - Recipient number (tracking number)
- `Body` - Message content

**Response:** TwiML XML for auto-response

**Database:** Inserts record in `sms_logs` table

---

### `/api/twilio/status` (POST)
**Purpose:** Receive call/recording status updates

**Parameters:**
- `CallSid` - Call identifier
- `RecordingSid` - Recording identifier (if applicable)
- `RecordingUrl` - URL to access recording
- `TranscriptionText` - Voicemail transcription (if enabled)

**Database:** Updates `call_logs` with recording details

---

## Security Notes

1. **Signature Validation:** All webhooks validate Twilio signatures using `TWILIO_AUTH_TOKEN`
2. **HTTPS Required:** Twilio only accepts HTTPS URLs in production
3. **Environment Variables:** Never commit credentials to Git
4. **RLS Policies:** Database access controlled by Row Level Security

---

## Next Steps After Configuration

1. ✅ Webhooks configured in Twilio console
2. Test phone call → voicemail → recording saved
3. Test SMS → auto-response sent → message logged
4. Test lead form submission → record in database
5. Verify all data appears in Supabase tables

---

**Last Updated:** October 29, 2025
**Status:** Production-ready
**Phone Number:** +1 (678) 788-7281
**Production URL:** https://nevermisslead.com
