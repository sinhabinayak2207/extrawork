"use client";

import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/context/ProductContext';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import ImageUploader from './ImageUploader';
import Section from '../ui/Section';
import Button from '../ui/Button';
import ProductCard from './ProductCard';
import { Product as MockProduct } from '@/types/product';

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

export default function ProductDetailClient({ serverProduct, productSlug }: ProductDetailClientProps) {
  const productContext = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Listen for product update events
  useEffect(() => {
    const handleProductUpdate = (event: CustomEvent<{productId: string}>) => {
      const { productId } = event.detail;
      console.log('ProductDetailClient received productUpdated event for:', productId);
      
      // If this is our product, force a re-render
      if (product && product.id === productId) {
        console.log('Forcing re-render of ProductDetailClient');
        setForceUpdate(prev => prev + 1);
      }
    };
    
    window.addEventListener('productUpdated', handleProductUpdate as EventListener);
    
    return () => {
      window.removeEventListener('productUpdated', handleProductUpdate as EventListener);
    };
  }, [product]);
  
  // Find the product from context or use server product
  useEffect(() => {
    if (!productContext) {
      // If context is not available, use server product
      if (serverProduct) {
        // Convert server product to our Product type
        const convertedProduct: Product = {
          id: serverProduct.id,
          name: serverProduct.title,
          slug: productSlug,
          description: serverProduct.description,
          imageUrl: serverProduct.image,
          category: serverProduct.category,
          price: serverProduct.price,
          specifications: serverProduct.specifications,
          updatedAt: new Date(),
          updatedBy: 'system'
        };
        setProduct(convertedProduct);
      }
      setLoading(false);
      return;
    }
    
    // Try to find the product in our context first
    const contextProduct = productContext.products.find(p => p.slug === productSlug);
    
    if (contextProduct) {
      setProduct(contextProduct);
    } else if (serverProduct) {
      // Fall back to server product if not in context
      // Convert server product to our Product type
      const convertedProduct: Product = {
        id: serverProduct.id,
        name: serverProduct.title,
        slug: productSlug,
        description: serverProduct.description,
        imageUrl: serverProduct.image,
        category: serverProduct.category,
        price: serverProduct.price,
        specifications: serverProduct.specifications,
        updatedAt: new Date(),
        updatedBy: 'system'
      };
      setProduct(convertedProduct);
    } else {
      setProduct(null);
    }
    
    setLoading(false);
  }, [productContext, serverProduct, productSlug, forceUpdate]);
  
  if (loading) {
    return (
      <Section background="white">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Section>
    );
  }
  
  if (!product) {
    return <div>Product not found</div>;
  }

  // Convert Product type to match the UI expectations
  const displayProduct = {
    id: product.id,
    title: product.name,
    image: product.imageUrl,
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
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
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
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              {displayProduct.category.charAt(0).toUpperCase() + displayProduct.category.slice(1).replace('-', ' ')}
            </span>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{displayProduct.title}</h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              {displayProduct.description}
            </p>
            
            {/* Specifications */}
            {displayProduct.specifications && typeof displayProduct.specifications === 'object' && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
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
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                href={`mailto:info@b2bshowcase.com?subject=Inquiry about ${displayProduct.title}`}
                variant="primary"
                size="lg"
              >
                Contact for Pricing
              </Button>
              
              <Button 
                href="/contact"
                variant="outline"
                size="lg"
              >
                Request Samples
              </Button>
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
                />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
