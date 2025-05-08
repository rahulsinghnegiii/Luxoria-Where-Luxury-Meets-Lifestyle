'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AuthProvider } from '../lib/authContext';
import { CartProvider } from '../lib/cartContext';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render providers after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Before mounting, render only the children without any providers
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
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
  );
} 