# Sneakylink - Autonomous SAAS Template Platform

**Project Vision:** A reusable Next.js template with autonomous coding capabilities for building SAAS applications rapidly.

**Date:** December 8, 2025

---

## 📊 Current State Summary

### ✅ COMPLETED WORK

1. **Clean Architecture Implementation** ✅
   - Frontend/Backend/Shared separation
   - TypeScript path aliases (`@frontend/*`, `@backend/*`, `@shared/*`)
   - Build compiles successfully (0 TypeScript errors)

2. **Technology Stack** ✅
   - Next.js 15.1 + React 19
   - Clerk authentication library (installed)
   - Supabase + Twilio configured
   - All dependencies installed

3. **Build Status** ✅
   - Production build succeeds
   - 15 routes rendering correctly
   - TypeScript compilation clean

### ❌ NEEDS IMPLEMENTATION

1. **GitHub Repository** - No remote configured
2. **Autonomous Coding Harness** - Folders empty
3. **Clerk Configuration** - Missing env variables
4. **Web Generating Skill** - Not implemented
5. **Documentation** - Partial, needs cleanup

---

## 🎯 Implementation Phases

### Phase 1: Project Cleanup & Rebranding (30 min)

**Objectives:**
- Rename all NeverMissLead references to Sneakylink
- Delete unnecessary folders
- Update documentation
- Create clean project structure

**Tasks:**
1. Delete `nevermisslead-ui-redesign/` folder
2. Delete `mock-design/` folder
3. Update `package.json` name and description
4. Update `README.md` for Sneakylink branding
5. Clean up `CLAUDE.md` (remove NeverMissLead history)
6. Update configuration files

**Files to Update:**
- `package.json` - Project name and description
- `README.md` - Main documentation
- `CLAUDE.md` - Project tracking
- `.env.local` - CLIENT_SLUG reference
- Any hardcoded references in components

### Phase 2: GitHub Repository Setup (15 min)

**Objectives:**
- Fork nevermisslead-template repository
- Rename fork to Sneakylink
- Connect local repository
- Push current work

**Commands:**
```bash
# Fork repository
gh repo fork thehaitianmufasa/nevermisslead-template \
  --fork-name sneakylink \
  --clone=false

# Add remote
git remote add origin https://github.com/[username]/sneakylink.git

# Push
git push -u origin feature/clean-architecture

# Create main branch
git checkout -b main
git push -u origin main
```

### Phase 3: Autonomous Coding Harness (90 min)

**Architecture:** Two-Agent Pattern

```
┌─────────────────────────────────────────────────────────┐
│ Initializer Agent (Session 1)                          │
├─────────────────────────────────────────────────────────┤
│ • Read app_spec.txt (SAAS requirements)                 │
│ • Generate feature_list.json (200 test cases)           │
│ • Set up project structure                              │
│ • Initialize git repository                             │
│ • Create init.sh for environment                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Coding Agent (Sessions 2+)                              │
├─────────────────────────────────────────────────────────┤
│ • Read progress files (claude-progress.txt)             │
│ • Check feature_list.json for next task                 │
│ • Implement feature incrementally                       │
│ • Run tests & verify end-to-end                         │
│ • Commit to git with descriptive message                │
│ • Update progress tracking                              │
│ • Auto-continue (3s delay) or Ctrl+C to pause           │
└─────────────────────────────────────────────────────────┘
```

**Files to Create:**

1. **Core Python Files:**
   ```
   autonomous-coding/
   ├── autonomous_agent_demo.py   # Main entry point
   ├── agent.py                    # Session management
   ├── client.py                   # Claude SDK config
   ├── security.py                 # Bash allowlist
   ├── progress.py                 # Progress tracking
   └── prompts.py                  # Prompt utilities
   ```

2. **Prompt Templates:**
   ```
   autonomous-coding/prompts/
   ├── app_spec.txt               # SAAS specification
   ├── initializer_prompt.md      # Session 1 prompt
   └── coding_prompt.md           # Sessions 2+ prompt
   ```

