# Sneakylink

**Autonomous SAAS Template Platform with AI-Powered Code Generation**

Build production-ready SAAS applications in hours, not weeks, using autonomous AI agents and clean architecture patterns.

---

## 🚀 Overview

Sneakylink is a Next.js template that combines:
- **Autonomous Coding Agents** - AI-powered development with Claude
- **Clean Architecture** - Frontend/Backend/Shared separation
- **Web Generation Templates** - Pre-built UI scaffolding
- **Modern Stack** - Next.js 15, React 19, TypeScript
- **Authentication** - Clerk integration
- **Database** - Supabase PostgreSQL
- **Rapid Prototyping** - Build SAAS apps 10x faster

---

## ✨ Features

### 🤖 Autonomous Coding System
- **Two-Agent Pattern** - Initializer + Coding agents
- **Session Management** - Persistent progress across runs
- **Security Sandbox** - Bash command allowlist
- **Git Integration** - Automatic commits and tracking
- **Progress Tracking** - Feature lists and completion status

### 🏗️ Clean Architecture
- **Frontend** - React components, hooks, utilities
- **Backend** - API routes, database, integrations
- **Shared** - Types, schemas, configurations
- **TypeScript Aliases** - `@frontend/*`, `@backend/*`, `@shared/*`

### 🎨 Web Generation Templates
- **Landing Pages** - Hero, features, pricing, testimonials
- **Dashboards** - Metrics, tables, charts, layouts
- **Forms** - Contact, wizards, settings, profiles
- **Authentication** - Sign in/up, password reset, OAuth

### 🔐 Built-In Integrations
- **Clerk** - User authentication and management
- **Supabase** - PostgreSQL database and real-time
- **Twilio** - Phone/SMS capabilities (optional)
- **Vercel** - Zero-config deployment

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/thehaitianmufasa/sneakylink.git
cd sneakylink

# Install dependencies
npm install

# Set up Python environment for autonomous coding
cd autonomous-coding
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🤖 Using Autonomous Coding

### Basic Usage

```bash
# Set your API key
export ANTHROPIC_API_KEY='your-api-key'

# Run autonomous agent
npm run agent:run -- --project-dir ./my-saas-app

# Or use Python directly
cd autonomous-coding
python3 autonomous_agent_demo.py --project-dir ../my-saas-app
```

### Customizing Your App

1. Edit `autonomous-coding/prompts/app_spec.txt` with your requirements
2. Run the initializer agent (Session 1)
3. Agent generates feature list and project structure
4. Coding agent implements features iteratively
5. Press Ctrl+C to pause, resume with same command

**See [AUTONOMOUS_CODING.md](./docs/AUTONOMOUS_CODING.md) for detailed guide**

---

## 🎨 Web Generation

Generate UI components instantly:

```bash
# Generate landing page
npm run generate-design -- --template=landing-hero --output=app/page.tsx

# Generate dashboard
npm run generate-design -- --template=dashboard-layout --output=app/dashboard/page.tsx

# List all templates
npm run generate-design -- --list
```

**Available Templates:**
- Landing pages (hero, features, pricing, testimonials)
- Dashboard layouts (sidebar, metrics, tables)
- Forms (contact, multi-step, settings)
- Auth pages (sign in/up, password reset)

**See [WEB_GENERATION.md](./docs/WEB_GENERATION.md) for full catalog**

---

## 📁 Project Structure

```
sneakylink/
├── frontend/              # React UI layer
│   ├── components/        # UI components
│   │   ├── sections/      # Page sections
│   │   ├── forms/         # Form components
│   │   ├── ui/            # Reusable primitives
│   │   └── admin/         # Admin components
│   ├── lib/               # Frontend utilities
│   └── templates/         # Web generation templates
│
├── backend/               # Server-side logic
│   ├── lib/               # Backend utilities
│   │   ├── admin/         # Admin auth
│   │   ├── email/         # SMTP client
│   │   ├── supabase/      # Database
│   │   ├── twilio/        # Phone/SMS
│   │   └── utils/         # Helpers
│   └── middleware/        # API middleware
│
├── shared/                # Shared resources
│   ├── config/            # Configurations
│   ├── schemas/           # Zod validation
│   ├── types/             # TypeScript types
│   └── constants/         # App constants
│
├── autonomous-coding/     # AI agent harness
│   ├── agents/            # Agent implementations
│   ├── prompts/           # Prompt templates
│   ├── scripts/           # Utility scripts
│   └── utils/             # Helper functions
│
├── app/                   # Next.js App Router
│   ├── api/               # API routes
│   └── (routes)/          # App pages
│
├── docs/                  # Documentation
└── scripts/               # Build/dev scripts
```

**See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed explanation**

---

## 🔧 Configuration

### Environment Variables

Required variables in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-publishable-key
CLERK_SECRET_KEY=your-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
CLIENT_SLUG=sneakylink

# Anthropic API (for autonomous coding)
ANTHROPIC_API_KEY=your-api-key
```

**See [.env.template](./.env.template) for complete list**

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

**Vercel auto-deploys on every push to main**

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

**See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed guide**

---

## 📚 Documentation

- **[PLAN.md](./PLAN.md)** - Project roadmap and implementation plan
- **[TASKS.md](./TASKS.md)** - Detailed task checklist
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Clean architecture guide
- **[AUTONOMOUS_CODING.md](./docs/AUTONOMOUS_CODING.md)** - AI agent setup
- **[CLERK_SETUP.md](./docs/CLERK_SETUP.md)** - Authentication configuration
- **[WEB_GENERATION.md](./docs/WEB_GENERATION.md)** - Template catalog
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment

---

## 🛠️ Tech Stack

### Core
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **Supabase** - PostgreSQL database
- **Clerk** - Authentication
- **Twilio** - Phone/SMS (optional)
- **Nodemailer** - Email (optional)

### AI & Automation
- **Claude Agent SDK** - Autonomous coding
- **Anthropic API** - Claude Sonnet 4.5

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

---

## 🎯 Use Cases

Perfect for building:
- **SAAS Applications** - Subscription-based software
- **Internal Tools** - Admin dashboards
- **Client Portals** - Custom interfaces
- **API Platforms** - Backend services
- **Landing Pages** - Marketing sites
- **MVP Prototypes** - Rapid validation

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Private - All Rights Reserved

---

## 🙏 Acknowledgments

- **Anthropic** - Claude AI and Agent SDK
- **Vercel** - Next.js framework and deployment
- **Clerk** - Authentication platform
- **Supabase** - Database and backend

---

## 📞 Support

- **Documentation**: [./docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/thehaitianmufasa/sneakylink/issues)
- **Discussions**: [GitHub Discussions](https://github.com/thehaitianmufasa/sneakylink/discussions)

---

**Built with ❤️ using autonomous AI agents and clean architecture**
