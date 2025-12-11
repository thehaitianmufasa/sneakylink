# 🗄️ SUPABASE CLIENT SETUP GUIDE
**Complete guide for adding new clients to the shared Supabase database**

---

## 📊 OVERVIEW

### Supabase Architecture for NeverMissLead

**ONE Database, Multiple Clients**:
- ✅ All clients share the SAME Supabase project
- ✅ Data isolation via Row Level Security (RLS)
- ✅ Each client has unique `client_id` (UUID)
- ✅ Queries automatically filter by `client_id`
- ✅ **Cost**: $25/month TOTAL (not per client!)

### Database Tables
1. **`clients`** - Master table of all clients
2. **`leads`** - Lead submissions (filtered by `client_id`)
3. **`call_logs`** - Call tracking data (filtered by `client_id`)
4. **`sms_logs`** - SMS tracking data (filtered by `client_id`)
5. **`sms_consent_audit`** - A2P 10DLC compliance logs

---

## 🔧 PART 1: SUPABASE ACCOUNT SETUP (One-Time)

### ☐ Step 1.1: Create Supabase Project
- [ ] Go to: https://app.supabase.com
- [ ] Sign up with business email
- [ ] Click "New Project"
- [ ] Project details:
  - **Name**: nevermisslead-production
  - **Database Password**: [Generate strong password]
  - **Region**: us-east-1 (or closest to clients)
  - **Plan**: Pro ($25/month)
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for provisioning
- [ ] **Time: 5 min**

### ☐ Step 1.2: Get API Credentials
- [ ] Navigate to: Project Settings → API
- [ ] Copy credentials:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **Anon/Public Key**: `eyJhbGc...` (safe to expose)
  - **Service Role Key**: `eyJhbGc...` (KEEP SECRET!)
- [ ] Save to `PROJECT_SECRETS_REFERENCE.txt`:
  ```
  SUPABASE CREDENTIALS:
  Project URL: https://xxxxx.supabase.co
  Anon Key: eyJhbGc... (public)
  Service Role Key: eyJhbGc... (SECRET!)
  Database Password: [password]
  ```
- [ ] **Time: 2 min**

### ☐ Step 1.3: Run Database Schema Migration
- [ ] Navigate to: SQL Editor in Supabase dashboard
- [ ] Open `/sql/schema.sql` from repository
- [ ] Copy entire SQL script
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" or press Cmd+Enter
- [ ] **Expected**: 4 tables created + RLS policies enabled
- [ ] **Time: 2 min**

### ☐ Step 1.4: Run SMS Consent Migration (A2P 10DLC)
- [ ] Open `/sql/sms_consent_migration.sql` from repository
- [ ] Copy entire SQL script
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run"
- [ ] **Expected**:
  - 6 new columns added to `leads` table
  - `sms_consent_audit` table created
  - 7 indexes created
  - Helper functions created
- [ ] **Time: 1 min**

### ☐ Step 1.5: Verify Schema
- [ ] Navigate to: Table Editor
- [ ] Verify tables exist:
  - [x] `clients` (slug, business_name, phone, email, etc.)
  - [x] `leads` (client_id, full_name, phone, email, etc.)
  - [x] `call_logs` (client_id, twilio_call_sid, etc.)
  - [x] `sms_logs` (client_id, twilio_message_sid, etc.)
  - [x] `sms_consent_audit` (lead_id, action, timestamp, etc.)
- [ ] Click on `clients` table → Should be empty (no data yet)
- [ ] **Time: 1 min**

**✅ One-Time Setup Complete** → Database ready for clients

---

## 👤 PART 2: ADD NEW CLIENT (Per Client)

### Method A: Via Supabase Dashboard (Recommended)

#### ☐ Step 2.1: Open Clients Table
- [ ] Log in to Supabase: https://app.supabase.com
- [ ] Select project: nevermisslead-production
- [ ] Navigate to: Table Editor → `clients` table
- [ ] **Time: 30 sec**

#### ☐ Step 2.2: Insert New Client Row
- [ ] Click "Insert" → "Insert row"
- [ ] Fill in client details:
  ```
  slug: "client-slug"
    → Lowercase, no spaces
    → Example: "atlanta-plumbing", "metro-hvac"

  business_name: "Business Display Name"
    → Example: "AquaPro Plumbing"

  phone: "(xxx) xxx-xxxx"
    → From intake form

  email: "info@clientbusiness.com"
    → From intake form

  status: "trial"
    → Options: trial, active, inactive, suspended

  twilio_phone_number: null
    → Leave empty for now (add after Twilio setup)

  twilio_forward_to: "+1xxxxxxxxxx"
    → Client's real phone number (optional)

  custom_domain: "clientdomain.com"
    → Leave empty until DNS configured

  vercel_project_id: null
    → Leave empty for now

  monthly_price: 297.00
    → Standard pricing

  setup_fee: 497.00
    → Or 0.00 if waived with 6-month commitment
  ```
