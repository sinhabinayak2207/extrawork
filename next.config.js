/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript and ESLint errors during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build for now
    ignoreDuringBuilds: true,
  },
  
  // Configure React Strict Mode
  reactStrictMode: true,
  
  // Enable Server-Side Rendering and Incremental Static Regeneration
  // output: 'export', -- Removed to enable SSR/ISR
  
  // Build directory
  distDir: process.env.BUILD_DIR || '.next',
  
  // Configure static generation
  generateBuildId: async () => {
    return 'build-' + new Date().toISOString().replace(/[\:\.-]/g, '-');
  },
  
  // Enable server components and other Next.js features
  experimental: {
    // Add any experimental features here if needed
  },
  
  // Enable middleware for dynamic routing
  // skipMiddlewareUrlNormalize: true, -- Removed
  // skipTrailingSlashRedirect: true, -- Removed
  
  // Disable trailing slashes for Firebase hosting compatibility
  trailingSlash: false,
  
  // Enable image optimization for better performance
  images: {
    // unoptimized: true, -- Removed to enable image optimization
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'github.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'randomuser.me',
      'storage.googleapis.com',
      'www.gstatic.com',
      'firebasestorage.googleapis.com'
    ],
  },
  
  // No experimental features needed for static export
};

module.exports = nextConfig;
