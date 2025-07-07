"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { replaceImage } from '@/lib/cloudinary';
import { logToSystem } from '@/components/SystemLog';

interface ImageUploaderProps {
  productId: string;
  currentImageUrl: string;
}

export default function ImageUploader({ productId, currentImageUrl }: ImageUploaderProps) {
  const { user, isMasterAdmin } = useAuth();
  const productContext = useProducts();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // If product context is not available, log error but don't return null yet
  // We'll check again in the upload handler
  if (!productContext) {
    console.error('ProductContext is null in ImageUploader');
  }
  
  // If user is not master admin, don't render anything
  if (!isMasterAdmin) {
    return null;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      logToSystem('No file selected for upload', 'error');
      return;
    }
    
    const file = event.target.files[0];
    logToSystem(`File selected: ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)`, 'info');
    
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    
    // Verify product context is available
    if (!productContext) {
      const errorMsg = 'ProductContext is null in ImageUploader - cannot proceed with upload';
      logToSystem(errorMsg, 'error');
      setError('Application error: Product context is not available');
      setIsUploading(false);
      return;
    }
    
    try {
      // Validate inputs
      if (!productId) {
        const errorMsg = 'Product ID is missing';
        logToSystem(errorMsg, 'error');
        throw new Error(errorMsg);
      }
      
      // Generate a folder path for Cloudinary
      const folder = `products/${productId}`;
      
      // Upload the image to Cloudinary
      logToSystem(`Uploading image to Cloudinary folder: ${folder}`, 'info');
      logToSystem(`File details: ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)`, 'info');
      
      // Add a timestamp to the file name to prevent caching issues
      const timestamp = new Date().getTime();
      const uniqueFileName = `${file.name.split('.')[0]}_${timestamp}.${file.name.split('.').pop()}`;
      logToSystem(`Using unique file name: ${uniqueFileName}`, 'info');
      
      const downloadURL = await replaceImage(file, folder);
      
      if (!downloadURL) {
        const errorMsg = 'Cloudinary upload succeeded but returned an empty URL';
        logToSystem(errorMsg, 'error');
        throw new Error(errorMsg);
      }
      
      logToSystem(`Image uploaded successfully to Cloudinary: ${downloadURL}`, 'success');
      
      // Add cache-busting parameter to the URL
      const imageUrlWithCache = downloadURL.includes('?') 
        ? `${downloadURL}&t=${timestamp}` 
        : `${downloadURL}?t=${timestamp}`;
      
      logToSystem(`Added cache-busting to image URL: ${imageUrlWithCache}`, 'info');
      
      // Update the product in our global context which will also update Firebase
      logToSystem(`Updating product ${productId} in Firestore with new image URL`, 'info');
      try {
        await productContext.updateProductImage(productId, imageUrlWithCache);
        
        logToSystem(`Product ${productId} successfully updated in Firestore and context`, 'success');
        
        // Dispatch a custom event to notify other components
        // This is critical for real-time UI updates across components
        const eventData = { 
          productId, 
          imageUrl: downloadURL,
          timestamp: new Date().getTime()
        };
        
        logToSystem('Dispatching productUpdated event', 'info');
        const event = new CustomEvent('productUpdated', { 
          detail: eventData,
          bubbles: true
        });
        
        window.dispatchEvent(event);
        document.dispatchEvent(event);
        
        logToSystem('ProductUpdated event dispatched', 'success');
        
        // Update UI state
        setIsUploading(false);
        setError(null);
        setSuccess(true);
        
        // Add a cache-busting parameter to the image URL
        const cacheBuster = `?t=${new Date().getTime()}`;
        logToSystem(`Added cache-busting parameter to image URL: ${cacheBuster}`, 'info');
      } catch (error) {
        const errorMsg = `Failed to update product ${productId} in Firestore: ${error instanceof Error ? error.message : 'Unknown error'}`;
        logToSystem(errorMsg, 'error');
        setIsUploading(false);
        setError('Failed to update product in database. Image was uploaded but not saved.');
      }
    } catch (error) {
      logToSystem('Error in image upload process', 'error');
      
      // Provide more detailed error messages based on the error type
      if (error instanceof Error) {
        logToSystem(`Error details: ${error.message}`, 'error');
        
        if (error.message.includes('not found')) {
          const errorMsg = `Product not found in database. Please refresh the page and try again.`;
          logToSystem(errorMsg, 'error');
          setError(errorMsg);
        } else if (error.message.includes('network')) {
          const errorMsg = `Network error. Please check your internet connection and try again.`;
          logToSystem(errorMsg, 'error');
          setError(errorMsg);
        } else {
          const errorMsg = `Failed to upload image: ${error.message}`;
          logToSystem(errorMsg, 'error');
          setError(errorMsg);
        }
      } else {
        const errorMsg = 'An unknown error occurred during the upload process';
        logToSystem(errorMsg, 'error');
        setError(errorMsg);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`flex items-center justify-center w-8 h-8 rounded-full ${isUploading ? 'bg-gray-300' : 'bg-blue-100 hover:bg-blue-200'} transition-colors`}
        disabled={isUploading}
        title="Upload new image"
      >
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <FiUpload className="text-blue-500" size={18} />
        )}
      </button>
      <input
        id={`image-upload-${productId}`}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading}
        className="hidden"
      />
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-2 text-sm">Image updated successfully!</p>}
    </div>
  );
}
