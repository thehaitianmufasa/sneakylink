'use client';

interface ColorProviderProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral?: {
      dark?: string;
      light?: string;
      white?: string;
    };
  };
  children: React.ReactNode;
}

export function ColorProvider({ colors, children }: ColorProviderProps) {
  // Convert hex to RGB for gradient support
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --color-primary: ${colors.primary};
          --color-secondary: ${colors.secondary};
          --color-accent: ${colors.accent};
          --color-dark-gray: ${colors.neutral?.dark || '#2C3E50'};
          --color-light-gray: ${colors.neutral?.light || '#F5F5F5'};

          /* RGB values for gradient support */
          --brand-primary-rgb: ${hexToRgb(colors.primary)};
          --brand-secondary-rgb: ${hexToRgb(colors.secondary)};
          --brand-accent-rgb: ${hexToRgb(colors.accent)};

          /* Gradient CSS variables */
          --brand-primary: ${colors.primary};
          --brand-secondary: ${colors.secondary};
          --brand-accent: ${colors.accent};
        }

        /* Use secondary color (navy blue) for dark backgrounds */
        .bg-dark-gray {
          background-color: var(--color-secondary) !important;
        }

        /* Emergency banner uses secondary color */
        .bg-secondary\/10 {
          background-color: color-mix(in srgb, var(--color-secondary) 10%, transparent) !important;
        }

        /* Override Tailwind classes with CSS variables */
        .bg-primary {
          background-color: var(--color-primary) !important;
        }

        .text-primary {
          color: var(--color-primary) !important;
        }

        .border-primary {
          border-color: var(--color-primary) !important;
        }

        .bg-secondary {
          background-color: var(--color-secondary) !important;
        }

        .text-secondary {
          color: var(--color-secondary) !important;
        }

        .border-secondary {
          border-color: var(--color-secondary) !important;
        }

        .bg-accent {
          background-color: var(--color-accent) !important;
        }

        .text-accent {
          color: var(--color-accent) !important;
        }

        /* Handle opacity variants */
        .bg-primary\/10 {
          background-color: color-mix(in srgb, var(--color-primary) 10%, transparent) !important;
        }

        .bg-primary\/5 {
          background-color: color-mix(in srgb, var(--color-primary) 5%, transparent) !important;
        }

        .bg-secondary\/10 {
          background-color: color-mix(in srgb, var(--color-secondary) 10%, transparent) !important;
        }

        .bg-secondary\/5 {
          background-color: color-mix(in srgb, var(--color-secondary) 5%, transparent) !important;
        }

        .border-secondary\/40 {
          border-color: color-mix(in srgb, var(--color-secondary) 40%, transparent) !important;
        }

        .border-primary\/40 {
          border-color: color-mix(in srgb, var(--color-primary) 40%, transparent) !important;
        }

        /* Hover states */
        .hover\:bg-primary:hover {
          background-color: var(--color-primary) !important;
        }

        .hover\:text-secondary:hover {
          color: var(--color-secondary) !important;
        }

        .hover\:text-secondary\/80:hover {
          color: color-mix(in srgb, var(--color-secondary) 80%, transparent) !important;
        }

        /* Button styles */
        button.bg-primary,
        a.bg-primary {
          background-color: var(--color-primary) !important;
        }

        button.bg-primary:hover,
        a.bg-primary:hover {
          background-color: color-mix(in srgb, var(--color-primary) 90%, black) !important;
        }

        /* Focus rings */
        .focus-visible\:ring-primary:focus-visible {
          --tw-ring-color: var(--color-primary) !important;
        }

        .focus-visible\:ring-secondary:focus-visible {
          --tw-ring-color: var(--color-secondary) !important;
        }

        /* Logo white background handling - make it blend naturally */
        img[alt*="logo"] {
          background: transparent;
        }

        /* Subtle shadow for logos to separate from white backgrounds */
        .rounded-lg.bg-white.p-2.shadow-lg img,
        .rounded-lg.bg-white.p-3.shadow-lg img {
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
        }

        /* For footer logo - slightly rounded corners for polish */
        footer img[alt*="logo"] {
          border-radius: 4px;
        }
      `}</style>
      {children}
    </>
  );
}

export default ColorProvider;
