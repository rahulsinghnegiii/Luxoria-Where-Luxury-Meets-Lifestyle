/**
 * Firebase Storage Helper for managing and transforming Firebase Storage URLs
 * This file centralizes all operations related to Firebase Storage URLs
 */

/**
 * Transform a Firebase Storage URL to a direct download URL format
 * Handles the various formats that Firebase Storage URLs can have
 */
export function getDirectDownloadUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // If it's not a Firebase Storage URL, return as is
  if (!url.includes('firebasestorage.googleapis.com') && !url.includes('firebasestorage.app')) {
    return url;
  }
  
  try {
    // Case 1: URL with ?name= parameter - most common case causing CORS issues
    // Format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o?name=[path]
    if (url.includes('/o?name=')) {
      // Extract the bucket name
      const bucketPart = url.split('/b/')[1];
      // Handle both formats: bucket.firebasestorage.app and bucket
      const bucket = bucketPart.includes('.firebasestorage.app') 
        ? bucketPart.split('.firebasestorage.app')[0]
        : bucketPart.split('.')[0];
      
      // Extract the file path from the name parameter
      let path = '';
      if (url.includes('name=')) {
        path = url.split('name=')[1];
        // Remove any additional query parameters
        if (path.includes('&')) {
          path = path.split('&')[0];
        }
      }
      
      // Decode then re-encode the path properly
      const decodedPath = decodeURIComponent(path);
      
      // Build a proper download URL using the standard format that works with CORS
      return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(decodedPath)}?alt=media`;
    }
    
    // Case 2: URL with /o/ path but missing alt=media
    // Format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]
    if (url.includes('/o/') && !url.includes('alt=media')) {
      // Add alt=media parameter
      return url.includes('?') ? `${url}&alt=media` : `${url}?alt=media`;
    }
    
    // Case 3: URL already has /o/ and alt=media, so it's good to go
    if (url.includes('/o/') && url.includes('alt=media')) {
      return url;
    }
    
    // Case 4: Fallback for any other Firebase Storage URL format
    console.warn('Unknown Firebase Storage URL format:', url);
    return url.includes('?') ? `${url}&alt=media` : `${url}?alt=media`;
  } catch (error) {
    console.error('Error transforming Firebase Storage URL:', error);
    return url;
  }
}

/**
 * Get a proxied URL through our API route to avoid CORS issues
 * This is the PREFERRED way to handle Firebase Storage URLs in client-side code
 */
export function getProxiedUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // Don't proxy non-Firebase URLs or already proxied URLs
  if ((!url.includes('firebasestorage.googleapis.com') && !url.includes('firebasestorage.app')) 
      || url.includes('/api/firebase-image')) {
    return url;
  }
  
  // First transform to direct download URL
  const directUrl = getDirectDownloadUrl(url);
  
  // Then proxy it
  return `/api/firebase-image?url=${encodeURIComponent(directUrl)}`;
}

/**
 * Transform Firebase Storage URL if needed, otherwise returns original URL
 * This is a safe function to call on any URL
 */
export function getSafeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // Handle Firebase Storage URLs
  if (url.includes('firebasestorage.googleapis.com') || url.includes('firebasestorage.app')) {
    // ALWAYS use proxy for client-side image display to avoid CORS issues
    return getProxiedUrl(url);
  }
  
  // Return other URLs as is
  return url;
} 