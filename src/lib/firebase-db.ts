import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, Timestamp, QueryDocumentSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKv_Rs6MNXV1cshKhf7T4C93RG82u11LA",
  authDomain: "b2bshowcase-199a8.firebaseapp.com",
  projectId: "b2bshowcase-199a8",
  storageBucket: "b2bshowcase-199a8.appspot.com",
  messagingSenderId: "608819928179",
  appId: "1:608819928179:web:774b8f3e120a927f279e06",
  measurementId: "G-8VTK238F1Y"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define product type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  slug: string; // Required for routing
  featured?: boolean;
  inStock?: boolean;
  updatedAt: Date | any; // Support Firestore Timestamp
  updatedBy: string;
  specifications?: Record<string, string>; // Support for product specifications
  keyFeatures?: string[]; // Support for product key features as array of strings
  unit?: string; // Support for product unit (kg, pcs, etc.)
}

/**
 * Helper function to convert Firestore document to Product object
 * Ensures all required fields are present and properly formatted
 */
const convertDocToProduct = (doc: QueryDocumentSnapshot): Product => {
  const data = doc.data();
  
  // Convert Firestore Timestamp to Date
  const updatedAt = data.updatedAt instanceof Timestamp 
    ? data.updatedAt.toDate() 
    : new Date(data.updatedAt || Date.now());
  
  // Make sure we have the latest image URL with cache-busting
  let imageUrl = data.imageUrl || '';
  
  // Add cache-busting parameter if it doesn't already have one
  if (imageUrl && !imageUrl.includes('t=')) {
    const timestamp = new Date().getTime();
    imageUrl = imageUrl.includes('?') 
      ? `${imageUrl}&t=${timestamp}` 
      : `${imageUrl}?t=${timestamp}`;
  }
  
  // Generate a slug if not present
  const slug = data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || doc.id;
  
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    imageUrl,
    category: data.category || '',
    slug,
    featured: data.featured || false,
    inStock: data.inStock !== undefined ? data.inStock : true,
    updatedAt,
    updatedBy: data.updatedBy || 'system',
    specifications: data.specifications || {},
    keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : [],
    unit: data.unit || 'kg'
  };
};

/**
 * Updates a product's image URL
 * @param productId The ID of the product to update
 * @param imageUrl The new image URL
 * @param updatedBy The email of the user who updated the product
 */
export const updateProductImage = async (productId: string, imageUrl: string, updatedBy: string): Promise<void> => {
  try {
    console.log(`Firebase DB: Updating product ${productId} with image URL: ${imageUrl}`);
    
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }
    
    // Ensure we have a fresh Firestore connection
    const db = getFirestore();
    console.log('Firebase DB: Ensuring fresh Firestore connection');
    
    const productRef = doc(db, 'products', productId);
    console.log('Firebase DB: Product reference created');
    
    // Get the current product data
    console.log('Firebase DB: Fetching current product data...');
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      console.error(`Firebase DB: Product with ID ${productId} not found`);
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    console.log('Firebase DB: Product found, updating with new image URL');
    
    // Update only the image URL and metadata
    const updateData = {
      imageUrl,
      updatedAt: Timestamp.now(),
      updatedBy
    };
    
    console.log('Firebase DB: Update data prepared:', updateData);
    
    // Use setDoc with merge option to ensure the update goes through even if there are conflicts
    await setDoc(productRef, updateData, { merge: true });
    console.log('Firebase DB: Product successfully updated in Firestore');
    
    // Double-check that the update was successful
    const updatedSnap = await getDoc(productRef);
    const updatedData = updatedSnap.data();
    
    if (updatedData && updatedData.imageUrl === imageUrl) {
      console.log('Firebase DB: Verified that image URL was updated successfully');
    } else {
      console.error('Firebase DB: Image URL verification failed', {
        expected: imageUrl,
        actual: updatedData?.imageUrl
      });
      throw new Error('Failed to verify image URL update in Firestore');
    }
  } catch (error) {
    console.error('Firebase DB: Error updating product image:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      throw new Error(`Failed to update product image: ${error.message}`);
    } else {
      throw new Error('Failed to update product image: Unknown error');
    }
  }
};

