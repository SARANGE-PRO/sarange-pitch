import type { Metadata, Viewport } from 'next';
import { Fraunces, Chakra_Petch, IBM_Plex_Mono } from 'next/font/google';
import '../styles/tokens.css';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
});

const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-chakra',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-plex-mono',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koikasamui.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KoikaSamui — Bestiaire de Koh Samui & des îles',
    template: '%s · KoikaSamui',
  },
  description:
    "Bestiaire de terrain interactif de la faune de Koh Samui, Koh Phangan, Koh Tao et du parc marin d'Ang Thong : ~80 espèces, dangerosité, lieux d'observation et carte de l'archipel.",
  keywords: [
    'Koh Samui',
    'faune',
    'bestiaire',
    'Thaïlande',
    "Golfe de Thaïlande",
    'Koh Tao',
    'Koh Phangan',
    'Ang Thong',
  ],
  authors: [{ name: 'KoikaSamui' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'KoikaSamui',
    title: 'KoikaSamui — Bestiaire de Koh Samui & des îles',
    description:
      "La faune du Golfe de Thaïlande, de la canopée au récif : ~80 espèces classées par dangerosité et lieu d'observation.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KoikaSamui — Bestiaire de Koh Samui & des îles',
    description:
      "La faune du Golfe de Thaïlande, de la canopée au récif : ~80 espèces classées par dangerosité et lieu d'observation.",
  },
};

export const viewport: Viewport = {
  themeColor: '#0B1A15',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${chakra.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:font-ui focus:text-sm focus:text-night"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
