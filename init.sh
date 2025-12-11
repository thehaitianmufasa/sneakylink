#!/bin/bash

# ==============================================================================
# SNEAKYLINK - Development Server Startup Script
# Run this at the start of every coding session
# ==============================================================================

echo "🚀 Starting Sneakylink development environment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Must be run from Sneakylink project root"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  WARNING: .env.local not found!"
    echo ""
    echo "Please create .env.local with the following variables:"
    echo "-----------------------------------------------------------"
    echo "# Clerk Authentication"
    echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key"
    echo "CLERK_SECRET_KEY=your_clerk_secret_key"
    echo ""
    echo "# Supabase"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    echo ""
    echo "# App Configuration"
    echo "NEXT_PUBLIC_APP_URL=http://localhost:3000"
    echo "-----------------------------------------------------------"
    echo ""
    echo "Get your keys from:"
    echo "  - Clerk: https://dashboard.clerk.com"
    echo "  - Supabase: https://app.supabase.com"
    echo ""
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  WARNING: Node.js 18+ recommended (current: $(node -v))"
    echo ""
fi

# Display project info
echo "📊 Project Information:"
echo "-----------------------------------------------------------"
echo "  Project: Sneakylink - Vendor Compliance Prep SaaS"
echo "  Location: $(pwd)"
echo "  Node: $(node -v)"
echo "  npm: $(npm -v)"
echo ""
echo "  Next Steps:"
echo "    1. Visit http://localhost:3000"
echo "    2. Check feature_list.json for next feature to implement"
echo "    3. Read claude-progress.txt for session context"
echo "-----------------------------------------------------------"
echo ""

# Start Next.js dev server
echo "🔥 Starting Next.js development server..."
echo "   URL: http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

npm run dev
