import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/app-context';

export const metadata: Metadata = {
  title: 'SM-LENS | Observatoire Économique & Marché du Travail de Souss-Massa',
  description: 'Plateforme de veille et d’intelligence territoriale sur le marché du travail dans la région de Souss-Massa (HCP / ENE 2019-2025).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 observatory-grid antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
