'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Track mouse movement for dynamic 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width - 0.5) * 2; // -1 to 1
        const y = ((e.clientY - top) / height - 0.5) * 2; // -1 to 1
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate 3D transforms based on mouse position
  const calcTransform = (factor: number = 1) => {
    const { x, y } = mousePosition;
    return {
      transform: `perspective(1200px) rotateX(${y * -5 * factor}deg) rotateY(${x * 5 * factor}deg)`,
    };
  };
  
  return (
    <div 
      ref={heroRef}
      className="relative overflow-hidden h-[85vh] bg-gradient-to-b from-black to-gray-900"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 100, 0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(0, 0, 100, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-10%)',
            opacity: 0.2,
          }}
        />
      </div>

      {/* Glowing orbs */}
      <motion.div 
        className="absolute rounded-full w-[300px] h-[300px] bg-blue-600 filter blur-[120px] opacity-20"
        style={{ 
          x: useTransform(() => mousePosition.x * -40),
          y: useTransform(() => mousePosition.y * -40 + y1.get()), 
        }}
      />
      <motion.div 
        className="absolute right-[10%] top-[30%] rounded-full w-[200px] h-[200px] bg-purple-600 filter blur-[90px] opacity-20"
        style={{ 
          x: useTransform(() => mousePosition.x * -25),
          y: useTransform(() => mousePosition.y * -25 + y2.get()),
        }}
      />
      
      {/* Floating 3D elements */}
      <motion.div
        className="absolute bottom-[15%] right-[15%] preserve-3d"
        style={{
          x: useTransform(() => mousePosition.x * 20),
          y: useTransform(() => mousePosition.y * 20 + y1.get()),
          opacity,
        }}
      >
        <div 
          className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-purple-700 rounded-xl cyber-border animate-float"
          style={{ ...calcTransform(1.2) }}
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-[25%] left-[10%] preserve-3d"
        style={{
          x: useTransform(() => mousePosition.x * 30),
          y: useTransform(() => mousePosition.y * 30 + y2.get()),
          opacity,
        }}
      >
        <div 
          className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-teal-500 rounded-full backface-hidden animate-float"
          style={{ 
            ...calcTransform(1.5),
            animationDelay: '-2s',
          }}
        />
      </motion.div>
      
      {/* Main content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
        <motion.div 
          className="max-w-5xl w-full preserve-3d"
          style={{ ...calcTransform(0.2) }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 mb-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Next Generation Shopping Experience
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl font-light text-gray-300 mb-12 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Discover our curated collection of premium products with immersive 3D shopping experience
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/products/category/electronics">
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium text-lg relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Browse Products</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700"></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-20">
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shine"></span>
                  </span>
                </span>
              </motion.button>
            </Link>
            
            <Link href="/about">
              <motion.button 
                className="px-8 py-4 bg-transparent text-white border-2 border-indigo-500 rounded-full font-medium text-lg hover:bg-indigo-500/10 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        style={{ opacity }}
      >
        <p className="text-gray-400 text-sm mb-2">Scroll to explore</p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
} 