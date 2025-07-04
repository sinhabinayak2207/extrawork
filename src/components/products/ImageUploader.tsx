"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { replaceImage } from '@/lib/firebase-storage';

interface ImageUploaderProps {
  productId: string;
  currentImageUrl: string;
}

export default function ImageUploader({ productId, currentImageUrl }: ImageUploaderProps) {
  const { user, isMasterAdmin } = useAuth();
  const productContext = useProducts();
  
  if (!productContext) {
    console.error('ProductContext is null in ImageUploader');
    return null;
  }
  
  const { updateProductImage } = productContext;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // If user is not master admin, don't render anything
  if (!isMasterAdmin) {
    return null;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // Only allow images
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Generate a unique path for the image in Firebase Storage
      const storagePath = `products/${productId}/${Date.now()}_${file.name}`;
      
      // Upload the image to Firebase Storage
      console.log('Uploading image to Firebase Storage:', storagePath);
      const downloadURL = await replaceImage(file, storagePath);
      console.log('Image uploaded successfully, URL:', downloadURL);
      
      // Update the product in our global context which will also update Firebase
      await updateProductImage(productId, downloadURL, user?.email || 'unknown');
      
      setSuccess(true);
      
      // Explicitly dispatch a product update event
      const event = new CustomEvent('productUpdated', { detail: { productId } });
      window.dispatchEvent(event);
      console.log('Dispatched productUpdated event from ImageUploader');
      
      // Don't reload the page, changes will be reflected immediately
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
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
