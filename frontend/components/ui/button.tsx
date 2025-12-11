"use client";

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@backend/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverse' | 'gradient' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:ring-primary/20',
  secondary:
    'bg-secondary text-dark-gray shadow-sm hover:bg-secondary/90 focus-visible:ring-secondary/40',
  outline:
    'border border-primary/80 text-primary hover:bg-primary/5 focus-visible:ring-primary/20',
  ghost:
    'text-primary hover:bg-primary/10 focus-visible:ring-primary/20',
  inverse:
    'bg-white text-primary shadow-sm hover:bg-white/90 focus-visible:ring-primary/20',
  gradient:
    'btn-primary-gradient shadow-lg focus-visible:ring-primary/30',
  white:
    'btn-white shadow-sm focus-visible:ring-gray-300',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      type = 'button',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {leftIcon && (
          <span className="flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{isLoading ? 'Loading...' : children}</span>
        {rightIcon && (
          <span className="flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
