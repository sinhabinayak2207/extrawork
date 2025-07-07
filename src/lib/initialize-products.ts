import { db } from './firebase-db';
import { collection, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { initialProducts } from '@/context/ProductContext';

/**
 * Initializes products in Firestore if they don't exist
 * This is useful for ensuring that the products in the app match those in Firestore
 */
export const initializeProducts = async (): Promise<void> => {
  try {
    console.log('Checking and initializing products in Firestore...');
    
    // For each product in our initial data
    for (const product of initialProducts) {
      const productRef = doc(db, 'products', product.id);
      const productSnap = await getDoc(productRef);
      
      // If product doesn't exist in Firestore, create it
      if (!productSnap.exists()) {
        console.log(`Product ${product.id} not found in Firestore, creating...`);
        
        await setDoc(productRef, {
          name: product.name,
          slug: product.slug,
          description: product.description,
          imageUrl: product.imageUrl,
          category: product.category,
          featured: product.featured || false,
          updatedAt: Timestamp.now(),
          updatedBy: 'system',
          price: product.price || 0,
          specifications: product.specifications || {}
        });
        
        console.log(`Product ${product.id} created in Firestore`);
      } else {
        console.log(`Product ${product.id} already exists in Firestore`);
      }
    }
    
    console.log('Product initialization complete');
  } catch (error) {
    console.error('Error initializing products:', error);
    throw new Error('Failed to initialize products');
  }
};
