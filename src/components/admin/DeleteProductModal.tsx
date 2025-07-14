"use client";

import { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { logToSystem } from '@/components/SystemLog';

interface DeleteProductModalProps {
  productId: string | null;
  onClose: () => void;
}

export default function DeleteProductModal({ productId, onClose }: DeleteProductModalProps) {
  const productContext = useProducts();
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!productContext) {
    return <div className="p-4 text-red-500">Error: Product context not available</div>;
  }

  const { removeProduct, products } = productContext;
  
  const product = products.find(p => p.id === productId);
  
  const handleDeleteProduct = async () => {
    if (!productId) return;
    
    try {
      setIsDeleting(true);
      await removeProduct(productId);
      logToSystem(`Product ${product?.name || ''} deleted successfully`, 'success');
      onClose();
    } catch (error) {
      logToSystem(`Error deleting product: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Product</h2>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete {product?.name ? <span className="font-medium">"{product.name}"</span> : 'this product'}?
          </p>
          <p className="text-red-500 text-sm mb-6">This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
