'use client';

import { useState } from 'react';
import CartSidebar from '../../components/CartSidebar';
import { motion } from 'framer-motion';
import NavbarWithCartProvider from '../../components/NavbarWithCartProvider';
import { CartProvider } from '../../lib/cartContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWithCartProvider />
      <main className="flex-grow">{children}</main>
      
      <CartProvider>
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        
        {/* Fixed cart button for mobile */}
        <motion.button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 right-4 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg md:hidden z-50"
          aria-label="Open cart"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </motion.button>
      </CartProvider>
      
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-400 flex items-center justify-center animate-pulse-glow mr-2">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Luxoria
                </span>
              </div>
              <p className="text-gray-200">
                A futuristic e-commerce platform for luxury products and modern living.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-200 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-gray-200 hover:text-white transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-200 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-200 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Contact Us</h3>
              <p className="text-gray-200">
                123 E-Commerce St.
                <br />
                Shopville, SH 12345
                <br />
                info@luxoria.example
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-200 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Luxoria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 