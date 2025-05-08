'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getProductById, getProductsByCategory } from '../../../../lib/firebaseUtils';
import { useCart } from '../../../../lib/cartContext';
import { Product } from '../../../../lib/types';
import ProductCard from '../../../../components/ProductCard';
import OptimizedImage from '../../../../components/OptimizedImage';

// Sample fallback product for demo/loading states
const fallbackProduct: Product = {
  id: '1',
  name: 'Product Name',
  description: 'Product description loading...',
  price: 0,
  images: ['https://placehold.co/600x400?text=Loading...'],
  category: '',
  stock: 0,
  createdAt: new Date().toISOString(),
};

export default function ProductDetailPage({ params }: { params: any }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  
  const [product, setProduct] = useState<Product>(fallbackProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from Firebase
        // const fetchedProduct = await getProductById(productId);
        
        // For demo purposes, we'll use a timeout and sample data
        setTimeout(() => {
          // Sample product data (this would come from Firebase in production)
          const sampleProduct: Product = {
            id: productId,
            name: 'Premium Wireless Headphones',
            description: 'High-quality noise-canceling wireless headphones with extended battery life and premium audio quality. Features include active noise cancellation, transparency mode, and up to 30 hours of battery life.',
            price: 249.99,
            images: [
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1974&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop',
            ],
            category: 'electronics',
            features: ['Noise cancellation', '30-hour battery life', 'Premium audio quality', 'Bluetooth 5.0', 'Built-in microphone'],
            rating: 4.8,
            reviews: 127,
            stock: 15,
            createdAt: new Date().toISOString(),
          };
          
          setProduct(sampleProduct);
          
          // Fetch related products based on category
          fetchRelatedProducts(sampleProduct.category);
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
        // Redirect to 404 page or show error message
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchRelatedProducts = async (category: string) => {
    try {
      // In a real implementation, this would fetch from Firebase
      // const products = await getProductsByCategory(category);
      
      // For demo purposes, we'll use sample data
      const sampleRelatedProducts: Product[] = [
        {
          id: '2',
          name: 'Ultra HD Smart TV',
          description: 'Crystal clear 4K resolution with smart features and voice control.',
          price: 799.99,
          images: [
            'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070&auto=format&fit=crop',
          ],
          category: 'electronics',
          rating: 4.6,
          reviews: 89,
          stock: 8,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Wireless Earbuds',
          description: 'True wireless earbuds with superior sound quality and long battery life.',
          price: 129.99,
          images: [
            'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=2070&auto=format&fit=crop',
          ],
          category: 'electronics',
          rating: 4.5,
          reviews: 42,
          stock: 23,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Smart Speaker',
          description: 'Voice-controlled smart speaker with premium sound and virtual assistant.',
          price: 179.99,
          images: [
            'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop',
          ],
          category: 'electronics',
          rating: 4.3,
          reviews: 56,
          stock: 19,
          createdAt: new Date().toISOString(),
        },
      ];
      
      // Filter out the current product
      setRelatedProducts(sampleRelatedProducts.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    // Show success message or open cart sidebar
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-gray-200 animate-pulse h-96 rounded-lg"></div>
          <div className="md:w-1/2">
            <div className="bg-gray-200 animate-pulse h-8 w-2/3 rounded mb-4"></div>
            <div className="bg-gray-200 animate-pulse h-6 w-1/3 rounded mb-6"></div>
            <div className="bg-gray-200 animate-pulse h-32 w-full rounded mb-4"></div>
            <div className="bg-gray-200 animate-pulse h-10 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <OptimizedImage 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-auto object-cover"
              width={600}
              height={600}
              priority
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <OptimizedImage 
                    src={image} 
                    alt={`${product.name} - view ${index + 1}`} 
                    className="w-full h-auto object-cover"
                    width={150}
                    height={150}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            {product.rating && (
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-5 w-5 ${
                      product.rating! > rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}
          </div>
          
          <div className="text-2xl font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{product.description}</p>
            
            {product.features && product.features.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={`p-2 rounded-full border ${
                    quantity <= 1
                      ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-gray-700 font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className={`p-2 rounded-full border ${
                    quantity >= product.stock
                      ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {product.stock > 0 ? (
                  product.stock <= 5 ? (
                    <span className="text-orange-600">Only {product.stock} left in stock</span>
                  ) : (
                    <span>In Stock</span>
                  )
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 px-6 rounded-md font-medium text-white ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free shipping on orders over $100
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              30-day easy returns
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 