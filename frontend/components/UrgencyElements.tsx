"use client";

import { useState, useEffect } from 'react';
import { TrendingDown, Users, Clock } from 'lucide-react';
import { getBrowserClient } from '@backend/lib/supabase/client';

// Session storage keys
const LOSS_COUNTER_HIDDEN_KEY = 'nevermisslead_loss_counter_hidden';
const LOSS_COUNTER_START_TIME_KEY = 'nevermisslead_loss_counter_start';

export function UrgencyElements() {
  // Loss Counter state (Red Banner - Client-side only)
  const [lossAmount, setLossAmount] = useState(0);
  const [showLossCounter, setShowLossCounter] = useState(true);

  // Capacity Indicator state (Purple Banner - Supabase-driven)
  const [spotsLeft, setSpotsLeft] = useState(4);
  const [showCapacityIndicator, setShowCapacityIndicator] = useState(true);
  const [isFull, setIsFull] = useState(false);

  // ========================================================================
  // LOSS COUNTER LOGIC (Red Banner)
  // ========================================================================
  useEffect(() => {
    // Check if loss counter was already hidden this session
    if (typeof window !== 'undefined') {
      const wasHidden = sessionStorage.getItem(LOSS_COUNTER_HIDDEN_KEY);
      if (wasHidden === 'true') {
        setShowLossCounter(false);
        setShowCapacityIndicator(false); // Hide purple banner too
        return;
      }

      // Get or set start time
      let startTime = sessionStorage.getItem(LOSS_COUNTER_START_TIME_KEY);
      if (!startTime) {
        startTime = Date.now().toString();
        sessionStorage.setItem(LOSS_COUNTER_START_TIME_KEY, startTime);
      }

      // Calculate loss at $0.07778 per second
      const updateLoss = () => {
        const now = Date.now();
        const elapsedSeconds = (now - parseInt(startTime!)) / 1000;
        const currentLoss = elapsedSeconds * 0.07778;
        setLossAmount(currentLoss);

        // Auto-hide BOTH banners after 45 seconds
        if (elapsedSeconds >= 45) {
          setShowLossCounter(false);
          setShowCapacityIndicator(false); // Hide purple banner too
          sessionStorage.setItem(LOSS_COUNTER_HIDDEN_KEY, 'true');
        }
      };

      // Update every 100ms for smooth animation
      const lossInterval = setInterval(updateLoss, 100);
      updateLoss(); // Initial update

      return () => clearInterval(lossInterval);
    }
  }, []);

  // Listen for calculator CTA click to hide BOTH banners immediately
  useEffect(() => {
    const handleCalculatorOpen = () => {
      setShowLossCounter(false);
      setShowCapacityIndicator(false); // Hide purple banner too
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(LOSS_COUNTER_HIDDEN_KEY, 'true');
      }
    };

    window.addEventListener('openCalculatorModal', handleCalculatorOpen);
    return () => window.removeEventListener('openCalculatorModal', handleCalculatorOpen);
  }, []);

  // ========================================================================
  // CAPACITY INDICATOR LOGIC (Purple Banner)
  // ========================================================================
  useEffect(() => {
    // Check if banners were already hidden this session (check FIRST before other logic)
    if (typeof window !== 'undefined') {
      const wasHidden = sessionStorage.getItem(LOSS_COUNTER_HIDDEN_KEY);
      if (wasHidden === 'true') {
        setShowCapacityIndicator(false);
        return; // Don't run any other logic if already hidden
      }
    }

    // Check if we should hide based on day/time (Friday 5pm EST to Monday 12:01am EST)
    const checkWeekendHide = () => {
      // Check session storage again in case it changed
      if (typeof window !== 'undefined') {
        const wasHidden = sessionStorage.getItem(LOSS_COUNTER_HIDDEN_KEY);
        if (wasHidden === 'true') {
          setShowCapacityIndicator(false);
          return;
        }
      }

      const now = new Date();

      // Convert to EST (UTC-5 or UTC-4 during DST)
      const estOffset = -5; // Standard time offset
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const estTime = new Date(utc + (3600000 * estOffset));

      const day = estTime.getDay(); // 0 = Sunday, 5 = Friday
      const hour = estTime.getHours();

      // Hide from Friday 5pm (day=5, hour>=17) until Monday 12:01am (day=1, hour=0, minute>=1)
      if (day === 5 && hour >= 17) {
        setShowCapacityIndicator(false);
        return;
      }
      if (day === 6 || day === 0) { // Saturday or Sunday
        setShowCapacityIndicator(false);
        return;
      }
      if (day === 1 && hour === 0 && estTime.getMinutes() < 1) {
        setShowCapacityIndicator(false);
        return;
      }

      setShowCapacityIndicator(true);
    };

    checkWeekendHide();

    // Check every minute for time-based visibility
    const timeCheckInterval = setInterval(checkWeekendHide, 60000);

    // Get Supabase client (singleton)
    const supabase = getBrowserClient();

    // Early return if Supabase not configured
    if (!supabase) {
      console.warn('[UrgencyElements] Supabase not configured, using fallback capacity');
      return () => clearInterval(timeCheckInterval);
    }

    // Fetch current capacity from Supabase
    const fetchCapacity = async () => {
      try {
        const { data, error } = await supabase.rpc('get_current_week_capacity');

        if (error) {
          console.error('[UrgencyElements] Error fetching capacity:', error);
          // Fallback to day-based calculation
          const now = new Date();
          const dayOfWeek = now.getDay();
          const calculatedSpots = Math.max(1, 7 - dayOfWeek);
          setSpotsLeft(calculatedSpots);
          return;
        }

        if (data && data.length > 0) {
          const capacityData = data[0];
          setSpotsLeft(capacityData.remaining_spots);
          setIsFull(capacityData.is_full);
        }
      } catch (err) {
        console.error('[UrgencyElements] Exception fetching capacity:', err);
        // Fallback
        const now = new Date();
        const dayOfWeek = now.getDay();
        const calculatedSpots = Math.max(1, 7 - dayOfWeek);
        setSpotsLeft(calculatedSpots);
      }
    };

    fetchCapacity();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('onboarding_capacity_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_capacity'
        },
        (payload) => {
          console.log('[UrgencyElements] Capacity updated:', payload);
          fetchCapacity();
        }
      )
      .subscribe();

    return () => {
      clearInterval(timeCheckInterval);
      supabase.removeChannel(channel);
    };
  }, []); // Empty deps - supabase is now initialized inside useEffect

  // Don't render anything if both banners are hidden
  if (!showLossCounter && !showCapacityIndicator) {
    return null;
  }

  return (
    <div className="sticky top-16 md:top-24 z-40 py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-2 md:gap-4">
          {/* Loss Counter (Red Banner) - Client-side only */}
          {showLossCounter && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-3 md:p-4 shadow-lg animate-in fade-in duration-300">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 flex-shrink-0">
                  <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold opacity-90 mb-0.5 md:mb-1">
                    Limited Availability This Month
                  </p>
                  <p className="text-sm md:text-lg lg:text-xl font-black truncate">
                    We onboard 5 contractors per week to ensure quality setup
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Capacity Indicator (Purple Banner) - Supabase-driven */}
          {showCapacityIndicator && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl p-3 md:p-4 shadow-lg animate-in fade-in duration-300">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 flex-shrink-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold opacity-90 mb-0.5 md:mb-1">
                    Dedicated Onboarding Capacity
                  </p>
                  {isFull ? (
                    <p className="text-sm md:text-lg lg:text-xl font-black">
                      We are currently full. Next availability is <span className="text-yellow-300">Monday</span>.
                    </p>
                  ) : (
                    <p className="text-sm md:text-lg lg:text-xl font-black">
                      <span className="text-yellow-300">{spotsLeft} spots remaining</span> — secure your 24-hour launch
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LossCounterInline() {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // $900 per hour = $15 per minute = $0.25 per second
  const lossAmount = Math.floor(timeElapsed * 0.25);

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="bg-red-100 rounded-full p-3">
          <Clock className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-2">
            In the time you&apos;ve spent reading...
          </h4>
          <p className="text-lg text-gray-700">
            Your competitor just captured{' '}
            <span className="font-black text-red-600 text-2xl">
              ${lossAmount}
            </span>{' '}
            in leads you could have had.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Every minute you wait, you&apos;re leaving money on the table.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CapacityIndicatorBadge() {
  const [spotsLeft, setSpotsLeft] = useState(4);

  useEffect(() => {
    // Get Supabase client (singleton)
    const supabase = getBrowserClient();

    // Early return if Supabase not configured
    if (!supabase) {
      console.warn('[CapacityBadge] Supabase not configured, using fallback');
      return;
    }

    const fetchCapacity = async () => {
      try {
        const { data, error } = await supabase.rpc('get_current_week_capacity');

        if (error) {
          console.error('[CapacityBadge] Error fetching capacity:', error);
          const now = new Date();
          const dayOfWeek = now.getDay();
          const calculatedSpots = Math.max(1, 7 - dayOfWeek);
          setSpotsLeft(calculatedSpots);
          return;
        }

        if (data && data.length > 0) {
          setSpotsLeft(data[0].remaining_spots);
        }
      } catch (err) {
        console.error('[CapacityBadge] Exception:', err);
        const now = new Date();
        const dayOfWeek = now.getDay();
        const calculatedSpots = Math.max(1, 7 - dayOfWeek);
        setSpotsLeft(calculatedSpots);
      }
    };

    fetchCapacity();

    const channel = supabase
      .channel('capacity_badge_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_capacity'
        },
        () => fetchCapacity()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty deps - supabase is now initialized inside useEffect

  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300 rounded-full px-4 py-2">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-bold text-gray-900">
        We onboard 5 contractors per week to ensure quality setup • <span className="text-red-600">{spotsLeft} spots remaining</span>
      </span>
    </div>
  );
}
