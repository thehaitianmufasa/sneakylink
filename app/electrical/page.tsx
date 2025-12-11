import { getClientConfig } from '@shared/config/config-loader';
import { PageContent } from '@frontend/components/PageContent';

export default async function ElectricalPage() {
  const config = await getClientConfig('electrical');

  return (
    <main className="min-h-screen bg-white text-dark-gray">
      <PageContent config={config} />
    </main>
  );
}
