'use client';

import { maskPhoneNumber, isDemoSite } from '@backend/lib/utils/mask-phone';

interface CTABannerProps {
  heading: string;
  subheading: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    onClick: () => void;
  };
  slug?: string;
}

export function CTABanner({ heading, subheading, primaryCTA, secondaryCTA, slug }: CTABannerProps) {
  const isHVAC = slug === 'hvac' || slug === 'nevermisslead';

  // Mask phone numbers for demo sites
  const isDemo = isDemoSite(slug);
  const maskedPrimaryCTA = {
    ...primaryCTA,
    text: maskPhoneNumber(primaryCTA.text, isDemo)
  };

  return (
    <section
      className="py-16"
      style={isHVAC ? {
        background: 'linear-gradient(to right, #D32F2F 0%, #F57C00 50%, #1976D2 100%)'
      } : undefined}
    >
      <div className={!isHVAC ? 'bg-secondary py-16' : ''}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
                {heading}
              </h3>
              <p className="text-white/90 text-lg font-semibold">
                {subheading}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={maskedPrimaryCTA.href}
                className={`px-8 py-4 rounded-xl font-black text-lg shadow-xl text-center whitespace-nowrap transition uppercase tracking-wide ${
                  isHVAC
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {maskedPrimaryCTA.text}
              </a>
              <button
                onClick={secondaryCTA.onClick}
                className={`px-8 py-4 rounded-xl font-black text-lg shadow-xl whitespace-nowrap transition uppercase tracking-wide ${
                  isHVAC
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white text-secondary hover:bg-gray-50'
                }`}
              >
                {secondaryCTA.text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
