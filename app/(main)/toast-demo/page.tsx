'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import ToastDemo from '../../../components/ToastDemo';

export default function ToastDemoPage() {
  // Show a welcome toast when the page loads
  useEffect(() => {
    toast('Welcome to the Toast Demo page!');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Toast Notifications Demo</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About Toast Notifications</h2>
          <p className="text-gray-600 mb-4">
            Toast notifications provide a way to show non-intrusive messages to users.
            They appear temporarily and disappear automatically after a set time.
          </p>
          <p className="text-gray-600">
            The <code className="bg-gray-100 px-2 py-1 rounded">react-hot-toast</code> library
            makes it easy to implement toast notifications in your React application, with a 
            simple API and customizable styling.
          </p>
        </div>
        
        <ToastDemo />
        
        <div className="bg-white shadow rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
          <p className="text-gray-600 mb-4">
            Toast notifications are set up in the <code className="bg-gray-100 px-2 py-1 rounded">ClientProviders.tsx</code> component,
            which wraps the entire application and makes toast notifications available everywhere.
          </p>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import { Toaster } from 'react-hot-toast';

// Inside your provider component
<Toaster 
  position="top-right"
  toastOptions={{
    // Default options
  }}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
} 