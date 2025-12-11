# SNEAKYLINK - INITIALIZER AGENT PROMPT
**Role**: Environment Setup Agent (First Session Only)  
**Goal**: Create foundation for all future coding agents  
**Based on**: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

---

## YOUR MISSION

You are the INITIALIZER AGENT for Sneakylink, a vendor compliance prep SaaS. Your job is to set up the environment so that future CODING AGENTS can work incrementally across many sessions without losing context.

**Critical**: You run ONCE. After you finish, CODING AGENTS take over.

---

## CONTEXT

### Project Overview
- **What**: B2B SaaS helping vendors prep compliance profiles once, export to any customer
- **Problem**: Vendors waste 60+ days on repetitive compliance for each customer
- **Solution**: 30 min first-time setup, 2 min repeats
- **Foundation**: Sneakylink (Next.js 15, Clerk, Supabase, Tailwind)
- **Theme**: Compliance Clarity (Trust Blue #2563eb, Success Green #10b981, professional B2B SaaS)

### Tech Stack
- Frontend: Next.js 15, React 19, Tailwind CSS, TypeScript
- Auth: Clerk
- Database: Supabase PostgreSQL
- Storage: Supabase Storage
- PDF: Puppeteer
- Deploy: Vercel

---

## YOUR TASKS (Complete ALL of these)

### 1. Clone Sneakylink Foundation
```bash
cd /Users/mufasa
git clone https://github.com/thehaitianmufasa/sneakylink.git sneakylink
cd sneakylink
```

### 2. Rename All References
- Update `package.json` name field: "sneakylink" → "sneakylink"
- Update `README.md` title and descriptions
- Search and replace "sneakylink" → "sneakylink" throughout codebase
- Update any hardcoded references

### 3. Create GitHub Repository
```bash
# Create new repo on GitHub (use GitHub CLI or web)
gh repo create sneakylink --public --source=. --remote=origin

# Or manually:
# 1. Go to github.com/thehaitianmufasa
# 2. Create new repo "sneakylink"
# 3. git remote add origin https://github.com/thehaitianmufasa/sneakylink.git

git add .
git commit -m "Initial commit: Sneakylink foundation renamed to Sneakylink"
git push -u origin main
```

### 4. Create `feature_list.json`

This is the MOST IMPORTANT file. It lists ALL features that need to be built.

Create `/sneakylink/feature_list.json` with this structure:

```json
{
  "features": [
    {
      "id": "onboarding-page1-layout",
      "category": "onboarding",
      "priority": 1,
      "description": "Onboarding Page 1 layout created with Compliance Clarity theme",
      "steps": [
        "Navigate to /onboarding",
        "Verify page loads",
        "Verify Trust Blue (#2563eb) used for primary elements",
        "Verify Inter Bold font for headers",
        "Verify responsive layout"
      ],
      "passes": false,
      "blocked_by": [],
      "notes": ""
    },
    {
      "id": "onboarding-company-name",
      "category": "onboarding",
      "priority": 2,
      "description": "Company name input field functional with validation",
      "steps": [
        "Navigate to /onboarding",
        "Enter company name",
        "Verify input saves to Supabase",
        "Test validation (required field)",
        "Verify error message styling (Danger Red #ef4444)"
      ],
      "passes": false,
      "blocked_by": ["onboarding-page1-layout"],
      "notes": ""
    },
    {
      "id": "onboarding-employee-count",
      "category": "onboarding",
      "priority": 3,
      "description": "Employee count input field functional with validation",
      "steps": [
        "Navigate to /onboarding",
        "Enter employee count",
        "Verify input saves to Supabase",
        "Test validation (must be positive integer)",
        "Verify number input type"
      ],
      "passes": false,
      "blocked_by": ["onboarding-page1-layout"],
      "notes": ""
    },
    {
      "id": "onboarding-work-types",
      "category": "onboarding",
      "priority": 4,
      "description": "Work type checkboxes (4 types) functional",
      "steps": [
        "Navigate to /onboarding",
        "Check 'Electrical Work'",
        "Check 'Work at Heights'",
        "Check 'Lockout/Tagout (LOTO)'",
        "Check 'Equipment Installation'",
        "Verify selections save to Supabase as jsonb array",
        "Test unchecking",
        "Verify at least one must be selected (validation)"
      ],
      "passes": false,
      "blocked_by": ["onboarding-page1-layout"],
      "notes": "Store as: ['electrical', 'heights', 'loto', 'equipment']"
    },
    {
      "id": "onboarding-progress-1of2",
      "category": "onboarding",
      "priority": 5,
      "description": "Progress indicator '1 of 2' visible on Page 1",
      "steps": [
        "Navigate to /onboarding",
        "Verify progress bar shows 50% (Success Green #10b981)",
        "Verify text shows '1 of 2'",
        "Verify sticky position at top on mobile"
      ],
      "passes": false,
      "blocked_by": ["onboarding-page1-layout"],
      "notes": ""
    },
    {
      "id": "onboarding-autosave",
      "category": "onboarding",
      "priority": 6,
      "description": "Auto-save to Supabase every 5 seconds",
      "steps": [
        "Navigate to /onboarding",
        "Enter company name",
        "Wait 5 seconds",
        "Verify 'Auto-saving...' indicator appears",
        "Check Supabase vendors table for saved data",
        "Refresh page and verify data persists"
      ],
      "passes": false,
      "blocked_by": ["onboarding-company-name", "onboarding-employee-count"],
      "notes": "Use debouncing to avoid excessive saves"
    },
    {
      "id": "onboarding-next-button",
      "category": "onboarding",
      "priority": 7,
      "description": "Next button navigates to Page 2 with validation",
      "steps": [
        "Navigate to /onboarding",
        "Click 'Next' without filling form",
        "Verify validation errors appear",
        "Fill company name, employee count, select work type",
        "Click 'Next'",
        "Verify navigation to Page 2"
      ],
      "passes": false,
      "blocked_by": ["onboarding-page1-layout", "onboarding-company-name", "onboarding-employee-count", "onboarding-work-types"],
      "notes": ""
    },
    {
      "id": "onboarding-page2-layout",
      "category": "onboarding",
      "priority": 8,
      "description": "Onboarding Page 2 layout created with Compliance Clarity theme",
      "steps": [
        "Navigate to /onboarding (complete Page 1)",
        "Click 'Next'",
        "Verify Page 2 loads",
        "Verify Trust Blue primary elements",
        "Verify responsive layout"
      ],
      "passes": false,
      "blocked_by": ["onboarding-next-button"],
      "notes": ""
    }
    // ... CONTINUE FOR ALL ~200 FEATURES
    // Include: questionnaire (30+ core questions + work-type specific)
    // Include: dashboard (score calculation, section breakdown)
    // Include: PDF export (customer management, Puppeteer generation)
    // Include: mobile optimization, testing, deployment
  ]
}
```

**CRITICAL**: You MUST create AT LEAST 200 features covering:
- Onboarding (15 features)
- Questionnaire (80+ features - 30 core + 50 work-type specific)
- Dashboard (20 features)
- PDF Export (30 features)
- Mobile Optimization (15 features)
- Testing (15 features)
- Deployment (10 features)
- Polish & Edge Cases (20 features)

### 5. Create `claude-progress.txt`

Create `/sneakylink/claude-progress.txt`:

```
# SNEAKYLINK - CODING AGENT PROGRESS LOG

## Session 0 (Initializer Agent) - [Current Date/Time]
STATUS: Initialization complete
COMPLETED:
- Cloned Sneakylink to /sneakylink
- Renamed all references sneakylink → sneakylink
- Created GitHub repo: https://github.com/thehaitianmufasa/sneakylink
- Created feature_list.json with 200+ features (all marked passes:false)
- Created this claude-progress.txt file
- Created init.sh script
- Applied Compliance Clarity theme to tailwind.config.js
- Set up database schema in Supabase
- Initial git commit pushed

NEXT STEPS FOR CODING AGENTS:
1. Read this file to understand what's been done
2. Read feature_list.json to find next priority feature
3. Run init.sh to start dev server
4. Work on ONE feature at a time
5. Test end-to-end with Puppeteer
6. Commit with descriptive message
7. Update this file with progress

NOTES:
- Foundation is clean Sneakylink clone
- All 200+ features ready to implement
- Database schema created (see /supabase/migrations/)
- Compliance Clarity theme configured in Tailwind
- Ready for first coding session
```

### 6. Create `init.sh` Script

Create `/sneakylink/init.sh`:

```bash
#!/bin/bash

# SNEAKYLINK - Development Server Startup Script
# Run this at the start of every coding session

echo "🚀 Starting Sneakylink development environment..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  WARNING: .env.local not found!"
    echo "Copy from /Users/mufasa/Desktop/SOP/PROJECT_SECRETS_REFERENCE.txt"
    exit 1
fi

# Start Supabase local (if needed)
# supabase start

# Start Next.js dev server
echo "🔥 Starting Next.js dev server on http://localhost:3000"
npm run dev
```

Make it executable:
```bash
chmod +x init.sh
```

### 7. Apply Compliance Clarity Theme to Tailwind

Edit `/sneakylink/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Compliance Clarity Theme
        'trust-blue': '#2563eb',
        'success-green': '#10b981',
        'warning-amber': '#f59e0b',
        'neutral-slate': '#475569',
        'light-bg': '#f8fafc',
        'danger-red': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### 8. Create Database Schema in Supabase

Create `/sneakylink/supabase/migrations/001_initial_schema.sql`:

```sql
-- Vendors table
CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE NOT NULL,
  company_name text NOT NULL,
  employee_count integer,
  work_types jsonb, -- ['electrical', 'heights', 'loto', 'equipment']
  address jsonb,
  contact jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Row Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own vendor profile"
  ON vendors FOR SELECT
  USING (clerk_user_id = auth.uid());

CREATE POLICY "Users can only update their own vendor profile"
  ON vendors FOR UPDATE
  USING (clerk_user_id = auth.uid());

CREATE POLICY "Users can insert their own vendor profile"
  ON vendors FOR INSERT
  WITH CHECK (clerk_user_id = auth.uid());

-- Questionnaire responses
CREATE TABLE questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  section text NOT NULL, -- 'core_safety', 'insurance', 'metrics', 'relationships', 'work_type'
  question_id text NOT NULL,
  answer jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own questionnaire responses"
  ON questionnaire_responses FOR SELECT
  USING (vendor_id IN (SELECT id FROM vendors WHERE clerk_user_id = auth.uid()));

-- Documents
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'ehs_policy', 'insurance_cert', 'training_records'
  file_path text NOT NULL,
  file_name text NOT NULL,
  uploaded_at timestamp DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Customers
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  last_exported_at timestamp,
  export_count integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Exports
CREATE TABLE exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  pdf_path text NOT NULL,
  compliance_score decimal,
  exported_at timestamp DEFAULT now()
);

ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
```

Run migration:
```bash
cd /sneakylink
supabase db push
```

### 9. Initial Git Commit

```bash
cd /sneakylink
git add .
git commit -m "feat: Initializer Agent setup complete

