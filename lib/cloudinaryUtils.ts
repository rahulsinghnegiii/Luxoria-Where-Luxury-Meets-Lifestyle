/**
 * Cloudinary utilities for image upload and transformation
 */

// Use environment variables for Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'next_ecommerce';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads an image to Cloudinary and returns the URL
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    
    // Return a fallback SVG image
    return generateFallbackImage(file.name);
  }
}

/**
 * Generates a fallback image when upload fails
 */
export function generateFallbackImage(text: string = 'Image'): string {
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
      <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${text}</text>
    </svg>
  `;
  
  // Convert SVG to base64 data URL
  const base64Image = `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
  return base64Image;
}

/**
 * Optimizes a Cloudinary URL by adding transformations
 * https://cloudinary.com/documentation/transformation_reference
 */
export function optimizeCloudinaryImage(url: string, width: number = 800, height: number = 600): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // Find the upload part of the URL
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  
  // Insert optimization parameters
  const optimizedUrl = url.slice(0, uploadIndex + 8) + 
    `c_fill,f_auto,q_auto,w_${width},h_${height}/` + 
    url.slice(uploadIndex + 8);
  
  return optimizedUrl;
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url && typeof url === 'string' && url.includes('cloudinary.com');
}

/**
 * Gets a safe image URL for any type of image source
 */
export function getSafeImageUrl(url: string, width: number = 800, height: number = 600): string {
  if (!url || typeof url !== 'string') {
    return generateFallbackImage('Image');
  }
  
  // Optimize Cloudinary URLs
  if (isCloudinaryUrl(url)) {
    return optimizeCloudinaryImage(url, width, height);
  }
  
  // Return other URLs as is
  return url;
} 