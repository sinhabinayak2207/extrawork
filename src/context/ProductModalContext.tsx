"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import ProductModal from '@/components/products/ProductModal';

interface ProductModalContextType {
  openProductModal: (productId: string) => void;
  closeProductModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | null>(null);

export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within a ProductModalProvider');
  }
  return context;
};

interface ProductModalProviderProps {
  children: ReactNode;
}

export function ProductModalProvider({ children }: ProductModalProviderProps) {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const openProductModal = (productId: string) => {
    setActiveProductId(productId);
  };

  const closeProductModal = () => {
    setActiveProductId(null);
  };

  return (
    <ProductModalContext.Provider value={{ openProductModal, closeProductModal }}>
      {children}
      {activeProductId && (
        <ProductModal 
          productId={activeProductId} 
          onClose={closeProductModal} 
        />
      )}
    </ProductModalContext.Provider>
  );
}
