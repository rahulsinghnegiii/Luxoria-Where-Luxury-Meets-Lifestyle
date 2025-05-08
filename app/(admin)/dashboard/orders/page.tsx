'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../lib/authContext';
import Link from 'next/link';
import { getAllOrders, updateOrderStatus, batchUpdateOrderStatus } from '../../../../lib/firebaseUtils';
import { Order } from '../../../../lib/types';
import { toast } from 'react-hot-toast';

// Format date to a readable string
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'No date available';
  
  const date = new Date(dateString);
  // Check if date is valid before formatting
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function AdminOrdersPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [batchStatus, setBatchStatus] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  // Statuses and their colors
  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    // If not loading and either no user or not admin, redirect to login
    if (!loading && (!user || !isAdmin)) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && isAdmin) {
        try {
          setIsLoading(true);
          const fetchedOrders = await getAllOrders();
          // Sort by date, newest first
          fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to load orders');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user && isAdmin) {
      fetchOrders();
    }
  }, [user, isAdmin]);

  // Apply filters when statusFilter or searchQuery changes
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.userId.toLowerCase().includes(query) ||
        (order.shippingAddress && order.shippingAddress.name?.toLowerCase().includes(query)) ||
        (order.shippingAddress && order.shippingAddress.email?.toLowerCase().includes(query))
      );
    }
    
    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      result = result.filter(order => new Date(order.createdAt) >= startDate);
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(order => new Date(order.createdAt) <= endDate);
    }
    
    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery, dateRange]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
      
      // Update the orders state with the new status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Order ${orderId.substring(0, 8)}... status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleBatchStatusChange = async () => {
    if (!batchStatus || selectedOrders.length === 0) {
      toast.error('Please select orders and a status to update');
      return;
    }

    setIsBatchUpdating(true);
    
    try {
      // Use the new batch update function for better performance
      await batchUpdateOrderStatus(selectedOrders, batchStatus);
      
      // Update the orders state with the new status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          selectedOrders.includes(order.id) 
            ? { ...order, status: batchStatus } 
            : order
        )
      );
      
      toast.success(`Updated ${selectedOrders.length} orders to ${batchStatus}`);
      setSelectedOrders([]);
      setBatchStatus('');
    } catch (error) {
      console.error('Error updating order statuses:', error);
      toast.error('Failed to update some orders');
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setSelectedOrders([]);
    setBatchStatus('');
  };

  const getStatusBadge = (status: string) => {
    const statusObj = orderStatuses.find(s => s.value === status) || 
      { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj.color}`}>
        {statusObj.label}
      </span>
    );
  };

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
            Orders Management
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            Manage and track customer orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-800 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              >
                <option value="all">All Statuses</option>
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Search filter */}
            <div>
              <label htmlFor="search-filter" className="block text-sm font-medium text-gray-800 mb-1">
                Search
              </label>
              <input
                id="search-filter"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order ID, Customer name or email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-700"
              />
            </div>
            
            {/* Date filter */}
            <div className="space-y-2">
              <div>
                <label htmlFor="date-from" className="block text-sm font-medium text-gray-800 mb-1">
                  From Date
                </label>
                <input
                  id="date-from"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="date-to" className="block text-sm font-medium text-gray-800 mb-1">
                  To Date
                </label>
                <input
                  id="date-to"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                />
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

      {/* Batch Update Panel - New addition */}
      {selectedOrders.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg mb-8 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-indigo-800 mr-4">
                {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
              </span>
              <select
                value={batchStatus}
                onChange={(e) => setBatchStatus(e.target.value)}
                className="block w-48 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mr-4 text-gray-900"
              >
                <option value="">Change status to...</option>
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBatchStatusChange}
                disabled={!batchStatus || isBatchUpdating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isBatchUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Orders'
                )}
              </button>
            </div>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Orders table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
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
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No orders found matching your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={selectedOrders.includes(order.id) ? "bg-indigo-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/dashboard/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                        {order.id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.shippingAddress?.name || 'N/A'}<br />
                      <span className="text-xs text-gray-600">{order.shippingAddress?.email || 'No email'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex space-x-3">
                        {updatingOrderId === order.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin h-4 w-4 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => {
                              if (window.confirm(`Are you sure you want to change the status to ${e.target.value}?`)) {
                                handleStatusChange(order.id, e.target.value);
                              }
                            }}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                          >
                            {orderStatuses.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        )}
                        <Link 
                          href={`/dashboard/orders/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Order statistics cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {orderStatuses.map((status) => {
          const count = orders.filter(order => order.status === status.value).length;
          return (
            <div key={status.value} className={`bg-white overflow-hidden shadow rounded-lg ${status.color.replace('text-', 'border-t-4 border-')}`}>
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-700 truncate">
                    {status.label} Orders
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {count}
                  </dd>
                </dl>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 