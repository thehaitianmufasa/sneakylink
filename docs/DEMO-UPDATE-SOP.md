# 📋 Demo Update SOP - Aligning Demos with Mock Designs

**Standard Operating Procedure for updating NeverMissLead demo pages to match mock designs**

Last Updated: November 4, 2025
Version: 1.0
Based on: Electrical Demo Mock Alignment (Phase 16)

---

## 🎯 Overview

This SOP documents the process of aligning a demo page (Plumbing, HVAC, Electrical, etc.) with a mock HTML design. Follow these steps systematically to ensure consistency across all demos.

---

## 📦 Prerequisites

Before starting, ensure you have:
- ✅ Mock HTML file (`/mock-design/[demo-name]-mock.html`)
- ✅ Assets (logos, images) in `/public/assets/[demo-name]/`
- ✅ Config file at `/config/clients/[demo-name].json`
- ✅ Access to the codebase and dev server running

---

## 🔧 Step-by-Step Process

### Step 1: Analyze the Mock Design

1. Open the mock HTML file in a browser
2. Take screenshots of:
   - Header logo and layout
   - All major sections
   - Footer (if present)
   - CTA banners
   - Social media sections
3. Document differences from current implementation
4. Note any unique components or layouts

**Example checklist:**
```markdown
- [ ] Logo style (icon + text vs image-only)
- [ ] Social media section present?
- [ ] Footer present or removed?
- [ ] CTA banner placement and style
- [ ] Service areas layout
```

---

### Step 2: Update the Config File

Location: `/config/clients/[demo-name].json`

#### 2.1 Add Social Media Section

If the mock includes social media:

```json
"socialMedia": {
  "heading": "Follow Our Work on Social Media",
  "subheading": "See real projects, helpful tips, and satisfied customers. Join our growing community!",
  "links": [
    {
      "platform": "facebook",
      "url": "https://facebook.com/[business-handle]",
      "label": "Facebook"
    },
    {
      "platform": "instagram",
      "url": "https://instagram.com/[business-handle]",
      "label": "Instagram"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com/[business-handle]",
      "label": "Twitter"
    }
  ],
  "images": [
    "https://images.unsplash.com/photo-[id1]?w=400&q=80",
    "https://images.unsplash.com/photo-[id2]?w=400&q=80"
  ]
}
```

**Tips:**
- Use 2 images for the social media section
- Images should be relevant to the industry (electrical work, plumbing fixtures, etc.)
- Use Unsplash URLs with `?w=400&q=80` for optimized loading

#### 2.2 Add CTA Banner Section

If the mock includes an emergency/CTA banner:

```json
"ctaBanner": {
  "heading": "[Industry] Emergency?",
  "subheading": "We respond in 60 minutes. Call now for immediate help.",
  "primaryCTA": {
    "text": "CALL ([phone-number])"
  },
  "secondaryCTA": {
    "text": "GET FREE QUOTE"
  }
}
```

#### 2.3 Update Logo Configuration

```json
"logo": {
  "text": "[BUSINESS NAME]",
  "tagline": "[TAGLINE LINE]",
  "image": {
    "src": "/assets/[demo-name]/[logo-file].png",
    "alt": "[Business Name] logo",
    "priority": true
  }
}
```

**Important:** The logo will display as icon + text side-by-side in the header.

---

### Step 3: Handle Logo Assets

#### Option A: Custom SVG Icon (like Electrical)

If you need a custom icon (like the orange lightbulb):

1. Create a new component: `/components/ui/[business-name]-logo-icon.tsx`
2. Export an SVG component
3. Update `/components/ui/logo.tsx` to conditionally use it:

```typescript
{text === '[BUSINESS NAME]' ? (
  <CustomLogoIcon className="h-12 w-12 flex-shrink-0" />
) : (
  <Image ... />
)}
```

#### Option B: PNG/JPG Image

If using a standard image file:
1. Place the logo at `/public/assets/[demo-name]/[logo-name].png`
2. Update the config `logo.image.src` path
3. The Logo component will automatically render it

---

### Step 4: Update Component Layout (if needed)

#### Remove Footer (Electrical-style)

If the mock has no footer:

**File:** `/components/PageContent.tsx`

```typescript
{config.slug !== '[demo-name]' && (
  <SiteFooter
    footer={config.footer}
    logoSrc={config.branding?.logo?.image?.src}
    businessName={config.businessInfo.businessName}
  />
)}
```

