-- ============================================================================
-- MIGRATION: Admin CRM Dashboard Tables
-- ============================================================================
-- Purpose: Add admin authentication and CRM functionality
-- Date: November 24, 2025
-- PRP: docs/ADMIN_CRM_DASHBOARD_PRP.md
-- Description: Adds notes, status tracking, and admin session management
-- ============================================================================

-- ============================================================================
-- Update leads table (CRM fields)
-- ============================================================================

-- Add notes field for admin to track conversations
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN leads.notes IS 'Admin notes about this lead (conversations, follow-ups, etc)';

-- Add last contacted timestamp
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN leads.last_contacted_at IS 'When admin last contacted this lead';

-- Update status column to have more CRM values (if not already there)
-- Note: Status column already exists, this just ensures it has the right check constraint
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;

  -- Add new constraint with expanded values
  ALTER TABLE leads ADD CONSTRAINT leads_status_check
    CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost'));
END $$;

COMMENT ON COLUMN leads.status IS 'Lead status: new (not contacted), contacted (reached out), qualified (interested), converted (became customer), lost (not interested)';

-- ============================================================================
-- Update call_logs table (CRM fields)
-- ============================================================================

-- Add notes field for call logs
ALTER TABLE call_logs
ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN call_logs.notes IS 'Admin notes about this call';

-- Track if admin called back this lead
ALTER TABLE call_logs
ADD COLUMN IF NOT EXISTS callback_completed BOOLEAN DEFAULT false;

COMMENT ON COLUMN call_logs.callback_completed IS 'Whether admin successfully called back this lead';

-- Track when callback happened
ALTER TABLE call_logs
ADD COLUMN IF NOT EXISTS callback_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN call_logs.callback_at IS 'When admin called back this lead';

-- ============================================================================
-- Create admin_sessions table (Simple Authentication)
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Optional: track IP and user agent for security audit
  ip_address INET,
  user_agent TEXT
);

COMMENT ON TABLE admin_sessions IS 'Admin authentication sessions (24-hour expiry)';
COMMENT ON COLUMN admin_sessions.session_token IS 'Unique session token stored in httpOnly cookie';
COMMENT ON COLUMN admin_sessions.expires_at IS 'When this session expires (typically NOW() + 24 hours)';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_client ON admin_sessions(client_id);

-- Create indexes on new CRM columns
CREATE INDEX IF NOT EXISTS idx_leads_last_contacted ON leads(last_contacted_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_callback_completed ON call_logs(callback_completed);

-- ============================================================================
-- Row Level Security for admin_sessions
-- ============================================================================

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Only system can manage sessions (no client access)
CREATE POLICY "System can manage admin sessions"
  ON admin_sessions
  FOR ALL
  USING (current_setting('app.current_client_id', true) IS NULL);

-- ============================================================================
-- Cleanup expired sessions (run daily via cron or manually)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM admin_sessions
  WHERE expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Deletes expired admin sessions. Run daily via cron: SELECT cleanup_expired_sessions();';

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this query to verify the migration was successful:
--
-- SELECT
--   'leads' as table_name,
--   column_name,
--   data_type
-- FROM information_schema.columns
-- WHERE table_name = 'leads'
-- AND column_name IN ('notes', 'last_contacted_at')
-- UNION ALL
-- SELECT
--   'call_logs' as table_name,
--   column_name,
--   data_type
-- FROM information_schema.columns
-- WHERE table_name = 'call_logs'
-- AND column_name IN ('notes', 'callback_completed', 'callback_at')
-- UNION ALL
-- SELECT
--   'admin_sessions' as table_name,
--   'table_exists' as column_name,
--   'yes' as data_type
-- FROM information_schema.tables
-- WHERE table_name = 'admin_sessions';
--
-- Expected: 6 rows showing the new columns and admin_sessions table exists
-- ============================================================================

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================
-- To rollback this migration:
--
-- ALTER TABLE leads DROP COLUMN IF EXISTS notes;
-- ALTER TABLE leads DROP COLUMN IF EXISTS last_contacted_at;
-- ALTER TABLE call_logs DROP COLUMN IF EXISTS notes;
-- ALTER TABLE call_logs DROP COLUMN IF EXISTS callback_completed;
-- ALTER TABLE call_logs DROP COLUMN IF EXISTS callback_at;
-- DROP TABLE IF EXISTS admin_sessions CASCADE;
-- DROP FUNCTION IF EXISTS cleanup_expired_sessions();
-- DROP INDEX IF EXISTS idx_leads_last_contacted;
-- DROP INDEX IF EXISTS idx_call_logs_callback_completed;
-- ============================================================================
