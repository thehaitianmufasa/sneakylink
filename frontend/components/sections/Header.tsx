'use client';

import { useState, useEffect, type FocusEvent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Phone, ChevronDown } from 'lucide-react';
import { Logo } from '../ui/logo';
import { Button } from '../ui/button';
import type {
  BusinessInfo,
  CTACopy,
  Service,
  ServiceAreas,
  FooterLink,
} from '@shared/types/client-config';
import { maskPhoneNumber, isDemoSite } from '@backend/lib/utils/mask-phone';

interface HeaderProps {
  businessInfo: BusinessInfo;
  ctaCopy: CTACopy;
  logo?: {
    text: string;
    tagline?: string;
    image?: {
      src: string;
      alt?: string;
      priority?: boolean;
    };
  };
  services?: Service[];
  serviceAreas?: ServiceAreas;
  servicesLinks?: FooterLink[];
  slug?: string;
}

export function Header({
  businessInfo,
  ctaCopy,
  logo,
  services = [],
  serviceAreas,
  servicesLinks = [],
  slug,
}: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Check if we're on a demo page (not the homepage)
  const isOnDemoPage = pathname !== '/';

  // Mask phone numbers for demo sites
  const isDemo = isDemoSite(slug);
  const maskedPhone = maskPhoneNumber(businessInfo.contact.primaryPhone, isDemo);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const serviceMenuItems =
    servicesLinks.length > 0
      ? servicesLinks
          .sort((a, b) => a.order - b.order)
          .map((link) => ({ label: link.text, href: link.href }))
      : services.length > 0
        ? [
            { label: 'All Services', href: '#services' },
            ...services.map((service) => ({
              label: service.title,
              href: `#service-${slugify(service.title)}`,
            })),
          ]
        : [{ label: 'All Services', href: '#services' }];

  const serviceAreaMenuItems = serviceAreas
    ? [
        { label: serviceAreas.heading, href: '#service-areas' },
        ...serviceAreas.cities.slice(0, 5).map((city) => ({
          label: city,
          href: '#service-areas',
        })),
        { label: 'Counties Covered', href: '#service-areas' },
      ]
    : [{ label: 'Service Areas Overview', href: '#service-areas' }];

  const closeMenus = () => setOpenMenu(null);

  const renderDropdown = (
    label: string,
    menuKey: string,
    items: { label: string; href: string }[]
  ) => {
    const isOpen = openMenu === menuKey;
    const menuId = `${menuKey}-menu`;

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        closeMenus();
      }
    };

    return (
      <div
        className="relative"
        onMouseEnter={() => setOpenMenu(menuKey)}
        onMouseLeave={closeMenus}
        onFocus={() => setOpenMenu(menuKey)}
        onBlur={handleBlur}
      >
        <button
          type="button"
          onClick={() => setOpenMenu(isOpen ? null : menuKey)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-dark-gray transition-colors hover:text-primary"
          aria-expanded={isOpen}
          aria-controls={menuId}
        >
          {label}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        <div
          id={menuId}
          role="menu"
          className={`absolute left-0 top-full z-40 w-56 pt-2 transition-opacity ${
            isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="rounded-lg border border-slate-100 bg-white py-2 shadow-lg">
            {items.map((item) => (
              <a
                key={`${menuKey}-${item.label}`}
                href={item.href}
                role="menuitem"
                className="block px-4 py-2 text-sm text-dark-gray transition-colors hover:bg-primary/5 hover:text-primary"
                onClick={closeMenus}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-4">
        {/* Logo */}
        <a href={isOnDemoPage ? "#hero" : "/"} className="transition-opacity hover:opacity-80">
          <Logo
            text={logo?.text || 'NeverMissLead'}
            tagline={logo?.tagline}
            size="lg"
            imageSrc={logo?.image?.src}
            imageAlt={logo?.image?.alt || `${logo?.text ?? 'NeverMissLead'} logo`}
            imagePriority={logo?.image?.priority ?? true}
            variant="plain"
          />
        </a>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {/* View All Demos Link (only on demo pages) */}
          {isOnDemoPage && (
            <>
              {/* Mobile: Compact back button */}
              <Link
                href="/"
                className="md:hidden inline-flex items-center gap-1 text-sm font-semibold text-dark-gray hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
                aria-label="Back to all demos"
              >
                <span className="text-lg">←</span>
                <span>Home</span>
              </Link>
              {/* Desktop: Full text */}
              <Link
                href="/"
                className="hidden md:block text-sm font-semibold text-dark-gray hover:text-primary transition-colors"
              >
                ← View All Demos
              </Link>
            </>
          )}
          {/* Phone Number */}
          <a
            href={`tel:${businessInfo.contact.primaryPhone.replace(/[^\d+]/g, '')}`}
            className="hidden items-center gap-2 text-lg font-bold text-dark-gray transition-colors hover:text-primary lg:flex"
          >
            <Phone size={20} className="text-primary" />
            <span>{maskedPhone}</span>
          </a>

          {/* Get Free Quote Button */}
          <Button
            variant="gradient"
            size="lg"
            className="font-bold hidden sm:inline-flex"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openQuoteModal'));
            }}
          >
            Get Free Quote
          </Button>

          {/* Mobile: Compact Quote Button */}
          <Button
            variant="gradient"
            size="sm"
            className="font-bold sm:hidden"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openQuoteModal'));
            }}
          >
            Quote
          </Button>

          {/* Mobile Phone Icon */}
          <a
            href={`tel:${businessInfo.contact.primaryPhone.replace(/[^\d+]/g, '')}`}
            className="lg:hidden"
          >
            <Button variant="primary" size="sm" className="flex items-center">
              <Phone size={18} />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
