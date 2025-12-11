#!/bin/bash
set -e

echo "🔄 Sneakylink Import Path Migration Script"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to update imports in a file
update_file_imports() {
  local file="$1"
  local changes=0

  # Skip if file doesn't exist
  if [ ! -f "$file" ]; then
    return
  fi

  # Create temp file
  local temp_file="${file}.tmp"

  # Determine file location to use correct imports
  local dir=$(dirname "$file")

  # Update imports based on file location
  if [[ "$dir" == frontend/* ]]; then
    # Frontend files: Use @frontend for components, @backend for API calls, @shared for types
    sed -e "s|from ['\"]@/components|from '@frontend/components|g" \
        -e "s|from ['\"]@/lib/|from '@frontend/lib/|g" \
        -e "s|from ['\"]@/app/|from '@frontend/app/|g" \
        -e "s|from ['\"]\.\./\.\./lib/types|from '@shared/types|g" \
        -e "s|from ['\"]\.\./\.\./lib/schemas|from '@shared/schemas|g" \
        -e "s|from ['\"]\.\.\/lib/types|from '@shared/types|g" \
        -e "s|from ['\"]\.\.\/lib/schemas|from '@shared/schemas|g" \
        -e "s|from ['\"]\.\./\.\./components|from '@frontend/components|g" \
        "$file" > "$temp_file"
  elif [[ "$dir" == backend/* ]]; then
    # Backend files: Use @backend for lib, @shared for types/schemas
    sed -e "s|from ['\"]\.\./\.\./lib/supabase|from '@backend/lib/supabase|g" \
        -e "s|from ['\"]\.\./\.\./lib/twilio|from '@backend/lib/twilio|g" \
        -e "s|from ['\"]\.\./\.\./lib/email|from '@backend/lib/email|g" \
        -e "s|from ['\"]\.\./\.\./lib/admin|from '@backend/lib/admin|g" \
        -e "s|from ['\"]\.\./\.\./lib/utils|from '@backend/lib/utils|g" \
        -e "s|from ['\"]\.\./\.\./lib/types|from '@shared/types|g" \
        -e "s|from ['\"]\.\./\.\./lib/schemas|from '@shared/schemas|g" \
        -e "s|from ['\"]\.\.\/lib/|from '@backend/lib/|g" \
        -e "s|from ['\"]\.\./\.\./\.\./lib/types|from '@shared/types|g" \
        -e "s|from ['\"]\.\./\.\./\.\./lib/schemas|from '@shared/schemas|g" \
        "$file" > "$temp_file"
  elif [[ "$dir" == shared/* ]]; then
    # Shared files: Use @shared for internal imports
    sed -e "s|from ['\"]\.\.\/types|from '@shared/types|g" \
        -e "s|from ['\"]\.\.\/schemas|from '@shared/schemas|g" \
        -e "s|from ['\"]\.\.\/config|from '@shared/config|g" \
        "$file" > "$temp_file"
  fi

  # Check if file was modified
  if [ -f "$temp_file" ]; then
    if ! cmp -s "$file" "$temp_file"; then
      mv "$temp_file" "$file"
      changes=1
      echo -e "${GREEN}✓${NC} Updated: $file"
    else
      rm "$temp_file"
    fi
  fi

  return $changes
}

# Count total files
total_files=0
updated_files=0

echo "📁 Scanning frontend/ files..."
while IFS= read -r file; do
  total_files=$((total_files + 1))
  if update_file_imports "$file"; then
    updated_files=$((updated_files + 1))
  fi
done < <(find frontend -type f \( -name "*.ts" -o -name "*.tsx" \))

echo ""
echo "📁 Scanning backend/ files..."
while IFS= read -r file; do
  total_files=$((total_files + 1))
  if update_file_imports "$file"; then
    updated_files=$((updated_files + 1))
  fi
done < <(find backend -type f \( -name "*.ts" -o -name "*.tsx" \))

echo ""
echo "📁 Scanning shared/ files..."
while IFS= read -r file; do
  total_files=$((total_files + 1))
  if update_file_imports "$file"; then
    updated_files=$((updated_files + 1))
  fi
done < <(find shared -type f \( -name "*.ts" -o -name "*.tsx" \))

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Migration Complete!${NC}"
echo "   Total files scanned: $total_files"
echo "   Files updated: $updated_files"
echo ""
echo "Next steps:"
echo "  1. Run: npm run type-check"
echo "  2. Run: npm run build"
echo "  3. Fix any remaining import errors manually"
echo ""
