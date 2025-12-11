-- ========================================================================
-- ONBOARDING CAPACITY TRACKING TABLE
-- ========================================================================
-- This table tracks the current onboarding capacity for the urgency banner
-- Max capacity: 4 clients per week
-- Resets every Monday at 12:01 AM EST via Cron Job

-- Create the onboarding_capacity table
CREATE TABLE IF NOT EXISTS public.onboarding_capacity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_starting DATE NOT NULL UNIQUE,
  current_onboarded_count INTEGER NOT NULL DEFAULT 0,
  max_capacity INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_capacity_week
ON public.onboarding_capacity(week_starting DESC);

-- Create function to get current week's capacity
CREATE OR REPLACE FUNCTION get_current_week_capacity()
RETURNS TABLE (
  remaining_spots INTEGER,
  is_full BOOLEAN,
  current_count INTEGER,
  max_capacity INTEGER
) AS $$
DECLARE
  v_week_start DATE;
  v_current_count INTEGER;
  v_max_capacity INTEGER;
BEGIN
  -- Calculate the start of the current week (Monday)
  v_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE + INTERVAL '1 day';

  -- Get or create the current week's record
  INSERT INTO public.onboarding_capacity (week_starting, current_onboarded_count, max_capacity)
  VALUES (v_week_start, 0, 4)
  ON CONFLICT (week_starting) DO NOTHING;

  -- Get current counts
  SELECT current_onboarded_count, onboarding_capacity.max_capacity
  INTO v_current_count, v_max_capacity
  FROM public.onboarding_capacity
  WHERE week_starting = v_week_start;

  -- Return the results
  RETURN QUERY SELECT
    (v_max_capacity - v_current_count)::INTEGER as remaining_spots,
    (v_current_count >= v_max_capacity)::BOOLEAN as is_full,
    v_current_count::INTEGER as current_count,
    v_max_capacity::INTEGER as max_capacity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment onboarding count
CREATE OR REPLACE FUNCTION increment_onboarding_count()
RETURNS TABLE (
  success BOOLEAN,
  remaining_spots INTEGER,
  is_full BOOLEAN
) AS $$
DECLARE
  v_week_start DATE;
  v_current_count INTEGER;
  v_max_capacity INTEGER;
BEGIN
  -- Calculate the start of the current week (Monday)
  v_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE + INTERVAL '1 day';

  -- Get or create the current week's record
  INSERT INTO public.onboarding_capacity (week_starting, current_onboarded_count, max_capacity)
  VALUES (v_week_start, 0, 4)
  ON CONFLICT (week_starting) DO NOTHING;

  -- Get current count
  SELECT current_onboarded_count, onboarding_capacity.max_capacity
  INTO v_current_count, v_max_capacity
  FROM public.onboarding_capacity
  WHERE week_starting = v_week_start;

  -- Only increment if not full
  IF v_current_count < v_max_capacity THEN
    UPDATE public.onboarding_capacity
    SET current_onboarded_count = current_onboarded_count + 1,
        updated_at = NOW()
    WHERE week_starting = v_week_start;

    v_current_count := v_current_count + 1;

    RETURN QUERY SELECT
      TRUE::BOOLEAN as success,
      (v_max_capacity - v_current_count)::INTEGER as remaining_spots,
      (v_current_count >= v_max_capacity)::BOOLEAN as is_full;
  ELSE
    RETURN QUERY SELECT
      FALSE::BOOLEAN as success,
      0::INTEGER as remaining_spots,
      TRUE::BOOLEAN as is_full;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.onboarding_capacity ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for real-time updates)
CREATE POLICY "Allow public read access to onboarding_capacity"
ON public.onboarding_capacity
FOR SELECT
TO public
USING (true);

-- Create policy to allow service role to manage data
CREATE POLICY "Allow service role to manage onboarding_capacity"
ON public.onboarding_capacity
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create function for weekly reset (to be called by Cron Job)
CREATE OR REPLACE FUNCTION reset_weekly_capacity()
RETURNS void AS $$
DECLARE
  v_week_start DATE;
BEGIN
  -- Calculate the start of the current week (Monday)
  v_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE + INTERVAL '1 day';

  -- Create new week record with 0 count
  INSERT INTO public.onboarding_capacity (week_starting, current_onboarded_count, max_capacity)
  VALUES (v_week_start, 0, 4)
  ON CONFLICT (week_starting)
  DO UPDATE SET
    current_onboarded_count = 0,
    updated_at = NOW();

  -- Clean up old records (keep last 4 weeks for analytics)
  DELETE FROM public.onboarding_capacity
  WHERE week_starting < (CURRENT_DATE - INTERVAL '4 weeks');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================================
-- CRON JOB SETUP INSTRUCTIONS
-- ========================================================================
-- Run this in Supabase Dashboard > SQL Editor to set up weekly reset:
--
-- SELECT cron.schedule(
--   'weekly-capacity-reset',
--   '1 0 * * 1',  -- Every Monday at 12:01 AM UTC (add timezone conversion)
--   $$ SELECT reset_weekly_capacity(); $$
-- );
--
-- Note: Adjust cron schedule for EST timezone (UTC-5 or UTC-4 depending on DST)
-- For Monday 12:01 AM EST:
-- - Standard Time (Nov-Mar): '1 5 * * 1' (5 AM UTC = 12:01 AM EST)
-- - Daylight Time (Mar-Nov): '1 4 * * 1' (4 AM UTC = 12:01 AM EDT)
-- ========================================================================

-- Insert initial record for current week
INSERT INTO public.onboarding_capacity (week_starting, current_onboarded_count, max_capacity)
VALUES (DATE_TRUNC('week', CURRENT_DATE)::DATE + INTERVAL '1 day', 0, 4)
ON CONFLICT (week_starting) DO NOTHING;

-- Verification query
SELECT * FROM get_current_week_capacity();
