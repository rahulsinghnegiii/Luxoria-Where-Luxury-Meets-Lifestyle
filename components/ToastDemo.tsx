'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * A demonstration component showing the different ways to use react-hot-toast.
 * This is for development and learning purposes.
 */
export default function ToastDemo() {
  const [customId, setCustomId] = useState<string | null>(null);

  const showSuccessToast = () => {
    toast.success('Success! Your action was completed.');
  };

  const showErrorToast = () => {
    toast.error('Error! Something went wrong.');
  };

  const showPromiseToast = () => {
    // Simulate an async operation
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Randomly succeed or fail for demo purposes
        if (Math.random() > 0.3) {
          resolve('Data loaded successfully!');
        } else {
          reject(new Error('Failed to load data'));
        }
      }, 2000);
    });

    toast.promise(promise, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.message}`,
    });
  };

  const showCustomToast = () => {
    const id = toast('Hello World', {
      icon: '👋',
      duration: 5000,
    });
    setCustomId(id);
  };

  const dismissCustomToast = () => {
    if (customId) {
      toast.dismiss(customId);
      setCustomId(null);
    }
  };

  const showPersistentToast = () => {
    toast('This toast will not auto-dismiss', {
      duration: Infinity,
      icon: '⚠️',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Toast Notifications Demo</h2>
      
      <div className="space-y-3">
        <button
          onClick={showSuccessToast}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={showErrorToast}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={showPromiseToast}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
        >
          Show Promise Toast
        </button>
        
        <button
          onClick={showCustomToast}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
        >
          Show Custom Toast
        </button>
        
        {customId && (
          <button
            onClick={dismissCustomToast}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
          >
            Dismiss Custom Toast
          </button>
        )}
        
        <button
          onClick={showPersistentToast}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition-colors"
        >
          Show Persistent Toast
        </button>
        
        <button
          onClick={() => toast.dismiss()}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded transition-colors"
        >
          Dismiss All Toasts
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>You can use this component as a reference for implementing toast notifications in your application.</p>
      </div>
    </div>
  );
} 