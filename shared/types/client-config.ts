/**
 * NeverMissLead - Client Configuration Type Definitions
 *
 * These interfaces define the complete structure for client websites.
 * Each client gets a JSON config file that drives their entire site.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

// ============================================================================
// 1. BUSINESS INFORMATION
// ============================================================================

export interface BusinessInfo {
  businessName: string;
  operatingName: string;
  legalName: string;
  industry: string;
  yearsInBusiness: string;
  tagline: string;
  contact: ContactInfo;
}

export interface ContactInfo {
  primaryPhone: string;
  emailDisplay: string;
  emailRouting: string; // Actual email where leads go
  businessAddress: string;
  serviceHours: string;
}

// ============================================================================
// 2. HERO SECTION
// ============================================================================

export interface HeroSection {
  eyebrow?: string;
  mainHeadline: string;
  subheadline: string;
  description?: string;
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
  backgroundImage?: string;
}

export interface CTAButton {
  text: string;
  action: 'phone' | 'form' | 'link' | 'sms';
  value: string; // Phone number, URL, etc.
  style?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverse' | 'light';
}

// ============================================================================
// 3. TRUST BADGES
// ============================================================================

export interface TrustBadge {
  icon: string; // Icon identifier or emoji
  text: string;
  order: number;
}

// ============================================================================
// 4. ABOUT US SECTION
// ============================================================================

export interface AboutYearsBadge {
  value: string;
  label: string;
}

export interface AboutSection {
  eyebrow?: string;
  heading: string;
  title?: string;
  description: string;
  paragraphs?: string[];
  image?: string;
  logo?: string;
  features?: string[]; // Optional checkmark list items
  yearsBadge?: AboutYearsBadge;
  ctaText?: string;
}

// ============================================================================
// 5. SERVICES (Core Service Offerings)
// ============================================================================

export interface ServicesSection {
  heading: string;
  description: string;
}

export interface Service {
  title: string;
  icon: string;
  description: string;
  order: number;
  featured?: boolean;
}

// ============================================================================
// 6. PROCESS STEPS (How It Works)
// ============================================================================

export interface ProcessSection {
  heading: string;
  subheading: string;
  steps: ProcessStep[];
}

export interface ProcessStep {
  icon: string;
  title: string;
  description: string;
  order: number;
}

// ============================================================================
// 7. FAQ SECTION
// ============================================================================

export interface FAQ {
  question: string;
  answer: string;
  order: number;
  category?: string;
}

// ============================================================================
// 8. SERVICE AREAS
// ============================================================================

export interface ServiceAreas {
  heading: string;
  description?: string;
  cities: string[];
  counties: string[];
}

// ============================================================================
// 9. BUSINESS HOURS
// ============================================================================

export interface BusinessHours {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
  regularHours?: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
}

// ============================================================================
// 10. CALL-TO-ACTION COPY
// ============================================================================

export interface CTACopy {
  primaryCTAs: string[]; // Multiple CTA text variations
  emergencyBanner?: string;
  footerCTA?: string;
}

// ============================================================================
// 11. SMS AUTO-RESPONSE
// ============================================================================

export interface SMSConfig {
  autoResponse: string;
  enabled: boolean;
}

// ============================================================================
// 12. SOCIAL PROOF / REVIEWS
// ============================================================================

export interface SocialProofSection {
  heading: string;
  eyebrow?: string;
  subheading?: string;
  stats: ReviewStats;
  testimonials: Testimonial[];
}

export interface ReviewStats {
  rating: string;
  totalReviews: string;
  awards?: string[];
  certifications?: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
  rating?: number;
  order: number;
  image?: string;
}

// ============================================================================
// 13. VALUE PROPOSITIONS / WHY CHOOSE US
// ============================================================================

export interface ValuePropositionsSection {
  heading: string;
  differentiators: string[];
}

// ============================================================================
// 14. SPECIAL OFFERS / PROMOTIONS
// ============================================================================

export interface SpecialOffer {
  icon?: string;
  title: string;
  description: string;
  disclaimer?: string;
  enabled: boolean;
  order: number;
}

// ============================================================================
// 15. FINAL CTA SECTION
// ============================================================================

export interface FinalCTASection {
  heading: string;
  subheading: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA?: CTAButton;
  bannerImage?: string;
}

// ============================================================================
// 16. FOOTER CONTENT
// ============================================================================

export interface FooterConfig {
  tagline: string;
  quickLinks: FooterLink[];
  servicesLinks: FooterLink[];
  contactInfo: {
    businessName: string;
    address: string;
    phone: string;
    email: string;
    credentials: string[];
  };
  legalLinks: FooterLink[];
  copyright: string;
}

export interface FooterLink {
  text: string;
  href: string;
  order: number;
}

// ============================================================================
// 17. SEO META DATA
// ============================================================================

export interface SEOConfig {
  pageTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

// ============================================================================
// 18. BRANDING & DESIGN
// ============================================================================

export interface BrandingConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: {
      dark: string;
      light: string;
      white: string;
    };
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
  };
  logo?: {
    text: string;
    tagline?: string;
    image?: {
      src: string;
      alt?: string;
      priority?: boolean;
    };
  };
}

// ============================================================================
// 19. GOOGLE INTEGRATIONS
// ============================================================================

export interface GoogleIntegrations {
  businessProfile?: {
    name: string;
    category: string;
    placeId?: string;
  };
  analytics?: {
    measurementId: string;
  };
  mapsEmbed?: string;
  reviewsWidget?: {
    enabled: boolean;
    minRating: number;
  };
}

// ============================================================================
// 20. TWILIO CONFIGURATION (Phone/SMS Tracking)
// ============================================================================

export interface TwilioConfig {
  trackingNumber: string;
  forwardToNumber: string;
  smsEnabled: boolean;
  voiceEnabled: boolean;
  recordCalls: boolean;
}

// ============================================================================
// 21. CTA BANNER
// ============================================================================

export interface CTABannerSection {
  heading: string;
  subheading: string;
  primaryCTA: {
    text: string;
  };
  secondaryCTA: {
    text: string;
  };
}

// ============================================================================
// MAIN CLIENT CONFIGURATION INTERFACE
// ============================================================================

export interface ClientConfig {
  // Meta information
  slug: string; // URL-safe identifier (e.g., "nevermisslead")
  clientId: string; // UUID from database
  enabled: boolean;
  version: string;

  // Core sections (12 main sections)
  businessInfo: BusinessInfo;
  hero: HeroSection;
  trustBadges: TrustBadge[];
  about: AboutSection;
  servicesSection?: ServicesSection;
  services: Service[];
  process: ProcessSection;
  faq: FAQ[];
  serviceAreas: ServiceAreas;
  businessHours: BusinessHours;
  ctaCopy: CTACopy;
  sms: SMSConfig;
  socialProof: SocialProofSection;

  // Additional sections
  valuePropositions: ValuePropositionsSection;
  specialOffers?: SpecialOffer[];
  finalCTA: FinalCTASection;
  ctaBanner?: CTABannerSection;
  socialMedia?: SocialMediaSection;
  footer: FooterConfig;

  // Technical configuration
  seo: SEOConfig;
  branding: BrandingConfig;
  integrations: {
    google?: GoogleIntegrations;
    twilio?: TwilioConfig;
  };

  // Feature flags
  features: FeaturesConfig;
}

// ============================================================================
// SOCIAL MEDIA SECTION
// ============================================================================

export interface SocialMediaSection {
  heading?: string;
  subheading?: string;
  links: SocialMediaLink[];
  images?: string[];
}

export interface SocialMediaLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  url: string;
  label: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ClientSlug = string;
export type ClientStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface ClientMetadata {
  slug: ClientSlug;
  clientId: string;
  status: ClientStatus;
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export interface FeaturesConfig {
  showSpecialOffers: boolean;
  enableLiveChat: boolean;
  enableOnlineBooking: boolean;
  showBlog: boolean;
  showGallery: boolean;
  hideFinalCTA?: boolean;
  hideFooter?: boolean;
}

// ============================================================================
// FORM SUBMISSION TYPES
// ============================================================================

export interface LeadFormData {
  fullName: string;
  phone: string;
  email?: string;
  serviceType?: string;
  message?: string;
  source: 'website' | 'phone' | 'sms';
  clientId: string;
}

export interface ContactFormData extends LeadFormData {
  preferredContactMethod?: 'phone' | 'email' | 'sms';
  urgency?: 'emergency' | 'same-day' | 'scheduled';
}
