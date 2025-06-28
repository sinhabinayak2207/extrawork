"use client";

import { motion } from "framer-motion";
import MainLayout from "../../components/layout/MainLayout";
import Section from "../../components/ui/Section";

export default function ContactLoading() {
  return (
    <MainLayout>
      {/* Hero section skeleton */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
        </div>
      </Section>
      
      {/* Contact form and info section skeleton */}
      <Section background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form skeleton */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-8 w-1/2 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            
            <div className="space-y-6">
              {/* Name field */}
              <div>
                <div className="h-5 w-1/4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Email field */}
              <div>
                <div className="h-5 w-1/4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Company field */}
              <div>
                <div className="h-5 w-1/4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Subject field */}
              <div>
                <div className="h-5 w-1/4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Message field */}
              <div>
                <div className="h-5 w-1/4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Submit button */}
              <div className="h-12 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          {/* Contact info skeleton */}
          <div>
            <div className="h-8 w-1/2 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            
            <div className="space-y-8">
              {/* Address */}
              <div className="flex">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-1/3 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-1 animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-1/3 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-1/3 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              {/* Hours */}
              <div className="flex">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-1/3 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-1 animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Map skeleton */}
      <Section background="light" paddingY="lg">
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </Section>
    </MainLayout>
  );
}
