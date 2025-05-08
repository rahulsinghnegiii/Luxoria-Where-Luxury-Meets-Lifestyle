import { NextRequest, NextResponse } from 'next/server';
import { getDirectDownloadUrl } from '../../../lib/firebaseStorageHelper';

/**
 * Proxy route for Firebase Storage images to avoid CORS issues
 * This server-side proxy fetches the image from Firebase and returns it directly,
 * bypassing CORS restrictions.
 */
export async function GET(request: NextRequest) {
  // Extract the Firebase URL from the query params
  const searchParams = request.nextUrl.searchParams;
  const firebaseUrl = searchParams.get('url');
  
  if (!firebaseUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }
  
  try {
    // Transform the URL to the direct download format
    // This handles various Firebase Storage URL formats
    const directDownloadUrl = getDirectDownloadUrl(firebaseUrl);
    
    console.log('Proxying Firebase Storage image:', {
      originalUrl: firebaseUrl,
      transformedUrl: directDownloadUrl
    });
    
    // Fetch the image from Firebase Storage with more robust error handling
    const response = await fetch(directDownloadUrl, {
      headers: {
        // Using these headers can help with CORS issues
        'Origin': request.nextUrl.origin,
        'Referer': request.nextUrl.origin,
        'User-Agent': 'Mozilla/5.0 NextJS Proxy'
      },
      cache: 'no-store' // Don't cache the request to avoid stale CORS errors
    });
    
    if (!response.ok) {
      console.error('Firebase Storage fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        url: directDownloadUrl
      });
      throw new Error(`Firebase storage fetch failed: ${response.status} ${response.statusText}`);
    }
    
    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Get the content-type or default to image/jpeg
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*', // Allow access from any origin
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow only GET and OPTIONS
        'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
      },
    });
  } catch (error) {
    console.error('Error proxying Firebase Storage image:', error);
    
    // Generate a fallback SVG image when fetch fails
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
        <rect width="300" height="200" fill="#f44336" />
        <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" fill="white">Image Load Error</text>
      </svg>
    `;
    
    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 