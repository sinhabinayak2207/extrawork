// This is a Client Component
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

// Set metadata in a layout or page that doesn't use client components
// This will be handled by the parent layout or a separate metadata file

// Icons are now implemented using SVG elements directly

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Quality Assurance",
    description: "Rigorous quality control processes ensure every product meets the highest industry standards."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Sustainability",
    description: "Committed to eco-friendly practices and sustainable sourcing across our supply chain."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Innovation",
    description: "Constantly evolving with cutting-edge technology and innovative solutions."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Customer Focus",
    description: "Building lasting relationships through exceptional service and support."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Global Reach",
    description: "Serving clients across 30+ countries with reliable logistics and distribution."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Partnership",
    description: "Collaborating with industry leaders to deliver comprehensive solutions."
  }
];

// Animation variants for Framer Motion
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section background="gradient" paddingY="md" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-400/20"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full -translate-y-1/4 translate-x-1/4 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-500/5 rounded-full translate-y-1/4 -translate-x-1/4 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl text-gray-700 font-bold mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Our Company</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-black max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Pioneering the future of B2B solutions with innovation, integrity, and excellence
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button 
                href="/contact" 
                variant="secondary"
                className="px-6 py-3 text-base font-medium"
              >
                Get in Touch
              </Button>
              <Button 
                href="/services" 
                variant="outline"
                className="px-6 py-3 text-base font-medium bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                Our Services
              </Button>
            </motion.div>
          </div>

          <motion.div 
            className="relative h-64 md:h-96 w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&q=80"
              alt="Our team collaborating in a modern office"
              fill
              className="object-cover"
              priority
            />


            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-sm font-medium text-blue-300">Global Presence</p>
              <p className="text-sm text-gray-300">Serving clients across 30+ countries</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Statistics Section */}
      <Section background="light" paddingY="lg" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '4+', label: 'Years Experience' },
              { value: '10+', label: 'Happy Clients' },
              { value: '20+', label: 'Commodity Handling' },
              { value: '20+', label: 'Countries Served' },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl text-gray-700 font-bold mb-6"
          >
            About <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Our Company</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 mb-8"
          >
            Leading the way in B2B solutions with innovation, quality, and exceptional service for businesses worldwide.
          </motion.p>
        </div>
      </Section>
      
      {/* Company Overview */}
      <Section background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              <div className="absolute -bottom-8 -right-4 w-24 h-24 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
                <p className="text-gray-800 mb-4 leading-relaxed">
                We are commodity trading and Supply Chain management company based in Qatar and Doing Business Globally with associates present in UAE and Senegal.
                </p>
                <p className="text-gray-800 mb-6 leading-relaxed">
                Company has deep roots in global shipping practice with strong network in shipping and logistics for optimised supply cost.
                </p>
                <div className="space-y-4">
                  {["Global Supply Chain Network", "Quality Assurance", "Sustainable Practices", "24/7 Customer Support"].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="text-green-600 mt-1 mr-3 flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button href="/contact" size="lg">Get in Touch</Button>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="B2B Showcase Headquarters" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Our Global Headquarters</h3>
                <p className="text-gray-200">Strategically located to serve our international clients with efficiency and care.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
      
      {/* Core Values */}
      <Section background="dark">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Our Core Values</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            These principles guide everything we do and define who we are as a company.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500 group hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-900 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* Mission & Values */}
      <Section background="light">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Mission & Vision</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            We are guided by a clear purpose and ambitious vision that drive everything we do.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden group border border-gray-100 hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
            <div className="absolute -right-16 -top-16 w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-8 transform -rotate-6 group-hover:rotate-0 transition-all duration-500 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-600">Our Mission</h3>
              <p className="text-gray-600 mb-6 text-lg">
                To provide businesses with premium quality products and innovative solutions that drive efficiency, sustainability, and growth. We aim to be the trusted partner that helps our clients succeed in an ever-evolving global marketplace.
              </p>
              
              <div className="flex items-center text-blue-600 font-medium">
                <span>Learn how we execute our mission</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-teal-700"></div>
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-teal-50 rounded-full opacity-20"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mb-8 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Our Vision</h3>
              <p className="text-gray-600 mb-6 text-lg">
                To be the global leader in B2B solutions, recognized for our commitment to quality, innovation, and exceptional service. We envision a world where businesses have seamless access to the best products and services to fuel their success.
              </p>
              
              <div className="flex items-center text-teal-600 font-medium">
                <span>See our roadmap to the future</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-600" >
          {[
            {
              title: "Quality",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              description: "We never compromise on the quality of our products and services.",
              color: "blue"
            },
            {
              title: "Integrity",
              icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4",
              description: "We conduct business with honesty, transparency, and ethical standards.",
              color: "purple"
            },
            {
              title: "Innovation",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              description: "We continuously seek new ways to improve and deliver value.",
              color: "teal"
            },
            {
              title: "Partnership",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              description: "We build lasting relationships with clients, suppliers, and communities.",
              color: "amber"
            }
          ].map((value, index) => (
            <motion.div 
              key={index} 
              className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-b-4 ${value.color === 'blue' ? 'border-blue-500' : value.color === 'purple' ? 'border-purple-500' : value.color === 'teal' ? 'border-teal-500' : 'border-amber-500'} hover:-translate-y-1`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 ${value.color === 'blue' ? 'bg-blue-100' : value.color === 'purple' ? 'bg-purple-100' : value.color === 'teal' ? 'bg-teal-100' : 'bg-amber-100'} rounded-xl flex items-center justify-center mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300`}>
                <svg className={`w-8 h-8 ${value.color === 'blue' ? 'text-blue-600' : value.color === 'purple' ? 'text-purple-600' : value.color === 'teal' ? 'text-teal-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
      
     {/* Team Section */}
<Section background="white">
  <motion.div 
    className="text-center mb-16"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-3xl font-bold mb-4 text-gray-700">
      Our Company <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Business Head</span>
    </h2>
    <p className="text-gray-600 max-w-3xl mx-auto">
      Meet the experienced professionals who guide our company's vision and operations.
    </p>
  </motion.div>

  <div className="flex justify-center text-gray-700">
    {[
      {
        name: "Mrs Ami Mehul Rawal",
        role: "Business Head",
        image: "https://res.cloudinary.com/doa53gfwf/image/upload/v1752562335/products/HGmzo9oBr0zxGp69hStO/1752562333707_photo_2025-07-15_12-16-20.jpg.jpg?t=1752562333707&t=1752562335570",
        bio: "With over 20 years of experience in global trade and business development."
      },
    ].map((member, index) => (
      <motion.div 
        key={index} 
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="relative overflow-hidden group mx-auto">
          <Image 
            src={member.image} 
            alt={member.name} 
            width={400}
            height={400}
            className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white text-sm">View Profile</p>
          </div>
        </div>
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold mb-1">{member.name}</h3>
          <p className="text-blue-600 font-medium mb-3">{member.role}</p>
          <p className="text-gray-600">{member.bio}</p>
        </div>
      </motion.div>
    ))}
  </div>
</Section>

      
      {/* Global Presence */}
      <Section background="light">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-700">Our Global Presence</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            With offices and partners worldwide, we deliver solutions to businesses across the globe.
          </p>
        </motion.div>
        
        <div className="relative h-[500px] rounded-xl overflow-hidden mb-8">
          <Image 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Global Presence Map" 
            fill 
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700">Africa</h3>
            </div>
            <ul className="space-y-3 text-gray-600 pl-4">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>West Africa <span className="text-sm text-blue-600 font-medium"></span></span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>Ghana</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>Nigeria</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>Senegal</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700">Europe & Middle East</h3>
            </div>
            <ul className="space-y-3 text-gray-600 pl-4">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span>London, UK <span className="text-sm text-purple-600 font-medium"></span></span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span>Frankfurt, Germany</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span>Paris, France</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span>Dubai, UAE</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700">Asia</h3>
            </div>
            <ul className="space-y-3 text-gray-600 pl-4">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                <span>Gandhidham (Kandla)<span className="text-sm text-teal-600 font-medium"></span></span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                <span>Ahmedabad</span>
              </li>
             
            </ul>
          </motion.div>
        </div>
      </Section>
      
    
      
      {/* CTA Section */}
      <Section background="gradient" paddingY="lg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl text-gray-700 font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto text-gray-600">
              Partner with us to access premium B2B solutions that drive growth, efficiency, and innovation for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="/contact" 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Our Team
              </motion.a>
              <motion.a 
                href="/services" 
                className="px-8 py-3 text-gray-700 bg-transparent border-2 border-gray-300 font-medium rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Our Services
              </motion.a>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
