"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts, Product } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { logToSystem } from '@/lib/logger';
import Link from 'next/link';

/**
 * Template-based product view page that works with static exports.
 * This page loads product data client-side based on URL parameters.
 */
export default function ProductViewTemplate() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('id') || '';
  const productContext = useProducts();
  const categoryContext = useCategories();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    // If no product ID provided, show not found
    if (!productId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Wait for product context to load
    if (!productContext || !productContext.products || !categoryContext) {
      return;
    }

    // Find the product by ID
    const foundProduct = productContext.products.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setCategoryId(foundProduct.category);
      logToSystem(`Template loaded product: ${foundProduct.name}`, 'success');
    } else {
      setNotFound(true);
      logToSystem(`Product not found: ${productId}`, 'warning');
    }
    
    setLoading(false);
  }, [productId, productContext, categoryContext]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show not found state
  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          href="/products"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

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

  return (
    <ProductDetailClient 
      serverProduct={serverProduct} 
      productSlug={product.slug || productId || ''} 
      category={categoryId} 
    />
  );
}
