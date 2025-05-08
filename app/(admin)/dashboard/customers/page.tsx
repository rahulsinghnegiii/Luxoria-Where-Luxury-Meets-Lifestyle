'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Customer {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  createdAt: any;
  lastLogin?: any;
  orders?: number;
  totalSpent?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCustomers();
    }
  }, [user, isAdmin]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Enhanced logging to diagnose the issue
      console.log("Auth state:", { userId: user?.uid, email: user?.email, isAdmin });
      
      // Verify admin status directly from Firestore for extra safety
      if (user && db) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const isUserAdmin = userData.role === 'admin';
            
            console.log("Direct Firestore admin check:", { 
              uid: user.uid,
              firestoreRole: userData.role,
              isAdmin: isUserAdmin
            });
            
            // If the user is actually not an admin according to Firestore
            if (!isUserAdmin) {
              console.error("User is not an admin according to Firestore data");
              toast.error('Your account does not have admin privileges');
              router.push('/login?redirect=/dashboard');
              setLoading(false);
              return;
            }
          } else {
            console.error("User document doesn't exist in Firestore");
            toast.error('User profile not found');
            router.push('/login');
            setLoading(false);
            return;
          }
        } catch (adminCheckError) {
          console.error("Error verifying admin status:", adminCheckError);
        }
      }
      
      // Force a small delay to ensure auth state is fully processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Make sure the user is authenticated and an admin before making the request
      if (!user) {
        console.error("User not authenticated");
        toast.error('Please log in to access admin features');
        router.push('/login?redirect=/dashboard/customers');
        setLoading(false);
        return;
      }
      
      if (!isAdmin) {
        console.error("User is not an admin");
        toast.error('Admin privileges required');
        router.push('/dashboard');
        setLoading(false);
        return;
      }
      
      // Try to get all users with admin privileges forced
      try {
        console.log("Attempting to fetch all users...");
      const customersRef = collection(db, 'users');
      const q = query(customersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
        
        // Log success for debugging
        console.log(`Successfully fetched ${querySnapshot.size} users`);
      
      const customersData: Customer[] = [];
      
      querySnapshot.forEach((doc) => {
        customersData.push({
          id: doc.id,
          ...doc.data()
        } as Customer);
      });
      
      // Fetch order data to enrich customer information
      try {
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      
      const ordersByCustomer = new Map<string, { count: number, total: number }>();
      
      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        const userId = order.userId;
        
        if (userId) {
          const current = ordersByCustomer.get(userId) || { count: 0, total: 0 };
          current.count += 1;
          current.total += order.total || 0;
          ordersByCustomer.set(userId, current);
        }
      });
      
      // Add order data to customers
      for (const customer of customersData) {
        const orderData = ordersByCustomer.get(customer.uid);
        if (orderData) {
          customer.orders = orderData.count;
          customer.totalSpent = orderData.total;
        } else {
            customer.orders = 0;
            customer.totalSpent = 0;
          }
        }
      } catch (orderError) {
        console.error("Error fetching orders data:", orderError);
        // Continue with customers but without order data
        for (const customer of customersData) {
          customer.orders = 0;
          customer.totalSpent = 0;
        }
      }
      
      setCustomers(customersData);
        toast.success(`Loaded ${customersData.length} customer records`);
        
    } catch (error: any) {
        console.error("Error in main customers fetch:", error);
      
        // Enhanced error handling with more specific messages
      if (error.code === 'permission-denied') {
          console.error("Permission denied error details:", { 
            errorMessage: error.message,
            errorCode: error.code,
            userId: user?.uid,
            isAdminState: isAdmin
          });
          toast.error('Permission denied: Unable to access user data');
      } else {
          toast.error(`Error: ${error.message || 'Unknown error fetching customers'}`);
      }
      
      // Set empty customers list on error
        setCustomers([]);
      }
    } catch (outerError) {
      console.error("Outer error in fetchCustomers:", outerError);
      toast.error('An unexpected error occurred');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: any) => {
    try {
      if (!dateStr) return 'N/A';
      
      let date;
      if (typeof dateStr === 'string') {
        date = new Date(dateStr);
      } else if (dateStr instanceof Date) {
        date = dateStr;
      } else {
        return 'Invalid date';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.displayName?.toLowerCase().includes(searchLower) ||
      customer.role?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-700 mt-1">Manage your customer accounts</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Spent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {customer.photoURL ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={customer.photoURL}
                            alt={customer.displayName || 'User avatar'}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-medium text-lg">
                              {(customer.displayName || customer.email || '?').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.displayName || 'No name provided'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(customer.totalSpent || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {currentCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-700">
                    {searchTerm ? 'No customers match your search.' : 'No customers found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md mr-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show 5 pages max
              let pageNum;
              if (totalPages <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If near the start, show first 5 pages
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // If near the end, show last 5 pages
                pageNum = totalPages - 4 + i;
              } else {
                // Otherwise show current page and 2 pages before and after
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded-md mx-1 ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md ml-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 