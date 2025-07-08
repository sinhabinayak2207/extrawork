"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProductModal } from '@/context/ProductModalContext';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import SystemLog, { logToSystem } from '@/components/SystemLog';
import MainLayout from '@/components/layout/MainLayout';
import AddProductForm from '@/components/admin/AddProductForm';
import DeleteProductModal from '@/components/admin/DeleteProductModal';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';

export default function ProductManagementPage() {
  const { user, isMasterAdmin } = useAuth();
  const router = useRouter();
  const { openProductModal } = useProductModal();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'price'>('name');
  const productContext = useProducts();
  
  if (!productContext) {
    console.error('ProductContext is null in ProductManagementPage');
    return <MainLayout><div className="p-8 text-gray-100">Error loading products</div></MainLayout>;
  }
  
  const { products, updateFeaturedStatus, updateStockStatus } = productContext;

  return (
    <AdminAuthWrapper requireMasterAdmin={true}>
      <MainLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Product Management</h1>
              <p className="text-gray-400">Add, edit, or remove products from your catalog</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/admin/changes')}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-md flex items-center gap-2"
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
          
          {/* Product List */}
          <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <select
                    className="px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {/* Add category options here */}
                  </select>
                  <div className="flex">
                    <select
                      className="px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="name">Name</option>
                      <option value="category">Category</option>
                      <option value="price">Price</option>
                    </select>
                    <button
                      className="px-3 py-2 bg-gray-700 text-gray-100 border-t border-r border-b border-gray-600 rounded-r-md hover:bg-gray-600"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Items */}
            <div className="divide-y divide-gray-700">
              {products?.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-24 h-24 relative flex-shrink-0">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 rounded-md flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg text-white">{product.name}</h3>
                      <p className="text-gray-400">{product.category}</p>
                      <p className="text-gray-200">₹{product.price}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Featured:</span>
                        <button
                          onClick={() => updateFeaturedStatus(product.id, !product.featured)}
                          className={`w-12 h-6 rounded-full flex items-center ${
                            product.featured ? 'bg-blue-600 justify-end' : 'bg-gray-600 justify-start'
                          } transition-all duration-300`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white shadow-md block mx-0.5"></span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">In Stock:</span>
                        <button
                          onClick={() => updateStockStatus(product.id, !product.inStock)}
                          className={`w-12 h-6 rounded-full flex items-center ${
                            product.inStock ? 'bg-green-600 justify-end' : 'bg-gray-600 justify-start'
                          } transition-all duration-300`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white shadow-md block mx-0.5"></span>
                        </button>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => openProductModal(product.id)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product.id);
                            setShowDeleteProductModal(true);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </AdminAuthWrapper>
  );
}
