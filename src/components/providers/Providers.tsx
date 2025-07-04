"use client";

import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from "@/context/ProductContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider>
        {children}
      </ProductProvider>
    </AuthProvider>
  );
}
