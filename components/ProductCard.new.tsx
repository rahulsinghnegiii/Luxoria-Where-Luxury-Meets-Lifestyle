import Link from 'next/link';
import { Product } from '../lib/types';
import { useCart } from '../lib/cartContext';
import { useState } from 'react';
import SimpleImage from './SimpleImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group relative card-shadow bg-white rounded-md overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full bg-gray-100 overflow-hidden aspect-square relative">
        <SimpleImage
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
          }`}
          width={300}
          height={300}
        />
        {product.images.length > 1 && (
          <SimpleImage
            src={product.images[1]}
            alt={`${product.name} - secondary view`}
            className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            width={300}
            height={300}
          />
        )}
        
        {/* Hover action button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-4 right-4 bg-[#ff7043] text-white py-2 px-3 rounded-full transition-all duration-300 shadow-md ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm text-gray-700 font-medium truncate">{product.name}</h3>
        <p className="mt-1 text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
        
        {product.rating && (
          <div className="mt-1 flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <svg
                  key={rating}
                  className={`h-3 w-3 ${
                    product.rating! > rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="ml-1 text-xs text-gray-500">({product.reviews})</p>
          </div>
        )}
        
        {product.stock <= 5 && product.stock > 0 && (
          <div className="mt-1">
            <p className="text-xs text-orange-600">Only {product.stock} left</p>
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="mt-1">
            <p className="text-xs text-red-600">Out of stock</p>
          </div>
        )}
      </div>
    </Link>
  );
} 