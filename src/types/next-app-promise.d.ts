// Fix for Next.js App Router Promise-related errors
import { PageProps as NextPageProps } from 'next';

// Create a custom type that combines object properties with Promise methods
type PromiseLike<T> = T & {
  then: Promise<any>['then'];
  catch: Promise<any>['catch'];
  finally: Promise<any>['finally'];
  [Symbol.toStringTag]: string;
};

// Extend the Next.js PageProps interface
declare module 'next' {
  interface PageProps {
    params?: PromiseLike<any>;
    searchParams?: any;
  }
}

// Override the specific generated types
declare module '.next/types/app/products/[category]/[product]/page' {
  interface PageProps {
    params: PromiseLike<{
      category: string;
      product: string;
    }>;
  }
}

declare module '.next/types/app/products/[category]/page' {
  interface PageProps {
    params: PromiseLike<{
      category: string;
    }>;
  }
}
