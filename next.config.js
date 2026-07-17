/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Les photos proviennent de Wikimedia Commons (licences CC / domaine public).
    // Servies directement et optimisées par next/image — aucun téléchargement requis.
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      { protocol: 'https', hostname: 'inaturalist-open-data.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'static.inaturalist.org' },
    ],
  },
};

module.exports = nextConfig;
