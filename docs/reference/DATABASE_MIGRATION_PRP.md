# PRP: Database Migration for SMS Consent Fields

**Project:** NeverMissLead - A2P 10DLC SMS Compliance Database Migration
**Objective:** Add SMS consent tracking fields to production Supabase database
**Status:** Ready for Execution
**Created:** November 10, 2025

---

## ✅ Prerequisites Checklist

Before running this migration, verify:

- [ ] You have access to Supabase Dashboard
- [ ] You are logged into the correct Supabase project
- [ ] You have backed up your database (optional but recommended)
- [ ] You have reviewed the migration SQL file: `/sql/sms_consent_migration.sql`
- [ ] No other migrations are currently running

---

## 📋 Migration Overview

### What This Migration Does:

**Adds to `leads` table:**
- `sms_phone_number` (VARCHAR 15) - Mobile number for SMS
- `sms_opted_in` (BOOLEAN) - Opt-in status
- `sms_opt_in_timestamp` (TIMESTAMPTZ) - When opted in
- `sms_opt_in_method` (VARCHAR 50) - How they opted in (web_form, sms, email)
- `sms_opt_in_ip_address` (VARCHAR 45) - IP address at opt-in
- `sms_consent_record` (JSONB) - Full consent details

**Creates new table:**
- `sms_consent_audit` - Audit log for all SMS consent actions (opted_in, opted_out, confirmed, help_requested)

**Adds indexes:**
- `idx_leads_sms_opted_in` - For filtering opted-in leads
- `idx_leads_sms_phone_number` - For phone number lookups
- `idx_sms_consent_audit_*` - Multiple indexes for audit queries

**Security:**
- Enables Row Level Security (RLS) on `sms_consent_audit` table
- Adds RLS policies for client isolation

---

## 🚀 Step-by-Step Migration Instructions

### Step 1: Access Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

### Step 2: Verify Current Schema

**Run this query first to check if migration is needed:**

```sql
-- Check if SMS consent fields already exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name LIKE 'sms_%'
ORDER BY column_name;

-- Check if audit table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'sms_consent_audit';
```

