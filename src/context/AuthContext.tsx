"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { signInWithEmailAndPassword as firebaseSignInWithEmail, signInWithGoogle as firebaseSignInWithGoogle, signOut as firebaseSignOut, auth } from '@/lib/firebase-auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithCredentials: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isMasterAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Check if user is admin or master admin - using case-insensitive comparison
  const adminEmails = ['admin@example.com'];
  const masterAdminEmails = ['sinha.vinayak2207@gmail.com', 'trade@occworldtrade.com'];
  const isAdmin = user?.email ? adminEmails.some(email => email.toLowerCase() === user.email?.toLowerCase()) : false;
  const isMasterAdmin = user?.email ? masterAdminEmails.some(email => email.toLowerCase() === user.email?.toLowerCase()) : false;
  
  // Listen for auth state changes
  useEffect(() => {
    // Log current domain for debugging
    if (typeof window !== 'undefined') {
      console.log('Current domain:', window.location.hostname);
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signInWithCredentials = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseSignInWithEmail(email, password);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      router.push('/');
    } catch (error: any) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseSignInWithGoogle();
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      router.push('/');
    } catch (error: any) {
      setError('An error occurred during Google sign in');
      console.error('Google sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const result = await firebaseSignOut();
      
      if (result.error) {
        console.error('Sign out error:', result.error);
        return;
      }
      
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithCredentials,
        signInWithGoogle,
        logout,
        isAdmin,
        isMasterAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