- Created feature_list.json with 200+ features
- Created claude-progress.txt for session tracking
- Created init.sh startup script
- Applied Compliance Clarity theme to Tailwind
- Created database schema with RLS policies
- Foundation ready for coding sessions"
git push
```

### 10. Document Theme in README

Update `/sneakylink/README.md` to include theme documentation:

```markdown
# Sneakylink - Vendor Compliance Prep SaaS

## Design System: Compliance Clarity Theme

### Colors
- **Trust Blue** (#2563eb): Primary actions, builds trust
- **Success Green** (#10b981): Completion indicators
- **Warning Amber** (#f59e0b): Action needed
- **Neutral Slate** (#475569): Body text
- **Light Background** (#f8fafc): Page backgrounds
- **Danger Red** (#ef4444): Critical items

### Typography
- Headers: Inter Bold
- Body: Inter Regular
- Monospace: JetBrains Mono

### Usage
```tsx
// Buttons
<button className="bg-trust-blue hover:bg-trust-blue/90 text-white">
  Primary Action
</button>

// Progress Bar
<div className="h-2 bg-light-bg rounded-full">
  <div className="h-full bg-success-green rounded-full" style={{width: '75%'}} />
</div>

// Status Badges
<span className="text-success-green">✓ Complete</span>
<span className="text-warning-amber">⚠ Action Needed</span>
```
```

---

## VERIFICATION CHECKLIST

Before you finish, verify ALL of these:

- [ ] Sneakylink cloned to `/sneakylink`
- [ ] All "sneakylink" references renamed to "sneakylink"
- [ ] GitHub repo created: `https://github.com/thehaitianmufasa/sneakylink`
- [ ] `feature_list.json` created with 200+ features (all `passes: false`)
- [ ] `claude-progress.txt` created with initialization summary
- [ ] `init.sh` script created and executable
- [ ] Compliance Clarity theme applied to `tailwind.config.js`
- [ ] Database schema created in `/supabase/migrations/001_initial_schema.sql`
- [ ] Migration run: `supabase db push`
- [ ] Initial git commit pushed
- [ ] README.md updated with theme documentation

---

## HANDOFF TO CODING AGENTS

Once you complete this, your job is DONE. Future CODING AGENTS will:
1. Read `claude-progress.txt` to understand what's been done
2. Read `feature_list.json` to find next priority feature (`passes: false`)
3. Run `init.sh` to start dev server
4. Work on ONE feature per session
5. Test end-to-end with Puppeteer
6. Mark feature as `passes: true` only after verified
7. Commit with descriptive message
8. Update `claude-progress.txt`
9. Repeat

**Remember**: You set the foundation. They build incrementally.

---

## CRITICAL REMINDERS

1. **200+ Features**: feature_list.json MUST have comprehensive coverage
2. **All Passes False**: Every feature starts as `passes: false`
3. **Git Commit**: Push initial commit so coding agents have clean starting point
4. **Theme Applied**: Tailwind config must have Compliance Clarity colors
5. **Database Ready**: Schema must be created and migrated

**DO NOT** skip any of these tasks. Future coding agents depend on this foundation.

---

**STATUS**: Ready to execute  
**NEXT**: Run this prompt, then hand off to CODING AGENT prompt
