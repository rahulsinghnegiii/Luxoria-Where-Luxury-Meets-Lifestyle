'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import { BiPackage } from 'react-icons/bi';
import { getUserOrders } from '@/lib/firebaseUtils';
import { Order } from '@/lib/types';

// Define the order interface for this page
interface OrderDisplay {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending';
  items: number;
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }

    // Fetch orders if user is authenticated
    if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch real orders from Firebase using getUserOrders function
      const userOrders = await getUserOrders(user?.uid || '');
      
      // Transform the orders to match the OrderDisplay interface
      const displayOrders: OrderDisplay[] = userOrders.map(order => ({
        id: order.id,
        date: order.createdAt,
        total: order.total,
        status: order.status as 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending',
        items: order.items.reduce((total, item) => total + item.quantity, 0)
      }));
      
      setOrders(displayOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: OrderDisplay['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle case where user is not authenticated
  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-6 w-64 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            Your Orders
          </h1>
          <p className="text-gray-400">
            View and track all your Luxoria purchases
          </p>
        </motion.div>

        {isLoading ? (
          // Loading state
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg p-6">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <FiAlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-4" />
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-10 text-center">
            <FiShoppingBag className="mx-auto h-16 w-16 text-gray-600 mb-6" />
            <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">
              When you place orders, they will appear here for you to track.
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-full"
              >
                Start Shopping
              </motion.button>
            </Link>
          </div>
        ) : (
          // List of orders
          <div className="grid gap-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 border border-gray-700 hover:border-indigo-500/30 rounded-lg p-6 transition-all duration-300"
              >
                <Link href={`/orders/${order.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-xl font-semibold text-white">Order #{order.id.slice(-8)}</span>
                        <span className={`ml-3 px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-indigo-300 font-medium">${order.total.toFixed(2)} • {order.items} {order.items === 1 ? 'item' : 'items'}</p>
                    </div>
                    <div className="flex items-center text-gray-400 hover:text-indigo-400 transition-colors">
                      <BiPackage className="mr-1 h-5 w-5" />
                      <span className="mr-1">Track Order</span>
                      <FiChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 