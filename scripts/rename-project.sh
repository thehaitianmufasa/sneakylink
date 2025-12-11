#!/bin/bash

# ============================================================================
# PROJECT RENAME SCRIPT
# Renames all instances of old project name to new project name
# ============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# ============================================================================
# CONFIGURATION
# ============================================================================

OLD_NAME_LOWER="codeforge"
OLD_NAME_UPPER="CodeForge"
OLD_NAME_CAPS="CODEFORGE"

NEW_NAME_LOWER="sneakylink"
NEW_NAME_UPPER="Sneakylink"
NEW_NAME_CAPS="SNEAKYLINK"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}→ $1${NC}"
}

# ============================================================================
# MAIN RENAMING LOGIC
# ============================================================================

print_header "🚀 PROJECT RENAME: $OLD_NAME_UPPER → $NEW_NAME_UPPER"

cd "$PROJECT_ROOT"

# ============================================================================
# STEP 1: Rename in package.json
# ============================================================================

print_info "Renaming in package.json..."

if [ -f "package.json" ]; then
    # Backup
    cp package.json package.json.bak

    # Replace name and description
    sed -i '' "s/\"name\": \"$OLD_NAME_LOWER\"/\"name\": \"$NEW_NAME_LOWER\"/g" package.json
    sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" package.json
    sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" package.json

    print_success "package.json updated"
else
    print_error "package.json not found"
fi

# ============================================================================
# STEP 2: Rename in all Markdown files
# ============================================================================

print_info "Renaming in Markdown files..."

find . -type f -name "*.md" ! -path "*/node_modules/*" ! -path "*/.git/*" | while read -r file; do
    if [ -f "$file" ]; then
        # Case variations
        sed -i '' "s/$OLD_NAME_CAPS/$NEW_NAME_CAPS/g" "$file"
        sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$file"
        sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$file"
        print_success "Updated: $file"
    fi
done

# ============================================================================
# STEP 3: Rename in environment files
# ============================================================================

print_info "Renaming in environment files..."

for env_file in .env.local .env.local.example .env.template; do
    if [ -f "$env_file" ]; then
        sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$env_file"
        sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$env_file"
        print_success "Updated: $env_file"
    fi
done

# ============================================================================
# STEP 4: Rename in configuration files
# ============================================================================

print_info "Renaming in config files..."

# TypeScript config
if [ -f "tsconfig.json" ]; then
    sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" tsconfig.json
    print_success "Updated: tsconfig.json"
fi

# Next.js config
if [ -f "next.config.js" ]; then
    sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" next.config.js
    sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" next.config.js
    print_success "Updated: next.config.js"
fi

# Tailwind config
if [ -f "tailwind.config.ts" ] || [ -f "tailwind.config.js" ]; then
    find . -maxdepth 1 -name "tailwind.config.*" | while read -r file; do
        sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$file"
        print_success "Updated: $file"
    done
fi

# ============================================================================
# STEP 5: Rename in source files
# ============================================================================

print_info "Renaming in source files (.ts, .tsx, .js, .jsx)..."

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
    ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/.next/*" | while read -r file; do
    if [ -f "$file" ]; then
        # Check if file contains old name
        if grep -q "$OLD_NAME_LOWER\|$OLD_NAME_UPPER\|$OLD_NAME_CAPS" "$file" 2>/dev/null; then
            sed -i '' "s/$OLD_NAME_CAPS/$NEW_NAME_CAPS/g" "$file"
            sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$file"
            sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$file"
            print_success "Updated: $file"
        fi
    fi
done

# ============================================================================
# STEP 6: Rename in JSON files
# ============================================================================

print_info "Renaming in JSON config files..."

find config -type f -name "*.json" 2>/dev/null | while read -r file; do
    if [ -f "$file" ]; then
        sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$file"
        sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$file"
        print_success "Updated: $file"
    fi
done

# ============================================================================
# STEP 7: Rename in docs
# ============================================================================

print_info "Renaming in docs directory..."

if [ -d "docs" ]; then
    find docs -type f \( -name "*.md" -o -name "*.txt" \) | while read -r file; do
        sed -i '' "s/$OLD_NAME_CAPS/$NEW_NAME_CAPS/g" "$file"
        sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$file"
        sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$file"
        print_success "Updated: $file"
    done
fi

# ============================================================================
# STEP 8: Rename in scripts
# ============================================================================

print_info "Renaming in scripts directory..."

if [ -d "scripts" ]; then
    find scripts -type f \( -name "*.sh" -o -name "*.js" \) ! -name "rename-project.sh" | while read -r file; do
        if grep -q "$OLD_NAME_LOWER\|$OLD_NAME_UPPER\|$OLD_NAME_CAPS" "$file" 2>/dev/null; then
            sed -i '' "s/$OLD_NAME_CAPS/$NEW_NAME_CAPS/g" "$file"
            sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$file"
            sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$file"
            print_success "Updated: $file"
        fi
    done
fi

# ============================================================================
# STEP 9: Rename any remaining references
# ============================================================================

print_info "Scanning for any remaining references..."

# Check HTML files
find . -type f -name "*.html" ! -path "*/node_modules/*" ! -path "*/.git/*" | while read -r file; do
    if grep -q "$OLD_NAME_LOWER\|$OLD_NAME_UPPER\|$OLD_NAME_CAPS" "$file" 2>/dev/null; then
        sed -i '' "s/$OLD_NAME_CAPS/$NEW_NAME_CAPS/g" "$file"
        sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$file"
        sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$file"
        print_success "Updated: $file"
    fi
done

# ============================================================================
# STEP 10: Update README specifically
# ============================================================================

print_info "Updating README files..."

for readme in README.md README-ONBOARDING.md; do
    if [ -f "$readme" ]; then
        sed -i '' "s/$OLD_NAME_CAPS/$NEW_NAME_CAPS/g" "$readme"
        sed -i '' "s/$OLD_NAME_UPPER/$NEW_NAME_UPPER/g" "$readme"
        sed -i '' "s/$OLD_NAME_LOWER/$NEW_NAME_LOWER/g" "$readme"
        print_success "Updated: $readme"
    fi
done

# ============================================================================
# CLEANUP
# ============================================================================

print_info "Cleaning up backup files..."

find . -name "*.bak" -type f -delete
print_success "Backup files removed"

# ============================================================================
# SUMMARY
# ============================================================================

print_header "✅ RENAME COMPLETE!"

echo ""
echo "Project renamed from $OLD_NAME_UPPER to $NEW_NAME_UPPER"
echo ""
echo "Updated:"
echo "  ✓ package.json"
echo "  ✓ All Markdown files"
echo "  ✓ Environment files"
echo "  ✓ Config files (tsconfig.json, next.config.js, etc.)"
echo "  ✓ Source files (.ts, .tsx, .js, .jsx)"
echo "  ✓ Documentation"
echo "  ✓ Scripts"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Test build: npm run build"
echo "  3. Update CLIENT_SLUG in .env.local to 'sneakylink'"
echo "  4. Commit changes: git add . && git commit -m 'Rename project to Sneakylink'"
echo "  5. Push to GitHub: git push"
echo ""

print_success "Rename script completed successfully!"
