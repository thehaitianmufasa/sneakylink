# Sneakylink Implementation Tasks

**Project:** Autonomous SAAS Template Platform
**Date:** December 8, 2025

---

## 🔥 Phase 1: Project Cleanup & Rebranding (30 min)

### 1.1 Delete Unnecessary Folders
- [ ] Delete `nevermisslead-ui-redesign/` folder
- [ ] Delete `mock-design/` folder
- [ ] Delete any other unused assets

**Commands:**
```bash
rm -rf nevermisslead-ui-redesign/
rm -rf mock-design/
```

### 1.2 Update package.json
- [ ] Change `name` to `"sneakylink"`
- [ ] Update `description` to `"Enterprise SAAS platform with autonomous coding capabilities"`
- [ ] Update `version` to `"1.0.0"` (fresh start)
- [ ] Review and clean up scripts

**Changes:**
```json
{
  "name": "sneakylink",
  "version": "1.0.0",
  "description": "Enterprise SAAS platform with autonomous coding capabilities for rapid prototyping"
}
```

### 1.3 Update README.md
- [ ] Change title to "Sneakylink"
- [ ] Update description
- [ ] Update business model section (remove contractor-specific)
- [ ] Add autonomous coding features
- [ ] Update quick start guide
- [ ] Remove NeverMissLead branding

**New Content:**
```markdown
# Sneakylink

Autonomous SAAS template platform with AI-powered code generation.

## Features
- 🤖 Autonomous coding with Claude agents
- 🏗️ Clean architecture (Frontend/Backend/Shared)
- 🔐 Clerk authentication
- 🎨 Web generation templates
- 📦 Next.js 15 + React 19
```

### 1.4 Clean Up CLAUDE.md
- [ ] Remove NeverMissLead project history
- [ ] Keep only relevant Sneakylink updates
- [ ] Add new sections for autonomous coding
- [ ] Document clean architecture
- [ ] Update status to Sneakylink v1.0

### 1.5 Update Environment Variables
- [ ] Change `CLIENT_SLUG` from `nevermisslead` to `sneakylink`
- [ ] Add placeholder for Clerk keys
- [ ] Document all required variables

**`.env.local` updates:**
```bash
CLIENT_SLUG=sneakylink

# Clerk Authentication (TODO: Add keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 1.6 Update Configuration Files
- [ ] Check `shared/config/clients/` for hardcoded references
- [ ] Update `next.config.js` if needed
- [ ] Review `tsconfig.json` (should be clean)

---

## 🐙 Phase 2: GitHub Repository Setup (15 min)

### 2.1 Fork Repository
- [ ] Fork https://github.com/thehaitianmufasa/nevermisslead-template
- [ ] Rename fork to `sneakylink`
- [ ] Update repository description
- [ ] Set visibility to private (initially)

**GitHub CLI:**
```bash
gh repo fork thehaitianmufasa/nevermisslead-template \
  --fork-name sneakylink \
  --clone=false
```

### 2.2 Connect Local Repository
- [ ] Add GitHub remote
- [ ] Verify remote connection
- [ ] Push current feature branch

**Commands:**
```bash
git remote add origin https://github.com/thehaitianmufasa/sneakylink.git
git remote -v  # Verify
git push -u origin feature/clean-architecture
```

### 2.3 Create Main Branch
- [ ] Checkout new main branch
- [ ] Merge clean architecture work
- [ ] Push to GitHub
- [ ] Set as default branch

**Commands:**
```bash
git checkout -b main
git merge feature/clean-architecture
git push -u origin main
gh repo edit --default-branch main
```

### 2.4 Repository Cleanup
- [ ] Add repository topics (nextjs, typescript, autonomous-coding, saas)
- [ ] Create `.github/` folder
- [ ] Add `CONTRIBUTING.md`
- [ ] Add `LICENSE` (if applicable)

---

## 🤖 Phase 3: Autonomous Coding Harness (90 min)

### 3.1 Install Python Dependencies
- [ ] Create `autonomous-coding/requirements.txt`
- [ ] Install dependencies
- [ ] Verify Claude Code SDK version

**`requirements.txt`:**
```txt
claude-code-sdk>=0.2.0
anthropic>=0.40.0
```

**Commands:**
```bash
cd autonomous-coding
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3.2 Create Core Python Files

#### 3.2.1 autonomous_agent_demo.py (Main Entry)
- [ ] Create argument parser
- [ ] Add project directory option
- [ ] Add max iterations option
- [ ] Add model selection option
- [ ] Implement session loop
- [ ] Add Ctrl+C handling

