'use client';

import { AuthProvider } from '../lib/authContext';
import { CartProvider } from '../lib/cartContext';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }) {
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