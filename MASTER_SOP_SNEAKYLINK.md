# 🚀 MASTER SOP - SNEAKYLINK (Vendor Compliance Prep SaaS)
**Project Type**: B2B SaaS - Vendor Compliance Preparation Platform  
**Foundation**: Sneakylink (Next.js 15, Clerk, Supabase, Tailwind)  
**Timeline**: 3-4 weeks to MVP  
**Target**: $10K MRR (35 customers @ $297/mo) by Month 6

---

## 📊 PROJECT OVERVIEW

### Core Problem
Vendors waste 60+ days (20+ hours) completing repetitive compliance onboarding for each customer (Veriforce, ISNetworld, Avetta, etc.)

### Our Solution
**Prep compliance profile ONCE (30 min) → Export to ANY customer (2 min/each)**

### Market Validation
- Direct access to Veriforce at Coca-Cola
- Pilot vendor list confirmed from Coke network
- No existing vendor-focused prep tools (all built for buyers)
- Contractors report onboarding takes weeks to months with each platform requiring separate docs

### Success Metrics
- Signup → completion: >95%
- Onboarding time: <2 min avg
- First profile completion: 30 min
- Repeat export time: <5 min
- 6-month retention: >80%
- Target: $10K MRR (35+ customers @ $297/mo)

---

## 🎨 DESIGN SYSTEM: COMPLIANCE CLARITY THEME

### Color Palette (High-Conversion B2B SaaS)
```
Trust Blue:      #2563eb  (Primary actions, builds trust/credibility)
Success Green:   #10b981  (Completion, reduces eye strain 18%)
Warning Amber:   #f59e0b  (Action needed, urgency without panic)
Neutral Slate:   #475569  (Body text, secondary)
Light Background:#f8fafc  (Page backgrounds)
White:           #ffffff  (Primary backgrounds, cards)
Danger Red:      #ef4444  (Critical items only - use sparingly)
```

### Typography
- **Headers**: Inter Bold
- **Body**: Inter Regular
- **Monospace**: JetBrains Mono

### Design Principles
1. **Status-Driven Colors**: ✓ Green = Done, ⚠ Amber = Action Needed
2. **Progressive Disclosure**: Always show % completion prominently
3. **Trust Signals**: Professional, enterprise-grade feel
4. **Mobile-First**: Large touch targets (min 44px), readable text (16px min)

