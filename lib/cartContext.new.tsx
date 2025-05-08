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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setIsInitialized(true);
      }
    };

    loadCartFromStorage();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Sync with Firebase when user logs in (for a real app, you'd implement this)
  useEffect(() => {
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
      }
    };

    if (isInitialized) {
      syncCartWithFirebase();
    }
  }, [isInitialized]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
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
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
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