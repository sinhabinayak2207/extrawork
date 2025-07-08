"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../products/ProductCard';
import Section from '../ui/Section';
import Button from '../ui/Button';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/context/ProductContext';






const FeaturedProducts = () => {
  // Get products from context
  const productContext = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Get products from context
  useEffect(() => {
    if (productContext && productContext.products) {
      const featured = productContext.products.filter(product => product.featured === true);
      console.log('Found featured products:', featured.length);
      setFeaturedProducts(featured);
      
      // Only show products that are actually marked as featured
      // Do not automatically set products as featured if none are found
      console.log('Only showing products explicitly marked as featured');
      // Empty array is fine if no products are featured
    }
  }, [productContext, forceUpdate]);
  
  // Listen for product updates
  useEffect(() => {
    const handleProductUpdate = () => {
      console.log('Product update detected in FeaturedProducts');
      // Force re-render
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('productUpdated', handleProductUpdate);
    
    return () => {
      window.removeEventListener('productUpdated', handleProductUpdate);
    };
  }, []);
  
  // Don't render anything if there are no featured products
  if (featuredProducts.length === 0) {
    console.log('No featured products found, not rendering FeaturedProducts section');
    return null;
  }
  
  return (
    <Section background="white" id="featured-products">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-gray-700 font-bold mb-4 animate-fadeIn">
          Featured <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Products</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto animate-fadeIn delay-100">
          Discover our selection of premium bulk products, sourced from trusted suppliers worldwide.
          All our products meet the highest quality standards for your business needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn delay-200">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.description}
            image={product.imageUrl}
            category={product.category}
            slug={product.slug}
            featured={product.featured}
            inStock={product.inStock}
          />
        ))}
      </div>
      
      <div className="mt-12 text-center animate-fadeIn delay-300">
        <Button href="/products" size="lg">
          View All Products
        </Button>
      </div>
    </Section>
  );
};

export default FeaturedProducts;
