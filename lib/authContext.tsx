'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  Auth,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { auth as firebaseAuth, db } from './firebase';

// Define the User type with admin flag
interface User extends FirebaseUser {
  isAdmin?: boolean;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  // Safely initialize auth on client side only
  useEffect(() => {
    // Prevent execution in SSR
    if (typeof window === 'undefined') return;
    
    // Assign Firebase auth to state to ensure it's only used client-side
    if (firebaseAuth) {
      console.log('Firebase auth initialized successfully');
      setAuth(firebaseAuth);
    } else {
      console.error('Firebase auth initialization failed');
      setError('Firebase authentication not available. Check your API key.');
    }
  }, []);

  // Fetch user role from Firestore
  const fetchUserRole = async (uid: string) => {
    try {
      if (db) {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userIsAdmin = userData.role === 'admin';
          setIsAdmin(userIsAdmin);
          
          // Set or clear admin cookie based on role
          if (userIsAdmin) {
            // Check if cookie exists already to avoid unnecessary writes
            const existingRole = getCookie('user_role');
            if (existingRole !== 'admin') {
              setCookie('user_role', 'admin', {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
              });
              console.log('Admin cookie set for user:', uid);
            }
          } else if (getCookie('user_role') === 'admin') {
            // If user has admin cookie but is not admin in DB, remove cookie
            deleteCookie('user_role');
          }
        } else {
          console.log('No user document found, creating one');
          // Create user document if it doesn't exist
          const currentUser = auth?.currentUser;
          if (currentUser) {
            await setDoc(doc(db, 'users', currentUser.uid), {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
              photoURL: currentUser.photoURL,
              role: 'user', // Default role
              createdAt: serverTimestamp()
            });
          }
          setIsAdmin(false);
          // Ensure no admin cookie exists
          if (getCookie('user_role') === 'admin') {
            deleteCookie('user_role');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setIsAdmin(false);
    }
  };

  // Listen for auth state changes after auth is initialized
  useEffect(() => {
    // Skip if auth is not initialized or we're in SSR
    if (!auth || typeof window === 'undefined') return;
    
    setLoading(true);
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Get the token and ensure auth_token cookie is set
          const token = await firebaseUser.getIdToken(true);
          setCookie('auth_token', token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
          
          // Set user in state
          const enhancedUser = { ...firebaseUser, isAdmin: false } as User;
          setUser(enhancedUser);
          
          // Fetch user role from Firestore and update state + cookies
          await fetchUserRole(firebaseUser.uid);
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Still set the user but without admin privileges
          const enhancedUser = { ...firebaseUser, isAdmin: false } as User;
          setUser(enhancedUser);
          setIsAdmin(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setIsAdmin(false);
        
        // Clean up cookies
        deleteCookie('auth_token');
        deleteCookie('user_role');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]); // Depend on auth to re-run when auth is initialized

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
        if (!auth) {
          throw new Error('Firebase authentication is not initialized');
        }
        
      console.log('Authenticating user:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Set the user with default isAdmin value
        const enhancedUser = { ...firebaseUser, isAdmin: false } as User;
        setUser(enhancedUser);
        
        // Get the token from Firebase
        const token = await firebaseUser.getIdToken(true);
        
        // Set auth cookie with the Firebase token
        setCookie('auth_token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        
        // Fetch user role and update isAdmin state
        try {
          if (db) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userIsAdmin = userData.role === 'admin';
              console.log('User role fetched:', { uid: firebaseUser.uid, role: userData.role, isAdmin: userIsAdmin });
              
              // Update isAdmin state
              setIsAdmin(userIsAdmin);
              
              // Set user role cookie if user is admin
              if (userIsAdmin) {
                setCookie('user_role', 'admin', {
                  maxAge: 30 * 24 * 60 * 60, // 30 days
                  path: '/',
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'strict',
                });
                console.log('Admin cookie set for user:', email);
              } else {
                // Ensure no admin cookie exists if not admin
                deleteCookie('user_role');
              }
            } else {
              console.log('No user document found, creating one');
              // Create user document if it doesn't exist
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
                photoURL: firebaseUser.photoURL,
                role: 'user', // Default role
                createdAt: serverTimestamp()
              });
              
              // Ensure no admin cookie exists
              deleteCookie('user_role');
            }
          }
        } catch (roleError) {
          console.error('Error fetching user role:', roleError);
          // Still keep the auth cookie even if there was an error getting the role
          setIsAdmin(false);
          deleteCookie('user_role');
        }
      
      console.log('User successfully signed in:', email);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : (typeof err === 'string' ? err : 'Failed to sign in');
        
      setError(mapAuthErrorToMessage(errorMessage));
      setUser(null);
      setIsAdmin(false);
      deleteCookie('auth_token');
      deleteCookie('user_role');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!auth) {
        throw new Error('Firebase authentication is not initialized');
      }
      
      // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Update display name
        await updateProfile(firebaseUser, {
          displayName: name
        });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          name: name,
          email: email,
          role: 'user',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        // Set the user with default isAdmin value
        const enhancedUser = { ...firebaseUser, isAdmin: false } as User;
        setUser(enhancedUser);
        
        // Set auth cookie
        const token = await firebaseUser.getIdToken();
      setCookie('auth_token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        });
      
      console.log('User successfully registered:', email);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(mapAuthErrorToMessage(err instanceof Error ? err.message : String(err)));
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) {
      setError('Authentication service is not available');
      return Promise.reject(new Error('Authentication service is not available'));
    }
    
    try {
        // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear all authentication cookies
      deleteCookie('auth_token');
      deleteCookie('user_role');
      
      // Reset user state
      setUser(null);
      setIsAdmin(false);
      
      // Redirect to home page
      router.push('/');
      
      console.log('User signed out successfully');
    } catch (err: any) {
      console.error('Logout error:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : (typeof err === 'string' ? err : 'Failed to sign out');
        
      setError(mapAuthErrorToMessage(errorMessage));
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.warn('useAuth called outside of AuthProvider, using fallback implementation');
    
    // Return a fallback implementation
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

// Helper function to map Firebase error codes to user-friendly messages
function mapAuthErrorToMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/api-key-not-valid': 'Invalid API key. Please check your Firebase configuration.',
  };

  return errorMessages[errorCode] || `Unexpected error: ${errorCode}`;
} 