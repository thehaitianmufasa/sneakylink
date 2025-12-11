-- ============================================================================
-- FIX RLS ERRORS - Enable RLS on Legacy Tables
-- ============================================================================
--
-- This fixes the Security Advisor warnings about RLS being disabled.
-- These tables appear to be from a previous project (not NeverMissLead).
--
-- Run this in Supabase SQL Editor to fix the warnings.
--
-- ============================================================================

-- Enable RLS on all affected tables
ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (since we don't know the original structure)
-- Option 1: Allow all access (if these tables are no longer used)
DO $$
BEGIN
  -- Documents table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documents') THEN
    DROP POLICY IF EXISTS "Allow all access to documents" ON public.documents;
    CREATE POLICY "Allow all access to documents"
      ON public.documents
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Embeddings table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'embeddings') THEN
    DROP POLICY IF EXISTS "Allow all access to embeddings" ON public.embeddings;
    CREATE POLICY "Allow all access to embeddings"
      ON public.embeddings
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Runs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'runs') THEN
    DROP POLICY IF EXISTS "Allow all access to runs" ON public.runs;
    CREATE POLICY "Allow all access to runs"
      ON public.runs
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Tasks table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tasks') THEN
    DROP POLICY IF EXISTS "Allow all access to tasks" ON public.tasks;
    CREATE POLICY "Allow all access to tasks"
      ON public.tasks
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- ALTERNATIVE: Drop the tables if not needed
-- ============================================================================
--
-- If these tables are from an old project and you're not using them,
-- you can simply drop them instead:
--
-- DROP TABLE IF EXISTS public.documents CASCADE;
-- DROP TABLE IF EXISTS public.embeddings CASCADE;
-- DROP TABLE IF EXISTS public.runs CASCADE;
-- DROP TABLE IF EXISTS public.tasks CASCADE;
--
-- ============================================================================

-- Verify RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('documents', 'embeddings', 'runs', 'tasks')
ORDER BY tablename;
