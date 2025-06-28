"use client";

import Image from 'next/image';
import Button from '../ui/Button';

// Custom CSS for fixing mobile background image issues
const heroImageStyles = `
  .hero-bg-image {
    width: 100vw !important;
    height: 100vh !important;
    object-fit: cover !important;
    object-position: center center !important;
    left: 0 !important;
    right: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    position: absolute !important;
  }

  .hero-container {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .hero-bg-image {
      object-position: right top !important;
    }
  }
`;

const Hero = () => {
  return (
    <div className="hero-container relative flex items-center">
      {/* Add custom styles */}
      <style dangerouslySetInnerHTML={{ __html: heroImageStyles }} />
      
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
        <Image
          src="https://picsum.photos/id/1048/1920/1080" 
          alt="B2B Showcase Hero Background"
          fill
          priority
          className="hero-bg-image"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-800/80 md:from-gray-900/90 md:via-gray-800/80 md:to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 z-10 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="block">Premium Bulk Products</span>
              <span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                For Global Businesses
              </span>
            </h1>
            
            <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl">
              We provide high-quality bulk commodities and raw materials to businesses worldwide. 
              Our extensive product range includes rice, seeds, oil, raw polymers, and bromine salt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/products" size="lg">
                Explore Products
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative h-[500px] w-full">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-teal-400/20 rounded-2xl transform rotate-3"></div>
              <div className="absolute top-5 right-5 w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Featured Products</h3>
                  
                  {/* Featured Product Cards */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div 
                        key={item}
                        className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-4 hover:translate-x-1 transition-transform"
                      >
                        <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image 
                            src={`https://lh3.googleusercontent.com/pw/AP1GczNwGvVgGkSg9QzXQV_O9G4MU6b-RHKvu9LNsz5WOzWYFsHvYhH-Xvc0kVLLzEAVvQnk-_-Ks4_MYVmXvfDcCXXJbKXlnZMQTDpxcXDpJZsLvBM=w2400`}
                            alt={`Featured Product ${item}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Premium Product {item}</h4>
                          <p className="text-gray-300 text-sm">High-quality bulk materials</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll Down</span>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;