# Product Requirements Document - NeverMissLead

**Version:** 1.0
**Date:** January 2025
**Status:** Active Development

---

## 1. Executive Summary

### Product Vision
NeverMissLead is a white-label SaaS platform that provides turn-key lead generation websites for contractor businesses. Each client receives a professionally designed, fully isolated website with integrated call tracking, lead capture, and SMS automation.

### Target Market
- HVAC contractors
- Plumbing services
- Electrical contractors
- Roofing companies
- Pool service companies
- General contractors

### Business Model
- **Setup Fee:** $497 (or free with 6-month commitment)
- **Monthly Subscription:** $297/month
- **Cost per Client:** ~$35/month
- **Target Profit:** $262/month per client
- **Included:** 1 hour/month of updates
- **Overage Rate:** $60/hour

---

## 2. Technical Architecture

### Stack Overview
| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js 14 + Tailwind CSS | Server-side rendering, performance |
| Database | Supabase (PostgreSQL) | Shared database with Row Level Security |
| Phone/SMS | Twilio | Call tracking + SMS automation |
| Hosting | Vercel | Zero-cost hosting (free tier) |
| Forms | React Hook Form + Zod | Client-side validation |
| Language | TypeScript | Type safety |

**Deployment Status:** ✅ nevermisslead.com is deployed on Vercel and synced to GitHub

### Multi-Tenancy Architecture Decision

**Decision:** Shared database with `client_id` foreign keys (NOT separate Supabase per client)

**Date:** January 2025

**Rationale:**
- ✅ **Scales to 1000+ clients** in single database
- ✅ **Lower costs:** $25/month total vs $25/client ($1,250/month for 50 clients)
- ✅ **Centralized analytics and monitoring:** Track platform-wide metrics
- ✅ **Single schema migration** affects all clients (vs 50 separate migrations)
- ✅ **Industry-standard SaaS pattern:** Proven at massive scale (Shopify, Salesforce, etc.)
- ✅ **Easier maintenance:** One database to manage, not dozens
- ⚠️ **Requires Row Level Security (RLS):** Must implement correctly
- ⚠️ **Data isolation via code:** Not physical separation

**Implementation:**
- Every table includes `client_id UUID NOT NULL REFERENCES clients(id)`
- Row Level Security (RLS) policies enforce data isolation
- API validates `client_id` on every request via RLS context
- Each client's data is logically isolated within shared database

**Trade-off Comparison:**

| Aspect | Shared DB (Chosen) | Separate DB per Client |
|--------|-------------------|----------------------|
| **Scalability** | ✅ 1000+ clients easily | ❌ Complex beyond 50 clients |
| **Cost** | ✅ $25/month total | ❌ $25/client ($1,250 for 50) |
| **Deployment** | ✅ Add row to clients table | ❌ Create new Supabase project |
| **Analytics** | ✅ Centralized dashboard | ❌ No cross-client insights |
| **Maintenance** | ✅ Single schema update | ❌ Update 50 separate DBs |
| **Data Isolation** | ⚠️ Via code + RLS | ✅ Physical separation |
| **Security Risk** | ⚠️ RLS must be perfect | ✅ Breach affects 1 client |
| **Offboarding** | ✅ Delete rows | ✅ Delete entire project |

**Security:** Row Level Security (RLS) ensures that clients can ONLY access their own data, even if there's a bug in application code.

### Client Isolation Strategy

**Critical Requirement:** Each client must be logically isolated.

| Resource | Isolation Method |
|----------|-----------------|
| Database | `client_id` foreign key + Row Level Security (RLS) |
| Phone Number | Unique Twilio number per client |
| Deployment | Shared Vercel project (all clients on nevermisslead.com or custom domains) |
| Domain | Client's custom domain OR nevermisslead.com/[slug] |
| Data Access | RLS policies enforce client_id context |

**Why This Architecture Works:**
- ✅ Client A's data never visible to Client B (enforced by RLS)
- ✅ Security breach contained by RLS policies
- ✅ Easy client offboarding (CASCADE delete on client_id)
- ✅ Simple credential management (single Supabase project)
- ✅ Compliance/privacy requirements met via RLS

---

## 3. Website Structure

