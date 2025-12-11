'use client';

import type { SocialProofSection, Testimonial } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { Star } from 'lucide-react';
import { Reveal } from '../ui/reveal';
import Image from 'next/image';

interface SocialProofProps {
  socialProof: SocialProofSection;
}

// Helper to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Star rating component
function StarRating({ rating = 5 }: { rating?: number }) {
  const filledStars = Math.round(rating);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= filledStars ? 'fill-accent text-accent' : 'fill-gray-200 text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

// Testimonial Card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = getInitials(testimonial.author);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-[#f5f7ff] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <StarRating rating={testimonial.rating || 5} />
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
          Verified Client
        </span>
      </div>

      {/* Quote */}
      <p className="mb-6 text-lg leading-relaxed text-dark-gray">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        {/* Avatar - Photo or Initials */}
        {testimonial.image ? (
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={`${testimonial.author} - ${testimonial.location}`}
              width={64}
              height={64}
              className="rounded-full object-cover shadow-md"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-md">
            {initials}
          </div>
        )}

        {/* Name & Location */}
        <div>
          <div className="font-semibold text-secondary">{testimonial.author}</div>
          <div className="text-sm text-text">{testimonial.location}</div>
        </div>
      </div>
    </div>
  );
}

export function SocialProof({ socialProof }: SocialProofProps) {
  const sortedTestimonials = [...socialProof.testimonials].sort((a, b) => a.order - b.order);
  const parsedRating = Number.parseFloat(socialProof.stats.rating.split('/')[0]);
  const ratingNumber = Number.isFinite(parsedRating) ? parsedRating : 5;
  const highlightText =
    socialProof.subheading || `${socialProof.stats.rating} • ${socialProof.stats.totalReviews}`;

  return (
    <SectionContainer
      id="testimonials"
      className="bg-white scroll-mt-28"
      innerClassName="gap-12"
    >
      {/* Section Header */}
      <Reveal className="space-y-6 text-center">
        {socialProof.eyebrow && (
          <div className="flex items-center justify-center gap-3">
            <div className="h-0.5 w-12 bg-accent" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
              {socialProof.eyebrow}
            </span>
            <div className="h-0.5 w-12 bg-accent" aria-hidden="true" />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-secondary md:text-4xl">
            {socialProof.heading}
          </h2>
          <p className="text-lg font-medium text-text">{highlightText}</p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-4 rounded-full bg-[#f7f8fc] px-6 py-3 shadow-md">
            <StarRating rating={ratingNumber} />
            <span className="text-sm font-semibold uppercase tracking-wide text-secondary">
              {socialProof.stats.rating} • {socialProof.stats.totalReviews}
            </span>
          </div>
        </div>
      </Reveal>

      {/* Testimonial Cards Grid */}
      <Reveal className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sortedTestimonials.map((testimonial, index) => (
          <Reveal as="div" key={index} delay={index * 100} className="h-full">
            <TestimonialCard testimonial={testimonial} />
          </Reveal>
        ))}
      </Reveal>
    </SectionContainer>
  );
}

export default SocialProof;
