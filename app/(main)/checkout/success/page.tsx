'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';

// Component to handle the search params retrieval
function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const orderNumber = searchParams?.get('order_number');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, this would verify the session with Stripe
    // and fetch the real order details
    
    // For demo, we'll use the order_number from URL if provided, otherwise generate a mock one
    const mockOrderId = orderNumber || sessionId || `ord-${Math.random().toString(36).substring(2, 10)}`;
    setOrderId(mockOrderId);
    
    // Trigger confetti effect on successful checkout
    if (typeof window !== 'undefined') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Launch confetti from both sides
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6, x: randomInRange(0.1, 0.3) }
        });
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6, x: randomInRange(0.7, 0.9) }
        });
      }, 250);
    }
  }, [sessionId, orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order Successful!</h1>
        <p className="mt-2 text-lg text-gray-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        {orderId && (
          <div className="mt-6 inline-flex items-center p-2 border border-gray-200 rounded bg-gray-50">
            <span className="text-sm text-gray-500 mr-2">Order reference:</span>
            <span className="text-sm font-medium text-gray-900">{orderId}</span>
          </div>
        )}
        
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your email address.
          </p>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </Link>
          
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Order Details
            </Link>
          )}
        </div>
      </div>
      
      {/* Order Tips */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">What happens next?</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">1</div>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-900">Order Processing</p>
              <p className="mt-1 text-sm text-gray-500">
                Your order is being prepared and will be processed within 24 hours.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">2</div>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-900">Shipping</p>
              <p className="mt-1 text-sm text-gray-500">
                Once your order ships, you'll receive a tracking number via email.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">3</div>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-900">Delivery</p>
              <p className="mt-1 text-sm text-gray-500">
                Standard shipping takes 3-5 business days depending on your location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingCheckout() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="animate-pulse">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-200"></div>
          <div className="mt-6 h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="mt-8 h-24 bg-gray-200 rounded"></div>
          <div className="mt-10 flex justify-center gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that uses Suspense
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingCheckout />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 