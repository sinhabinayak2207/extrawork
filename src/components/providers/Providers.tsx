"use client";

import { AuthProvider as AuthContextProvider } from '@/context/AuthContext';
import { ProductProvider } from "@/context/ProductContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <ProductProvider>
        {children}
      </ProductProvider>
    </AuthContextProvider>
  );
}
