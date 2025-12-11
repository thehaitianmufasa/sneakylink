import type { ValuePropositionsSection } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';

interface ValuePropsSectionProps {
  valueProps: ValuePropositionsSection;
}

export function ValuePropsSection({ valueProps }: ValuePropsSectionProps) {
  if (!valueProps.differentiators.length) {
    return null;
  }

  return (
    <SectionContainer id="blog" className="bg-light-gray scroll-mt-28" innerClassName="gap-6">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-bold text-dark-gray md:text-4xl">{valueProps.heading}</h2>
        <p className="text-lg text-text">The promises we keep on every service call.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {valueProps.differentiators.map((item) => (
          <div key={item} className="rounded-2xl bg-white p-4 text-text shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

export default ValuePropsSection;
