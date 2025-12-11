import type { SpecialOffer } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { Card } from '../ui/card';

interface SpecialOffersProps {
  offers?: SpecialOffer[];
  heading?: string;
  description?: string;
  industry?: string;
}

export function SpecialOffers({ offers, heading, description, industry }: SpecialOffersProps) {
  const enabledOffers = (offers ?? []).filter((offer) => offer.enabled);

  if (!enabledOffers.length) {
    return null;
  }

  const sorted = enabledOffers.sort((a, b) => a.order - b.order);

  // Default to HVAC if not specified
  const defaultHeading = heading || `Limited-Time ${industry || 'HVAC'} Specials`;
  const defaultDescription = description || 'Save on diagnostics, tune-ups, and seasonal repairs.';

  return (
    <SectionContainer id="offers" className="bg-white" innerClassName="gap-8">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-bold text-dark-gray md:text-4xl">{defaultHeading}</h2>
        <p className="text-lg text-text">{defaultDescription}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {sorted.map((offer) => (
          <Card key={offer.title} className="border-secondary/40 bg-secondary/5">
            <Card.Body className="space-y-4">
              <div className="text-2xl" aria-hidden>{offer.icon ?? '🎉'}</div>
              <h3 className="text-xl font-semibold text-dark-gray">{offer.title}</h3>
              <p className="text-text">{offer.description}</p>
              {offer.disclaimer && (
                <p className="text-xs text-text/70">{offer.disclaimer}</p>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}

export default SpecialOffers;
