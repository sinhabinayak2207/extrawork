"use client";

import ProductCard from '../products/ProductCard';
import Section from '../ui/Section';
import Button from '../ui/Button';
import { useProducts } from '@/context/ProductContext';






const FeaturedProducts = () => {
  // Get products from context
  const { products } = useProducts();
  
  // Filter featured products
  const featuredProducts = products.filter(product => product.featured);

  return (
    <Section background="white" id="featured-products">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">
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
