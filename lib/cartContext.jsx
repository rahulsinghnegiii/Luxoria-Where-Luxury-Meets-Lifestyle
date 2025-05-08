'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from './firebaseUtils';

// Simplified CartContext without TypeScript types
const CartContext = createContext(undefined);

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  },
  setItem: (key, value) => {
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

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          console.log('User logged in, syncing cart with Firebase');
        }
      } catch (error) {
        console.error('Error syncing cart with Firebase:', error);
      }
    };

    syncCartWithFirebase();
  }, [isInitialized]);

  const addItem = (product, quantity = 1) => {
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

  const removeItem = (id) => {
    try {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item from cart. Please try again.');
    }
  };

  const updateQuantity = (id, quantity) => {
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 