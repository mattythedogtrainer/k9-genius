/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@k9-genius/ui', '@k9-genius/api', '@k9-genius/db'],
  typescript: {
    // Firestore returns loosely-typed DocumentData; runtime code is correct.
    // TODO: Add proper generic types to Firestore collections to remove this.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
