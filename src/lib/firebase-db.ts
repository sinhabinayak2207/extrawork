import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, Timestamp } from 'firebase/firestore';

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
  updatedAt: Date;
  updatedBy: string;
}

/**
 * Updates a product's image URL
 * @param productId The ID of the product to update
 * @param imageUrl The new image URL
 * @param updatedBy The email of the user who updated the product
 */
export const updateProductImage = async (productId: string, imageUrl: string, updatedBy: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);
    
    // Get the current product data
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    // Update only the image URL and metadata
    await updateDoc(productRef, {
      imageUrl,
      updatedAt: Timestamp.now(),
      updatedBy
    });
  } catch (error) {
    console.error('Error updating product image:', error);
    throw new Error('Failed to update product image');
  }
};

/**
 * Gets all products
 * @returns Array of products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    
    const products: Product[] = [];
    
    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category,
        updatedAt: data.updatedAt.toDate(),
        updatedBy: data.updatedBy
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to get products');
  }
};

/**
 * Gets a product by ID
 * @param productId The ID of the product to get
 * @returns The product data
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return null;
    }
    
    const data = productSnap.data();
    
    return {
      id: productSnap.id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      category: data.category,
      updatedAt: data.updatedAt.toDate(),
      updatedBy: data.updatedBy
    };
  } catch (error) {
    console.error('Error getting product:', error);
    throw new Error('Failed to get product');
  }
};

export { db };
