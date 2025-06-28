// Fix for Next.js App Router generated types
/// <reference types="next" />

// Override the generated types for dynamic routes
declare module ".next/types/*" {
  import { PageProps as OriginalPageProps } from "next";
  
  // Make the params property compatible with both object and Promise
  export interface PageProps extends Omit<OriginalPageProps, 'params'> {
    params: any;
  }
}

// Specifically target the product category pages
declare module ".next/types/app/products/[category]/[product]/page" {
  export interface PageProps {
    params: {
      category: string;
      product: string;
    } & Promise<any>;
  }
}

declare module ".next/types/app/products/[category]/page" {
  export interface PageProps {
    params: {
      category: string;
    } & Promise<any>;
  }
}
