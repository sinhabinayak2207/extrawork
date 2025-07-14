"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const [currentYear, setCurrentYear] = useState(2023);
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={footerVariants}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <Image 
                src="/octpopuslogo.jpg" 
                alt="Octopus SCM Logo" 
                width={60} 
                height={60} 
                className="rounded-md mr-3"
              />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                OCC WORLD TRADE
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
            Your Trusted commodity partner for India and Global countries trade."
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/occworldtrade/" className="text-gray-300 hover:text-white transition-colors duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-white">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/rice" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Rice
                </Link>
              </li>
              <li>
                <Link href="/products/seeds" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/oil" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Oil
                </Link>
              </li>
              <li>
                <Link href="/products/minerals" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Minerals
                </Link>
              </li>
              <li>
                <Link href="/products/bromine-salt" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Bromine Salt
                </Link>
              </li>
              <li>
                <Link href="/products/sugar" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Sugar
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <address className="not-italic">
              <div className="flex items-start mb-3">
                <svg className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">
                OCC WORLD TRADE<br />
                204, Meridian House, sector 8,<br />
                  Gandhidham Kutch
                </span>
              </div>
              <div className="flex items-center mb-3">
                <svg className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">+91 8258008258</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:Trade@occworldtrade.com" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Trade@occworldtrade.com
                </a>
              </div>
            </address>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-8"></div>

        {/* Copyright */}
        <motion.div 
          className="text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-3">
           
            <p className="text-gray-300">
              &copy; {currentYear} OCC WORLD TRADE. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
