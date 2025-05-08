'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../lib/authContext';
import { getOrderById, updateOrderStatus } from '../../../../../lib/firebaseUtils';
import { Order, OrderItem } from '../../../../../lib/types';
import Link from 'next/link';
import ImprovedImage from '../../../../../components/ImprovedImage';
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

// Map status to badge colors
const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;
  
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState('');
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  
  // Available statuses for the dropdown
  const orderStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    // If not loading and either no user or not admin, redirect to login
    if (!loading && (!user || !isAdmin)) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (user && isAdmin && orderId) {
        try {
          setIsLoading(true);
          const orderData = await getOrderById(orderId);
          
          if (orderData) {
            setOrder(orderData);
            setNewStatus(orderData.status);
          } else {
            toast.error('Order not found');
            router.push('/dashboard/orders');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          toast.error('Failed to load order');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user && isAdmin && orderId) {
      fetchOrder();
    }
  }, [user, isAdmin, orderId, router]);

  const handleStatusUpdate = async () => {
    if (!order || order.status === newStatus) return;
    
    if (!window.confirm(`Are you sure you want to change the status from ${order.status} to ${newStatus}?`)) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update the order in state with the new status and additional information
      const updatedOrder = { 
        ...order, 
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      setOrder(updatedOrder);
      
      // Show success message
      toast.success('Order status updated successfully');
      
      // Display notification message if needed
      if (notifyCustomer) {
        toast.success('Customer has been notified about the status change');
      }
      
      // Clear the status note
      setStatusNote('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsSaving(false);
    }
  };

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Add a function to handle CSV export
  const handleExportCSV = () => {
    if (!order) return;
    
    // Create CSV content for the order
    const orderItems = order.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: (item.price * item.quantity).toFixed(2)
    }));
    
    // Convert order items to CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Order ID,Product ID,Product Name,Quantity,Price,Subtotal\r\n";
    
    // Add rows
    orderItems.forEach(item => {
      const row = [
        item.order_id,
        item.product_id,
        `"${item.product_name.replace(/"/g, '""')}"`, // Escape quotes in product names
        item.quantity,
        item.price,
        item.subtotal
      ];
      csvContent += row.join(",") + "\r\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `order-${order.id}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    
    toast.success('Order exported as CSV');
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-500 mb-6">The order you are looking for does not exist or has been removed.</p>
          <Link href="/dashboard/orders" className="text-indigo-600 hover:text-indigo-800">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Order {orderId.substring(0, 8)}...
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            Placed on {formatDate(order?.createdAt)}
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Orders
          </Link>
          
          {order && (
            <div className="relative inline-block text-left">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column: Order status and update - with enhancements */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Update Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4 text-gray-900"
              >
                <option value="">Select status</option>
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value} disabled={status.value === order.status}>
                    {status.label}
                  </option>
                ))}
              </select>
              
              <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700 mb-1">
                Add a note (optional)
              </label>
              <textarea
                id="statusNote"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4 text-gray-900 placeholder-gray-700"
                placeholder="Add a note about this status change"
              ></textarea>
              
              <div className="flex items-center mb-4">
                <input
                  id="notifyCustomer"
                  name="notifyCustomer"
                  type="checkbox"
                  checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyCustomer" className="ml-2 block text-sm text-gray-700">
                  Notify customer about this update
                </label>
              </div>
              
              <button
                onClick={handleStatusUpdate}
                disabled={order.status === newStatus || !newStatus || isSaving}
                className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Middle Column: Customer Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
          </div>
          <div className="p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Customer ID</h4>
            <p className="text-sm text-gray-900 mb-4">
              {order.userId}
            </p>
            
            {order.shippingAddress && (
              <>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Contact</h4>
                <p className="text-sm text-gray-900 mb-4">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.email}<br />
                  {order.shippingAddress.phone || 'No phone provided'}
                </p>
                
                <h4 className="text-sm font-medium text-gray-700 mb-1">Shipping Address</h4>
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Right Column: Payment Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Payment ID</h4>
                <p className="text-sm text-gray-900">
                  {order.paymentId || 'Not available'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Method</h4>
                <p className="text-sm text-gray-900">
                  {order.paymentMethod || 'Credit Card'}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between py-1">
                <p className="text-sm text-gray-700">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</p>
              </div>
              
              {order.shipping !== undefined && (
                <div className="flex justify-between py-1">
                  <p className="text-sm text-gray-700">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">${order.shipping.toFixed(2)}</p>
                </div>
              )}
              
              {order.tax !== undefined && (
                <div className="flex justify-between py-1">
                  <p className="text-sm text-gray-700">Tax</p>
                  <p className="text-sm font-medium text-gray-900">${order.tax.toFixed(2)}</p>
                </div>
              )}
              
              <div className="flex justify-between py-1 border-t border-gray-200 mt-2 pt-2">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Order Items ({getTotalItems(order.items)} items)
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {order.items.map((item, index) => (
            <div key={index} className="p-6 flex items-center">
              <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-6">
                {item.image ? (
                  <ImprovedImage
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-center object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      <Link href={`/products/${item.productId}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">
                      {item.productId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-gray-700">Qty: {item.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Order Timeline */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Order Timeline</h3>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {/* Order placed */}
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-700">Order placed</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-700">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              {/* Current status */}
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        order.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        {order.status === 'cancelled' ? (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-700">
                          Order {order.status}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-700">
                        {order.updatedAt ? formatDate(order.updatedAt) : 'No update time'}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 