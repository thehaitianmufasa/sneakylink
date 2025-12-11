-- ============================================================================
-- SQL Migration: Add Voicemail Notification Columns
-- ============================================================================
-- Description: Adds notification_phone and notification_email columns to clients table
--              for voicemail SMS and email notifications
-- Created: 2025-11-22
-- ============================================================================

-- Add notification_phone column to clients table
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS notification_phone VARCHAR(20);

-- Add notification_email column to clients table
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS notification_email VARCHAR(255);

-- Add comments for documentation
COMMENT ON COLUMN public.clients.notification_phone IS
  'Phone number to receive voicemail SMS notifications. Falls back to +16787887281 if not set.';

COMMENT ON COLUMN public.clients.notification_email IS
  'Email address to receive voicemail notifications. Falls back to support@cherysolutions.com if not set.';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_notification_phone
  ON public.clients(notification_phone);

CREATE INDEX IF NOT EXISTS idx_clients_notification_email
  ON public.clients(notification_email);

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To undo this migration, run:
-- DROP INDEX IF EXISTS public.idx_clients_notification_phone;
-- DROP INDEX IF EXISTS public.idx_clients_notification_email;
-- ALTER TABLE public.clients DROP COLUMN IF EXISTS notification_phone;
-- ALTER TABLE public.clients DROP COLUMN IF EXISTS notification_email;
