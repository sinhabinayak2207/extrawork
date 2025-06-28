"use client";

import { motion } from "framer-motion";
import MainLayout from "../../components/layout/MainLayout";
import Section from "../../components/ui/Section";

export default function ProductsLoading() {
  return (
    <MainLayout>
      {/* Hero section skeleton */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
        </div>
      </Section>
      
      {/* Categories grid skeleton */}
      <Section background="light">
        <div className="text-center mb-12">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <motion.div 
              key={index}
              className="relative h-64 rounded-xl overflow-hidden shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="h-6 w-3/4 bg-gray-300/50 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-300/50 rounded-lg animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* Featured products skeleton */}
      <Section background="white">
        <div className="text-center mb-12">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
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
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-6 w-1/5 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-10 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </MainLayout>
  );
}