#### Add White Space Around Sections

If sections need breathing room:

```typescript
{config.socialMedia && config.socialMedia.links && config.socialMedia.links.length > 0 && (
  <div className="bg-white py-16 px-4">
    <div className="container mx-auto">
      <SocialMedia
        heading={config.socialMedia.heading}
        subheading={config.socialMedia.subheading}
        links={config.socialMedia.links}
        images={config.socialMedia.images}
      />
    </div>
  </div>
)}
```

---

### Step 5: Test All Form Links

Verify that all CTA buttons trigger the correct actions:

1. **Header "Get Free Quote" button** - Opens quote modal
2. **Hero CTAs** - Open quote modal or navigate correctly
3. **About section CTA** - Opens quote modal
4. **CTA Banner buttons** - Phone link and quote modal
5. **Mobile CTAs** - All buttons work on mobile

**Testing checklist:**
```markdown
- [ ] Header "Get Free Quote" → Opens modal
- [ ] Hero primary CTA → Opens modal
- [ ] Hero secondary CTA → Phone call
- [ ] About "Get Quote" → Opens modal
- [ ] CTA Banner "CALL" → Phone call
- [ ] CTA Banner "GET FREE QUOTE" → Opens modal
- [ ] Mobile header button → Phone call
- [ ] Modal form submits correctly
```

---

### Step 6: Verify the Layout Flow

The correct section order for most demos:

1. Header (with logo, navigation, CTAs)
2. Hero
3. About
4. Services
5. Social Proof (testimonials)
6. FAQ
7. Service Areas
8. **Social Media** (with white space wrapper)
9. **CTA Banner** (with "Powered by Chery Solutions")
10. Footer (conditional - may be removed)

---

### Step 7: Create a Comparison Screenshot

1. Take a full-page screenshot of the mock
2. Take a full-page screenshot of your implementation
3. Compare side-by-side for:
   - Logo positioning and style
   - Section spacing
   - Color consistency
   - CTA placement
   - Footer presence

---

## 🚨 Common Gotchas

### 1. Config Validation Errors

**Problem:** Zod schema validation fails
**Solution:** Ensure all required fields meet minimum length requirements:
- Headings: minimum 5 characters
- Descriptions: minimum 50 characters
- CTA text: minimum 2 characters

### 2. Logo Not Displaying Correctly

**Problem:** Logo shows old image or wrong layout
**Solution:**
- Clear Next.js cache: `rm -rf .next/cache`
- Restart dev server
- Check image path is correct
- Verify conditional logic in Logo component

### 3. Footer Still Showing

**Problem:** Footer appears even though mock has none
**Solution:** Add conditional check in `PageContent.tsx`:
```typescript
{config.slug !== '[demo-name]' && <SiteFooter ... />}
```

### 4. Forms Not Opening

**Problem:** "Get Free Quote" buttons don't open modal
**Solution:** Ensure button uses:
```typescript
onClick={() => window.dispatchEvent(new CustomEvent('openQuoteModal'))}
```

### 5. White Space Missing

**Problem:** Sections are too cramped
**Solution:** Wrap sections in spacing divs:
```typescript
<div className="bg-white py-16 px-4">
  <div className="container mx-auto">
    {/* Section content */}
  </div>
</div>
```

### 6. Vercel Build Failures - TypeScript/ESLint Errors

**Problem:** Build succeeds locally but fails on Vercel
**Common Causes & Solutions:**

#### A. Unescaped Quotes (ESLint Error)
```
Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`
```
**Solution:** Replace straight quotes with HTML entities:
```typescript
// ❌ Wrong
<p>"{testimonial.quote}"</p>

// ✅ Correct
<p>&ldquo;{testimonial.quote}&rdquo;</p>
```

#### B. Missing Button Variants (TypeScript Error)
```
Error: Type '"gradient"' is not assignable to type 'CTAButtonVariant'
```
**Solution:** Add missing variants to `/components/sections/cta-button.tsx`:
```typescript
type CTAButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverse' | 'white' | 'gradient';

