import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase-auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isMasterAdmin: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isMasterAdmin: false,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // List of master admin emails
  const masterAdminEmails = ['sinha.vinayak2207@gmail.com', 'octopusscm3@gmail.com'];
  
  // List of admin emails (includes master admins)
  const adminEmails = [...masterAdminEmails, 'admin@example.com'];
  
  // Check if the user is a master admin
  const isMasterAdmin = user?.email ? masterAdminEmails.includes(user.email) : false;
  
  // Check if the user is an admin
  const isAdmin = user?.email ? adminEmails.includes(user.email) : false;

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Add authorized domains for Firebase Auth
    const currentDomain = window.location.hostname;
    console.log('Current domain:', currentDomain);
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isMasterAdmin, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
