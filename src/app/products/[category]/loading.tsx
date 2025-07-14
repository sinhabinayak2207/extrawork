"use client";

import { motion } from "framer-motion";
import MainLayout from "../../../components/layout/MainLayout";
import Section from "../../../components/ui/Section";

export default function CategoryLoading() {
  return (
    <MainLayout>
      {/* Skeleton for hero section */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
        </div>
      </Section>
      
      {/* Skeleton for products grid */}
      <Section background="white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md h-[400px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-6 w-1/5 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-3 border-t border-gray-100">
                  <div className="h-4 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-1/5 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </MainLayout>
  );
}
