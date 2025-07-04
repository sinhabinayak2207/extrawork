"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useProducts } from '@/context/ProductContext';
import Section from '../ui/Section';
import Button from '../ui/Button';
import ProductCard from './ProductCard';
import { Product as MockProduct } from '@/types/product';

interface ProductDetailClientProps {
  serverProduct: any;
  productSlug: string;
  category: string;
}

export default function ProductDetailClient({ serverProduct, productSlug, category }: ProductDetailClientProps) {
  const { products } = useProducts();
  const [loading, setLoading] = useState(true);
  
  // Find the product from our global context
  const contextProduct = products.find(p => p.slug === productSlug);
  
  // Get related products from the same category
  const relatedProducts = products
    .filter(p => p.category === category && p.slug !== productSlug)
    .slice(0, 3);
  
  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);
  
  if (loading) {
    return (
      <Section background="white">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Section>
    );
  }
  
  // Use context product data with fallback to server data
  const product = contextProduct ? {
    ...serverProduct,
    title: contextProduct.name || serverProduct.title,
    image: contextProduct.imageUrl || serverProduct.image,
    description: contextProduct.description || serverProduct.description
  } : serverProduct;
  
  return (
    <>
      <Section background="white" paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Product Details */}
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
            </span>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              {product.description}
            </p>
            
            {/* Specifications */}
            {product.specifications && typeof product.specifications === 'object' && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
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
                href={`mailto:info@b2bshowcase.com?subject=Inquiry about ${product.title}`}
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
