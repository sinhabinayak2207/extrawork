"use client";

import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <div 
      className="relative group overflow-hidden rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300 animate-fadeIn"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="relative h-72 w-full">
        <Image
          src={image || 'https://lh3.googleusercontent.com/pw/AP1GczMJmz5XYZnIKL-uD_2FjEGAQbJ9xJABjv1Xt7Ov9Zt5BwJvdnNJJ_HXxRwVlmcKbgILEOkxcjkF4UNYfWvdJnZxlDDDlvEwjFAjpQxQJnvQHvs=w2400'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
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
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
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
