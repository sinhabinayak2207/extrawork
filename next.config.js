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
  
  // Use export mode for static site generation
  output: 'export',
  
  // Build directory
  distDir: process.env.BUILD_DIR || '.next',
  
  // Enable image optimization for external images
  images: {
    unoptimized: true,
    domains: [
      'res.cloudinary.com',
      'source.unsplash.com',
      'images.unsplash.com',
      'firebasestorage.googleapis.com'
    ],
  },
  
  // Ensure all routes are included in the static export
  trailingSlash: true,

  generateBuildId: async () => {
    return 'build-' + new Date().toISOString().replace(/[\:\.-]/g, '-');
  },
  
  // For static export, we need to handle authentication differently
  experimental: {
    // Remove server components configuration as it's not compatible with static export
  },
  
  // Disable middleware for static export
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  
  // Disable trailing slashes for Firebase hosting compatibility
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
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
