# 🚀 Phase 17 - Plumbing Demo Mock Alignment - Quick Start Guide

**Status:** Ready to implement
**Created:** November 5, 2025
**Reference SOP:** `/docs/DEMO-UPDATE-SOP.md`

---

## 📋 Overview

Align Plumbing demo with AQUAPRO SOLUTIONS mock design following the same process used for successful Electrical demo (Phase 16).

---

## 📁 Key Files

### Mock Design
- **Mock HTML:** `/Users/mufasa/Desktop/Nevermisslead-project/mock-design/plumbing-mock.html`
- **PRP Doc:** `/Users/mufasa/desktop/Nevermisslead-project/nevermisslead-ui-redesign/PLUMBING-PRP.md`
- **Quick Ref:** `/Users/mufasa/desktop/Nevermisslead-project/nevermisslead-ui-redesign/PLUMBING-QUICK-REFERENCE.md`

### Config File to Update
- **Location:** `/config/clients/plumbing.json`
- **Current:** NeverMissLead Plumbing branding
- **Target:** AQUAPRO SOLUTIONS branding

---

## 🎨 AQUAPRO SOLUTIONS Brand Identity

### Business Details
```json
{
  "businessName": "AQUAPRO SOLUTIONS",
  "tagline": "YOUR WATER, OUR PRIORITY",
  "industry": "Residential & Commercial Plumbing"
}
```

### Color Scheme
```json
{
  "primary": "#0066CC",    // Deep Blue (water/trust)
  "secondary": "#003D7A",  // Navy Blue (professional)
  "accent": "#00A8E8"      // Bright Blue (modern/clean)
}
```

### Logo Style
- Blue square background (#0066CC)
- White pipe/water droplet icon
- Text: "AQUAPRO SOLUTIONS" (bold, navy)
- Tagline: "YOUR WATER, OUR PRIORITY" (small, blue)

---

## ✅ Required Config Updates

### 1. Add Social Media Section
```json
"socialMedia": {
  "heading": "See Real Work, Real Results",
  "subheading": "Before/after projects, plumbing tips, and happy customers. Join 5,000+ followers!",
  "links": [
    {
      "platform": "facebook",
      "url": "https://facebook.com/aquaprosolutions",
      "label": "Facebook"
    },
    {
      "platform": "instagram",
      "url": "https://instagram.com/aquaprosolutions",
      "label": "Instagram"
    }
  ],
  "images": [
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80",
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80"
  ]
}
```

**Note:** Plumbing uses 3-column Instagram-style grid (different from Electrical's 2-column)

### 2. Add CTA Banner Section
```json
"ctaBanner": {
  "heading": "Plumbing Emergency?",
  "subheading": "We respond in 60 minutes. Call now for immediate help.",
  "primaryCTA": {
    "text": "CALL (678) 788-7281"
  },
  "secondaryCTA": {
    "text": "GET FREE QUOTE"
  }
}
```

### 3. Update Logo Configuration
```json
"logo": {
  "text": "AQUAPRO SOLUTIONS",
  "tagline": "YOUR WATER, OUR PRIORITY",
  "image": {
    "src": "/assets/plumbing/aquapro-logo.png",
    "alt": "AquaPro Solutions logo",
    "priority": true
  }
}
```

### 4. Update Branding Colors
```json
"branding": {
  "colors": {
    "primary": "#0066CC",
    "secondary": "#003D7A",
    "accent": "#00A8E8",
    "neutral": {
      "dark": "#2C3E50",
      "light": "#F8F9FA",
      "white": "#FFFFFF"
    }
  }
}
```

### 5. Update Business Info
- Change all instances of "NeverMissLead Plumbing" → "AquaPro Solutions"
- Update taglines, descriptions, testimonials
- Ensure phone number stays (678) 788-7281

---

## 🎯 Implementation Checklist

Follow SOP at `/docs/DEMO-UPDATE-SOP.md`:

### Step 1: Config Updates
- [ ] Update `businessInfo` section
- [ ] Add `socialMedia` section
- [ ] Add `ctaBanner` section
- [ ] Update `logo` configuration
- [ ] Update `branding.colors`
- [ ] Update `about` section
- [ ] Update `services` (keep plumbing-specific)
- [ ] Update `footer` info

### Step 2: Logo Assets
Choose one approach:
- **Option A:** Create custom SVG component (like Electrical)
  - File: `/components/ui/aquapro-logo-icon.tsx`
  - Update: `/components/ui/logo.tsx` with conditional rendering
- **Option B:** Use PNG image
  - File: `/public/assets/plumbing/aquapro-logo.png`

### Step 3: Component Updates
- [ ] Update `PageContent.tsx` - Remove footer conditionally for plumbing
- [ ] Verify social media section renders with 3-column grid
- [ ] Verify CTA banner displays correctly

### Step 4: Testing
- [ ] Header "Get Free Quote" → Opens modal ✅
- [ ] Hero primary CTA → Opens modal ✅
- [ ] About "Get Free Quote" → Opens modal ✅
- [ ] CTA Banner "GET FREE QUOTE" → Opens modal ✅
- [ ] All phone links work ✅
- [ ] "← View All Demos" link works ✅

### Step 5: Build & Deploy
- [ ] Run `npm run build` locally
- [ ] Fix any TypeScript/ESLint errors
- [ ] Update CLAUDE.md with Phase 17 completion
- [ ] Commit with proper message format
- [ ] Push to GitHub
- [ ] Verify Vercel deployment succeeds

---

## 🚨 Common Pitfalls (from Phase 16)

### Build Errors to Watch For:
1. **Unescaped quotes** - Use `&ldquo;` and `&rdquo;`
2. **Missing button variants** - Already fixed in Phase 16
3. **Missing social platforms** - LinkedIn already added in Phase 16
4. **Modal event listener** - Already fixed in PageWrapper

### Best Practices:
- Test build locally BEFORE pushing
- Commit frequently with small changes
- Use SOP troubleshooting section if errors occur
- Clear Next.js cache if logo doesn't update: `rm -rf .next/cache`

---

## 📝 Git Commit Message Template

```
feat: Align Plumbing demo with AquaPro Solutions mock

- Updated business name to AQUAPRO SOLUTIONS
- Added social media section with 3-column Instagram grid
- Added CTA banner with plumbing emergency messaging
- Updated logo configuration to match mock
- Updated brand colors to blue water theme (#0066CC, #003D7A, #00A8E8)
- Removed footer (matches mock design)
- Added "Powered by Chery Solutions" credit
- All form CTAs tested and verified working

Component Changes:
- UPDATED: config/clients/plumbing.json - Complete rebrand
- UPDATED/NEW: Logo component/asset for AquaPro Solutions
- UPDATED: PageContent.tsx - Conditional footer for plumbing

Refs: Phase 17 - Plumbing Mock Alignment

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🎓 References

- **Phase 16 Example:** Electrical demo (see CLAUDE.md)
- **SOP:** `/docs/DEMO-UPDATE-SOP.md`
- **Config Schema:** `/lib/schemas/client-config.schema.ts`
- **Type Definitions:** `/lib/types/client-config.ts`

---

**Next Steps:**
1. Start fresh Claude Code session
2. Open this quickstart guide
3. Follow the checklist step-by-step
4. Reference SOP for detailed instructions

**Estimated Time:** 30-45 minutes (following established pattern from Phase 16)

---

*This guide was created to streamline Phase 17 implementation based on lessons learned from Phase 16.*
