import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import MainLayout from "../../../components/layout/MainLayout";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import { getService } from "../../../lib/api/mockData";

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
  const service = await getService(params.service);
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    };
  }
  
  return {
    title: `${service.title} - B2B Showcase`,
    description: service.description,
  };
}

// Helper function to get the icon component based on the icon name
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'search':
      return (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'truck':
      return (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      );
    case 'shield-check':
      return (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'globe':
      return (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'chart-bar':
      return (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

export default async function ServicePage({ params }: { params: { service: string } }) {
  const serviceSlug = params.service;
  const service = await getService(serviceSlug);
  
  if (!service) {
    notFound();
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            {getIconComponent(service.icon)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {service.title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {service.description}
          </p>
          <Button href="/contact" size="lg">
            Request Consultation
          </Button>
        </div>
      </Section>
      
      {/* Overview Section */}
      <Section background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Service <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Overview</span>
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {service.longDescription}
            </p>
            <Button href="/contact" variant="outline">
              Get Started
            </Button>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src={`https://source.unsplash.com/random/800x600?${service.slug.replace('-', '+')}`}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>
      
      {/* Benefits Section */}
      {service.benefits && (
        <Section background="light">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Key <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Benefits</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Why our clients choose our {service.title.toLowerCase()} service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800">{benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}
      
      {/* Process Section */}
      {service.process && (
        <Section background="white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Process</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              How we deliver exceptional {service.title.toLowerCase()} services
            </p>
          </div>
          
          <div className="space-y-6">
            {service.process.map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col md:flex-row gap-6 items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-600 to-teal-400 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {service.process && index < service.process.length - 1 && (
                    <div className="border-l-2 border-dashed border-gray-300 h-12 ml-6 my-2 md:hidden"></div>
                  )}
                </div>
                
              </motion.div>
            ))}
          </div>
        </Section>
      )}
      
      {/* FAQs Section */}
      {service.faqs && (
        <Section background="light">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Common questions about our {service.title.toLowerCase()} service
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {service.faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-6">
                    <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                    <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </Section>
      )}
      
      {/* CTA Section */}
      <Section background="gradient">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact our team today to learn more about our {service.title.toLowerCase()} service and how we can help your business thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" size="lg">
              Contact Us
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              Explore Other Services
            </Button>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}