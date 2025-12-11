'use client';

import Image from 'next/image';
import type { AboutSection, BusinessInfo } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { Check } from 'lucide-react';
import { useModal } from '../PageWrapper';
import { Reveal } from '../ui/reveal';

const DEFAULT_ABOUT_FEATURES: string[] = [
  'Licensed & Insured Professionals',
  '24/7 Emergency Service Available',
  'Upfront Pricing - No Hidden Fees',
  'Satisfaction Guaranteed',
];

interface AboutProps {
  about: AboutSection;
  businessInfo?: BusinessInfo;
  slug?: string;
}

export function About({ about, businessInfo, slug }: AboutProps) {
  const { openQuoteModal } = useModal();
  const isHVAC = slug === 'hvac' || slug === 'nevermisslead';

  const features =
    about.features && about.features.length > 0 ? about.features : DEFAULT_ABOUT_FEATURES;

  const paragraphs = Array.isArray(about.paragraphs) && about.paragraphs.length > 0
    ? about.paragraphs
    : about.description
      ? [about.description]
      : [];

  const badge = about.yearsBadge
    || (businessInfo?.yearsInBusiness
      ? { value: businessInfo.yearsInBusiness, label: 'Years in Business' }
      : undefined);

  const ctaLabel = about.ctaText ?? 'Get Free Quote';

  // HVAC-specific checkmark colors
  const hvacCheckColors = isHVAC ? [
    'bg-[#D32F2F] text-white', // Red
    'bg-[#1976D2] text-white', // Blue
    'bg-[#F57C00] text-white', // Orange
    'bg-[#0D47A1] text-white', // Navy
  ] : [];

  return (
    <SectionContainer
      id="about"
      className="bg-[#f7f8fc]"
      innerClassName="gap-12"
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
        {/* Image Column with Years Badge */}
        <Reveal className="relative">
          {about.image ? (
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[600px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 lg:mx-0 lg:max-w-none lg:aspect-[5/4]">
              <Image
                src={about.image}
                alt={about.heading}
                fill
                priority
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 520px, 92vw"
                className="object-cover"
              />
            </div>
          ) : about.logo ? (
            <div className="flex justify-center lg:justify-start">
              <Image
                src={about.logo}
                alt={about.heading}
                width={500}
                height={500}
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/assets/hvac-logo-bw.png"
                alt="HVAC Logo"
                width={400}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          )}

          {badge && (
            <div className={`absolute -bottom-8 -right-6 rounded-2xl px-9 py-7 text-white shadow-2xl lg:-bottom-10 lg:-right-8 ${
              isHVAC ? 'bg-gradient-to-br from-[#D32F2F] to-[#1976D2]' : 'bg-primary'
            }`}>
              <div className="text-5xl font-black lg:text-6xl">{badge.value}</div>
              <div className="text-base font-semibold tracking-wide lg:text-lg">{badge.label}</div>
            </div>
          )}
        </Reveal>

        {/* Content Column */}
        <Reveal className="space-y-6">
          {about.eyebrow && (
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-12 bg-accent" aria-hidden="true" />
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
                {about.eyebrow}
              </span>
            </div>
          )}

          <h2 className={`text-3xl font-black md:text-4xl lg:text-5xl ${
            isHVAC ? 'text-gray-900' : 'text-secondary'
          }`}>
            {about.heading}
          </h2>

          {paragraphs.length > 0 ? (
            <div className="space-y-4 text-lg leading-relaxed text-text">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-lg leading-relaxed text-text">{about.description}</p>
          )}

          {/* Checkmark Features List */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                <div className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                  isHVAC ? hvacCheckColors[index % hvacCheckColors.length] : 'bg-primary/10'
                }`}>
                  <Check className={`h-4 w-4 ${isHVAC ? '' : 'text-primary'}`} aria-hidden="true" />
                </div>
                <span className="text-base font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={openQuoteModal}
              className="btn-primary-gradient inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-bold uppercase tracking-wide shadow-lg"
            >
              {ctaLabel}
            </button>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}

export default About;
