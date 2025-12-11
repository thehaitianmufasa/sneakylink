"use client";

import { Calendar } from 'lucide-react';

/**
 * AnnouncementBar Component
 *
 * Clean, editorial-style announcement banner for homepage.
 * Minimal design with single cohesive message.
 */
export function AnnouncementBar() {
  return (
    <div className="relative w-full">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2 md:py-3 px-3 md:px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm lg:text-base text-gray-100 font-medium text-center leading-tight md:leading-snug">
              Limited November Availability — We onboard 5 contractors per week to ensure quality setup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
