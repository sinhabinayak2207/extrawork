"use client";

import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

// This is a simplified version of MainLayout that doesn't include Navbar
// since Navbar is already included in the root layout
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      {children}
    </>
  );
};

export default MainLayout;
