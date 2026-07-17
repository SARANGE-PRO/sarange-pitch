import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/species';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koikasamui.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/especes', '/carte', '/a-propos'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const speciesRoutes = getAllSlugs().map((slug) => ({
    url: `${siteUrl}/especes/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...speciesRoutes];
}
