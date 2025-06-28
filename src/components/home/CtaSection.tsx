"use client";

import Button from '../ui/Button';
import Section from '../ui/Section';

const CtaSection = () => {
  return (
    <Section background="gradient" paddingY="xl">
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fadeIn">
            Ready to Source <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Premium Products</span> for Your Business?
          </h2>
          
          <p className="text-gray-600 text-lg mb-8 animate-fadeIn">
            Contact our team today to discuss your bulk product requirements. We offer competitive pricing, reliable delivery, and exceptional customer service.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn">
            <Button href="/products" size="lg">
              Explore Products
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CtaSection;
