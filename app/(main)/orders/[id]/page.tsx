'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../../lib/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Order, OrderItem } from '../../../../lib/types';

// Helper function to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'No date available';
  
  const date = new Date(dateString);
  // Check if date is valid before formatting
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;
  
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push(`/login?redirect=/orders/${orderId}`);
    }
  }, [user, loading, router, orderId]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (user && orderId) {
        try {
          setIsLoading(true);
          setError(null);
          
          // Get the order document from Firestore
          const orderDoc = await getDoc(doc(db, 'orders', orderId));
          
          if (!orderDoc.exists()) {
            setError('Order not found');
            setIsLoading(false);
            return;
          }
          
          const orderData = orderDoc.data() as Omit<Order, 'id'>;
          
          // Verify the user has permission to view this order
          if (orderData.userId !== user.uid) {
            setError('You do not have permission to view this order');
            setIsLoading(false);
            return;
          }
          
          const formattedOrder = {
            id: orderDoc.id,
            ...orderData,
            createdAt: orderData.createdAt?.toDate?.() 
              ? orderData.createdAt.toDate().toISOString() 
              : new Date().toISOString(),
            // Ensure all required fields have default values if missing
            subtotal: orderData.subtotal || orderData.total || 0,
            tax: orderData.tax || 0,
            shippingCost: orderData.shippingCost || 0,
          } as Order;
          
          setOrder(formattedOrder);
          
        } catch (error) {
          console.error('Error fetching order:', error);
          setError('Error loading order details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [orderId, user]);

  if (loading || !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => router.push('/orders')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <button
          onClick={() => router.push('/orders')}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Back to Orders
        </button>
      </div>
      
      {/* Order Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Order #{order.id.substring(0, 8)}
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {order.items.map((item: OrderItem) => (
            <li key={item.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        <Link href={`/products/${item.productId}`} className="hover:text-indigo-600">
                          {item.name}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Order Info and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping and Payment Info */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
          
          <div className="mb-6">
            <p className="text-sm text-gray-900 font-medium">{order.shippingAddress.name}</p>
            <p className="text-sm text-gray-700 mt-1">{order.shippingAddress.address}</p>
            <p className="text-sm text-gray-700">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
          <div className="flex items-center">
            <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2H4zm0 2h16v2H4V6zm0 4h16v8H4v-8zm8 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Credit Card</p>
              <p className="text-sm text-gray-700">
                Ending in {order.paymentDetails?.last4 || '****'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-900 font-medium">${order.subtotal.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-900 font-medium">
                {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-gray-700">Tax</p>
              <p className="text-gray-900 font-medium">${order.tax.toFixed(2)}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-base font-medium text-gray-900">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Need Help Section */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6">
        <h3 className="text-base font-medium text-gray-900 mb-2">Need help with your order?</h3>
        <p className="text-sm text-gray-700 mb-4">
          If you have any questions or concerns about your order, please contact our customer service team.
        </p>
        <button
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          onClick={() => window.location.href = 'mailto:support@luxoria.com'}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
} 