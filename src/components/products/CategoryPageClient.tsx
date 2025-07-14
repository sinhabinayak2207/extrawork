"use client";

import { useState, useEffect } from "react";
import Section from "../ui/Section";
import ProductCard from "./ProductCard";
import { useProducts, Product } from "@/context/ProductContext";

interface CategoryPageClientProps {
  category: any;
  categorySlug: string;
}

export default function CategoryPageClient({ category, categorySlug }: CategoryPageClientProps) {
  const productContext = useProducts();
  const products = productContext?.products || [];
  const [loading, setLoading] = useState(true);
  
  // Filter products by category
  const categoryProducts = products.filter((product: Product) => 
    product.category.toLowerCase() === categorySlug.toLowerCase()
  );
  
  // Set loading to false once products are loaded
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
  
  return (
    <>
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-700">
            {category.title} <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {category.description}
          </p>
        </div>
      </Section>
      
      <Section background="white">
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => (
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
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No products found</h3>
            <p className="text-gray-600">
              There are currently no products available in this category.
              Please check back later or explore our other product categories.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
