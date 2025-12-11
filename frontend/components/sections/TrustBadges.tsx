'use client';

import type { TrustBadge } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { cn } from '@backend/lib/utils/cn';
import { Reveal } from '../ui/reveal';

interface TrustBadgesProps {
  badges: TrustBadge[];
  variant?: 'white' | 'gradient';
  slug?: string;
}

export function TrustBadges({ badges, variant = 'white', slug }: TrustBadgesProps) {
  if (!badges.length) {
    return null;
  }

  const sorted = [...badges].sort((a, b) => a.order - b.order);
  const isHVAC = slug === 'hvac' || slug === 'nevermisslead';

  // HVAC variant: White cards with gradient circle icons
  if (isHVAC) {
    // HVAC-specific gradient circles
    const hvacGradients = [
      'bg-gradient-to-br from-[#D32F2F] to-[#F57C00]', // Red to orange (Response)
      'bg-gradient-to-br from-[#1976D2] to-[#0D47A1]', // Blue to navy (NATE)
      'bg-gradient-to-br from-[#F57C00] to-[#D32F2F]', // Orange to red (Years)
      'bg-gradient-to-br from-[#0D47A1] to-[#1976D2]', // Navy to blue (Guaranteed)
    ];

    return (
      <SectionContainer
        id="trust"
        className="bg-gray-50 border-b py-12"
        innerClassName="gap-0"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {sorted.map((badge, index) => (
            <Reveal
              as="div"
              key={badge.text}
              delay={index * 80}
              className="group rounded-xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 flex justify-center">
                <div className={cn(
                  "inline-flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110",
                  hvacGradients[index] || hvacGradients[0]
                )}>
                  <span className="text-2xl text-white" aria-hidden="true">
                    {badge.icon}
                  </span>
                </div>
              </div>
              <div className="text-sm font-bold text-gray-900">{badge.text}</div>
            </Reveal>
          ))}
        </div>
      </SectionContainer>
    );
  }

  // White variant: Simple white cards with emoji icons (Electrical)
  if (variant === 'white') {
    return (
      <SectionContainer
        id="trust"
        className="bg-[#f7f8fc] pb-12"
        innerClassName="gap-6"
      >
        <Reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((badge, index) => (
            <Reveal
              as="div"
              key={badge.text}
              delay={index * 80}
              className="group rounded-2xl border border-white/70 bg-white/90 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-4xl text-secondary transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                  {badge.icon}
                </span>
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                  {badge.text}
                </p>
              </div>
            </Reveal>
          ))}
        </Reveal>
      </SectionContainer>
    );
  }

  // Gradient variant: Premium gradient cards with frosted glass effect (Plumbing)
  // Badge-specific gradients for plumbing theme
  const badgeGradients = [
    'bg-gradient-to-br from-[#0066CC] to-[#00A8E8]', // Blue to accent (Clock)
    'bg-gradient-to-br from-[#003D7A] to-[#0066CC]', // Navy to blue (Shield)
    'bg-gradient-to-br from-[#00A8E8] to-[#0066CC]', // Accent to blue (Star)
    'bg-gradient-to-br from-green-500 to-green-600', // Green (Check)
  ];

  return (
    <SectionContainer id="trust" className="bg-white py-12">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {sorted.map((badge, index) => (
          <Reveal
            as="div"
            key={badge.text}
            delay={index * 80}
            className={cn(
              "group relative rounded-2xl p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
              badgeGradients[index] || badgeGradients[0]
            )}
          >
            {/* Frosted glass icon container */}
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                <span className="text-3xl text-white" aria-hidden="true">
                  {badge.icon}
                </span>
              </div>
            </div>

            {/* Badge text */}
            <div className="text-white">
              <div className="text-lg font-bold">{badge.text.split(' ')[0]}</div>
              <div className="text-sm text-white/80">{badge.text.split(' ').slice(1).join(' ')}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}

export default TrustBadges;
