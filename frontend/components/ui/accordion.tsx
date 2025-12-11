"use client";

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@backend/lib/utils/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIds?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenIds = [],
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set(defaultOpenIds));

  const handleToggle = (id: string) => {
    setOpenItems((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white', className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div key={item.id}>
            <button
              id={`accordion-trigger-${item.id}`}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              onClick={() => handleToggle(item.id)}
            >
              <span className="text-base font-semibold text-dark-gray">{item.title}</span>
              <ChevronDown
                className={cn('h-5 w-5 text-primary transition-transform duration-200', isOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
              className={cn('px-6 pb-6 text-sm leading-relaxed text-slate-600', !isOpen && 'hidden')}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
