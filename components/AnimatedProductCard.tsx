'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { Product } from '../lib/types';
import { useCart } from '../lib/cartContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import toast from 'react-hot-toast';

interface AnimatedProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

export default function AnimatedProductCard({ product, priority = false, index = 0 }: AnimatedProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for 3D tilt effect
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth out the tilt effect
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });
  const scale = useSpring(isHovered ? 1.05 : 1, { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };
  
  const resetCardPosition = () => {
    x.set(0);
    y.set(0);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add item to cart with a bouncy animation
    addItem(product);
    
    // Show success toast
    toast.success(`Added ${product.name} to cart`, {
      style: {
        border: '2px solid #10B981',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#ffffff',
        backdropFilter: 'blur(10px)',
      },
      iconTheme: {
        primary: '#10B981',
        secondary: '#ffffff',
      },
    });
  };

  // Calculate delay for staggered entrance animation
  const entranceDelay = index * 0.1;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: entranceDelay,
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for futuristic feel
      }}
    >
      <Link href={`/products/${product.id}`}>
        <motion.div
          ref={cardRef}
          className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-1"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            resetCardPosition();
          }}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
            boxShadow: isHovered 
              ? "0 20px 40px rgba(0, 0, 255, 0.2), 0 0 20px rgba(61, 90, 254, 0.3), inset 0 0 0 1px rgba(61, 90, 254, 0.2)" 
              : "0 10px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
            transition: "box-shadow 0.5s ease",
          }}
        >
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 opacity-30 animate-gradient"></div>
          </div>
          
          <div className="relative z-10 bg-black bg-opacity-90 rounded-lg overflow-hidden">
            {/* Product image with perspective */}
            <div 
              className="w-full overflow-hidden aspect-square relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                  translateZ: isHovered ? "20px" : "0px",
                  transition: "transform 0.5s ease"
                }}
              >
                <OptimizedImage
                  src={product.images[0]}
                  alt={product.name}
                  className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
                    isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
                  }`}
                  width={300}
                  height={300}
                  priority={priority}
                />
                
                {product.images.length > 1 && (
                  <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: isHovered ? 1 : 0 }}>
                    <OptimizedImage
                      src={product.images[1]}
                      alt={`${product.name} - secondary view`}
                      className="w-full h-full object-cover object-center"
                      width={300}
                      height={300}
                    />
                  </div>
                )}
              </motion.div>
              
              {/* Futuristic shine effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.8) 45%, transparent 50%)',
                  backgroundSize: '200% 100%',
                  animation: isHovered ? 'shine 1.5s ease-in-out infinite' : 'none'
                }}
              ></div>
              
              {/* Hover action button */}
              <motion.button
                onClick={handleAddToCart}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={isHovered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] z-20"
                style={{ transformStyle: "preserve-3d", translateZ: "30px" }}
              >
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </span>
              </motion.button>
            </div>
            
            {/* Product info */}
            <motion.div 
              className="p-4 text-white"
              style={{ 
                transformStyle: "preserve-3d", 
                translateZ: isHovered ? "15px" : "0px",
                transition: "transform 0.5s ease"
              }}
            >
              <motion.h3 
                className="text-sm font-medium mb-1 text-white truncate"
                initial={{ translateZ: 0 }}
                animate={{ translateZ: isHovered ? 40 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {product.name}
              </motion.h3>
              
              <motion.p 
                className="mt-1 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                initial={{ translateZ: 0 }}
                animate={{ translateZ: isHovered ? 50 : 0 }}
                transition={{ duration: 0.5 }}
              >
                ${product.price.toFixed(2)}
              </motion.p>
              
              {product.rating && (
                <motion.div 
                  className="mt-1 flex items-center"
                  initial={{ translateZ: 0 }}
                  animate={{ translateZ: isHovered ? 30 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className={`h-3 w-3 ${
                          product.rating! > rating ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="ml-1 text-xs text-gray-200">({product.reviews})</p>
                </motion.div>
              )}
              
              {product.stock <= 5 && product.stock > 0 && (
                <motion.div 
                  className="mt-1"
                  initial={{ translateZ: 0 }}
                  animate={{ translateZ: isHovered ? 20 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xs text-orange-500">Only {product.stock} left</p>
                </motion.div>
              )}
              
              {product.stock === 0 && (
                <motion.div 
                  className="mt-1"
                  initial={{ translateZ: 0 }}
                  animate={{ translateZ: isHovered ? 20 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xs text-red-500">Out of stock</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
} 