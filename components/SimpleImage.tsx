'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SimpleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function SimpleImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false 
}: SimpleImageProps) {
  const [error, setError] = useState(false);
  
  // Generate a simple placeholder
  const placeholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='%23e5e7eb'%3E%3Crect width='${width}' height='${height}' /%3E%3C/svg%3E`;
  
  // Handle image load error
  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setError(true);
  };

  return (
    <div className="relative overflow-hidden bg-gray-100">
      <Image
        src={error ? placeholder : src}
        alt={alt || "Image"}
        width={width}
        height={height}
        className={`${className} ${error ? 'opacity-70' : ''}`}
        onError={handleError}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        quality={60}
      />
    </div>
  );
} 