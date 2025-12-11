# PRP: Simple Admin CRM Dashboard
**Project:** NeverMissLead Template  
**Repository:** thehaitianmufasa/nevermisslead-template  
**Date:** November 24, 2025  
**Estimated Time:** 90 minutes

---

## 🎯 OBJECTIVE
Build password-protected admin dashboard at `/admin` showing all leads (forms + calls) with click-to-call functionality, lead details, source tracking, and basic CRM features.

---

## 📋 USER STORIES

### Story 1: View All Leads
**As a** business owner  
**I want** to see all my leads in one place  
**So that** I can track who contacted me and how

**Acceptance Criteria:**
- Shows form submissions AND call logs in unified view
- Displays: Name, phone, email, source (hero form/quote modal/phone call), timestamp
- Sortable by date (newest first default)
- Filter by source type (all/forms/calls)
- Mobile responsive

### Story 2: Click-to-Call from Dashboard
**As a** business owner  
**I want** to click a button to call leads back  
**So that** I don't have to manually dial and lead sees business number

**Acceptance Criteria:**
- "Call" button next to each lead with phone number
- Click → Twilio calls owner's phone
- Owner answers → connected to lead
- Lead sees business number (not personal)
- Call logged automatically with timestamp

### Story 3: Lead Details & Notes
**As a** business owner  
**I want** to see lead details and add notes  
**So that** I can remember conversation context

**Acceptance Criteria:**
- Click lead → expands to show full details
- Form leads: Shows service requested, message, address
- Call leads: Shows voicemail transcription, call duration, recording URL
- Add/edit notes field (saved to database)
- Notes persist across sessions

### Story 4: Secure Access
**As a** business owner  
**I want** the dashboard password-protected  
**So that** only I can see my leads

**Acceptance Criteria:**
- `/admin` requires password to access
- Simple password auth (no complex user system needed)
- Session persists for 24 hours
- Logout button
- Password set via environment variable

---

## 🏗️ TECHNICAL DESIGN

### Architecture Overview
```
/admin
├─ Login Page (if not authenticated)
├─ Dashboard Page (after login)
│  ├─ Lead List Table
│  │  ├─ Forms (from contacts table)
│  │  ├─ Calls (from calls table)
│  │  └─ Unified view with source badges
│  ├─ Click-to-Call Button
│  │  └─ Triggers Twilio outbound call API
│  └─ Lead Detail Modal
│     ├─ Full contact info
│     ├─ Notes field (editable)
│     └─ Call history
└─ API Routes
   ├─ /api/admin/auth (login/logout)
   ├─ /api/admin/leads (fetch all leads)
   ├─ /api/admin/call (trigger click-to-call)
   └─ /api/admin/notes (save lead notes)
```

### Database Schema

#### Update `contacts` table
```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
-- Status: 'new', 'contacted', 'qualified', 'closed', 'lost'
```

#### Update `calls` table
```sql
ALTER TABLE calls ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS callback_completed BOOLEAN DEFAULT false;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS callback_at TIMESTAMP WITH TIME ZONE;
```

#### Create `admin_sessions` table (simple auth)
```sql
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
```

---