**Expected Results:**
- If migration NOT run: **0 rows returned** (fields don't exist)
- If migration already run: **6 SMS fields + audit table** (migration complete)

**If 0 rows returned, proceed to Step 3. If fields exist, STOP - migration already complete.**

---

### Step 3: Copy Migration SQL

**Option A: Copy from file**
```bash
# In your terminal, copy the entire migration SQL:
cat /path/to/nevermisslead-template/sql/sms_consent_migration.sql
```

**Option B: Copy from below**

Open the file at: `/sql/sms_consent_migration.sql` and copy entire contents (420 lines)

---

### Step 4: Execute Migration

1. Paste the SQL into Supabase SQL Editor
2. Review the SQL one final time
3. Click **Run** button (bottom right)
4. Wait for completion (should take 2-5 seconds)

**Expected Output:**
```
Success. No rows returned.
NOTICE: SMS consent migration completed successfully
```

---

### Step 5: Verify Migration Success

Run these verification queries:

**Query 1: Verify columns added to leads table**
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name LIKE 'sms_%'
ORDER BY column_name;
```

**Expected Output:** 6 rows
```
sms_consent_record      | jsonb               | YES  | NULL
sms_opt_in_ip_address   | character varying   | YES  | NULL
sms_opt_in_method       | character varying   | YES  | 'web_form'
sms_opt_in_timestamp    | timestamp with...   | YES  | NULL
sms_opted_in            | boolean             | YES  | false
sms_phone_number        | character varying   | YES  | NULL
```

---

**Query 2: Verify audit table created**
```sql
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'sms_consent_audit'
ORDER BY ordinal_position;
```

**Expected Output:** 9 rows (id, lead_id, client_id, action, timestamp, ip_address, user_agent, consent_version, metadata, created_at)

---

**Query 3: Verify indexes created**
```sql
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN ('leads', 'sms_consent_audit')
  AND indexname LIKE '%sms%'
ORDER BY tablename, indexname;
```

**Expected Output:** 5+ indexes
```
leads | idx_leads_sms_opted_in
leads | idx_leads_sms_phone_number
sms_consent_audit | idx_sms_consent_audit_action
sms_consent_audit | idx_sms_consent_audit_client_id
sms_consent_audit | idx_sms_consent_audit_lead_id
sms_consent_audit | idx_sms_consent_audit_timestamp
```

---

**Query 4: Verify RLS enabled**
```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'sms_consent_audit';
```

**Expected Output:**
```
schemaname | tablename           | rowsecurity
public     | sms_consent_audit   | t (true)
```

---

**Query 5: Test audit logging function**
```sql
-- Test helper function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'log_sms_consent_action';
```

**Expected Output:** 1 row
```
routine_name              | routine_type
log_sms_consent_action    | FUNCTION
```

---

**Query 6: Test SMS opt-in stats view**
```sql
-- Test view exists
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_name = 'sms_opt_in_stats';
```

**Expected Output:** 1 row
```
table_name        | table_type
sms_opt_in_stats  | VIEW
```

---

### Step 6: Test with Sample Data (Optional)

**Insert a test lead with SMS opt-in:**
```sql
-- Test inserting SMS consent data
INSERT INTO leads (
  client_id,
  full_name,
  phone,
  email,
  message,
  source,
  status,
  sms_phone_number,
  sms_opted_in,
  sms_opt_in_timestamp,
  sms_opt_in_method,
  sms_opt_in_ip_address,
  sms_consent_record
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with valid client_id
  'Test User',
  '+15555551234',
  'test@example.com',
  'This is a test lead for SMS consent migration',
  'website',
  'new',
  '+15555551234',
  true,
  NOW(),
  'web_form',
  '192.168.1.1',
  '{"opted_in": true, "timestamp": "2025-11-10T12:00:00Z", "consent_version": "1.0"}'::jsonb
)
RETURNING id, full_name, sms_opted_in;
```

**Test audit logging:**
```sql
-- Log a consent action
SELECT log_sms_consent_action(
  (SELECT id FROM leads WHERE phone = '+15555551234' LIMIT 1),
  '00000000-0000-0000-0000-000000000001',
  'opted_in',
  '192.168.1.1',
  'Mozilla/5.0 Test',
  '{"source": "test", "form_type": "modal"}'::jsonb
);

-- Verify audit log
SELECT * FROM sms_consent_audit
WHERE action = 'opted_in'
ORDER BY timestamp DESC
LIMIT 1;
```

**Clean up test data:**
```sql
-- Delete test lead
DELETE FROM leads WHERE phone = '+15555551234';

-- Audit records will be auto-deleted via CASCADE
```

---

## ✅ Post-Migration Steps

### Step 1: Update TypeScript Types (Recommended)

After migration, regenerate Supabase TypeScript types:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Generate new types
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > lib/supabase/types.ts
```

This will remove the `as any` type assertions in the code.

---

### Step 2: Deploy Code Changes

The code is already deployed to your branch:
```
claude/a2p-10dlc-sms-compliance-011CV16Z2KGnH5QgZc4rVjYh
```

**To deploy to production:**
1. Merge PR to main branch
2. Vercel will auto-deploy
3. Test forms on production

---

### Step 3: Configure Twilio Webhook

1. Go to: https://console.twilio.com
2. Navigate to: **Messaging** → **Services** → Your Service
3. Set **Incoming Message Webhook** to:
   ```
   https://nevermisslead.com/api/twilio/incoming-sms
   ```
4. Set HTTP Method to: **POST**
5. Click **Save**

---

### Step 4: Test End-to-End

**Test 1: Privacy Policy Page**
- Visit: https://nevermisslead.com/privacy
- Verify page loads without errors

**Test 2: Form Submission**
- Visit: https://nevermisslead.com/hvac (or any demo)
- Fill out form with phone number
- Check SMS opt-in checkbox
- Submit form
- Check Supabase → `leads` table → Verify `sms_opted_in = true`
- Check Supabase → `sms_consent_audit` table → Verify audit record

**Test 3: SMS Auto-Replies**
- Send SMS to Twilio number: **STOP**
  - Expect: Opt-out confirmation SMS
  - Verify: `sms_opted_in` updated to `false` in database
- Send SMS: **HELP**
  - Expect: Support information SMS
- Send SMS: **START**
  - Expect: Welcome SMS
  - Verify: `sms_opted_in` updated to `true` in database

---

## 🔄 Rollback Instructions (Emergency Only)

**⚠️ WARNING: Only use if migration causes critical issues**

Run this SQL to rollback:

```sql
-- Drop view
DROP VIEW IF EXISTS sms_opt_in_stats;

-- Drop helper function
DROP FUNCTION IF EXISTS log_sms_consent_action;

-- Drop audit table (and its policies)
DROP TABLE IF EXISTS sms_consent_audit CASCADE;

-- Remove columns from leads table
ALTER TABLE leads DROP COLUMN IF EXISTS sms_phone_number;
ALTER TABLE leads DROP COLUMN IF EXISTS sms_opted_in;
ALTER TABLE leads DROP COLUMN IF EXISTS sms_opt_in_timestamp;
ALTER TABLE leads DROP COLUMN IF EXISTS sms_opt_in_method;
ALTER TABLE leads DROP COLUMN IF EXISTS sms_opt_in_ip_address;
ALTER TABLE leads DROP COLUMN IF EXISTS sms_consent_record;
```

**After rollback:**
- Forms will still work (SMS fields are optional)
- SMS webhook will log errors but not crash
- No data loss (existing leads are unchanged)

---

## 🐛 Troubleshooting

### Error: "column already exists"
**Solution:** Migration already run. Skip to verification step.

### Error: "permission denied"
**Solution:** Ensure you're using service role key or have admin access.

### Error: "relation does not exist"
**Solution:** Ensure `leads` table exists. Run original schema first.

### No errors but fields not appearing
**Solution:** Refresh Supabase dashboard. Check correct project selected.

### Forms not saving SMS consent data
**Solution:**
1. Verify migration ran successfully
2. Check browser console for errors
3. Verify API route is deployed
4. Check Supabase logs for insert errors

---

## 📊 Migration Checklist

**Pre-Migration:**
- [ ] Backed up database (optional)
- [ ] Verified prerequisites
- [ ] Reviewed migration SQL

**Migration Execution:**
- [ ] Ran verification query (Step 2)
- [ ] Copied migration SQL
- [ ] Executed migration in Supabase
- [ ] Received success message

**Verification:**
- [ ] Verified 6 columns added to `leads` table
- [ ] Verified `sms_consent_audit` table created
- [ ] Verified indexes created
- [ ] Verified RLS enabled
- [ ] Verified helper function exists
- [ ] Verified stats view exists
- [ ] Tested sample data insertion (optional)

**Post-Migration:**
- [ ] Regenerated TypeScript types (optional)
- [ ] Merged PR to production
- [ ] Configured Twilio webhook
- [ ] Tested privacy policy page
- [ ] Tested form submission
- [ ] Tested SMS auto-replies

---

## 📞 Support

**If you encounter issues:**

1. Check troubleshooting section above
2. Review Supabase logs: Dashboard → Logs → Database
3. Check migration SQL file: `/sql/sms_consent_migration.sql`
4. Review commit: `a1a5fe4` - Implementation details

**Database Schema Reference:**
- Original schema: `/sql/schema.sql`
- Migration file: `/sql/sms_consent_migration.sql`

---

**Migration is production-ready and safe to execute!** ✅
