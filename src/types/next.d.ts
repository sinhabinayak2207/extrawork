// Fix for Next.js PageProps type issues
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare module 'next/dist/server/get-page-files' {
  export interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}

declare module 'next/dist/build/templates/app-page' {
  export interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}
