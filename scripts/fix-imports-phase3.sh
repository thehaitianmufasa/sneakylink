#!/bin/bash
set -e

echo "🔧 Phase 3: Fixing final import issues..."

# Fix remaining @/lib/supabase/client imports in backend
sed -i '' 's|@/lib/supabase/client|@backend/lib/supabase/client|g' backend/api/leads/route.ts
sed -i '' 's|@/lib/supabase/client|@backend/lib/supabase/client|g' backend/api/twilio/incoming-sms/route.ts  
sed -i '' 's|@/lib/supabase/client|@backend/lib/supabase/client|g' backend/lib/twilio/client.ts

# Fix mask-phone imports in frontend components (should be from backend/lib/utils)
find frontend/components/sections -type f -name "*.tsx" -exec sed -i '' \
  -e "s|from '../../lib/utils/mask-phone'|from '@backend/lib/utils/mask-phone'|g" \
  {} +

# Fix UrgencyElements supabase import (frontend trying to import frontend/lib, should be backend/lib)
sed -i '' 's|@frontend/lib/supabase/client|@backend/lib/supabase/client|g' frontend/components/UrgencyElements.tsx

# Fix config-loader relative imports (should use @shared)
sed -i '' -e "s|from './types/client-config'|from '@shared/types/client-config'|g" \
          -e "s|from './schemas/client-config.schema'|from '@shared/schemas/client-config.schema'|g" \
          shared/config/config-loader.ts

echo "✅ All import fixes complete!"
