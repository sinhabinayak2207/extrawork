// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

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

// Additional authorized domains for Firebase Auth
const authorizedDomains = [
  'localhost',
  'b2bshowcase-199a8.web.app',
  'b2bshowcase-199a8.firebaseapp.com',
  'octopus-sh.netlify.app'
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set authorized domains for authentication
if (typeof window !== 'undefined') {
  // This is a client-side only operation
  auth.useDeviceLanguage();
}

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics
let analytics: any = null;
// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
