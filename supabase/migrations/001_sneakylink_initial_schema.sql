-- ==============================================================================
-- SNEAKYLINK - VENDOR COMPLIANCE PREP SAAS
-- Initial Database Schema
-- Project Identifier: sneakylink-vendor-compliance
-- Created: December 11, 2025
-- ==============================================================================
--
-- This schema is SEPARATE from other projects (NeverMissLead, 12thHaus, etc.)
-- All tables use 'sneaky_' prefix to avoid conflicts with other projects
--
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ==============================================================================
-- PROJECT METADATA TABLE
-- Identifies which project this database belongs to
-- ==============================================================================
CREATE TABLE IF NOT EXISTS project_metadata (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name text UNIQUE NOT NULL,
  project_slug text UNIQUE NOT NULL,
  description text,
  version text,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert Sneakylink project metadata
INSERT INTO project_metadata (project_name, project_slug, description, version)
VALUES (
  'Sneakylink',
  'sneakylink-vendor-compliance',
  'Vendor Compliance Prep SaaS - Prep once, export to any customer',
  '1.0.0'
) ON CONFLICT (project_slug) DO NOTHING;

-- ==============================================================================
-- SNEAKY_VENDORS TABLE
-- Stores vendor company profiles
-- ==============================================================================
CREATE TABLE sneaky_vendors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id text UNIQUE NOT NULL,
  company_name text NOT NULL,
  employee_count integer,
  work_types jsonb, -- ['electrical', 'heights', 'loto', 'equipment']
  address jsonb, -- {street, city, state, zip}
  contact jsonb, -- {phone, email, website}
  onboarding_complete boolean DEFAULT false,
  questionnaire_complete boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE sneaky_vendors IS 'SNEAKYLINK: Vendor company profiles with onboarding information';

-- Row Level Security
ALTER TABLE sneaky_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own vendor profile"
  ON sneaky_vendors FOR SELECT
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can only update their own vendor profile"
  ON sneaky_vendors FOR UPDATE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own vendor profile"
  ON sneaky_vendors FOR INSERT
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ==============================================================================
-- SNEAKY_QUESTIONNAIRE_RESPONSES TABLE
-- Stores compliance questionnaire answers
-- ==============================================================================
CREATE TABLE sneaky_questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES sneaky_vendors(id) ON DELETE CASCADE NOT NULL,
  section text NOT NULL CHECK (section IN (
    'core_safety', 'insurance', 'metrics', 'relationships',
    'electrical', 'heights', 'loto', 'equipment'
  )),
  question_id text NOT NULL,
  answer jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(vendor_id, question_id)
);

COMMENT ON TABLE sneaky_questionnaire_responses IS 'SNEAKYLINK: Compliance questionnaire responses';

