'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../../lib/cartContext';
import { CartItem } from '../../../types';

export default function CartPage() {
  const { items, getTotalPrice, removeItem, updateQuantity, isLoading, error } = useCart();
  const [mounted, setMounted] = useState(false);

  // Only run client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Display a loading state when not mounted or loading
  if (!mounted || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        <div className="mt-8 animate-pulse space-y-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Display error state if there's an error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <h2 className="text-lg font-medium">Error</h2>
          <p className="mt-1">{error}</p>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        <div className="mt-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
      
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
            {items.map((item: CartItem) => (
              <div key={item.id} className="py-6 flex">
                <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                  {/* Use a simpler img tag instead of next/image to avoid issues */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-center object-cover"
                    onError={(e) => {
                      // Replace with a placeholder if image fails to load
                      e.currentTarget.src = 'https://placehold.co/96x96?text=Image+Error';
                    }}
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link href={`/products/${item.productId}`} className="hover:text-indigo-600">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex-1 flex items-end justify-between text-sm">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span className="mx-2 text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link 
              href="/"
              className="flex items-center text-indigo-600 hover:text-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <div className="bg-gray-50 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">${getTotalPrice().toFixed(2)}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-medium text-gray-900">${getTotalPrice().toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 