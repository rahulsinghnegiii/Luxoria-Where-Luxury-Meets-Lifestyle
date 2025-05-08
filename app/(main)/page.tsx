'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '../../lib/firebaseUtils';
import { Product } from '../../lib/types';
import Link from 'next/link';
import ImprovedImage from '../../components/ImprovedImage';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import HeroSection3D from '../../components/HeroSection3D';
import AnimatedProductCard from '../../components/AnimatedProductCard';

// Categories with their icons
const categories = [
  { name: 'Electronics', icon: '🖥️', color: 'from-blue-500 to-cyan-500' },
  { name: 'Fashion', icon: '👕', color: 'from-pink-500 to-purple-500' },
  { name: 'Home', icon: '🏠', color: 'from-green-500 to-teal-500' },
  { name: 'Beauty', icon: '💄', color: 'from-red-500 to-pink-500' },
  { name: 'Sports', icon: '⚽', color: 'from-yellow-500 to-orange-500' },
  { name: 'Books', icon: '📚', color: 'from-indigo-500 to-blue-500' },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    content: "The 3D product viewing experience is mind-blowing! It's like having the product right in front of me.",
    author: "Alex Johnson",
    role: "Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=250&h=250&fit=crop&crop=faces"
  },
  {
    id: 2,
    content: "The checkout process was seamless and the AR try-on feature helped me make the perfect choice.",
    author: "Samantha Lee",
    role: "Fashion Blogger",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&h=250&fit=crop&crop=faces"
  },
  {
    id: 3,
    content: "The product animations and interactive elements make online shopping actually fun for once!",
    author: "Marcus Rivera",
    role: "UX Designer",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=250&h=250&fit=crop&crop=faces"
  }
];

// Animation variants for stagger effects
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Fade-in section component for scroll animations
const FadeInSection = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        // Get first 6 products for featured section
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
      toast.success('Thank you for subscribing!');
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection3D />
      
      {/* Categories */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
              Explore Our Categories
            </h2>
          </FadeInSection>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {categories.map((category, index) => (
              <motion.div key={category.name} variants={itemVariants} custom={index}>
                <Link href={`/products/category/${category.name.toLowerCase()}`}>
                  <div className="group h-40 bg-gray-800 rounded-lg overflow-hidden relative cyber-border transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                      <span className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">{category.icon}</span>
                      <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                </div>
              </div>
            </Link>
              </motion.div>
          ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Featured Products
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
              Discover our handpicked selection of premium products, featuring immersive 3D previews and futuristic designs.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="h-64 bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
          ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <AnimatedProductCard 
              key={product.id} 
              product={product} 
              priority={index < 3}
                  index={index}
            />
          ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <motion.button
                className="inline-flex items-center px-6 py-3 border-2 border-indigo-500 text-indigo-300 text-lg rounded-full font-medium hover:bg-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cyber-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Products
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              What Our Customers Say
            </h2>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInSection key={testimonial.id} delay={index * 0.2}>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full dark-glassmorphism">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="h-12 w-12 rounded-full mr-4 border-2 border-indigo-500"
                    />
                    <div>
                      <h4 className="text-white font-medium">{testimonial.author}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
            </div>
                  <p className="text-gray-300 italic">"{testimonial.content}"</p>
                  <div className="mt-4 flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
            </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-900 opacity-10"></div>
          <div className="absolute inset-0 bg-grid-pattern" style={{ 
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-30%)'
          }}></div>
          </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-text text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Subscribe to our newsletter for the latest products, exclusive deals, and futuristic shopping experiences.
          </p>
          
            {subscribed ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-lg cyber-border inline-block"
            >
              <svg className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-white">Thank you for subscribing!</h3>
              <p className="text-gray-400 mt-2">You're now on our VIP list for future updates.</p>
            </motion.div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  suppressHydrationWarning
                />
                <motion.button
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Subscribe'}
                </motion.button>
            </div>
          </div>
            )}
        </motion.div>
      </section>
    </>
  );
} 