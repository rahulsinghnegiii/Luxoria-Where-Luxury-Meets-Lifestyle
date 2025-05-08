'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface Product3DViewProps {
  images: string[];
  name: string;
  priority?: boolean;
}

export default function Product3DView({ images, name, priority = true }: Product3DViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  
  // For 3D rotation effect
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smoothed rotation values
  const rotateX = useSpring(useTransform(y, [-300, 300], [15, -15]), { damping: 50, stiffness: 400 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-15, 15]), { damping: 50, stiffness: 400 });
  
  // Lighting effect values
  const brightness = useTransform(y, [-300, 300], [1.5, 0.5]);
  const backgroundX = useTransform(x, [-300, 300], ['35%', '65%']);
  const backgroundY = useTransform(y, [-300, 300], ['35%', '65%']);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
    
    // Update zoom position for magnification
    if (isZoomed) {
      const xPos = ((e.clientX - rect.left) / rect.width) * 100;
      const yPos = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x: xPos, y: yPos });
    }
  };
  
  const resetPosition = () => {
    x.set(0);
    y.set(0);
  };
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Auto-rotation effect when not interacting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isZoomed) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex < images.length - 1 ? prevIndex + 1 : 0
        );
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [images.length, isZoomed]);
  
  return (
    <div className="w-full">
      {/* Main image with 3D effect */}
      <motion.div
        ref={containerRef}
        className="relative w-full aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black p-1 mb-4 preserve-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetPosition}
        onClick={toggleZoom}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          cursor: isZoomed ? "zoom-out" : "zoom-in",
          background: `radial-gradient(circle at ${backgroundX}% ${backgroundY}%, rgba(59, 130, 246, 0.3), transparent 60%)`,
        }}
        whileHover={{ boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.8)" }}
      >
        {/* Overlay lighting effect */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
            backgroundPosition: `${backgroundX}% ${backgroundY}%`,
            opacity: 0.7,
          }}
        />
        
        {/* The product image */}
        <motion.div 
          className="relative w-full h-full rounded-lg overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            translateZ: "20px",
          }}
        >
          <div 
            className={`relative w-full h-full transition-transform duration-300 ${
              isZoomed ? 'scale-150' : ''
            }`}
            style={
              isZoomed 
                ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } 
                : {}
            }
          >
            <OptimizedImage
              src={images[currentImageIndex]}
              alt={`${name} - image ${currentImageIndex + 1}`}
              priority={priority}
              className="w-full h-full object-contain"
              width={800}
              height={800}
            />
          </div>
          
          {/* Zoom out button */}
          {isZoomed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 z-50 p-2 bg-black/80 text-white rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
      
      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              className={`relative rounded-md overflow-hidden border-2 transition-all duration-200 ${
                currentImageIndex === index
                  ? 'border-indigo-600 shadow-md'
                  : 'border-gray-800 hover:border-indigo-400'
              }`}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <OptimizedImage
                src={image}
                alt={`${name} - thumbnail ${index + 1}`}
                className="w-full h-auto object-cover aspect-square"
                width={100}
                height={100}
              />
              
              {/* Active indicator dot */}
              {currentImageIndex === index && (
                <motion.div 
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500"
                  layoutId="activeImageIndicator"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
} 