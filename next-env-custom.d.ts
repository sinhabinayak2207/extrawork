/// <reference types="next" />

// Extend the Next.js types to fix the params issue
declare module "next" {
  export interface PageProps {
    params?: any;
    searchParams?: any;
  }
}

// Fix for Next.js App Router dynamic routes
declare namespace NodeJS {
  interface Global {
    __NEXT_DYNAMIC_ROUTE_PARAMS__: Promise<any>;
  }
}

// Override the generated types for dynamic routes
declare module ".next/types/app/products/[category]/[product]/page" {
  interface PageProps {
    params: any;
  }
}

declare module ".next/types/app/products/[category]/page" {
  interface PageProps {
    params: any;
  }
}
