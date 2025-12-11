'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, MapPin, Navigation, PhoneCall, Sparkles } from 'lucide-react';
import type { ServiceAreas } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { Reveal } from '../ui/reveal';

interface ServiceAreasProps {
  areas: ServiceAreas;
  phoneNumber?: string;
}

export function ServiceAreasSection({ areas, phoneNumber }: ServiceAreasProps) {
  const hasCities = areas.cities.length > 0;
  const hasCounties = areas.counties.length > 0;

  const formattedPhone = phoneNumber?.replace(/[^\d+]/g, '');
  const phoneHref = formattedPhone ? `tel:${formattedPhone}` : undefined;

  const initialCity = hasCities ? areas.cities[0] : '';
  const [selectedCity, setSelectedCity] = useState(initialCity);
  // Reset the selected city when the config-driven list changes so the
  // dropdown always reflects the current client data (e.g. when navigating
  // between verticals without a full reload).
  useEffect(() => {
    const nextCity = hasCities ? areas.cities[0] ?? '' : '';

    setSelectedCity((current) => (current === nextCity ? current : nextCity));
  }, [areas.cities, hasCities]);

  const cityInsights = useMemo(() => {
    const city = selectedCity || 'Metro Atlanta';

    const responseTime = /atlanta|midtown|buckhead/i.test(city)
      ? 'Average arrival: 45 minutes'
      : /alpharetta|roswell|lawrenceville|sandy springs|dunwoody/i.test(city)
        ? 'Average arrival: 50 minutes'
        : 'Average arrival: 55 minutes';

    const corridor = /alpharetta|roswell|sandy springs|dunwoody/i.test(city)
      ? 'GA-400 & Perimeter Corridor'
      : /marietta|smyrna|east point|college park/i.test(city)
        ? 'I-75 & I-285 West Corridor'
        : /decatur|tucker|lawrenceville/i.test(city)
          ? 'Stone Mountain & I-85 East Corridor'
          : 'Downtown & Intown Atlanta';

    const serviceFocus = /midtown|buckhead|virginia highland/i.test(city)
      ? 'High-rise and historic home electrical specialists.'
      : /alpharetta|roswell|sandy springs|dunwoody|lawrenceville/i.test(city)
        ? 'Smart home upgrades, EV charging, and lighting design pros.'
        : /marietta|smyrna|brookhaven/i.test(city)
          ? 'Panel upgrades and surge protection experts.'
          : 'Rapid emergency repairs and safety inspections 24/7.';

    return { city, responseTime, corridor, serviceFocus };
  }, [selectedCity]);

  if (!hasCities && !hasCounties) {
    return null;
  }

  return (
    <SectionContainer
      id="service-areas"
      className="bg-[#f7f8fc] scroll-mt-28"
      innerClassName="gap-12"
    >
      <Reveal className="max-w-2xl text-center">
        <div className="mx-auto flex items-center justify-center gap-3">
          <div className="h-0.5 w-12 bg-accent" aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
            Service Areas
          </span>
          <div className="h-0.5 w-12 bg-accent" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-3xl font-black text-secondary md:text-4xl">
          {areas.heading}
        </h2>
        {areas.description && (
          <p className="mt-3 text-lg text-text">
            {areas.description}
          </p>
        )}
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <Reveal className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/15" aria-hidden="true" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424143.64034724354!2d-84.5513870!3d33.7489924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA!5e0!3m2!1sen!2sus!4v1609459200000!5m2!1sen!2sus"
              width="100%"
              height="340"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Service Areas Map - Metro Atlanta"
              className="relative z-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                  24/7 Dispatch for {cityInsights.city}
                </p>
                <p className="text-sm text-text">
                  Local electricians staged around {cityInsights.corridor}.
                </p>
              </div>
            </div>
            {phoneHref && (
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-primary/90"
              >
                <PhoneCall className="h-4 w-4" />
                Call {phoneNumber}
              </a>
            )}
          </div>
        </Reveal>

        <Reveal className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-secondary">Cities We Serve</h3>
                <p className="text-sm text-text">Choose a city to see how we respond near you.</p>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                60-minute average
              </span>
            </div>

            {areas.cities.length > 1 ? (
              <div className="relative mt-5">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
                <select
                  id="service-areas-city-select"
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-[#f7f8fc] px-12 py-3 text-sm font-medium text-secondary shadow-inner focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                >
                  {areas.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/60"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/70 bg-[#f7f8fc] p-3 text-left shadow-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-dark-gray">{selectedCity}</span>
              </div>
            )}

            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-3 rounded-xl bg-[#f7f8fc] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary/70">Response Time</p>
                  <p className="text-sm font-semibold text-secondary">{cityInsights.responseTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#f7f8fc] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary/70">Nearby Corridor</p>
                  <p className="text-sm font-semibold text-secondary">{cityInsights.corridor}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#f7f8fc] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary/70">Service Focus</p>
                  <p className="text-sm font-semibold text-secondary">{cityInsights.serviceFocus}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-secondary">Counties Covered</h3>
            <div id="service-areas-counties" className="mt-4 flex flex-wrap gap-2">
              {areas.counties.map((county) => (
                <span
                  key={county}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  {county}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}

export default ServiceAreasSection;
