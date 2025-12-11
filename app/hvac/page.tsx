import { getClientConfig } from '@shared/config/config-loader';
import { PageContent } from '@frontend/components/PageContent';

export default async function Home() {
  const config = await getClientConfig('nevermisslead');

  return (
    <main className="min-h-screen bg-white text-dark-gray">
      <PageContent config={config} />
    </main>
  );
}