**Key Functions:**
- `main()` - Entry point
- `run_session()` - Execute single session
- `should_continue()` - Check if more work needed

#### 3.2.2 agent.py (Session Management)
- [ ] Create session initialization
- [ ] Implement progress tracking
- [ ] Add git integration
- [ ] Handle session handoff
- [ ] Implement error handling

**Key Functions:**
- `initialize_session()` - Set up new session
- `run_agent()` - Execute agent with prompts
- `save_progress()` - Update progress files
- `commit_work()` - Git commit

#### 3.2.3 client.py (Claude SDK Config)
- [ ] Configure Claude client
- [ ] Set model parameters
- [ ] Add tool configurations
- [ ] Implement security hooks

**Key Functions:**
- `create_client()` - Initialize SDK
- `get_model_config()` - Model settings

#### 3.2.4 security.py (Bash Allowlist)
- [ ] Define allowed commands list
- [ ] Implement validation function
- [ ] Add filesystem restrictions
- [ ] Create security hook

**Allowed Commands:**
```python
ALLOWED_COMMANDS = [
    'ls', 'cat', 'head', 'tail', 'wc', 'grep',  # File inspection
    'npm', 'node', 'npx',                        # Node.js
    'git',                                        # Version control
    'ps', 'lsof', 'sleep', 'pkill'               # Process mgmt
]
```

#### 3.2.5 progress.py (Progress Tracking)
- [ ] Create feature list manager
- [ ] Implement progress file reader/writer
- [ ] Add git log parser
- [ ] Build status reporter

**Key Functions:**
- `load_feature_list()` - Read JSON
- `mark_feature_complete()` - Update status
- `get_next_feature()` - Find next task
- `write_progress()` - Save to file

#### 3.2.6 prompts.py (Prompt Utilities)
- [ ] Create prompt loader
- [ ] Add template replacement
- [ ] Implement prompt caching

**Key Functions:**
- `load_prompt()` - Read markdown file
- `format_prompt()` - Replace variables

### 3.3 Create Prompt Templates

#### 3.3.1 app_spec.txt
- [ ] Define SAAS application requirements
- [ ] List core features
- [ ] Specify tech stack
- [ ] Add design guidelines

**Example Content:**
```
# Sneakylink SAAS Application

Build a modern SAAS application with:
- User authentication (Clerk)
- Dashboard with metrics
- Subscription management
- Admin panel
- API integrations
```

#### 3.3.2 initializer_prompt.md
- [ ] Write session 1 instructions
- [ ] Add feature list generation
- [ ] Include project setup steps
- [ ] Define git initialization

**Key Sections:**
- Read app_spec.txt
- Generate feature_list.json (50 features for testing)
- Set up folder structure
- Initialize git
- Create init.sh

#### 3.3.3 coding_prompt.md
- [ ] Write continuation instructions
- [ ] Add progress file reading
- [ ] Include feature implementation guide
- [ ] Define testing requirements

**Key Sections:**
- Read claude-progress.txt
- Check feature_list.json
- Implement next feature
- Run tests
- Commit work
- Update progress

### 3.4 Create Scripts

#### 3.4.1 run-autonomous.sh
- [ ] Create bash wrapper
- [ ] Add environment check
- [ ] Validate API key
- [ ] Run Python script

**Script:**
```bash
#!/bin/bash
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "Error: ANTHROPIC_API_KEY not set"
  exit 1
fi
python3 autonomous_agent_demo.py "$@"
```

### 3.5 Testing
- [ ] Test initializer agent (session 1)
- [ ] Verify feature_list.json generation
- [ ] Test coding agent (session 2)
- [ ] Verify progress tracking
- [ ] Test auto-resume
- [ ] Test Ctrl+C pause/resume

---

## 🔐 Phase 4: Clerk Authentication (30 min)

### 4.1 Clerk Account Setup
- [ ] Sign up at https://clerk.com
- [ ] Create new application "Sneakylink"
- [ ] Select authentication methods (email, Google, GitHub)
- [ ] Get publishable key
- [ ] Get secret key

### 4.2 Environment Configuration
- [ ] Add keys to `.env.local`
- [ ] Update `.env.template` with placeholders
- [ ] Document in README

**`.env.local`:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 4.3 Next.js Integration
- [ ] Wrap app in `<ClerkProvider>` (`app/layout.tsx`)
- [ ] Create middleware for route protection
- [ ] Add sign-in page
- [ ] Add sign-up page
- [ ] Create user button component

