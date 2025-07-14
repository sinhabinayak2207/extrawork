"use client";

import { ReactNode } from 'react';
import Footer from './Footer';

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout = ({ children }: SimpleLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SimpleLayout;
