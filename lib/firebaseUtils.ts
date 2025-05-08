import { db, auth, storage } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, CartItem, Order, User } from './types';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { getDirectDownloadUrl } from './firebaseStorageHelper';
import { uploadImage } from './cloudinaryUtils';

// Check if we're using mock services (for development)
// Always use real Firebase unless explicitly set to use mocks
const shouldUseMockServices = () => {
  // Always prioritize the environment variable setting
  if (process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'false') {
    return false;
  }
  
  // Fall back to mock only if auth is unavailable AND not explicitly set to false
  const authIsUnavailable = !auth;
  
  if (authIsUnavailable) {
    console.warn('Firebase auth is unavailable, falling back to mock services.');
    return true;
  }
  
  return false;
};

// Also check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Mock user for development
let mockUser: FirebaseUser | null = null;

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    // Check if we should use mock services
    if (shouldUseMockServices()) {
      console.log('Using mock signup service');
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser = {
        uid: `mock-${Math.random().toString(36).substr(2, 9)}`,
        email,
        displayName: email.split('@')[0],
      };
      
      // Store in localStorage to simulate persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Also create a corresponding user document in the mock database
      if (!localStorage.getItem('mockDatabase')) {
        localStorage.setItem('mockDatabase', JSON.stringify({}));
      }
      
      const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
      
      if (!mockDb.users) {
        mockDb.users = {};
      }
      
      // Create a user document with default role
      mockDb.users[mockUser.uid] = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        role: 'user', // Default role
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
      
      setAuthCookies(mockUser);
      return mockUser;
    }
    
    // Use actual Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create a document in the users collection with the user's information
    if (user && db) {
      try {
        // Create a user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL,
          role: 'user', // Default role
          createdAt: serverTimestamp()
        });
        console.log('User document created in Firestore');
      } catch (error) {
        console.error('Error creating user document:', error);
        // Consider whether to delete the auth user if Firestore creation fails
        // This depends on your requirements for data consistency
      }
    }
    
    setAuthCookies(user);
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Helper function to set auth cookies after successful authentication
export const setAuthCookies = (user: User | null) => {
  if (!isBrowser) return;
  
  if (user) {
    // Set auth token cookie (in a real app, you would use a JWT or session token)
    setCookie('auth_token', `mock-token-${user.uid}`, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Set user role cookie if the user is an admin
    if (user.isAdmin) {
      setCookie('user_role', 'admin', {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
  }
};

// Helper function to remove auth cookies on sign out
export const clearAuthCookies = () => {
  if (!isBrowser) return;
  
  deleteCookie('auth_token');
  deleteCookie('user_role');
};

// Update the sign in function to set cookies after authentication
export const signIn = async (email: string, password: string) => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !auth) {
  console.log('Mock signin with:', email);
  mockUser = { 
    uid: 'mock-user-123',
    email: email,
    emailVerified: true,
      isAdmin: email.includes('admin'),
    } as unknown as FirebaseUser & { isAdmin: boolean };
    
    // Set auth cookies for the mock user
    setAuthCookies({
      uid: mockUser.uid,
      email: mockUser.email || '',
      isAdmin: email.includes('admin'),
    });
    
    return { user: mockUser };
  } else {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Set auth cookies for the real user
      const isAdmin = result.user.email?.includes('admin') || false;
      setAuthCookies({
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || undefined,
        isAdmin,
      });
      
      return result;
    } catch (error) {
      console.error('Firebase signin error:', error);
      // If Firebase auth fails, fall back to mock services
      console.log('Falling back to mock signin');
      mockUser = { 
        uid: 'mock-user-123',
        email: email,
        emailVerified: true,
        isAdmin: email.includes('admin'),
      } as unknown as FirebaseUser & { isAdmin: boolean };
      
      // Set auth cookies for the mock user
      setAuthCookies({
        uid: mockUser.uid,
        email: mockUser.email || '',
        isAdmin: email.includes('admin'),
      });
  
  return { user: mockUser };
    }
  }
};

// Update the sign out function to clear cookies
export const signOut = async () => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !auth) {
  console.log('Mock signout');
    mockUser = null;
    
    // Clear auth cookies
    clearAuthCookies();
    
    return Promise.resolve();
  } else {
    try {
      // Clear auth cookies before Firebase sign out
      clearAuthCookies();
      
      return await firebaseSignOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
      // Even if Firebase sign out fails, still clear the local user
  mockUser = null;
  return Promise.resolve();
    }
  }
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !auth) {
  // In development, return the mock user
  return Promise.resolve(mockUser);
  } else {
    try {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return Promise.resolve(mockUser);
    }
  }
};

