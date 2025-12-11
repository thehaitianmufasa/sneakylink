import Image from 'next/image';
import { ElectroProLogoIcon, AquaProLogoIcon, ClimateGuardLogoIcon } from './logo-icon';

interface LogoProps {
  text: string;
  tagline?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  imageSrc?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  variant?: 'default' | 'plain';
}

export function Logo({
  text,
  tagline,
  className = '',
  size = 'md',
  imageSrc,
  imageAlt,
  imagePriority = false,
  variant = 'default',
}: LogoProps) {
  const imageDimensions = {
    sm: { width: 160, height: 160, className: 'max-h-12' },
    md: { width: 240, height: 240, className: 'max-h-16' },
    lg: { width: 320, height: 320, className: 'max-h-20' },
  } as const;

  const resolvedImageSrc = imageSrc ?? '/assets/NeverMisslead-Transparentlogo.png';

  if (resolvedImageSrc) {
    const dimensions = imageDimensions[size];

    // Plain variant - show image/icon with text and tagline
    if (variant === 'plain') {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
          {text === 'ELECTRO PROS' ? (
            <ElectroProLogoIcon className="h-12 w-12 flex-shrink-0" />
          ) : text === 'AQUAPRO SOLUTIONS' ? (
            <AquaProLogoIcon className="h-12 w-12 flex-shrink-0" />
          ) : text === 'CLIMATEGUARD' ? (
            <ClimateGuardLogoIcon className="h-12 w-12 flex-shrink-0" />
          ) : (
            <Image
              src={resolvedImageSrc}
              alt={imageAlt || text}
              width={48}
              height={48}
              priority={imagePriority}
              className="h-12 w-12 object-contain"
            />
          )}
          <div className="flex flex-col">
            <span className={`text-lg font-black leading-tight ${
              text === 'CLIMATEGUARD'
                ? 'bg-gradient-to-r from-[#D32F2F] to-[#1976D2] bg-clip-text text-transparent'
                : text === 'AQUAPRO SOLUTIONS'
                ? 'text-[#003D7A]'
                : 'text-gray-900'
            }`}>
              {text}
            </span>
            {tagline && (
              <span className={`text-xs font-semibold leading-tight ${
                text === 'CLIMATEGUARD'
                  ? 'text-[#F57C00]'
                  : text === 'AQUAPRO SOLUTIONS'
                  ? 'text-[#0066CC]'
                  : 'text-primary'
              }`}>
                {tagline}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Default variant - with background
    return (
      <div className={`flex flex-col items-start ${className}`}>
        <div className="rounded-lg bg-white p-2 shadow-lg">
          <Image
            src={resolvedImageSrc}
            alt={imageAlt || text}
            width={dimensions.width}
            height={dimensions.height}
            priority={imagePriority}
            className={`${dimensions.className} h-auto w-auto object-contain`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xl font-bold leading-tight text-primary">{text}</span>
    </div>
  );
}

export default Logo;
