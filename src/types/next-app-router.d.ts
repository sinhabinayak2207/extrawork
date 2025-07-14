// Fix for Next.js App Router types
import 'next';

// Extend the Next.js types to fix the PageProps interface
declare module 'next' {
  // Make params compatible with both object and Promise
  export interface PageProps {
    params?: any;
    searchParams?: any;
  }
}

// Add declarations for the generated Next.js types
declare module '.next/types/app/products/[category]/[product]/page' {
  // Override the generated types to fix the params issue
  export interface PageProps {
    params: {
      category: string;
      product: string;
    };
  }
}

declare module '.next/types/app/products/[category]/page' {
  // Override the generated types to fix the params issue
  export interface PageProps {
    params: {
      category: string;
    };
  }
}
