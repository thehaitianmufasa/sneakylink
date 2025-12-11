"use client";

import Link from 'next/link';
import type { CTAButton } from '@shared/types/client-config';
import { cn } from '@backend/lib/utils/cn';
import { useModal } from '../PageWrapper';

const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

type CTAButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'inverse'
  | 'white'
  | 'gradient'
  | 'light';

const variantClasses: Record<CTAButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:ring-primary/20',
  secondary: 'bg-secondary text-dark-gray shadow-sm hover:bg-secondary/90 focus-visible:ring-secondary/40',
  outline: 'border border-primary/80 text-primary hover:bg-primary/5 focus-visible:ring-primary/20',
  ghost: 'text-primary hover:bg-primary/10 focus-visible:ring-primary/20',
  inverse: 'bg-white text-primary shadow-sm hover:bg-white/90 focus-visible:ring-primary/20',
  white: 'bg-white text-primary shadow-sm hover:bg-white/90 focus-visible:ring-primary/20',
  gradient: 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg hover:shadow-xl focus-visible:ring-primary/20',
  light: 'bg-white text-dark-gray shadow-md hover:bg-white/90 focus-visible:ring-primary/10 border border-white/40',
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-lg',
};

function resolveHref(cta: CTAButton): string {
  switch (cta.action) {
    case 'phone':
      return cta.value.startsWith('tel:') ? cta.value : `tel:${cta.value}`;
    case 'sms':
      return cta.value.startsWith('sms:') ? cta.value : `sms:${cta.value}`;
    default:
      return cta.value;
  }
}

export interface CTAButtonProps {
  cta: CTAButton;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: CTAButtonVariant;
  style?: React.CSSProperties;
}

export function CTAButtonLink({
  cta,
  size = 'md',
  className,
  variant: variantOverride,
  style,
}: CTAButtonProps) {
  const variant = variantOverride ?? cta.style ?? 'primary';
  const { openQuoteModal } = useModal();

  // If action is "form", render button that opens modal
  if (cta.action === 'form') {
    return (
      <button
        type="button"
        onClick={openQuoteModal}
        className={cn(
          baseClasses,
          variantClasses[variant] ?? variantClasses.primary,
          sizeClasses[size],
          className
        )}
        style={style}
      >
        {cta.text}
      </button>
    );
  }

  // Otherwise, render link
  const href = resolveHref(cta);

  return (
    <Link
      href={href}
      className={cn(
        baseClasses,
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size],
        className
      )}
      style={style}
      prefetch={false}
    >
      {cta.text}
    </Link>
  );
}
