import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsProvider } from '@/lib/settings-provider';
import { AppRoutes } from './routes';
import { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import settings_en from './locales/en/settings.json';
import settings_es from './locales/es/settings.json';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'auto',
  fallbackLng: 'en',
  resources: {
    en: {
      settings: settings_en,
    },
    es: {
      settings: settings_es,
    },
  },
});

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
