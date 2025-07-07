// Simple Firebase implementation with minimal dependencies
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

// Initialize Firebase once
let firebaseApp: any;
let firestoreDb: any;

// Initialize Firebase if not already initialized
function getFirebaseApp() {
  if (!firebaseApp) {
    // Check if any Firebase apps are already initialized
    if (getApps().length === 0) {
      console.log('[SIMPLE] Initializing new Firebase app');
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      console.log('[SIMPLE] Using existing Firebase app');
      firebaseApp = getApps()[0];
    }
  }
  return firebaseApp;
}

// Get Firestore instance
function getFirestoreInstance() {
  if (!firestoreDb) {
    const app = getFirebaseApp();
    firestoreDb = getFirestore(app);
  }
  return firestoreDb;
}

/**
 * Updates a category image in Firestore
 */
export async function updateCategoryImage(categoryId: string, imageUrl: string): Promise<boolean> {
  try {
    console.log(`[SIMPLE] Updating category image for ${categoryId} to ${imageUrl}`);
    
    // Get Firestore instance
    const db = getFirestoreInstance();
    
    // Update document with merge
    await setDoc(doc(db, 'categories', categoryId), {
      imageUrl,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`[SIMPLE] Successfully updated category image for ${categoryId}`);
    
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return true;
  } catch (error) {
    console.error(`[SIMPLE] Error updating category image:`, error);
    return false;
  }
}

/**
 * Updates a product's featured status in Firestore
 */
export async function updateProductFeatured(productId: string, featured: boolean): Promise<boolean> {
  try {
    console.log(`[SIMPLE] Updating product featured status for ${productId} to ${featured}`);
    
    // Get Firestore instance
    const db = getFirestoreInstance();
    
    // Update document with merge
    await setDoc(doc(db, 'products', productId), {
      featured,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`[SIMPLE] Successfully updated product featured status for ${productId}`);
    
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return true;
  } catch (error) {
    console.error(`[SIMPLE] Error updating product featured status:`, error);
    return false;
  }
}

/**
 * Updates a product's stock status in Firestore
 */
export async function updateProductStock(productId: string, inStock: boolean): Promise<boolean> {
  try {
    console.log(`[SIMPLE] Updating product stock status for ${productId} to ${inStock}`);
    
    // Get Firestore instance
    const db = getFirestoreInstance();
    
    // Update document with merge
    await setDoc(doc(db, 'products', productId), {
      inStock,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`[SIMPLE] Successfully updated product stock status for ${productId}`);
    
    // Force a refresh to update the UI
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return true;
  } catch (error) {
    console.error(`[SIMPLE] Error updating product stock status:`, error);
    return false;
  }
}
