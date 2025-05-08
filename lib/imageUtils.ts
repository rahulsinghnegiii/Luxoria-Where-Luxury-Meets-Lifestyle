/**
 * Utility functions for handling images in the application
 */
import { getSafeImageUrl as getFBSafeImageUrl } from './firebaseStorageHelper';

/**
 * Checks if a URL is a placeholder.com URL that might fail
 */
export const isPlaceholderUrl = (url: string): boolean => {
  return url && typeof url === 'string' && 
    (url.includes('via.placeholder.com') || 
     url.includes('placeholder.com') || 
     url.includes('placehold.co'));
};

/**
 * Checks if a URL is a Firebase Storage URL
 */
export const isFirebaseStorageUrl = (url: string): boolean => {
  return url && typeof url === 'string' && 
    (url.includes('firebasestorage.googleapis.com') || 
     url.includes('firebasestorage.app'));
};

/**
 * Generates a base64 SVG image as a fallback for failed placeholder URLs
 */
export const generateFallbackImage = (text: string = 'Image'): string => {
  // Extract filename from placeholder URL if possible
  let displayText = text;
  try {
    if (text.includes('text=')) {
      const encodedText = text.split('text=')[1].split('&')[0];
      displayText = decodeURIComponent(encodedText);
    }
  } catch (e) {
    console.error('Error extracting text from placeholder URL:', e);
  }

  // Generate a colored rectangle with the filename
  const colors = [
    '#4285F4', // Google Blue
    '#34A853', // Google Green
    '#FBBC05', // Google Yellow
    '#EA4335', // Google Red
    '#5E35B1', // Deep Purple
    '#1E88E5', // Blue
    '#43A047', // Green
    '#E53935', // Red
    '#FB8C00', // Orange
    '#00ACC1', // Cyan
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="${color}" />
      <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${displayText}</text>
    </svg>
  `;
  
  // Convert SVG to base64 data URL
  const base64Image = `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
  return base64Image;
};

/**
 * Route a Firebase Storage URL through our proxy to avoid CORS issues
 * @deprecated Use getSafeImageUrl from firebaseStorageHelper.ts instead
 */
export const getProxiedFirebaseUrl = (url: string): string => {
  // For consistency, use the implementation from firebaseStorageHelper.ts
  return getFBSafeImageUrl(url);
};

/**
 * Gets a safe image URL, replacing placeholder URLs with base64 images if needed
 * and transforming Firebase Storage URLs to direct download URLs
 */
export const getSafeImageUrl = (originalUrl: string): string => {
  // If it's not a valid URL, return a fallback
  if (!originalUrl || typeof originalUrl !== 'string') {
    return generateFallbackImage('Image');
  }
  
  // If it's a placeholder URL, replace with a base64 image
  if (isPlaceholderUrl(originalUrl)) {
    return generateFallbackImage(originalUrl);
  }
  
  // If it's a Firebase Storage URL, use the firebaseStorageHelper implementation
  if (isFirebaseStorageUrl(originalUrl)) {
    return getFBSafeImageUrl(originalUrl);
  }
  
  // Otherwise, return the original URL
  return originalUrl;
}; 