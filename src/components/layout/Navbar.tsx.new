"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  name: string;
  path: string;
  dropdown?: { name: string; path: string }[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Set client-side flag and check auth status
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      
      // Only access localStorage on client-side
      if (typeof window !== 'undefined') {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const email = localStorage.getItem('userEmail') || '';
        setIsLoggedIn(loggedIn);
        setUserEmail(email);
      }
    }, 100); // Increased delay to ensure proper hydration
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);
  
  const toggleDropdown = (name: string) => {
    setOpenDropdown(prevState => prevState === name ? null : name);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    router.push('/');
  };

  // Don't render full navbar during SSR
  if (!isClient) {
    return <nav className="fixed w-full h-16 bg-black z-50" aria-hidden="true" />;
  }

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    scrolled ? 'bg-black shadow-lg' : 'bg-black'
  } py-1`;
  
  const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { 
      name: 'Products', 
      path: '/products',
      dropdown: [
        { name: 'Rice', path: '/products/rice' },
        { name: 'Seeds', path: '/products/seeds' },
        { name: 'Oil', path: '/products/oil' },
        { name: 'Raw Polymers', path: '/products/raw-polymers' },
        { name: 'Bromine Salt', path: '/products/bromine-salt' },
      ]
    },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Contact', path: '/contact' },
  ];
  
  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile view - Logo on left, hamburger on right */}
          <div className="md:hidden w-full">
            <div className="flex justify-between items-center">
              {/* Left: Logo with increased font */}
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent ml-4">
                B2B Showcase
              </Link>
              
              {/* Right: Hamburger menu */}
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  setOpenDropdown(null);
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Desktop view */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo - increased font size by 2 and placed on left (not extreme left) */}
            <div className="flex-shrink-0 ml-8">
              <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                B2B Showcase
              </Link>
            </div>
            
            {/* All navigation links and buttons grouped together on the right */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <div key={link.path} className="relative">
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(link.name)}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {link.name}
                        <svg
                          className="ml-1 h-4 w-4 transition-transform duration-200"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          style={{ transform: openDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)' }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {openDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-2 overflow-hidden"
                            style={{ top: '100%', left: 0 }}
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.path}
                                href={item.path}
                                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 border-l-2 border-transparent hover:border-blue-500"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.path}
                      className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium ${pathname === link.path ? 'bg-gray-800 text-white' : ''} transition-all duration-200 hover:scale-105 active:scale-95`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Auth buttons - now part of the same right-side group */}
              <div className="flex items-center ml-6">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('user')}
                      className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold">
                        {userEmail.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openDropdown === 'user' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                          style={{ top: '100%' }}
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm text-gray-700">Signed in as</p>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userEmail}
                            </p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <Link
                      href="/auth"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-md font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <div key={link.path} className="space-y-1">
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
                    >
                      {link.name}
                      <svg
                        className={`ml-2 h-5 w-5 transform transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-1 overflow-hidden bg-gray-900"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.path}
                              href={item.path}
                              className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                              onClick={() => {
                                setOpenDropdown(null);
                                setIsOpen(false);
                              }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile auth buttons */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              {isLoggedIn ? (
                <div className="px-5">
                  <div className="text-base font-medium text-white">{userEmail}</div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-2">
                  <Link
                    href="/auth"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-gray-600 hover:bg-gray-700 transition-transform active:scale-95"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-transform active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
