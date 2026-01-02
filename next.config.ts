import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Ignore ESLint errors during builds (we have many unused imports to clean up later)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization configuration
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
