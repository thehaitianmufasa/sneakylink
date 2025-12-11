export function ElectroProLogoIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Orange Square Background */}
      <rect width="100" height="100" rx="12" fill="#F89C1C" />

      {/* Lightbulb Icon */}
      <g transform="translate(25, 15)">
        {/* Bulb */}
        <path
          d="M25 15 C25 8 30 3 37.5 3 C45 3 50 8 50 15 C50 20 48 24 45 27 L45 35 L30 35 L30 27 C27 24 25 20 25 15 Z"
          fill="white"
        />
        {/* Base */}
        <rect x="30" y="35" width="15" height="8" rx="2" fill="white" />
        <rect x="32" y="43" width="11" height="4" rx="1" fill="white" />

        {/* Filament */}
        <path
          d="M35 18 L35 28 M40 18 L40 28"
          stroke="#F89C1C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Light rays */}
        <line x1="15" y1="15" x2="20" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="8" x2="22" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="22" x2="22" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="55" y1="8" x2="52" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="55" y1="22" x2="52" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="15" x2="55" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function AquaProLogoIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue Square Background */}
      <rect width="100" height="100" rx="12" fill="#0066CC" />

      {/* Pipe Icon - matches mock design */}
      <g transform="translate(30, 30) scale(2)">
        <path
          fillRule="evenodd"
          d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
          clipRule="evenodd"
          fill="white"
        />
      </g>
    </svg>
  );
}

export function ClimateGuardLogoIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="hvacGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#D32F2F', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1976D2', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1976D2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0D47A1', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main gradient square background */}
      <rect width="100" height="100" rx="12" fill="url(#hvacGradient)" />

      {/* Flame icon (heating) - centered and larger */}
      <g transform="translate(28, 18) scale(2.2)">
        <path
          d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
          fill="white"
        />
      </g>

      {/* AC/Lightning badge (bottom right corner) - prominent */}
      <circle cx="76" cy="76" r="18" fill="url(#badgeGradient)" />
      <g transform="translate(67, 67) scale(0.7)">
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clipRule="evenodd"
          fill="white"
        />
      </g>
    </svg>
  );
}

export default ElectroProLogoIcon;
