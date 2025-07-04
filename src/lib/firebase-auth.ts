import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKv_Rs6MNXV1cshKhf7T4C93RG82u11LA",
  authDomain: "b2bshowcase-199a8.firebaseapp.com",
  projectId: "b2bshowcase-199a8",
  storageBucket: "b2bshowcase-199a8.firebasestorage.app",
  messagingSenderId: "608819928179",
  appId: "1:608819928179:web:774b8f3e120a927f279e06",
  measurementId: "G-8VTK238F1Y"
};

// List of authorized domains for Firebase Auth
const authorizedDomains = [
  'localhost',
  'b2bshowcase-199a8.web.app',
  'b2bshowcase-199a8.firebaseapp.com',
  'octopus-sh.netlify.app'
];

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure auth settings
if (typeof window !== 'undefined') {
  // This is a client-side only operation
  auth.useDeviceLanguage();
}

const googleProvider = new GoogleAuthProvider();

// Helper function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Failed to sign in with Google'
    };
  }
};

// Helper function to sign in with email and password
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const result = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Failed to sign in with email and password'
    };
  }
};

// Helper function to sign up with email and password
export const signUpWithEmailAndPassword = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with the display name
    if (result.user) {
      await updateProfile(result.user, { displayName });
    }
    
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Failed to sign up'
    };
  }
};

// Helper function to sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to sign out' };
  }
};

// Export the auth object for direct access if needed
export { auth };
