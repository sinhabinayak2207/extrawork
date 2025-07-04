"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateProductImage as updateFirebaseProductImage } from '@/lib/firebase-db';
import { replaceImage } from '@/lib/firebase-storage';
import { Product as FirebaseProduct } from '@/lib/firebase-db';

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
  price?: number;
  specifications?: Record<string, string>;
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

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  // Set initial products from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Import dynamically to avoid SSR issues
        const { getAllProducts } = await import('@/lib/firebase-db');
        const firebaseProducts = await getAllProducts();
        
        if (firebaseProducts && firebaseProducts.length > 0) {
          // Convert Firebase products to our Product type format
          const formattedProducts = firebaseProducts.map((product: FirebaseProduct) => ({
            ...product,
            slug: product.name.toLowerCase().replace(/\s+/g, '-'), // Generate slug from name
            featured: false, // Default value for featured
            updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt)
          }));
          
          setProducts(formattedProducts as Product[]);
          console.log('Fetched products from Firebase:', formattedProducts);
          
          // Update localStorage with the latest data
          localStorage.setItem('products', JSON.stringify(formattedProducts));
        } else {
          // Fallback to localStorage
          try {
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
              const parsedProducts = JSON.parse(storedProducts);
              
              // Convert string dates back to Date objects
              const hydratedProducts = parsedProducts.map((product: any) => ({
                ...product,
                updatedAt: new Date(product.updatedAt)
              }));
              
              setProducts(hydratedProducts);
              console.log('Hydrated products from localStorage:', hydratedProducts);
            } else {
              // If no products in localStorage, use initial data
              setProducts(initialProducts);
              console.log('No products in Firebase or localStorage, using initial data');
            }
          } catch (e) {
            console.error('Error hydrating products from localStorage:', e);
            setProducts(initialProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching products from Firebase:', error);
        
        // Fallback to localStorage
        try {
          const storedProducts = localStorage.getItem('products');
          if (storedProducts) {
            const parsedProducts = JSON.parse(storedProducts);
            setProducts(parsedProducts.map((product: any) => ({
              ...product,
              updatedAt: new Date(product.updatedAt)
            })));
          } else {
            setProducts(initialProducts);
          }
        } catch (e) {
          console.error('Error hydrating products from localStorage:', e);
          setProducts(initialProducts);
        }
      }
    };
    
    fetchProducts();
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

  const updateProductImage = async (productId: string, newImageUrl: string, updatedBy: string) => {
    try {
      // Update Firebase first
      console.log('Updating product image in Firebase:', productId);
      // Import dynamically to avoid SSR issues
      const { updateProductImage: updateFirebaseImage } = await import('@/lib/firebase-db');
      await updateFirebaseImage(productId, newImageUrl, updatedBy);
      console.log('Product image updated in Firebase');
      
      // Find the product to update
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            imageUrl: newImageUrl,
            updatedAt: new Date(),
            updatedBy
          };
        }
        return product;
      });
      
      // Update state
      setProducts(updatedProducts);
      
      // Update localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      // Dispatch a custom event to notify other components
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('productUpdated', { detail: { productId } });
        window.dispatchEvent(event);
        console.log('Dispatched productUpdated event from ProductContext');
      }
      
      return true; // Return success
    } catch (error) {
      console.error('Error updating product image:', error);
      return false; // Return failure
    }
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
