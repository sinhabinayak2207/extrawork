"use client";

import { forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  href?: string;
  as?: string; // For backward compatibility
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  whileHover?: any;
  whileTap?: any;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled = false,
    fullWidth = false,
    type = 'button',
    ariaLabel,
    whileHover,
    whileTap,
    href,
    as, // Kept for backward compatibility
    ...props
  },
  ref
) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-teal-400 hover:from-blue-700 hover:to-teal-500 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50',
    text: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
  };

  // Combine classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Animation props
  const motionProps = {
    whileHover: whileHover || { scale: 1.03 },
    whileTap: whileTap || { scale: 0.97 },
  };

  // If it's a link
  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link
          href={href}
          className={buttonClasses}
          aria-label={ariaLabel}
          {...props}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  // Otherwise, render as button
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      aria-label={ariaLabel}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;