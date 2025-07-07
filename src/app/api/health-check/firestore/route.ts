import { NextResponse } from 'next/server';

// Configure this route for both static export and dynamic rendering
// Use force-static for compatibility with static export
export const dynamic = 'force-static';
// But allow client-side revalidation
export const fetchCache = 'force-no-store';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

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

// Initialize Firebase for this API route
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function GET() {
  try {
    // Try to fetch a single document from Firestore to verify connection
    const productsRef = collection(db, 'products');
    const q = query(productsRef, limit(1));
    const snapshot = await getDocs(q);
    
    // If we can get data, the connection is working
    return NextResponse.json({ 
      status: 'ok',
      message: 'Firestore connection successful',
      timestamp: new Date().toISOString(),
      documentsFound: snapshot.size
    });
  } catch (error) {
    console.error('Firestore health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
