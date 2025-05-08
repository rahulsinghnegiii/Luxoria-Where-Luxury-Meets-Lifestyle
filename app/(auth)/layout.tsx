'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { AuthProvider } from '../../lib/authContext';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render auth provider after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Before client-side mounting, render a basic layout without auth provider
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">Luxoria</span>
          </Link>
        </div>
      </header>

      <main>
        {isMounted ? (
          <AuthProvider>{children}</AuthProvider>
        ) : (
          // Show a loading state before mounting
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </main>

      <footer className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-700">
            <p>&copy; {new Date().getFullYear()} Luxoria. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 