'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function BasicImage({ src, alt, width, height, className = '', priority = false, ...props }) {
  const [error, setError] = useState(false);
  
  // Simple placeholder data URL
  const placeholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='%23e5e7eb'%3E%3Crect width='${width}' height='${height}' /%3E%3C/svg%3E`;
  
  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setError(true);
  };

  return (
    <div className="relative overflow-hidden bg-gray-100">
      <Image
        src={error ? placeholder : src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        {...props}
      />
    </div>
  );
} 