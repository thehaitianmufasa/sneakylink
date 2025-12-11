-- ============================================================================
-- NEVERMISSLEAD - MULTI-TENANT DATABASE SCHEMA
-- ============================================================================
--
-- This schema implements a shared database architecture with Row Level Security (RLS)
-- for data isolation between clients. Each client's data is logically separated using
-- the `client_id` foreign key and RLS policies.
--
-- Architecture: Shared Database with client_id + RLS
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- Created: January 29, 2025
--
-- ============================================================================

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE 1: CLIENTS (Master Tenant Table)
-- ============================================================================
-- This is the master table that stores all client information.
-- Every other table references this table via `client_id`.

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Information
  slug TEXT UNIQUE NOT NULL,                    -- URL-safe identifier (e.g., "nevermisslead")
  business_name TEXT NOT NULL,                  -- Display name (e.g., "NeverMissLead HVAC")
  legal_name TEXT NOT NULL,                     -- Legal business name
  industry TEXT NOT NULL,                       -- Industry type (e.g., "HVAC", "Plumbing")

  -- Contact Information
  phone TEXT NOT NULL,                          -- Primary business phone
  email TEXT NOT NULL,                          -- Primary business email
  address TEXT,                                 -- Business address

  -- Subscription & Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'trial')),
  subscription_plan TEXT DEFAULT 'standard' CHECK (subscription_plan IN ('standard', 'premium', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trialing')),
  trial_ends_at TIMESTAMPTZ,
  subscription_started_at TIMESTAMPTZ DEFAULT NOW(),

  -- Billing
  monthly_price DECIMAL(10, 2) DEFAULT 297.00,
  setup_fee DECIMAL(10, 2) DEFAULT 497.00,
  setup_fee_paid BOOLEAN DEFAULT false,

  -- Domain & Deployment
  custom_domain TEXT,                           -- Custom domain (e.g., "clientbusiness.com")
  vercel_project_id TEXT,                       -- Vercel project ID
  deployment_url TEXT,                          -- Primary deployment URL

  -- Twilio Configuration
  twilio_phone_number TEXT,                     -- Dedicated Twilio number
  twilio_forward_to TEXT,                       -- Phone to forward calls to

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_slug ON clients(slug);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 2: LEADS (Lead Capture Forms)
-- ============================================================================
-- Stores all lead form submissions from client websites.
-- Each lead is associated with a specific client via client_id.

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Lead Information
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,

  -- Service Details
  service_type TEXT,                            -- Type of service requested
  message TEXT,                                 -- Additional message/notes
  urgency TEXT CHECK (urgency IN ('emergency', 'same-day', 'scheduled', 'consultation')),
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('phone', 'email', 'sms')),

  -- Source Tracking
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'sms', 'referral')),
  page_url TEXT,                                -- Page where form was submitted
  utm_source TEXT,                              -- UTM tracking parameters
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,                                -- HTTP referrer

  -- Lead Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  assigned_to TEXT,                             -- Staff member assigned

  -- Follow-up
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  notes TEXT,

  -- Metadata
  ip_address INET,                              -- Client IP address
  user_agent TEXT,                              -- Browser user agent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT phone_format CHECK (phone ~ '^\+?[0-9]{10,15}$')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_client_status ON leads(client_id, status);

-- Updated at trigger
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 3: CALL_LOGS (Phone Call Tracking)
-- ============================================================================
-- Tracks all incoming phone calls via Twilio.
-- Linked to leads when phone number matches.

CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,  -- Link to lead if exists

  -- Twilio Data
  twilio_call_sid TEXT UNIQUE NOT NULL,         -- Twilio call identifier
  twilio_account_sid TEXT NOT NULL,

  -- Call Details
  from_number TEXT NOT NULL,                    -- Caller's phone number
  to_number TEXT NOT NULL,                      -- Twilio tracking number
  forwarded_to TEXT,                            -- Number call was forwarded to

  -- Call Status
  status TEXT CHECK (status IN ('ringing', 'in-progress', 'completed', 'busy', 'no-answer', 'failed', 'canceled')),
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  duration INTEGER DEFAULT 0,                   -- Call duration in seconds

  -- Timestamps
  started_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Recording
  recording_url TEXT,                           -- URL to call recording
  recording_duration INTEGER,                   -- Recording duration in seconds

  -- Caller Information
  caller_city TEXT,
  caller_state TEXT,
  caller_zip TEXT,
  caller_country TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_call_logs_client_id ON call_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_lead_id ON call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_twilio_sid ON call_logs(twilio_call_sid);
CREATE INDEX IF NOT EXISTS idx_call_logs_from_number ON call_logs(from_number);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);

-- Updated at trigger
CREATE TRIGGER update_call_logs_updated_at
  BEFORE UPDATE ON call_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 4: SMS_LOGS (SMS Message Tracking)
-- ============================================================================
-- Tracks all SMS messages sent/received via Twilio.
-- Linked to leads when phone number matches.

CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,  -- Link to lead if exists

  -- Twilio Data
  twilio_message_sid TEXT UNIQUE NOT NULL,      -- Twilio message identifier
  twilio_account_sid TEXT NOT NULL,

  -- Message Details
  from_number TEXT NOT NULL,                    -- Sender's phone number
  to_number TEXT NOT NULL,                      -- Recipient's phone number
  body TEXT NOT NULL,                           -- Message content

  -- Message Status
  status TEXT CHECK (status IN ('queued', 'sending', 'sent', 'delivered', 'undelivered', 'failed')),
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),

  -- Auto-Response
  is_auto_response BOOLEAN DEFAULT false,       -- Was this an automated response?
  triggered_by_message_sid TEXT,                -- If auto-response, which message triggered it

  -- Metadata
  error_code TEXT,
  error_message TEXT,
  price DECIMAL(10, 4),                         -- Cost of SMS
  price_unit TEXT,                              -- Currency (e.g., "USD")

  -- Timestamps
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_logs_client_id ON sms_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_lead_id ON sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_twilio_sid ON sms_logs(twilio_message_sid);
CREATE INDEX IF NOT EXISTS idx_sms_logs_from_number ON sms_logs(from_number);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON sms_logs(created_at DESC);

-- Updated at trigger
CREATE TRIGGER update_sms_logs_updated_at
  BEFORE UPDATE ON sms_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- These policies enforce data isolation between clients at the database level.
-- Even if application code has bugs, clients can ONLY access their own data.

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICY: CLIENTS TABLE
-- ============================================================================
-- Clients can only see their own record

