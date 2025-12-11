import type { ProcessSection } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';
import { getIconByName } from './icon-map';

interface ProcessProps {
  process: ProcessSection;
}

export function ProcessSteps({ process }: ProcessProps) {
  if (!process.steps.length) {
    return null;
  }

  const steps = [...process.steps].sort((a, b) => a.order - b.order);

  return (
    <SectionContainer id="process" className="bg-light-gray" innerClassName="gap-10">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl تحمل font-bold text-dark-gray md:text-4xl">{process.heading}</h2>
        <p className="text-lg text-text">{process.subheading}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {steps.map((step) => {
          const Icon = getIconByName(step.icon);
          return (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-md shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <span className="mt-3 text-sm font-semibold uppercase tracking-wide text-secondary">
                Step {step.order}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-dark-gray">{step.title}</h3>
              <p className="mt-1 text-sm text-text">{step.description}</p>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}

export default ProcessSteps;
