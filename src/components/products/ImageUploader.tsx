"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { replaceImage } from '@/lib/cloudinary';

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
      console.log('No file selected');
      return;
    }
    
    const file = event.target.files[0];
    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    setIsUploading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Generate a folder path for Cloudinary
      const folder = `products/${productId}`;
      
      // Upload the image to Cloudinary
      console.log('Uploading image to Cloudinary:', folder);
      const downloadURL = await replaceImage(file, folder);
      console.log('Image uploaded successfully to Cloudinary, URL:', downloadURL);
      
      // Update the product in our global context which will also update Firebase
      if (productContext) {
        console.log('Updating product in Firestore with new image URL');
        const success = await productContext.updateProductImage(productId, downloadURL, user?.email || 'unknown');
        
        if (success) {
          console.log('Product successfully updated in Firestore and context');
          
          // Dispatch a custom event to notify other components
          const event = new CustomEvent('productUpdated', { detail: { productId, imageUrl: downloadURL } });
          window.dispatchEvent(event);
          console.log('Dispatched productUpdated event with new image URL');
          
          setSuccess(true);
        } else {
          console.error('Failed to update product in Firestore');
          setError('Failed to update product in database. Image was uploaded but not saved.');
        }
      } else {
        console.error('Product context is null, cannot update product');
        setError('Failed to update product: Context is not available');
      }
    } catch (error) {
      console.error('Error in image upload process:', error);
      setError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