CREATE POLICY "Clients can view own record"
  ON clients
  FOR SELECT
  USING (id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can update own record"
  ON clients
  FOR UPDATE
  USING (id = current_setting('app.current_client_id', true)::uuid);

-- System/Admin can see all clients (no RLS context set)
CREATE POLICY "System can manage all clients"
  ON clients
  FOR ALL
  USING (current_setting('app.current_client_id', true) IS NULL);

-- ============================================================================
-- RLS POLICY: LEADS TABLE
-- ============================================================================
-- Clients can only access leads that belong to them

CREATE POLICY "Clients can view own leads"
  ON leads
  FOR SELECT
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can insert own leads"
  ON leads
  FOR INSERT
  WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can update own leads"
  ON leads
  FOR UPDATE
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can delete own leads"
  ON leads
  FOR DELETE
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

-- System can manage all leads
CREATE POLICY "System can manage all leads"
  ON leads
  FOR ALL
  USING (current_setting('app.current_client_id', true) IS NULL);

-- ============================================================================
-- RLS POLICY: CALL_LOGS TABLE
-- ============================================================================
-- Clients can only access call logs that belong to them

CREATE POLICY "Clients can view own call logs"
  ON call_logs
  FOR SELECT
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can insert own call logs"
  ON call_logs
  FOR INSERT
  WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can update own call logs"
  ON call_logs
  FOR UPDATE
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

-- System can manage all call logs
CREATE POLICY "System can manage all call logs"
  ON call_logs
  FOR ALL
  USING (current_setting('app.current_client_id', true) IS NULL);

-- ============================================================================
-- RLS POLICY: SMS_LOGS TABLE
-- ============================================================================
-- Clients can only access SMS logs that belong to them

CREATE POLICY "Clients can view own sms logs"
  ON sms_logs
  FOR SELECT
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can insert own sms logs"
  ON sms_logs
  FOR INSERT
  WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "Clients can update own sms logs"
  ON sms_logs
  FOR UPDATE
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

-- System can manage all sms logs
CREATE POLICY "System can manage all sms logs"
  ON sms_logs
  FOR ALL
  USING (current_setting('app.current_client_id', true) IS NULL);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to set RLS context for a client
CREATE OR REPLACE FUNCTION set_client_context(p_client_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_client_id', p_client_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Function to clear RLS context (for system/admin operations)
CREATE OR REPLACE FUNCTION clear_client_context()
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_client_id', NULL, false);
END;
$$ LANGUAGE plpgsql;

-- Function to get current client context
CREATE OR REPLACE FUNCTION get_client_context()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_client_id', true)::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ANALYTICS VIEWS (Optional - for platform-wide metrics)
-- ============================================================================

-- View: Client Statistics
CREATE OR REPLACE VIEW client_stats AS
SELECT
  c.id,
  c.slug,
  c.business_name,
  c.status,
  c.subscription_plan,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT cl.id) as total_calls,
  COUNT(DISTINCT sm.id) as total_sms,
  COUNT(DISTINCT CASE WHEN l.status = 'converted' THEN l.id END) as converted_leads,
  c.created_at,
  c.last_activity_at
FROM clients c
LEFT JOIN leads l ON c.id = l.client_id
LEFT JOIN call_logs cl ON c.id = cl.client_id
LEFT JOIN sms_logs sm ON c.id = sm.client_id
GROUP BY c.id;

-- ============================================================================
-- SEED DATA (Demo Client)
-- ============================================================================
-- This creates the demo "nevermisslead" client for testing.

INSERT INTO clients (
  slug,
  business_name,
  legal_name,
  industry,
  phone,
  email,
  address,
  status,
  subscription_plan,
  custom_domain,
  deployment_url,
  twilio_phone_number,
  twilio_forward_to
) VALUES (
  'nevermisslead',
  'NeverMissLead HVAC',
  'NeverMissLead HVAC Services LLC',
  'HVAC',
  '(404) 555-HVAC',
  'info@nevermisslead.com',
  '1234 Peachtree Industrial Blvd, Atlanta, GA 30341',
  'active',
  'standard',
  'nevermisslead.com',
  'https://nevermisslead.com',
  '+14045554822',
  '+14045551234'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE clients IS 'Master table storing all client/tenant information';
COMMENT ON TABLE leads IS 'Lead form submissions from client websites';
COMMENT ON TABLE call_logs IS 'Phone call tracking via Twilio';
COMMENT ON TABLE sms_logs IS 'SMS message tracking via Twilio';

COMMENT ON COLUMN clients.slug IS 'URL-safe identifier used in config files and routing';
COMMENT ON COLUMN leads.client_id IS 'Foreign key to clients table - enforces data isolation';
COMMENT ON COLUMN call_logs.twilio_call_sid IS 'Unique Twilio call identifier';
COMMENT ON COLUMN sms_logs.twilio_message_sid IS 'Unique Twilio message identifier';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
--
-- To apply this schema to your Supabase project:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run the SQL
-- 4. Verify tables created: clients, leads, call_logs, sms_logs
-- 5. Verify RLS is enabled on all tables
--
-- To test RLS:
-- SELECT set_client_context('your-client-id-here'::uuid);
-- SELECT * FROM leads; -- Should only show leads for that client
--
-- ============================================================================
