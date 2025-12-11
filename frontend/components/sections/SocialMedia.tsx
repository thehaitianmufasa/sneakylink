import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
import SectionContainer from '../ui/section-container';

interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  url: string;
  label: string;
}

interface SocialMediaProps {
  heading?: string;
  subheading?: string;
  links: SocialLink[];
  images?: string[];
  slug?: string;
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

export function SocialMedia({
  heading = 'Follow Our Work on Social Media',
  subheading = 'See real projects, helpful tips, and satisfied customers. Join our growing community!',
  links,
  images = [],
  slug
}: SocialMediaProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const isHVAC = slug === 'hvac' || slug === 'nevermisslead';
  const isElectrical = slug === 'electrical';
  const isPlumbing = slug === 'plumbing';
  const hasRoundedBanner = isHVAC || isElectrical || isPlumbing;

  // Filter to only show first 3 platforms (Facebook, Instagram, Twitter)
  const displayLinks = links.slice(0, 3);

  // Define gradient colors per demo
  const getGradientColors = () => {
    if (isHVAC) return 'from-[#1976D2] to-[#42A5F5]'; // Blue gradient
    if (isElectrical) return 'from-[#F89C1C] to-[#1A2B4C]'; // Orange to Navy gradient
    if (isPlumbing) return 'from-[#0066CC] via-[#003D7A] to-[#0066CC]'; // Dark navy gradient (brand blue → navy → brand blue)
    return '';
  };

  const getHoverColor = () => {
    if (isHVAC) return 'hover:bg-[#F57C00]'; // Orange
    if (isElectrical) return 'hover:bg-[#F89C1C]'; // Orange
    if (isPlumbing) return 'hover:bg-[#00A8E8]'; // Accent blue
    return 'hover:bg-white/20';
  };

  return (
    <SectionContainer
      id="social-media"
      className={hasRoundedBanner ? 'bg-white' : 'bg-secondary'}
    >
      {hasRoundedBanner ? (
        <div className="max-w-6xl mx-auto">
          <div className={`bg-gradient-to-br ${getGradientColors()} rounded-3xl p-8 md:p-12`}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left Side - Content */}
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-black text-white md:text-4xl">
                  {heading}
                </h2>
                <p className="text-lg text-white/90 md:text-xl">
                  {subheading}
                </p>

                {/* Social Icons */}
                <div className="flex gap-4 pt-4">
                  {displayLinks.map((link) => {
                    const Icon = platformIcons[link.platform];
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex h-12 w-12 items-center justify-center rounded-lg text-white transition-all hover:scale-110 bg-white/10 ${getHoverColor()}`}
                        aria-label={link.label}
                      >
                        <Icon size={24} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Images (2x1 grid for HVAC/Electrical, 3x1 for Plumbing) */}
              {images.length > 0 && (
                <div className={`grid gap-4 ${isPlumbing ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {images.slice(0, isPlumbing ? 3 : 2).map((image, index) => (
                    <div key={index} className="relative h-48 w-full overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`Social media showcase ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Content */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-black text-white md:text-4xl">
              {heading}
            </h2>
            <p className="text-lg text-white/90 md:text-xl">
              {subheading}
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-4">
              {displayLinks.map((link) => {
                const Icon = platformIcons[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-white transition-all hover:scale-110 bg-white/10 hover:bg-white/20"
                    aria-label={link.label}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Side - Images (2x1 grid) */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.slice(0, 2).map((image, index) => (
                <div key={index} className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`Social media showcase ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </SectionContainer>
  );
}

export default SocialMedia;
