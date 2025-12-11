"use client";

import { useState, useEffect } from 'react';

/**
 * StickyHeaderBanner Component
 *
 * Sticky banner that appears when user scrolls past hero section.
 * Displays value proposition + CTA button.
 * Fully isolated component - can be added/removed without affecting other code.
 */

interface StickyHeaderBannerProps {
  onCtaClick: () => void;
}

export function StickyHeaderBanner({ onCtaClick }: StickyHeaderBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show banner after scrolling past hero section (~400px)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Hook Text - Hidden on mobile, shown on tablet+ */}
          <p className="hidden sm:block text-white font-bold text-sm md:text-base">
            Stop Losing <span className="text-red-400">$8,400/Month</span> in Missed Calls
          </p>

          {/* CTA Button */}
          <button
            onClick={onCtaClick}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:from-red-700 hover:to-orange-700 transition shadow-lg hover:shadow-xl whitespace-nowrap w-full sm:w-auto"
          >
            Get a Free Quote
          </button>
        </div>
      </div>
    </div>
  );
}
