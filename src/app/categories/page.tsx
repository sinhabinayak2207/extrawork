"use client";

// Make this page dynamic to handle category image updates
export const dynamic = "auto";
export const revalidate = 0; // Revalidate on every request

import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import Section from "../../components/ui/Section";
import { Category, useCategories } from "../../context/CategoryContext";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function CategoriesPage() {
  // Use the categories from context to get live updates
  const { categories } = useCategories();
  const [enhancedCategories, setEnhancedCategories] = useState<Category[]>([]);
  const [timestamp, setTimestamp] = useState(Date.now());
  
  // Listen for category updates
  useEffect(() => {
    setEnhancedCategories(categories);
    
    // Listen for category update events
    const handleCategoryUpdate = () => {
      // Update timestamp to force image refresh
      setTimestamp(Date.now());
      setEnhancedCategories([...categories]);
    };
    
    window.addEventListener('categoryUpdated', handleCategoryUpdate);
    window.addEventListener('refreshCategories', handleCategoryUpdate);
    
    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdate);
      window.removeEventListener('refreshCategories', handleCategoryUpdate);
    };
  }, [categories]);

  return (
    <MainLayout>
      <Section background="light" paddingY="lg">
        {/* Hero Banner */}
        
        {/* Category Stats */}
       
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">
            Browse Our <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto animate-fadeIn animation-delay-200">
            Select from our wide range of product categories to find exactly what your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enhancedCategories.map((category: Category) => (
            <Link 
              href={`/products/${category.slug}`} 
              key={category.id}
              className="group bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={`${category.imageUrl || "/images/placeholder-category.jpg"}${category.imageUrl?.includes('?') ? '&' : '?'}t=${timestamp}`}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={true} /* Disable Next.js image optimization to prevent caching */
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors flex items-center">
                    View Products
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {category.productCount} Products
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom Category CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-4">Need a Custom Category?</h2>
              <p className="text-gray-600 mb-6">
                Don't see what you're looking for? We can source custom products and create specialized categories
                tailored to your business requirements. Our procurement team has extensive experience in finding
                hard-to-source materials and products from around the world.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Our Sourcing Team
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            <div className="md:w-1/3 relative h-48 w-full rounded-lg overflow-hidden">
              <Image 
                src="/images/custom-sourcing.jpg" 
                alt="Custom Sourcing" 
                fill 
                className="object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1769&auto=format&fit=crop";
                }}
              />
            </div>
          </div>
        </div>
        
        
      </Section>
    </MainLayout>
  );
}
