"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Section from '../ui/Section';
import Button from '../ui/Button';

const AboutSection = () => {
  // Global business network images for carousel
  const globalImages = [
    "https://images.unsplash.com/photo-1480714378408-67c7579f3cac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1507208773393-40d9fc670acf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % globalImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Section background="white" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image Side - Carousel */}
        <div className="relative animate-fadeIn">
          <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden">
            {globalImages.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Global Business Network ${index + 1}`}
                fill
                className={`object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                priority={index === 0}
              />
            ))}
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {globalImages.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block animate-fadeIn">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Global Clients</p>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">500+</h4>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Countries Served</p>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">40+</h4>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Products</p>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">100+</h4>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Years Experience</p>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">15+</h4>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Side */}
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Trusted Partner for <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Premium Bulk Products</span>
          </h2>
          
          <p className="text-gray-600 mb-6">
            For over 15 years, B2B Showcase has been a leading provider of high-quality bulk commodities and raw materials to businesses worldwide. We pride ourselves on our commitment to quality, reliability, and exceptional service.
          </p>
          
          <div className="space-y-4 mb-8">
            {[
              { title: 'Premium Quality', description: 'We source only the highest quality products from trusted suppliers.' },
              { title: 'Global Reach', description: 'Our extensive network allows us to serve clients in over 40 countries.' },
              { title: 'Competitive Pricing', description: 'We offer competitive pricing without compromising on quality.' },
              { title: 'Reliable Delivery', description: 'Our efficient logistics ensure timely delivery of your orders.' }
            ].map((item, index) => (
              <div className="flex items-start" key={index}>
                <div className="flex-shrink-0 mt-1">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-teal-400 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button href="/about" size="lg">
            Learn More About Us
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