// Product functions
export const getProducts = async (): Promise<Product[]> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    console.warn('Using mock product data because Firebase is unavailable');
    // Check if we have mock products in localStorage
    try {
      if (isBrowser) {
        const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
        if (mockDb.products && Array.isArray(mockDb.products)) {
          console.log(`Retrieved ${mockDb.products.length} mock products from localStorage`);
          return mockDb.products;
        }
      }
    } catch (error) {
      console.error('Error retrieving mock products:', error);
    }
    return []; // Return empty array if no mock products found
  } else {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          price: data.price || 0,
          createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
        } as Product;
      });
      return productsList;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    console.warn('Using mock product category data because Firebase is unavailable');
    // Check if we have mock products in localStorage
    try {
      if (isBrowser) {
        const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
        if (mockDb.products && Array.isArray(mockDb.products)) {
          // Filter products by category
          const filtered = mockDb.products.filter(
            (product: Product) => product.category === category
          );
          console.log(`Retrieved ${filtered.length} mock products in category ${category}`);
          return filtered;
        }
      }
    } catch (error) {
      console.error('Error retrieving mock products by category:', error);
    }
    return []; // Return empty array if no mock products found
  } else {
    try {
      const productsCollection = collection(db, 'products');
      const categoryQuery = query(productsCollection, where('category', '==', category));
      const productsSnapshot = await getDocs(categoryQuery);
      const productsList = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          price: data.price || 0,
          createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
        } as Product;
      });
      return productsList;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    console.warn('Using mock product detail data because Firebase is unavailable');
    // Check if we have mock products in localStorage
    try {
      if (isBrowser) {
        const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
        if (mockDb.products && Array.isArray(mockDb.products)) {
          // Find product by ID
          const product = mockDb.products.find((p: Product) => p.id === id);
          if (product) {
            console.log(`Retrieved mock product with ID: ${id}`);
            return product;
          }
        }
      }
    } catch (error) {
      console.error('Error retrieving mock product by ID:', error);
    }
    console.log('No product found with ID:', id);
    return null; // Return null if no mock product found
  } else {
    try {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const data = productSnap.data();
        return {
          id: productSnap.id,
          ...data,
          price: data.price || 0,
          createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
        } as Product;
      } else {
        console.log('No product found with ID:', id);
        return null;
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<string> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    // Create a mock product ID
    const productId = `mock-product-${Date.now()}`;
    
    try {
      if (isBrowser) {
        // Get existing database or initialize a new one
        const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
        
        // Initialize products array if it doesn't exist
        if (!mockDb.products) {
          mockDb.products = [];
        }
        
        // Add new product with ID and createdAt
        const newProduct = {
          ...product,
          id: productId,
          createdAt: new Date().toISOString()
        };
        
        // Add to mock database
        mockDb.products.push(newProduct);
        
        // Save back to localStorage
        localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
        console.log('Adding mock product:', newProduct);
      }
    } catch (error) {
      console.error('Error storing mock product:', error);
    }
    
    return Promise.resolve(productId);
  } else {
    try {
      const productsCollection = collection(db, 'products');
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product to Firestore:', error);
      throw error;
    }
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    try {
      if (isBrowser) {
        // Get existing database
        const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
        
        // Check if products array exists
        if (!mockDb.products || !Array.isArray(mockDb.products)) {
          throw new Error('No products found in mock database');
        }
        
        // Find product index
        const productIndex = mockDb.products.findIndex((p: Product) => p.id === id);
        
        if (productIndex === -1) {
          throw new Error(`Product with ID ${id} not found`);
        }
        
        // Update product
        mockDb.products[productIndex] = {
          ...mockDb.products[productIndex],
          ...product,
          updatedAt: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
  console.log('Updating mock product:', id, product);
      }
    } catch (error) {
      console.error('Error updating mock product:', error);
    }
    
  return Promise.resolve();
  } else {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...product,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product in Firestore:', error);
      throw error;
    }
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    try {
      if (isBrowser) {
        // Get existing database
        const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
        
        // Check if products array exists
        if (!mockDb.products || !Array.isArray(mockDb.products)) {
          throw new Error('No products found in mock database');
        }
        
        // Filter out the product to delete
        mockDb.products = mockDb.products.filter((p: Product) => p.id !== id);
        
        // Save back to localStorage
        localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
  console.log('Deleting mock product:', id);
      }
    } catch (error) {
      console.error('Error deleting mock product:', error);
    }
    
  return Promise.resolve();
  } else {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product from Firestore:', error);
      throw error;
    }
  }
};

