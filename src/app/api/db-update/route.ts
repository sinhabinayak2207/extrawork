import { NextResponse } from 'next/server';
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
      console.log('[API] Initializing new Firebase app');
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      console.log('[API] Using existing Firebase app');
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

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { collection, docId, data } = body;
    
    console.log(`[API] Updating ${collection}/${docId} with:`, data);
    
    // Validate inputs
    if (!collection || !docId || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: collection, docId, or data' },
        { status: 400 }
      );
    }
    
    // Get Firestore instance
    const db = getFirestoreInstance();
    
    // Add timestamp to data
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    // Update document with merge
    await setDoc(doc(db, collection, docId), updateData, { merge: true });
    
    console.log(`[API] Successfully updated ${collection}/${docId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document', details: error },
      { status: 500 }
    );
  }
}