- [ ] **Time: 2 min**

#### ☐ Step 2.3: Save and Copy Client ID
- [ ] Click "Save"
- [ ] **IMPORTANT**: Copy the auto-generated `id` (UUID)
  - Example: `f47ac10b-58cc-4372-a567-0e02b2c3d479`
- [ ] Save this UUID to:
  1. `PROJECT_SECRETS_REFERENCE.txt`
  2. Client's config file (`config/clients/[slug].json`)
- [ ] **Time: 30 sec**

**✅ Client Added** → Total time: ~3 minutes

---

### Method B: Via SQL Query (Faster for Bulk)

#### ☐ Step 2.1: Run SQL Insert
- [ ] Navigate to: SQL Editor
- [ ] Paste and customize:
  ```sql
  INSERT INTO clients (
    slug,
    business_name,
    phone,
    email,
    status,
    monthly_price,
    setup_fee
  ) VALUES (
    'client-slug',                    -- Change this
    'Business Display Name',          -- Change this
    '(xxx) xxx-xxxx',                 -- Change this
    'info@clientbusiness.com',        -- Change this
    'trial',                          -- or 'active'
    297.00,
    497.00                            -- or 0.00 if waived
  )
  RETURNING id, slug, business_name;
  ```
- [ ] Click "Run"
- [ ] **Time: 1 min**

#### ☐ Step 2.2: Copy Generated UUID
- [ ] Query results will show:
  ```
  id: f47ac10b-58cc-4372-a567-0e02b2c3d479
  slug: client-slug
  business_name: Business Display Name
  ```
- [ ] Copy the `id` (UUID)
- [ ] **Time: 30 sec**

**✅ Client Added via SQL** → Total time: ~1.5 minutes

---

## ✅ PART 3: VERIFY CLIENT RECORD

### ☐ Step 3.1: View Client in Table Editor
- [ ] Navigate to: Table Editor → `clients` table
- [ ] Filter by slug: `slug = 'client-slug'`
- [ ] Verify all fields are correct
- [ ] **Time: 30 sec**

### ☐ Step 3.2: Test RLS (Row Level Security)
- [ ] Navigate to: SQL Editor
- [ ] Run test query:
  ```sql
  -- Set client context (simulates application query)
  SELECT set_client_context('f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid);

  -- This query should only return THIS client's data
  SELECT * FROM leads WHERE client_id = current_setting('app.current_client_id')::uuid;
  ```
- [ ] **Expected**: Empty result (no leads yet)
- [ ] **This proves**: RLS is working (client isolation)
- [ ] **Time: 1 min**

**✅ Client Verified** → Database isolation confirmed

---

## 🔄 PART 4: UPDATE CLIENT RECORD (After Deployment)

### After Twilio Number Purchased:
```sql
UPDATE clients
SET twilio_phone_number = '+1xxxxxxxxxx'
WHERE slug = 'client-slug';
```

### After Domain Configured:
```sql
UPDATE clients
SET custom_domain = 'clientdomain.com'
WHERE slug = 'client-slug';
```

### After Vercel Deployment:
```sql
UPDATE clients
SET vercel_project_id = 'prj_xxxxxxxxxxxx',
    deployed_at = NOW(),
    status = 'active'
WHERE slug = 'client-slug';
```

### Change Client Status:
```sql
-- Activate trial client
UPDATE clients SET status = 'active' WHERE slug = 'client-slug';

-- Suspend non-paying client
UPDATE clients SET status = 'suspended' WHERE slug = 'client-slug';

-- Deactivate churned client
UPDATE clients SET status = 'inactive' WHERE slug = 'client-slug';
```

---

## 🤖 PART 5: AUTOMATION WITH `setup-supabase-client.js`

### Using the Automation Script

**Prerequisites**:
```bash
# Install Supabase SDK
cd scripts
npm install @supabase/supabase-js

# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Usage**:
```bash
# Add new client
node scripts/setup-supabase-client.js \
  --slug=client-slug \
  --business="Business Name" \
  --phone="(xxx) xxx-xxxx" \
  --email="info@clientbusiness.com" \
  --status=trial

