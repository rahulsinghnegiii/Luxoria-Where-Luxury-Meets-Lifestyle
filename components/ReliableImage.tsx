'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ReliableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  blur?: boolean;
  sizes?: string;
}

export default function ReliableImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackSrc,
  blur = false,
  sizes,
  ...props
}: ReliableImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
    setError(false);
  }, [src]);

  // Simple placeholder data URL - avoid complex SVG to prevent parsing issues
  const simplePlaceholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='%23e5e7eb'%3E%3Crect width='${width}' height='${height}' /%3E%3C/svg%3E`;
  
  // Fallback logic - first try the provided fallback, then use placeholder
  const handleError = () => {
    console.warn(`Failed to load image: ${imgSrc}`);
    
    // If we're already showing a fallback and it fails, use the simple placeholder
    if (error || imgSrc === (fallbackSrc || '')) {
      setImgSrc(simplePlaceholder);
    } 
    // Otherwise try the fallback image first
    else if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    } 
    // If no fallback provided, use placeholder
    else {
      setImgSrc(simplePlaceholder);
    }
    
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="relative overflow-hidden" style={{ background: '#f5f5f5' }}>
      {loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          {error ? (
            <div className="text-sm text-gray-500 text-center p-4">
              <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Image unavailable
            </div>
          ) : (
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
          )}
        </div>
      )}
      
      {/* The Image component */}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        quality={60}
        sizes={sizes}
        placeholder={blur ? "blur" : undefined}
        blurDataURL={blur ? simplePlaceholder : undefined}
        {...props}
      />
    </div>
  );
}