### UI Component Specifications
**Buttons**:
- Primary: Trust Blue (#2563eb) white text, hover 10% darker
- Success: Green (#10b981)
- Secondary: Neutral Slate (#475569)

**Cards/Sections**:
- White background, shadow: `0 1px 3px 0 rgb(0 0 0 / 0.1)`
- Rounded: 8px, border: 1px solid #e2e8f0

**Progress Bars**:
- Background: #f8fafc, Fill: Success Green (#10b981), Height: 8px

**Forms**:
- Input borders: #e2e8f0, Focus: Trust Blue (#2563eb)
- Labels: Neutral Slate (#475569), Help text: #64748b

---

## 🏗️ TECHNICAL ARCHITECTURE

### Stack (Sneakylink Foundation)
```
Frontend:  Next.js 15 (App Router, Server Components)
           React 19
           Tailwind CSS
           TypeScript (strict mode)
           
Auth:      Clerk (email/password + OAuth)

Database:  Supabase PostgreSQL
           - Row Level Security enabled
           - Real-time capabilities
           
Storage:   Supabase Storage
           - Documents (policies, certificates)
           - Generated PDFs
           
PDF:       Puppeteer (robust for complex layouts)

Payments:  Stripe (CLI pre-installed in Sneakylink)

Deploy:    Vercel (zero-config)
```

### Database Schema
```sql
-- Vendors table
vendors (
  id uuid PRIMARY KEY,
  clerk_user_id text UNIQUE,
  company_name text,
  employee_count integer,
  work_types jsonb, -- ['electrical', 'heights', 'loto', 'equipment']
  address jsonb,
  contact jsonb,
  created_at timestamp,
  updated_at timestamp
)

-- Questionnaire responses
questionnaire_responses (
  id uuid PRIMARY KEY,
  vendor_id uuid REFERENCES vendors(id),
  section text, -- 'core_safety', 'insurance', 'metrics', 'relationships', 'work_type'
  question_id text,
  answer jsonb,
  created_at timestamp,
  updated_at timestamp
)

-- Documents
documents (
  id uuid PRIMARY KEY,
  vendor_id uuid REFERENCES vendors(id),
  category text, -- 'ehs_policy', 'insurance_cert', 'training_records'
  file_path text,
  file_name text,
  uploaded_at timestamp
)

-- Customers
customers (
  id uuid PRIMARY KEY,
  vendor_id uuid REFERENCES vendors(id),
  customer_name text,
  last_exported_at timestamp,
  export_count integer DEFAULT 0,
  created_at timestamp
)

-- Exports
exports (
  id uuid PRIMARY KEY,
  vendor_id uuid REFERENCES vendors(id),
  customer_id uuid REFERENCES customers(id),
  pdf_path text,
  compliance_score decimal,
  exported_at timestamp
)
```

---

## 📋 MVP FEATURE SCOPE

### Phase 1: Onboarding (2 pages, <2 min)
**Page 1: Company + Work Types**
- Company name input
- Employee count input
- Work type checkboxes (4 types):
  - ✓ Electrical Work
  - ✓ Work at Heights
  - ✓ Lockout/Tagout (LOTO)
  - ✓ Equipment Installation
- Progress indicator "1 of 2"
- Auto-save to Supabase

**Page 2: Contact & Address**
- Address fields (street, city, state, postal)
- Contact person (name, email, phone)
- Website (optional)
- Progress indicator "2 of 2"
- "Start My Compliance Profile" button

### Phase 2: Smart Questionnaire (30 core questions + work-type specific)
**6 Sections**:
1. Core Safety (8 questions)
2. Insurance (5 questions)
3. Employees & Safety Metrics (8 questions)
4. Relationships (3 questions)
5. Work-Type Specific (10-15 questions per type selected)
6. Summary & Review

**Features**:
- Smart branching (if/then logic)
- Inline document uploads (drag-drop)
- Help text tooltips (? icons)
- Progress bar (always visible)
- Auto-save every 5 seconds
- Back/Next navigation
- Section jump capability

**Question Types**:
- Yes/No (radio buttons)
- Dropdowns (coverage type, state)
- Date pickers (expiry dates)
- Number inputs (employees, hours)
- Text areas (descriptions)
- Document uploads (inline)
- Checkboxes (equipment lists)

### Phase 3: Compliance Dashboard
**Layout**:
- Overall compliance % (large visual indicator)
- Section breakdown cards:
  - ✓ Core Safety (8/8)
  - ⚠ Insurance (3/5 - needs 2)
  - ✓ Electrical Work (12/12)
  - etc.
- Missing items checklist
- Action buttons:
  - [Review Questionnaire]
  - [Update Documents]
  - [Export for Customer]
  - [Add More Customers]

**Score Calculation**:
- % complete per section
- Overall weighted score
- Identify missing required items
- Generate action list

### Phase 4: PDF Export Engine
**Customer Management**:
- Add/edit customers
- Customer selection dropdown
- Track export history
- Show last export date per customer

**PDF Generation** (Puppeteer):
- Cover page: vendor info + compliance score
- Page 1: Executive summary, company info, work types
- Pages 2+: Questionnaire answers by section
- Document references
- Final page: Generation date, validity period

**Export Flow**:
1. Click "Export for Customer"
2. Select customer (dropdown or add new)
3. Auto-generate PDF
4. Download + "View in Browser" option
5. Success confirmation

**Request Additional Questions**:
- Email template generator
- Pre-filled professional message
- Copy to clipboard
- Optional send email

### Phase 5: Repeat & Maintenance
- Add new customers
- Re-export for existing customers (<5 min)
- Track last export date
- Validation: repeat time <5 min

---

## 🤖 AUTONOMOUS AGENT ARCHITECTURE

### Based on: [Anthropic's Long-Running Agent Best Practices](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### Initializer Agent (First Session Only)
**Purpose**: Set up environment for all future coding agents

**Tasks**:
1. Create `feature_list.json` with 200+ features (all marked "failing" initially)
2. Create `claude-progress.txt` for session-to-session updates
3. Create `init.sh` script to start dev server
4. Initial git commit showing what files were added
5. Set up project structure following Sneakylink architecture

**Feature List Example**:
```json
{
  "category": "onboarding",
  "description": "User can complete Page 1 (company + work types) in <2 min",
  "steps": [
    "Navigate to onboarding",
    "Enter company name",
    "Enter employee count",
    "Select work types",
    "Click Next",
    "Verify progress shows 1/2"
  ],
  "passes": false
}
```

### Coding Agent (All Subsequent Sessions)
**Purpose**: Make incremental progress, leave clean state

**Session Start Protocol**:
1. Run `pwd` to confirm working directory
2. Read `claude-progress.txt` to understand recent work
3. Read `git log --oneline -20` to see commit history
4. Read `feature_list.json` to identify next priority feature
5. Run `init.sh` to start dev server
6. Test basic functionality (ensure app not broken)
7. Choose ONE feature to work on this session

**Session Work Protocol**:
1. Work on ONLY ONE feature at a time
2. Test feature end-to-end using browser automation (Puppeteer)
3. Only mark feature as `"passes": true` after verified testing
4. Never remove or edit feature descriptions (only change "passes" field)

**Session End Protocol**:
1. Commit changes to git with descriptive message
2. Update `claude-progress.txt` with:
   - What was accomplished
   - What feature was completed
   - Any blockers or notes for next session
3. Ensure code is in clean, merge-ready state
4. Verify no broken functionality

**Critical Rules**:
- ❌ NEVER one-shot multiple features
- ❌ NEVER declare project complete while features remain
- ❌ NEVER mark features passing without end-to-end testing
- ❌ NEVER remove/edit features from feature_list.json
- ✅ ALWAYS work incrementally (one feature per session)
- ✅ ALWAYS test as a human user would (browser automation)
- ✅ ALWAYS leave clean git commits and progress notes

---

## 🎯 PHASE-BY-PHASE BREAKDOWN

### PHASE 1: Foundation & Design System (Week 1)
**Duration**: 13 hours

**Tasks**:
1. Clone Sneakylink to /sneakylink
2. Rename all references sneakylink → sneakylink
3. Create GitHub repo: `sneakylink`
4. Apply Compliance Clarity theme to Tailwind config
5. Create design tokens (colors, typography, spacing)
6. Build reusable UI components (Button, Card, ProgressBar, StatusBadge)
7. Configure Clerk auth
8. Link Supabase database
9. Set up environment variables
10. Create database schema with RLS policies

**Deliverable**: Themed foundation, database live, auth working

### PHASE 2: Onboarding Flow (Week 1-2)
**Duration**: 14 hours

**Tasks**:
1. Build Page 1 layout (company + work types)
2. Form validation
3. Auto-save to Supabase
4. Build Page 2 layout (contact + address)
5. Progress indicators
6. Navigation between pages
7. Redirect to questionnaire

**Deliverable**: 2-page onboarding, <2 min completion

### PHASE 3: Smart Questionnaire Engine (Week 2)
**Duration**: 28 hours

**Tasks**:
1. Questionnaire data model
2. 6 sections (Core Safety, Insurance, Metrics, Relationships, Work-Type, Summary)
3. Smart branching logic
4. Question components (Yes/No, Dropdown, Date, Number, Text, Document, Checkboxes)
5. Auto-save every 5 seconds
6. Back/Next navigation
7. Section jump

**Deliverable**: Full questionnaire with branching, docs, auto-save

### PHASE 4: Compliance Dashboard (Week 3)
**Duration**: 17 hours

**Tasks**:
1. Dashboard layout
2. Compliance % calculation
3. Section breakdown cards
4. Color-coded status
5. Missing items checklist
6. Action buttons

**Deliverable**: Dashboard with score, clear actions

### PHASE 5: PDF Export Engine (Week 3)
**Duration**: 22 hours

**Tasks**:
1. Customer management
2. Puppeteer PDF generation
3. PDF template with theme
4. Export flow
5. Request additional questions feature

**Deliverable**: Working export, professional PDFs

### PHASE 6: Repeat & Polish (Week 4)
**Duration**: 28 hours

**Tasks**:
1. Repeat export flow
2. Mobile optimization
3. Error handling
4. Performance polish
5. Deployment

**Deliverable**: Production-ready app

---

## 🧪 TESTING STRATEGY

### End-to-End Testing (Puppeteer)
**Every feature MUST be tested as a human user would**

**Critical Test Cases**:
- Onboarding completion time <2 min
- Questionnaire auto-save works
- Document upload/preview/delete works
- Dashboard score calculation accurate
- PDF generation produces professional output
- Repeat export takes <5 min
- Mobile usability verified

---

## 📦 DEPLOYMENT

### Vercel Deployment
```bash
vercel --prod
```

**Environment Variables** (from PROJECT_SECRETS_REFERENCE.txt):
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY

---

## 📈 SUCCESS METRICS

### MVP Launch Metrics
- Signup → completion: >95%
- Onboarding time: <2 min avg
- Questionnaire completion: >90%
- Time to first export: 30 min
- Repeat export: <5 min
- 6-month retention: >80%

### Revenue Metrics
- MRR: $10K (35+ customers @ $297/mo)
- Customer acquisition: 5-10 in first 2 months
- Churn rate: <10% monthly

---

## 🚨 CRITICAL SUCCESS FACTORS

### What Makes This Work
1. Incremental Progress (ONE feature per session)
2. Clean State (working code + git commit every session)
3. End-to-End Testing (browser automation)
4. Clear Documentation (claude-progress.txt + feature_list.json)
5. Theme Consistency (Compliance Clarity everywhere)
6. Vendor-First Design (smooth, simple, easy)

### What Will Cause Failure
1. ❌ One-shotting multiple features
2. ❌ Skipping end-to-end testing
3. ❌ Leaving broken/undocumented code
4. ❌ Removing features from feature_list.json
5. ❌ Ignoring mobile responsiveness
6. ❌ Creating confusing UX

---

**Last Updated**: December 10, 2025  
**Status**: Ready for autonomous agent execution  
**Foundation**: Sneakylink + Anthropic's long-running agent architecture
