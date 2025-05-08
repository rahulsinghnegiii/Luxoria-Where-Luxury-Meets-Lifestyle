'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Luxoria',
    storeEmail: 'info@luxoria.example',
    supportEmail: 'support@luxoria.example',
    currency: 'USD',
    taxRate: '7.5',
    enableGuestCheckout: true,
    requireEmailVerification: false,
    enableReviews: true,
    showOutOfStock: true,
    itemsPerPage: '12',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockNotifications: true,
    customerSignupNotifications: false,
    reviewNotifications: true,
    marketingEmails: false,
  });
  
  const [smtpSettings, setSmtpSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'no-reply@luxoria.example',
    smtpPassword: '',
    smtpFromName: 'Luxoria Store',
    smtpFromEmail: 'no-reply@luxoria.example',
    useTLS: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setStoreSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSmtpSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setSmtpSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent, settingsType: string) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real application, you would save these settings to your database
      // For this demo, we'll just simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${settingsType} settings saved successfully`);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(`Failed to save ${settingsType} settings`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-700 mt-1">Configure your store settings</p>
      </div>
      
      {/* Settings Tabs */}
      <div className="mb-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            defaultValue="store"
          >
            <option value="store">Store Settings</option>
            <option value="notifications">Notification Settings</option>
            <option value="email">Email Settings</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="#store"
                className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Store Settings
              </a>
              <a
                href="#notifications"
                className="border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Notification Settings
              </a>
              <a
                href="#email"
                className="border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Email Settings
              </a>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Store Settings */}
      <section id="store" className="mb-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Store Settings</h2>
            <p className="mt-1 text-sm text-gray-700">
              Configure the basic settings for your store.
            </p>
          </div>
          
          <form onSubmit={(e) => handleSubmit(e, 'Store')} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  id="storeName"
                  value={storeSettings.storeName}
                  onChange={handleStoreSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
                  Store Email
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  id="storeEmail"
                  value={storeSettings.storeEmail}
                  onChange={handleStoreSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
                  Support Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  id="supportEmail"
                  value={storeSettings.supportEmail}
                  onChange={handleStoreSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={storeSettings.currency}
                  onChange={handleStoreSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="text"
                  name="taxRate"
                  id="taxRate"
                  value={storeSettings.taxRate}
                  onChange={handleStoreSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700">
                  Products Per Page
                </label>
                <input
                  type="number"
                  name="itemsPerPage"
                  id="itemsPerPage"
                  min="4"
                  max="100"
                  value={storeSettings.itemsPerPage}
                  onChange={handleStoreSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableGuestCheckout"
                    name="enableGuestCheckout"
                    type="checkbox"
                    checked={storeSettings.enableGuestCheckout}
                    onChange={handleStoreSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableGuestCheckout" className="font-medium text-gray-700">Enable Guest Checkout</label>
                  <p className="text-gray-700">Allow customers to check out without creating an account.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="requireEmailVerification"
                    name="requireEmailVerification"
                    type="checkbox"
                    checked={storeSettings.requireEmailVerification}
                    onChange={handleStoreSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="requireEmailVerification" className="font-medium text-gray-700">Require Email Verification</label>
                  <p className="text-gray-700">Require new customers to verify their email address before they can place an order.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableReviews"
                    name="enableReviews"
                    type="checkbox"
                    checked={storeSettings.enableReviews}
                    onChange={handleStoreSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableReviews" className="font-medium text-gray-700">Enable Product Reviews</label>
                  <p className="text-gray-700">Allow customers to leave reviews on products.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="showOutOfStock"
                    name="showOutOfStock"
                    type="checkbox"
                    checked={storeSettings.showOutOfStock}
                    onChange={handleStoreSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="showOutOfStock" className="font-medium text-gray-700">Show Out of Stock Products</label>
                  <p className="text-gray-700">Show products that are out of stock in product listings.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Notification Settings */}
      <section id="notifications" className="mb-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
            <p className="mt-1 text-sm text-gray-700">
              Configure which notifications you'd like to receive.
            </p>
          </div>
          
          <form onSubmit={(e) => handleSubmit(e, 'Notification')} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="orderNotifications"
                    name="orderNotifications"
                    type="checkbox"
                    checked={notificationSettings.orderNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="orderNotifications" className="font-medium text-gray-700">New Order Notifications</label>
                  <p className="text-gray-700">Receive an email notification when a new order is placed.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="lowStockNotifications"
                    name="lowStockNotifications"
                    type="checkbox"
                    checked={notificationSettings.lowStockNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="lowStockNotifications" className="font-medium text-gray-700">Low Stock Notifications</label>
                  <p className="text-gray-700">Receive an email notification when a product is running low on stock.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="customerSignupNotifications"
                    name="customerSignupNotifications"
                    type="checkbox"
                    checked={notificationSettings.customerSignupNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="customerSignupNotifications" className="font-medium text-gray-700">New Customer Notifications</label>
                  <p className="text-gray-700">Receive an email notification when a new customer signs up.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="reviewNotifications"
                    name="reviewNotifications"
                    type="checkbox"
                    checked={notificationSettings.reviewNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="reviewNotifications" className="font-medium text-gray-700">Review Notifications</label>
                  <p className="text-gray-700">Receive an email notification when a new product review is submitted.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingEmails"
                    name="marketingEmails"
                    type="checkbox"
                    checked={notificationSettings.marketingEmails}
                    onChange={handleNotificationSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing Emails</label>
                  <p className="text-gray-700">Receive emails about new features, offers, and updates.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Email Settings */}
      <section id="email" className="mb-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
            <p className="mt-1 text-sm text-gray-700">
              Configure your SMTP settings for sending emails.
            </p>
          </div>
          
          <form onSubmit={(e) => handleSubmit(e, 'Email')} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                  SMTP Host
                </label>
                <input
                  type="text"
                  name="smtpHost"
                  id="smtpHost"
                  value={smtpSettings.smtpHost}
                  onChange={handleSmtpSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="text"
                  name="smtpPort"
                  id="smtpPort"
                  value={smtpSettings.smtpPort}
                  onChange={handleSmtpSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700">
                  SMTP Username
                </label>
                <input
                  type="text"
                  name="smtpUser"
                  id="smtpUser"
                  value={smtpSettings.smtpUser}
                  onChange={handleSmtpSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                  SMTP Password
                </label>
                <input
                  type="password"
                  name="smtpPassword"
                  id="smtpPassword"
                  value={smtpSettings.smtpPassword}
                  onChange={handleSmtpSettingsChange}
                  placeholder="••••••••"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="smtpFromName" className="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input
                  type="text"
                  name="smtpFromName"
                  id="smtpFromName"
                  value={smtpSettings.smtpFromName}
                  onChange={handleSmtpSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="smtpFromEmail" className="block text-sm font-medium text-gray-700">
                  From Email
                </label>
                <input
                  type="email"
                  name="smtpFromEmail"
                  id="smtpFromEmail"
                  value={smtpSettings.smtpFromEmail}
                  onChange={handleSmtpSettingsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="useTLS"
                    name="useTLS"
                    type="checkbox"
                    checked={smtpSettings.useTLS}
                    onChange={handleSmtpSettingsChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="useTLS" className="font-medium text-gray-700">Use TLS</label>
                  <p className="text-gray-700">Enable TLS encryption for sending emails.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Test Connection
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
} 