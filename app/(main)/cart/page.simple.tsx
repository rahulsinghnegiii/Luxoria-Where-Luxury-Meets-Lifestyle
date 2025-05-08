'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Extremely simplified example that doesn't depend on context
export default function SimpleCartPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <div className="mt-8 animate-pulse space-y-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-500 mb-6">Your cart is empty</p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded font-medium"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 