import type { FAQ as FAQItem } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { Accordion } from '../ui/accordion';

interface FAQProps {
  faq: FAQItem[];
}

export function FAQ({ faq }: FAQProps) {
  if (!faq.length) {
    return null;
  }

  const items = [...faq]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.question,
      title: item.question,
      content: item.answer,
    }));

  return (
    <SectionContainer id="faq" className="bg-white" innerClassName="gap-8">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-bold text-dark-gray md:text-4xl">Frequently Asked Questions</h2>
        <p className="text-lg text-text">
          Straight answers about our emergency response, pricing, and coverage.
        </p>
      </div>
      <Accordion items={items} defaultOpenIds={[items[0]?.id ?? '']} />
    </SectionContainer>
  );
}

export default FAQ;
