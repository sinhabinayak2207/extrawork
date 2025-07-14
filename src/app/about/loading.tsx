import MainLayout from "../../components/layout/MainLayout";
import Section from "../../components/ui/Section";

export default function AboutLoading() {
  return (
    <MainLayout>
      {/* Hero section skeleton */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
        </div>
      </Section>
      
      {/* Company Overview skeleton */}
      <Section background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="h-8 w-1/2 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="space-y-4 mb-6">
              <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden bg-gray-200 animate-pulse"></div>
        </div>
      </Section>
      
      {/* Mission & Values skeleton */}
      <Section background="light">
        <div className="text-center mb-12">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[...Array(2)].map((_, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
              <div className="h-6 w-1/3 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
              <div className="h-5 w-1/2 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </Section>
      
      {/* Team Section skeleton */}
      <Section background="white">
        <div className="text-center mb-12">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      
      {/* Global Presence skeleton */}
      <Section background="light">
        <div className="text-center mb-12">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        
        <div className="h-[500px] bg-gray-200 rounded-xl animate-pulse mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="h-6 w-1/3 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      
      {/* CTA Section skeleton */}
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