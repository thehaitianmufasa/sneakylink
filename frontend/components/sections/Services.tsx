'use client';

import type { Service, ServicesSection } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { getIconByName } from './icon-map';
import { ArrowRight } from 'lucide-react';
import { cn } from '@backend/lib/utils/cn';
import { Reveal } from '../ui/reveal';

interface ServicesProps {
  services: Service[];
  servicesSection?: ServicesSection;
  slug?: string;
}

export function Services({ services, servicesSection, slug }: ServicesProps) {
  if (!services.length) {
    return null;
  }

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const sorted = [...services].sort((a, b) => a.order - b.order);
  const isHVAC = slug === 'hvac' || slug === 'nevermisslead';
  const isPlumbing = slug === 'plumbing';

  // HVAC shows 6 cards, others show 3
  const displayedServices = isHVAC ? sorted.slice(0, 6) : sorted.slice(0, 3);

  // Default values for HVAC if not specified
  const heading = servicesSection?.heading || 'Emergency & Routine HVAC Services';
  const description =
    servicesSection?.description ||
    'From midnight emergencies to planned upgrades, NeverMissLead HVAC keeps Atlanta comfortable year-round.';

  const headingLines = heading
    .split(/\s*\|\s*|\s*\\n\s*/g)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <SectionContainer id="services" className="bg-white scroll-mt-28 pt-8" innerClassName="gap-12">
      <Reveal className="space-y-4 text-center">
        {/* Orange decorative line with "OUR SERVICES" */}
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-accent" />
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            OUR SERVICES
          </span>
          <div className="h-px w-16 bg-accent" />
        </div>

        <h2 className="text-4xl font-black text-gray-900 md:text-5xl leading-tight">
          {headingLines.length > 0
            ? headingLines.map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  {line}
                </span>
              ))
            : heading}
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">{description}</p>
      </Reveal>

      <Reveal className={`grid gap-8 ${isHVAC ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3'}`}>
        {displayedServices.map((service, index) => {
          const Icon = getIconByName(service.icon);
          const slug = toSlug(service.title);

          // HVAC-specific hover colors based on card position
          const hvacCardColors = isHVAC ? [
            'hover:border-[#1976D2]', // Card 1 - Blue (AC)
            'hover:border-[#D32F2F]', // Card 2 - Red (Heating)
            'hover:border-[#1976D2]', // Card 3 - Blue (AC Install)
            'hover:border-[#D32F2F]', // Card 4 - Red (Heating Install)
            'hover:border-[#F57C00]', // Card 5 - Orange (Maintenance)
            'hover:border-[#0D47A1]', // Card 6 - Navy (Air Quality)
          ] : [];

          return (
            <Reveal
              as="div"
              key={service.title}
              id={`service-${slug}`}
              delay={index * 80}
              className={cn(
                "service-card group relative rounded-xl border-2 border-gray-100 bg-white p-8 transition-all duration-300 hover:shadow-xl",
                isHVAC && hvacCardColors[index],
                isPlumbing && "hover:border-[#0066CC]",
                !isHVAC && !isPlumbing && service.featured && "border-primary/40 shadow-lg"
              )}
            >
              {/* Icon with dynamic background */}
              <div className={cn(
                "mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg transition-all duration-300",
                isHVAC && index === 0 && "bg-gradient-to-br from-[#1976D2] to-[#0D47A1] group-hover:scale-110",
                isHVAC && index === 1 && "bg-gradient-to-br from-[#D32F2F] to-[#F57C00] group-hover:scale-110",
                isHVAC && index === 2 && "bg-gradient-to-br from-[#1976D2]/20 to-[#0D47A1]/20 border-2 border-[#1976D2] group-hover:bg-gradient-to-br group-hover:from-[#1976D2] group-hover:to-[#0D47A1]",
                isHVAC && index === 3 && "bg-gradient-to-br from-[#D32F2F]/20 to-[#F57C00]/20 border-2 border-[#D32F2F] group-hover:bg-gradient-to-br group-hover:from-[#D32F2F] group-hover:to-[#F57C00]",
                isHVAC && index === 4 && "bg-gradient-to-br from-[#F57C00]/20 to-[#D32F2F]/20 border-2 border-[#F57C00] group-hover:bg-gradient-to-br group-hover:from-[#F57C00] group-hover:to-[#D32F2F]",
                isHVAC && index === 5 && "bg-gradient-to-br from-[#0D47A1]/20 to-[#1976D2]/20 border-2 border-[#0D47A1] group-hover:bg-gradient-to-br group-hover:from-[#0D47A1] group-hover:to-[#1976D2]",
                isPlumbing && "bg-[#0066CC]/10",
                !isHVAC && !isPlumbing && "bg-primary/10 p-4 group-hover:bg-primary/20"
              )}>
                <Icon className={cn(
                  "h-8 w-8 transition-colors",
                  isHVAC && (index === 0 || index === 1) && "text-white",
                  isHVAC && index === 2 && "text-[#1976D2] group-hover:text-white",
                  isHVAC && index === 3 && "text-[#D32F2F] group-hover:text-white",
                  isHVAC && index === 4 && "text-[#F57C00] group-hover:text-white",
                  isHVAC && index === 5 && "text-[#0D47A1] group-hover:text-white",
                  isPlumbing && "text-[#0066CC]",
                  !isHVAC && !isPlumbing && "text-primary"
                )}
                fill={isPlumbing ? "currentColor" : "none"}
                strokeWidth={isPlumbing ? 0 : undefined}
                aria-hidden />
              </div>

              {/* Service title */}
              <h3 className={cn(
                "mb-3 text-2xl font-bold",
                isPlumbing ? "text-[#003D7A]" : "text-gray-900"
              )}>
                {service.title}
              </h3>

              {/* Service description */}
              <p className="mb-4 text-gray-600 leading-relaxed">
                {service.description}
              </p>

              {/* Learn more link with arrow */}
              <a
                href={`#service-${slug}`}
                className={cn(
                  "inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3",
                  isHVAC && index === 0 && "text-[#1976D2] hover:text-[#0D47A1]",
                  isHVAC && index === 1 && "text-[#D32F2F] hover:text-[#F57C00]",
                  isHVAC && index === 2 && "text-[#1976D2] hover:text-[#0D47A1]",
                  isHVAC && index === 3 && "text-[#D32F2F] hover:text-[#F57C00]",
                  isHVAC && index === 4 && "text-[#F57C00] hover:text-[#D32F2F]",
                  isHVAC && index === 5 && "text-[#0D47A1] hover:text-[#1976D2]",
                  isPlumbing && "text-[#0066CC] hover:text-[#00A8E8]",
                  !isHVAC && !isPlumbing && "text-primary hover:text-primary/80"
                )}
              >
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          );
        })}
      </Reveal>
    </SectionContainer>
  );
}

export default Services;
