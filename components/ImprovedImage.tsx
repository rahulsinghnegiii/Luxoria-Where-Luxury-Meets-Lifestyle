'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { isPlaceholderUrl, getSafeImageUrl, isFirebaseStorageUrl, generateFallbackImage } from '../lib/imageUtils';

// This component adds robust error handling to the Next.js Image component
export default function ImprovedImage({
  src,
  alt,
  width = 300,
  height = 300,
  priority = false,
  loading,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);
  const [nextJsImageFailed, setNextJsImageFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert placeholder URLs to base64 images
  const [safeSrc, setSafeSrc] = useState<string | null>(null);
  
  // Update safeSrc when src changes
  useEffect(() => {
    // Handle empty or invalid src
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      // Use a default generated image
      setSafeSrc(generateFallbackImage(alt?.toString() || 'Image'));
      setIsLoading(false);
      return;
    }
    
    if (typeof src === 'string') {
      // If it's a placeholder URL that might fail, replace it with a base64 SVG
      if (isPlaceholderUrl(src)) {
        setSafeSrc(getSafeImageUrl(src));
      } else if (isFirebaseStorageUrl(src)) {
        // Also handle Firebase storage URLs
        setSafeSrc(getSafeImageUrl(src));
      } else {
        setSafeSrc(src);
      }
    } else if (src && typeof src === 'object') {
      // Handle StaticImageData
      setSafeSrc(src);
    } else {
      // Fallback for any other case
      setSafeSrc(generateFallbackImage(alt?.toString() || 'Image'));
    }
    
    // Reset error states
    setError(false);
    setNextJsImageFailed(false);
    setIsLoading(true);
  }, [src, alt]);
  
  // Generate a small, simple placeholder
  const simplePlaceholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='%23e5e7eb'%3E%3Crect width='${width}' height='${height}' /%3E%3C/svg%3E`;
  
  // Handle load event
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  // Handle initial Next.js Image error
  const handleNextJsError = () => {
    console.warn(`Next.js Image failed to load: ${safeSrc}`);
    setNextJsImageFailed(true);
    setIsLoading(false);
  };
  
  // Handle fallback image error
  const handleFallbackError = () => {
    console.warn(`Fallback image also failed: ${safeSrc}`);
    setError(true);
  };

  // Don't render anything if we don't have a valid src
  if (!safeSrc) {
    return (
      <div 
        className="relative overflow-hidden bg-gray-100 flex items-center justify-center"
        style={{ width, height, background: '#f3f4f6' }}
      >
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Create image props, ensuring we don't pass both priority and loading
  const imageProps: any = {
    src: safeSrc,
    alt: alt || "Product image",
    width: width,
    height: height,
    onError: handleNextJsError,
    onLoad: handleLoad,
    quality: 60, // Lower quality to reduce chances of timeout
    ...props,
    className: `${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
  };

  // Set priority or loading property but not both
  if (priority) {
    imageProps.priority = true;
    // Don't set loading when priority is true
  } else if (loading) {
    imageProps.loading = loading;
  } else {
    imageProps.loading = 'lazy';
  }

  // If next.js image failed, use regular img tag as fallback
  if (nextJsImageFailed) {
    return (
      <div className="relative overflow-hidden" style={{ background: '#f3f4f6' }}>
        {!error ? (
          <img
            src={safeSrc}
            alt={alt || "Product image"}
            width={width}
            height={height}
            onError={handleFallbackError}
            loading={priority ? "eager" : "lazy"}
            className={`${props.className || ''} w-full h-full object-cover`}
          />
        ) : (
          // Show a placeholder if both Next.js Image and regular img fail
          <div className="flex items-center justify-center bg-gray-100 w-full h-full">
            <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.2.26-.05.64.27.64h8.98c.32 0 .48-.39.28-.66l-2.54-3.14c-.2-.25-.58-.25-.78 0z" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  // Try the Next.js Image component first
  return (
    <div className="relative overflow-hidden" style={{ background: '#f3f4f6' }}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      )}
      <Image {...imageProps} />
    </div>
  );
} 
