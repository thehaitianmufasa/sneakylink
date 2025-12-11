'use client';

interface AnnouncementBannerProps {
  onClick?: () => void;
  text?: string;
  ctaText?: string;
}

export function AnnouncementBanner({
  onClick,
  text = "Join 2,500+ service businesses capturing more leads",
  ctaText = "See How It Works →"
}: AnnouncementBannerProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0f172a] text-white py-3 px-4 text-center text-sm md:text-base font-medium cursor-pointer hover:bg-[#1e293b] transition-colors"
    >
      🎯 {text}{' '}
      <span className="text-[#f97316] font-bold ml-2">
        {ctaText}
      </span>
    </div>
  );
}
