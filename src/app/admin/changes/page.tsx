"use client";

import { useState, useEffect, useRef } from 'react';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import AddProductForm from '@/components/admin/AddProductForm';
import DeleteProductModal from '@/components/admin/DeleteProductModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import Image from 'next/image';
import SystemLog, { logToSystem } from '@/components/SystemLog';
import MainLayout from '@/components/layout/MainLayout';
import { replaceImage } from '@/lib/cloudinary';

interface Category {
  id: string;
  name: string;
}

const productCategories: Category[] = [
  { id: 'rice', name: 'Rice' },
  { id: 'seeds', name: 'Seeds' },
  { id: 'oil', name: 'Oil' },
  { id: 'raw-polymers', name: 'Raw Polymers' },
  { id: 'bromine-salt', name: 'Bromine Salt' },
];

export default function ChangesPage() {
  const { user, isMasterAdmin } = useAuth();
  const productContext = useProducts();
  const categoryContext = useCategories();
  const router = useRouter();
  
  if (!productContext) {
    console.error('ProductContext is null in ChangesPage');
    return <MainLayout><div className="p-8">Error loading products</div></MainLayout>;
  }
  
  if (!categoryContext) {
    console.error('CategoryContext is null in ChangesPage');
    return <MainLayout><div className="p-8">Error loading categories</div></MainLayout>;
  }
  
  const { products, updateProductImage, updateFeaturedStatus, updateStockStatus } = productContext;
  const { categories, updateCategoryFeaturedStatus, updateCategoryImage } = categoryContext;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, { isUploading: boolean, error: string | null, success: boolean }>>({});
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Track overall system status
  const [systemStatus, setSystemStatus] = useState<{
    productsLoaded: boolean;
    firestoreConnected: boolean;
    cloudinaryConfigured: boolean;
  }>({
    productsLoaded: false,
    firestoreConnected: false,
    cloudinaryConfigured: false
  });

  useEffect(() => {
    // Set loading to false once we have user data
    if (user !== undefined) {
      setLoading(false);
    }
    
    // Redirect if not master admin
    if (user && !isMasterAdmin) {
      router.push('/');
    }
    
    // Log system initialization
    if (user && isMasterAdmin) {
      logToSystem('Admin changes page loaded', 'info');
      logToSystem(`Logged in as: ${user.email}`, 'info');
      
      // Check if products are loaded
      if (products && products.length > 0) {
        logToSystem(`${products.length} products loaded from context`, 'success');
        setSystemStatus(prev => ({ ...prev, productsLoaded: true }));
      } else {
        logToSystem('No products loaded from context', 'error');
      }
      
      // Check Firestore connection
      const apiUrl = window.location.origin + '/api/health-check/firestore';
      logToSystem(`Checking Firestore connection at: ${apiUrl}`, 'info');
      
      fetch(apiUrl, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.status === 'ok') {
            logToSystem('Firestore connection verified', 'success');
            setSystemStatus(prev => ({ ...prev, firestoreConnected: true }));
          } else {
            logToSystem('Firestore connection issue: ' + data.message, 'error');
          }
        })
        .catch(err => {
          logToSystem('Failed to verify Firestore connection: ' + err.message, 'error');
        });
      
      // Check Cloudinary configuration
      const cloudName = 'doa53gfwf';
      const uploadPreset = 'b2b_showcase';
      logToSystem(`Cloudinary config: cloud_name=${cloudName}, upload_preset=${uploadPreset}`, 'info');
      
      // Verify Cloudinary configuration by making a simple ping request to their API
      // This is more reliable than checking private upload presets
      fetch(`https://res.cloudinary.com/${cloudName}/image/upload/sample`, { 
        method: 'HEAD',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        .then(res => {
          if (res.ok) {
            logToSystem('Cloudinary connection verified', 'success');
            setSystemStatus(prev => ({ ...prev, cloudinaryConfigured: true }));
          } else {
            logToSystem(`Cloudinary connection issue: ${res.status} ${res.statusText}`, 'error');
          }
        })
        .catch(err => {
          logToSystem('Failed to verify Cloudinary config: ' + err.message, 'error');
        });
      
      // Also check if we can access the upload API endpoint
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { 
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin
        }
      })
        .then(res => {
          if (res.ok || res.status === 204) {
            logToSystem('Cloudinary upload API accessible (CORS configured correctly)', 'success');
          } else {
            logToSystem(`Cloudinary upload API issue: ${res.status} ${res.statusText}`, 'info');
          }
        })
        .catch(err => {
          // This might fail due to CORS, which is actually expected and not a problem
          logToSystem('Cloudinary upload API check: ' + err.message, 'info');
          // We'll still consider Cloudinary configured if the first check passed
        });
    }
    
    setLoading(false);
  }, [user, isMasterAdmin, router, products]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    if (!e.target.files || e.target.files.length === 0) {
      logToSystem(`No file selected for product ${productId}`, 'error');
      return;
    }
    
    const file = e.target.files[0];
    
    try {
      // Update upload status
      setUploadStatus(prev => ({
        ...prev,
        [productId]: { isUploading: true, error: null, success: false }
      }));
      
      logToSystem(`Uploading image for product ${productId}...`, 'info');
      
      // Import dynamically to avoid SSR issues
      logToSystem('Importing Cloudinary utilities...', 'info');
      const { replaceImage } = await import('@/lib/cloudinary');
      
      // Upload image to Cloudinary
      logToSystem(`Uploading image to Cloudinary for product ${productId}...`, 'info');
      const imageUrl = await replaceImage(file, `products/${productId}`);
      
      if (!imageUrl) {
        throw new Error('Cloudinary upload succeeded but returned an empty URL');
      }
      
      logToSystem(`Image uploaded successfully to Cloudinary: ${imageUrl}`, 'success');
      
      // Update product in Firestore
      if (productContext) {
        logToSystem(`Updating product ${productId} in Firestore with new image URL...`, 'info');
        try {
          await productContext.updateProductImage(productId, imageUrl);
          logToSystem(`Product ${productId} updated successfully in Firestore`, 'success');
          
          // Dispatch a custom event to notify other components
          const eventData = { 
            productId, 
            imageUrl,
            timestamp: new Date().getTime()
          };
          
          logToSystem('Dispatching productUpdated event...', 'info');
          const event = new CustomEvent('productUpdated', { 
            detail: eventData,
            bubbles: true
          });
          
          window.dispatchEvent(event);
          document.dispatchEvent(event);
          logToSystem('ProductUpdated event dispatched', 'success');
          
          // Update upload status
          setUploadStatus(prev => ({
            ...prev,
            [productId]: { isUploading: false, error: null, success: true }
          }));
        } catch (error) {
          throw new Error('Failed to update product in Firestore');
        }
      } else {
        throw new Error('Product context is not available');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Update upload status with error
      setUploadStatus(prev => ({
        ...prev,
        [productId]: {
          isUploading: false,
          error: error instanceof Error ? error.message : 'Failed to upload image',
          success: false
        }
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
    <AdminAuthWrapper requireMasterAdmin={true}>
      <MainLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Admin Dashboard
              </h1>
              <p className="mt-3 text-xl text-gray-500">
                Manage your B2B showcase system
              </p>
            </div>
        
        
        
        
        {/* Featured Categories Management Section */}
        <div className="mb-12 bg-black rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Featured Categories Management</h2>
          <p className="text-gray-300 mb-4">Toggle categories to show in the Featured Categories section on the home page (maximum 3).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-700 bg-black rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative rounded overflow-hidden mr-3">
                      <Image
                        src={category.image || '/placeholder-image.jpg'}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{category.title}</h3>
                      <p className="text-sm text-gray-300">{category.productCount} products</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-0 justify-between">
                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between border border-gray-700 bg-gray-900 rounded p-2">
                    <span className="text-sm font-medium mr-3 text-white">Featured</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={category.featured || false}
                        onChange={async () => {
                          try {
                            // If trying to enable and already have 3 featured categories
                            if (!category.featured) {
                              const featuredCount = categories.filter(c => c.featured).length;
                              if (featuredCount >= 3) {
                                alert('You can only feature up to 3 categories. Please unfeature one first.');
                                return;
                              }
                            }
                            
                            await updateCategoryFeaturedStatus(category.id, !category.featured);
                            logToSystem(`Category ${category.title} is now ${!category.featured ? 'featured' : 'unfeatured'}`, 'success');
                          } catch (error) {
                            logToSystem(`Error updating featured status: ${error instanceof Error ? error.message : String(error)}`, 'error');
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-white">
                        {category.featured ? 'Featured' : 'Not Featured'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Management Section */}
        <div className="mb-12 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
              <p className="text-gray-600">Manage products and featured status (maximum 3 featured).</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin/products')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center gap-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Manage Products
              </button>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product: any) => (
              <div key={product.id} className="border border-gray-700 rounded-lg p-4 bg-black hover:shadow-md transition-shadow text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative rounded overflow-hidden mr-3">
                      <Image
                        src={product.imageUrl || '/placeholder-image.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{product.name}</h3>
                      <p className="text-sm text-gray-300">{product.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setProductToDelete(product.id);
                      setShowDeleteProductModal(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-0 justify-between">
                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between border border-gray-700 bg-gray-900 rounded p-2">
                    <span className="text-sm font-medium mr-3 text-white">Featured</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={product.featured || false}
                        onChange={async () => {
                          try {
                            // If trying to enable and already have 3 featured products
                            if (!product.featured) {
                              const featuredCount = products.filter(p => p.featured).length;
                              if (featuredCount >= 3) {
                                alert('You can only feature up to 3 products. Please unfeature one first.');
                                return;
                              }
                            }
                            
                            await updateFeaturedStatus(product.id, !product.featured);
                            logToSystem(`Product ${product.name} is now ${!product.featured ? 'featured' : 'unfeatured'}`, 'success');
                          } catch (error) {
                            logToSystem(`Error updating featured status: ${error instanceof Error ? error.message : String(error)}`, 'error');
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-white">
                        {product.featured ? 'Featured' : 'Not Featured'}
                      </span>
                    </label>
                  </div>
                  
                  {/* In Stock Toggle */}
                  <div className="flex items-center justify-between border border-gray-700 bg-gray-900 rounded p-2">
                    <span className="text-sm font-medium mr-3 text-white">Stock Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={product.inStock !== false} // Default to true if undefined
                        onChange={async () => {
                          try {                            
                            await updateStockStatus(product.id, !(product.inStock !== false));
                            logToSystem(`Product ${product.name} is now ${!(product.inStock !== false) ? 'in stock' : 'out of stock'}`, 'success');
                          } catch (error) {
                            logToSystem(`Error updating stock status: ${error instanceof Error ? error.message : String(error)}`, 'error');
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      <span className="ms-3 text-sm font-medium text-white">
                        {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Cards Section */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product: any) => (
            <div key={`card-${product.id}`} className="bg-black border border-gray-700 rounded-lg shadow-md overflow-hidden text-white">
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
                <h3 className="text-lg font-medium text-white">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-300">{product.category}</p>
                <p className="mt-1 text-sm text-gray-300 truncate">{product.description}</p>
                
                <div className="mt-4">
                  <label 
                    htmlFor={`image-upload-${product.id}`}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors w-full"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {uploadStatus[product.id]?.isUploading ? 'Uploading...' : 'Replace Image'}
                    </div>
                  </label>
                  <input
                    id={`image-upload-${product.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, product.id)}
                    disabled={uploadStatus[product.id]?.isUploading}
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
      <div className="mt-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${systemStatus.productsLoaded ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${systemStatus.productsLoaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Products Loaded</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${systemStatus.firestoreConnected ? 'bg-green-900' : 'bg-red-900'} text-white`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${systemStatus.firestoreConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Firestore Connected</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${systemStatus.cloudinaryConfigured ? 'bg-green-900' : 'bg-red-900'} text-white`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${systemStatus.cloudinaryConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Cloudinary Configured</span>
              </div>
            </div>
          </div>
        </div>
        
        <SystemLog maxEntries={100} />
      </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <AddProductForm onClose={() => setShowAddProductModal(false)} />
      )}

      {/* Delete Product Modal */}
      {showDeleteProductModal && (
        <DeleteProductModal 
          productId={productToDelete} 
          onClose={() => {
            setShowDeleteProductModal(false);
            setProductToDelete(null);
          }} 
        />
      )}
    </MainLayout>
    </AdminAuthWrapper>
  );
}
