import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration for protected routes (requiring authentication)
const protectedRoutes = [
  '/profile',
  '/orders',
  '/wishlist',
];

// Routes that allow guest checkout but could benefit from authentication
const guestCheckoutRoutes = [
  '/checkout',
];

// Admin-only routes (requiring admin privileges)
const adminRoutes = [
  '/dashboard',
  '/admin',
];

// Payment-related routes (requiring active checkout session)
const paymentRoutes = [
  '/checkout/success',
  '/checkout/payment',
];

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Get auth and session cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const checkoutSessionId = request.cookies.get('checkout_session_id')?.value;
  
  // Function to check if the current path matches routes arrays
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isPaymentRoute = paymentRoutes.some(route => path.startsWith(route));
  const isGuestCheckoutRoute = guestCheckoutRoutes.some(route => path.startsWith(route));
  
  // Build a properly encoded redirect URL with the original path for later redirect back
  const encodedRedirectPath = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
  const loginRedirectUrl = new URL(`/login?redirect=${encodedRedirectPath}`, request.url);

  // Handle authenticated routes
  if (isProtectedRoute && !authToken) {
    console.log(`Redirecting unauthenticated user from ${path} to login`);
    return NextResponse.redirect(loginRedirectUrl);
  }

  // Handle admin routes with strict permission check
  if (isAdminRoute) {
    // Check both authentication and admin role
    if (!authToken) {
      console.log(`Redirecting unauthenticated user from admin route ${path} to login`);
      return NextResponse.redirect(loginRedirectUrl);
    }
    
    if (userRole !== 'admin') {
      console.log(`Redirecting non-admin user from ${path} to home`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Handle payment routes requiring active checkout session
  if (isPaymentRoute && !checkoutSessionId) {
    console.log(`Redirecting user from payment route ${path} to checkout`);
    return NextResponse.redirect(new URL('/checkout', request.url));
  }
  
  // Additional security headers for all responses
  const response = NextResponse.next();
  
  // Set common security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

// Define the middleware matcher with all paths that should be protected
export const config = {
  matcher: [
    '/profile/:path*', 
    '/orders/:path*', 
    '/dashboard/:path*',
    '/admin/:path*',
    '/checkout/:path*',
    '/wishlist/:path*',
  ]
}; 