/**
 * Gets all products
 * @returns Array of products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('Firebase DB: Fetching all products');
    
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push(convertDocToProduct(doc));
    });
    
    console.log(`Firebase DB: Fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Firebase DB: Error getting all products:', error);
    throw new Error('Failed to get all products');
  }
};

/**
 * Gets a product by ID
 * @param productId The ID of the product to get
 * @returns The product data or null if not found
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    console.log(`Firebase DB: Getting product ${productId}`);
    
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      console.log(`Firebase DB: Product ${productId} not found`);
      return null;
    }
    
    // Convert Firestore document to Product object
    const product = convertDocToProduct(productSnap);
    
    return product;
  } catch (error) {
    console.error('Firebase DB: Error getting product:', error);
    throw new Error('Failed to get product');
  }
};

/**
 * Updates a product's featured status
 * @param productId The ID of the product to update
 * @param featured Whether the product should be featured
 * @param updatedBy The email of the user who updated the product
 */
export const updateProductFeaturedStatus = async (productId: string, featured: boolean, updatedBy: string = 'system'): Promise<void> => {
  try {
    console.log(`Firebase DB: Updating product ${productId} featured status to: ${featured}`);
    
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    // Ensure we have a fresh Firestore connection
    const db = getFirestore();
    console.log('Firebase DB: Ensuring fresh Firestore connection');
    
    const productRef = doc(db, 'products', productId);
    console.log('Firebase DB: Product reference created');
    
    // Update only the featured status and metadata
    const updateData = {
      featured,
      updatedAt: Timestamp.now(),
      updatedBy
    };
    
    console.log('Firebase DB: Update data prepared:', updateData);
    
    // Use setDoc with merge option to ensure the update goes through even if there are conflicts
    await setDoc(productRef, updateData, { merge: true });
    console.log('Firebase DB: Product featured status successfully updated in Firestore');
    
    // Double-check that the update was successful
    const updatedSnap = await getDoc(productRef);
    const updatedData = updatedSnap.data();
    
    if (updatedData && updatedData.featured === featured) {
      console.log('Firebase DB: Verified that featured status was updated successfully');
    } else {
      console.error('Firebase DB: Featured status verification failed', {
        expected: featured,
        actual: updatedData?.featured
      });
      throw new Error('Failed to verify featured status update in Firestore');
    }
  } catch (error) {
    console.error('Firebase DB: Error updating product featured status:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      throw new Error(`Failed to update product featured status: ${error.message}`);
    } else {
      throw new Error('Failed to update product featured status: Unknown error');
    }
  }
};

/**
 * Updates a product's stock status
 * @param productId The ID of the product to update
 * @param inStock Whether the product is in stock
 * @param updatedBy The email of the user who updated the product
 */
export const updateProductStockStatus = async (productId: string, inStock: boolean, updatedBy: string = 'system'): Promise<void> => {
  try {
    console.log(`Firebase DB: Updating product ${productId} stock status to: ${inStock ? 'in stock' : 'out of stock'}`);
    
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    // Ensure we have a fresh Firestore connection
    const db = getFirestore();
    console.log('Firebase DB: Ensuring fresh Firestore connection');
    
    const productRef = doc(db, 'products', productId);
    console.log('Firebase DB: Product reference created');
    
    // Update only the inStock status and metadata
    const updateData = {
      inStock,
      updatedAt: Timestamp.now(),
      updatedBy
    };
    
    console.log('Firebase DB: Update data prepared:', updateData);
    
    // Use setDoc with merge option to ensure the update goes through even if there are conflicts
    await setDoc(productRef, updateData, { merge: true });
    console.log('Firebase DB: Product stock status successfully updated in Firestore');
    
    // Double-check that the update was successful
    const updatedSnap = await getDoc(productRef);
    const updatedData = updatedSnap.data();
    
    if (updatedData && updatedData.inStock === inStock) {
      console.log('Firebase DB: Verified that stock status was updated successfully');
    } else {
      console.error('Firebase DB: Stock status verification failed', {
        expected: inStock,
        actual: updatedData?.inStock
      });
      throw new Error('Failed to verify stock status update in Firestore');
    }
  } catch (error) {
    console.error('Firebase DB: Error updating product stock status:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      throw new Error(`Failed to update product stock status: ${error.message}`);
    } else {
      throw new Error('Failed to update product stock status: Unknown error');
    }
  }
};

