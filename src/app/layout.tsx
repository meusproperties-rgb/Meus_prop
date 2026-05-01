import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'Meus Real Estate | Dubai Luxury Property Advisors',
    template: '%s | Meus Real Estate',
  },
  description:
    'Discover exceptional luxury properties in Dubai. Villas, penthouses, apartments and more curated by Dubai\'s premier real estate advisors.',
  keywords: ['Dubai real estate', 'luxury properties', 'Dubai villas', 'Dubai apartments', 'property for sale Dubai'],
  openGraph: {
    title: 'Meus Real Estate | Dubai Luxury Property Advisors',
    description: 'Discover exceptional luxury properties in Dubai.',
    type: 'website',
    locale: 'en_AE',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
