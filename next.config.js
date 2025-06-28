/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip TypeScript type checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configure React Strict Mode
  reactStrictMode: true,
  
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      'www.gstatic.com',
      'encrypted-tbn0.gstatic.com',
      'images.pexels.com',
      'images.unsplash.com',
      'placehold.co',
      'via.placeholder.com',
      'picsum.photos',
      'fastly.picsum.photos'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
      },
    ],
  },
  // Enable React Strict Mode
  reactStrictMode: true,
};

module.exports = nextConfig;
