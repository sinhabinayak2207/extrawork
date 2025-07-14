"use client";

import { useState, useEffect, useCallback } from 'react';
import { useProducts } from '@/context/ProductContext';
import type { Product } from '@/lib/firebase-db';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import Section from '../ui/Section';
import Button from '../ui/Button';
import ProductCard from './ProductCard';
import { Product as MockProduct } from '@/types/product';
import { logToSystem } from '@/components/SystemLog';

interface ServerProduct {
  title: string;
  image: string;
  description: string;
  price?: number;
  specifications?: Record<string, string>;
  category: string;
  id: string;
}

interface ProductDetailClientProps {
  serverProduct: ServerProduct;
  productSlug: string;
  category: string;
}

export default function ProductDetailClient({ serverProduct, productSlug, category }: ProductDetailClientProps) {
  const productContext = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Function to refresh the product data
  const refreshProduct = useCallback(() => {
    setForceUpdate(prev => prev + 1);
    setLoading(true);
    setErrorMessage(null);
  }, []);
  
  // Listen for product update events
  useEffect(() => {
    const handleProductUpdate = (event: CustomEvent<{productId: string, imageUrl: string, timestamp: number}>) => {
      const { productId, imageUrl, timestamp } = event.detail;
      logToSystem(`ProductDetailClient received productUpdated event for: ${productId}`, 'info');
      
      // If this is our product, update the image URL and force a re-render
      if (product && product.id === productId) {
        logToSystem(`Updating product image in ProductDetailClient for ${productId}`, 'info');
        refreshProduct();
      }
    };

    window.addEventListener('productUpdated', handleProductUpdate as EventListener);

    return () => {
      window.removeEventListener('productUpdated', handleProductUpdate as EventListener);
    };
  }, [product, refreshProduct]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        logToSystem(`Attempting to fetch product with slug: ${productSlug} in category: ${category}`, 'info');

        // First, try to find the product in the context
        if (productContext) {
          const contextProduct = productContext.products.find(p => p.slug === productSlug);
          if (contextProduct) {
            logToSystem(`Found product in context: ${contextProduct.name}`, 'info');
            // Convert the context product to match the firebase-db Product type
            setProduct({
              ...contextProduct,
              price: contextProduct.price || 0 // Ensure price is always a number, not undefined
            });
            setLoading(false);
            return;
          }
        }
        
        // For newly added products that might not be in the static export
        // Always try to fetch from Firebase on the client side
        logToSystem(`Product not found in context, fetching directly from Firebase: ${productSlug}`, 'info');

        // If not in context, try to fetch from Firebase
        try {
          logToSystem(`Fetching product from Firebase with slug: ${productSlug}`, 'info');
          const { getAllProducts, getProductById } = await import('@/lib/firebase-db');
          const allProducts = await getAllProducts();
          
          // First try exact slug match
          let firebaseProduct = allProducts.find(p => p.slug === productSlug);
          
          // If not found by exact slug, try to find by category and any product
          if (!firebaseProduct && category) {
            firebaseProduct = allProducts.find(p => p.category.toLowerCase() === category.toLowerCase());
            if (firebaseProduct) {
              logToSystem(`Found product in category ${category}: ${firebaseProduct.name}`, 'info');
            }
          }
          
          if (firebaseProduct) {
            // Double-check that the product still exists by ID
            // This ensures deleted products don't reappear
            const productById = await getProductById(firebaseProduct.id);
            if (!productById) {
              logToSystem(`Product with ID ${firebaseProduct.id} was found in listing but doesn't exist anymore (likely deleted)`, 'error');
              setErrorMessage(`This product has been deleted and is no longer available.`);
              setProduct(null);
              setLoading(false);
              return;
            }
            
            logToSystem(`Found product in Firebase: ${firebaseProduct.name}`, 'success');
            setProduct(firebaseProduct as any); // Type cast to avoid type issues
            setLoading(false);
            return;
          }
        } catch (firebaseError) {
          const errorMsg = firebaseError instanceof Error ? firebaseError.message : String(firebaseError);
          logToSystem(`Error fetching from Firebase: ${errorMsg}`, 'error');
          setErrorMessage(`Firebase error: ${errorMsg}`);
        }

        // If we still don't have a product, use the server-provided one as fallback
        // But only if it's not a placeholder (id !== 'unknown' and id !== 'error')
        if (serverProduct && serverProduct.id !== 'unknown' && serverProduct.id !== 'error') {
          logToSystem('Using server-provided product as fallback', 'info');
          
          // Double-check that this server product still exists in Firebase
          try {
            const { getProductById } = await import('@/lib/firebase-db');
            const productExists = await getProductById(serverProduct.id);
            
            if (!productExists) {
              logToSystem(`Server product with ID ${serverProduct.id} no longer exists in Firebase (likely deleted)`, 'error');
              setErrorMessage(`This product has been deleted and is no longer available.`);
              setProduct(null);
              setLoading(false);
              return;
            }
          } catch (err) {
            // Continue with server product if we can't verify
            logToSystem(`Couldn't verify if server product still exists: ${err}`, 'info');
          }
          
          // Convert ServerProduct to Product
          const convertedProduct: Product = {
            id: serverProduct.id,
            name: serverProduct.title,
            description: serverProduct.description,
            imageUrl: serverProduct.image,
            price: serverProduct.price || 0,
            category: serverProduct.category,
            slug: productSlug,
            updatedAt: new Date(),
            updatedBy: 'system',
            specifications: serverProduct.specifications || {}
          };
          setProduct(convertedProduct);
        } else {
          const errorMsg = `Product with slug ${productSlug} not found anywhere`;
          logToSystem(errorMsg, 'error');
          setErrorMessage(errorMsg);
          setProduct(null);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logToSystem(`Unexpected error: ${errorMsg}`, 'error');
        setErrorMessage(`Unexpected error: ${errorMsg}`);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productContext, serverProduct, productSlug, category, forceUpdate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <Button href="/products">
          Browse All Products
        </Button>
      </div>
    );
  }

  // Add cache-busting to image URL if needed
  let imageUrl = product.imageUrl || '';
  if (imageUrl && !imageUrl.includes('t=')) {
    const timestamp = new Date().getTime();
    imageUrl = imageUrl.includes('?') 
      ? `${imageUrl}&t=${timestamp}` 
      : `${imageUrl}?t=${timestamp}`;
  }

  // Convert Product type to match the UI expectations
  const displayProduct = {
    id: product.id,
    title: product.name,
    image: imageUrl,
    description: product.description,
    price: product.price,
    specifications: product.specifications,
    category: product.category
  };

  // Get related products from the same category
  const relatedProducts = productContext?.products
    .filter(p => product && p.category === product.category && p.slug !== productSlug)
    .slice(0, 3) || [];

  return (
    <>
      <Section background="white" paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative h-[600px] md:h-[800px] lg:h-[100px] rounded-xl overflow-hidden">
            <Image
              src={displayProduct.image}
              alt={displayProduct.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Product Details */}
          <div>
            {/* Product Title - Added for better visibility */}
            <h1 className="text-3xl font-bold text-black mb-4">{displayProduct.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {displayProduct.category.charAt(0).toUpperCase() + displayProduct.category.slice(1).replace(/-/g, ' ')}
              </span>
              
              {/* Product ID/SKU */}
              <span className="text-sm text-gray-500">Product ID: {displayProduct.id}</span>
            </div>
            
            {/* Price information */}
            {displayProduct.price ? (
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">₹{displayProduct.price.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-500">per unit</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Bulk discounts available</p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-lg font-medium">Contact for pricing</p>
                <p className="text-sm text-gray-600">Prices vary based on quantity and specifications</p>
              </div>
            )}
            
            {/* Availability */}
            <div className="flex items-center mb-6">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium text-green-700">In Stock</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-600">Usually ships within 3-5 business days</span>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">Description</h3>
              <div className="prose prose-blue max-w-none text-gray-600">
                <p className="text-lg">{displayProduct.description}</p>
              </div>
            </div>
            
            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {["Premium quality", "Sustainably sourced", "Industry-standard certified", "Consistent quality control"].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Specifications */}
            {displayProduct.specifications && typeof displayProduct.specifications === 'object' && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(displayProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="mt-1 text-base font-medium text-gray-900">{value as string}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Ready to Order?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  href={`mailto:info@b2bshowcase.com?subject=Inquiry about ${displayProduct.title} (ID: ${displayProduct.id})`}
                  variant="primary"
                  size="lg"
                  className="flex-1 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Request Quote
                </Button>
                
                <Button 
                  href="/contact"
                  variant="outline"
                  size="lg"
                  className="flex-1 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Request Samples
                </Button>
              </div>
              
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Bulk orders available.</span> Contact our sales team for volume discounts and customized solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      {relatedProducts.length > 0 && (
        <Section background="light">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  title={relatedProduct.name}
                  description={relatedProduct.description}
                  image={relatedProduct.imageUrl}
                  category={relatedProduct.category}
                  slug={relatedProduct.slug}
                  featured={relatedProduct.featured}
                  inStock={relatedProduct.inStock}
                />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