## 🎨 UI/UX DESIGN

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  🏠 NeverMissLead Admin     [Filter: All ▼]  [Logout]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Quick Stats                                         │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │ 47 Total │ 12 Today │ 8 New    │ 92% Call│        │
│  │ Leads    │ Leads    │ Unread   │ Answer  │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
│                                                          │
│  📋 Recent Leads                          [Export CSV]  │
│  ┌────────────────────────────────────────────────────┐│
│  │ Name          Phone        Source    Time     Action││
│  ├────────────────────────────────────────────────────┤│
│  │ 🔴 John Smith  404-555-1234  📞 Call   2m ago  [Call]││
│  │ Sarah Jones   678-555-5678  📝 Form   1h ago  [Call]││
│  │ Mike Wilson   770-555-9999  📞 Call   3h ago  [Call]││
│  │ ...                                               ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Lead Detail Modal
```
┌─────────────────────────────────────────────┐
│  Lead Details                          [X]  │
├─────────────────────────────────────────────┤
│  👤 John Smith                              │
│  📞 (404) 555-1234          [Call Now]      │
│  📧 john@example.com                        │
│  📍 Atlanta, GA 30308                       │
│                                             │
│  Source: Phone Call (Incoming)              │
│  Time: Nov 24, 2025 2:45 PM                │
│  Status: [New ▼]                           │
│                                             │
│  📝 Voicemail Transcription:                │
│  "Hi, I need HVAC repair urgently..."      │
│                                             │
│  🎵 Recording: [Play ▶]                     │
│                                             │
│  📝 Notes:                                  │
│  ┌─────────────────────────────────────┐   │
│  │ Called back at 3pm, scheduled       │   │
│  │ for tomorrow 9am                    │   │
│  └─────────────────────────────────────┘   │
│                     [Save Notes]            │
└─────────────────────────────────────────────┘
```

---

## 🔧 FILES TO CREATE

### 1. `/app/admin/page.tsx` (Main Dashboard)
**Purpose:** Password-protected admin interface  
**Features:**
- Login form (if not authenticated)
- Lead list table (unified forms + calls)
- Filter dropdown (all/forms/calls/today)
- Quick stats cards
- Click-to-call buttons
- Lead detail modal

### 2. `/app/admin/login/page.tsx` (Login Page)
**Purpose:** Simple password authentication  
**Features:**
- Password input field
- Submit button
- Error messages
- Session cookie creation

### 3. `/app/api/admin/auth/route.ts` (Auth API)
**Endpoints:**
- `POST /api/admin/auth/login` - Verify password, create session
- `POST /api/admin/auth/logout` - Destroy session
- `GET /api/admin/auth/verify` - Check if session valid

### 4. `/app/api/admin/leads/route.ts` (Leads API)
**Endpoints:**
- `GET /api/admin/leads` - Fetch all leads (forms + calls merged)
- Query params: `?source=all|forms|calls&date=today|week|month`

### 5. `/app/api/admin/call/route.ts` (Click-to-Call)
**Endpoint:**
- `POST /api/admin/call` - Trigger Twilio outbound call
- Body: `{ leadPhone: string, leadName: string }`
- Logic:
  1. Call owner's phone first
  2. When answered, connect to lead
  3. Log callback in database

### 6. `/app/api/admin/notes/route.ts` (Notes API)
**Endpoints:**
- `POST /api/admin/notes` - Save/update lead notes
- Body: `{ leadId: string, leadType: 'contact'|'call', notes: string }`

### 7. `/components/admin/LeadTable.tsx` (Lead List)
**Props:** `{ leads: Lead[], onCallClick: (lead) => void }`  
**Features:**
- Sortable columns
- Source badges (visual indicators)
- Status indicators (new/contacted/etc)
- Click-to-call buttons
- Row click → open detail modal

### 8. `/components/admin/LeadDetailModal.tsx` (Detail View)
**Props:** `{ lead: Lead, onClose: () => void }`  
**Features:**
- Full lead information display
- Voicemail player (if call)
- Notes textarea with save
- Status dropdown
- Call history timeline

### 9. `/lib/admin/auth.ts` (Auth Helpers)
**Functions:**
- `verifyPassword(password: string): boolean`
- `createSession(clientId: string): string`
- `verifySession(token: string): boolean`
- `destroySession(token: string): void`

### 10. `/lib/admin/leads.ts` (Lead Data Helpers)
**Functions:**
- `getAllLeads(clientId: string, filters: object): Lead[]`
- `mergeForms AndCalls(forms: [], calls: []): Lead[]`
- `formatLeadForDisplay(lead: Lead): DisplayLead`

---

## 🔐 AUTHENTICATION

