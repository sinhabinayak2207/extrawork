"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { 
  addCategory as addFirebaseCategory, 
  removeCategory as removeFirebaseCategory,
  updateCategoryImage as updateFirebaseCategoryImage,
  getAllCategories,
  Category as FirebaseCategory
} from '@/lib/firebase-db';
import { useProducts, Product } from './ProductContext';

// Use the Category interface from firebase-db.ts for consistency
export type Category = FirebaseCategory;

interface CategoryContextType {
  categories: Category[];
  featuredCategories: Category[];
  loading: boolean;
  updateCategoryFeaturedStatus: (categoryId: string, featured: boolean) => Promise<void>;
  updateCategoryImage: (categoryId: string, imageUrl: string) => Promise<void>;
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>;
  addCategory: (category: { title: string, description: string, image?: string }) => Promise<string>;
  removeCategory: (categoryId: string) => Promise<void>;
  updateProductCount: (categorySlug: string, count?: number) => void;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const productContext = useProducts();

  // Initialize categories from Firebase
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        setLoading(true);
        console.log('CategoryContext: Fetching categories from Firebase');
        
        // Fetch categories from Firebase
        const firebaseCategories = await getAllCategories();
        console.log('CategoryContext: Fetched categories from Firebase:', firebaseCategories);
        
        if (firebaseCategories.length === 0) {
          console.warn('CategoryContext: No categories found in Firebase');
        }
        
        // Process categories for cache busting and compatibility
        const processedCategories = firebaseCategories.map((category: Category) => {
          // For Cloudinary URLs, use them directly without adding timestamp
          let imageUrl = category.image || category.imageUrl || '';
          
          // Don't add timestamp to Cloudinary URLs
          if (imageUrl && !imageUrl.includes('cloudinary.com')) {
            // Add timestamp to non-Cloudinary URLs to bust browser cache
            const timestamp = new Date().getTime();
            imageUrl = imageUrl.includes('?') 
              ? `${imageUrl}&t=${timestamp}` 
              : `${imageUrl}?t=${timestamp}`;
          }
          
          return {
            ...category,
            imageUrl: imageUrl
          };
        });
        
        // Update state with fetched categories
        setCategories(processedCategories);
        setFeaturedCategories(processedCategories.filter(category => category.featured));
        
