'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getProductsByCategory } from '../../../../lib/firebaseUtils';
import { Product } from '../../../../lib/types';
import ProductCard from '../../../../components/ProductCard';

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
  // Rest of products...
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
      {/* Component UI content... */}
    </div>
  );
} 