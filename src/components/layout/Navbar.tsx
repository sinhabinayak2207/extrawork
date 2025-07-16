"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useProducts, Product } from '@/context/ProductContext';
import { useProductModal } from '@/context/ProductModalContext';

interface DropdownItem {
  name: string;
  path: string;
  dropdown?: DropdownItem[];
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  imageUrl?: string;
}

interface NavLink {
  name: string;
  path: string;
  dropdown?: DropdownItem[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const productsCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<ProductItem[]>([]);
  
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use our authentication context
  const { user, logout: signOut, isAdmin, isMasterAdmin } = useAuth();
  const isLoggedIn = !!user;
  
  // Use product context
  const productContext = useProducts();
  const { openProductModal } = useProductModal();

  // Set client-side flag
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 100); // Delay to ensure proper hydration
    
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
    // Only close if not navigating within products section
    if (pathname && !pathname.includes('/products')) {
      setIsOpen(false);
      setOpenDropdown(null);
      setProductsDropdownOpen(false);
      setActiveCategory(null);
      setCategoryProducts([]);
    }
  }, [pathname]);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close Products dropdown when clicking outside
      if (productsDropdownRef.current && 
          !productsDropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
        setActiveCategory(null);
        setCategoryProducts([]);
      }
      
      // Close other dropdowns when clicking outside
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Load products for category when selected
  useEffect(() => {
    if (!activeCategory || !productContext) return;
    
    const categoryName = activeCategory.split('/').pop() || '';
    
    const filtered = productContext.products
      .filter((product: Product) => 
        product.category === categoryName
      )
      .map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: '', // Default empty string as subcategory doesn't exist in Product type
        imageUrl: product.imageUrl
      }));
    
    setCategoryProducts(filtered);
  }, [activeCategory, productContext]);
  
  const toggleDropdown = (name: string) => {
    setOpenDropdown(prevState => prevState === name ? null : name);
  };
  
  const toggleProductsDropdown = () => {
    setProductsDropdownOpen(prev => !prev);
    // When toggling, reset all selections
    setActiveCategory(null);
    setCategoryProducts([]);
  };
  
  const handleCategorySelect = (path: string) => {
    setActiveCategory(path);
  };
  
  const handleProductClick = (productId: string) => {
    if (openProductModal) {
      openProductModal(productId);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    setOpenDropdown(null);
  };
  
  // Don't render full navbar during SSR
  if (!isClient) {
    return <nav className="fixed w-full h-16 bg-black z-50" aria-hidden="true" />;
  }

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    scrolled ? 'bg-black shadow-lg' : 'bg-black'
  } py-1`;
  
  // Simplified navigation structure - only categories (no subcategories)
  const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    {
      name: 'Products',
      path: '/products',
      dropdown: [
        { name: 'Rice', path: '/products/rice' },
        { name: 'Seeds', path: '/products/seeds' },
        { name: 'Oil', path: '/products/oil' },
        { name: 'Bromine Salt', path: '/products/bromine-salt' },
        { name: 'Minerals', path: '/products/minerals' },
        { name: 'Sugar', path: '/products/sugar' }
      ]
    },
    { name: 'Categories', path: '/categories' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Contact', path: '/contact' },
    ...(isMasterAdmin ? [
      { 
        name: 'Admin', 
        path: '/admin',
        dropdown: [
          { name: 'Changes', path: '/admin/changes' },
          { name: 'Products Management', path: '/admin/products' },
          { name: 'Categories Management', path: '/admin/categories' },
       { name: 'Achievements Management', path: '/admin/achievements' }
        ]
      },
    ] : []),
  ];
  
  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-3 sm:px-1 lg:px-2 w-full">
        <div className="flex items-center justify-between h-16">
          {/* Mobile view - Logo on left, hamburger on right */}
          <div className="md:hidden w-full">
            <div className="flex justify-between items-center">
              {/* Left: Logo and company name */}
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/octpopuslogo.jpg" 
                  alt="Octopus SCM Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-md"
                />
                <span className="text-2xl font-bold text-white">OCC WORLD TRADE</span>
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
          <div className="hidden md:flex items-center justify-between w-full px-1">
            {/* Logo and company name - positioned on the extreme left */}
            <div className="flex-shrink-0 pl-1">
              <Link href="/" className="flex items-center space-x-3">
                <Image 
                  src="/octpopuslogo.jpg" 
                  alt="Octopus SCM Logo" 
                  width={48} 
                  height={48} 
                  className="rounded-md"
                />
                <span className="text-2xl font-bold text-white">OCC WORLD TRADE</span>
              </Link>
            </div>
            
            {/* All navigation links and buttons grouped together on the right */}
            <div className="flex items-center justify-end space-x-5 pr-1">
              {navLinks.map((link) => (
                <div key={link.path} className="relative">
                  {link.name === 'Products' && link.dropdown ? (
                    <div 
                      className="relative" 
                      ref={productsDropdownRef}
                      onMouseEnter={() => {
                        if (productsCloseTimeoutRef.current) {
                          clearTimeout(productsCloseTimeoutRef.current);
                          productsCloseTimeoutRef.current = null;
                        }
                        setProductsDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        productsCloseTimeoutRef.current = setTimeout(() => {
                          setProductsDropdownOpen(false);
                          setActiveCategory(null);
                          setCategoryProducts([]);
                        }, 300); // 300ms delay before closing
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleProductsDropdown();
                        }}
                        onMouseEnter={() => setProductsDropdownOpen(true)}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {link.name}
                        <svg
                          className="ml-1 h-4 w-4 transition-transform duration-200"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          style={{ transform: productsDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      
                      {/* Invisible connector to prevent hover gap */}
                      {productsDropdownOpen && (
                        <div className="absolute z-50 w-full h-2 bg-transparent" style={{ top: '100%' }}></div>
                      )}
                      
                      {/* Two-level dropdown menu */}
                      {productsDropdownOpen && link.dropdown && (
                        <div className="absolute z-50 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
                          <div className="flex">
                            {/* Categories column - Always visible when dropdown is open */}
                            <div className="w-48 max-h-96 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
                              {link.dropdown.map((category) => (
                                <div key={category.path}>
                                  <Link
                                    href={category.path}
                                    className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${activeCategory === category.path ? 'bg-gray-100 dark:bg-gray-700 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
                                    onClick={() => setProductsDropdownOpen(false)}
                                    onMouseEnter={() => handleCategorySelect(category.path)}
                                  >
                                    {category.name}
                                  </Link>
                                </div>
                              ))}
                            </div>
                            
                            {/* Products column - Only visible when a category is active */}
                            {activeCategory && (
                              <div className="w-72 max-h-96 overflow-y-auto p-2">
                                <div className="py-2 px-3 bg-gray-50 dark:bg-gray-700 mb-2">
                                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {link.dropdown.find(cat => cat.path === activeCategory)?.name} Products
                                  </h3>
                                </div>
                                {categoryProducts.length > 0 ? (
                                  <div className="grid grid-cols-1 gap-2">
                                    {categoryProducts.map((product) => (
                                      <button
                                        key={product.id}
                                        onClick={() => {
                                          handleProductClick(product.id);
                                          // Don't close dropdown when viewing product
                                        }}
                                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                                      >
                                        {product.imageUrl && (
                                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden">
                                            <Image
                                              src={product.imageUrl}
                                              alt={product.name}
                                              width={40}
                                              height={40}
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        )}
                                        <div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                          {product.subcategory && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.subcategory}</p>
                                          )}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-32">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 p-2">No products available</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : link.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(link.name)}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 hover:scale-105 active:scale-95"
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
                      className={`text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md text-sm font-medium ${pathname === link.path ? 'bg-gray-800 text-white' : ''} transition-all duration-200 hover:scale-105 active:scale-95`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Auth buttons - now part of the same right-side group */}
              <div className="flex items-center ml-4">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('user')}
                      className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
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
                              {user?.displayName || user?.email}
                            </p>
                            {isAdmin && (
                              <p className="text-xs text-blue-600 font-semibold mt-1">Admin</p>
                            )}
                          </div>
                          {isAdmin && (
                            <>
                              <Link
                                href="/admin"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setOpenDropdown(null)}
                              >
                                Admin Panel
                              </Link>
                              <Link
                                href="/admin/subcategories"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setOpenDropdown(null)}
                              >
                                Subcategory Management
                              </Link>
                            </>
                          )}
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
                  <div className="flex space-x-4">
                    <Link
                      href="/auth"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 active:scale-95"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth"
                      className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 active:scale-95"
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
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-xl font-medium flex justify-between items-center"
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
                    onClick={() => setIsOpen(false)}
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
                  <div className="text-base font-medium text-white">{user?.displayName || user?.email}</div>
                  {isAdmin && (
                    <div className="text-xs text-blue-400 font-semibold">Admin</div>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="mt-3 w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Admin Panel
                    </Link>
                  )}
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
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-transform active:scale-95"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-transform active:scale-95"
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