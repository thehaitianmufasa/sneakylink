"use client";

import Image from 'next/image';

/**
 * TechPartners Component
 *
 * Displays trusted technology partner logos in grayscale.
 * Fully isolated component - can be added/removed without affecting other code.
 */

export function TechPartners() {
  const partners = [
    {
      name: "Twilio",
      logo: "/partners/twilio.svg",
      width: 120,
      height: 40,
    },
    {
      name: "Google",
      logo: "/partners/google.svg",
      width: 100,
      height: 40,
    },
    {
      name: "Stripe",
      logo: "/partners/stripe.svg",
      width: 120,
      height: 40,
    },
  ];

  return (
    <section className="py-12 px-4 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm font-medium text-gray-500 mb-8 uppercase tracking-wider">
          Powered by Industry-Leading Technology
        </p>

        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={partner.width}
                height={partner.height}
                className="h-8 md:h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
