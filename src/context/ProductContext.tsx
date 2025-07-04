"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: string;
  featured?: boolean;
  updatedAt: Date;
  updatedBy: string;
}

// Initial product data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Basmati Rice',
    slug: 'premium-basmati-rice',
    description: 'Long-grain aromatic rice known for its nutty flavor and floral aroma. Perfect for pilaf, biryani, and other rice dishes.',
    imageUrl: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'rice',
    featured: true,
    updatedAt: new Date(),
    updatedBy: 'system'
  },
  {
    id: '2',
    name: 'Organic Sunflower Seeds',
    slug: 'organic-sunflower-seeds',
    description: 'High-quality organic sunflower seeds rich in nutrients and perfect for oil production or direct consumption.',
    imageUrl: 'https://images.pexels.com/photos/326158/pexels-photo-326158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'seeds',
    featured: true,
    updatedAt: new Date(),
    updatedBy: 'system'
  },
  {
    id: '3',
    name: 'Refined Soybean Oil',
    slug: 'refined-soybean-oil',
    description: 'Pure refined soybean oil suitable for cooking, food processing, and industrial applications.',
    imageUrl: 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'oil',
    featured: true,
    updatedAt: new Date(),
    updatedBy: 'system'
  },
  {
    id: '4',
    name: 'High-Density Polyethylene',
    slug: 'high-density-polyethylene',
    description: 'Industrial-grade HDPE polymer with excellent impact resistance and tensile strength for manufacturing.',
    imageUrl: 'https://images.pexels.com/photos/2233416/pexels-photo-2233416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'raw-polymers',
    featured: false,
    updatedAt: new Date(),
    updatedBy: 'system'
  },
  {
    id: '5',
    name: 'Calcium Bromide Solution',
    slug: 'calcium-bromide-solution',
    description: 'High-purity calcium bromide solution used in oil drilling, pharmaceuticals, and other industrial applications.',
    imageUrl: 'https://images.pexels.com/photos/6074935/pexels-photo-6074935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'bromine-salt',
    featured: false,
    updatedAt: new Date(),
    updatedBy: 'system'
  },
  {
    id: '6',
    name: 'Jasmine Rice',
    slug: 'jasmine-rice',
    description: 'Fragrant, long-grain rice with a subtle floral aroma, ideal for Asian cuisine and everyday meals.',
    imageUrl: 'https://images.pexels.com/photos/7421208/pexels-photo-7421208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'rice',
    featured: false,
    updatedAt: new Date(),
    updatedBy: 'system'
  }
];

type ProductContextType = {
  products: Product[];
  updateProductImage: (productId: string, newImageUrl: string, updatedBy: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  // Try to load products from localStorage on initial render
  const [products, setProducts] = useState<Product[]>(() => {
    // Always initialize with our default products first
    let productsToUse = [...initialProducts];
    
    // Then try to load from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
          // Parse dates properly
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            productsToUse = parsed.map((product: any) => ({
              ...product,
              updatedAt: new Date(product.updatedAt)
            }));
            console.log('Loaded products from localStorage:', productsToUse);
          } else {
            console.log('No valid products in localStorage, using defaults');
            // Force save the initial products to localStorage
            localStorage.setItem('products', JSON.stringify(initialProducts));
          }
        } else {
          console.log('No products in localStorage, using defaults');
          // Force save the initial products to localStorage
          localStorage.setItem('products', JSON.stringify(initialProducts));
        }
      } catch (e) {
        console.error('Error parsing products from localStorage:', e);
        // Force save the initial products to localStorage
        localStorage.setItem('products', JSON.stringify(initialProducts));
      }
    }
    return productsToUse;
  });
  
  // Initialize products on client side
  useEffect(() => {
    // This ensures we load from localStorage after hydration
    if (typeof window !== 'undefined') {
      try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hydratedProducts = parsed.map((product: any) => ({
              ...product,
              updatedAt: new Date(product.updatedAt)
            }));
            setProducts(hydratedProducts);
            console.log('Hydrated products from localStorage after mount');
          }
        }
      } catch (e) {
        console.error('Error hydrating products from localStorage:', e);
      }
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Make sure we're not saving an empty array
        if (products && products.length > 0) {
          localStorage.setItem('products', JSON.stringify(products));
          console.log('Saved products to localStorage:', products);
        } else {
          console.error('Attempted to save empty products array, using defaults instead');
          localStorage.setItem('products', JSON.stringify(initialProducts));
        }
      } catch (e) {
        console.error('Error saving products to localStorage:', e);
      }
    }
  }, [products]);

  const updateProductImage = (productId: string, newImageUrl: string, updatedBy: string) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => 
        product.id === productId 
          ? { ...product, imageUrl: newImageUrl, updatedAt: new Date(), updatedBy } 
          : product
      );
      
      // Force save to localStorage immediately
      if (typeof window !== 'undefined') {
        try {
          // Stringify with proper date handling
          localStorage.setItem('products', JSON.stringify(updatedProducts));
          console.log('Immediately saved updated products to localStorage');
          
          // Verify the save worked by reading it back
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            console.log('Verification - Read back from localStorage:', parsed);
          }
        } catch (e) {
          console.error('Error saving updated products to localStorage:', e);
        }
      }
      
      return updatedProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ products, updateProductImage }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
