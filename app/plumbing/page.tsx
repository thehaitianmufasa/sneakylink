import { getClientConfig } from '@shared/config/config-loader';
import { PageContent } from '@frontend/components/PageContent';

export default async function PlumbingPage() {
  const config = await getClientConfig('plumbing');

  return (
    <main className="min-h-screen bg-white text-dark-gray">
      <PageContent config={config} />
    </main>
  );
}
