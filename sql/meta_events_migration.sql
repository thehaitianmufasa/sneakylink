-- Meta Events Tracking Table Migration
-- Created: November 11, 2025
-- Purpose: Track Facebook Pixel events and Meta Conversions API data

-- Create meta_events table
CREATE TABLE IF NOT EXISTS meta_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Event Details
  event_name TEXT NOT NULL,                     -- PageView, Lead, Contact, etc.
  event_time TIMESTAMPTZ NOT NULL,              -- When event occurred
  event_source_url TEXT,                        -- Page URL where event happened
  event_id TEXT UNIQUE,                         -- Deduplication ID

  -- User Data
  fbp TEXT,                                     -- Facebook browser cookie (_fbp)
  fbc TEXT,                                     -- Facebook click cookie (_fbc)
  user_agent TEXT,
  ip_address TEXT,

  -- Custom Data (JSONB for flexibility)
  custom_data JSONB DEFAULT '{}'::jsonb,       -- value, currency, content_name, etc.

  -- Conversions API Status
  sent_to_api BOOLEAN DEFAULT false,
  api_response JSONB,
  api_sent_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meta_events_client_id ON meta_events(client_id);
CREATE INDEX IF NOT EXISTS idx_meta_events_lead_id ON meta_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_meta_events_event_name ON meta_events(event_name);
CREATE INDEX IF NOT EXISTS idx_meta_events_event_time ON meta_events(event_time DESC);
CREATE INDEX IF NOT EXISTS idx_meta_events_event_id ON meta_events(event_id);

-- Updated at trigger
CREATE TRIGGER update_meta_events_updated_at
  BEFORE UPDATE ON meta_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE meta_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own events"
  ON meta_events
  FOR SELECT
  USING (client_id = current_setting('app.current_client_id', true)::uuid);

CREATE POLICY "System can manage all events"
  ON meta_events
  FOR ALL
  USING (current_setting('app.current_client_id', true) IS NULL);
