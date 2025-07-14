"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  imageUrl: string;
};

const productCategories = [
  { id: 'rice', name: 'Rice' },
  { id: 'seeds', name: 'Seeds' },
  { id: 'oil', name: 'Oil' },
  { id: 'raw-polymers', name: 'Raw Polymers' },
  { id: 'bromine-salt', name: 'Bromine Salt' },
];

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('rice');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is authenticated and is an admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  // Load products for the selected category
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const productRef = ref(storage, `products/${selectedCategory}`);
        const productList = await listAll(productRef);
        
        const productData = await Promise.all(
          productList.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return {
              id: item.name,
              name: item.name.split('.')[0].replace(/-/g, ' '),
              imageUrl: url
            };
          })
        );
        
        setProducts(productData);
      } catch (err: any) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      loadProducts();
    }
  }, [selectedCategory, user, isAdmin]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const file = files[0];
      // Create a file name based on the original name but sanitized
      const fileName = file.name.toLowerCase().replace(/\s+/g, '-');
      const storageRef = ref(storage, `products/${selectedCategory}/${fileName}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      setUploadProgress(100);
      setSuccess('Image uploaded successfully!');
      
      // Refresh the product list
      const url = await getDownloadURL(storageRef);
      setProducts([...products, {
        id: fileName,
        name: fileName.split('.')[0].replace(/-/g, ' '),
        imageUrl: url
      }]);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product image?')) return;
    
    setError('');
    setSuccess('');
    
    try {
      const productRef = ref(storage, `products/${selectedCategory}/${productId}`);
      await deleteObject(productRef);
      
      // Update the product list
      setProducts(products.filter(product => product.id !== productId));
      setSuccess('Product image deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product image. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage product images</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              {isAdmin && <p className="text-xs text-blue-600">Admin</p>}
            </div>
          </div>
          
          {/* Category Selector */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Product Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            {/* Upload Form */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Upload New Product Image</label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Choose File
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <span className="ml-3 text-sm text-gray-500">
                  {uploading ? 'Uploading...' : 'JPG, PNG, GIF up to 10MB'}
                </span>
              </div>
              
              {/* Upload Progress */}
              {uploading && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 w-full">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 text-right">{uploadProgress}%</p>
                </div>
              )}
            </div>
            
            {/* Status Messages */}
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Product List */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Product Images</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                      <div className="relative w-full h-48">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">{product.name}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No product images found in this category.</p>
                  <p className="text-sm text-gray-400 mt-1">Upload images to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