### 12-Section Layout
(Based on https://royalpalmpoolco.org/)

#### Section 1: Header (Sticky)
- **Layout:** Logo (left) + Navigation (center) + Phone + CTA (right)
- **Behavior:** Sticky on scroll
- **Mobile:** Hamburger menu

#### Section 2: Hero
- **Layout:** Two-column (50/50)
  - Left: Headline + Subheadline + Description + Lead Form
  - Right: Hero image
- **Form Fields:**
  - Full Name (required)
  - Phone (optional)
  - Message (required)
  - Terms checkbox
  - Submit button
- **Mobile:** Stack vertically

#### Section 3: Trust Badges
- **Layout:** Single row, 5 badges
- **Examples:** "100% Local", "Licensed & Insured", "20+ Years", etc.
- **Style:** White text on primary color background

#### Section 4: About Us
- **Layout:** Two-column (60/40)
  - Left: Heading + paragraph text
  - Right: About image
- **Optional:** 3 circular stat badges below

#### Section 5: Services
- **Layout:** Responsive grid (3 cols desktop, 1 col mobile)
- **Count:** 8 service cards
- **Each Card:**
  - Service icon/image
  - Service title
  - Arrow icon
  - Click to details (future feature)

#### Section 6: Process
- **Layout:** 5 steps in horizontal flow
- **Each Step:**
  - Icon (circle)
  - Title
  - Connecting arrow to next step
- **Example:** "Call Us → Schedule → We Fix It → Inspection → Pay"

#### Section 7: Gallery
- **Layout:** Masonry grid (4 cols desktop, 2 cols mobile)
- **Content:** 8-12 before/after photos
- **Optional:** Lightbox on click

#### Section 8: Reviews
- **Layout:** Background image with overlay
- **Content:**
  - Heading (centered)
  - Google Reviews iframe embed
  - "Leave us a review" button
  - Star rating display

#### Section 9: FAQ
- **Layout:** Two-column (60/40)
  - Left: Accordion FAQ items (3-5 questions)
  - Right: FAQ image
- **Behavior:** Click to expand/collapse

#### Section 10: Service Areas
- **Layout:** Two-column (50/50)
  - Left: Google Maps embed
  - Right: List of areas served
- **Style:** Clean list, no bullets

#### Section 11: Final CTA
- **Layout:** Full-width section with background
- **Content:**
  - Large heading
  - Subheading
  - Prominent CTA button
  - Decorative images left/right

#### Section 12: Footer
- **Layout:** Five columns
  - Column 1: Logo + contact info + CTA button
  - Column 2: Business links
  - Column 3: Services list (all 8)
  - Column 4: Service areas
  - Column 5: Operating hours
- **Bottom Bar:** Privacy Policy | Terms & Conditions
- **Mobile:** Stack columns vertically

---

## 4. Design System

### Colors
```
Primary (Dark Teal): #234654
Secondary (Orange): #F5A05C
White: #FFFFFF
Light Gray: #F3F4F6
Dark Gray: #1F2937
Text: #374151
```

### Typography
- **Font Family:** Inter (sans-serif)
- **Headings:** Bold, uppercase for section titles
- **Body:** Regular weight, 16-18px
- **Buttons:** Semibold, 16px

### Spacing
- **Section Padding:** 80px top/bottom (40px mobile)
- **Container Max-Width:** 1200px
- **Column Gap:** 40-60px
- **Card Gap:** 30px

### Buttons

**Primary (Orange):**
- Background: #F5A05C
- Text: White
- Padding: 16px 32px
- Border Radius: 8px
- Hover: Darken + scale

**Phone (White with border):**
- Background: White
- Text: Primary color
- Border: 2px solid primary
- Hover: Invert colors

### Cards

**Service Cards:**
- Background: White
- Border: 1px solid light gray
- Border Radius: 12px
- Padding: 24px
- Hover: Orange border + shadow

**Trust Badges:**
- Background: Primary color
- Text: White
- Padding: 16px 24px
- Border Radius: 8px
- Text: Uppercase

### Responsive Breakpoints
- **Desktop:** 1024px+
- **Tablet:** 768px - 1023px
- **Mobile:** < 768px

---

## 5. Database Schema (Multi-Tenant)

### Table 0: clients (Master Tenant Table)
Tracks all clients in the platform.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active',  -- active, suspended, cancelled
  subscription_plan TEXT DEFAULT 'standard',  -- standard, premium
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example seed data
INSERT INTO clients (slug, business_name, phone, email)
VALUES ('nevermisslead-hvac', 'NeverMissLead HVAC', '(404) 555-HVAC', 'info@nevermisslead.com');
```

### Table 1: leads
Stores form submissions from the website.

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_type TEXT,
  message TEXT,
  source TEXT DEFAULT 'form',
  status TEXT DEFAULT 'new',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
```

### Table 2: call_logs
Tracks all calls to the Twilio tracking number.

```sql
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  call_sid TEXT UNIQUE,
  call_duration INTEGER,
  call_status TEXT,
  recording_url TEXT,
  call_direction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_call_logs_client_id ON call_logs(client_id);
CREATE INDEX idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX idx_call_logs_call_sid ON call_logs(call_sid);
```

### Table 3: sms_logs
Tracks all SMS messages.

```sql
CREATE TABLE sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  message_body TEXT,
  message_sid TEXT UNIQUE,
  sms_status TEXT,
  direction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sms_logs_client_id ON sms_logs(client_id);
CREATE INDEX idx_sms_logs_created_at ON sms_logs(created_at DESC);
CREATE INDEX idx_sms_logs_message_sid ON sms_logs(message_sid);
```

### Row Level Security (RLS) Policies

**Enable RLS on all tables:**
```sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
```

**Create isolation policies:**
```sql
-- Policy: Users can only see their client's data
CREATE POLICY "Isolate client data" ON leads
  FOR ALL
  USING (client_id = current_setting('app.current_client_id')::uuid);

CREATE POLICY "Isolate client data" ON call_logs
  FOR ALL
  USING (client_id = current_setting('app.current_client_id')::uuid);

CREATE POLICY "Isolate client data" ON sms_logs
  FOR ALL
  USING (client_id = current_setting('app.current_client_id')::uuid);
```

**How RLS Works:**
1. API sets context: `SET app.current_client_id = 'client-uuid'`
2. All queries automatically filtered by `client_id`
3. Client A can never see Client B's data
4. Works even if application code has bugs

---

## 6. API Endpoints

### POST /api/leads
Submit a new lead from the contact form.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone": "555-123-4567",
  "email": "john@example.com",
  "message": "Need AC repair"
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "uuid"
}
```

**Validation:**
- `full_name`: Required, min 2 chars
- `phone`: Optional, valid phone format
- `email`: Optional, valid email format
- `message`: Required, min 10 chars

### POST /api/twilio/voice
Twilio webhook for incoming calls.

**Behavior:**
1. Log call to `call_logs` table
2. Forward call to client's real phone number
3. Return TwiML to Twilio

**Response (TwiML):**
```xml
<Response>
  <Dial>(client's real phone number)</Dial>
</Response>
```

### POST /api/twilio/sms
Twilio webhook for incoming SMS.

**Behavior:**
1. Log SMS to `sms_logs` table
2. Send auto-response SMS
3. Notify client (future feature)

**Auto-Response Example:**
```
"Thanks for contacting [Business Name]! We received your message and will call you back within 30 minutes. For immediate service, call us at [real phone]."
```

### POST /api/twilio/status
Twilio webhook for call status updates.

**Behavior:**
1. Update `call_logs` with duration and final status
2. Trigger any post-call workflows (future)

---

## 7. Configuration System

### Client Config Format

Each client has a JSON file: `/config/clients/[slug].json`

**Example:**
```json
{
  "slug": "atlanta-hvac",
  "businessName": "Atlanta Emergency HVAC",
  "tagline": "24/7 Emergency HVAC Services",
  "email": "service@atlantahvac.com",
  "phone": "(404) 555-0100",
  "trackingPhone": "(404) 555-0123",
  "primaryColor": "#234654",
  "secondaryColor": "#F5A05C",
  "logo": "/clients/atlanta-hvac/logo.png",

  "hero": {
    "headline": "24/7 Emergency HVAC Services in Atlanta",
    "subheadline": "Fast Response • Expert Technicians • Fair Pricing",
    "description": "When your AC breaks in the Georgia heat...",
    "image": "/clients/atlanta-hvac/hero.jpg"
  },

  "about": {
    "heading": "About Us",
    "description": "With over 20 years of experience...",
    "image": "/clients/atlanta-hvac/about.jpg"
  },

  "services": [
    { "title": "Emergency AC Repair", "icon": "snowflake" },
    { "title": "Heating Installation", "icon": "flame" }
    // ... 6 more services
  ],

  "trustBadges": [
    "24/7 Emergency Service",
    "Licensed & Insured",
    "20+ Years Experience",
    "Same-Day Service",
    "100% Satisfaction Guaranteed"
  ],

  "faqs": [
    {
      "question": "How quickly can you respond?",
      "answer": "We respond within 1 hour for emergencies."
    }
    // ... more FAQs
  ],

  "serviceAreas": {
    "mapEmbed": "<iframe src='...'></iframe>",
    "areas": ["Midtown", "Buckhead", "Decatur"]
  },

  "hours": {
    "Mon": "24/7 Emergency Service",
    "Tue": "24/7 Emergency Service"
    // ... all days
  },

  "smsAutoResponse": "Thanks for contacting Atlanta Emergency HVAC! ...",

  "supabase": {
    "url": "https://xxxxx.supabase.co",
    "anonKey": "eyJhbGc..."
  }
}
```

### Environment Variables

**Per Client Deployment:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+14045550123

CLIENT_SLUG=atlanta-hvac

NEXT_PUBLIC_APP_URL=https://atlantahvac.com
```

---

## 8. Client Onboarding Process

### Phase 1: Information Gathering
**Tool:** Google Form (50 questions, 6 sections)

**Collected Information:**
1. **Business Information**
   - Business name
   - Contact info
   - Years in business
   - Service area

2. **Branding & Design**
   - Logo file upload
   - Color preferences
   - Design inspiration

3. **Website Content**
   - Hero headline/subheadline
   - About us paragraph
   - Services list (8 services)
   - FAQ questions (3-5)
   - Operating hours

4. **Photos & Media**
   - Hero image upload
   - About us image upload
   - Gallery images (8-12 photos)

5. **Integrations**
   - Google Maps embed code
   - Google Reviews URL
   - Phone number for forwarding
   - Preferred SMS auto-response

6. **Billing & Agreement**
   - Payment option selection
   - Agreement to terms

### Phase 2: Deployment
**Process:** Manual (for first 5 clients)

**Steps:**
1. Create Supabase project (5 min)
2. Purchase Twilio number (5 min)
3. Create client config file (10 min)
4. Upload client assets (5 min)
5. Deploy to Vercel (5 min)
6. Configure DNS (5 min)
7. Configure Twilio webhooks (5 min)
8. Test everything (5 min)
9. Deliver to client (5 min)

**Total Time:** 25-30 minutes

### Phase 3: Delivery
**Client Receives:**
- Live website URL
- Tracking phone number
- Dashboard login (future)
- Welcome email with instructions
- 48-hour follow-up

---

## 9. Feature Prioritization

### MVP (Phases 0-9)
- ✅ 12-section website layout
- ✅ Lead capture form → Supabase
- ✅ Twilio call forwarding
- ✅ SMS auto-response
- ✅ Client configuration system
- ✅ Manual deployment process
- ✅ Mobile responsive
- ✅ Performance optimized

### Version 1.1 (After 5 Clients)
- ⏳ Google Form → Config automation
- ⏳ Deployment scripts
- ⏳ Client registry dashboard
- ⏳ Cost tracking

### Version 2.0 (After 20 Clients)
- 📋 CLI deployment tool
- 📋 Central admin dashboard
- 📋 Client portal (view leads)
- 📋 Automated billing via Stripe
- 📋 Email notifications for leads
- 📋 Analytics dashboard

---

## 10. Quality Requirements

### Performance
- **Lighthouse Score:** 80+ (all metrics)
- **Page Load:** <3 seconds
- **Image Optimization:** <200KB per image
- **Mobile Responsive:** All sections

### Accessibility
- **WCAG 2.1:** AA compliance
- **Keyboard Navigation:** Full support
- **Screen Reader:** Semantic HTML
- **Color Contrast:** 4.5:1 minimum

### Security
- **HTTPS:** SSL on all domains
- **RLS:** Row-Level Security enabled
- **Env Vars:** No secrets in code
- **Input Validation:** Zod schemas
- **SQL Injection:** Parameterized queries

### SEO
- **Meta Tags:** Title, description, OG tags
- **Semantic HTML:** Proper heading hierarchy
- **Sitemap:** Auto-generated
- **Robots.txt:** Configured
- **Schema Markup:** LocalBusiness schema

---

## 11. Success Metrics

### Business KPIs
- **Clients Deployed:** Target 10 in first 3 months
- **Churn Rate:** <10% monthly
- **Deployment Time:** <30 minutes per client
- **Client Satisfaction:** 4.5+ stars

### Technical KPIs
- **Uptime:** 99.9%
- **Performance Score:** 80+ average
- **Form Conversion:** 5%+ of visitors
- **Lead Response Time:** Client responds within 30 min

---

## 12. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase project limit | High | Separate account per 10 clients |
| Twilio cost increase | Medium | Lock in pricing, monitor usage |
| Client data loss | Critical | Automated daily backups |
| Performance degradation | Medium | CDN, image optimization, caching |
| Security breach | Critical | Regular security audits, RLS |

---

## 13. Future Enhancements

### Dashboard Features
- Real-time lead notifications
- Call recording playback
- Lead analytics (conversion rates)
- Revenue tracking per client

### Marketing Features
- A/B testing for headlines
- Multi-language support
- Booking calendar integration
- Payment processing

### Automation
- Auto-generate blog content
- SEO optimization suggestions
- Automated social media posts
- Review request automation

---

**Document Status:** Living Document
**Next Review:** After Phase 9 completion
**Owner:** Jeff Chery, Chery Solutions LLC
