'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../lib/authContext';
import { 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  uploadProductImage
} from '../../../../../lib/firebaseUtils';
import Link from 'next/link';
import FirebaseImage from '../../../../../components/FirebaseImage';
import { toast } from 'react-hot-toast';
import { getSafeImageUrl } from '../../../../../lib/cloudinaryUtils';

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

export default function EditProductPage({ params }: { params: { id: string } }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  
  // Product state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth
  useEffect(() => {
    if (user && !isLoading) {
      setLoading(false);
    }
  }, [user, isLoading]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const product = await getProductById(productId);
        if (product) {
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price.toString());
          setCategory(product.category);
          setStock(product.stock.toString());
          setFeatures(product.features || []);
          
          // Use the original image URLs since we're no longer using Firebase Storage
          setImages(product.images || []);
        } else {
          toast.error('Product not found');
          router.push('/dashboard/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        router.push('/dashboard/products');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    switch (name) {
      case 'name': setName(value); break;
      case 'description': setDescription(value); break;
      case 'price': setPrice(value); break;
      case 'category': setCategory(value); break;
      case 'stock': setStock(value); break;
    }
    
    // Clear error
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeatureField = () => {
    setFeatures([...features, '']);
  };

  const removeFeatureField = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    setNewImages([...newImages, ...fileArray]);
    
    // Create and store image previews
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // Remove preview and revoke object URL
    URL.revokeObjectURL(imagePreviews[index]);
    
    // Remove from arrays
    const newPreviews = [...imagePreviews];
    const newImageFiles = [...newImages];
    newPreviews.splice(index, 1);
    newImageFiles.splice(index, 1);
    
    setImagePreviews(newPreviews);
    setNewImages(newImageFiles);
  };

  const removeExistingImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    if (!stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (images.length === 0 && newImages.length === 0) {
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
      // First upload any new images
      let allImages = [...images];
      
      if (newImages.length > 0) {
        setImageUploading(true);
        
        // Upload each image sequentially and gather URLs
        for (const imageFile of newImages) {
          try {
            // Upload the image to Cloudinary 
            const imageUrl = await uploadProductImage(imageFile);
            
            // Add the image URL to our array
            allImages.push(imageUrl);
            toast.success(`Uploaded image: ${imageFile.name}`);
          } catch (uploadError) {
            console.error('Failed to upload an image:', uploadError);
            toast.error(`Failed to upload image: ${imageFile.name}`);
          }
        }
        
        setImageUploading(false);
      }
      
      // Update product with all data including new image URLs
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        features: features.filter(f => f.trim() !== ''), // Remove empty features
        images: allImages,
        updatedAt: new Date().toISOString(),
      };
      
      await updateProduct(productId, productData);
      
      toast.success('Product updated successfully');
      
      // Clear new images and previews
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      setNewImages([]);
      setImagePreviews([]);
      
      // Redirect back to dashboard
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    
    setIsDeleting(true);
    
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
          >
            Cancel
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-md"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-1">
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
                <label htmlFor="price" className="block text-sm font-medium text-gray-800 mb-1">
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-1">
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
                <label htmlFor="stock" className="block text-sm font-medium text-gray-800 mb-1">
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
            
            {/* Existing product images */}
            {images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                        <FirebaseImage
                          src={imageUrl}
                          alt={`Product image ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-cover object-center w-full h-full"
                          fallbackText={`Product ${index + 1}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New image uploads */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Add New Images</h3>
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
            {isSaving ? 'Saving...' : imageUploading ? 'Uploading Images...' : 'Save Changes'}
          </button>
        </div>
      </form>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 bg-white w-full max-w-md m-4 rounded-lg shadow-xl">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Delete Product</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 