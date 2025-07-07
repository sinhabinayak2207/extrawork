"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '../../../components/layout/MainLayout';
import { useAuth } from '../../../context/AuthContext';
import { useCategories, Category } from '../../../context/CategoryContext';
import { logToSystem } from '../../../lib/logger';

// Interface for system log entries
interface SystemLogEntry {
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

// Interface for upload status tracking
interface UploadStatus {
  isUploading: boolean;
  error: string | null;
  success: boolean;
}

export default function CategoriesManagement() {
  const { categories, updateCategory } = useCategories();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<Record<string, UploadStatus>>({});
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  
  // Listen for system log events
  useEffect(() => {
    const handleSystemLog = (event: CustomEvent) => {
      const { message, level, timestamp } = event.detail;
      setSystemLogs(prev => [
        { message, level, timestamp },
        ...prev.slice(0, 19) // Keep only the last 20 logs
      ]);
    };
    
    // Add event listener
    window.addEventListener('systemLog', handleSystemLog as EventListener);
    
    // Add initial log
    setSystemLogs([{
      message: 'System log initialized',
      level: 'info',
      timestamp: new Date().toISOString()
    }]);
    
    return () => {
      window.removeEventListener('systemLog', handleSystemLog as EventListener);
    };
  }, []);

  // Handle authentication check with loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Debug mode - set to true to bypass admin check during development
  const DEBUG_BYPASS_ADMIN = true;
  
  useEffect(() => {
    // Give Firebase auth time to initialize
    const timer = setTimeout(() => {
      // Check if user is logged in
      if (user) {
        // In debug mode or if user is admin, allow access
        if (DEBUG_BYPASS_ADMIN || isAdmin) {
          setIsAuthorized(true);
          logToSystem('Admin access granted', 'success');
        } else {
          // Only redirect if we're sure the user is logged in but not an admin
          logToSystem(`Access denied: User ${user.email} is not an admin`, 'warning');
          router.push('/');
        }
      } else if (user === null && !isLoading) {
        // Only redirect if we're sure auth is complete and user is null
        logToSystem('Access denied: User is not logged in', 'warning');
        router.push('/');
      }
      
      setIsLoading(false);
    }, 2500); // Give more time for auth to initialize
    
    return () => clearTimeout(timer);
  }, [user, isAdmin, router, isLoading]);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle category selection
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId === "" ? null : categoryId);
  };

  // Handle image upload for a specific category directly from file input
  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    if (!e.target.files || e.target.files.length === 0) {
      logToSystem(`No file selected for category ${categoryId}`, 'error');
      return;
    }
    
    const file = e.target.files[0];
    
    try {
      // Update upload status
      setUploadStatus(prev => ({
        ...prev,
        [categoryId]: { isUploading: true, error: null, success: false }
      }));
      
      setLoading(true);
      logToSystem(`Uploading image for category ${categoryId}...`, 'info');
      
      // Import dynamically to avoid SSR issues
      logToSystem('Importing Cloudinary utilities...', 'info');
      const { replaceImage } = await import('../../../lib/cloudinary');
      
      // Upload image to Cloudinary
      logToSystem(`Uploading image to Cloudinary for category ${categoryId}...`, 'info');
      const uploadedImageUrl = await replaceImage(file, `categories/${categoryId}`);
      
      if (!uploadedImageUrl) {
        throw new Error('Cloudinary upload succeeded but returned an empty URL');
      }
      
      logToSystem(`Image uploaded successfully to Cloudinary: ${uploadedImageUrl}`, 'success');
      
      // Add cache-busting parameter to image URL
      const timestamp = new Date().getTime();
      const cachedImageUrl = `${uploadedImageUrl}?t=${timestamp}`;
      
      // Update category with new image URL
      await updateCategory(categoryId, { image: cachedImageUrl, imageUrl: cachedImageUrl });
      logToSystem(`Category ${categoryId} updated successfully with new image`, 'success');
      
      // Dispatch a custom event to notify other components
      const eventData = { 
        categoryId, 
        imageUrl: uploadedImageUrl,
        timestamp: new Date().getTime()
      };
      
      logToSystem('Dispatching categoryUpdated event...', 'info');
      const event = new CustomEvent('categoryUpdated', { 
        detail: eventData,
        bubbles: true
      });
      
      // Dispatch events in multiple ways to ensure all components receive them
      window.dispatchEvent(event);
      document.dispatchEvent(event);
      logToSystem('CategoryUpdated event dispatched', 'success');
      
      // Force refresh to show new image
      window.dispatchEvent(new CustomEvent('refreshCategories'));
      
      // Store the updated image URL in localStorage for persistence
      try {
        const categoryCache = JSON.parse(localStorage.getItem('categoryCache') || '{}');
        categoryCache[categoryId] = {
          image: cachedImageUrl,
          imageUrl: cachedImageUrl,
          timestamp
        };
        localStorage.setItem('categoryCache', JSON.stringify(categoryCache));
        logToSystem('Category image cached in localStorage', 'info');
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
      }
      
      // Update upload status
      setUploadStatus(prev => ({
        ...prev,
        [categoryId]: { isUploading: false, error: null, success: true }
      }));
      
      // Show success message
      alert(`Image for ${categories.find(c => c.id === categoryId)?.title || categoryId} updated successfully!`);
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      logToSystem(`Error uploading image: ${errorMessage}`, 'error');
      
      // Update upload status with error
      setUploadStatus(prev => ({
        ...prev,
        [categoryId]: { 
          isUploading: false, 
          error: errorMessage, 
          success: false 
        }
      }));
      
      alert(`Error uploading image: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Legacy form-based image upload function
  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      logToSystem('No file or category selected', 'error');
      return;
    }

    setLoading(true);
    logToSystem(`Uploading image for category ${selectedCategory}...`, 'info');

    try {
      // Import dynamically to avoid SSR issues
      logToSystem('Importing Cloudinary utilities...', 'info');
      const { replaceImage } = await import('../../../lib/cloudinary');
      
      // Upload image to Cloudinary
      logToSystem(`Uploading image to Cloudinary for category ${selectedCategory}...`, 'info');
      const uploadedImageUrl = await replaceImage(selectedFile, `categories/${selectedCategory}`);
      
      if (!uploadedImageUrl) {
        throw new Error('Cloudinary upload succeeded but returned an empty URL');
      }
      
      logToSystem(`Image uploaded successfully to Cloudinary: ${uploadedImageUrl}`, 'success');

      // Update category with new image URL
      await updateCategory(selectedCategory, { image: uploadedImageUrl, imageUrl: uploadedImageUrl });
      logToSystem(`Category ${selectedCategory} updated with new image`, 'success');

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedCategory(null);
      
      // Force refresh to show new image
      window.dispatchEvent(new CustomEvent('refreshCategories'));
      
      // Show success message
      alert(`Category image updated successfully!`);
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      logToSystem(`Error uploading image: ${errorMessage}`, 'error');
      alert(`Error uploading image: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Demo images for quick updates
  const demoImages: Record<string, string[]> = {
    rice: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmljZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1613758235402-745466bb7efe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJpY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    ],
    seeds: [
      'https://images.unsplash.com/photo-1603197788269-c97efd495481?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNlZWRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNlZWRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    ],
    oil: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2lsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG9pbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    ],
    'raw-polymers': [
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9seW1lcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1620283085439-39620a1e21c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhc3RpYyUyMHBlbGxldHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    ],
    'bromine-salt': [
      'https://images.unsplash.com/photo-1519049363456-39539c62a8ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1608500218890-c4f9019eef7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNhbHR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    ],
  };

  // For demo purposes, directly update the category with a sample image URL
  const handleDemoImageUpdate = async (categoryId: string, imageUrl: string) => {
    // Add cache-busting parameter to image URL
    const timestamp = new Date().getTime();
    const cachedImageUrl = `${imageUrl}?t=${timestamp}`;
    setLoading(true);
    logToSystem(`Starting demo image update for category ${categoryId}`, 'info');
    
    try {
      // Make sure we update both image and imageUrl fields
      logToSystem(`Setting image URL to: ${imageUrl.substring(0, 50)}...`, 'info');
      await updateCategory(categoryId, { imageUrl, image: imageUrl });
      
      // Force a re-render of the UI
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('categoryUpdated', {
          detail: { categoryId, updates: { imageUrl, image: imageUrl } }
        }));
      }, 100);
      
      logToSystem(`Successfully updated image for category ${categoryId}`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logToSystem(`Error updating category: ${errorMessage}`, 'error');
      console.error('Full error details:', error);
      alert(`Failed to update category image: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Loading admin panel...</h2>
          <p className="text-gray-500 mt-2">Verifying your credentials</p>
        </div>
      </MainLayout>
    );
  }

  // If not authorized and not loading, this will show briefly before redirect
  if (!isAuthorized && !isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-medium text-gray-700">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don't have permission to access this page</p>
          <p className="text-gray-500 mt-1">Redirecting to home page...</p>
        </div>
      </MainLayout>
    );
  }

  // Force refresh categories to ensure they're up to date
  const refreshCategories = () => {
    logToSystem('Manually refreshing categories', 'info');
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('refreshCategories'));
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
            <p className="mt-2 text-gray-600">Update category images for your B2B showcase.</p>
          </div>
          <button 
            onClick={refreshCategories}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Refresh Categories
          </button>
        </div>
        
        {/* System Log Display */}
        <div className="bg-gray-50 border rounded-lg mb-8">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">System Logs</h2>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              {showLogs ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showLogs && (
            <div className="p-4 max-h-60 overflow-y-auto">
              {systemLogs.length === 0 ? (
                <p className="text-gray-500 italic">No logs yet</p>
              ) : (
                <div className="space-y-2">
                  {systemLogs.map((log, index) => {
                    // Determine log color based on level
                    let bgColor = 'bg-gray-100';
                    let textColor = 'text-gray-800';
                    
                    switch(log.level) {
                      case 'success':
                        bgColor = 'bg-green-50';
                        textColor = 'text-green-800';
                        break;
                      case 'warning':
                        bgColor = 'bg-yellow-50';
                        textColor = 'text-yellow-800';
                        break;
                      case 'error':
                        bgColor = 'bg-red-50';
                        textColor = 'text-red-800';
                        break;
                      default:
                        bgColor = 'bg-blue-50';
                        textColor = 'text-blue-800';
                    }
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-2 rounded ${bgColor} ${textColor} text-sm`}
                      >
                        <span className="font-mono text-xs opacity-75">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="ml-2">{log.message}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Image Management - Direct Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Direct Category Image Upload</h2>
          <p className="text-gray-600 mb-6">
            Click on any category below to upload a new image directly from your device.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const status = uploadStatus[category.id] || { isUploading: false, error: null, success: false };
              
              return (
                <div 
                  key={category.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={category.imageUrl || '/placeholder-image.jpg'}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                    {status.isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="w-10 h-10 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{category.description?.substring(0, 60)}...</p>
                    
                    <div className="flex flex-col space-y-2">
                      {/* Direct file upload button */}
                      <div className="relative">
                        <input
                          type="file"
                          id={`file-upload-${category.id}`}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={(e) => handleCategoryImageUpload(e, category.id)}
                          disabled={status.isUploading}
                        />
                        <button
                          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${status.isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                          disabled={status.isUploading}
                        >
                          {status.isUploading ? 'Uploading...' : 'Upload New Image'}
                        </button>
                      </div>
                      
                      {/* Demo image quick update buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {demoImages[category.id]?.map((imageUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDemoImageUpdate(category.id, imageUrl)}
                            className="p-1 border rounded bg-gray-50 hover:bg-gray-100"
                            disabled={loading}
                            title="Quick update with demo image"
                          >
                            <div className="relative h-10 w-full">
                              <Image
                                src={imageUrl}
                                alt={`Demo ${idx+1}`}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Status messages */}
                      {status.success && (
                        <p className="text-green-600 text-sm mt-2">✓ Image updated successfully</p>
                      )}
                      {status.error && (
                        <p className="text-red-600 text-sm mt-2">✗ Error: {status.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legacy Form-based Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Form-based Image Upload</h2>
          <p className="text-gray-600 mb-6">
            Alternative method: Select a category and upload a new image using the form below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">1. Select a Category</h3>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
              >
                <option value="">-- Select a category --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-medium mb-3">2. Upload New Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      aria-label="Remove image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-500 mb-2">Drag and drop an image, or click to browse</p>
                  </>
                )}
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  {previewUrl ? 'Change Image' : 'Select Image'}
                </label>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedCategory || loading}
              className={`py-2 px-6 rounded-md shadow-sm text-white font-medium ${
                !selectedFile || !selectedCategory || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Uploading...' : 'Update Category Image'}
            </button>
          </div>
        </div>

        {/* Quick Demo Options */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Update Demo</h2>
          <p className="text-gray-600 mb-6">
            For demo purposes, you can quickly update category images with pre-selected options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 relative rounded overflow-hidden mr-3">
                    <Image
                      src={category.imageUrl || '/placeholder-image.jpg'}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{category.title}</h4>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Use demo images if available for this category */}
                  {(demoImages[category.slug as keyof typeof demoImages] || []).map((imageUrl, index) => (
                    <button
                      key={`${category.id}-demo-${index}`}
                      onClick={() => handleDemoImageUpdate(category.id, imageUrl)}
                      className="relative h-16 w-full rounded overflow-hidden border hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={imageUrl}
                          alt={`${category.title} option ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Option {index + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handleDemoImageUpdate(
                    category.id,
                    `https://source.unsplash.com/random/300x200?${category.title.toLowerCase()},product`
                  )}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Random {category.title} Image
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
