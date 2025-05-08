'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/authContext';
import { getUserOrders } from '../../../lib/firebaseUtils';
import { Order } from '../../../lib/types';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import ImprovedImage from '../../../components/ImprovedImage';
import { toast } from 'react-hot-toast';

// Helper function to generate mock orders for demo
const generateMockOrders = (userId: string): Order[] => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const orderCount = Math.floor(Math.random() * 5) + 1; // 1-5 orders
  const mockOrders = [];
  
  for (let i = 0; i < orderCount; i++) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - (i * 7 + Math.floor(Math.random() * 10))); // Random past dates
    
    const order: Order = {
      id: `mock-order-${Date.now()}-${i}`,
      userId: userId,
      items: [
        {
          id: `item-${i}-1`,
          productId: `product-${i}-1`,
          name: `Product ${i+1}`,
          price: 19.99 + (i * 10),
          image: `https://placehold.co/400x300?text=Product+${i+1}`,
          quantity: 1 + Math.floor(Math.random() * 3)
        }
      ],
      total: (19.99 + (i * 10)) * (1 + Math.floor(Math.random() * 3)),
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US'
      },
      createdAt: orderDate.toISOString()
    };
    
    mockOrders.push(order);
  }
  
  return mockOrders;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Address fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  
  const [userSince, setUserSince] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }

    // Set display name from user data if available
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
    
    // Set user creation date
    if (user && user.metadata && user.metadata.creationTime) {
      const creationDate = new Date(user.metadata.creationTime);
      setUserSince(creationDate.toLocaleDateString());
    }
    
    // Fetch additional user data from Firestore
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set address info if available
            if (userData.address) {
              setAddress(userData.address.street || '');
              setCity(userData.address.city || '');
              setState(userData.address.state || '');
              setPostalCode(userData.address.postalCode || '');
              setCountry(userData.address.country || '');
            }
            if (userData.phone) {
              setPhone(userData.phone);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    if (user) {
      fetchUserData();
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          if (process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true') {
            // Generate mock orders for demo purposes
            setOrders(generateMockOrders(user.uid));
          } else {
            // Real Firestore fetching
            const userOrders = await getUserOrders(user.uid);
            if (userOrders && userOrders.length > 0) {
              setOrders(userOrders);
            } else {
              // Only use mock data when explicitly using mock services
              console.log('No orders found for user, leaving orders empty');
              setOrders([]);
            }
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          // Don't fallback to mock orders automatically
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true') {
        // Mock update for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        toast.success('Profile updated successfully!');
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
      } else if (auth.currentUser) {
        // Update the user's profile in Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: displayName
        });
        
        // Also update in Firestore for additional user data
        await setDoc(doc(db, 'users', user.uid), {
          displayName: displayName,
          email: user.email,
          address: {
            street: address,
            city,
            state,
            postalCode,
            country
          },
          phone,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        toast.success('Profile updated successfully!');
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
      setMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;
    
    // Validate password
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ 
        type: 'error', 
        text: 'New passwords do not match.'
      });
      return;
    }
    
    // Password too short - Firebase requires at least 6 characters
    if (newPassword.length < 6) {
      setPasswordMessage({ 
        type: 'error', 
        text: 'Password must be at least 6 characters long.'
      });
      return;
    }
    
    setIsChangingPassword(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true') {
        // Mock password change for demo
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        toast.success('Password changed successfully!');
        setPasswordMessage({ 
          type: 'success', 
          text: 'Password changed successfully!' 
        });
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        // Real Firebase password change workflow
        // First, reauthenticate the user
        const credential = EmailAuthProvider.credential(
          user.email as string,
          currentPassword
        );
        
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Then change their password
        await updatePassword(auth.currentUser, newPassword);
        
        toast.success('Password changed successfully!');
        setPasswordMessage({ 
          type: 'success', 
          text: 'Password changed successfully!' 
        });
        
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = 'Failed to change password. Please try again.';
      
      // More user-friendly error messages
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many unsuccessful attempts. Please try again later.';
      }
      
      toast.error(errorMessage);
      setPasswordMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Show loading state while fetching user data
  if (loading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-xl">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      
      {/* Profile tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 ${
              activeTab === 'profile'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 px-1 ${
              activeTab === 'security'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-1 ${
              activeTab === 'orders'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
        </nav>
      </div>
      
      {activeTab === 'profile' && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              
              <div className="mt-2 md:mt-0 text-sm text-gray-700">
                Member since: {userSince || 'N/A'}
              </div>
            </div>
            
            {message.text && (
              <div className={`mb-4 p-4 rounded ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-100 cursor-not-allowed w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700"
                    suppressHydrationWarning
                  />
                  <p className="mt-1 text-xs text-gray-700">Email cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Shipping Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
            
            {passwordMessage.text && (
              <div className={`mb-4 p-4 rounded ${
                passwordMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {passwordMessage.text}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-700">Password must be at least 6 characters long</p>
                </div>
                
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
            <p className="mt-1 text-sm text-gray-700">View the status of your recent orders.</p>
          </div>
          
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : orders.length > 0 ? (
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-700">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          <ImprovedImage
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-center object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-700">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-700">You haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}