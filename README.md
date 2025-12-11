# Sneakylink - Vendor Compliance Prep SaaS

**Prep once. Export to any customer. Save 60+ days of vendor compliance paperwork.**

Sneakylink helps vendors (contractors, service providers) complete their compliance profile once, then instantly export professional PDFs for any customer request.

---

## 🚀 Overview

### The Problem
Vendors waste **60+ days per year** filling out repetitive vendor compliance questionnaires for every customer. Same questions, different forms, endless paperwork.

### The Solution
- ✅ **30-min first-time setup** - Complete your compliance profile once
- ✅ **2-min exports** - Generate professional PDFs for any customer
- ✅ **Unlimited customers** - Reuse your profile forever
- ✅ **Compliance tracking** - Monitor your score and improve over time

---

## ✨ Features

### 🎯 Core Functionality
- **Smart Onboarding** - 2-page wizard collects company info
- **Compliance Questionnaire** - 40+ questions across 8 categories
- **Work-Type Specific** - Conditional questions for electrical, heights, LOTO, equipment
- **Document Upload** - Store insurance certs, policies, training records
- **Compliance Scoring** - Real-time score calculation with section breakdown
- **Customer Management** - Track who you've sent profiles to
- **PDF Export** - Professional, branded compliance profiles
- **Export History** - See when and what you sent to each customer

### 🎨 Design System: Compliance Clarity Theme

Our professional B2B theme builds trust and clarity:

#### Colors
- **Trust Blue** (`#2563eb`) - Primary actions, builds confidence
- **Success Green** (`#10b981`) - Completion indicators, positive signals
- **Warning Amber** (`#f59e0b`) - Action needed, attention required
- **Neutral Slate** (`#475569`) - Body text, professional tone
- **Light Background** (`#f8fafc`) - Clean, spacious feel
- **Danger Red** (`#ef4444`) - Critical items, errors

#### Typography
- **Headers**: Inter Bold - Clear hierarchy
- **Body**: Inter Regular - Readable, professional
- **Monospace**: JetBrains Mono - Code, technical data

#### Usage Examples

```tsx
// Primary Button
<button className="bg-trust-blue hover:bg-trust-blue/90 text-white px-6 py-3 rounded-lg">
  Export PDF
</button>

// Progress Bar
<div className="h-2 bg-light-bg rounded-full">
  <div className="h-full bg-success-green rounded-full" style={{width: '75%'}} />
</div>

// Status Badges
<span className="text-success-green">✓ Complete</span>
<span className="text-warning-amber">⚠ Action Needed</span>
<span className="text-danger-red">✗ Missing</span>

// Section Card
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <h3 className="text-lg font-bold text-neutral-slate">Core Safety</h3>
  <div className="text-3xl font-bold text-success-green">90/100</div>
</div>
```

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Clerk account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/thehaitianmufasa/sneakylink.git
cd sneakylink

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials (see below)

