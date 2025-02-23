import { useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { RouteGuard } from '@/components/layout/RouteGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { theme } from '@/styles/theme';

const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export default function App({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const router = useRouter();

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <RouteGuard>
            {publicPaths.includes(router.pathname) ? (
              <Component {...pageProps} />
            ) : (
              <DashboardLayout>
                <Component {...pageProps} />
              </DashboardLayout>
            )}
          </RouteGuard>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
