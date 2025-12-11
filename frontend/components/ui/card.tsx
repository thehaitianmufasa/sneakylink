import type { HTMLAttributes } from 'react';
import { cn } from '@backend/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const CardBase = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center';
}

function CardHeader({ className, align = 'left', children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('border-b border-slate-100 px-6 py-5', align === 'center' && 'text-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn('flex-1 px-6 py-6 text-text', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('border-t border-slate-100 px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export { CardHeader, CardBody, CardFooter };

export default Card;
