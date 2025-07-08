"use client";

import Image from 'next/image';
import Link from 'next/link';
import ImageUploader from './ImageUploader';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useProductModal } from '@/context/ProductModalContext';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  slug: string;
  featured?: boolean;
  inStock?: boolean;
}

const ProductCard = ({
  id,
  title,
  description,
  image,
  category,
  slug,
  featured = false,
  inStock = true,
}: ProductCardProps) => {
  // Get auth context to check if user is master admin
  const { isMasterAdmin } = useAuth();
  // Get product modal context
  const { openProductModal } = useProductModal();
  // State to track the current image URL
  const [currentImage, setCurrentImage] = useState(image);
  
  // Add cache-busting to initial image if needed
  useEffect(() => {
    if (image) {
      // Always apply fresh cache-busting on component mount
      const timestamp = new Date().getTime();
      const cacheBustedUrl = image.includes('?') 
        ? `${image.split('?')[0]}?t=${timestamp}` 
        : `${image}?t=${timestamp}`;
      console.log(`ProductCard: Adding cache-busting to initial image: ${cacheBustedUrl}`);
      setCurrentImage(cacheBustedUrl);
    }
  }, [image]);
  
  // Listen for product update events
  useEffect(() => {
    const handleProductUpdate = (event: CustomEvent) => {
      // Handle both formats of event data
      const { 
        productId: updatedProductId, 
        productId, 
        imageUrl, 
        timestamp 
      } = event.detail;
      
      // Check if this event is for this product
      const eventProductId = updatedProductId || productId;
      
      if (eventProductId === id && imageUrl) {
        console.log(`ProductCard: Received update event for product ${id}`);
        
        // Apply fresh cache-busting
        const newTimestamp = new Date().getTime();
        const cacheBustedUrl = imageUrl.includes('?') 
          ? `${imageUrl.split('?')[0]}?t=${newTimestamp}` 
          : `${imageUrl}?t=${newTimestamp}`;
          
        console.log(`ProductCard: Updating image with cache-busting: ${cacheBustedUrl}`);
        setCurrentImage(cacheBustedUrl);
      }
    };
    
    // Add event listeners to both window and document
    window.addEventListener('productUpdated', handleProductUpdate as EventListener);
    document.addEventListener('productUpdated', handleProductUpdate as EventListener);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('productUpdated', handleProductUpdate as EventListener);
      document.removeEventListener('productUpdated', handleProductUpdate as EventListener);
    };
  }, [id]);
  
  // Create mailto link with product title in subject
  const mailtoLink = `mailto:info@b2bshowcase.com?subject=Inquiry about ${title}&body=I am interested in learning more about ${title}.`;

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 animate-fadeIn ${featured ? 'border-2 border-blue-500' : ''}`}
    >
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <Image
          src={currentImage || 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
        {isMasterAdmin && <ImageUploader productId={id} currentImageUrl={currentImage} />}
        {featured && (
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            Featured
          </div>
        )}
        <div className={`absolute bottom-0 left-0 text-xs font-bold px-3 py-1 rounded-tr-lg ${inStock ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-black hover:text-blue-600 transition-colors duration-300 cursor-pointer" onClick={() => openProductModal(id)}>
              {title}
            </h3>
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {category}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {description}
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button 
            onClick={() => openProductModal(id)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center transition-colors duration-300"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <a 
            href={mailtoLink}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;