'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getProductsByCategory } from '../../../../../lib/firebaseUtils';
import { Product } from '../../../../../lib/types';
import ProductCard from '../../../../../components/ProductCard';

// Sample fallback products for demo (same as in the main page)
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-canceling wireless headphones with extended battery life.',
    price: 249.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'electronics',
    features: ['Noise cancellation', '30-hour battery life', 'Premium audio quality'],
    rating: 4.8,
    reviews: 127,
    stock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ultra HD Smart TV',
    description: 'Crystal clear 4K resolution with smart features and voice control.',
    price: 799.99,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?q=80&w=2076&auto=format&fit=crop'
    ],
    category: 'electronics',
    features: ['4K Ultra HD', 'Voice control', 'Smart home integration'],
    rating: 4.6,
    reviews: 89,
    stock: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Casual Denim Jacket',
    description: 'Classic denim jacket with modern styling and comfortable fit.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'clothing',
    features: ['100% cotton denim', 'Button closure', 'Multiple pockets'],
    rating: 4.4,
    reviews: 56,
    stock: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Slim Fit Chinos',
    description: 'Comfortable slim fit chinos perfect for casual or formal occasions.',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'clothing',
    features: ['98% cotton, 2% elastane', 'Slim fit', 'Multiple colors available'],
    rating: 4.3,
    reviews: 42,
    stock: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Cotton T-Shirt Set',
    description: 'Pack of 3 premium cotton t-shirts in essential colors.',
    price: 34.99,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'clothing',
    features: ['100% cotton', 'Regular fit', 'Crew neck'],
    rating: 4.5,
    reviews: 78,
    stock: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Modern Coffee Table',
    description: 'Sleek modern coffee table with tempered glass top and wooden legs.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'home',
    features: ['Tempered glass', 'Solid wood legs', 'Easy assembly'],
    rating: 4.3,
    reviews: 36,
    stock: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair designed for long working hours.',
    price: 249.99,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'home',
    features: ['Adjustable height', 'Lumbar support', 'Breathable mesh material'],
    rating: 4.5,
    reviews: 42,
    stock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Minimalist Floor Lamp',
    description: 'Modern floor lamp with adjustable head for focused lighting.',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'home',
    features: ['Adjustable head', 'Energy-efficient LED', 'Stable base'],
    rating: 4.2,
    reviews: 28,
    stock: 18,
    createdAt: new Date().toISOString(),
  }
];

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
        // For demo purposes, we'll filter the sample products
        // In a real app, you would fetch from Firebase like this:
        // const fetchedProducts = await getProductsByCategory(categorySlug);
        
        setTimeout(() => {
          // Filter sample products by category
          const filteredProducts = sampleProducts.filter(
            product => product.category === categorySlug
          );
          setProducts(filteredProducts);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching products by category:', error);
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