const variantClasses: Record<CTAButtonVariant, string> = {
  // ... existing variants
  white: 'bg-white text-primary shadow-sm hover:bg-white/90 focus-visible:ring-primary/20',
  gradient: 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg hover:shadow-xl focus-visible:ring-primary/20',
};
```

#### C. Missing Social Media Platform Support
```
Error: Type '"linkedin"' is not assignable to type '"facebook" | "instagram" | "twitter"'
```
**Solution:** Update `/components/sections/SocialMedia.tsx`:
```typescript
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  // ...
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};
```

#### D. Modal Event Listener Not Working
**Problem:** PageWrapper doesn't listen for custom 'openQuoteModal' event
**Solution:** Add useEffect to `/components/PageWrapper.tsx`:
```typescript
useEffect(() => {
  const handleOpenModal = () => {
    openQuoteModal();
  };

  window.addEventListener('openQuoteModal', handleOpenModal);
  return () => window.removeEventListener('openQuoteModal', handleOpenModal);
}, []);
```

**Testing Deployment:**
1. Test build locally first: `npm run build`
2. Fix any TypeScript/ESLint errors before pushing
3. Monitor Vercel deployment logs for errors
4. Fix incrementally and push small commits

---

## 📝 Documentation Requirements

After completing the update:

1. **Update CLAUDE.md**
   - Add a new "Phase" entry with date
   - Document all config changes made
   - List all component updates
   - Note any TypeScript changes
   - Include "Process to Replicate" section

2. **Git Commit Message Format**
   ```
   feat: Align [Demo Name] with mock design

   - Added social media section with platform links and images
   - Added CTA banner with emergency messaging
   - Updated logo configuration to match mock
   - Removed footer (matches mock design)
   - Enhanced Service Areas section with icons and hover effects
   - Added "Powered by Chery Solutions" credit
   - Added "View All Demos" navigation link

   Refs: Phase [X] - [Demo Name] Mock Alignment
   ```

3. **Test Before Committing**
   ```bash
   # Run build to check for errors
   npm run build

   # Test all form links
   # Test mobile responsive
   # Test cross-browser (Chrome, Firefox, Safari)
   ```

---

## ✅ Final Checklist

Before marking the demo as complete:

- [ ] Mock comparison screenshots taken
- [ ] All config fields added and validated
- [ ] Logo displays correctly (icon + text + tagline)
- [ ] Social media section renders with images
- [ ] CTA banner displays with correct styling
- [ ] Footer removed (if applicable)
- [ ] "Powered by Chery Solutions" link added
- [ ] "View All Demos" navigation link working
- [ ] All "Get Free Quote" buttons open modal
- [ ] Phone links work on all CTAs
- [ ] Mobile responsive tested
- [ ] CLAUDE.md updated with changes
- [ ] Git commit created with proper message
- [ ] Changes pushed to GitHub
- [ ] Production build tested

---

## 🔄 Replication Template

Use this template for quick reference when starting a new demo:

```markdown
## [Demo Name] Mock Alignment

**Date:** [Today's Date]
**Mock File:** `/mock-design/[demo-name]-mock.html`

### Changes Needed
- [ ] Add social media section to config
- [ ] Add CTA banner to config
- [ ] Update logo configuration
- [ ] Update logo image/icon
- [ ] Remove footer (if needed)
- [ ] Add white space wrappers
- [ ] Test all form links
- [ ] Update CLAUDE.md
- [ ] Commit to GitHub

### Config Updates
1. socialMedia: [Yes/No]
2. ctaBanner: [Yes/No]
3. Logo style: [Icon+Text / Image-only]
4. Footer: [Removed / Updated]

### Notes
[Any special considerations or unique requirements]
```

---

## 🎓 Learning Resources

- **Electrical Demo**: `/config/clients/electrical.json` - Reference implementation
- **Logo Component**: `/components/ui/logo.tsx` - How logos render
- **CTABanner Component**: `/components/sections/CTABanner.tsx` - Emergency banner
- **PageContent**: `/components/PageContent.tsx` - Section orchestration
- **Service Areas**: `/components/sections/ServiceAreas.tsx` - Enhanced layout example

---

## 💡 Pro Tips

1. **Always start with config changes** before touching components
2. **Test incrementally** - don't make all changes at once
3. **Use browser dev tools** to inspect the mock HTML
4. **Keep mock screenshots** for reference during development
5. **Document as you go** - don't wait until the end
6. **Commit frequently** - makes it easier to roll back if needed
7. **Test on mobile** - most traffic is mobile
8. **Clear cache often** - Next.js caches aggressively

---

**Questions or Issues?**
Refer to CLAUDE.md for the latest updates or consult the Phase 16 implementation for the Electrical demo.

---

*This SOP is a living document. Update it as new patterns emerge or processes improve.*
