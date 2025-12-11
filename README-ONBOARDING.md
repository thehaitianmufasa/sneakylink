# 🚀 NEVERMISSLEAD CLIENT ONBOARDING - QUICK START
**Get a new client's site live in <30 minutes**

---

## 🎯 GOAL

Clone repo → Update config → Deploy → **Client site live in <30 minutes**

---

## 📋 WHAT YOU NEED UPFRONT

Before starting onboarding, collect from client via [Google Form](docs/CLIENT_INTAKE_FORM.md):

- [ ] Business name, phone, email, address
- [ ] 8 service descriptions
- [ ] 5-10 FAQ questions/answers
- [ ] Service areas (cities/counties)
- [ ] Business hours
- [ ] Logo file (PNG)
- [ ] SMS auto-response message
- [ ] Preferred area code for tracking number

**Time**: Client completes form in 15-20 minutes

---

## ⚡ QUICK START (30-Minute Workflow)

### **1. Setup Database** (3 min)
```bash
# Add client to Supabase
# Option A: Via dashboard (docs/SUPABASE_CLIENT_SETUP.md)
# Option B: Via script
node scripts/setup-supabase-client.js \
  --slug=client-slug \
  --business="Business Name" \
  --phone="(xxx) xxx-xxxx" \
  --email="info@business.com"

# Save the generated UUID
```

### **2. Generate Config** (8 min)
```bash
# Copy template
cp config/config.template.json config/clients/client-slug.json

# Fill in all fields using Google Form responses
# See: config.template.json for inline documentation

# OR use automation (if available)
node scripts/generate-config.js \
  --form-response=responses.csv \
  --output=config/clients/client-slug.json
```

### **3. Purchase Twilio Number** (3 min)
```bash
# Via Twilio Console: docs/TWILIO_SETUP_GUIDE.md
# OR via script
node scripts/provision-twilio-number.js \
  --areaCode=404 \
  --buy

# Save number to database and .env
```

### **4. Deploy to Vercel** (5 min)
```bash
# Commit changes
git add config/clients/client-slug.json
git commit -m "Add client: Business Name"
git push origin main

# Deploy (via dashboard or CLI)
vercel --name client-slug

# Add environment variables (see: .env.template)
# CRITICAL: CLIENT_SLUG=client-slug must match config filename
```

### **5. Configure DNS** (2 min setup + 5-30 min propagation)
```bash
# Send DNS instructions to client
# See: docs/DOMAIN_SETUP_GUIDE.md

# Client adds:
# - A record: @ → 76.76.19.19
# - CNAME: www → cname.vercel-dns.com
```

### **6. Configure Twilio Webhooks** (2 min)
**After deployment is live:**
```bash
# Via Twilio Console or script
node scripts/provision-twilio-number.js \
  --number=+1xxxxxxxxxx \
  --webhookUrl=https://clientdomain.com \
  --configure

# Webhooks:
# - Voice: /api/twilio/voice
# - SMS: /api/twilio/sms
# - Status: /api/twilio/status
```

### **7. Test Everything** (5 min)
```bash
# Test form submission
curl -X POST https://clientdomain.com/api/leads \
  -d "full_name=Test User" \
  -d "phone=5551234567" \
  -d "message=Test"

# Test call tracking (call Twilio number, leave voicemail)
# Test SMS (text Twilio number, check auto-response)
# Verify all data in Supabase database
```

### **8. Deliver to Client** (2 min)
```bash
# Send welcome email with:
# - Website URL
# - Tracking phone number
# - Login credentials (if applicable)
# - Invoice for setup fee + first month
```

**✅ TOTAL TIME: ~30 minutes** (excluding DNS propagation)

---

## 📚 COMPLETE DOCUMENTATION

### **Essential Guides**
- **[ONBOARDING_CHECKLIST.md](docs/ONBOARDING_CHECKLIST.md)** - Detailed step-by-step workflow with time estimates
- **[CLIENT_INTAKE_FORM.md](docs/CLIENT_INTAKE_FORM.md)** - Google Form questions template
- **[config.template.json](config/config.template.json)** - Fully documented config template
- **[.env.template](.env.template)** - Environment variables reference

### **Setup Guides**
- **[SUPABASE_CLIENT_SETUP.md](docs/SUPABASE_CLIENT_SETUP.md)** - Database client creation
- **[TWILIO_SETUP_GUIDE.md](docs/TWILIO_SETUP_GUIDE.md)** - Phone number provisioning & webhooks
- **[DOMAIN_SETUP_GUIDE.md](docs/DOMAIN_SETUP_GUIDE.md)** - Custom domain configuration

