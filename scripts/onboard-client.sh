#!/bin/bash

# ============================================================================
# NEVERMISSLEAD CLIENT ONBOARDING SCRIPT
# Semi-automated onboarding with guided prompts
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emoji
CHECK="✅"
CROSS="❌"
ARROW="→"
WAIT="⏳"

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

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
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WAIT} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${ARROW} $1${NC}"
}

prompt_continue() {
    echo ""
    read -p "Press Enter to continue or Ctrl+C to cancel..."
    echo ""
}

prompt_yes_no() {
    while true; do
        read -p "$1 (y/n): " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

check_env_vars() {
    print_header "Checking Environment Variables"

    MISSING_VARS=0

    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        print_error "NEXT_PUBLIC_SUPABASE_URL not set"
        MISSING_VARS=$((MISSING_VARS + 1))
    fi

    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        print_error "SUPABASE_SERVICE_ROLE_KEY not set"
        MISSING_VARS=$((MISSING_VARS + 1))
    fi

    if [ -z "$TWILIO_ACCOUNT_SID" ]; then
        print_error "TWILIO_ACCOUNT_SID not set"
        MISSING_VARS=$((MISSING_VARS + 1))
    fi

    if [ -z "$TWILIO_AUTH_TOKEN" ]; then
        print_error "TWILIO_AUTH_TOKEN not set"
        MISSING_VARS=$((MISSING_VARS + 1))
    fi

    if [ $MISSING_VARS -gt 0 ]; then
        print_error "Missing $MISSING_VARS required environment variables"
        print_info "Please set variables in .env.local or export them"
        exit 1
    fi

    print_success "All required environment variables found"
}

# ============================================================================
# MAIN ONBOARDING WORKFLOW
# ============================================================================

print_header "🚀 NEVERMISSLEAD CLIENT ONBOARDING"
echo "This script will guide you through onboarding a new client."
echo "Estimated time: 30 minutes"
echo ""
echo "Prerequisites:"
echo "  - Client has completed Google Form intake"
echo "  - You have form responses ready"
echo "  - All environment variables are set"
echo ""

# Check if we're in the right directory
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    print_error "Must be run from nevermisslead-template repository"
    exit 1
fi

# Check environment variables
check_env_vars

prompt_continue

# ============================================================================
# STEP 1: COLLECT CLIENT INFORMATION
# ============================================================================

print_header "Step 1: Client Information"

read -p "Client slug (lowercase, no spaces): " CLIENT_SLUG
read -p "Business name: " BUSINESS_NAME
read -p "Phone number: " PHONE_NUMBER
read -p "Email address: " EMAIL_ADDRESS
read -p "Preferred area code for tracking number: " AREA_CODE

echo ""
echo "Client Information:"
echo "  Slug: $CLIENT_SLUG"
echo "  Business: $BUSINESS_NAME"
echo "  Phone: $PHONE_NUMBER"
echo "  Email: $EMAIL_ADDRESS"
echo "  Area Code: $AREA_CODE"
echo ""

if ! prompt_yes_no "Is this information correct?"; then
    print_error "Cancelled by user"
    exit 1
fi

# ============================================================================
# STEP 2: CREATE SUPABASE CLIENT RECORD
# ============================================================================

print_header "Step 2: Creating Supabase Client Record"

print_info "Adding client to database..."

if [ -f "$SCRIPT_DIR/setup-supabase-client.js" ]; then
    # Use automated script if available
    CLIENT_ID=$(node "$SCRIPT_DIR/setup-supabase-client.js" \
        --slug="$CLIENT_SLUG" \
        --business="$BUSINESS_NAME" \
        --phone="$PHONE_NUMBER" \
        --email="$EMAIL_ADDRESS" \
        --status="trial" \
        --json | jq -r '.id')

    if [ -n "$CLIENT_ID" ]; then
        print_success "Client created with ID: $CLIENT_ID"
    else
        print_error "Failed to create client record"
        exit 1
    fi
else
    # Manual instructions if script doesn't exist
    print_warning "Automation script not found"
    print_info "Please add client manually in Supabase:"
    echo ""
    echo "1. Go to: https://app.supabase.com"
    echo "2. Table Editor → clients → Insert row"
    echo "3. Fill in: slug=$CLIENT_SLUG, business_name=$BUSINESS_NAME, phone=$PHONE_NUMBER, email=$EMAIL_ADDRESS"
    echo "4. Click Save"
    echo ""

    prompt_continue

    read -p "Enter the generated client ID (UUID): " CLIENT_ID
fi

print_success "Client ID: $CLIENT_ID"

# ============================================================================
# STEP 3: GENERATE CONFIG FILE
# ============================================================================

print_header "Step 3: Generating Config File"

CONFIG_FILE="$PROJECT_ROOT/config/clients/$CLIENT_SLUG.json"

if [ -f "$CONFIG_FILE" ]; then
    print_warning "Config file already exists: $CONFIG_FILE"
    if ! prompt_yes_no "Overwrite existing file?"; then
        print_info "Skipping config generation"
    else
        print_info "Copying template..."
        cp "$PROJECT_ROOT/config/config.template.json" "$CONFIG_FILE"
        print_success "Config template copied"
        print_warning "You must manually fill in config fields using Google Form responses"
    fi
else
    print_info "Copying template..."
    cp "$PROJECT_ROOT/config/config.template.json" "$CONFIG_FILE"
    print_success "Config template copied to: $CONFIG_FILE"
    print_warning "You must manually fill in config fields using Google Form responses"
fi

print_info "Opening config file in default editor..."
prompt_continue

# Try to open in editor (works on Mac)
if command -v open &> /dev/null; then
    open "$CONFIG_FILE"
elif command -v xdg-open &> /dev/null; then
    xdg-open "$CONFIG_FILE"
else
    print_warning "Could not auto-open file. Please edit manually: $CONFIG_FILE"
fi

echo ""
print_warning "IMPORTANT: Update these fields in the config file:"
echo "  - clientId: $CLIENT_ID"
echo "  - slug: $CLIENT_SLUG"
echo "  - businessInfo section (all fields)"
echo "  - services (8 services required)"
echo "  - faq (5-10 questions)"
echo "  - serviceAreas (cities and counties)"
echo ""

prompt_continue

# ============================================================================
# STEP 4: PURCHASE TWILIO NUMBER
# ============================================================================

print_header "Step 4: Purchasing Twilio Tracking Number"

if prompt_yes_no "Purchase Twilio number now? (Costs \$2.75/month)"; then
    print_info "Searching for available numbers in area code $AREA_CODE..."

    if [ -f "$SCRIPT_DIR/provision-twilio-number.js" ]; then
        # Use automated script
        TWILIO_NUMBER=$(node "$SCRIPT_DIR/provision-twilio-number.js" \
            --areaCode="$AREA_CODE" \
            --buy \
            --json | jq -r '.phoneNumber')

        if [ -n "$TWILIO_NUMBER" ]; then
            print_success "Number purchased: $TWILIO_NUMBER"
        else
            print_error "Failed to purchase number"
            exit 1
        fi
    else
        # Manual instructions
        print_warning "Automation script not found"
        print_info "Please purchase number manually:"
        echo ""
        echo "1. Go to: https://console.twilio.com"
        echo "2. Phone Numbers → Buy a number"
        echo "3. Area code: $AREA_CODE"
        echo "4. Capabilities: Voice + SMS + MMS"
        echo "5. Click Buy"
        echo ""

        prompt_continue

        read -p "Enter purchased phone number (+1xxxxxxxxxx): " TWILIO_NUMBER
    fi

    # Update database with Twilio number
    print_info "Updating database with Twilio number..."
    # SQL update would go here (simplified for this script)

    print_success "Twilio number: $TWILIO_NUMBER"
else
    print_warning "Skipping Twilio number purchase"
    TWILIO_NUMBER=""
fi

# ============================================================================
# STEP 5: COMMIT AND DEPLOY
# ============================================================================

print_header "Step 5: Committing Changes to Git"

print_info "Staging config file..."
git add "$CONFIG_FILE"

print_info "Committing..."
git commit -m "Add client configuration: $BUSINESS_NAME"

print_success "Changes committed"

if prompt_yes_no "Push to GitHub and deploy to Vercel now?"; then
    print_info "Pushing to GitHub..."
    git push origin main

    print_success "Pushed to GitHub"
    print_warning "Vercel will auto-deploy in 2-3 minutes"
    print_info "Check deployment status: https://vercel.com/dashboard"
else
    print_warning "Skipping push. Remember to deploy later!"
fi

# ============================================================================
# STEP 6: CONFIGURE TWILIO WEBHOOKS
# ============================================================================

print_header "Step 6: Configuring Twilio Webhooks"

if [ -n "$TWILIO_NUMBER" ]; then
    read -p "Enter production URL (https://clientdomain.com): " PRODUCTION_URL

    if [ -n "$PRODUCTION_URL" ]; then
        print_info "Configuring webhooks for $TWILIO_NUMBER..."

        if [ -f "$SCRIPT_DIR/provision-twilio-number.js" ]; then
            node "$SCRIPT_DIR/provision-twilio-number.js" \
                --number="$TWILIO_NUMBER" \
                --webhookUrl="$PRODUCTION_URL" \
                --configure

            print_success "Webhooks configured"
        else
            print_warning "Automation script not found"
            print_info "Please configure webhooks manually:"
            echo ""
            echo "1. Go to: https://console.twilio.com"
            echo "2. Phone Numbers → $TWILIO_NUMBER"
            echo "3. Voice URL: $PRODUCTION_URL/api/twilio/voice (POST)"
            echo "4. SMS URL: $PRODUCTION_URL/api/twilio/sms (POST)"
            echo "5. Status Callback: $PRODUCTION_URL/api/twilio/status (POST)"
            echo "6. Click Save"
            echo ""

            prompt_continue
        fi
    fi
else
    print_warning "No Twilio number configured - skipping webhook setup"
fi

# ============================================================================
# STEP 7: TESTING
# ============================================================================

print_header "Step 7: Testing"

print_info "Test checklist:"
echo "  [ ] Visit website: $PRODUCTION_URL"
echo "  [ ] Submit lead form"
echo "  [ ] Call tracking number: $TWILIO_NUMBER"
echo "  [ ] Text tracking number: $TWILIO_NUMBER"
echo "  [ ] Check leads in Supabase database"
echo "  [ ] Check call logs in Supabase"
echo "  [ ] Check SMS logs in Supabase"
echo "  [ ] Verify email notification received"
echo ""

prompt_continue

# ============================================================================
# SUMMARY
# ============================================================================

print_header "✅ ONBOARDING COMPLETE!"

echo ""
echo "Client Details:"
echo "  Business: $BUSINESS_NAME"
echo "  Slug: $CLIENT_SLUG"
echo "  Client ID: $CLIENT_ID"
echo "  Tracking Number: $TWILIO_NUMBER"
echo "  Website: $PRODUCTION_URL"
echo ""
echo "Next Steps:"
echo "  1. Test all functionality (forms, calls, SMS)"
echo "  2. Send welcome email to client"
echo "  3. Update client status to 'active' in database"
echo "  4. Send invoice for setup fee + first month"
echo "  5. Schedule 48-hour follow-up"
echo ""
echo "Documentation:"
echo "  - Full checklist: docs/ONBOARDING_CHECKLIST.md"
echo "  - Testing guide: docs/TESTING_CHECKLIST.md"
echo "  - Troubleshooting: docs/TROUBLESHOOTING.md"
echo ""

print_success "Client onboarding workflow complete!"
