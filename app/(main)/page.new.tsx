'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts } from '../../lib/firebaseUtils';
import { Product } from '../../lib/types';
import Image from 'next/image';
import ImprovedImage from '../../components/ImprovedImage';
import ProductCard from '../../components/ProductCard';

// Sample data for the homepage
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
    ],
    category: 'electronics',
    features: ['4K Ultra HD', 'Voice control', 'Smart home integration'],
    rating: 4.6,
    reviews: 89,
    stock: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Designer Watch',
    description: 'Elegant designer watch with premium materials and precise movement.',
    price: 349.99,
    images: [
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'accessories',
    rating: 4.9,
    reviews: 64,
    stock: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Designer Sofa',
    description: 'Modern designer sofa with premium upholstery and elegant legs.',
    price: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'home',
    rating: 4.7,
    reviews: 42,
    stock: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Modern Coffee Table',
    description: 'Sleek modern coffee table with tempered glass top and wooden legs.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1567016376408-0226e4d0b1ea?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'home',
    rating: 4.5,
    reviews: 38,
    stock: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Minimalist Tote Bag',
    description: 'Simple and elegant tote bag for everyday use, with internal compartments.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'accessories',
    rating: 4.4,
    reviews: 56,
    stock: 25,
    createdAt: new Date().toISOString(),
  }
];

// Featured categories
const featuredCategories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?q=80&w=2076&auto=format&fit=crop',
    slug: 'electronics',
  },
  {
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop',
    slug: 'home',
  },
  {
    name: 'Clothing',
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop',
    slug: 'clothing',
  }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // For demo, we'll use the sample products
        // In a real app: const fetchedProducts = await getProducts();
        setProducts(sampleProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="hero-section h-[80vh]">
        <div className="hero-content flex flex-col justify-center px-8 lg:px-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Mid-Century Modern <br />
            Minimalist Design
          </h1>
          <p className="mb-8 max-w-md text-gray-200">
            Elevate your space with our curated collection of premium furniture and home accessories designed for modern living.
          </p>
          <div>
            <Link 
              href="/products/category/home" 
              className="bg-[#ff7043] hover:bg-[#e5593b] text-white px-6 py-3 rounded-md inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="h-full">
          <ImprovedImage
            src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop"
            alt="Modern living room with sofa and plants"
            className="h-full w-full object-cover"
            width={1200}
            height={800}
            priority
          />
        </div>
      </section>

      {/* Category Browsing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="section-title text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCategories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/products/category/${category.slug}`}
              className="group relative overflow-hidden rounded-lg h-64"
            >
              <ImprovedImage 
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={600}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-2xl font-medium text-white">{category.name}</h3>
                  <p className="text-white/80 group-hover:text-white mt-1 transition-all duration-300">
                    Shop Collection →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-[#ff7043] hover:text-[#e5593b] font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <ImprovedImage 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
                alt="Premium gray sofa"
                className="rounded-lg"
                width={800}
                height={600}
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Special Collection</h2>
              <p className="text-gray-600 mb-6">Discover our premium furniture collection designed for comfort and style. Handcrafted with sustainable materials and modern aesthetics.</p>
              <Link href="/products/category/home" className="bg-[#ff7043] hover:bg-[#e5593b] text-white px-6 py-3 rounded-md inline-block">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">Join Our Newsletter</h2>
            <p className="text-gray-300">Stay updated on new arrivals, special offers and exclusive discounts.</p>
          </div>
          <div className="md:w-1/3">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-l-md focus:outline-none"
                suppressHydrationWarning
              />
              <button
                type="button"
                className="bg-[#ff7043] hover:bg-[#e5593b] text-white px-4 py-3 rounded-r-md"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 