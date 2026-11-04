import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
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
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Atkinson+Hyperlegible:wght@400;700&family=Barlow+Condensed:wght@600;700;800&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        {/* Vercel Web Analytics: zonder cookies. Werkt zodra Analytics in het Vercel-project aan staat. */}
        <Script id="va-init" strategy="afterInteractive">{`window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`}</Script>
        <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
