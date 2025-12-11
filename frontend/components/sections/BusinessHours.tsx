import type { BusinessHours } from '@shared/types/client-config';
import SectionContainer from '../ui/section-container';

interface BusinessHoursProps {
  hours: BusinessHours;
}

export function BusinessHoursSection({ hours }: BusinessHoursProps) {
  const entries = Object.entries(hours).filter(([key]) => key !== 'regularHours');

  return (
    <SectionContainer id="hours" className="bg-white" innerClassName="gap-6">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-bold text-dark-gray md:text-4xl">24/7 Emergency Availability</h2>
        {hours.regularHours && (
          <p className="text-text">
            Weekday Hours: {hours.regularHours.weekday} • Saturday: {hours.regularHours.saturday} • Sunday: {hours.regularHours.sunday}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {entries.map(([day, value]) => (
          <div key={day} className="rounded-2xl bg-light-gray p-4 text-center shadow-sm">
            <div className="text-sm font-semibold uppercase text-secondary">{day}</div>
            <div className="mt-2 text-text">{value}</div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

export default BusinessHoursSection;