**Files to Modify:**
- `app/layout.tsx` - Add ClerkProvider
- `middleware.ts` - Protect routes
- `app/sign-in/[[...sign-in]]/page.tsx` - Sign in page
- `app/sign-up/[[...sign-up]]/page.tsx` - Sign up page

### 4.4 UI Components
- [ ] Create `<UserButton />` component
- [ ] Add to header/navigation
- [ ] Create protected dashboard layout
- [ ] Add user profile page

**Files to Create:**
- `frontend/components/auth/UserButton.tsx`
- `frontend/components/auth/ProtectedLayout.tsx`
- `app/(protected)/dashboard/page.tsx`

### 4.5 Testing
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Test protected routes
- [ ] Test sign-out
- [ ] Verify session persistence

---

## 🎨 Phase 5: Web Generating Skill (60 min)

### 5.1 Create Template Library Structure
- [ ] Create `frontend/templates/` folder
- [ ] Add `landing/` subfolder
- [ ] Add `dashboard/` subfolder
- [ ] Add `forms/` subfolder
- [ ] Add `auth/` subfolder

### 5.2 Landing Page Templates
- [ ] Create `hero-with-cta.tsx`
- [ ] Create `features-grid.tsx`
- [ ] Create `pricing-table.tsx`
- [ ] Create `testimonials.tsx`
- [ ] Create `faq-section.tsx`
- [ ] Create `footer.tsx`

### 5.3 Dashboard Templates
- [ ] Create `sidebar-layout.tsx`
- [ ] Create `metrics-cards.tsx`
- [ ] Create `data-table.tsx`
- [ ] Create `chart-card.tsx`
- [ ] Create `stats-overview.tsx`

### 5.4 Form Templates
- [ ] Create `contact-form.tsx`
- [ ] Create `multi-step-wizard.tsx`
- [ ] Create `settings-panel.tsx`
- [ ] Create `profile-form.tsx`

### 5.5 CLI Generator Script
- [ ] Create `scripts/generate-design.ts`
- [ ] Add template selection logic
- [ ] Implement file copying
- [ ] Add variable replacement
- [ ] Create npm script

**`package.json` script:**
```json
{
  "scripts": {
    "generate-design": "tsx scripts/generate-design.ts"
  }
}
```

### 5.6 Documentation
- [ ] Create `WEB_GENERATION.md`
- [ ] Document all templates
- [ ] Add usage examples
- [ ] Include customization guide

---

## 📚 Phase 6: Documentation (45 min)

### 6.1 ARCHITECTURE.md
- [ ] Explain clean architecture
- [ ] Document folder structure
- [ ] Describe TypeScript aliases
- [ ] Add best practices
- [ ] Include diagrams

### 6.2 AUTONOMOUS_CODING.md
- [ ] Installation guide
- [ ] Running first session
- [ ] Customizing prompts
- [ ] Security configuration
- [ ] Troubleshooting

### 6.3 CLERK_SETUP.md
- [ ] Account creation
- [ ] Getting API keys
- [ ] Environment setup
- [ ] UI integration
- [ ] Middleware configuration

### 6.4 WEB_GENERATION.md
- [ ] Template catalog
- [ ] CLI usage
- [ ] Customization guide
- [ ] Examples

### 6.5 DEPLOYMENT.md
- [ ] Vercel setup
- [ ] Environment variables
- [ ] Domain configuration
- [ ] Database setup
- [ ] Monitoring

### 6.6 Update README.md
- [ ] Project overview
- [ ] Quick start (5 min setup)
- [ ] Features list
- [ ] Tech stack
- [ ] Links to other docs
- [ ] Contributing guide
- [ ] License

---

## ✅ Final Checklist

### Build & Testing
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] All tests pass
- [ ] ESLint clean
- [ ] No console errors

### Documentation
- [ ] All docs complete
- [ ] Links verified
- [ ] Examples tested
- [ ] Typos fixed

### Repository
- [ ] GitHub synced
- [ ] Branches clean
- [ ] Tags created
- [ ] README badge

### Deployment
- [ ] Vercel connected
- [ ] Env vars set
- [ ] Domain configured
- [ ] SSL verified

---

**Total Estimated Time:** 4-5 hours
**Priority:** Phase 1 → Phase 2 → Phase 3 (Core functionality)

---

## 📋 Progress Tracking

Update this section as you complete tasks:

**Phase 1:** ⏸️ Not Started
**Phase 2:** ⏸️ Not Started
**Phase 3:** ⏸️ Not Started
**Phase 4:** ⏸️ Not Started
**Phase 5:** ⏸️ Not Started
**Phase 6:** ⏸️ Not Started

**Last Updated:** December 8, 2025
