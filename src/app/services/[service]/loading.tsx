"use client";

import { motion } from "framer-motion";
import MainLayout from "../../../components/layout/MainLayout";
import Section from "../../../components/ui/Section";

export default function ServiceLoading() {
  return (
    <MainLayout>
      {/* Hero Section Skeleton */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-10 w-3/4 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
          <div className="h-12 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </Section>
      
      {/* Overview Section Skeleton */}
      <Section background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="space-y-2 mb-6">
              <div className="h-5 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden bg-gray-200 animate-pulse"></div>
        </div>
      </Section>
      
      {/* Benefits Section Skeleton */}
      <Section background="light">
        <div className="text-center mb-12">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(5)].map((_, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 p-2 rounded-full w-9 h-9 mr-4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* Process Section Skeleton */}
      <Section background="white">
        <div className="text-center mb-12">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        
        <div className="space-y-6">
          {[...Array(5)].map((_, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row gap-6 items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex-grow">
                <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* CTA Section Skeleton */}
      <Section background="gradient">
        <div className="text-center max-w-3xl mx-auto">
          <div className="h-8 w-1/2 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-5 w-3/4 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 w-full sm:w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 w-full sm:w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
