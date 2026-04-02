import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = {
  title: 'Audioindex',
  description: 'A Guided Audio Experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmPlexSans.variable}>
      <head>
        <PlausibleProvider domain="Audioindex.local" />
      </head>
      <body>
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  );
}
