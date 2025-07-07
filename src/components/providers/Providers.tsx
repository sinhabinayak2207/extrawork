"use client";

import { AuthProvider as AuthContextProvider } from '@/context/AuthContext';
import { ProductProvider } from "@/context/ProductContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { ProductModalProvider } from "@/context/ProductModalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <ProductProvider>
        <CategoryProvider>
          <ProductModalProvider>
            {children}
          </ProductModalProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthContextProvider>
  );
}
