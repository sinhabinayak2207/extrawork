"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import SystemLog, { logToSystem } from '@/components/SystemLog';
import MainLayout from '@/components/layout/MainLayout';
import AddProductForm from '@/components/admin/AddProductForm';
import DeleteProductModal from '@/components/admin/DeleteProductModal';

export default function ProductManagementPage() {
  const { user, isMasterAdmin } = useAuth();
  const productContext = useProducts();
  const router = useRouter();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  if (!productContext) {
    console.error('ProductContext is null in ProductManagementPage');
    return <MainLayout><div className="p-8">Error loading products</div></MainLayout>;
  }
  
  const { products, updateFeaturedStatus, updateStockStatus } = productContext;

  // Redirect if not authenticated or not an admin
  if (!user) {
    return <MainLayout><div className="p-8">Loading...</div></MainLayout>;
  }

  if (!isMasterAdmin) {
    return <MainLayout><div className="p-8">Access denied. Admin privileges required.</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Add, edit, or remove products from your catalog</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/changes')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center gap-2"
            >
              Back to Admin Panel
            </button>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="border rounded-lg overflow-hidden bg-white shadow-md">
              <div className="h-48 relative">
                <Image
                  src={product.imageUrl || '/placeholder-image.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <button 
                    onClick={() => {
                      setProductToDelete(product.id);
                      setShowDeleteProductModal(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Delete ${product.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
                {product.price && <p className="font-medium mb-2">₹{product.price.toLocaleString()}</p>}
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between border rounded p-2 flex-1">
                    <span className="text-sm font-medium">Featured</span>
                    <label className="relative inline-flex items-center cursor-pointer ml-2">
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
                    </label>
                  </div>
                  
                  {/* In Stock Toggle */}
                  <div className="flex items-center justify-between border rounded p-2 flex-1">
                    <span className="text-sm font-medium">In Stock</span>
                    <label className="relative inline-flex items-center cursor-pointer ml-2">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={product.inStock || false}
                        onChange={async () => {
                          try {
                            await updateStockStatus(product.id, !product.inStock);
                            logToSystem(`Product ${product.name} is now ${!product.inStock ? 'in stock' : 'out of stock'}`, 'success');
                          } catch (error) {
                            logToSystem(`Error updating stock status: ${error instanceof Error ? error.message : String(error)}`, 'error');
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* System Log */}
        <div className="mt-12">
          <SystemLog maxEntries={50} />
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
  );
}
