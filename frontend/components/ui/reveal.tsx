'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '@backend/lib/utils/cn';

type RevealBaseProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  threshold?: number;
};

export type RevealProps<T extends ElementType = 'div'> = RevealBaseProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealBaseProps<T>>;

export function Reveal<T extends ElementType = 'div'>({
  as,
  children,
  className,
  delay = 0,
  once = true,
  threshold = 0.15,
  ...rest
}: RevealProps<T>) {
  const Component = (as || 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={cn(
        'transform-gpu transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default Reveal;
