"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Section from '../ui/Section';

// Services data based on client requirements
const services = [
  
  {
    id: '1',
    title: 'PACKING & TRANSPORTATION',
    slug: 'packing-transportation',
    description: 'We use the latest methods of packing cargo including palletization for necessary cargo and arrange for fumigation. We have our own vehicles to pick up and deliver cargo in and around Chennai, Bangalore, Krishnapatnam, Tuticorin, etc.',
    icon: '/icons/packaging.svg',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-green-500 to-emerald-600',
    hoverColor: 'group-hover:from-green-600 group-hover:to-emerald-700'
  },
  {
    id: '5',
    title: 'WAREHOUSING AND DISTRIBUTION',
    slug: 'warehousing-distribution',
    description: 'We handle all types of cargo with attractive payment options. We provide covered warehouse spaces in India and abroad for tailor-made services, with separate warehouses for Airfreight and Ocean Freight Cargo, and offer distribution and door delivery to all possible corners of the country.',
    icon: '/icons/warehouse.svg',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-amber-500 to-orange-600',
    hoverColor: 'group-hover:from-amber-600 group-hover:to-orange-700'
  },
  {
    id: '6',
    title: 'DOCUMENTATION & INSURANCE',
    slug: 'documentation-insurance',
    description: 'We provide expertise in documentation with faster service and offer insurance services for both inbound & outbound cargos by Air & Sea to ensure your shipments are protected.',
    icon: '/icons/document.svg',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80',
    color: 'from-red-500 to-rose-600',
    hoverColor: 'group-hover:from-red-600 group-hover:to-rose-700'
  },

];

// Process steps data
const processSteps = [
  {
    id: 1,
    title: 'Discovery',
    description: 'We analyze your business needs and market requirements',
    icon: '🔍',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Strategy',
    description: 'We develop a customized plan tailored to your goals',
    icon: '📊',
    color: 'bg-gradient-to-r from-purple-500 to-indigo-500'
  },
  {
    id: 3,
    title: 'Execution',
    description: 'Our team implements the solution with precision',
    icon: '⚙️',
    color: 'bg-gradient-to-r from-amber-500 to-orange-500'
  },
  {
    id: 4,
    title: 'Support',
    description: 'Ongoing assistance to ensure continued success',
    icon: '🤝',
    color: 'bg-gradient-to-r from-emerald-500 to-green-500'
  }
];

const ServicesSection = () => {
  const [activeService, setActiveService] = useState('1');
  return (
    <div id="services" className="relative overflow-hidden py-12 md:py-16 text-white" style={{ backgroundColor: '#111827' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-7">
            Our <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-lg text-gray-300">
            We offer a comprehensive range of services to support your business needs,
            from sourcing and quality control to logistics and consulting.
          </p>
        </div>

      {/* Interactive Service Tabs */}
      <div className="mt-8">
        {/* Service Navigation */}
        <div className="flex flex-wrap overflow-x-auto pb-4 hide-scrollbar space-x-2 md:space-x-4 justify-center">
          {/* First row: First 4 services */}
          <div className="flex flex-wrap justify-center w-full mb-4">
            {services.slice(0, 4).map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`px-4 py-3 m-2 rounded-full whitespace-nowrap transition-all duration-300 ${activeService === service.id 
                  ? `bg-gradient-to-r ${service.color} text-white shadow-lg` 
                  : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {service.title}
              </button>
            ))}
          </div>
          
          {/* Second row: Last 2 services */}
          <div className="flex flex-wrap justify-center w-full">
            {services.slice(4, 6).map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`px-4 py-3 m-2 rounded-full whitespace-nowrap transition-all duration-300 ${activeService === service.id 
                  ? `bg-gradient-to-r ${service.color} text-white shadow-lg` 
                  : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Service Display */}
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`mt-8 transition-all duration-500 ${activeService === service.id ? 'opacity-100' : 'opacity-0 hidden'}`}
          >
            <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image 
                    src={service.image} 
                    alt={service.title}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-60`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
                
                {/* Content Section */}
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color} mr-4`}>
                      <Image 
                        src={service.icon} 
                        alt="" 
                        width={32} 
                        height={32}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <h3 className="text-3xl font-bold text-white">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-8">{service.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      </div>
                      <span className="text-gray-300">Tailored to your specific business needs</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      </div>
                      <span className="text-gray-300">Industry-leading expertise and technology</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      </div>
                      <span className="text-gray-300">Proven results and customer satisfaction</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/contact"
                    className={`mt-8 inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${service.color} text-white font-medium transition-transform hover:scale-105`}
                  >
                    Contact Us
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Our Process Section */}
      <div className="mt-24 relative">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Process</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">How we deliver exceptional results through our proven methodology</p>
        </div>
        
        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {processSteps.map((step) => (
            <div key={step.id} className="bg-gray-800 rounded-2xl p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className={`${step.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
              <p className="text-gray-400">{step.description}</p>
              <div className="mt-6 flex items-center text-sm">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${step.color} text-white font-bold mr-2`}>
                  {step.id}
                </span>
                <span className="text-gray-500">Step {step.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Banner */}
      <div className="mt-24 mb-12">
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl shadow-2xl relative overflow-hidden border border-blue-400/20">
          {/* Glass-like overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 mix-blend-overlay"></div>
          
          {/* Content with glass card effect */}
          <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8 md:p-12">
            <div className="md:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-inner">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-white text-sm font-semibold mb-4">Premium Sourcing</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Source Premium Products for Your Business?</h3>
              <p className="text-blue-100 text-lg max-w-xl mb-6">Contact our team today to discuss your bulk product requirements. We offer competitive pricing, reliable delivery, and exceptional customer service.</p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Global Suppliers
                </div>
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Quality Assurance
                </div>
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Competitive Pricing
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 flex flex-col justify-center items-center gap-5">
              <Link 
                href="/categories" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                Explore Products
              </Link>
              <Link 
                href="/contact" 
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Add animation keyframes to global styles
const animationStyles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

// Add styles to document if they don't exist yet
if (typeof document !== 'undefined') {
  const id = 'service-section-styles';
  if (!document.getElementById(id)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = id;
    styleSheet.innerHTML = animationStyles;
    document.head.appendChild(styleSheet);
  }
}

export default ServicesSection;
