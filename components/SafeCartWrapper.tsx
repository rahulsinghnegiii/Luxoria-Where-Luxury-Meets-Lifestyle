'use client';

import { ReactNode, useState, useEffect } from 'react';
import { CartProvider } from '../lib/cartContext';

export default function SafeCartWrapper({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <CartProvider>{children}</CartProvider>;
} 