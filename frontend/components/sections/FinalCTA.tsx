import type { FinalCTASection } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { CTAButtonLink } from './cta-button';
import Image from 'next/image';

interface FinalCTAProps {
  finalCTA: FinalCTASection;
}

export function FinalCTA({ finalCTA }: FinalCTAProps) {
  // Use config banner image or fall back to HVAC default
  const bannerImage = finalCTA.bannerImage || '/assets/heating-ac-services-banner.png';
  const bannerAlt = finalCTA.heading || 'Services Banner';

  return (
    <SectionContainer
      id="get-started"
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-white"
      innerClassName="gap-8"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-center">
          {/* Banner Image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <Image
                src={bannerImage}
                alt={bannerAlt}
                width={300}
                height={300}
                className="object-contain drop-shadow-2xl"
                priority
              />
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 -z-10 bg-white/10 blur-3xl" aria-hidden="true" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              {finalCTA.heading}
            </h2>
            {finalCTA.subheading && (
              <h3 className="text-xl font-semibold text-white/90 md:text-2xl">
                {finalCTA.subheading}
              </h3>
            )}
            <p className="max-w-3xl text-lg text-white/90 md:text-xl">
              {finalCTA.description}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <CTAButtonLink
            cta={finalCTA.primaryCTA}
            size="lg"
            variant="white"
            className="shadow-xl"
          />
          {finalCTA.secondaryCTA && (
            <CTAButtonLink
              cta={finalCTA.secondaryCTA}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20"
            />
          )}
        </div>
      </div>
    </SectionContainer>
  );
}

export default FinalCTA;
