/**
 * NeverMissLead - Client Configuration Zod Schemas
 *
 * Runtime validation schemas for client configuration files.
 * Provides type-safe validation and helpful error messages.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// 1. BUSINESS INFORMATION SCHEMAS
// ============================================================================

const ContactInfoSchema = z.object({
  primaryPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  emailDisplay: z.string().email('Invalid email format'),
  emailRouting: z.string().email('Invalid routing email format'),
  businessAddress: z.string().min(10, 'Address must be at least 10 characters'),
  serviceHours: z.string().min(5, 'Service hours required'),
});

const BusinessInfoSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  operatingName: z.string().min(2, 'Operating name must be at least 2 characters'),
  legalName: z.string().min(2, 'Legal name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry must be specified'),
  yearsInBusiness: z.string().min(1, 'Years in business required'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  contact: ContactInfoSchema,
});

// ============================================================================
// 2. HERO SECTION SCHEMAS
// ============================================================================

const CTAButtonSchema = z.object({
  text: z.string().min(2, 'CTA text must be at least 2 characters'),
  action: z.enum(['phone', 'form', 'link', 'sms'], {
    errorMap: () => ({ message: 'Action must be phone, form, link, or sms' }),
  }),
  value: z.string().min(1, 'CTA value required'),
  style: z.enum(['primary', 'secondary', 'outline', 'ghost', 'inverse', 'light']).optional(),
});

const HeroSectionSchema = z.object({
  eyebrow: z.string().min(3, 'Eyebrow must be at least 3 characters').optional(),
  mainHeadline: z.string().min(10, 'Headline must be at least 10 characters'),
  subheadline: z.string().min(10, 'Subheadline must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').optional(),
  primaryCTA: CTAButtonSchema,
  secondaryCTA: CTAButtonSchema,
  backgroundImage: z.string().url('Invalid image URL').optional(),
});

// ============================================================================
// 3. TRUST BADGES SCHEMA
// ============================================================================

const TrustBadgeSchema = z.object({
  icon: z.string().min(1, 'Icon required'),
  text: z.string().min(3, 'Badge text must be at least 3 characters'),
  order: z.number().int().min(1, 'Order must be a positive integer'),
});

// ============================================================================
// 4. ABOUT US SCHEMA
// ============================================================================

const AboutYearsBadgeSchema = z.object({
  value: z.string().min(1, 'Years badge value required'),
  label: z.string().min(3, 'Years badge label must be at least 3 characters'),
});

const AboutSectionSchema = z.object({
  eyebrow: z.string().min(3, 'Eyebrow must be at least 3 characters').optional(),
  heading: z.string().min(5, 'Heading must be at least 5 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  paragraphs: z.array(z.string().min(40, 'Paragraph must be at least 40 characters')).min(1).optional(),
  image: z.string().url('Invalid image URL').optional(),
  logo: z.string().optional(), // Path to logo image
  yearsBadge: AboutYearsBadgeSchema.optional(),
  ctaText: z.string().min(3, 'CTA text must be at least 3 characters').optional(),
});

// ============================================================================
// 5. SERVICES SCHEMA
// ============================================================================

const ServicesSectionSchema = z.object({
  heading: z.string().min(5, 'Services heading must be at least 5 characters'),
  description: z.string().min(20, 'Services description must be at least 20 characters'),
});

const ServiceSchema = z.object({
  title: z.string().min(3, 'Service title must be at least 3 characters'),
  icon: z.string().min(1, 'Icon required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  order: z.number().int().min(1, 'Order must be a positive integer'),
  featured: z.boolean().optional(),
});

// ============================================================================
// 6. PROCESS STEPS SCHEMA
// ============================================================================

const ProcessStepSchema = z.object({
  icon: z.string().min(1, 'Icon required'),
  title: z.string().min(3, 'Step title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  order: z.number().int().min(1, 'Order must be a positive integer'),
});

const ProcessSectionSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters'),
  subheading: z.string().min(5, 'Subheading must be at least 5 characters'),
  steps: z.array(ProcessStepSchema).min(3, 'At least 3 process steps required').max(10, 'Maximum 10 process steps'),
});

// ============================================================================
// 7. FAQ SCHEMA
// ============================================================================

const FAQSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters'),
  answer: z.string().min(20, 'Answer must be at least 20 characters'),
  order: z.number().int().min(1, 'Order must be a positive integer'),
  category: z.string().optional(),
});

// ============================================================================
// 8. SERVICE AREAS SCHEMA
// ============================================================================

const ServiceAreasSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  cities: z.array(z.string().min(2, 'City name must be at least 2 characters')).min(5, 'At least 5 cities required'),
  counties: z.array(z.string().min(2, 'County name must be at least 2 characters')).min(1, 'At least 1 county required'),
});

// ============================================================================
// 9. BUSINESS HOURS SCHEMA
// ============================================================================

const BusinessHoursSchema = z.object({
  Monday: z.string().min(5, 'Hours format required'),
  Tuesday: z.string().min(5, 'Hours format required'),
  Wednesday: z.string().min(5, 'Hours format required'),
  Thursday: z.string().min(5, 'Hours format required'),
  Friday: z.string().min(5, 'Hours format required'),
  Saturday: z.string().min(5, 'Hours format required'),
  Sunday: z.string().min(5, 'Hours format required'),
  regularHours: z.object({
    weekday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }).optional(),
});

// ============================================================================
// 10. CTA COPY SCHEMA
// ============================================================================

const CTACopySchema = z.object({
  primaryCTAs: z.array(z.string().min(5, 'CTA text must be at least 5 characters')).min(2, 'At least 2 CTA variations required'),
  emergencyBanner: z.string().optional(),
  footerCTA: z.string().optional(),
});

// ============================================================================
// 11. SMS CONFIG SCHEMA
// ============================================================================

const SMSConfigSchema = z.object({
  autoResponse: z.string().min(50, 'Auto-response must be at least 50 characters'),
  enabled: z.boolean(),
});

// ============================================================================
// 12. SOCIAL PROOF SCHEMA
// ============================================================================

const ReviewStatsSchema = z.object({
  rating: z.string().regex(/^\d+(\.\d+)?\/5$/, 'Rating must be in format "X.X/5"'),
  totalReviews: z.string().min(1, 'Total reviews required'),
  awards: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
});

const TestimonialSchema = z.object({
  quote: z.string().min(20, 'Quote must be at least 20 characters'),
  author: z.string().min(2, 'Author name required'),
  location: z.string().min(2, 'Location required'),
  rating: z.number().int().min(1).max(5).optional(),
  order: z.number().int().min(1, 'Order must be a positive integer'),
  image: z.string().min(1, 'Image path required').optional(),
});

const SocialProofSectionSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters'),
  eyebrow: z.string().min(3, 'Eyebrow must be at least 3 characters').optional(),
  subheading: z.string().min(5, 'Subheading must be at least 5 characters').optional(),
  stats: ReviewStatsSchema,
  testimonials: z.array(TestimonialSchema).min(3, 'At least 3 testimonials required').max(10, 'Maximum 10 testimonials'),
});

// ============================================================================
// 13. VALUE PROPOSITIONS SCHEMA
// ============================================================================

const ValuePropositionsSectionSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters'),
  differentiators: z.array(z.string().min(10, 'Differentiator must be at least 10 characters')).min(5, 'At least 5 differentiators required'),
});

// ============================================================================
// 14. SPECIAL OFFERS SCHEMA
// ============================================================================

const SpecialOfferSchema = z.object({
  icon: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  disclaimer: z.string().optional(),
  enabled: z.boolean(),
  order: z.number().int().min(1, 'Order must be a positive integer'),
});

// ============================================================================
// 15. FINAL CTA SCHEMA
// ============================================================================

const SocialMediaLinkSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin']),
  url: z.string().url('Invalid social media URL'),
  label: z.string().min(2, 'Label must be at least 2 characters'),
});

const SocialMediaSectionSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters').optional(),
  subheading: z.string().min(5, 'Subheading must be at least 5 characters').optional(),
  links: z.array(SocialMediaLinkSchema).min(1, 'At least 1 social media link required'),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

// ============================================================================
// 15. FINAL CTA SECTION
// ============================================================================

const FinalCTASectionSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters'),
  subheading: z.string().min(5, 'Subheading must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  primaryCTA: CTAButtonSchema,
  secondaryCTA: CTAButtonSchema.optional(),
  bannerImage: z.string().optional(), // Path to banner image
});

const CTABannerSectionSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters'),
  subheading: z.string().min(5, 'Subheading must be at least 5 characters'),
  primaryCTA: z.object({
    text: z.string().min(2, 'CTA text must be at least 2 characters'),
  }),
  secondaryCTA: z.object({
    text: z.string().min(2, 'CTA text must be at least 2 characters'),
  }),
});

// ============================================================================
// 16. FOOTER SCHEMA
// ============================================================================

const FooterLinkSchema = z.object({
  text: z.string().min(2, 'Link text must be at least 2 characters'),
  href: z.string().min(1, 'Link href required'),
  order: z.number().int().min(1, 'Order must be a positive integer'),
});

const FooterConfigSchema = z.object({
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  quickLinks: z.array(FooterLinkSchema).min(3, 'At least 3 quick links required'),
  servicesLinks: z.array(FooterLinkSchema).min(3, 'At least 3 service links required'),
  contactInfo: z.object({
    businessName: z.string().min(2, 'Business name required'),
    address: z.string().min(10, 'Address required'),
    phone: z.string().min(10, 'Phone required'),
    email: z.string().email('Invalid email format'),
    credentials: z.array(z.string()).min(1, 'At least 1 credential required'),
  }),
  legalLinks: z.array(FooterLinkSchema).min(2, 'At least 2 legal links required'),
  copyright: z.string().min(10, 'Copyright text required'),
});

// ============================================================================
// 17. SEO SCHEMA
// ============================================================================

const SEOConfigSchema = z.object({
  pageTitle: z.string().min(30, 'Page title must be at least 30 characters').max(60, 'Page title must be less than 60 characters'),
  metaDescription: z.string().min(120, 'Meta description must be at least 120 characters').max(160, 'Meta description must be less than 160 characters'),
  keywords: z.array(z.string().min(2, 'Keyword must be at least 2 characters')).min(5, 'At least 5 keywords required'),
  ogImage: z.string().url('Invalid OG image URL').optional(),
  canonicalUrl: z.string().url('Invalid canonical URL').optional(),
});

// ============================================================================
// 18. BRANDING SCHEMA
// ============================================================================

const BrandingConfigSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Primary color must be a valid hex color'),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Secondary color must be a valid hex color'),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Accent color must be a valid hex color'),
    neutral: z.object({
      dark: z.string().regex(/^#[0-9A-F]{6}$/i, 'Dark neutral must be a valid hex color'),
      light: z.string().regex(/^#[0-9A-F]{6}$/i, 'Light neutral must be a valid hex color'),
      white: z.string().regex(/^#[0-9A-F]{6}$/i, 'White must be a valid hex color'),
    }),
  }),
  typography: z.object({
    headingFont: z.string().optional(),
    bodyFont: z.string().optional(),
  }).optional(),
  logo: z.object({
    text: z.string().min(2, 'Logo text required'),
    tagline: z.string().optional(),
    image: z.object({
      src: z.string().min(1, 'Logo image src required'),
      alt: z.string().optional(),
      priority: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

// ============================================================================
// 19. GOOGLE INTEGRATIONS SCHEMA
// ============================================================================

const GoogleIntegrationsSchema = z.object({
  businessProfile: z.object({
    name: z.string().min(2, 'Business name required'),
    category: z.string().min(2, 'Category required'),
    placeId: z.string().optional(),
  }).optional(),
  analytics: z.object({
    measurementId: z.string().regex(/^G-[A-Z0-9]+$/, 'Invalid Google Analytics measurement ID'),
  }).optional(),
  mapsEmbed: z.string().optional(),
  reviewsWidget: z.object({
    enabled: z.boolean(),
    minRating: z.number().int().min(1).max(5),
  }).optional(),
});

// ============================================================================
// 20. TWILIO SCHEMA
// ============================================================================

const TwilioConfigSchema = z.object({
  trackingNumber: z.string().min(10, 'Tracking number required'),
  forwardToNumber: z.string().min(10, 'Forward to number required'),
  smsEnabled: z.boolean(),
  voiceEnabled: z.boolean(),
  recordCalls: z.boolean(),
});

// ============================================================================
// MAIN CLIENT CONFIGURATION SCHEMA
// ============================================================================

export const ClientConfigSchema = z.object({
  // Meta information
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  enabled: z.boolean(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format (e.g., 1.0.0)'),

  // Core sections (12 main sections)
  businessInfo: BusinessInfoSchema,
  hero: HeroSectionSchema,
  trustBadges: z.array(TrustBadgeSchema).min(3, 'At least 3 trust badges required').max(10, 'Maximum 10 trust badges'),
  about: AboutSectionSchema,
  servicesSection: ServicesSectionSchema.optional(),
  services: z.array(ServiceSchema).min(3, 'At least 3 services required').max(15, 'Maximum 15 services'),
  process: ProcessSectionSchema,
  faq: z.array(FAQSchema).min(3, 'At least 3 FAQs required').max(15, 'Maximum 15 FAQs'),
  serviceAreas: ServiceAreasSchema,
  businessHours: BusinessHoursSchema,
  ctaCopy: CTACopySchema,
  sms: SMSConfigSchema,
  socialProof: SocialProofSectionSchema,

  // Additional sections
  valuePropositions: ValuePropositionsSectionSchema,
  specialOffers: z.array(SpecialOfferSchema).max(5, 'Maximum 5 special offers').optional(),
  finalCTA: FinalCTASectionSchema,
  ctaBanner: CTABannerSectionSchema.optional(),
  socialMedia: SocialMediaSectionSchema.optional(),
  footer: FooterConfigSchema,

  // Technical configuration
  seo: SEOConfigSchema,
  branding: BrandingConfigSchema,
  integrations: z.object({
    google: GoogleIntegrationsSchema.optional(),
    twilio: TwilioConfigSchema.optional(),
  }),

  // Feature flags
  features: z.object({
    showSpecialOffers: z.boolean(),
    enableLiveChat: z.boolean(),
    enableOnlineBooking: z.boolean(),
    showBlog: z.boolean(),
    showGallery: z.boolean(),
    hideFinalCTA: z.boolean().optional(),
    hideFooter: z.boolean().optional(),
  }),
});

// ============================================================================
// FORM SUBMISSION SCHEMAS
// ============================================================================

export const LeadFormDataSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email format').optional(),
  serviceType: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(['website', 'phone', 'sms', 'hero_form', 'quote_modal', 'signup_page', 'discount_modal', 'access_modal']),
  clientId: z.string().uuid('Client ID must be a valid UUID').optional(),
});

export const ContactFormDataSchema = LeadFormDataSchema.extend({
  preferredContactMethod: z.enum(['phone', 'email', 'sms']).optional(),
  urgency: z.enum(['emergency', 'same-day', 'scheduled']).optional(),
});

// ============================================================================
// UTILITY SCHEMAS
// ============================================================================

export const ClientMetadataSchema = z.object({
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']),
  domain: z.string().url('Invalid domain URL').optional(),
  createdAt: z.string().datetime('Invalid datetime format'),
  updatedAt: z.string().datetime('Invalid datetime format'),
});

// ============================================================================
// TYPE INFERENCE HELPERS
// ============================================================================

export type ClientConfigInput = z.input<typeof ClientConfigSchema>;
export type ClientConfigOutput = z.output<typeof ClientConfigSchema>;
export type LeadFormInput = z.input<typeof LeadFormDataSchema>;
export type ContactFormInput = z.input<typeof ContactFormDataSchema>;
