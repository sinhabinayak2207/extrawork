"use client";

import { useState, useEffect } from 'react';
import styles from './ProductModal.module.css';
import Image from 'next/image';
import { useProducts, Product } from '@/context/ProductContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

interface ProductModalProps {
  productId: string | null;
  onClose: () => void;
}

export default function ProductModal({ productId, onClose }: ProductModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const productContext = useProducts();
  const router = useRouter();
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Detect if user is on mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkIfMobile();
  }, []);
  
  // Fetch product data
  useEffect(() => {
    if (!productId || !productContext) {
      setLoading(false);
      setError('Invalid product ID or product context not available');
      return;
    }
    
    setLoading(true);
    
    // Find product in context
    const foundProduct = productContext.products.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setLoading(false);
    } else {
      setError('Product not found');
      setLoading(false);
    }
  }, [productId, productContext]);
  
  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
    >
      <div 
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700">{error}</p>
          </div>
        ) : product ? (
          <div className="flex flex-col md:flex-row">
            {/* Product Image - Increased size to take half of the modal */}
            <div className="w-full md:w-1/2 relative h-[600px] md:h-[600px]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-contain rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="w-full md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h2>
                {product.featured && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
              
              <div className="flex items-center mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="ml-3 text-sm text-gray-500">Category: {product.category}</span>
              </div>
              
              <div className="mb-6">
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {product.unit ? `₹${product.price} per ${product.unit}` : `₹${product.price || 'Price not available'}`}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {product.keyFeatures && product.keyFeatures.length > 0 ? (
  <div className="mb-6">
    <h3 className="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
    <ul className="list-disc pl-5 space-y-1 text-gray-700">
      {product.keyFeatures.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </div>
) : null}
              {/* Price is already displayed above with unit information */}
              
              {/* Only show specifications section if they exist */}
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Specifications</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-medium text-gray-700 w-1/3">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              
              <div className="flex flex-col space-y-4">
                {isMobile ? (
                  // For mobile users: Use mailto link that opens email app
                  <a 
                    href={`mailto:Trade@occworldtrade.com?subject=Inquiry about ${product.name}&body=I am interested in learning more about ${product.name}.`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-center font-medium transition-colors duration-300"
                  >
                    Contact Supplier
                  </a>
                ) : (
                  // For desktop users: Redirect to contact page with product info
                  <button
                    onClick={() => {
                      onClose(); // Close the modal first
                      router.push(`/contact?product=${encodeURIComponent(product.name)}`);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-center font-medium transition-colors duration-300"
                  >
                    Contact Supplier
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md text-center font-medium transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-700">The requested product could not be found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