# Run development server
./init.sh
# Or: npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local` with:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your keys:**
- Clerk: [https://dashboard.clerk.com](https://dashboard.clerk.com)
- Supabase: [https://app.supabase.com](https://app.supabase.com)

### Database Setup

1. Create a new Supabase project for Sneakylink
2. Run the migration:
   ```bash
   npx supabase db push
   ```
3. Create storage buckets in Supabase UI:
   - `sneaky-documents` (private)
   - `sneaky-exports` (private)

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Auth**: Clerk
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **PDF**: Puppeteer
- **Deploy**: Vercel

### Project Structure

```
sneakylink/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── onboarding/        # 2-page onboarding wizard
│   ├── questionnaire/     # Compliance questionnaire
│   ├── dashboard/         # Vendor dashboard
│   └── api/               # API routes
│
├── frontend/              # UI Components
│   ├── components/        # Reusable components
│   └── lib/               # Frontend utilities
│
├── backend/               # Server Logic
│   ├── lib/               # Backend utilities
│   └── middleware/        # API middleware
│
├── shared/                # Shared Resources
│   ├── config/            # Configurations
│   ├── schemas/           # Zod validation
│   └── types/             # TypeScript types
│
├── supabase/
│   └── migrations/        # Database migrations
│
├── feature_list.json      # 200+ feature checklist
├── claude-progress.txt    # Build progress log
└── init.sh                # Dev server startup
```

### Database Schema

All tables use `sneaky_` prefix to avoid conflicts:

- `sneaky_vendors` - Vendor company profiles
- `sneaky_questionnaire_responses` - Compliance answers
- `sneaky_documents` - Uploaded files (PDFs, certs)
- `sneaky_customers` - Customer companies
- `sneaky_exports` - PDF export history

**Row Level Security (RLS)** enforces multi-tenant isolation.

---

## 🚀 Development Workflow

### For Coding Agents

1. **Start session**: Run `./init.sh`
2. **Check progress**: Read `claude-progress.txt`
3. **Find next feature**: Check `feature_list.json` for `passes: false`
4. **Implement**: Work on ONE feature at a time
5. **Test**: Verify at http://localhost:3000
6. **Mark complete**: Set `passes: true` in feature_list.json
7. **Commit**: `git add . && git commit -m "feat: description"`
8. **Log progress**: Update `claude-progress.txt`
9. **Repeat**

### For Human Developers

```bash
# Start dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

---

## 📊 Feature Roadmap

**200 features across 8 phases:**

1. **Onboarding** (15 features) - 2-page wizard, auto-save, validation
2. **Questionnaire** (54 features) - 8 sections, conditional questions, file uploads
3. **Dashboard** (12 features) - Score display, customer management
4. **PDF Export** (13 features) - Puppeteer generation, storage, history
5. **Authentication** (5 features) - Clerk integration, protected routes
6. **Polish** (40+ features) - Mobile responsive, accessibility, performance
7. **Testing** (15 features) - Unit, integration, end-to-end
8. **Deployment** (10+ features) - Vercel, monitoring, analytics

See `feature_list.json` for complete checklist.

---

## 🎯 Key User Flows

### Vendor Onboarding
1. Sign up with Clerk
2. Page 1: Company name, employee count, work types
3. Page 2: Address, contact info
4. Auto-saves every 5 seconds
5. Redirects to questionnaire

### Compliance Questionnaire
1. Navigate sections: Core Safety, Insurance, Metrics, etc.
2. Work-type specific sections appear conditionally
3. Upload documents (insurance certs, policies)
4. Auto-save on every answer
5. Progress indicator shows % complete
6. Redirects to dashboard when done

### PDF Export
1. Add customer company
2. Click "Export PDF"
3. Puppeteer generates professional PDF
4. PDF saved to Supabase Storage
5. Export history tracked
6. Re-export with updated data anytime

---

## 🔐 Security

- **Row Level Security** - Supabase RLS policies isolate vendor data
- **Input Validation** - Zod schemas on all forms
- **File Upload** - Type and size restrictions (PDFs only, max 10MB)
- **Authentication** - Clerk handles auth securely
- **HTTPS** - All production traffic encrypted

---

## 📈 Performance

- **Lighthouse Score**: Target >90
- **Code Splitting**: Per-route chunks
- **Image Optimization**: Next.js Image component
- **Database Indexes**: On all foreign keys and search fields
- **Caching**: API responses cached (5min TTL)

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# End-to-end tests (Playwright)
npm run test:e2e
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to `main`

### Manual Deploy

```bash
npm run build
npm start
```

---

## 📝 Documentation

- **INITIALIZER_AGENT_PROMPT.md** - First-time setup guide
- **CODING_AGENT_PROMPT.md** - Coding agent instructions
- **MASTER_SOP_SNEAKYLINK.md** - Complete operations manual
- **feature_list.json** - 200+ feature checklist
- **claude-progress.txt** - Build progress log

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Follow the coding agent workflow
4. Commit changes: `git commit -m "feat: add feature"`
5. Push to branch: `git push origin feature/my-feature`
6. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file

---

## 🔗 Links

- **GitHub**: [github.com/thehaitianmufasa/sneakylink](https://github.com/thehaitianmufasa/sneakylink)
- **Live Demo**: Coming soon
- **Documentation**: See `/docs` folder
- **Support**: Create an issue on GitHub

---

## 💡 Built With

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [Supabase](https://supabase.com/) - Database & storage
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Puppeteer](https://pptr.dev/) - PDF generation
- [Vercel](https://vercel.com/) - Deployment

---

**Sneakylink** - Prep once. Export to any customer. 🚀

*Save 60+ days per year on vendor compliance paperwork.*
