import Link from 'next/link';
import Image from 'next/image';
import type { FooterConfig, FooterLink } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { maskPhoneNumber, isDemoSite } from '@backend/lib/utils/mask-phone';

interface SiteFooterProps {
  footer: FooterConfig;
  logoSrc?: string;
  businessName?: string;
  slug?: string;
}

export function SiteFooter({ footer, logoSrc, businessName, slug }: SiteFooterProps) {
  // Use config logo or fall back to NeverMissLead
  const logo = logoSrc || '/assets/NeverMisslead-Transparentlogo.png';
  const logoAlt = businessName ? `${businessName} logo` : 'NeverMissLead logo';

  // Mask phone numbers for demo sites
  const isDemo = isDemoSite(slug);
  const maskedPhone = maskPhoneNumber(footer.contactInfo.phone, isDemo);

  return (
    <footer className="bg-secondary text-white">
      <SectionContainer innerClassName="gap-10" className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            {/* Logo */}
            <div className="mb-4">
              <div className="rounded-lg bg-white p-3 shadow-lg inline-block">
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={160}
                  height={160}
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold">{footer.tagline}</h3>
            <p className="text-sm text-white/80">{footer.contactInfo.address}</p>
            <p className="text-sm text-white/80">Phone: {maskedPhone}</p>
            <p className="text-sm text-white/80">Email: {footer.contactInfo.email}</p>
            <ul className="text-sm text-white/70">
              {footer.contactInfo.credentials.map((cred) => (
                <li key={cred}>• {cred}</li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Quick Links" links={footer.quickLinks} />
          <FooterColumn title="Services" links={footer.servicesLinks} />
          <FooterColumn title="Legal" links={footer.legalLinks} />
        </div>

        <div className="border-t border-white/10 pt-6 text-sm text-white/70">
          {footer.copyright}
        </div>

        <div className="border-t border-white/10 pt-6 text-sm">
          <p className="text-center text-white/70">
            Powered by{' '}
            <a
              href="https://cherysolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              CherySolutions
            </a>
          </p>
        </div>
      </SectionContainer>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  const sorted = [...links].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-white">{title}</h4>
      <ul className="space-y-2 text-sm text-white/80">
        {sorted.map((link) => (
          <li key={link.text}>
            <Link href={link.href} className="transition hover:text-secondary" prefetch={false}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SiteFooter;
