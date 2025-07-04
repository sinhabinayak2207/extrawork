"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import { FcUpload } from 'react-icons/fc';








export default function ChangesPage() {
  const { user, isMasterAdmin } = useAuth();
  const { products, updateProductImage } = useProducts();
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
    const file = event.target.files?.[0];
    if (!file) return;

    // Initialize upload status for this product
    setUploadStatus(prev => ({
      ...prev,
      [productId]: { loading: true, error: null, success: false }
    }));

    try {
      // For demo purposes, we'll just read the file as a data URL
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const newImageUrl = e.target?.result as string;
          
          // Update the product image in our global context
          updateProductImage(productId, newImageUrl, user?.email || 'unknown');
  
          // Set success status
          setUploadStatus(prev => ({
            ...prev,
            [productId]: { loading: false, error: null, success: true }
          }));
  
          // Reset success status after 3 seconds
          setTimeout(() => {
            setUploadStatus(prev => ({
              ...prev,
              [productId]: { loading: false, error: null, success: false }
            }));
          }, 3000);
        } catch (innerErr: any) {
          console.error('Error in FileReader onload:', innerErr);
          setUploadStatus(prev => ({
            ...prev,
            [productId]: { loading: false, error: innerErr.message || 'Failed to process image', success: false }
          }));
        }
      };
      
      reader.onerror = () => {
        setUploadStatus(prev => ({
          ...prev,
          [productId]: { loading: false, error: 'Failed to read file', success: false }
        }));
      };
      
      // Start reading the file as a data URL
      reader.readAsDataURL(file);

    } catch (err: any) {
      console.error('Error uploading image:', err);
      setUploadStatus(prev => ({
        ...prev,
        [productId]: { loading: false, error: err.message || 'Failed to upload image', success: false }
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
          {products.map((product) => (
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
                    <FcUpload className="w-5 h-5" />
                    {uploadStatus[product.id]?.loading ? 'Uploading...' : 'Replace Image'}
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
