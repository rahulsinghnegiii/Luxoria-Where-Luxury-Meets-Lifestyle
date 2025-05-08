'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getProductById, getProductsByCategory } from '../../../../lib/firebaseUtils';
import { useCart } from '../../../../lib/cartContext';
import { Product } from '../../../../lib/types';
import ProductCard from '../../../../components/ProductCard';
import FirebaseImage from '../../../../components/FirebaseImage';
import { toast } from 'react-hot-toast';

// Fallback product for loading states
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

// Generate realistic reviews based on the product
const generateProductReviews = (product: Product) => {
  // Base the number of reviews on the product's review count (or use a default)
  const reviewCount = product.reviews || 3;
  const limitedCount = Math.min(reviewCount, 5); // Display up to 5 reviews
  
  // Common positive descriptors for reviews
  const positiveDescriptors = [
    'excellent', 'amazing', 'fantastic', 'great', 'outstanding',
    'superb', 'perfect', 'wonderful', 'impressive', 'brilliant'
  ];
  
  // Product-specific positive aspects based on category
  const categorySpecificPraise = {
    'electronics': [
      'The battery life is phenomenal', 
      'Sound quality is crystal clear', 
      'Setup was straightforward', 
      'The build quality feels premium',
      'Performance exceeds expectations',
      'Interface is intuitive and responsive'
    ],
    'clothing': [
      'The fabric is so comfortable', 
      'Fits perfectly', 
      'The quality is excellent for the price', 
      'The color is exactly as shown',
      'Looks even better in person',
      'Washes well without losing shape'
    ],
    'accessories': [
      'Looks even better in person', 
      'Goes with everything', 
      'Very well made', 
      'Attention to detail is impressive',
      'Perfect size and weight',
      'High-quality materials used'
    ],
    'home': [
      'Complements my decor perfectly', 
      'Assembly was easy', 
      'Sturdy construction', 
      'The design is beautiful',
      'Practical and stylish',
      'Quality materials used throughout'
    ]
  };
  
  // Realistic names for reviewers
  const reviewerNames = [
    'Alex Johnson', 'Sarah Miller', 'James Wilson', 'Maria Garcia',
    'David Brown', 'Jennifer Lee', 'Michael Davis', 'Emma Thompson',
    'Robert Smith', 'Jessica Martin', 'Christopher White', 'Lisa Chen',
    'Daniel Rodriguez', 'Rachel Murphy', 'Thomas Anderson', 'Olivia Taylor'
  ];
  
  // Generate a realistic date within the last 6 months
  const generateRecentDate = () => {
    const now = new Date();
    const monthsAgo = Math.floor(Math.random() * 6);
    const daysAgo = Math.floor(Math.random() * 30);
    now.setMonth(now.getMonth() - monthsAgo);
    now.setDate(now.getDate() - daysAgo);
    return now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  // Generate reviews
  const reviews = [];
  
  for (let i = 0; i < limitedCount; i++) {
    const rating = i === 0 
      ? product.rating || Math.random() * 2 + 3 // First review close to product rating
      : Math.floor(Math.random() * 3) + 3; // Other reviews between 3-5 stars
    
    // Select category-specific praise or fall back to generic
    const specificPraise = categorySpecificPraise[product.category] || 
                           categorySpecificPraise['electronics'];
    
    let comment = '';
    
    if (rating >= 4) {
      // Positive review
      const descriptor = positiveDescriptors[Math.floor(Math.random() * positiveDescriptors.length)];
      const praise = specificPraise[Math.floor(Math.random() * specificPraise.length)];
      comment = `${descriptor.charAt(0).toUpperCase() + descriptor.slice(1)} ${product.name}! ${praise}. Would definitely recommend.`;
    } else {
      // Average review
      comment = `Decent ${product.name}. ${specificPraise[Math.floor(Math.random() * specificPraise.length)]}. A few minor issues but overall satisfied.`;
    }
    
    reviews.push({
      id: `review-${i + 1}`,
      name: reviewerNames[Math.floor(Math.random() * reviewerNames.length)],
      rating,
      date: generateRecentDate(),
      comment,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
    });
  }
  
  return reviews;
};

// Generate technical specifications based on product category
const generateTechnicalSpecs = (product: Product) => {
  const specs = {};
  
  // Basic specs for all products
  specs['Product Name'] = product.name;
  specs['Brand'] = product.name.split(' ')[0]; // Just use the first word as brand for mock
  specs['Model'] = `${product.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000) + 100}`;
  
  // Category-specific specs
  switch (product.category) {
    case 'electronics':
      specs['Connectivity'] = Math.random() > 0.5 ? 'Wireless' : 'Wired';
      specs['Battery Life'] = `${Math.floor(Math.random() * 20) + 10} hours`;
      specs['Warranty'] = '1 year manufacturer warranty';
      specs['Power Source'] = Math.random() > 0.5 ? 'Rechargeable Battery' : 'USB-C';
      specs['Compatibility'] = 'iOS, Android, Windows';
      break;
      
    case 'clothing':
      specs['Material'] = 'Cotton, Polyester blend';
      specs['Care Instructions'] = 'Machine wash cold, tumble dry low';
      specs['Size'] = ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)];
      specs['Fit Type'] = Math.random() > 0.5 ? 'Regular Fit' : 'Slim Fit';
      specs['Country of Origin'] = ['USA', 'Italy', 'Vietnam', 'China'][Math.floor(Math.random() * 4)];
      break;
      
    case 'accessories':
      specs['Material'] = Math.random() > 0.5 ? 'Genuine Leather' : 'Premium Synthetic';
      specs['Dimensions'] = `${Math.floor(Math.random() * 5) + 5}″ × ${Math.floor(Math.random() * 3) + 3}″`;
      specs['Weight'] = `${(Math.random() * 0.5 + 0.1).toFixed(2)} lbs`;
      specs['Warranty'] = '30-day money back guarantee';
      break;
      
    case 'home':
      specs['Material'] = ['Solid Wood', 'Engineered Wood', 'Metal', 'Glass'][Math.floor(Math.random() * 4)];
      specs['Dimensions'] = `${Math.floor(Math.random() * 30) + 20}″ × ${Math.floor(Math.random() * 30) + 20}″ × ${Math.floor(Math.random() * 20) + 10}″`;
      specs['Weight'] = `${Math.floor(Math.random() * 20) + 5} lbs`;
      specs['Assembly Required'] = Math.random() > 0.5 ? 'Yes' : 'No';
      specs['Warranty'] = '2-year limited warranty';
      break;
      
    default:
      // Default specs for any other category
      specs['Material'] = 'Premium Quality';
      specs['Warranty'] = '1-year limited warranty';
  }
  
  return specs;
};