3. **Dependencies:**
   ```
   autonomous-coding/requirements.txt:
   - claude-code-sdk>=0.2.0
   - anthropic>=0.40.0
   ```

**Key Features:**
- ✅ Session persistence (git + JSON)
- ✅ Bash command security allowlist
- ✅ Filesystem restrictions (project dir only)
- ✅ Progress tracking across sessions
- ✅ Auto-resume capability
- ✅ Error handling & rollback via git

**Security Allowlist:**
```python
ALLOWED_COMMANDS = [
    # File inspection
    'ls', 'cat', 'head', 'tail', 'wc', 'grep',

    # Node.js development
    'npm', 'node', 'npx',

    # Version control
    'git',

    # Process management (dev only)
    'ps', 'lsof', 'sleep', 'pkill'
]
```

### Phase 4: Clerk Authentication (30 min)

**Objectives:**
- Configure Clerk for user authentication
- Add to existing clean architecture
- Test sign-up/sign-in flow

**Steps:**
1. Create Clerk account (https://clerk.com)
2. Create new application ("Sneakylink")
3. Get API keys
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
5. Wrap app in ClerkProvider (`app/layout.tsx`)
6. Add sign-in/sign-up pages
7. Protect routes with middleware

**Integration Points:**
- `frontend/components/auth/` - Auth UI components
- `backend/middleware/` - Route protection
- `app/layout.tsx` - ClerkProvider wrapper

### Phase 5: Web Generating Skill (60 min)

**Objectives:**
- Create UI scaffolding templates
- Integrate with autonomous coding
- Enable rapid SAAS prototyping

**Templates to Create:**

1. **Landing Pages:**
   - Hero section + CTA
   - Features grid
   - Pricing table
   - Testimonials
   - FAQ section

2. **Dashboard Layouts:**
   - Sidebar navigation
   - Metrics cards
   - Data tables
   - Charts/graphs

3. **Forms:**
   - Contact forms
   - Multi-step wizards
   - Settings panels
   - Profile management

4. **Authentication:**
   - Sign in/up pages
   - Password reset
   - Email verification
   - OAuth integration

**File Structure:**
```
frontend/
└── templates/
    ├── landing/
    │   ├── hero-with-cta.tsx
    │   ├── features-grid.tsx
    │   ├── pricing-table.tsx
    │   └── testimonials.tsx
    ├── dashboard/
    │   ├── sidebar-layout.tsx
    │   ├── metrics-cards.tsx
    │   └── data-table.tsx
    └── forms/
        ├── contact-form.tsx
        ├── multi-step-wizard.tsx
        └── settings-panel.tsx
```

**Generator Script:**
```bash
npm run generate-design -- --template=landing-hero --output=app/page.tsx
```

### Phase 6: Documentation (45 min)

**Documents to Create:**

1. **ARCHITECTURE.md** - Clean architecture explanation
   - Frontend/Backend/Shared separation
   - TypeScript path aliases
   - Folder structure
   - Best practices

2. **AUTONOMOUS_CODING.md** - Agent setup and usage
   - Installation guide
   - Running first session
   - Customizing prompts
   - Security configuration
   - Troubleshooting

3. **CLERK_SETUP.md** - Authentication configuration
   - Account creation
   - Environment variables
   - UI integration
   - Middleware setup

4. **WEB_GENERATION.md** - UI scaffolding guide
   - Available templates
   - CLI usage
   - Customization
   - Examples

5. **DEPLOYMENT.md** - Production deployment
   - Vercel setup
   - Environment variables
   - Domain configuration
   - Monitoring

6. **README.md** - Updated main docs
   - Project overview
   - Quick start
   - Features list
   - Tech stack
   - License

---

## 🔍 Technical Architecture

### Clean Architecture Structure

```
sneakylink/
├── frontend/              # React UI layer
│   ├── components/        # UI components
│   │   ├── sections/      # Page sections
│   │   ├── forms/         # Form components
│   │   ├── ui/            # Reusable UI primitives
│   │   └── admin/         # Admin components
│   ├── lib/               # Frontend utilities
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   └── templates/         # Web generation templates
│
├── backend/               # Server-side logic
│   ├── lib/               # Backend utilities
│   │   ├── admin/         # Admin authentication
│   │   ├── email/         # SMTP client
│   │   ├── supabase/      # Database client
│   │   ├── twilio/        # Phone/SMS client
│   │   └── utils/         # Helper functions
│   └── middleware/        # API middleware
│
├── shared/                # Shared resources
│   ├── config/            # Client configurations
│   │   ├── clients/       # JSON configs per client
│   │   └── config-loader.ts
│   ├── schemas/           # Zod validation
│   │   └── client-config.schema.ts
│   ├── types/             # TypeScript interfaces
│   │   ├── admin.ts
│   │   └── client-config.ts
│   └── constants/         # App constants
│
├── autonomous-coding/     # Agent harness
│   ├── agents/            # Agent implementations
│   ├── prompts/           # Prompt templates
│   ├── scripts/           # Utility scripts
│   └── utils/             # Helper functions
│
├── app/                   # Next.js App Router
│   ├── api/               # API routes
│   ├── (public)/          # Public pages
│   └── (protected)/       # Auth-protected pages
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── AUTONOMOUS_CODING.md
│   ├── CLERK_SETUP.md
│   ├── WEB_GENERATION.md
│   └── DEPLOYMENT.md
│
└── scripts/               # Build/dev scripts
```

### Benefits of This Structure

1. **Separation of Concerns:**
   - Frontend: Pure UI, no business logic
   - Backend: APIs, database, integrations
   - Shared: Common types and utilities

2. **TypeScript Path Aliases:**
   ```typescript
   import { Button } from '@frontend/components/ui/button'
   import { supabase } from '@backend/lib/supabase/client'
   import { ClientConfig } from '@shared/types/client-config'
   ```

3. **Testability:**
   - Each layer testable independently
   - Mock backend for frontend tests
   - Mock frontend for API tests

4. **Scalability:**
   - Easy to add features
   - Clear module boundaries
   - Reusable shared code

---

## 🚀 Success Criteria

Sneakylink will be complete when:

✅ **Repository Setup:**
- GitHub fork created and connected
- Clean git history
- Main and feature branches

✅ **Autonomous Coding:**
- Python harness working end-to-end
- Two-agent pattern functional
- Security allowlist enforced
- Progress tracking operational

✅ **Authentication:**
- Clerk fully configured
- Sign-in/sign-up working
- Protected routes functional
- User sessions persistent

✅ **Web Generation:**
- Template library complete
- CLI tool operational
- Documentation clear
- Examples provided

✅ **Documentation:**
- All docs complete
- Examples included
- Best practices documented
- Troubleshooting guides

✅ **Testing:**
- Sample SAAS app generated
- End-to-end workflow validated
- Security verified
- Performance acceptable

---

## 📋 Project Principles

1. **Speed:** Enable rapid SAAS prototyping
2. **Quality:** Clean architecture, best practices
3. **Security:** Sandboxed agents, validated inputs
4. **Autonomy:** Minimal human intervention
5. **Scalability:** Easy to extend and customize
6. **Documentation:** Clear, comprehensive guides

---

## 🎯 Timeline Estimate

**Total Time:** 4-5 hours

| Phase | Time | Priority |
|-------|------|----------|
| 1. Cleanup & Rebranding | 30 min | HIGH |
| 2. GitHub Setup | 15 min | HIGH |
| 3. Autonomous Coding | 90 min | HIGH |
| 4. Clerk Auth | 30 min | MEDIUM |
| 5. Web Generation | 60 min | MEDIUM |
| 6. Documentation | 45 min | MEDIUM |

---

**Status:** Ready to begin Phase 1 - Project Cleanup & Rebranding
**Next:** Create TASKS.md with actionable items