### **Automation Scripts**
- **[setup-supabase-client.js](scripts/setup-supabase-client.js)** - Auto-create database record
- **[provision-twilio-number.js](scripts/provision-twilio-number.js)** - Auto-buy number & configure webhooks
- **[generate-config.js](scripts/generate-config.js)** - Convert Google Form to config.json
- **[onboard-client.sh](scripts/onboard-client.sh)** - Main orchestrator (runs all steps)

---

## 🛠️ AUTOMATION SETUP

### Install Dependencies
```bash
cd scripts
npm install
```

### Set Environment Variables
```bash
# Copy template
cp ../.env.template ../.env.local

# Fill in credentials:
# - Supabase URL + Keys
# - Twilio Account SID + Auth Token
# - Vercel Token (optional for automated deployment)
# - SMTP credentials
```

### Run Full Automated Onboarding
```bash
# Interactive prompts guide you through entire process
bash scripts/onboard-client.sh

# OR specify all parameters
bash scripts/onboard-client.sh \
  --slug=client-slug \
  --business="Business Name" \
  --form-response=responses.csv \
  --areaCode=404 \
  --deploy
```

**Time with automation**: 10-15 minutes (vs 30 minutes manual)

---

## 💰 COST BREAKDOWN

### Per Client Monthly
- **Twilio Phone Number**: $2.75/month
- **Twilio Usage** (avg): ~$7/month (calls + SMS)
- **Supabase**: $0/month (shared $25 total)
- **Vercel**: $0/month (free tier)
- **Email**: $0/month (shared Proton account)
- **Total Cost**: ~$10/month per client

### Revenue Per Client
- **Setup Fee**: $497 (or $0 with 6-month commitment)
- **Monthly Subscription**: $297/month
- **Profit**: $287/month per client
- **Annual Profit**: $3,444/year per client

---

## ✅ PRE-FLIGHT CHECKLIST

Before onboarding first client, verify:

- [ ] Supabase project created & schema migrated
- [ ] Twilio account upgraded to paid
- [ ] Vercel account connected to GitHub
- [ ] Proton Mail SMTP configured
- [ ] Google Form created & tested
- [ ] All credentials saved to PROJECT_SECRETS_REFERENCE.txt
- [ ] Automation scripts dependencies installed

---

## 🎓 TRAINING RESOURCES

### For New Team Members
1. Read: [ONBOARDING_CHECKLIST.md](docs/ONBOARDING_CHECKLIST.md)
2. Watch: [Demo video] (if available)
3. Practice: Onboard test client using checklist
4. Review: [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### First Onboarding
- **Time**: Expect 45-60 minutes (first time)
- **Goal**: <30 minutes by 3rd client
- **Tip**: Use manual workflow first, then switch to automation

---

## 🚨 COMMON ISSUES

### "CLIENT_SLUG not matching config file"
→ Check Vercel env vars: `CLIENT_SLUG=client-slug` must match filename

### "DNS not propagating"
→ Wait 5-30 minutes, use https://dnschecker.org to verify

### "Form submission returns 500 error"
→ Check Vercel logs, verify Supabase credentials in env vars

### "Twilio webhooks not triggering"
→ Ensure webhooks configured AFTER deployment (not before)

### "Email notifications not sending"
→ Check SMTP credentials, verify `ENABLE_EMAIL_NOTIFICATIONS=true`

---

## 📞 SUPPORT

### Internal Documentation
- All guides in `/docs` folder
- Scripts in `/scripts` folder
- Example configs in `/config/clients`

### External Resources
- **Supabase Docs**: https://supabase.com/docs
- **Twilio Docs**: https://www.twilio.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

## 🎯 SUCCESS METRICS

### Onboarding Goals
- [ ] <30 minutes from form submission to deployed site
- [ ] 95%+ first-time deployment success rate
- [ ] Zero manual errors (via automation)
- [ ] Client satisfaction: 5/5 stars

### Scale Targets
- **Week 1**: 1 client (learning)
- **Week 2**: 3 clients
- **Week 3**: 5 clients
- **Month 2**: 10+ clients/week

---

## 📝 CHANGELOG

### v1.0.0 (November 22, 2025)
- ✅ Complete onboarding system documented
- ✅ Google Form template created
- ✅ Automation scripts scaffolded
- ✅ 7 comprehensive guides written
- ✅ Config template with 570+ documented fields

---

**Ready to onboard your first client?**
→ Start with: **[docs/ONBOARDING_CHECKLIST.md](docs/ONBOARDING_CHECKLIST.md)**

---

**Questions?** Check **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** or contact team lead.
