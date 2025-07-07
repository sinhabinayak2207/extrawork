"use client";

import { AuthProvider as AuthContextProvider } from '@/context/AuthContext';
import { ProductProvider } from "@/context/ProductContext";
import { CategoryProvider } from "@/context/CategoryContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <ProductProvider>
        <CategoryProvider>
          {children}
        </CategoryProvider>
      </ProductProvider>
    </AuthContextProvider>
  );
}
