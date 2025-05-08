'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../lib/authContext';
import { getProducts, deleteProduct } from '../../../../lib/firebaseUtils';
import { Product } from '../../../../lib/types';
import ImprovedImage from '../../../../components/ImprovedImage';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingProduct, setIsDeletingProduct] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Filters and sorting
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Available categories
  const categories = ['electronics', 'clothing', 'accessories', 'home'];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  useEffect(() => {
    // If not loading and either no user or not admin, redirect to login
    if (!loading && (!user || !isAdmin)) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (user && isAdmin) {
        try {
          setIsLoading(true);
          const fetchedProducts = await getProducts();
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin]);

  // Apply filters, sorting, and pagination
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply stock filter
    if (stockFilter === 'outOfStock') {
      result = result.filter(product => product.stock === 0);
    } else if (stockFilter === 'lowStock') {
      result = result.filter(product => product.stock > 0 && product.stock <= 5);
    } else if (stockFilter === 'inStock') {
      result = result.filter(product => product.stock > 5);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let compareResult = 0;
      
      switch (sortBy) {
        case 'name':
          compareResult = a.name.localeCompare(b.name);
          break;
        case 'price':
          compareResult = a.price - b.price;
          break;
        case 'stock':
          compareResult = a.stock - b.stock;
          break;
        case 'category':
          compareResult = a.category.localeCompare(b.category);
          break;
        default:
          compareResult = 0;
      }
      
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, categoryFilter, stockFilter, searchQuery, sortBy, sortOrder]);

  const handleDeleteClick = (productId: string) => {
    setShowDeleteConfirm(productId);
  };

  const handleDeleteConfirm = async (productId: string) => {
    setIsDeletingProduct(productId);
    
    try {
      await deleteProduct(productId);
      
      // Update products list after deletion
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeletingProduct(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setStockFilter('all');
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading || !user || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Products
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            Manage your store products
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Stock filter */}
            <div>
              <label htmlFor="stock-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <select
                id="stock-filter"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              >
                <option value="all">All Stock Levels</option>
                <option value="inStock">In Stock (&gt;5)</option>
                <option value="lowStock">Low Stock (1-5)</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
            
            {/* Search filter */}
            <div>
              <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                id="search-filter"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product name or description"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700"
              />
            </div>
            
            {/* Sort options */}
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="mt-1 flex">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="category">Category</option>
                </select>
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {sortOrder === 'asc' ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-700">No products found matching your filters</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <ImprovedImage
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Link href={`/dashboard/products/${product.id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                            {product.name}
                          </Link>
                          <div className="text-xs text-gray-700 truncate max-w-xs">
                            {product.description.length > 70 
                              ? product.description.substring(0, 70) + '...' 
                              : product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Out of stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Low: {product.stock}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link 
                          href={`/products/${product.id}`}
                          className="text-gray-700 hover:text-gray-900"
                          target="_blank"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/dashboard/products/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeletingProduct === product.id}
                        >
                          {isDeletingProduct === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                      
                      {/* Delete confirmation popover */}
                      {showDeleteConfirm === product.id && (
                        <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-md p-4 border border-gray-200 max-w-xs">
                          <p className="text-sm text-gray-700 mb-3">
                            Are you sure you want to delete <strong>{product.name}</strong>?
                          </p>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleDeleteCancel}
                              className="text-xs py-1 px-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(product.id)}
                              className="text-xs py-1 px-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastProduct, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> products
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    // Show only 5 page buttons at a time
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    // Show ellipsis
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 