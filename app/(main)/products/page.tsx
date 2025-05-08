'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '../../../lib/firebaseUtils';
import { Product } from '../../../lib/types';
import ProductCard from '../../../components/ProductCard';
import AnimatedProductCard from '../../../components/AnimatedProductCard';
import Link from 'next/link';
import Image from 'next/image';

// Define the top categories to showcase
const topCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://images.unsplash.com/photo-1576571261645-c377cf8c7fce?q=80&w=2070&auto=format&fit=crop',
    color: 'from-green-600 to-teal-700'
  },
  {
    name: 'Home & Garden',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=2069&auto=format&fit=crop',
    color: 'from-purple-600 to-pink-700'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=2070&auto=format&fit=crop',
    color: 'from-yellow-600 to-amber-700'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (category === 'all') return true;
    return product.category === category;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default: featured
    return 0;
  });

  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-md h-72"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <div className="bg-red-50 p-4 rounded-md text-red-500 mb-8">
          {error}
        </div>
        <button 
          onClick={fetchProducts}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Category showcase section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Shop by Category</h2>
          <Link 
            href="/products/category"
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            View all categories
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topCategories.map((cat) => (
            <Link 
              key={cat.slug}
              href={`/products/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-lg h-40 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-white text-xl font-bold tracking-wide">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="mb-4 md:mb-0 flex items-center space-x-4">
          <Link 
            href="/products/category"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:opacity-90 transition-opacity flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Browse by Category
          </Link>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-md min-w-[150px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-md min-w-[150px]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product, index) => (
            <div key={product.id} className="transition-all duration-300 hover:transform hover:scale-105">
              {index < 4 ? (
                <AnimatedProductCard product={product} priority={index < 2} index={index} />
              ) : (
                <ProductCard product={product} priority={index < 8} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 