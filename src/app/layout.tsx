import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WachtlijstHelderheid | Transparant wachtlijstbeheer voor kinderopvang",
  description:
    "Geef ouders real-time inzicht in hun wachtlijstpositie. Automatiseer communicatie en bespaar 12 uur per week. Voor KDV en BSO organisaties.",
  keywords: [
    "wachtlijst",
    "kinderopvang",
    "KDV",
    "BSO",
    "wachtlijstbeheer",
    "ouders",
    "transparantie",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
