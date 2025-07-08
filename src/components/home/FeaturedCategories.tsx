"use client";

import { useEffect, useState } from 'react';
import CategoryCard from '../products/CategoryCard';
import Section from '../ui/Section';
import { useCategories } from '@/context/CategoryContext';
import Link from 'next/link';

// Fallback data in case context is not available
const fallbackCategories = [
  {
    id: '1',
    title: 'Rice',
    slug: 'rice',
    description: 'Premium quality rice varieties sourced from the finest farms worldwide.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 8
  },
  {
    id: '2',
    title: 'Seeds',
    slug: 'seeds',
    description: 'High-yield agricultural seeds for various crops and growing conditions.',
    image: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 12
  },
  {
    id: '3',
    title: 'Oil',
    slug: 'oil',
    description: 'Refined and crude oils for industrial and commercial applications.',
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 6
  }
];

const FeaturedCategories = () => {
  const categoryContext = useCategories();
  const [categoryUpdateTrigger, setCategoryUpdateTrigger] = useState(0);
  
  // Use featured categories from context if available, otherwise use fallback
  const displayCategories = categoryContext?.featuredCategories?.length > 0 
    ? categoryContext.featuredCategories 
    : fallbackCategories;

  // Listen for category updates
  useEffect(() => {
    const handleCategoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Category update detected in FeaturedCategories:', customEvent.detail);
      
      // Force a re-render by updating the state
      setCategoryUpdateTrigger(prev => prev + 1);
    };
    
    window.addEventListener('categoryUpdated', handleCategoryUpdate);
    
    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdate);
    };
  }, []);

  return (
    <Section background="light" id="categories">
      <div className="text-center mb-12">
        <h2 
          className="text-3xl md:text-4xl text-gray-700 font-bold mb-4 animate-fadeIn"
        >
          Our Product <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Categories</span>
        </h2>
        <p 
          className="text-gray-600 max-w-2xl mx-auto animate-fadeIn animation-delay-200"
        >
          Explore our extensive range of high-quality bulk products for your business needs.
          We source the finest materials from trusted suppliers worldwide.
        </p>
      </div>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn animation-delay-300"
      >
        {displayCategories.map((category) => (
          <CategoryCard
            key={`${category.id}-${categoryUpdateTrigger}`}
            title={category.title}
            description={category.description}
            image={`${category.image || '/placeholder-image.jpg'}${category.image?.includes('?') ? '&' : '?'}t=${categoryUpdateTrigger}`}
            slug={category.slug}
            productCount={category.productCount}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/categories"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 transition-colors duration-300"
        >
          View All Categories
        </Link>
      </div>
    </Section>
  );
};

export default FeaturedCategories;
