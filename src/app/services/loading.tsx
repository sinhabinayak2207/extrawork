"use client";

import { motion } from "framer-motion";
import MainLayout from "../../components/layout/MainLayout";
import Section from "../../components/ui/Section";

export default function ServicesLoading() {
  return (
    <MainLayout>
      {/* Hero section skeleton */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
        </div>
      </Section>
      
      {/* Services grid skeleton */}
      <Section background="white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="ml-4 h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* CTA section skeleton */}
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
