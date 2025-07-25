"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { 
  addCategory as addFirebaseCategory, 
  removeCategory as removeFirebaseCategory,
  updateCategoryImage as updateFirebaseCategoryImage
} from '@/lib/firebase-db';
import { useProducts, Product } from './ProductContext';

export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  imageUrl?: string; // Added for compatibility with new components
  productCount: number;
  featured?: boolean;
  updatedAt?: Date;
  updatedBy?: string;
}

// Initial category data
export const initialCategories: Category[] = [
  {
    id: '1',
    title: 'Rice',
    slug: 'rice',
    description: 'Premium quality rice varieties sourced from the finest farms worldwide.',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 8,
    featured: true
  },
  {
    id: '2',
    title: 'Seeds',
    slug: 'seeds',
    description: 'High-yield agricultural seeds for various crops and growing conditions.',
    image: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 12,
    featured: true
  },
  {
    id: '3',
    title: 'Oil',
    slug: 'oil',
    description: 'Refined and crude oils for industrial and commercial applications.',
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 6,
    featured: false
  },
  {
    id: '4',
    title: 'Raw Polymers',
    slug: 'raw-polymers',
    description: 'Industrial-grade polymers for manufacturing and production needs.',
    image: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 9,
    featured: false
  },
  {
    id: '5',
    title: 'Bromine Salt',
    slug: 'bromine-salt',
    description: 'High-purity bromine salt compounds for chemical and industrial use.',
    image: 'https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 4,
    featured: false
  }
];

interface CategoryContextType {
  categories: Category[];
  featuredCategories: Category[];
  updateCategoryFeaturedStatus: (categoryId: string, featured: boolean) => Promise<void>;
  updateCategoryImage: (categoryId: string, imageUrl: string) => Promise<void>;
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>;
  addCategory: (category: { title: string, description: string, image?: string }) => Promise<string>;
  removeCategory: (categoryId: string) => Promise<void>;
  updateProductCount: (categorySlug: string, count?: number) => void;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const productContext = useProducts();

  // Initialize categories from localStorage, Firestore, or local data
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        // First, create base categories with imageUrl for compatibility
        const baseCategories = initialCategories.map(category => ({
          ...category,
          imageUrl: category.image // Ensure imageUrl is set for compatibility
        }));
        
        // Try to load cached category images from localStorage
        let cachedCategories = [...baseCategories];
        try {
          if (typeof window !== 'undefined') {
            // Try to load from global cache first
            const globalCacheStr = localStorage.getItem('categoryCache');
            if (globalCacheStr) {
              const globalCache = JSON.parse(globalCacheStr);
              
              // Merge global cache with base categories
              cachedCategories = baseCategories.map(category => {
                const cachedCategory = globalCache[category.id];
                if (cachedCategory) {
                  // For Cloudinary URLs, use them directly without adding timestamp
                  let imageUrl = cachedCategory.image || category.image;
                  
                  // Don't add timestamp to Cloudinary URLs
                  if (!imageUrl.includes('cloudinary.com')) {
                    // Add timestamp to non-Cloudinary URLs to bust browser cache
                    const timestamp = new Date().getTime();
                    imageUrl = imageUrl.includes('?') 
                      ? `${imageUrl}&t=${timestamp}` 
                      : `${imageUrl}?t=${timestamp}`;
                  }
                  
                  return {
                    ...category,
                    ...cachedCategory,
                    image: cachedCategory.image || category.image,
                    imageUrl: imageUrl
                  };
                }
                return category;
              });
              
              console.log('Loaded categories from global cache:', cachedCategories);
            } else {
              console.log('No global category cache found, using base categories');
            }
          }
        } catch (e) {
          console.warn('Failed to load from localStorage:', e);
        }
        
