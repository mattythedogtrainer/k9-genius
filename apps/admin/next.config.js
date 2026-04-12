/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@k9-genius/ui', '@k9-genius/api', '@k9-genius/db'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
