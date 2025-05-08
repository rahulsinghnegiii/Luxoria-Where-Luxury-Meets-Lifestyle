'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../lib/cartContext';
import { useAuth } from '../lib/authContext';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function FuturisticNavbar() {
  const pathname = usePathname();
  const [totalItems, setTotalItems] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  
  // Safe access to cart context
  const cart = useCart ? useCart() : { getTotalItems: () => 0 };
  const { user, signOut, isAdmin, loading } = useAuth ? useAuth() : { user: null, signOut: async () => {}, isAdmin: false, loading: false };
  
  // Log auth state for debugging
  useEffect(() => {
    if (user) {
      console.log("Auth state in navbar:", { 
        user: !!user, 
        email: user?.email,
        isAdmin: isAdmin 
      });
    }
  }, [user, isAdmin]);
  
  // Update cart count when items change - with safety check
  useEffect(() => {
    try {
      if (cart && cart.getTotalItems) {
        setTotalItems(cart.getTotalItems());
      }
    } catch (error) {
      console.error('Error accessing cart:', error);
      // Keep totalItems as 0 if there's an error
    }
  }, [cart]);
  
  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle clicking outside of account menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Close menus after signing out
      setIsAccountMenuOpen(false);
      setIsMobileMenuOpen(false);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close account menu when opening mobile menu
    if (!isMobileMenuOpen) {
      setIsAccountMenuOpen(false);
    }
  };
  
  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
    // Close mobile menu when opening account menu
    if (!isAccountMenuOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };
  
  // Navigation links with active state detection
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/products/category' },
    { name: 'About', href: '/about' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-lg py-2 shadow-lg'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-400 animate-pulse-glow"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-white font-bold text-xl">L</span>
            </motion.div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Luxoria
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium"
              >
                <span 
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive(link.href) ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </span>
                {isActive(link.href) && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"
                    style={{ opacity: 0.8 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Cart button with count indicator */}
            <Link href="/cart">
              <motion.div
                className="relative p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">{totalItems}</span>
                  </motion.div>
                )}
              </motion.div>
            </Link>
            
            {/* User menu or login button */}
            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleAccountMenu}
                  className="flex items-center space-x-1 cyber-border px-3 py-1 rounded-full text-white text-sm"
                >
                  <span>
                    {user.displayName || user.email?.split('@')[0] || 'Account'}
                    {isAdmin && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-indigo-600 text-white rounded">
                        Admin
                      </span>
                    )}
                  </span>
                  <FiChevronDown className={`h-4 w-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                
                {/* Dropdown menu with absolute positioning and AnimatePresence for smooth transitions */}
                <AnimatePresence>
                {isAccountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 z-50"
                    >
                    <div className="py-1 dark-glassmorphism rounded-lg shadow-xl border border-indigo-500/20">
                      <div className="px-4 py-2 border-b border-indigo-500/20">
                        <p className="text-sm font-medium text-gray-200 truncate">
                            {user.displayName || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium bg-indigo-500 text-white rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-white transition-colors duration-150"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <FiUser className="mr-2" />
                          Profile
                        </div>
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-white transition-colors duration-150"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      
                      {/* Admin dashboard link - only shown for admin users */}
                      {isAdmin && (
                        <Link
                            href="/dashboard"
                          className="block px-4 py-2 text-sm text-indigo-300 font-medium hover:bg-indigo-500/20 hover:text-white transition-colors duration-150"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <MdDashboard className="mr-2" />
                            Admin Dashboard
                          </div>
                        </Link>
                      )}
                      
                      <Link
                        href="/profile/settings"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-white transition-colors duration-150"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <FiSettings className="mr-2" />
                          Settings
                        </div>
                      </Link>
                      
                      <hr className="my-1 border-indigo-500/20" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-white transition-colors duration-150"
                      >
                        <div className="flex items-center">
                          <FiLogOut className="mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium rounded-full"
                >
                  Login
                </motion.button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white"
              >
                {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="dark-glassmorphism md:hidden overflow-hidden"
          >
            <motion.div
              className="px-4 py-3 space-y-1"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive(link.href)
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-indigo-600/20 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Add Orders link to mobile menu for logged-in users */}
              {user && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg text-base font-medium text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors duration-200"
                  >
                    Orders
                  </Link>
                </motion.div>
              )}
              
              {/* Add admin dashboard link to mobile menu for admin users */}
              {user && isAdmin && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg text-base font-medium bg-indigo-700 text-white transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <MdDashboard className="mr-2" />
                    Admin Dashboard
                    </div>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 