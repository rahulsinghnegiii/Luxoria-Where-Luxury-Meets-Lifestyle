import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CartItem } from './types';

let stripePromise: Promise<Stripe | null>;

// Load Stripe outside of components to avoid recreating Stripe instance on each render
export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key is missing');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

interface CheckoutSessionResponse {
  id: string;
  success: boolean;
  url?: string;
  error?: string;
}

// Helper function to create a checkout session
export const createCheckoutSession = async (
  items: CartItem[]
): Promise<CheckoutSessionResponse> => {
  // Log the items being checked out
  console.log('Creating checkout session for:', items);
  
  // If we're using mock services, return a mock session
  if (process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true') {
    console.log('Using mock checkout session');
    
    // Generate a mock session ID that will be used on the success page
    const mockSessionId = 'cs_test_' + Math.random().toString(36).substring(2, 15);
    
    // Simulate network latency for more realistic mock behavior
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For mock services, return the session ID but don't include the URL
    // This will prevent automatic redirection and allow the checkout component
    // to handle the redirect manually
    return {
      id: mockSessionId,
      success: true
    };
  }
  
  try {
    // Attempt to create a real checkout session with Stripe
    // This would normally be a call to a server-side API
    
    // For this implementation (without a server), we'll still use a mock
    // but provide more realistic implementation structure
    
    /* 
    // Real implementation with backend API:
    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        items,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating checkout session');
    }
    
    const data = await response.json();
    return data;
    */
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful response for development
    // Generate a session ID but don't include a URL to prevent automatic redirection
    return {
      id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
      success: true
    };
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { 
      id: '', 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to redirect to checkout
export const redirectToCheckout = async (sessionId: string) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to create a payment intent (for custom payment flows)
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  try {
    // This would normally call a server endpoint
    /* 
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating payment intent');
    }
    
    return await response.json();
    */
    
    // Mock response for development
    return {
      clientSecret: 'pi_mock_secret_' + Math.random().toString(36).substring(2, 9),
      success: true
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}; 