/**
 * Adds a new product to the database
 * @param product The product data to add
 * @returns The ID of the newly created product
 */
export const addProduct = async (product: Omit<Product, 'id' | 'updatedAt' | 'updatedBy'>, updatedBy: string = 'system'): Promise<string> => {
  try {
    console.log(`Firebase DB: Adding new product ${product.name}`);
    
    if (!product.name) {
      throw new Error('Product name is required');
    }
    
    if (!product.category) {
      throw new Error('Product category is required');
    }
    
    // Generate a slug from the name if not provided
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Generate a unique ID
    const productRef = doc(collection(db, 'products'));
    const productId = productRef.id;
    
    // Set default values and ensure no undefined values
    const newProduct = {
      ...product,
      id: productId,
      slug: slug,
      updatedAt: Timestamp.now(),
      updatedBy: updatedBy,
      featured: product.featured || false,
      inStock: product.inStock !== undefined ? product.inStock : true,
      specifications: product.specifications || {},
      keyFeatures: Array.isArray(product.keyFeatures) ? product.keyFeatures : []
    };
    
    console.log('Adding product with data:', {
      id: productId,
      name: product.name,
      keyFeaturesType: typeof product.keyFeatures,
      keyFeaturesIsArray: Array.isArray(product.keyFeatures),
      keyFeaturesCount: Array.isArray(product.keyFeatures) ? product.keyFeatures.length : 0,
      specificationsCount: Object.keys(product.specifications || {}).length
    });
    
    // Add the product to Firestore
    await setDoc(productRef, newProduct);
    
    // Verify the product was added
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      throw new Error('Failed to verify product was added to Firestore');
    }
    
    console.log(`Firebase DB: Added product ${productId} with slug ${slug}`);
    return productId;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Removes a product from the database
 * @param productId The ID of the product to remove
 */
export const removeProduct = async (productId: string): Promise<void> => {
  try {
    console.log(`Firebase DB: Removing product ${productId}`);
    
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    // Get product info for logging purposes
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    const productData = productSnap.exists() ? productSnap.data() : null;
    
    // Completely delete the product from Firestore instead of just marking as deleted
    await deleteDoc(doc(db, 'products', productId));
    
    // Log deletion details
    console.log(`Firebase DB: Successfully deleted product ${productId}${productData?.name ? ` (${productData.name})` : ''}`);
    
    // Also remove any cached references to this product
    try {
      // Clear any browser storage that might be caching product data
      if (typeof window !== 'undefined') {
        // Dispatch an event to notify components to clear their caches
        window.dispatchEvent(new CustomEvent('productDeleted', { 
          detail: { productId },
          bubbles: true
        }));
      }
    } catch (cacheError) {
      console.warn('Error clearing product cache:', cacheError);
      // Continue with deletion even if cache clearing fails
    }
    
  } catch (error) {
    console.error('Error removing product:', error);
    throw error;
  }
};

/**
 * Adds a new category to the database
 * @param category The category data to add
 * @returns The ID of the newly created category
 */
export const addCategory = async (category: { title: string, image?: string }, updatedBy: string = 'system'): Promise<string> => {
  try {
    console.log(`Firebase DB: Adding new category ${category.title}`);
    
    if (!category.title) {
      throw new Error('Category title is required');
    }
    
    // Generate a slug from the title
    const slug = category.title.toLowerCase().replace(/\s+/g, '-');
    
    // Generate a unique ID
    const categoryRef = doc(collection(db, 'categories'));
    const categoryId = categoryRef.id;
    
    // Set default values
    const newCategory = {
      id: categoryId,
      title: category.title,
      slug: slug,
      image: category.image || '',
      featured: false,
      productCount: 0,
      updatedAt: new Date(),
      updatedBy: updatedBy
    };
    
    // Add the category to Firestore
    await setDoc(categoryRef, newCategory);
    
    console.log(`Firebase DB: Added category ${categoryId}`);
    return categoryId;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Removes a category from the database
 * @param categoryId The ID of the category to remove
 */
export const removeCategory = async (categoryId: string): Promise<void> => {
  try {
    console.log(`Firebase DB: Removing category ${categoryId}`);
    
    if (!categoryId) {
      throw new Error('Category ID is required');
    }
    
    // Remove the category from Firestore
    await setDoc(doc(db, 'categories', categoryId), {
      deleted: true,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`Firebase DB: Removed category ${categoryId}`);
  } catch (error) {
    console.error('Error removing category:', error);
    throw error;
  }
};

// Category interface matching the one in CategoryContext
export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  imageUrl?: string;
  productCount: number;
  featured?: boolean;
  updatedAt?: Date;
  updatedBy?: string;
}

/**
 * Helper function to convert Firestore document to Category object
 * Ensures all required fields are present and properly formatted
 */
const convertDocToCategory = (doc: QueryDocumentSnapshot): Category => {
  const data = doc.data();
  
  // Convert Firestore Timestamp to Date
  const updatedAt = data.updatedAt instanceof Timestamp 
    ? data.updatedAt.toDate() 
    : new Date(data.updatedAt || Date.now());
  
  // Make sure we have the latest image URL with cache-busting
  let imageUrl = data.imageUrl || data.image || '';
  
  // Add cache-busting parameter if it doesn't already have one
  if (imageUrl && !imageUrl.includes('cloudinary.com')) {
    const timestamp = new Date().getTime();
    imageUrl = imageUrl.includes('?') 
      ? `${imageUrl}&t=${timestamp}` 
      : `${imageUrl}?t=${timestamp}`;
  }
  
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    description: data.description || '',
    image: data.image || data.imageUrl || '',
    imageUrl: imageUrl,
    productCount: data.productCount || 0,
    featured: data.featured || false,
    updatedAt,
    updatedBy: data.updatedBy || 'system'
  };
};

/**
 * Gets all categories from Firestore
 * @returns Array of categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    console.log('Firebase DB: Fetching all categories');
    
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    
    const categories: Category[] = [];
    
    querySnapshot.forEach((doc) => {
      // Skip deleted categories
      const data = doc.data();
      if (data.deleted === true) {
        return;
      }
      
      categories.push(convertDocToCategory(doc));
    });
    
    console.log(`Firebase DB: Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('Firebase DB: Error getting all categories:', error);
    throw new Error('Failed to get all categories');
  }
};

export { db };

/**
 * Updates a category's image URL
 * @param categoryId The ID of the category to update
 * @param imageUrl The new image URL
 * @param updatedBy The email of the user who updated the category
 */
export const updateCategoryImage = async (categoryId: string, imageUrl: string, updatedBy: string): Promise<void> => {
  try {
    console.log(`Firebase DB: Updating category ${categoryId} with image URL: ${imageUrl}`);
    
    if (!categoryId) {
      throw new Error('Category ID is required');
    }
    
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }
    
    // Ensure we have a fresh Firestore connection
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('Firebase DB: Ensuring fresh Firestore connection for category update');
    
    const categoryRef = doc(db, 'categories', categoryId);
    console.log('Firebase DB: Category reference created');
    
    // Use setDoc with merge option to ensure the update goes through
    const updateData = {
      image: imageUrl,  // Update both image and imageUrl fields
      imageUrl: imageUrl,
      updatedAt: Timestamp.now(),
      updatedBy
    };
    
    console.log('Firebase DB: Category update data prepared:', updateData);
    
    await setDoc(categoryRef, updateData, { merge: true });
    console.log('Firebase DB: Category successfully updated in Firestore');
    
    return;
  } catch (error) {
    console.error('Firebase DB: Error updating category image:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      throw new Error(`Failed to update category image: ${error.message}`);
    } else {
      throw new Error('Failed to update category image: Unknown error');
    }
  }
};
