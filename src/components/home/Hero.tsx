"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/context/ProductContext';

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
  // Get products from context
  const productContext = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  

  // Images for the carousel when no featured products
  const carouselImages = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1507208773393-40d9fc670acf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get featured products from context
  useEffect(() => {
    if (productContext && productContext.products) {
      const featured = productContext.products.filter(product => product.featured === true);
      console.log('Found featured products in Hero:', featured.length);
      setFeaturedProducts(featured);
    }
  }, [productContext, forceUpdate]);
  
  // Listen for product updates
  useEffect(() => {
    const handleProductUpdate = () => {
      console.log('Product update detected in Hero');
      // Force re-render
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('productUpdated', handleProductUpdate);
    
    return () => {
      window.removeEventListener('productUpdated', handleProductUpdate);
    };
  }, []);
  
  // Auto-rotate carousel images every 4 seconds
  useEffect(() => {
    // Only run the carousel when there are no featured products
    if (featuredProducts.length === 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length, carouselImages.length]);
  
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
              <Button href="/categories" size="lg">
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
                  {/* Dynamic heading based on whether there are featured products */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {featuredProducts.length > 0 ? 'Featured Products' : ''}
                  </h3>
                  
                  {/* Featured Product Cards or Services Carousel */}
                  <div className="space-y-4">
                    {featuredProducts.length === 0 ? (
                      <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white text-xl font-medium">Our Global Network</h3>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                            <span className="text-blue-400 text-xs font-medium">Image Gallery</span>
                          </div>
                        </div>
                        
                        {/* Image Carousel */}
                        <div className="relative h-[320px] w-full rounded-lg overflow-hidden mb-4">
                          {/* Main Image */}
                          <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
                            <Image 

                              src={carouselImages[currentImageIndex]}
                              alt={`Business image ${currentImageIndex + 1}`}
                              fill
                              className="object-cover rounded-lg"
                              priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                        
                          {/* Caption */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h4 className="font-medium text-lg">
                              {currentImageIndex === 0 ? "Global Team Collaboration" :
                               currentImageIndex === 1 ? "Business Strategy Planning" :
                               currentImageIndex === 2 ? "Modern Office Environment" :
                               "Worldwide Network"}
                            </h4>
                            <p className="text-sm text-gray-200">
                              {currentImageIndex === 0 ? "Our teams work together across continents" :
                               currentImageIndex === 1 ? "Strategic planning for optimal results" :
                               currentImageIndex === 2 ? "State-of-the-art facilities" :
                               "Connected to partners worldwide"}
                            </p>
                          </div>
                          
                          {/* Navigation Dots */}
                          <div className="absolute bottom-4 right-4 flex space-x-2">
                            {carouselImages.map((_, index) => (
                              <button 
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'}`}
                                aria-label={`Go to slide ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Stats Row */}
                        
                      </div>
                    ) : featuredProducts.length === 1 ? (
                      /* Show one large product if only one featured */
                      <div 
                        key={featuredProducts[0].id}
                        className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/10 hover:translate-x-1 transition-transform"
                      >
                        <div className="h-40 w-full relative rounded-md overflow-hidden mb-4">
                          <Image 
                            src={featuredProducts[0].imageUrl || '/placeholder-image.jpg'}
                            alt={featuredProducts[0].name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-lg">{featuredProducts[0].name}</h4>
                          <p className="text-gray-300 text-sm">{featuredProducts[0].description.substring(0, 60)}...</p>
                        </div>
                      </div>
                    ) : featuredProducts.length === 2 ? (
                      /* Show two medium products if two featured */
                      <>
                        {featuredProducts.map((product) => (
                          <div 
                            key={product.id}
                            className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:translate-x-1 transition-transform"
                          >
                            <div className="h-24 w-full relative rounded-md overflow-hidden mb-3">
                              <Image 
                                src={product.imageUrl || '/placeholder-image.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{product.name}</h4>
                              <p className="text-gray-300 text-sm">{product.description.substring(0, 40)}...</p>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      /* Show three small products if three featured */
                      featuredProducts.slice(0, 3).map((product) => (
                        <div 
                          key={product.id}
                          className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-4 hover:translate-x-1 transition-transform"
                        >
                          <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                              src={product.imageUrl || '/placeholder-image.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{product.name}</h4>
                            <p className="text-gray-300 text-sm">{product.description.substring(0, 30)}...</p>
                          </div>
                        </div>
                      ))
                    )}
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