-- Row Level Security
ALTER TABLE sneaky_questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own responses"
  ON sneaky_questionnaire_responses FOR SELECT
  USING (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can insert their own responses"
  ON sneaky_questionnaire_responses FOR INSERT
  WITH CHECK (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can update their own responses"
  ON sneaky_questionnaire_responses FOR UPDATE
  USING (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- ==============================================================================
-- SNEAKY_DOCUMENTS TABLE
-- Stores uploaded compliance documents
-- ==============================================================================
CREATE TABLE sneaky_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES sneaky_vendors(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN (
    'ehs_policy', 'insurance_cert', 'training_records',
    'certifications', 'licenses', 'other'
  )),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  mime_type text,
  uploaded_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE sneaky_documents IS 'SNEAKYLINK: Uploaded compliance documents';

-- Row Level Security
ALTER TABLE sneaky_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own documents"
  ON sneaky_documents FOR SELECT
  USING (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can insert their own documents"
  ON sneaky_documents FOR INSERT
  WITH CHECK (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can delete their own documents"
  ON sneaky_documents FOR DELETE
  USING (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- ==============================================================================
-- SNEAKY_CUSTOMERS TABLE
-- Stores customer companies for PDF exports
-- ==============================================================================
CREATE TABLE sneaky_customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES sneaky_vendors(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_contact jsonb, -- {name, email, phone}
  notes text,
  last_exported_at timestamp with time zone,
  export_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(vendor_id, customer_name)
);

COMMENT ON TABLE sneaky_customers IS 'SNEAKYLINK: Customer companies for compliance profile exports';

-- Row Level Security
ALTER TABLE sneaky_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own customers"
  ON sneaky_customers FOR ALL
  USING (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- ==============================================================================
-- SNEAKY_EXPORTS TABLE
-- Tracks PDF export history
-- ==============================================================================
CREATE TABLE sneaky_exports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES sneaky_vendors(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES sneaky_customers(id) ON DELETE CASCADE NOT NULL,
  pdf_path text NOT NULL,
  compliance_score decimal(5,2),
  section_scores jsonb,
  exported_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE sneaky_exports IS 'SNEAKYLINK: PDF export history with compliance scores';

-- Row Level Security
ALTER TABLE sneaky_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own exports"
  ON sneaky_exports FOR ALL
  USING (vendor_id IN (
    SELECT id FROM sneaky_vendors
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX idx_sneaky_vendors_clerk_user_id ON sneaky_vendors(clerk_user_id);
CREATE INDEX idx_sneaky_questionnaire_vendor_id ON sneaky_questionnaire_responses(vendor_id);
CREATE INDEX idx_sneaky_questionnaire_question_id ON sneaky_questionnaire_responses(question_id);
CREATE INDEX idx_sneaky_questionnaire_section ON sneaky_questionnaire_responses(section);
CREATE INDEX idx_sneaky_documents_vendor_id ON sneaky_documents(vendor_id);
CREATE INDEX idx_sneaky_documents_category ON sneaky_documents(category);
CREATE INDEX idx_sneaky_customers_vendor_id ON sneaky_customers(vendor_id);
CREATE INDEX idx_sneaky_customers_name_search ON sneaky_customers USING gin(customer_name gin_trgm_ops);
CREATE INDEX idx_sneaky_exports_vendor_id ON sneaky_exports(vendor_id);
CREATE INDEX idx_sneaky_exports_customer_id ON sneaky_exports(customer_id);
CREATE INDEX idx_sneaky_exports_exported_at ON sneaky_exports(exported_at DESC);

-- ==============================================================================
-- HELPER FUNCTIONS
-- ==============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sneaky_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_sneaky_vendors_updated_at
  BEFORE UPDATE ON sneaky_vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_sneaky_updated_at();

CREATE TRIGGER update_sneaky_questionnaire_updated_at
  BEFORE UPDATE ON sneaky_questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_sneaky_updated_at();

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Run these commands in Supabase UI or via CLI)
-- ==============================================================================
-- CREATE BUCKET sneaky-documents WITH (public = false);
-- CREATE BUCKET sneaky-exports WITH (public = false);
--
-- CREATE POLICY "Users can upload their own documents"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'sneaky-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can read their own documents"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'sneaky-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can delete their own documents"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'sneaky-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==============================================================================
-- EXAMPLE DATA (Optional - for testing)
-- ==============================================================================
-- Uncomment to insert test vendor
-- INSERT INTO sneaky_vendors (clerk_user_id, company_name, employee_count, work_types, address, contact)
-- VALUES (
--   'user_test123',
--   'Test Electrical Co',
--   25,
--   '["electrical", "heights"]'::jsonb,
--   '{"street": "123 Main St", "city": "Atlanta", "state": "GA", "zip": "30303"}'::jsonb,
--   '{"phone": "404-555-0100", "email": "info@testelectrical.com", "website": "https://testelectrical.com"}'::jsonb
-- );

-- ==============================================================================
-- VERIFICATION QUERIES
-- Check that everything is set up correctly
-- ==============================================================================
-- SELECT * FROM project_metadata WHERE project_slug = 'sneakylink-vendor-compliance';
-- SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'sneaky_%';
-- SELECT indexname FROM pg_indexes WHERE tablename LIKE 'sneaky_%';

-- ==============================================================================
-- END OF SCHEMA
-- To apply this migration:
-- 1. Create a new Supabase project for Sneakylink
-- 2. Run: npx supabase db push (or apply via Supabase UI)
-- 3. Create storage buckets manually in Supabase UI
-- 4. Update .env.local with new project credentials
-- ==============================================================================