// Orders functions
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
  // In development, return empty orders array
  console.log('Getting mock orders for user:', userId);
  return Promise.resolve([]);
  } else {
    try {
      const ordersCollection = collection(db, 'orders');
      const userOrdersQuery = query(
        ordersCollection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const ordersSnapshot = await getDocs(userOrdersQuery);
      
      const ordersList = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
        } as Order;
      });
      
      return ordersList;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
  // In development, create a mock order ID
  console.log('Creating mock order:', order);
  return Promise.resolve(`mock-order-${Date.now()}`);
  } else {
    try {
      // Create a real order in Firestore
      const ordersCollection = collection(db, 'orders');
      const docRef = await addDoc(ordersCollection, {
        ...order,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order in Firestore:', error);
      throw error;
    }
  }
};

// Get all orders for admin dashboard
export const getAllOrders = async (): Promise<Order[]> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    // Generate mock orders for development/demo
    console.log('Generating mock orders for admin dashboard');
    
    // Create 15 mock orders with various statuses
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const mockOrders: Order[] = [];
    
    for (let i = 0; i < 15; i++) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Random date in past 30 days
      
      mockOrders.push({
        id: `mock-order-${i}`,
        userId: `mock-user-${Math.floor(Math.random() * 10)}`,
        items: [
          {
            id: `product-${Math.floor(Math.random() * 10)}`,
            name: `Product ${Math.floor(Math.random() * 100)}`,
            price: Math.floor(Math.random() * 1000) / 10,
            quantity: Math.floor(Math.random() * 5) + 1,
            image: `https://via.placeholder.com/150?text=Product${i}`
          }
        ],
        total: Math.floor(Math.random() * 10000) / 100,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        shippingAddress: {
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
          address: `${Math.floor(Math.random() * 1000)} Main St`,
          city: 'Anytown',
          state: 'ST',
          postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
          country: 'US'
        },
        createdAt: createdAt.toISOString()
      });
    }
    
    return Promise.resolve(mockOrders);
  } else {
    try {
      // Get all orders from Firestore
      const ordersCollection = collection(db, 'orders');
      const ordersQuery = query(
        ordersCollection,
        orderBy('createdAt', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      
      const ordersList = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
        } as Order;
      });
      
      return ordersList;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    // Mock update in development
    console.log(`Updating mock order ${orderId} status to ${status}`);
    return Promise.resolve();
  } else {
    try {
      // Update real order in Firestore
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating order status in Firestore:', error);
      throw error;
    }
  }
};

