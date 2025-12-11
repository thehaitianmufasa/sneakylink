-- ============================================================================
-- ADD PLUMBING AND ELECTRICAL DEMO CLIENT RECORDS
-- ============================================================================
-- This adds 2 client records for demo sites (all leads route to jeff@cherysolutions.com)
-- Executed: November 3, 2025
-- ============================================================================

-- Record 1: Plumbing Demo
INSERT INTO clients (
  id,
  slug,
  business_name,
  legal_name,
  industry,
  phone,
  email,
  address,
  status,
  subscription_plan,
  subscription_status,
  monthly_price,
  setup_fee,
  setup_fee_paid
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'plumbing',
  'NeverMissLead Plumbing',
  'NeverMissLead Plumbing Services LLC',
  'Plumbing Services',
  '(678) 788-7281',
  'jeff@cherysolutions.com',
  '1234 Peachtree Industrial Blvd, Atlanta, GA 30341',
  'active',
  'standard',
  'active',
  297.00,
  497.00,
  false
);

-- Record 2: Electrical Demo
INSERT INTO clients (
  id,
  slug,
  business_name,
  legal_name,
  industry,
  phone,
  email,
  address,
  status,
  subscription_plan,
  subscription_status,
  monthly_price,
  setup_fee,
  setup_fee_paid
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'electrical',
  'NeverMissLead Electrical',
  'NeverMissLead Electrical Services LLC',
  'Electrical Services',
  '(678) 788-7281',
  'jeff@cherysolutions.com',
  '1234 Peachtree Industrial Blvd, Atlanta, GA 30341',
  'active',
  'standard',
  'active',
  297.00,
  497.00,
  false
);

-- Verify Records Added
SELECT
  id,
  slug,
  business_name,
  industry,
  email,
  status,
  created_at
FROM clients
ORDER BY slug;
