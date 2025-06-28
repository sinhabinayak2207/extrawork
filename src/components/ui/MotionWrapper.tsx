"use client";

import { ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

interface MotionWrapperProps {
  children: ReactNode;
}

export default function MotionWrapper({ children }: MotionWrapperProps) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
