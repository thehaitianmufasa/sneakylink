import { createElement } from 'react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { cn } from '@backend/lib/utils/cn';

export interface SectionContainerProps {
  id?: string;
  className?: string;
  innerClassName?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

export default function SectionContainer({
  id,
  className,
  innerClassName,
  fullWidth = false,
  children,
  style,
}: SectionContainerProps): ReactElement {
  const outerClassName = cn('py-section-mobile md:py-section', className);
  const innerClasses = cn(
    'mx-auto flex max-w-container flex-col gap-8 px-5 md:px-8',
    fullWidth && 'max-w-full px-5 md:px-12',
    innerClassName
  );

  return createElement(
    'div',
    { id, className: outerClassName, style },
    createElement('div', { className: innerClasses }, children)
  );
}
