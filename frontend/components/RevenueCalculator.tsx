"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RevenueCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'modal' | 'inline';
}

export function RevenueCalculator({ isOpen, onClose, variant = 'modal' }: RevenueCalculatorProps) {
  // Default values to show $8,400 loss immediately
  const [callsPerWeek, setCallsPerWeek] = useState(38);
  const [missedCallPercent, setMissedCallPercent] = useState(47);
  const [avgTicketValue, setAvgTicketValue] = useState(300);

  // Calculated values
  const [monthlyLoss, setMonthlyLoss] = useState(0);
  const [annualLoss, setAnnualLoss] = useState(0);

  // Calculate losses whenever inputs change
  useEffect(() => {
    const missedCallsPerWeek = (callsPerWeek * missedCallPercent) / 100;
    const missedCallsPerMonth = missedCallsPerWeek * 4.33; // Average weeks per month
    const monthlyRevenueLoss = missedCallsPerMonth * avgTicketValue;
    const annualRevenueLoss = monthlyRevenueLoss * 12;

    setMonthlyLoss(Math.round(monthlyRevenueLoss));
    setAnnualLoss(Math.round(annualRevenueLoss));
  }, [callsPerWeek, missedCallPercent, avgTicketValue]);

  const handleGetSetupCall = () => {
    // Dispatch event to open the quote modal
    window.dispatchEvent(new CustomEvent('openQuoteModal'));
    onClose();
  };

  const content = (
    <div className="bg-white rounded-2xl shadow-2xl max-w-md md:max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-4 md:px-6 md:py-6 rounded-t-2xl relative">
        {variant === 'modal' && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:bg-white/20 rounded-full p-2 transition z-10"
            aria-label="Close calculator"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 pr-10">Calculate Your Exact Monthly Loss</h2>
        <p className="text-sm md:text-base text-purple-100">See how much revenue you&apos;re losing from missed calls</p>
      </div>

      {/* Calculator Body */}
      <div className="px-4 py-6 md:px-6 md:py-8 lg:px-8">
        {/* Average Calls Per Week */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-3">
            How many calls do you receive per week?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="100"
              value={callsPerWeek}
              onChange={(e) => setCallsPerWeek(Number(e.target.value))}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-lg min-w-[70px] text-center">
              {callsPerWeek}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10 calls</span>
            <span>100 calls</span>
          </div>
        </div>

        {/* Missed Call Percentage */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-3">
            What percentage of calls do you miss?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              max="100"
              value={missedCallPercent}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setMissedCallPercent(0);
                } else {
                  setMissedCallPercent(Math.min(100, Math.max(0, Number(value))));
                }
              }}
              onFocus={(e) => e.target.select()}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-semibold text-lg"
              placeholder="47"
            />
            <span className="text-gray-600 font-semibold">%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Industry average: <span className="font-semibold text-purple-600">47%</span>
          </p>
        </div>

        {/* Average Ticket Value */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-3">
            What&apos;s your average job value?
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-700">$</span>
            <input
              type="number"
              min="0"
              step="50"
              value={avgTicketValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setAvgTicketValue(0);
                } else {
                  setAvgTicketValue(Math.max(0, Number(value)));
                }
              }}
              onFocus={(e) => e.target.select()}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-semibold text-lg"
              placeholder="300"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Typical range: $200 - $500 per service call
          </p>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-8">
          <div className="text-center mb-4">
            <p className="text-gray-600 font-semibold mb-2">Your Monthly Lost Revenue:</p>
            <p className="text-5xl md:text-6xl font-black text-red-600">
              ${monthlyLoss.toLocaleString()}
            </p>
          </div>

          <div className="text-center mb-6 pb-6 border-b border-red-200">
            <p className="text-gray-600 font-semibold mb-2">Your Annual Lost Revenue:</p>
            <p className="text-3xl md:text-4xl font-bold text-red-500">
              ${annualLoss.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm">
            <p className="text-center text-lg font-bold text-gray-900 mb-2">
              💡 The NeverMissLead ROI
            </p>
            <p className="text-center text-gray-700">
              Your investment is <span className="font-bold text-green-600">less than 3 missed calls per month</span>.
              Capture just one extra lead and you&apos;ve already made money.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetSetupCall}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          I Want to Stop Losing Money - Get a Free Setup Call
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          No credit card required • Setup in 24-48 hours
        </p>
      </div>
    </div>
  );

  if (variant === 'inline') {
    return <div className="w-full flex justify-center">{content}</div>;
  }

  // Modal variant
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full flex items-center justify-center min-h-full py-4 md:py-8">
        <div className="animate-in zoom-in duration-300">
          {content}
        </div>
      </div>
    </div>
  );
}
