'use client';

import { useEffect, useState } from 'react';
import FuturisticNavbar from './FuturisticNavbar';
import { AuthProvider } from '../lib/authContext';
import { CartProvider } from '../lib/cartContext';

export default function NavbarWithAuthProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return an empty nav placeholder until mounted
    return (
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Logo placeholder */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-md bg-gray-800"></div>
              <div className="w-20 h-6 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <FuturisticNavbar />
      </CartProvider>
    </AuthProvider>
  );
} 