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
  
  // Generate static HTML export for Netlify
  output: 'export',
  
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
      'www.gstatic.com'
    ],
  },
  
  // No experimental features needed for static export
};

module.exports = nextConfig;
