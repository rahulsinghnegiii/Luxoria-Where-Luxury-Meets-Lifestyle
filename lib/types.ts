// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  features?: string[];
  rating?: number;
  reviews?: number;
  stock: number;
  createdAt: string;
}

// User interface
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
}

// Cart Item interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Order interface
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
} 