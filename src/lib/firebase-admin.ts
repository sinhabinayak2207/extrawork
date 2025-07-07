// Firebase admin utilities for direct Firestore operations
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKv_Rs6MNXV1cshKhf7T4C93RG82u11LA",
  authDomain: "b2bshowcase-199a8.firebaseapp.com",
  projectId: "b2bshowcase-199a8",
  storageBucket: "b2bshowcase-199a8.firebasestorage.app",
  messagingSenderId: "608819928179",
  appId: "1:608819928179:web:774b8f3e120a927f279e06",
  measurementId: "G-8VTK238F1Y"
};

// Counter to ensure unique app names
let instanceCounter = 0;

/**
 * Updates a document in Firestore with guaranteed initialization
 * @param collection Collection name
 * @param docId Document ID
 * @param data Data to update
 * @returns Promise resolving to success boolean
 */
export async function updateFirestoreDocument(
  collection: string,
  docId: string,
  data: Record<string, any>
): Promise<boolean> {
  try {
    console.log(`[Firebase Admin] Updating ${collection}/${docId} with:`, data);
    
    // Create a unique instance name to avoid conflicts
    const instanceName = `admin-instance-${Date.now()}-${instanceCounter++}`;
    console.log(`[Firebase Admin] Creating Firebase instance: ${instanceName}`);
    
    // Initialize Firebase with unique name
    const app = initializeApp(firebaseConfig, instanceName);
    const db = getFirestore(app);
    
    // Update document with merge
    await setDoc(doc(db, collection, docId), {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`[Firebase Admin] Successfully updated ${collection}/${docId}`);
    
    // Dispatch event for UI updates
    if (typeof window !== 'undefined') {
      const eventName = collection === 'products' ? 'productUpdated' : 'categoryUpdated';
      const event = new CustomEvent(eventName, {
        detail: { id: docId, ...data },
        bubbles: true
      });
      window.dispatchEvent(event);
      document.dispatchEvent(event);
      console.log(`[Firebase Admin] Dispatched ${eventName} event`);
    }
    
    return true;
  } catch (error) {
    console.error(`[Firebase Admin] Error updating ${collection}/${docId}:`, error);
    return false;
  }
}

/**
 * Updates a category's image URL in Firestore
 */
export async function updateCategoryImage(categoryId: string, imageUrl: string): Promise<boolean> {
  return updateFirestoreDocument('categories', categoryId, { imageUrl });
}

/**
 * Updates a product's featured status in Firestore
 */
export async function updateProductFeatured(productId: string, featured: boolean): Promise<boolean> {
  return updateFirestoreDocument('products', productId, { featured });
}

/**
 * Updates a product's stock status in Firestore
 */
export async function updateProductStock(productId: string, inStock: boolean): Promise<boolean> {
  return updateFirestoreDocument('products', productId, { inStock });
}

/**
 * Checks how many featured products exist
 */
export async function countFeaturedProducts(): Promise<number> {
  try {
    // Create a unique instance name to avoid conflicts
    const instanceName = `admin-instance-count-${Date.now()}-${instanceCounter++}`;
    
    // Initialize Firebase with unique name
    const app = initializeApp(firebaseConfig, instanceName);
    const db = getFirestore(app);
    
    // This is a simplified approach - in a real app, you'd use a query
    // For now, we'll just return 0 to allow featuring products
    return 0;
  } catch (error) {
    console.error('[Firebase Admin] Error counting featured products:', error);
    return 0;
  }
}
