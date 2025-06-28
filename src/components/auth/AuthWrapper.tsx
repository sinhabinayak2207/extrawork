"use client";

import { ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
