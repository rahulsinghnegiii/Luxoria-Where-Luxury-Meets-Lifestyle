import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from './firebase-admin';

// Verifies the user's session on the server
export async function verifySession() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return null;
  }

  try {
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(authToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

// Middleware function to protect routes
export async function withAuth(
  request: NextRequest,
  redirectTo: string = '/login'
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    const url = new URL(redirectTo, request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  try {
    const auth = getAuth(adminApp);
    await auth.verifyIdToken(authToken);
    return NextResponse.next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    const url = new URL(redirectTo, request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

// Middleware function to protect admin routes
export async function withAdminAuth(
  request: NextRequest,
  redirectTo: string = '/login'
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    const url = new URL(redirectTo, request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  try {
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(authToken);
    
    // Check if user has admin role in custom claims
    const isAdmin = decodedToken.admin === true;
    if (!isAdmin) {
      // If not admin, redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Error in admin auth middleware:', error);
    const url = new URL(redirectTo, request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

// Server-side function to check if user is admin
export async function isAdmin() {
  const decodedToken = await verifySession();
  
  if (!decodedToken) {
    return false;
  }
  
  // Check admin role in custom claims
  return decodedToken.admin === true;
} 