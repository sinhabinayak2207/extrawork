import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase-auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isMasterAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isMasterAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if the user is the master admin
  const isMasterAdmin = user?.email === 'sinha.vinayak2207@gmail.com';

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
    <AuthContext.Provider value={{ user, loading, isMasterAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
