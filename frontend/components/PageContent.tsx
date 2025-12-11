'use client';

import { PageWrapper, useModal } from './PageWrapper';
import { ColorProvider } from './ColorProvider';
import { QuoteModal } from './forms/QuoteModal';
import Header from './sections/Header';
import Hero from './sections/Hero';
import TrustBadges from './sections/TrustBadges';
import About from './sections/About';
import Services from './sections/Services';
import SocialProof from './sections/SocialProof';
import FAQ from './sections/FAQ';
import ServiceAreasSection from './sections/ServiceAreas';
import SocialMedia from './sections/SocialMedia';
import CTABanner from './sections/CTABanner';
import FinalCTA from './sections/FinalCTA';
import SiteFooter from './sections/SiteFooter';
import type { ClientConfig } from '@shared/types/client-config';

function PageContentInner({ config }: { config: ClientConfig }) {
  const { isQuoteModalOpen, closeQuoteModal } = useModal();

  // Determine badge variant based on slug
  // HVAC and electrical use white cards, plumbing uses gradient backgrounds
  const badgeVariant = (config.slug === 'electrical' || config.slug === 'hvac' || config.slug === 'nevermisslead') ? 'white' : 'gradient';

  return (
    <>
      <Header
        businessInfo={config.businessInfo}
        ctaCopy={config.ctaCopy}
        logo={config.branding.logo}
        services={config.services}
        serviceAreas={config.serviceAreas}
        servicesLinks={config.footer.servicesLinks}
        slug={config.slug}
      />
      <div className="pt-20">
        <Hero
          hero={config.hero}
          businessInfo={config.businessInfo}
          ctaCopy={config.ctaCopy}
          logoSrc={config.branding?.logo?.image?.src}
          slug={config.slug}
        />
        <TrustBadges badges={config.trustBadges} variant={badgeVariant} slug={config.slug} />
        <Services services={config.services} servicesSection={config.servicesSection} slug={config.slug} />
        <About about={config.about} businessInfo={config.businessInfo} slug={config.slug} />
        <SocialProof socialProof={config.socialProof} />
        <FAQ faq={config.faq} />
        <ServiceAreasSection
          areas={config.serviceAreas}
          phoneNumber={config.businessInfo.contact.primaryPhone}
        />
        {config.socialMedia && config.socialMedia.links && config.socialMedia.links.length > 0 && (
          <div className="bg-white py-16 px-4">
            <div className="container mx-auto">
              <SocialMedia
                heading={config.socialMedia.heading}
                subheading={config.socialMedia.subheading}
                links={config.socialMedia.links}
                images={config.socialMedia.images}
                slug={config.slug}
              />
            </div>
          </div>
        )}
        {config.ctaBanner && (
          <CTABanner
            heading={config.ctaBanner.heading}
            subheading={config.ctaBanner.subheading}
            primaryCTA={{
              text: config.ctaBanner.primaryCTA.text,
              href: `tel:${config.businessInfo.contact.primaryPhone.replace(/[^\d+]/g, '')}`,
            }}
            secondaryCTA={{
              text: config.ctaBanner.secondaryCTA.text,
              onClick: () => window.dispatchEvent(new CustomEvent('openQuoteModal')),
            }}
            slug={config.slug}
          />
        )}
        {!config.features?.hideFinalCTA && config.finalCTA && (
          <FinalCTA finalCTA={config.finalCTA} />
        )}
        {!config.features?.hideFooter && (
          <SiteFooter
            footer={config.footer}
            logoSrc={config.branding?.logo?.image?.src}
            businessName={config.businessInfo.businessName}
            slug={config.slug}
          />
        )}
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        businessName={config.businessInfo.businessName}
        logoSrc={config.branding?.logo?.image?.src}
      />
    </>
  );
}

export function PageContent({ config }: { config: ClientConfig }) {
  return (
    <ColorProvider colors={config.branding.colors}>
      <PageWrapper>
        <PageContentInner config={config} />
      </PageWrapper>
    </ColorProvider>
  );
}

export default PageContent;
