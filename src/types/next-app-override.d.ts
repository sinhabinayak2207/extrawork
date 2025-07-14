// Override Next.js App Router types to fix Promise-related errors
import 'next';

// Create a type that satisfies both object and Promise interfaces
interface PromiseCompatible<T = any> extends Promise<T> {
  [key: string]: any;
}

// Override the Next.js PageProps interface
declare module 'next' {
  interface PageProps {
    params: PromiseCompatible;
    searchParams?: Record<string, string | string[]>;
  }
}