# Output:
# ✅ Client created successfully!
# Client ID: f47ac10b-58cc-4372-a567-0e02b2c3d479
# Slug: client-slug
# Business Name: Business Name
```

**Update existing client**:
```bash
node scripts/setup-supabase-client.js \
  --slug=client-slug \
  --twilioNumber="+1xxxxxxxxxx" \
  --customDomain="clientdomain.com" \
  --status=active \
  --update
```

---

## 📊 DATABASE SCHEMA REFERENCE

### `clients` Table Schema

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Auto | Primary key (auto-generated) |
| `slug` | TEXT | Yes | URL identifier (unique, lowercase) |
| `business_name` | TEXT | Yes | Display name |
| `phone` | TEXT | Yes | Business phone number |
| `email` | TEXT | Yes | Business email |
| `status` | TEXT | Yes | trial, active, inactive, suspended |
| `twilio_phone_number` | TEXT | No | Tracking number (+1xxxxxxxxxx) |
| `twilio_forward_to` | TEXT | No | Forward calls to this number |
| `custom_domain` | TEXT | No | Custom domain (e.g., clientdomain.com) |
| `vercel_project_id` | TEXT | No | Vercel project ID |
| `monthly_price` | DECIMAL | No | Monthly subscription ($297.00) |
| `setup_fee` | DECIMAL | No | One-time setup fee ($497.00) |
| `deployed_at` | TIMESTAMP | No | When site went live |
| `created_at` | TIMESTAMP | Auto | Record creation timestamp |
| `updated_at` | TIMESTAMP | Auto | Last update timestamp |

---

## 🚨 TROUBLESHOOTING

### Issue: "duplicate key value violates unique constraint"
**Cause**: Client slug already exists
**Solution**:
1. Check if slug is already taken:
   ```sql
   SELECT * FROM clients WHERE slug = 'client-slug';
   ```
2. If exists, choose different slug
3. Recommended format: `[city]-[industry]` (e.g., "atlanta-plumbing-2")

---

### Issue: RLS policies prevent data access
**Cause**: Not setting client context before querying
**Solution**:
1. Always set context first:
   ```sql
   SELECT set_client_context('uuid-here');
   ```
2. Or use service role key (bypasses RLS) for admin queries

---

### Issue: "permission denied for table clients"
**Cause**: Using anon key instead of service role key
**Solution**:
1. Server-side operations require service role key
2. Check environment variable:
   ```bash
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```
3. Verify key starts with `eyJhbGc...`

---

### Issue: Migration fails with "relation already exists"
**Cause**: Schema already created
**Solution**:
1. Migrations are idempotent - safe to re-run
2. If modifying schema, use `ALTER TABLE` instead of `CREATE TABLE`
3. For clean slate:
   ```sql
   DROP TABLE IF EXISTS sms_consent_audit CASCADE;
   DROP TABLE IF EXISTS sms_logs CASCADE;
   DROP TABLE IF EXISTS call_logs CASCADE;
   DROP TABLE IF EXISTS leads CASCADE;
   DROP TABLE IF EXISTS clients CASCADE;
   -- Then re-run schema.sql
   ```

---

## 📚 RELATED DOCUMENTATION

- **ONBOARDING_CHECKLIST.md** - Full onboarding workflow
- **sql/schema.sql** - Complete database schema
- **sql/sms_consent_migration.sql** - A2P 10DLC compliance tables
- **setup-supabase-client.js** - Automation script

---

## ✅ SUMMARY CHECKLIST

**One-Time Setup**:
- [ ] Create Supabase project ($25/month)
- [ ] Save API credentials to secrets file
- [ ] Run `/sql/schema.sql` migration
- [ ] Run `/sql/sms_consent_migration.sql` migration
- [ ] Verify 5 tables created

**Per Client** (repeat for each):
- [ ] Insert row into `clients` table
- [ ] Copy generated UUID (client ID)
- [ ] Save UUID to config file and secrets
- [ ] Verify client record in table editor
- [ ] (Later) Update with Twilio number
- [ ] (Later) Update with custom domain
- [ ] (Later) Update with Vercel project ID
- [ ] (Later) Change status to 'active' when live

**Total Time**: ~3 minutes per client (manual) or ~30 seconds (automated)

**Cost**: $25/month for unlimited clients (shared database)

---

**Last Updated**: November 22, 2025
**Supabase Plan**: Pro ($25/month)
**Database Region**: us-east-1
