import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authContext';
import { useCart } from '../lib/cartContext';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              <span className="text-[#ff7043]">Luxoria</span>
            </Link>
          </div>
          
          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 px-1 py-1 text-sm font-medium border-b-2 border-transparent hover:border-[#ff7043]">
              Home
            </Link>
            <Link href="/products/category/electronics" className="text-gray-600 hover:text-gray-900 px-1 py-1 text-sm font-medium border-b-2 border-transparent hover:border-[#ff7043]">
              Electronics
            </Link>
            <Link href="/products/category/clothing" className="text-gray-600 hover:text-gray-900 px-1 py-1 text-sm font-medium border-b-2 border-transparent hover:border-[#ff7043]">
              Clothing
            </Link>
            <Link href="/products/category/home" className="text-gray-600 hover:text-gray-900 px-1 py-1 text-sm font-medium border-b-2 border-transparent hover:border-[#ff7043]">
              Home & Garden
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <span className="sr-only">View cart</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-[#ff7043] rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
                    {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      Signed in as<br /><span className="font-medium">{user.email}</span>
                    </div>
                    
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    
                    {isAdmin && (
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">
                  Sign in
                </Link>
                <Link href="/signup" className="bg-[#ff7043] hover:bg-[#e5593b] text-white px-3 py-2 rounded-md text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Home
          </Link>
          <Link href="/products/category/electronics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Electronics
          </Link>
          <Link href="/products/category/clothing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Clothing
          </Link>
          <Link href="/products/category/home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Home & Garden
          </Link>
        </div>
      </div>
    </nav>
  );
} 