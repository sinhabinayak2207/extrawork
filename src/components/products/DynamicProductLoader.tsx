"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts, Product } from '@/context/ProductContext';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import LoadingSpinner from '../ui/LoadingSpinner';
import { logToSystem } from '@/lib/logger';

interface DynamicProductLoaderProps {
  categoryId: string;
  productId: string;
}

/**
 * Component that dynamically loads product data for products that might have been
 * created after deployment. This allows viewing new products without requiring
 * a site rebuild.
 */
export default function DynamicProductLoader({ categoryId, productId }: DynamicProductLoaderProps) {
  const productContext = useProducts();
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  
  // Safely access products and loading state
  const products = productContext?.products || [];
  const loading = productContext?.loading || false;

  useEffect(() => {
    if (loading) return;

    // Check if the product exists
    const product = products.find((p: Product) => p.id === productId);
    
    if (!product) {
      logToSystem(`Product not found: ${productId} in category ${categoryId}`, 'warning');
      setNotFound(true);
    } else {
      logToSystem(`Dynamically loaded product: ${product.name}`, 'success');
    }
  }, [products, productId, categoryId, loading]);

  // Show loading state while products are being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show not found state if product doesn't exist
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => router.push('/products')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  // Find the product and render the product detail component
  const product = products.find(p => p.id === productId);
  
  if (!product) return null; // This shouldn't happen due to the check above, but TypeScript needs it
  
  // Convert to ServerProduct format expected by ProductDetailClient
  const serverProduct = {
    id: product.id,
    title: product.name,
    image: product.imageUrl,
    description: product.description,
    price: product.price,
    category: product.category,
    specifications: product.specifications || {}
  };
  
  return <ProductDetailClient 
    serverProduct={serverProduct} 
    productSlug={product.slug || productId} 
    category={categoryId} 
  />;
}
