"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useCategories, Category } from '@/context/CategoryContext';
import { logToSystem } from '@/lib/logger';
import SystemLog from '@/components/SystemLog';
import { uploadImage } from '@/lib/cloudinary';

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
    
    return () => {
      window.removeEventListener('systemLog', handleSystemLog as EventListener);
    };
  }, []);

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
  const handleDirectUpload = async (categoryId: string, file: File) => {
    try {
      // Set upload status to uploading
      setUploadStatus(prev => ({
        ...prev,
        [categoryId]: { isUploading: true, error: null, success: false }
      }));
      
      // Upload to Cloudinary with category folder
      const downloadURL = await uploadImage(file, `categories/${categoryId}`);
      
      // Log the new image URL
      logToSystem(`Uploaded image to Cloudinary: ${downloadURL}`, 'success');
      
      // Update category in Firestore with both image and imageUrl fields
      await updateCategory(categoryId, { image: downloadURL, imageUrl: downloadURL });
      
      // Log success
      logToSystem(`Updated image for category ${categoryId}`, 'success');
      
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
    }
  };

  // Handle demo image update (using URL instead of file)
  const handleDemoImageUpdate = async (categoryId: string, imageUrl: string) => {
    try {
      // Set upload status to uploading
      setUploadStatus(prev => ({
        ...prev,
        [categoryId]: { isUploading: true, error: null, success: false }
      }));
      
      // Update category in Firestore directly with URL - both image and imageUrl fields
      await updateCategory(categoryId, { image: imageUrl, imageUrl: imageUrl });
      
      // Log success
      logToSystem(`Updated image for category ${categoryId} with demo image`, 'success');
      
      // Update upload status
      setUploadStatus(prev => ({
        ...prev,
        [categoryId]: { isUploading: false, error: null, success: true }
      }));
      
      // Show success message
      alert(`Demo image for ${categories.find(c => c.id === categoryId)?.title || categoryId} updated successfully!`);
    } catch (error) {
      console.error('Error updating with demo image:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      logToSystem(`Error updating with demo image: ${errorMessage}`, 'error');
      
      // Update upload status with error
      setUploadStatus(prev => ({
        ...prev,
        [categoryId]: { 
          isUploading: false, 
          error: errorMessage, 
          success: false 
        }
      }));
      
      alert(`Error updating with demo image: ${errorMessage}`);
    }
  };

  // Handle main upload button click
  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) return;
    
    setLoading(true);
    
    try {
      // Upload to Cloudinary with category folder
      const downloadURL = await uploadImage(selectedFile, `categories/${selectedCategory}`);
      
      // Log the new image URL
      logToSystem(`Uploaded image to Cloudinary: ${downloadURL}`, 'success');
      
      // Update category in Firestore
      await updateCategory(selectedCategory, { imageUrl: downloadURL });
      
      // Log success
      logToSystem(`Updated image for category ${selectedCategory}`, 'success');
      
      // Reset form
      setSelectedFile(null);
      setSelectedCategory(null);
      setPreviewUrl(null);
      
      // Show success message
      alert('Category image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      logToSystem(`Error uploading image: ${errorMessage}`, 'error');
      alert(`Error uploading image: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Demo images for quick selection
  const demoImages = [
    'https://source.unsplash.com/featured/300x200?product',
    'https://source.unsplash.com/featured/300x200?retail',
    'https://source.unsplash.com/featured/300x200?store',
    'https://source.unsplash.com/featured/300x200?shop'
  ];

  return (
    <AdminAuthWrapper requireMasterAdmin={true}>
      <MainLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Categories Management
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Update category images and manage your catalog
            </p>
          </div>
          
          {/* Main Upload Form */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl text-black font-semibold mb-4">Update Category Image</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory || ""}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">-- Select a category --</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Preview */}
            {previewUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="relative h-48 w-full md:w-1/2 mx-auto rounded-md overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

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

         
          
          {/* System Log Component */}
          
        </div>
      </MainLayout>
    </AdminAuthWrapper>
  );
}
