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
  
  // Generate static HTML export for Firebase hosting
  output: 'export',
  
  // Build directory
  distDir: process.env.BUILD_DIR || '.next',
  
  // Configure static generation
  generateBuildId: async () => {
    return 'build-' + new Date().toISOString().replace(/[\:\.-]/g, '-');
  },
  
  // Static export configuration
  experimental: {
    // No experimental features needed for static export
  },
  
  // Configure static export settings
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  
  // Disable trailing slashes for Firebase hosting compatibility
  trailingSlash: false,
  
  // Image optimization settings
  images: {
    unoptimized: true, // Keep for static export
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
  
  // Note: exportPathMap is not compatible with the app directory
  // We'll use generateStaticParams in each page instead
};

module.exports = nextConfig;
