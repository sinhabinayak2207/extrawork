"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  slug: string;
  productCount?: number;
}

const CategoryCard = ({
  title,
  description,
  image,
  slug,
  productCount,
}: CategoryCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>(image || 'https://lh3.googleusercontent.com/pw/AP1GczMJmz5XYZnIKL-uD_2FjEGAQbJ9xJABjv1Xt7Ov9Zt5BwJvdnNJJ_HXxRwVlmcKbgILEOkxcjkF4UNYfWvdJnZxlDDDlvEwjFAjpQxQJnvQHvs=w2400');
  
  // For Cloudinary URLs, we don't need to add timestamps as they're already unique
  // Just use the image URL directly
  useEffect(() => {
    if (image) {
      // Check if this is a Cloudinary URL (contains cloudinary.com)
      if (image.includes('cloudinary.com')) {
        // Use the Cloudinary URL directly without modifications
        setImageUrl(image);
      } else {
        // For non-Cloudinary URLs, we still use timestamp to prevent caching
        const baseUrl = image.split('?')[0];
        const timestamp = new Date().getTime();
        setImageUrl(`${baseUrl}?t=${timestamp}`);
      }
    }
  }, [image]);
  
  // Listen for category updates
  useEffect(() => {
    const handleCategoryUpdate = (event: CustomEvent) => {
      // Check if this update is relevant to this category
      if (event.detail && event.detail.imageUpdated) {
        // If the update includes a new image URL, use it directly
        if (event.detail.updates && event.detail.updates.imageUrl) {
          setImageUrl(event.detail.updates.imageUrl);
        } else {
          // Otherwise force refresh with timestamp for non-Cloudinary URLs
          setImageUrl(current => {
            // If it's a Cloudinary URL, don't modify it
            if (current.includes('cloudinary.com')) {
              return current;
            }
            // Otherwise add a timestamp
            const baseUrl = current.split('?')[0];
            const timestamp = new Date().getTime();
            return `${baseUrl}?t=${timestamp}`;
          });
        }
      }
    };
    
    window.addEventListener('categoryUpdated', handleCategoryUpdate as EventListener);
    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdate as EventListener);
    };
  }, []);
  
  return (
    <div 
      className="relative group overflow-hidden rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300 animate-fadeIn"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="relative h-72 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized={true} // Disable Next.js image optimization to prevent caching
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="animate-fadeIn" style={{animationDelay: '200ms'}}>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-gray-200 mb-4 line-clamp-2 text-sm">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <Link 
              href={`/products/${slug}`}
              className="inline-flex items-center text-blue-300 hover:text-white font-medium transition-colors duration-300"
            >
              View Products
            </Link>
            
            {productCount !== undefined && (
              <span className="bg-blue-600/80 text-white text-xs font-bold px-2 py-1 rounded">
                {productCount} Products
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