        // Cache categories in localStorage for faster loading next time
        try {
          if (typeof window !== 'undefined') {
            // Create a cache object with category IDs as keys
            const categoryCache: Record<string, any> = {};
            processedCategories.forEach(category => {
              categoryCache[category.id] = {
                id: category.id,
                title: category.title,
                slug: category.slug,
                description: category.description || '',
                image: category.image || '',
                imageUrl: category.imageUrl,
                featured: category.featured,
                updatedAt: category.updatedAt ? category.updatedAt.toISOString() : new Date().toISOString()
              };
            });
            
            localStorage.setItem('categoryCache', JSON.stringify(categoryCache));
            console.log('CategoryContext: Updated category cache in localStorage');
          }
        } catch (cacheError) {
          console.warn('CategoryContext: Failed to update localStorage cache:', cacheError);
        }
        
      } catch (error) {
        console.error('CategoryContext: Error initializing categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeCategories();
  }, []);

  // Update featured categories when categories change
  useEffect(() => {
    setFeaturedCategories(categories.filter(category => category.featured));
  }, [categories]);

  // Update a category's image
  const updateCategoryImage = async (categoryId: string, imageUrl: string): Promise<void> => {
    try {
      // Update in Firestore
      await updateFirebaseCategoryImage(categoryId, imageUrl);
      
      // Fetch the updated category list from Firebase to ensure consistency
      const updatedCategories = await getAllCategories();
      setCategories(updatedCategories);
      setFeaturedCategories(updatedCategories.filter(cat => cat.featured));
      
      // Update localStorage cache
      try {
        if (typeof window !== 'undefined') {
          const globalCacheStr = localStorage.getItem('categoryCache');
          if (globalCacheStr) {
            const globalCache = JSON.parse(globalCacheStr);
            if (globalCache[categoryId]) {
              globalCache[categoryId].image = imageUrl;
              globalCache[categoryId].updatedAt = new Date().toISOString();
              localStorage.setItem('categoryCache', JSON.stringify(globalCache));
            }
          }
        }
      } catch (e) {
        console.warn('Failed to update localStorage cache:', e);
      }
      
      // Dispatch event for components to update
      window.dispatchEvent(new CustomEvent('categoryUpdated', { detail: { categoryId } }));
    } catch (error) {
      console.error('Error updating category image:', error);
      throw error;
    }
  };

  // Update a category's featured status
  const updateCategoryFeaturedStatus = async (categoryId: string, featured: boolean): Promise<void> => {
    try {
      const db = getFirestore();
      const categoryRef = doc(db, 'categories', categoryId);
      
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
      
      await setDoc(categoryRef, {
        featured,
        updatedAt: Timestamp.now(),
        updatedBy
      }, { merge: true });
      
      // Update local state
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === categoryId ? { ...category, featured } : category
        )
      );
      
      // Update featured categories
      setFeaturedCategories(prevFeatured => {
        if (featured) {
          // Add to featured if not already there
          const category = categories.find(c => c.id === categoryId);
          if (category && !prevFeatured.some(c => c.id === categoryId)) {
            return [...prevFeatured, { ...category, featured }];
          }
        } else {
          // Remove from featured
          return prevFeatured.filter(c => c.id !== categoryId);
        }
        return prevFeatured;
      });
      
      // Update localStorage cache
      try {
        if (typeof window !== 'undefined') {
          const globalCache = JSON.parse(localStorage.getItem('categoryCache') || '{}');
          if (globalCache[categoryId]) {
            globalCache[categoryId].featured = featured;
            globalCache[categoryId].updatedAt = new Date().toISOString();
            localStorage.setItem('categoryCache', JSON.stringify(globalCache));
          }
        }
      } catch (cacheError) {
        console.warn('Failed to update localStorage cache:', cacheError);
      }
      
      // Dispatch event for components to update
      window.dispatchEvent(new CustomEvent('categoryUpdated', { detail: { categoryId } }));
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
              image: updates.imageUrl || category.image,  // Ensure image is always a string
              imageUrl: cachedImageUrl, // Store URL with cache busting if needed
              updatedAt: new Date(), 
              updatedBy 
            } as Category; // Explicitly cast to Category type
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

  // Add a new category
  const addCategory = async (category: { title: string, description: string, image?: string }): Promise<string> => {
    try {
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
      
      // Add category to Firebase
      const newCategoryData = {
        title: category.title,
        description: category.description || '',
        image: category.image || ''
      };
      
      const newCategoryId = await addFirebaseCategory(newCategoryData, updatedBy);
      
      // Fetch the updated category list from Firebase to ensure consistency
      const updatedCategories = await getAllCategories();
      setCategories(updatedCategories);
      setFeaturedCategories(updatedCategories.filter(cat => cat.featured));
      
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
      setFeaturedCategories(prevFeatured => prevFeatured.filter(category => category.id !== categoryId));
      
      // Update localStorage cache
      try {
        if (typeof window !== 'undefined') {
          const globalCache = JSON.parse(localStorage.getItem('categoryCache') || '{}');
          if (globalCache[categoryId]) {
            delete globalCache[categoryId];
            localStorage.setItem('categoryCache', JSON.stringify(globalCache));
          }
        }
      } catch (cacheError) {
        console.warn('Failed to update localStorage cache:', cacheError);
      }
      
      // Dispatch event for components to update
      window.dispatchEvent(new CustomEvent('categoryRemoved', { detail: { categoryId } }));
    } catch (error) {
      console.error('Error removing category:', error);
      throw error;
    }
  };

  // Function to update product count for a category
  const updateProductCount = useCallback((categorySlug: string, count?: number) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.slug === categorySlug) {
          // If count is provided, use it directly
          if (count !== undefined) {
            return { ...category, productCount: count };
          }
          
          // Otherwise calculate from products context
          if (productContext) {
            const productCount = productContext.products.filter(
              (product: Product) => product.category === categorySlug
            ).length;
            return { ...category, productCount };
          }
        }
        return category;
      })
    );
    
    // Also update featured categories if needed
    setFeaturedCategories(prevFeatured => 
      prevFeatured.map(category => {
        if (category.slug === categorySlug) {
          // If count is provided, use it directly
          if (count !== undefined) {
            return { ...category, productCount: count };
          }
          
          // Otherwise calculate from products context
          if (productContext) {
            const productCount = productContext.products.filter(
              (product: Product) => product.category === categorySlug
            ).length;
            return { ...category, productCount };
          }
        }
        return category;
      })
    );
    
    // Update localStorage cache
    try {
      if (typeof window !== 'undefined') {
        const globalCacheStr = localStorage.getItem('categoryCache');
        if (globalCacheStr) {
          const globalCache = JSON.parse(globalCacheStr);
          const categoryId = Object.keys(globalCache).find(id => 
            globalCache[id].slug === categorySlug
          );
          
          if (categoryId && count !== undefined) {
            globalCache[categoryId].productCount = count;
            localStorage.setItem('categoryCache', JSON.stringify(globalCache));
          }
        }
      }
    } catch (e) {
      console.warn('Failed to update localStorage cache:', e);
    }
  }, [productContext]);

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

  // Listen for category update events
  useEffect(() => {
    const handleCategoryUpdated = (event: CustomEvent) => {
      console.log('Category updated event received:', event.detail);
    };
    
    const handleCategoryAdded = (event: CustomEvent) => {
      console.log('Category added event received:', event.detail);
    };
    
    const handleCategoryRemoved = (event: CustomEvent) => {
      console.log('Category removed event received:', event.detail);
    };
    
    const handleRefreshCategories = async () => {
      console.log('Refreshing categories from Firebase...');
      try {
        setLoading(true);
        const updatedCategories = await getAllCategories();
        setCategories(updatedCategories);
        setFeaturedCategories(updatedCategories.filter(cat => cat.featured));
        console.log('Categories refreshed successfully');
      } catch (error) {
        console.error('Error refreshing categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    window.addEventListener('categoryUpdated', handleCategoryUpdated as EventListener);
    window.addEventListener('categoryAdded', handleCategoryAdded as EventListener);
    window.addEventListener('categoryRemoved', handleCategoryRemoved as EventListener);
    window.addEventListener('refreshCategories', handleRefreshCategories as EventListener);
    
    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdated as EventListener);
      window.removeEventListener('categoryAdded', handleCategoryAdded as EventListener);
      window.removeEventListener('categoryRemoved', handleCategoryRemoved as EventListener);
      window.removeEventListener('refreshCategories', handleRefreshCategories as EventListener);
    };
  }, []);

  return (
    <CategoryContext.Provider value={{
      categories,
      featuredCategories,
      loading,
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
