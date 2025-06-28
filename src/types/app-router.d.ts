// Type declarations for Next.js App Router

import 'next';

declare module 'next' {
  // Override the PageProps interface to make params a Promise<any>
  export interface PageProps {
    params?: Promise<any>;
    searchParams?: Record<string, string | string[]>;
  }
}

// Augment the global namespace to fix dynamic route params
declare global {
  // Add type definitions for the .next/types directory
  namespace NodeJS {
    interface Global {
      // This is a workaround to make TypeScript happy with the dynamic route params
      __NEXT_PAGE_PROPS__: {
        params: Promise<any>;
      };
    }
  }
}
