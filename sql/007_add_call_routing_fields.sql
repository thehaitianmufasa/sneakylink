-- ============================================================================
-- MIGRATION: Add Call Routing Fields
-- ============================================================================
-- Purpose: Add auto-connect call routing fields to call_logs table
-- Date: November 24, 2025
-- PRP: TWILIO_AUTO_CONNECT_CALL_PRP.md
-- Description: Enables tracking of call forwarding attempts and auto-SMS delivery
-- ============================================================================

-- Add new columns to call_logs table
-- These fields track the auto-connect call routing behavior

-- Track the dial outcome (whether owner answered, was busy, etc.)
ALTER TABLE call_logs
ADD COLUMN IF NOT EXISTS dial_status TEXT
CHECK (dial_status IN ('completed', 'no-answer', 'busy', 'failed', 'canceled'));

COMMENT ON COLUMN call_logs.dial_status IS 'Outcome of the dial attempt to owner: completed (answered), no-answer, busy, failed, canceled';

-- Track if the call was successfully connected to the owner
ALTER TABLE call_logs
ADD COLUMN IF NOT EXISTS connected_to_owner BOOLEAN DEFAULT false;

COMMENT ON COLUMN call_logs.connected_to_owner IS 'Whether the call was successfully connected to the owner (true if owner answered)';

-- Track when the owner answered the call
ALTER TABLE call_logs
ADD COLUMN IF NOT EXISTS owner_answered_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN call_logs.owner_answered_at IS 'Timestamp when the owner answered the forwarded call';

-- Track if auto-SMS was sent to lead
ALTER TABLE call_logs
ADD COLUMN IF NOT EXISTS auto_sms_sent BOOLEAN DEFAULT false;

COMMENT ON COLUMN call_logs.auto_sms_sent IS 'Whether the "Thanks for calling" auto-SMS was sent to the lead';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_logs_dial_status ON call_logs(dial_status);
CREATE INDEX IF NOT EXISTS idx_call_logs_connected_to_owner ON call_logs(connected_to_owner);
CREATE INDEX IF NOT EXISTS idx_call_logs_auto_sms_sent ON call_logs(auto_sms_sent);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this query to verify the migration was successful:
--
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'call_logs'
-- AND column_name IN ('dial_status', 'connected_to_owner', 'owner_answered_at', 'auto_sms_sent')
-- ORDER BY column_name;
--
-- Expected result: 4 rows with the new columns
-- ============================================================================

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================
-- To rollback this migration:
--
-- ALTER TABLE call_logs DROP COLUMN IF EXISTS dial_status;
-- ALTER TABLE call_logs DROP COLUMN IF EXISTS connected_to_owner;
-- ALTER TABLE call_logs DROP COLUMN IF EXISTS owner_answered_at;
-- ALTER TABLE call_logs DROP COLUMN IF EXISTS auto_sms_sent;
-- DROP INDEX IF EXISTS idx_call_logs_dial_status;
-- DROP INDEX IF EXISTS idx_call_logs_connected_to_owner;
-- DROP INDEX IF EXISTS idx_call_logs_auto_sms_sent;
-- ============================================================================
