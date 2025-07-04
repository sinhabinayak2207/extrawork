"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { replaceImage } from '@/lib/cloudinary';

export default function ChangesPage() {
  const { user, isMasterAdmin } = useAuth();
  const productContext = useProducts();
  
  if (!productContext) {
    console.error('ProductContext is null in ChangesPage');
    return <MainLayout><div className="p-8">Error loading products</div></MainLayout>;
  }
  
  const { products, updateProductImage } = productContext;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, { loading: boolean; error: string | null; success: boolean }>>({});

  useEffect(() => {
    // Redirect if not master admin
    if (!loading && !isMasterAdmin) {
      router.push('/');
    }
  }, [isMasterAdmin, loading, router]);

  useEffect(() => {
    // Check if products are loaded from context
    if (products && products.length > 0) {
      setLoading(false);
    } else {
      setError('No products found. Please check your data source.');
      setLoading(false);
    }
    
    // Listen for product update events
    const handleProductUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Product update detected in admin changes page:', customEvent.detail);
      
      // Clear any upload status for the updated product
      if (customEvent.detail && customEvent.detail.productId) {
        setUploadStatus(prev => ({
          ...prev,
          [customEvent.detail.productId]: { loading: false, error: null, success: true }
        }));
        
        // Reset success status after 3 seconds
        setTimeout(() => {
          setUploadStatus(prev => ({
            ...prev,
            [customEvent.detail.productId]: { loading: false, error: null, success: false }
          }));
        }, 3000);
      }
    };
    
    window.addEventListener('productUpdated', handleProductUpdate);
    
    return () => {
      window.removeEventListener('productUpdated', handleProductUpdate);
    };
  }, [products]);

  const handleImageUpload = async (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // Set loading state for this product
    setUploadStatus(prev => ({
      ...prev,
      [productId]: { loading: true, error: null, success: false }
    }));
    
    try {
      // Generate a folder path for Cloudinary
      const folder = `products/${productId}`;
      
      // Upload the image to Cloudinary
      console.log('Uploading image to Cloudinary:', folder);
      const downloadURL = await replaceImage(file, folder);
      console.log('Image uploaded successfully, URL:', downloadURL);
      
      // Update the product in our global context which will also update Firebase
      await updateProductImage(productId, downloadURL, user?.email || 'unknown');
      
      // Update status
      setUploadStatus(prev => ({
        ...prev,
        [productId]: { loading: false, error: null, success: true }
      }));
      
      // Reset success after 3 seconds
      setTimeout(() => {
        setUploadStatus(prev => {
          // Only reset if it's still showing success
          if (prev[productId]?.success) {
            return {
              ...prev,
              [productId]: { loading: false, error: null, success: false }
            };
          }
          return prev;
        });
      }, 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus(prev => ({
        ...prev,
        [productId]: { loading: false, error: 'Failed to upload image', success: false }
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isMasterAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Product Image Management
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Update product images as the master administrator
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product: any) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={product.imageUrl || '/placeholder-image.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                <p className="mt-1 text-sm text-gray-500 truncate">{product.description}</p>
                
                <div className="mt-4">
                  <label 
                    htmlFor={`image-upload-${product.id}`}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors w-full"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {uploadStatus[product.id]?.loading ? 'Uploading...' : 'Replace Image'}
                    </div>
                  </label>
                  <input
                    id={`image-upload-${product.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(product.id, e)}
                    disabled={uploadStatus[product.id]?.loading}
                    className="hidden"
                  />
                  
                  {uploadStatus[product.id]?.error && (
                    <p className="text-red-500 mt-2 text-sm">{uploadStatus[product.id].error}</p>
                  )}
                  
                  {uploadStatus[product.id]?.success && (
                    <p className="text-green-500 mt-2 text-sm">Image updated successfully!</p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {product.updatedAt?.toLocaleString() || 'Never'}
                    {product.updatedBy && <> by {product.updatedBy}</>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