// Update multiple orders' statuses at once (batch update)
export const batchUpdateOrderStatus = async (orderIds: string[], status: string): Promise<void> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    // Mock batch update in development
    console.log(`Batch updating ${orderIds.length} mock orders to status: ${status}`);
    console.log('Order IDs:', orderIds);
    return Promise.resolve();
  } else {
    try {
      const batch = writeBatch(db);
      
      // Add each order update to the batch
      orderIds.forEach(orderId => {
        const orderRef = doc(db, 'orders', orderId);
        batch.update(orderRef, {
          status,
          updatedAt: serverTimestamp()
        });
      });
      
      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error('Error batch updating orders in Firestore:', error);
      throw error;
    }
  }
};

// Get a single order by id
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const USE_MOCK_SERVICES = shouldUseMockServices();
  
  if (USE_MOCK_SERVICES || !isBrowser || !db) {
    // In development, return a mock order
    console.log('Getting mock order with ID:', orderId);
    
    // Generate a random mock order
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 10)); // Random date in past 10 days
    
    return Promise.resolve({
      id: orderId,
      userId: `mock-user-1`,
      items: [
        {
          id: `product-1`,
          name: `Product Sample`,
          price: 49.99,
          quantity: 2,
          image: `https://via.placeholder.com/150?text=Product1`
        },
        {
          id: `product-2`,
          name: `Product Premium`,
          price: 99.99,
          quantity: 1,
          image: `https://via.placeholder.com/150?text=Product2`
        }
      ],
      total: 199.97,
      subtotal: 199.97,
      tax: 16.00,
      shippingCost: 0,
      status: randomStatus,
      shippingAddress: {
        name: `Customer Name`,
        email: `customer@example.com`,
        address: `123 Main St`,
        city: 'Anytown',
        state: 'ST',
        postalCode: `12345`,
        country: 'US'
      },
      paymentDetails: {
        cardType: 'Visa',
        lastFour: '4242'
      },
      createdAt: createdAt.toISOString()
    });
  } else {
    try {
      // Get real order from Firestore
      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);
      
      if (!orderSnapshot.exists()) {
        return null;
      }
      
      const data = orderSnapshot.data();
      return {
        id: orderSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      } as Order;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }
};

// Image upload function
export const uploadProductImage = async (file: File): Promise<string> => {
  // Mock service for demo/development
  if (shouldUseMockServices()) {
    console.log('Using mock service for image upload:', file.name);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate color for the SVG
    const getRandomColor = () => {
      const colors = [
        '#4285F4', // Google Blue
        '#34A853', // Google Green
        '#FBBC05', // Google Yellow
        '#EA4335', // Google Red
        '#5E35B1', // Deep Purple
        '#1E88E5', // Blue
        '#43A047', // Green
        '#E53935', // Red
        '#FB8C00', // Orange
        '#00ACC1', // Cyan
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    // Generate a simple SVG with the filename
    const color = getRandomColor();
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="${color}" />
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${file.name}</text>
      </svg>
    `;
    
    // Convert SVG to base64 data URL
    const base64Image = `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
    
    return Promise.resolve(base64Image);
  } 
  
  try {
    // Upload to Cloudinary instead of Firebase Storage
    const cloudinaryUrl = await uploadImage(file);
    return cloudinaryUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Generate a fallback image with the filename
    const fileName = file.name || 'image';
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#4285F4" />
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${fileName}</text>
      </svg>
    `;
    
    // Convert SVG to base64 data URL
    const base64Image = `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
    return base64Image;
  }
};

// This function is now deprecated, use getSafeImageUrl from cloudinaryUtils instead
export const transformFirebaseStorageUrl = (url: string): string => {
  console.warn('transformFirebaseStorageUrl is deprecated, use getSafeImageUrl from cloudinaryUtils instead');
  return url;
}; 