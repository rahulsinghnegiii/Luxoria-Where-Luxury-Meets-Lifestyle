'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../../lib/cartContext';
import { useAuth } from '../../../lib/authContext';
import { createCheckoutSession } from '../../../lib/stripe';
import toast from 'react-hot-toast';
import { createOrder } from '../../../lib/firebaseUtils';

// Disable Fast Refresh for this component to prevent refresh-related issues
if (typeof window !== 'undefined' && module.hot) {
  module.hot.decline();
}

type FormData = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

// Function to determine credit card type based on card number
const getCardType = (cardNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Check card type based on pattern
  if (/^4\d{12}(\d{3})?$/.test(cleaned)) return 'Visa';
  if (/^(5[1-5]\d{4}|2(2(2[1-9]|[3-9]\d)|[3-6]\d{2}|7([0-1]\d|20)))\d{10}$/.test(cleaned)) return 'Mastercard';
  if (/^3[47]\d{13}$/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5\d{2})\d{12}$/.test(cleaned)) return 'Discover';
  if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cleaned)) return 'JCB';
  if (/^3(?:0[0-5]|[68]\d)\d{11}$/.test(cleaned)) return 'Diners Club';
  
  // Default if card type cannot be determined
  return 'Unknown';
};

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submissionError, setSubmissionError] = useState('');

  // Calculate order totals
  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 100 ? 0 : 10.99;
  const taxRate = 0.08; // 8% tax rate
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingCost + taxAmount;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items, router, orderComplete]);
  
  // Disable browser back/forward navigation during checkout
  useEffect(() => {
    // Save the current history state
    const handlePopState = (e: PopStateEvent) => {
      // Prevent the browser from navigating away during checkout
      if (isSubmitting) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isSubmitting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateShippingForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    // Simplified validation - just check if fields are filled for testing
    if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
    if (!formData.cardCvc.trim()) newErrors.cardCvc = 'CVC is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateShippingForm()) {
      setFormStep(2);
      window.scrollTo(0, 0);
      toast.success('Shipping information saved');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePreviousStep = () => {
    setFormStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      // Process payment
      // In a real app, you would process payment through a payment processor
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate payment processing

      // Generate order number
      const orderNumber = `LUX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create order in the database
      const orderData = {
        userId: user?.uid || 'guest',
        items: items.map(item => ({
          id: `item-${Date.now()}-${item.id}`,
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity
        })),
        total: totalAmount,
        subtotal: subtotal,
        tax: taxAmount,
        shippingCost: shippingCost,
        status: 'pending',
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentDetails: {
          cardType: getCardType(formData.cardNumber),
          last4: formData.cardNumber.slice(-4)
        }
      };

      if (process.env.NEXT_PUBLIC_USE_MOCK_SERVICES !== 'true' && user?.uid) {
        // Use createOrder function to store in Firebase
        await createOrder(orderData);
      }

      // Update order status
      setOrderNumber(orderNumber);
      setOrderComplete(true);
      
      // Clear cart
      clearCart();
      
      // Redirect to success page
      router.push(`/checkout/success?orderId=${orderNumber}`);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      setSubmissionError('An error occurred during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render order confirmation screen if order is complete
  if (orderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order Successful!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="mt-6 inline-flex items-center p-2 border border-gray-200 rounded bg-gray-50">
            <span className="text-sm text-gray-500 mr-2">Order reference:</span>
            <span className="text-sm font-medium text-gray-900">{orderNumber}</span>
          </div>
          
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
          </div>
          
          {/* Order Process Steps */}
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
      </div>
    );
  }

  if (items.length === 0 && !orderComplete) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
        <div className="mt-4 flex justify-center">
          <ol className="flex items-center space-x-5">
            <li className="flex items-center">
              <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                formStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </span>
              <span className="ml-2 text-sm font-medium text-gray-900">Shipping</span>
            </li>
            <li className="flex items-center">
              <div className="h-0.5 w-12 bg-gray-200"></div>
            </li>
            <li className="flex items-center">
              <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                formStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </span>
              <span className="ml-2 text-sm font-medium text-gray-900">Payment</span>
            </li>
            <li className="flex items-center">
              <div className="h-0.5 w-12 bg-gray-200"></div>
            </li>
            <li className="flex items-center">
              <span className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                3
              </span>
              <span className="ml-2 text-sm font-medium text-gray-900">Confirmation</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit}>
            {formStep === 1 ? (
              <div className="bg-white p-6 shadow-md rounded-md">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                      Full name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.name ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.email ? 'border-red-300' : ''
                        }`}
                        suppressHydrationWarning
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-800">
                      Street address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.address ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-800">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.city ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-800">
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.state ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.state && (
                        <p className="mt-2 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-800">
                      ZIP / Postal Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.postalCode ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="mt-2 text-sm text-red-600">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-800">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Link
                    href="/cart"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 shadow-md rounded-md">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Information</h2>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-800">
                      Name on card
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cardName"
                        id="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.cardName ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.cardName && (
                        <p className="mt-2 text-sm text-red-600">{errors.cardName}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-800">
                      Card number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.cardNumber ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-2 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-800">
                      Expiry date (MM/YY)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cardExpiry"
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.cardExpiry ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.cardExpiry && (
                        <p className="mt-2 text-sm text-red-600">{errors.cardExpiry}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-800">
                      CVC
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cardCvc"
                        id="cardCvc"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700 ${
                          errors.cardCvc ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.cardCvc && (
                        <p className="mt-2 text-sm text-red-600">{errors.cardCvc}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
                
                {/* Payment Processing Status Message - Initially hidden */}
                <div id="payment-status" className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md text-center hidden">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Payment accepted! Processing your order and preparing for shipment...</span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <div className="bg-gray-50 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            
            <div className="mt-6 flow-root">
              <ul role="list" className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal ({getTotalItems()} items)</p>
                <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">Shipping estimate</p>
                <p className="text-sm font-medium text-gray-900">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">Tax estimate</p>
                <p className="text-sm font-medium text-gray-900">${taxAmount.toFixed(2)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-medium text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="rounded-md bg-gray-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Your order is eligible for free shipping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}