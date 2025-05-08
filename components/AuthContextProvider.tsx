'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AuthProvider } from '../lib/authContext';

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return <AuthProvider>{children}</AuthProvider>;
} 