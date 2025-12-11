'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialDays?: number;
  initialHours?: number;
  offer?: string;
}

export function CountdownTimer({
  initialDays = 2,
  initialHours = 5,
  offer = "30% OFF First 3 Months"
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: initialDays,
    hours: initialHours,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate target date (initialDays + initialHours from now)
    const now = new Date().getTime();
    const targetTime = now + (initialDays * 24 * 60 * 60 * 1000) + (initialHours * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = targetTime - currentTime;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Timer expired, restart or show expired message
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [initialDays, initialHours]);

  return (
    <div className="bg-gradient-to-r from-[#f97316] to-[#fb923c] p-5 md:p-6 rounded-xl mb-8 text-white text-center">
      <div className="text-xl md:text-2xl font-bold mb-4">
        {offer}
      </div>
      <div className="flex gap-3 md:gap-5 justify-center">
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold leading-none">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase mt-1 opacity-90">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase mt-1 opacity-90">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase mt-1 opacity-90">Mins</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase mt-1 opacity-90">Secs</span>
        </div>
      </div>
    </div>
  );
}
