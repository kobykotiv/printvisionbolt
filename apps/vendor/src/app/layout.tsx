import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { GlassCard } from '@printvisionbolt/ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PrintVision Bolt - Vendor Dashboard',
  description: 'Manage your print-on-demand business with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900`}>
        <Providers>
          <main className="min-h-screen p-4 md:p-8">
            <GlassCard className="mx-auto max-w-7xl p-6">
              {children}
            </GlassCard>
          </main>
        </Providers>
      </body>
    </html>
  );
}