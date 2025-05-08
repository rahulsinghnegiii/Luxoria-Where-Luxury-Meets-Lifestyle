'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getProducts } from '../../../../lib/firebaseUtils';
import { Product } from '../../../../lib/types';

const categoryData = [
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    slug: 'clothing',
    name: 'Clothing',
    description: 'Stylish and comfortable apparel',
    image: 'https://images.unsplash.com/photo-1576571261645-c377cf8c7fce?q=80&w=2070&auto=format&fit=crop',
    color: 'from-green-500 to-teal-600',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=2070&auto=format&fit=crop',
    color: 'from-yellow-500 to-amber-600',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
  },
  {
    slug: 'furniture',
    name: 'Furniture',
    description: 'Beautiful furniture for your home',
    image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop',
    color: 'from-red-500 to-rose-600',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  {
    slug: 'home',
    name: 'Home & Garden',
    description: 'Make your living space beautiful',
    image: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=2069&auto=format&fit=crop',
    color: 'from-purple-500 to-violet-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  {
    slug: 'kitchen',
    name: 'Kitchen & Home',
    description: 'Quality kitchen tools and appliances',
    image: 'https://images.unsplash.com/photo-1590794056693-57dee373199f?q=80&w=2069&auto=format&fit=crop',
    color: 'from-cyan-500 to-sky-600',
    textColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
  },
];

export default function CategoriesPage() {
  const [categoryStats, setCategoryStats] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      setLoading(true);
      try {
        // Fetch all products to calculate category counts
        const products = await getProducts();
        
        // Count products in each category
        const stats: {[key: string]: number} = {};
        products.forEach((product: Product) => {
          if (product.category) {
            stats[product.category] = (stats[product.category] || 0) + 1;
          }
        });
        
        setCategoryStats(stats);
      } catch (error) {
        console.error('Error fetching products for category stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Product Categories
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Browse our wide selection of products by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryData.map((category, index) => (
          <motion.div
            key={category.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border ${category.borderColor}`}
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={index < 2}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}></div>
            </div>
            
            <div className="p-6 bg-white">
              <h2 className={`text-2xl font-bold mb-2 ${category.textColor}`}>
                {category.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {category.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {loading ? (
                    <span className="inline-block w-12 h-4 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    `${categoryStats[category.slug] || 0} products`
                  )}
                </span>
                <Link 
                  href={`/products/category/${category.slug}`}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r ${category.color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
                >
                  Explore
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link 
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
} 