### Simple Password Auth (No User System)
```typescript
// Environment Variable
ADMIN_PASSWORD="your-secure-password-here"

// Session Flow
1. User enters password at /admin/login
2. Server verifies against ADMIN_PASSWORD
3. Creates session token (UUID)
4. Stores in admin_sessions table with 24h expiry
5. Sets httpOnly cookie
6. All /admin/* routes check cookie
```

**Security:**
- httpOnly cookies (prevent XSS)
- 24-hour session expiry
- CSRF token on forms (optional, recommended)
- Rate limiting on login (5 attempts/hour)

---

## 🎯 CLICK-TO-CALL IMPLEMENTATION

### Twilio Outbound Call Flow
```typescript
// When admin clicks "Call" button:

1. POST to /api/admin/call with { leadPhone, leadName }

2. Server makes Twilio API call:
   client.calls.create({
     to: OWNER_PHONE_NUMBER,        // Call admin first
     from: TWILIO_NUMBER,            // Business number
     url: `${BASE_URL}/api/twilio/connect-lead`, // TwiML
     statusCallback: `${BASE_URL}/api/twilio/callback-status`
   })

3. Admin's phone rings

4. Admin answers → TwiML at /api/twilio/connect-lead:
   <Response>
     <Say>Connecting you to {leadName}</Say>
     <Dial>{leadPhone}</Dial>
   </Response>

5. Lead's phone rings, sees business number

6. Both connected, call logged with callback_completed=true
```

---

## 📊 LEAD DATA STRUCTURE

### Unified Lead Interface
```typescript
interface Lead {
  id: string;
  type: 'form' | 'call';
  name: string;
  phone: string;
  email?: string;
  source: 'hero_form' | 'quote_modal' | 'pricing_form' | 'phone_call';
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
  created_at: string;
  notes?: string;
  
  // Form-specific
  service_requested?: string;
  message?: string;
  address?: string;
  
  // Call-specific
  call_duration?: number;
  voicemail_url?: string;
  transcription?: string;
  dial_status?: string;
  callback_completed?: boolean;
  callback_at?: string;
}
```

---

## 🧪 TESTING PLAN

### Test Case 1: Admin Login
1. Navigate to `/admin`
2. Should redirect to `/admin/login`
3. Enter correct password
4. Should redirect to `/admin` dashboard
5. Verify session cookie set
6. Refresh page → still logged in

### Test Case 2: View Leads
1. Login to admin
2. Should see list of all leads (forms + calls)
3. Verify correct count in stats
4. Click filter dropdown → filter by source
5. Should update lead list

### Test Case 3: Click-to-Call
1. Click "Call" button on a lead
2. Admin's phone should ring within 2 seconds
3. Answer admin phone
4. Should hear "Connecting you to [Lead Name]"
5. Lead's phone rings, sees business number
6. Both connect successfully
7. Check database: `callback_completed = true`

### Test Case 4: Lead Notes
1. Click on a lead row
2. Modal opens with lead details
3. Type notes in textarea: "Scheduled for tomorrow 9am"
4. Click "Save Notes"
5. Close modal, reopen same lead
6. Notes should persist

### Test Case 5: Session Expiry
1. Login to admin
2. Wait 24 hours (or manually expire session in DB)
3. Try to access `/admin`
4. Should redirect to login page
5. Session cookie should be cleared

---

## 🚀 DEPLOYMENT CHECKLIST

### Phase 1: Database Setup (10 min)
- [ ] Create migration `008_admin_crm_tables.sql`
- [ ] Add columns to `contacts` and `calls` tables
- [ ] Create `admin_sessions` table
- [ ] Run migration on dev Supabase
- [ ] Update TypeScript types

### Phase 2: Authentication (20 min)
- [ ] Create `/lib/admin/auth.ts` helpers
- [ ] Create `/app/api/admin/auth/route.ts`
- [ ] Create `/app/admin/login/page.tsx`
- [ ] Test login flow locally
- [ ] Verify session cookies work

