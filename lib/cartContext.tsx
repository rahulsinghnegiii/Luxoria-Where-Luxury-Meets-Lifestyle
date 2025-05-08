'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from './types';
import { getCurrentUser } from './firebaseUtils';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      return false;
    }
  },
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount - client-side only
  useEffect(() => {
    // Use setTimeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      try {
        const savedCart = safeLocalStorage.getItem('cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setError('Failed to load your cart. Please refresh the page.');
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Save cart to localStorage whenever it changes - client-side only
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      safeLocalStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      setError('Failed to save your cart. Changes may not persist.');
    }
  }, [items, isInitialized]);

  // Sync with Firebase when user logs in
  useEffect(() => {
    if (!isInitialized) return;
    
    const syncCartWithFirebase = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // In a real app, you would fetch the user's cart from Firestore
          // and merge it with the local cart
          console.log('User logged in, syncing cart with Firebase');
        }
      } catch (error) {
        console.error('Error syncing cart with Firebase:', error);
        // Don't set an error here as it's not critical for user experience
      }
    };

    syncCartWithFirebase();
  }, [isInitialized]);

  const addItem = (product: Product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      setError('Failed to add item to cart: Invalid product data');
      return;
    }
    
    setItems((prevItems) => {
      try {
        // Check if item already exists in cart
        const existingItem = prevItems.find((item) => item.productId === product.id);

        if (existingItem) {
          // Update quantity if item exists
          return prevItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item if it doesn't exist
          return [
            ...prevItems,
            {
              id: Math.random().toString(36).substr(2, 9), // Generate a random ID
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              quantity,
            },
          ];
        }
      } catch (error) {
        console.error('Error adding item to cart:', error);
        setError('Failed to add item to cart. Please try again.');
        return prevItems;
      }
    });
  };

  const removeItem = (id: string) => {
    try {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item from cart. Please try again.');
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setError('Failed to update item quantity. Please try again.');
    }
  };

  const clearCart = () => {
    try {
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear your cart. Please try again.');
    }
  };

  const getTotalItems = () => {
    try {
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error calculating total items:', error);
      return 0;
    }
  };

  const getTotalPrice = () => {
    try {
      return items.reduce((total, item) => total + item.price * item.quantity, 0);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading,
        error
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Safe version of useCart that doesn't throw an error if used outside a provider
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.warn('useCart called outside of CartProvider, using fallback implementation');
    // Return a fallback implementation
    return {
      items: [],
      addItem: () => console.warn('Cart not available'),
      removeItem: () => console.warn('Cart not available'),
      updateQuantity: () => console.warn('Cart not available'),
      clearCart: () => console.warn('Cart not available'),
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
      isLoading: false,
      error: null
    };
  }
  return context;
}; 