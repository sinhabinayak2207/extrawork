// Type declarations for product detail page
import { PageProps as NextPageProps } from 'next';

// Define the params type for this specific page
export interface ProductDetailPageParams {
  category: string;
  product: string;
}

// Extend the Next.js PageProps interface for this specific page
declare module 'next' {
  interface PageProps {
    params: ProductDetailPageParams;
  }
}
