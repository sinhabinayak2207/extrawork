"use client";

import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  background?: 'white' | 'light' | 'dark' | 'gradient' | string;
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Section = ({
  children,
  className = '',
  id,
  fullWidth = false,
  background = 'white',
  paddingY = 'lg',
}: SectionProps) => {
  // Background classes
  const backgroundClasses: Record<string, string> = {
    white: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white'
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'py-4 md:py-6',
    md: 'py-8 md:py-12',
    lg: 'py-12 md:py-16',
    xl: 'py-16 md:py-24',
  };

  // Get background class or use custom color
  const getBgClass = () => {
    if (backgroundClasses[background]) {
      return backgroundClasses[background];
    }
    // If it's a custom color (like #878484), use inline style
    if (background.startsWith('#')) {
      return '';
    }
    return 'bg-white'; // Default fallback
  };

  return (
    <section
      id={id}
      className={`${getBgClass()} ${paddingClasses[paddingY]} ${className} animate-fadeIn ${background === '#111827' ? 'text-white' : ''}`}
      style={background.startsWith('#') ? { backgroundColor: background } : {}}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="container mx-auto px-4 md:px-6">
          {children}
        </div>
      )}
    </section>
  );
};

export default Section;