// Enhanced product description based on the product
const getEnhancedDescription = (product: Product) => {
  if (!product || !product.description) return '';
  
  // Start with the original description
  let description = product.description;
  
  // Add category-specific enhancements
  const categoryDescriptions = {
    'electronics': [
      `Experience the best in technology with the ${product.name}.`,
      `Designed with the modern user in mind, this product offers seamless integration with your digital lifestyle.`,
      `Whether at home or on the go, you'll appreciate the thoughtful design and attention to detail.`
    ],
    'clothing': [
      `Made with premium materials, the ${product.name} offers both style and comfort.`,
      `Perfect for any occasion, this versatile piece will quickly become a staple in your wardrobe.`,
      `The attention to detail and quality craftsmanship ensures long-lasting wear.`
    ],
    'accessories': [
      `Elevate your style with the ${product.name}.`,
      `Carefully crafted to complement your lifestyle, this accessory combines form and function.`,
      `A perfect balance of sophistication and practicality.`
    ],
    'home': [
      `Transform your living space with the ${product.name}.`,
      `Designed to combine aesthetics with functionality, this piece will enhance your home's ambiance.`,
      `Crafted from high-quality materials to ensure longevity and enduring style.`
    ]
  };
  
  // Get category-specific enhancements or use electronics as default
  const enhancements = categoryDescriptions[product.category] || categoryDescriptions['electronics'];
  
  // Combine original description with enhancements
  return `${description} ${enhancements.join(' ')}`;
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  
  const [product, setProduct] = useState<Product>(fallbackProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [technicalSpecs, setTechnicalSpecs] = useState({});
  const [enhancedDescription, setEnhancedDescription] = useState('');
  
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch the product from Firebase
        const fetchedProduct = await getProductById(productId);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          // Generate realistic reviews for this product
          setProductReviews(generateProductReviews(fetchedProduct));
          
          // Generate technical specifications
          setTechnicalSpecs(generateTechnicalSpecs(fetchedProduct));
          
          // Set enhanced description
          setEnhancedDescription(getEnhancedDescription(fetchedProduct));
          
          // Fetch related products based on category
          fetchRelatedProducts(fetchedProduct.category);
        } else {
          // Product not found
          console.error('Product not found');
          // Redirect to a 404 page
          router.push('/404');
        }
          
          setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
        // Redirect to 404 page or show error message
        router.push('/404');
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const fetchRelatedProducts = async (category: string) => {
    try {
      // Fetch products in the same category
      const products = await getProductsByCategory(category);
      
      // Filter out the current product and limit to 4 related products
      const related = products
        .filter(item => item.id !== productId)
        .slice(0, 4);
        
      setRelatedProducts(related);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Add item to cart
    addItem(product, quantity);
    
    // Show success toast
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
    
    // Reset adding state after animation completes
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 600);
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
  
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };
  
  const handleImageZoom = () => {
    setIsZoomed(!isZoomed);
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
          <div 
            className={`bg-gray-100 rounded-lg overflow-hidden mb-4 relative cursor-zoom-in ${isZoomed ? 'overflow-hidden' : ''}`}
            onMouseMove={handleImageMouseMove}
            onClick={handleImageZoom}
            style={{ height: '500px' }}
          >
            <div 
              className={`transition-transform duration-300 h-full ${isZoomed ? 'scale-150' : ''}`}
              style={
                isZoomed 
                  ? { 
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      height: '100%',
                      width: '100%',
                      position: 'relative'
                    } 
                  : {}
              }
            >
            <FirebaseImage 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-contain"
              width={600}
              height={600}
              priority
              fallbackText={product.name}
            />
            </div>
            
            {isZoomed && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-indigo-600 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <FirebaseImage 
                    src={image} 
                    alt={`${product.name} - view ${index + 1}`} 
                    className="w-full h-auto object-cover aspect-square"
                    width={100}
                    height={100}
                    fallbackText={`${product.name} ${index+1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
          
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
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
            )}
          </div>
          
          <div className="text-3xl font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</div>
          
          {/* Tabs for product information */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-2 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'description'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`py-2 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'specs'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`py-2 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'features'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews ({product.reviews || 0})
                </button>
              </nav>
            </div>
            
            <div className="mt-4 pt-2">
              {activeTab === 'description' && (
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-700">{enhancedDescription}</p>
                </div>
              )}
              
              {activeTab === 'specs' && (
                <div className="overflow-hidden bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(technicalSpecs).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">{key}</td>
                          <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div>
                  {product.features && product.features.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
                  ) : (
                    <p className="text-gray-500 italic">No feature information available for this product.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {productReviews.length > 0 ? (
                    productReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <img 
                              src={review.avatar} 
                              alt={review.name} 
                              className="h-10 w-10 rounded-full"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{review.name}</h4>
                            <div className="mt-1 flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No reviews yet for this product.</p>
                  )}
              </div>
            )}
            </div>
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
              disabled={product.stock === 0 || isAddingToCart}
              className={`relative w-full py-3 px-6 rounded-md font-medium text-white overflow-hidden transition-all duration-300 ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isAddingToCart
                  ? 'bg-green-600'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <span className={`transition-opacity duration-300 ${isAddingToCart ? 'opacity-0' : 'opacity-100'}`}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </span>
              
              {isAddingToCart && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2">Added to Cart</span>
                </span>
              )}
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
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
            <a href={`/products/category/${product.category}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 