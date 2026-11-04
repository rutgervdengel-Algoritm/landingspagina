import type { Metadata } from 'next';
import './globals.css';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: `${BRAND.name}: de eerlijke wachtlijst voor zwemles, sport en kinderopvang`,
  description:
    'Ouders zien hun plek in de rij en waarom. Jij ziet bij elke vrije plek direct wie aan de beurt is, met uitleg. Voor zwemscholen, sportclubs en kinderopvang.',
  openGraph: {
    title: BRAND.name,
    description: 'De wachtlijst waarop iedereen ziet waar hij staat, en waarom.',
    locale: 'nl_NL',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Atkinson+Hyperlegible:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
