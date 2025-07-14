"use client";

import { useEffect } from 'react';

// This component fixes viewport width issues that can cause horizontal overflow on mobile
const FixViewport = () => {
  useEffect(() => {
    // Function to update the CSS viewport width
    const updateViewportWidth = () => {
      // Set the CSS viewport width variable to the actual inner width
      document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
    };

    // Initial call
    updateViewportWidth();

    // Add event listener for resize
    window.addEventListener('resize', updateViewportWidth);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  return null; // This component doesn't render anything
};

export default FixViewport;
