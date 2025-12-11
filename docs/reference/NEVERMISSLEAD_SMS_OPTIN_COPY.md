# nevermisslead.com - SMS Opt-In Copy & Checkbox Language

## Location: Signup Form / Lead Intake Flow

---

## Option A: Compact Checkbox (Recommended for Form Integration)

### Checkbox Label (Required - Exact Wording for A2P 10DLC Compliance)

```
☐ Yes, text me lead confirmations & appointment updates  
Message and data rates may apply. Text STOP to opt-out.  
Read our Privacy Policy
```

**Notes:**
- Checkbox must be **unchecked by default** (explicit opt-in required)
- Must link "Privacy Policy" to /privacy page
- Font: Same as form text (not smaller)
- Placement: Below phone number field, before submit button

---

## Option B: Expanded Checkbox (More Detail)

### Checkbox Label

```
☐ I agree to receive SMS text messages from nevermisslead.com  
regarding leads, appointment confirmations, and service updates.  
Message and data rates may apply per your carrier plan.  
Standard frequency: 1-5 messages per business day.  
Text STOP to opt-out anytime. Text HELP for support.  
I have read and accept the Privacy Policy & Terms.
```

**Notes:**
- Provides full transparency upfront
- Better for reducing rejections
- Recommended if space permits

---

## Option C: Collapse/Expand Pattern (Best UX + Compliance)

### Main Checkbox
```
☐ Enable SMS lead notifications
```

### Expands to reveal:
```
By opting in, you agree to:
- Receive SMS confirmations for new leads
- Receive appointment reminders & updates
- Standard messaging frequency: 1-5 texts/day
- Message and data rates may apply
- You can opt-out anytime by texting STOP

Read our full Privacy Policy
```

---

## Copy for Various Form Positions

### Above Checkbox (Optional Header)
```
Stay Connected with Your Leads

Opt in to SMS to receive instant lead notifications. 
Stay updated on appointments and service requests.
```

### Below Checkbox (Optional Helper Text)
```
You can opt-out anytime. Text STOP at any time or 
manage preferences in your account dashboard.
```

### Form Validation Message (if unchecked)
```
⚠️ Please opt in to SMS to receive lead notifications
```

---

## Email Confirmation After Signup

**Subject:** Confirm Your SMS Opt-In - nevermisslead.com

**Body:**

```
Thanks for signing up with nevermisslead.com!

We need to confirm your SMS opt-in before your leads start coming through.

📱 CONFIRM SMS OPT-IN
Reply CONFIRM to this message or click below to verify:
[Confirmation Link]

By confirming, you agree to:
✓ Receive lead notifications via SMS
✓ Receive appointment reminders & updates
✓ Our Privacy Policy & Terms of Service

Questions? Reply HELP or contact us at support@cherysolutions.com

You can opt-out anytime by texting STOP.

---
nevermisslead.com
Chery Solutions LLC
```

---

## SMS Confirmation Message (Auto-send)

**After user confirms opt-in, send this SMS:**

```
✓ nevermisslead.com: Your SMS notifications are active! 
You'll receive lead alerts here. Text STOP to opt-out or 
HELP for support. Welcome aboard!
```

---

## Opt-Out Confirmation (Auto-reply)

**When user texts STOP:**

```
✓ nevermisslead.com: You've been unsubscribed from all SMS 
messages. You won't receive leads or alerts. To resubscribe, 
text START or visit nevermisslead.com. We hope to see you back!
```

---

## Opt-Out Help Message (Auto-reply)

**When user texts HELP:**

```
nevermisslead.com SMS Support:
• Text STOP = Unsubscribe from all messages
• Text START = Resubscribe to notifications
• Email: support@cherysolutions.com
• Phone: (678) 788-7281
```

---

## Implementation Checklist

- [ ] Add checkbox to signup form (unchecked by default)
- [ ] Link "Privacy Policy" text to /privacy page
- [ ] Make checkbox visible & readable (not hidden/collapsed)
- [ ] Include "Message and data rates may apply" text
- [ ] Include STOP/opt-out method in checkbox copy
- [ ] Test form validation (prevent submit without opt-in)
- [ ] Set up email confirmation flow
- [ ] Set up SMS confirmation response (Twilio auto-reply)
- [ ] Set up SMS HELP auto-reply
- [ ] Set up SMS STOP auto-reply
- [ ] Document all copy in Twilio campaign registration

---

**Twilio A2P 10DLC Compliance:** ✓ Explicit written consent ✓ Clear opt-out method ✓ Message rates disclosure ✓ Privacy policy link
