import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { generateFallbackImage, getSafeImageUrl } from '../lib/cloudinaryUtils';

interface CloudImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackText?: string;
}

export default function CloudImage({
  src,
  alt,
  width = 300,
  height = 300,
  fallbackText,
  priority = false,
  loading,
  ...props
}: CloudImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [safeSrc, setSafeSrc] = useState<string | null>(null);

  // Update safeSrc when src changes
  useEffect(() => {
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      // Use a fallback image for empty src
      setSafeSrc(generateFallbackImage(fallbackText || alt?.toString() || 'Image'));
      setIsLoading(false);
      return;
    }

    try {
      if (typeof src === 'string') {
        // Get a safe URL for any type of image source
        setSafeSrc(getSafeImageUrl(src));
      } else {
        // Handle non-string sources (like StaticImageData)
        setSafeSrc(src);
      }
    } catch (error) {
      console.error('Error setting image source:', error);
      setSafeSrc(generateFallbackImage(fallbackText || alt?.toString() || 'Image'));
    }

    // Reset error and loading states
    setError(false);
    setIsLoading(true);
  }, [src, alt, fallbackText]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    console.warn(`Image failed to load: ${safeSrc}`);
    setError(true);
    setIsLoading(false);
    
    // Set fallback
    setSafeSrc(generateFallbackImage(fallbackText || alt?.toString() || 'Image'));
  };

  // Don't render anything if we don't have a valid src
  if (!safeSrc) {
    return (
      <div 
        className="relative overflow-hidden bg-gray-100 flex items-center justify-center"
        style={{ width, height }}
      >
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }

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
      
      <Image
        src={safeSrc}
        alt={alt || "Image"}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        loading={!priority ? loading : undefined}
        className={`${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
} 