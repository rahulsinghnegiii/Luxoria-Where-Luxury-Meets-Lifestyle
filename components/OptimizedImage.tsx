'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { isPlaceholderUrl, getSafeImageUrl, isFirebaseStorageUrl, generateFallbackImage } from '../lib/imageUtils';

// This component adds error handling to the Next.js Image component
export default function OptimizedImage({
  src,
  alt,
  priority,
  loading,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert placeholder URLs to base64 images
  const [safeSrc, setSafeSrc] = useState<string | null>(null);
  
  // Update safeSrc and reset error state when src changes
  useEffect(() => {
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      // Use a default image for empty src
      setSafeSrc(generateFallbackImage(alt?.toString() || 'Image'));
      setIsLoading(false);
      return;
    }
    
    if (typeof src === 'string') {
      // If it's a placeholder URL that might fail, replace it with a base64 SVG
      if (isPlaceholderUrl(src)) {
        setSafeSrc(getSafeImageUrl(src));
      } else if (isFirebaseStorageUrl(src)) {
        // Handle Firebase Storage URLs
        setSafeSrc(getSafeImageUrl(src));
      } else {
        setSafeSrc(src);
      }
    } else {
      // Handle non-string src (like StaticImageData)
      setSafeSrc('');
    }
    
    setError(false);
    setIsLoading(true);
  }, [src, alt]);
  
  // Use a more reliable placeholder - data URL instead of an external service
  const placeholderDataUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%231e293b'%3E%3Crect width='600' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='24px' fill='%231e293b'%3E${encodeURIComponent(alt || 'Image')}%3C/text%3E%3C/svg%3E`;
  
  // Use the placeholder if there's an error loading the original image or if safeSrc is null/empty
  const imageSrc = error || !safeSrc ? placeholderDataUrl : safeSrc;
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    console.warn(`Failed to load image: ${safeSrc}`);
    setError(true);
    setIsLoading(false);
  };

  // Only render when we have a valid src
  if (!imageSrc) {
    return (
      <div 
        className="relative overflow-hidden bg-gray-100 flex items-center justify-center"
        style={{ background: '#f3f4f6' }}
      >
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Create image props
  const imageProps: any = {
    src: imageSrc,
    alt: alt || "Product image",
    onError: handleError,
    onLoad: handleLoad,
    quality: 75,
    ...props,
    className: `${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
  };

  // Handle priority vs loading prop correctly - don't use both
  if (priority) {
    imageProps.priority = true;
    // Don't set loading when priority is true
  } else if (loading) {
    imageProps.loading = loading;
  } else {
    imageProps.loading = 'lazy';
  }

  return (
    <div className="relative overflow-hidden" style={{ background: '#f3f4f6' }}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.2.26-.05.64.27.64h8.98c.32 0 .48-.39.28-.66l-2.54-3.14c-.2-.25-.58-.25-.78 0z" />
          </svg>
        </div>
      )}
      
      <Image {...imageProps} />
    </div>
  );
} 