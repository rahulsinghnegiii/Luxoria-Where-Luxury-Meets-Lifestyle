'use client';

import { useState } from 'react';
import Image from 'next/image';

type SafeImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export default function SafeImage({ src, alt, width, height, className = '', priority = false }: SafeImageProps) {
  const [nextImageError, setNextImageError] = useState(false);
  const [htmlImageError, setHtmlImageError] = useState(false);

  // Determine what to render based on error states
  const renderContent = () => {
    if (nextImageError) {
      if (htmlImageError) {
        // If both Next.js Image and HTML image fail, show placeholder
        return (
          <div 
            className={`flex items-center justify-center bg-gray-100 ${className}`}
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.2.26-.05.64.27.64h8.98c.32 0 .48-.39.28-.66l-2.54-3.14c-.2-.25-.58-.25-.78 0z" />
            </svg>
          </div>
        );
      }
      
      // If only Next.js Image fails, use HTML img
      return (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => setHtmlImageError(true)}
          loading={priority ? "eager" : "lazy"}
        />
      );
    }
    
    // If no errors yet, use Next.js Image
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setNextImageError(true)}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        quality={60}
      />
    );
  };

  return renderContent();
} 