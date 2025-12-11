#!/bin/bash
set -e

echo "🔧 Fixing remaining import issues..."

# Fix config-loader imports (it's in shared/config not frontend/lib)
find frontend backend -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e "s|from '@frontend/lib/config-loader'|from '@shared/config/config-loader'|g" \
  -e "s|from '@/lib/config-loader'|from '@shared/config/config-loader'|g" \
  {} +

# Fix admin types imports (they're in shared/types not frontend/lib/types)
find frontend backend -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e "s|from '@frontend/lib/types/admin'|from '@shared/types/admin'|g" \
  -e "s|from '@/lib/types/admin'|from '@shared/types/admin'|g" \
  {} +

# Fix backend imports still using @/lib
find backend -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e "s|from '@/lib/admin/auth'|from '@backend/lib/admin/auth'|g" \
  -e "s|from '@/lib/supabase/client'|from '@backend/lib/supabase/client'|g" \
  -e "s|from '@/lib/supabase/types'|from '@backend/lib/supabase/types'|g" \
  -e "s|from '@/lib/twilio/client'|from '@backend/lib/twilio/client'|g" \
  -e "s|from '@/lib/email/smtp-client'|from '@backend/lib/email/smtp-client'|g" \
  -e "s|from '@/lib/utils/get-client-id'|from '@backend/lib/utils/get-client-id'|g" \
  -e "s|from '@/lib/schemas/client-config.schema'|from '@shared/schemas/client-config.schema'|g" \
  {} +

# Fix relative imports to cn utility
find frontend -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e "s|from '../../lib/utils/cn'|from '@backend/lib/utils/cn'|g" \
  -e "s|from '../lib/utils/cn'|from '@backend/lib/utils/cn'|g" \
  {} +

# Fix UrgencyElements supabase import
find frontend/components -type f -name "UrgencyElements.tsx" -exec sed -i '' \
  -e "s|from '@/lib/supabase/client'|from '@backend/lib/supabase/client'|g" \
  {} +

echo "✅ Import fixes applied!"
