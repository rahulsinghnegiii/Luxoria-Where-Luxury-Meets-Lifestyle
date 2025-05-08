'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Function to check if the API key is potentially valid 
// Firebase API keys are typically formatted like AIzaSyB_Gf4aBcDeFgHiJkLmNoPqRsT_UvWxYz
const isValidApiKeyFormat = (key: string): boolean => {
  // Check if it's non-empty, has no quotes/commas, and starts with "AIza"
  if (!key || key.length < 10) return false;
  if (key.includes('"') || key.includes(',')) return false;
  return key.startsWith('AIza');
};

// Clean the API key - explicitly strip any quotes or commas
const cleanApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY.replace(/[",]/g, '')
  : '';

// Create safe instances with clearly defined types
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined') {
  try {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: cleanApiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    // Only initialize once
    if (!getApps().length) {
      // Validate API key before initializing
      if (!isValidApiKeyFormat(cleanApiKey)) {
        console.warn('Firebase API key format looks invalid or missing. Some features may not work.');
      }

      console.log('Initializing Firebase app...');
      firebaseApp = initializeApp(firebaseConfig);
      
      // Initialize services
      db = getFirestore(firebaseApp);
      auth = getAuth(firebaseApp);
      storage = getStorage(firebaseApp);
      
      console.log('Firebase services initialized successfully');
    } else {
      console.log('Firebase already initialized, using existing instance');
      firebaseApp = getApps()[0];
      db = getFirestore(firebaseApp);
      auth = getAuth(firebaseApp);
      storage = getStorage(firebaseApp);
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Keep the instances as null to indicate initialization failure
  }
}

export { db, auth, storage, firebaseApp as app }; 