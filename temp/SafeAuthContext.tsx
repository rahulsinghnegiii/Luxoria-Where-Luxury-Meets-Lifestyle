'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

// Define the User type
interface User extends FirebaseUser {
  isAdmin?: boolean;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a safe version of useAuth that provides fallbacks
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.warn('useAuth called outside of AuthProvider, using fallback implementation');
    
    // Provide a fallback implementation that does nothing
    return {
      user: null,
      loading: false,
      isAdmin: false,
      error: null,
      signIn: async () => { console.warn('Auth not available: signIn called outside AuthProvider'); },
      signUp: async () => { console.warn('Auth not available: signUp called outside AuthProvider'); },
      signOut: async () => { console.warn('Auth not available: signOut called outside AuthProvider'); }
    };
  }
  
  return context;
} 

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

// Define the User type
interface User extends FirebaseUser {
  isAdmin?: boolean;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a safe version of useAuth that provides fallbacks
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.warn('useAuth called outside of AuthProvider, using fallback implementation');
    
    // Provide a fallback implementation that does nothing
    return {
      user: null,
      loading: false,
      isAdmin: false,
      error: null,
      signIn: async () => { console.warn('Auth not available: signIn called outside AuthProvider'); },
      signUp: async () => { console.warn('Auth not available: signUp called outside AuthProvider'); },
      signOut: async () => { console.warn('Auth not available: signOut called outside AuthProvider'); }
    };
  }
  
  return context;
} 