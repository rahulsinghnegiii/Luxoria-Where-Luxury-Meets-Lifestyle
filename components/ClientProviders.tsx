'use client';

import { ReactNode, useState, useEffect } from 'react';
import React from 'react';
import { AuthProvider } from '../lib/authContext';
import { CartProvider } from '../lib/cartContext';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }: { children: ReactNode }) {
  // Only render on client-side to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a simple placeholder without any providers during SSR
    return (
      <div suppressHydrationWarning>
        {/* This will be replaced on client */}
        {children}
      </div>
    );
  }

  // Once mounted on client, provide all context providers
  return (
    <>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              // Default options for toast
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              // Different styles for different toast types
              success: {
                duration: 3000,
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: ReactNode;
  fallback: ReactNode;
}> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error in client providers:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

// Fallback UI when providers fail
function FallbackComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-gray-600">
            There was an error initializing the app. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
} 