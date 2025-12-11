-- ============================================================================
-- SMS CONSENT MIGRATION - A2P 10DLC Compliance
-- ============================================================================
--
-- This migration adds SMS consent tracking fields to the leads table and
-- creates an audit log table for compliance with A2P 10DLC requirements.
--
-- Version: 1.0.0
-- Created: November 10, 2025
--
-- ============================================================================

-- ============================================================================
-- STEP 1: Add SMS consent fields to leads table
-- ============================================================================

-- Add SMS consent columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_phone_number VARCHAR(15);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_opted_in BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_opt_in_timestamp TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_opt_in_method VARCHAR(50) DEFAULT 'web_form';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_opt_in_ip_address VARCHAR(45);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_consent_record JSONB;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_sms_opted_in ON leads(sms_opted_in);
CREATE INDEX IF NOT EXISTS idx_leads_sms_phone_number ON leads(sms_phone_number);

-- Add comments for documentation
COMMENT ON COLUMN leads.sms_phone_number IS 'Mobile phone number for SMS notifications';
COMMENT ON COLUMN leads.sms_opted_in IS 'Whether user has opted in to receive SMS';
COMMENT ON COLUMN leads.sms_opt_in_timestamp IS 'When the user opted in to SMS';
COMMENT ON COLUMN leads.sms_opt_in_method IS 'Method of opt-in (web_form, email, sms)';
COMMENT ON COLUMN leads.sms_opt_in_ip_address IS 'IP address at time of opt-in (for audit trail)';
COMMENT ON COLUMN leads.sms_consent_record IS 'Full consent record including user agent, timestamp, etc. (JSONB)';

-- ============================================================================
-- STEP 2: Create SMS consent audit log table
-- ============================================================================

-- Create consent audit log table
CREATE TABLE IF NOT EXISTS sms_consent_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('opted_in', 'opted_out', 'confirmed', 'help_requested')),
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  consent_version VARCHAR(20) DEFAULT '1.0',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_sms_consent_audit_lead_id ON sms_consent_audit(lead_id);
CREATE INDEX IF NOT EXISTS idx_sms_consent_audit_client_id ON sms_consent_audit(client_id);
CREATE INDEX IF NOT EXISTS idx_sms_consent_audit_timestamp ON sms_consent_audit(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sms_consent_audit_action ON sms_consent_audit(action);

-- Add comments
COMMENT ON TABLE sms_consent_audit IS 'Audit log for SMS consent actions (A2P 10DLC compliance)';
COMMENT ON COLUMN sms_consent_audit.action IS 'Action performed: opted_in, opted_out, confirmed, help_requested';
COMMENT ON COLUMN sms_consent_audit.consent_version IS 'Version of consent terms at time of action';
COMMENT ON COLUMN sms_consent_audit.metadata IS 'Additional context (JSONB): source, form_id, etc.';

-- ============================================================================
-- STEP 3: Enable Row Level Security on new table
-- ============================================================================

-- Enable RLS on sms_consent_audit table
ALTER TABLE sms_consent_audit ENABLE ROW LEVEL SECURITY;

-- Clients can view own consent audit logs
CREATE POLICY "Clients can view own consent audit logs"
  ON sms_consent_audit
  FOR SELECT
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

-- Clients can insert own consent audit logs
CREATE POLICY "Clients can insert own consent audit logs"
  ON sms_consent_audit
  FOR INSERT
  WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid);

-- System can manage all consent audit logs
CREATE POLICY "System can manage all consent audit logs"
  ON sms_consent_audit
  FOR ALL
  USING (current_setting('app.current_client_id', true) IS NULL);

-- ============================================================================
-- STEP 4: Create helper function for consent logging
-- ============================================================================

-- Function to log SMS consent actions
CREATE OR REPLACE FUNCTION log_sms_consent_action(
  p_lead_id UUID,
  p_client_id UUID,
  p_action VARCHAR(50),
  p_ip_address VARCHAR(45) DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO sms_consent_audit (
    lead_id,
    client_id,
    action,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_lead_id,
    p_client_id,
    p_action,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION log_sms_consent_action IS 'Helper function to log SMS consent actions to audit table';

-- ============================================================================
-- STEP 5: Create view for SMS opt-in statistics (optional)
-- ============================================================================

-- View: SMS Opt-In Statistics by Client
CREATE OR REPLACE VIEW sms_opt_in_stats AS
SELECT
  c.id as client_id,
  c.slug,
  c.business_name,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT CASE WHEN l.sms_opted_in = true THEN l.id END) as opted_in_count,
  COUNT(DISTINCT CASE WHEN l.sms_opted_in = false THEN l.id END) as opted_out_count,
  ROUND(
    (COUNT(DISTINCT CASE WHEN l.sms_opted_in = true THEN l.id END)::DECIMAL /
     NULLIF(COUNT(DISTINCT l.id), 0)) * 100,
    2
  ) as opt_in_rate_percent,
  MIN(l.sms_opt_in_timestamp) as first_opt_in,
  MAX(l.sms_opt_in_timestamp) as last_opt_in
FROM clients c
LEFT JOIN leads l ON c.id = l.client_id
GROUP BY c.id, c.slug, c.business_name;

-- Add comment
COMMENT ON VIEW sms_opt_in_stats IS 'Statistics on SMS opt-in rates by client';

-- ============================================================================
-- STEP 6: Verify migration
-- ============================================================================

-- Check if columns were added to leads table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'leads'
    AND column_name = 'sms_opted_in'
  ) THEN
    RAISE EXCEPTION 'Migration failed: sms_opted_in column not found in leads table';
  END IF;

  RAISE NOTICE 'SMS consent migration completed successfully';
END $$;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (For reference - do not run unless needed)
-- ============================================================================

-- To rollback this migration, run the following commands:
/*
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
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
