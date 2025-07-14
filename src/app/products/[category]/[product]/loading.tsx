"use client";

import { motion } from "framer-motion";
import MainLayout from "../../../../components/layout/MainLayout";
import Section from "../../../../components/ui/Section";

export default function ProductLoading() {
  return (
    <MainLayout>
      <Section background="white" paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Skeleton */}
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gray-200 animate-pulse"></div>
          
          {/* Product Details Skeleton */}
          <div>
            <div className="inline-block px-3 py-1 bg-gray-200 rounded-full w-24 h-6 mb-4 animate-pulse"></div>
            
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
            
            <div className="space-y-2 mb-8">
              <div className="h-5 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-2/3 animate-pulse"></div>
            </div>
            
            {/* Specifications Skeleton */}
            <div className="mb-8">
              <div className="h-7 bg-gray-200 rounded-lg w-1/3 mb-4 animate-pulse"></div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {[...Array(6)].map((_, index) => (
                    <motion.div 
                      key={index}
                      className="flex flex-col"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-1 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* CTA Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-12 bg-gray-200 rounded-lg w-full sm:w-1/2 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full sm:w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Related Products Skeleton */}
      <Section background="light">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </MainLayout>
  );
}
