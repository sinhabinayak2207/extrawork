// Fix for Next.js types
import 'next';

declare module 'next' {
  export interface PageProps {
    params?: any;
    searchParams?: Record<string, string | string[]>;
  }
  
  export interface Metadata {
    title?: string | { default: string; template?: string } | null;
    description?: string | null;
    applicationName?: string | null;
    authors?: Array<{ name: string; url?: string }> | null;
    generator?: string | null;
    keywords?: string | Array<string> | null;
    referrer?: 'no-referrer' | 'origin' | 'no-referrer-when-downgrade' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | null;
    themeColor?: string | null;
    colorScheme?: 'normal' | 'light' | 'dark' | 'only light' | null;
    viewport?: string | null;
    creator?: string | null;
    publisher?: string | null;
    robots?: string | { index?: boolean; follow?: boolean; nocache?: boolean; googleBot?: string | { index?: boolean; follow?: boolean; noimageindex?: boolean; 'max-video-preview'?: number; 'max-image-preview'?: string; 'max-snippet'?: number; unavailableAfter?: string; } } | null;
    canonical?: string | null;
    alternates?: Record<string, string> | null;
    icons?: string | Array<string> | null;
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      images?: Array<{
        url: string;
        alt?: string;
        width?: number;
        height?: number;
      }>;
      locale?: string;
      type?: string;
    } | null;
    twitter?: {
      card?: 'summary' | 'summary_large_image' | 'app' | 'player';
      site?: string;
      creator?: string;
      title?: string;
      description?: string;
      images?: string | Array<string>;
    } | null;
    verification?: {
      google?: string | null;
      yahoo?: string | null;
      yandex?: string | null;
      me?: string | null;
    } | null;
    [key: string]: any;
  }

  export interface NextConfig {
    reactStrictMode?: boolean;
    swcMinify?: boolean;
    images?: {
      domains?: string[];
      formats?: string[];
      deviceSizes?: number[];
      imageSizes?: number[];
      path?: string;
      loader?: 'default' | 'imgix' | 'cloudinary' | 'akamai' | 'custom';
      disableStaticImages?: boolean;
      minimumCacheTTL?: number;
      dangerouslyAllowSVG?: boolean;
      contentSecurityPolicy?: string;
      remotePatterns?: Array<{
        protocol?: string;
        hostname: string;
        port?: string;
        pathname?: string;
      }>;
    };
    [key: string]: any;
  }
}