        setCategories(cachedCategories);
        setFeaturedCategories(cachedCategories.filter(category => category.featured));
        
      } catch (error) {
        console.error('Error initializing categories:', error);
      }
    };
    
    initializeCategories();
  }, []);

  // Update featured categories when categories change
  useEffect(() => {
    setFeaturedCategories(categories.filter(category => category.featured));
  }, [categories]);

  // Update featured status of a category
  const updateCategoryFeaturedStatus = async (categoryId: string, featured: boolean): Promise<void> => {
    try {
      // In a real app, update in Firestore
      
      // Update local state
      setCategories(prevCategories => prevCategories.map(category => {
        if (category.id === categoryId) {
          return { ...category, featured };
        }
        return category;
      }));
    } catch (error) {
      console.error('Error updating category featured status:', error);
      throw error;
    }
  };

  // Update a category with partial data
  const updateCategory = async (categoryId: string, updates: Partial<Category>): Promise<void> => {
    try {
      if (!categoryId) {
        console.error('CategoryContext: Invalid categoryId for updateCategory');
        return;
      }

      // Get current user email or use system default
      let updatedBy = 'system@b2b-showcase.com';
      try {
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        if (auth.currentUser?.email) {
          updatedBy = auth.currentUser.email;
        }
      } catch (authError) {
        console.warn('Could not get current user, using default:', authError);
      }
      
      // Handle image URL updates
      if (updates.imageUrl) {
        console.log(`Updating category ${categoryId} with new image URL: ${updates.imageUrl}`);
        
        // For Cloudinary URLs, don't add timestamp parameters
        let cachedImageUrl = updates.imageUrl;
        
        // Only add timestamp for non-Cloudinary URLs
        if (!updates.imageUrl.includes('cloudinary.com')) {
          const timestamp = new Date().getTime();
          cachedImageUrl = updates.imageUrl.includes('?') 
            ? `${updates.imageUrl}&t=${timestamp}` 
            : `${updates.imageUrl}?t=${timestamp}`;
        }
        
        // Update in Firestore
        try {
          await updateFirebaseCategoryImage(categoryId, updates.imageUrl, updatedBy);
          console.log(`Successfully updated category ${categoryId} in Firestore`);
        } catch (dbError) {
          console.error('Error updating category image in Firestore:', dbError);
          // Continue with local state update even if Firestore update fails
        }
        
        // Update local state
        setCategories(prevCategories => prevCategories.map(category => {
          if (category.id === categoryId) {
            return { 
              ...category, 
              image: updates.imageUrl,  // Store original Cloudinary URL
              imageUrl: cachedImageUrl, // Store URL with cache busting if needed
              updatedAt: new Date(), 
              updatedBy 
            };
          }
          return category;
        }));
        
        // Update localStorage cache with the new image URL - both individual and global cache
        try {
          // Update individual category cache
          const storageKey = `category_${categoryId}`;
          const cachedCategory = JSON.parse(localStorage.getItem(storageKey) || '{}');
          const updatedCache = {
            ...cachedCategory,
            id: categoryId,
            image: updates.imageUrl,  // Store original Cloudinary URL
            imageUrl: cachedImageUrl, // Store URL with cache busting if needed
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem(storageKey, JSON.stringify(updatedCache));
          console.log(`Updated individual category cache for ${categoryId}:`, updatedCache);
          
          // Also update the global categoryCache
          const globalCache = JSON.parse(localStorage.getItem('categoryCache') || '{}');
          globalCache[categoryId] = {
            ...globalCache[categoryId],
            image: updates.imageUrl,  // Store original Cloudinary URL
            imageUrl: cachedImageUrl, // Store URL with cache busting if needed
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('categoryCache', JSON.stringify(globalCache));
          console.log('Updated global category cache:', globalCache);
          
          // Force clear any image cache in the browser
          if (typeof window !== 'undefined') {
            // Create a temporary image element to force reload the image
            const tempImg = new Image();
            tempImg.src = cachedImageUrl;
          }
        } catch (e) {
          console.warn('Failed to update localStorage cache:', e);
        }

        // Notify UI components that category data has changed
        window.dispatchEvent(new CustomEvent('categoryUpdated', {
          detail: { categoryId, imageUrl: updates.imageUrl, imageUpdated: true }
        }));
        
        // Also dispatch a global refresh event
        window.dispatchEvent(new Event('refreshCategories'));

        console.log(`Category ${categoryId} image updated to ${updates.imageUrl}`);
      } else {
        // Handle other updates (not image related)
        // Update in Firestore if needed
        // Update local state
        setCategories(prevCategories => prevCategories.map(category => {
          if (category.id === categoryId) {
            return { ...category, ...updates, updatedAt: new Date(), updatedBy };
          }
          return category;
        }));
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  // Wrapper function for backward compatibility
  const updateCategoryImage = async (categoryId: string, imageUrl: string): Promise<void> => {
    return updateCategory(categoryId, { imageUrl });
  };

  // Add a new category
  const addCategory = async (category: { title: string, description: string, image?: string }): Promise<string> => {
    try {
      const user = 'admin'; // In a real app, get this from auth context
      const newCategoryId = await addFirebaseCategory(category, user);
      
      // Update local state
      const newCategory: Category = {
        id: newCategoryId,
        title: category.title,
        slug: category.title.toLowerCase().replace(/\s+/g, '-'),
        description: category.description,
        image: category.image || '',
        productCount: 0,
        featured: false,
        updatedAt: new Date(),
        updatedBy: user
      };
      
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      // Dispatch event for components to update
      window.dispatchEvent(new CustomEvent('categoryAdded', { detail: { categoryId: newCategoryId } }));
      
      return newCategoryId;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };
  
  // Remove a category
  const removeCategory = async (categoryId: string): Promise<void> => {
    try {
      await removeFirebaseCategory(categoryId);
      
      // Update local state
      setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
      
      // Dispatch event for components to update
      window.dispatchEvent(new CustomEvent('categoryRemoved', { detail: { categoryId } }));
    } catch (error) {
      console.error('Error removing category:', error);
      throw error;
    }
  };

  // Function to update product count for a category
  const updateProductCount = useCallback((categorySlug: string, count?: number) => {
    // If count is provided, use it directly, otherwise calculate from products if available
    const newCount = count !== undefined ? count : 
      (productContext?.products?.filter(product => product.category === categorySlug)?.length || 0);
    
    console.log(`Updating product count for category ${categorySlug} to ${newCount}`);
    
    setCategories(prevCategories => prevCategories.map(category => {
      if (category.slug === categorySlug) {
        return { ...category, productCount: newCount };
      }
      return category;
    }));
  }, [productContext?.products]);

  // Listen for product added/removed events to update category counts
  useEffect(() => {
    // Skip if productContext is not available
    if (!productContext) return;
    
    const handleProductAdded = (event: CustomEvent) => {
      const { detail } = event;
      const product = productContext.products.find(p => p.id === detail.productId);
      if (product && product.category) {
        updateProductCount(product.category);
      }
    };

    const handleProductRemoved = (event: CustomEvent) => {
      // Since the product is already removed from the products array,
      // we need to use the category from the event detail if available
      const { detail } = event;
      if (detail && detail.category) {
        updateProductCount(detail.category);
      } else {
        // If category is not in the event detail, update all categories
        // This is less efficient but ensures counts are correct
        const uniqueCategories = Array.from(new Set(productContext.products.map(p => p.category)));
        uniqueCategories.forEach(categorySlug => updateProductCount(categorySlug));
      }
    };

    // Initialize product counts on mount
    const initializeCounts = () => {
      const categoryCounts: Record<string, number> = {};
      
      // Count products per category
      productContext.products.forEach(product => {
        const category = product.category;
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });
      
      // Update each category with its count
      Object.entries(categoryCounts).forEach(([categorySlug, count]) => {
        updateProductCount(categorySlug, count);
      });
    };

    // Run initialization
    initializeCounts();

    // Add event listeners
    window.addEventListener('productAdded', handleProductAdded as EventListener);
    window.addEventListener('productRemoved', handleProductRemoved as EventListener);
    
    return () => {
      window.removeEventListener('productAdded', handleProductAdded as EventListener);
      window.removeEventListener('productRemoved', handleProductRemoved as EventListener);
    };
  }, [productContext?.products, updateProductCount]);

  return (
    <CategoryContext.Provider value={{
      categories,
      featuredCategories,
      updateCategoryFeaturedStatus,
      updateCategoryImage,
      updateCategory,
      addCategory,
      removeCategory,
      updateProductCount
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
