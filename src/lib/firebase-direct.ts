// Direct Firebase operations with no dependencies on other modules
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration - hardcoded to avoid import issues
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
 * Updates a category image in Firestore
 */
export async function updateCategoryImage(categoryId: string, imageUrl: string): Promise<boolean> {
  try {
    console.log(`[DIRECT] Updating category image for ${categoryId} to ${imageUrl}`);
    
    // Create a unique instance name
    const instanceName = `direct-category-${Date.now()}-${instanceCounter++}`;
    
    // Initialize Firebase with unique name
    const app = initializeApp(firebaseConfig, instanceName);
    const db = getFirestore(app);
    
    // Update document with merge
    await setDoc(doc(db, 'categories', categoryId), {
      imageUrl,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`[DIRECT] Successfully updated category image for ${categoryId}`);
    return true;
  } catch (error) {
    console.error(`[DIRECT] Error updating category image:`, error);
    return false;
  }
}

/**
 * Updates a product's featured status in Firestore
 */
export async function updateProductFeatured(productId: string, featured: boolean): Promise<boolean> {
  try {
    console.log(`[DIRECT] Updating product featured status for ${productId} to ${featured}`);
    
    // Create a unique instance name
    const instanceName = `direct-featured-${Date.now()}-${instanceCounter++}`;
    
    // Initialize Firebase with unique name
    const app = initializeApp(firebaseConfig, instanceName);
    const db = getFirestore(app);
    
    // Update document with merge
    await setDoc(doc(db, 'products', productId), {
      featured,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`[DIRECT] Successfully updated product featured status for ${productId}`);
    return true;
  } catch (error) {
    console.error(`[DIRECT] Error updating product featured status:`, error);
    return false;
  }
}

/**
 * Updates a product's stock status in Firestore
 */
export async function updateProductStock(productId: string, inStock: boolean): Promise<boolean> {
  try {
    console.log(`[DIRECT] Updating product stock status for ${productId} to ${inStock}`);
    
    // Create a unique instance name
    const instanceName = `direct-stock-${Date.now()}-${instanceCounter++}`;
    
    // Initialize Firebase with unique name
    const app = initializeApp(firebaseConfig, instanceName);
    const db = getFirestore(app);
    
    // Update document with merge
    await setDoc(doc(db, 'products', productId), {
      inStock,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`[DIRECT] Successfully updated product stock status for ${productId}`);
    return true;
  } catch (error) {
    console.error(`[DIRECT] Error updating product stock status:`, error);
    return false;
  }
}