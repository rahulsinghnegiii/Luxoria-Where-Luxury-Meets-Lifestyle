'use client';

import { ReactNode, useState, useEffect } from 'react';
import React from 'react';
import { AuthProvider } from '../lib/authContext';
import { CartProvider } from '../lib/cartContext';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render providers after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything that uses client-side features until mounted
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <AuthProvider>
        <CartProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#4ade80',
                  color: '#fff',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
          {children}
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
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