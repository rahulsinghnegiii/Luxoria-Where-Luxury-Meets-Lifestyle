'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is admin, redirect if not
  useEffect(() => {
    // Only proceed with the check if loading is complete
    if (!loading) {
      // Short delay to ensure auth state is fully processed
      const timer = setTimeout(() => {
        if (!user || !isAdmin) {
          toast.error('You need admin privileges to access this area');
          router.push('/');
        }
        setIsCheckingAuth(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, loading, router]);

  // Don't render anything while checking authentication
  if (loading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Only render the admin layout if the user is authenticated and is an admin
  if (!user || !isAdmin) {
    return null; // Return nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Navigation Bar */}
      <div className="lg:hidden bg-indigo-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-xl font-bold">
            Luxoria Admin
          </Link>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-indigo-800 text-white">
            <div className="p-4 flex justify-between items-center">
              <span className="text-xl font-bold">Luxoria Admin</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="px-2 py-4">
              <AdminNavLinks closeMobileMenu={() => setMobileMenuOpen(false)} />
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block bg-indigo-800 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
          <div className="p-4 flex items-center justify-between">
            {isSidebarOpen ? (
              <Link href="/dashboard" className="text-xl font-bold">
                Luxoria Admin
              </Link>
            ) : (
              <Link href="/dashboard" className="text-xl font-bold">
                L
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </button>
          </div>
          <nav className="px-2 py-4">
            <AdminNavLinks collapsed={!isSidebarOpen} />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

interface AdminNavLinksProps {
  collapsed?: boolean;
  closeMobileMenu?: () => void;
}

function AdminNavLinks({ collapsed = false, closeMobileMenu }: AdminNavLinksProps) {
  // Get current path to highlight active link
  const [activePath, setActivePath] = useState('');
  
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Products',
      path: '/dashboard/products',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: 'Add Product',
      path: '/dashboard/products/new',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      name: 'Orders',
      path: '/dashboard/orders',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: 'Customers',
      path: '/dashboard/customers',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      path: '/dashboard/settings',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Back to Store',
      path: '/',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      ),
    },
  ];

  return (
    <ul className="space-y-2">
      {navItems.map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            onClick={closeMobileMenu}
            className={`flex items-center p-2 rounded-md hover:bg-indigo-700 transition-colors ${
              activePath === item.path ? 'bg-indigo-700' : ''
            }`}
          >
            <span className="text-white">{item.icon}</span>
            {!collapsed && <span className="ml-3 text-white">{item.name}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
} 