'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getProductsByCategory } from '../../../../../lib/firebaseUtils';
import { Product } from '../../../../../lib/types';
import ProductCard from '../../../../../components/ProductCard';

// Map category IDs to display names
const categoryNames: { [key: string]: string } = {
  'electronics': 'Electronics',
  'clothing': 'Clothing',
  'accessories': 'Accessories',
  'furniture': 'Furniture',
  'home': 'Home & Garden',
  'kitchen': 'Kitchen & Home',
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
];

export default function CategoryPage({ params }: { params: any }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const categorySlug = unwrappedParams.category;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        // Use the Firebase utility to fetch products by category
        const fetchedProducts = await getProductsByCategory(categorySlug);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchProductsByCategory();
    }
  }, [categorySlug]);

  // Apply sorting
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        // 'featured' - no additional sorting
        return 0;
    }
  });

  const displayName = categoryNames[categorySlug] || categorySlug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="pb-6">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{displayName}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {products.length} products
        </p>
      </div>

      <div className="pt-6 pb-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-medium text-gray-700">Filter by</h2>
            {/* Add filter options here if needed */}
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((placeholder) => (
            <div key={placeholder} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find any products in this category.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 