'use client';

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-4 bg-white p-2 rounded-full shadow-md">
        <button
          onClick={() => onToggle(false)}
          className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all ${
            !isAnnual
              ? 'bg-[#f97316] text-white'
              : 'text-[#334155] hover:bg-gray-50'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
            isAnnual
              ? 'bg-[#f97316] text-white'
              : 'text-[#334155] hover:bg-gray-50'
          }`}
        >
          Annual
          <span className="bg-[#d1fae5] text-[#10b981] text-xs font-bold px-3 py-1 rounded-full">
            Save $1,064
          </span>
        </button>
      </div>
    </div>
  );
}