### Phase 3: Leads API (15 min)
- [ ] Create `/lib/admin/leads.ts` data helpers
- [ ] Create `/app/api/admin/leads/route.ts`
- [ ] Query both `contacts` and `calls` tables
- [ ] Merge and sort by timestamp
- [ ] Test API returns correct data

### Phase 4: Dashboard UI (25 min)
- [ ] Create `/components/admin/LeadTable.tsx`
- [ ] Create `/components/admin/LeadDetailModal.tsx`
- [ ] Create `/app/admin/page.tsx` main layout
- [ ] Add quick stats cards
- [ ] Add filter dropdown
- [ ] Test responsive design

### Phase 5: Click-to-Call (15 min)
- [ ] Create `/app/api/admin/call/route.ts`
- [ ] Create `/app/api/twilio/connect-lead/route.ts` (TwiML)
- [ ] Integrate with LeadTable "Call" buttons
- [ ] Test full call flow locally
- [ ] Verify database logging

### Phase 6: Notes System (10 min)
- [ ] Create `/app/api/admin/notes/route.ts`
- [ ] Add notes textarea to LeadDetailModal
- [ ] Implement save functionality
- [ ] Test notes persist across sessions

### Phase 7: Production Deploy (5 min)
- [ ] Add `ADMIN_PASSWORD` to Vercel env vars
- [ ] Run database migration on production
- [ ] Push to GitHub
- [ ] Verify deployment successful
- [ ] Test login on production URL

---

## 🔒 SECURITY CONSIDERATIONS

### Password Storage
- Never store password in database
- Only compare hashed password from env var
- Use bcrypt or similar for comparison (optional, env var is simple)

### Session Management
- httpOnly cookies prevent JavaScript access
- Secure flag in production (HTTPS only)
- 24-hour expiry prevents stale sessions
- Clean up expired sessions daily (cron job)

### API Protection
- All `/api/admin/*` routes check session
- Return 401 if unauthorized
- Rate limiting on sensitive endpoints
- CORS restrictions (same-origin only)

---

## 📈 FUTURE ENHANCEMENTS (Not in Scope)

- Email notifications when new lead arrives
- SMS notifications for high-value leads
- Export leads to CSV
- Lead assignment (if multiple team members)
- Calendar integration for scheduling
- Automated follow-up sequences
- Lead scoring (hot/warm/cold)
- Integration with Stripe for payment tracking

---

## 💰 COST IMPACT

**Per Click-to-Call:**
- Twilio outbound call to admin: $0.013/min
- Twilio outbound call to lead: $0.013/min
- Average 3-minute call: ~$0.08

**Monthly (assuming 50 callbacks):**
- 50 callbacks × $0.08 = $4.00
- Negligible cost vs convenience

---

## ✅ SUCCESS CRITERIA

This PRP is complete when:
1. ✅ Admin can login with password at `/admin`
2. ✅ Dashboard shows all leads (forms + calls unified)
3. ✅ Click-to-call works: admin → lead connection
4. ✅ Lead details modal shows full info
5. ✅ Notes can be saved and persist
6. ✅ Session lasts 24 hours, then re-login required
7. ✅ Mobile responsive (view leads on phone)
8. ✅ All existing features still work (no regressions)

---

## 📚 REFERENCES

### Twilio Docs
- [Making Outbound Calls](https://www.twilio.com/docs/voice/api/call-resource#create-a-call-resource)
- [TwiML Dial Verb](https://www.twilio.com/docs/voice/twiml/dial)

### Next.js Docs
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Middleware (Session Check)](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### Supabase Docs
- [Query Joins](https://supabase.com/docs/guides/database/joins-and-nested-tables)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

---

**END OF PRP**

**Next Step:** Provide to Claude Code:
```bash
Read ADMIN_CRM_DASHBOARD_PRP.md and implement the admin dashboard. Start with Phase 1: database setup.
```
