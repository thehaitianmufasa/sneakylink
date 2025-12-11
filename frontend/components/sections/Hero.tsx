'use client';

import { HeroSection, BusinessInfo, CTACopy } from '@shared/types/client-config';
import { CTAButtonLink } from './cta-button';
import { ChevronDown, Flame, Zap } from 'lucide-react';
import { maskPhoneNumber, isDemoSite } from '@backend/lib/utils/mask-phone';

interface HeroProps {
  hero: HeroSection;
  businessInfo: BusinessInfo;
  ctaCopy: CTACopy;
  logoSrc?: string;
  slug?: string;
}

export function Hero({ hero, businessInfo, ctaCopy, logoSrc, slug }: HeroProps) {
  // Map slug to overlay class
  const overlayClasses: Record<string, string> = {
    plumbing: 'hero-overlay-blue',
    electrical: 'hero-overlay-orange',
    hvac: 'hero-overlay-red',
    nevermisslead: 'hero-overlay-red', // default HVAC
  };
  const overlayClass = overlayClasses[slug || 'nevermisslead'] || 'hero-overlay-red';
  const isElectrical = slug === 'electrical';
  const isPlumbing = slug === 'plumbing';
  const isHVAC = slug === 'hvac' || slug === 'nevermisslead';
  const shouldSplitHeadline = isElectrical || isPlumbing;
  const eyebrowText = hero.eyebrow ?? (!shouldSplitHeadline && !isHVAC ? hero.subheadline : undefined);

  // Mask phone numbers for demo sites
  const isDemo = isDemoSite(slug);
  const maskedSecondaryCTA = hero.secondaryCTA ? {
    ...hero.secondaryCTA,
    text: maskPhoneNumber(hero.secondaryCTA.text, isDemo)
  } : undefined;

  const { primaryLine, accentLine } = (() => {
    if (!shouldSplitHeadline) {
      return { primaryLine: '', accentLine: '' };
    }

    if (!hero.mainHeadline) {
      return { primaryLine: '', accentLine: '' };
    }

    const match = hero.mainHeadline.match(/^(.*?)(\bin\b.+)$/i);
    if (match) {
      return {
        primaryLine: match[1].trim(),
        accentLine: match[2].trim(),
      };
    }

    return { primaryLine: hero.mainHeadline, accentLine: '' };
  })();

  const scrollToNext = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const nextSection = heroSection.nextElementSibling as HTMLElement;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image with Overlay */}
      {hero.backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${hero.backgroundImage})`,
            }}
            aria-hidden="true"
          />
          {/* Gradient Overlay - Uses CSS classes for different demos */}
          <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />
        </>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full px-4">
        <div className="container mx-auto max-w-6xl">
          <div className={`flex flex-col ${shouldSplitHeadline || isHVAC ? 'items-start text-left' : 'items-center text-center'}`}>
            {/* Eyebrow Text with Line */}
            {(shouldSplitHeadline || isHVAC) && eyebrowText && (
              <>
                {isHVAC ? (
                  <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-[#D32F2F]" />
                      <span className="text-xs font-bold uppercase tracking-wide text-white md:text-sm">HEATING</span>
                    </div>
                    <div className="w-px h-4 bg-white/30" />
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#1976D2]" />
                      <span className="text-xs font-bold uppercase tracking-wide text-white md:text-sm">COOLING</span>
                    </div>
                    <div className="w-px h-4 bg-white/30" />
                    <span className="text-xs font-bold uppercase tracking-wide text-white md:text-sm">24/7 EMERGENCY</span>
                  </div>
                ) : isPlumbing ? (
                  <div className="mb-6 flex items-center gap-2">
                    <div className="w-12 h-0.5 bg-accent" />
                    <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                      {eyebrowText}
                    </span>
                  </div>
                ) : (
                  <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm px-6 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-white md:text-sm">
                      {eyebrowText}
                    </p>
                  </div>
                )}
              </>
            )}
            {!shouldSplitHeadline && !isHVAC && (eyebrowText || hero.subheadline) && (
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-accent" aria-hidden="true" />
                <p className="text-sm font-bold uppercase tracking-wider text-accent md:text-base">
                  {eyebrowText || hero.subheadline}
                </p>
                <div className="h-px w-12 bg-accent" aria-hidden="true" />
              </div>
            )}

            {/* Main Headline - Split Line Design */}
            <h1 className="mb-6 max-w-4xl">
              {isHVAC ? (
                <>
                  <span className="block text-5xl font-black leading-none text-white md:text-7xl lg:text-8xl">
                    Climate Control
                  </span>
                  <span className="block text-4xl font-black leading-none md:text-6xl lg:text-7xl mt-2">
                    <span className="text-primary">Heating</span>
                    <span className="text-white"> & </span>
                    <span className="text-secondary">Cooling</span>
                  </span>
                  <span className="block text-3xl font-black leading-none text-accent md:text-5xl lg:text-6xl mt-2">
                    Experts in 60 Minutes
                  </span>
                </>
              ) : shouldSplitHeadline ? (
                <>
                  <span className="block text-5xl font-black leading-tight text-white md:text-7xl lg:text-8xl">
                    {primaryLine || hero.mainHeadline}
                  </span>
                  {accentLine && (
                    <span className="block text-5xl font-black leading-tight text-accent md:text-7xl lg:text-8xl">
                      {accentLine}
                    </span>
                  )}
                </>
              ) : (
                <span className="block text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
                  {hero.mainHeadline}
                </span>
              )}
            </h1>

            {(shouldSplitHeadline || isHVAC) && hero.subheadline && (
              <p className="mb-6 max-w-3xl text-lg font-semibold text-white/90 md:text-2xl">
                {hero.subheadline}
              </p>
            )}

            {/* Description */}
            {hero.description && (
              <p
                className={`mb-10 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg ${
                  isElectrical ? 'text-left' : ''
                }`}
              >
                {hero.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap items-center gap-4 ${
                shouldSplitHeadline || isHVAC ? 'justify-start' : 'justify-center'
              } ${!isHVAC ? 'mb-12' : 'mb-8'}`}
            >
              {hero.primaryCTA && (
                <CTAButtonLink
                  cta={hero.primaryCTA}
                  size="lg"
                  variant={isHVAC ? 'gradient' : (shouldSplitHeadline ? 'primary' : 'gradient')}
                  className={`min-w-[220px] text-lg ${
                    (shouldSplitHeadline || isHVAC) ? 'shadow-xl uppercase tracking-wide' : ''
                  } ${
                    isHVAC
                      ? 'h-14 px-8 text-xl font-bold'
                      : isPlumbing
                      ? 'font-black'
                      : shouldSplitHeadline
                      ? 'font-black'
                      : ''
                  }`}
                  style={
                    isHVAC ? {
                      background: '#F57C00',
                      color: 'white'
                    } : isPlumbing ? {
                      background: 'linear-gradient(135deg, #0066CC 0%, #00A8E8 100%)',
                      color: 'white'
                    } : undefined
                  }
                />
              )}
              {maskedSecondaryCTA && (
                <CTAButtonLink
                  cta={maskedSecondaryCTA}
                  size="lg"
                  variant={(shouldSplitHeadline || isHVAC) ? 'white' : 'white'}
                  className={`min-w-[220px] text-lg ${
                    (shouldSplitHeadline || isHVAC) ? 'uppercase shadow-lg' : ''
                  } ${
                    isHVAC
                      ? 'h-14 px-8 text-xl !bg-white !text-black font-black'
                      : isPlumbing
                      ? '!bg-white !text-[#003D7A] font-black'
                      : shouldSplitHeadline
                      ? 'font-black'
                      : ''
                  }`}
                />
              )}
            </div>

            {/* Temperature Gauge - HVAC Only */}
            {isHVAC && (
              <div className="max-w-3xl w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">Emergency Response Time</span>
                  <span className="text-white font-bold">≤ 60 MIN</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full w-4/5 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, #D32F2F 0%, #F57C00 50%, #1976D2 100%)'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="animate-bounce">
          <ChevronDown size={24} className="text-white" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
