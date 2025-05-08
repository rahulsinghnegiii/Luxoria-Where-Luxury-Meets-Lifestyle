'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../lib/authContext';
import { addProduct, uploadProductImage, transformFirebaseStorageUrl } from '../../../../../lib/firebaseUtils';
import Link from 'next/link';
import ImprovedImage from '../../../../../components/ImprovedImage';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  // Product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('1');
  const [features, setFeatures] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Categories for dropdown
  const categories = [
    'electronics', 
    'clothing',  // Fashion category
    'accessories', 
    'home',      // Home & Garden
    'furniture',
    'kitchen',   // Kitchen & Home
    'beauty',
    'sports',
    'books'
  ];

  useEffect(() => {
    // If not loading and either no user or not admin, redirect to login
    if (!loading && (!user || !isAdmin)) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, isAdmin, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error message when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    switch (name) {
      case 'name': setName(value); break;
      case 'description': setDescription(value); break;
      case 'price': setPrice(value); break;
      case 'category': setCategory(value); break;
      case 'stock': setStock(value); break;
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const addFeatureField = () => {
    setFeatures([...features, '']);
  };

  const removeFeatureField = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
      
      // Create preview URLs for new images
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...newImages];
    const updatedPreviews = [...imagePreviews];
    
    // Release the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setNewImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    if (!stock.trim()) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (newImages.length === 0) {
      newErrors.images = 'At least one product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // First upload all images and get URLs
      const imageUrls: string[] = [];
      
      if (newImages.length > 0) {
        setImageUploading(true);
        
        // Upload each image sequentially and gather URLs
        for (const imageFile of newImages) {
          try {
            const imageUrl = await uploadProductImage(imageFile);
            
            // Transform the URL to ensure it works with direct downloads
            const safeUrl = transformFirebaseStorageUrl(imageUrl);
            imageUrls.push(safeUrl);
            
            toast.success(`Uploaded image: ${imageFile.name}`);
          } catch (uploadError) {
            console.error('Failed to upload an image:', uploadError);
            toast.error(`Failed to upload image: ${imageFile.name}`);
          }
        }
        
        setImageUploading(false);
      }
      
      if (imageUrls.length === 0) {
        throw new Error('No images were successfully uploaded');
      }
      
      // Create product with all data including image URLs
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        features: features.filter(f => f.trim() !== ''), // Remove empty features
        images: imageUrls,
        rating: 0, // Default rating for new product
        reviews: 0, // Default reviews count for new product
        createdAt: new Date().toISOString(),
      };
      
      const newProductId = await addProduct(productData);
      
      toast.success('Product created successfully');
      
      // Clear form and previews
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      setNewImages([]);
      setImagePreviews([]);
      
      // Redirect to the new product page or back to dashboard
      router.push(`/dashboard/products/${newProductId}`);
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <Link
          href="/dashboard"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={price}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'home' ? 'Home & Garden' : 
                       cat === 'kitchen' ? 'Kitchen & Home' : 
                       cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={stock}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">Features</h2>
              <button
                type="button"
                onClick={addFeatureField}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add Feature
              </button>
            </div>
            
            {features.map((feature, index) => (
              <div key={index} className="flex mb-3">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeFeatureField(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            
            {features.length === 0 && (
              <p className="text-sm text-gray-500">No features added yet. Click "Add Feature" to add product features.</p>
            )}
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Images</h2>
              <p className="text-sm text-gray-500">Add product images (up to 5). First image will be used as the main product image.</p>
              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            </div>
            
            {/* New image uploads */}
            <div>
              <div className="flex items-center mb-4">
                <label className="block">
                  <span className="sr-only">Choose images</span>
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100
                    "
                  />
                </label>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                        <img
                          src={preview}
                          alt={`New upload preview ${index + 1}`}
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard"
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving || imageUploading}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isSaving ? 'Creating...' : imageUploading ? 'Uploading Images...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
} 