// This file fixes TypeScript errors related to Next.js App Router params

import { Metadata } from 'next';

declare module 'next' {
  export interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }

  export interface GenerateMetadataProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}

// Override the generateMetadata function type
declare global {
  interface GenerateMetadataContext {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}
