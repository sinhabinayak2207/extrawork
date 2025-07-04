"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { FcUpload } from 'react-icons/fc';

interface ImageUploaderProps {
  productId: string;
  currentImageUrl: string;
}

export default function ImageUploader({ productId, currentImageUrl }: ImageUploaderProps) {
  const { user, isMasterAdmin } = useAuth();
  const { updateProductImage } = useProducts();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If user is not master admin, don't render anything
  if (!isMasterAdmin) {
    return null;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(false);

      // For demo purposes, we'll just read the file as a data URL
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        
        // Update the product in our global context
        updateProductImage(productId, newImageUrl, user?.email || 'unknown');
        
        setSuccess(true);
        
        // Explicitly dispatch a product update event
        const event = new CustomEvent('productUpdated', { detail: { productId } });
        window.dispatchEvent(event);
        console.log('Dispatched productUpdated event from ImageUploader');
        
        // Don't reload the page, changes will be reflected immediately
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      };
      
      reader.readAsDataURL(file);
      return;

      // Success is now handled in the FileReader onload callback
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-2">
      <label 
        htmlFor={`image-upload-${productId}`}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
      >
        <FcUpload className="w-5 h-5" />
        {isUploading ? 'Uploading...' : 'Replace Image'}
      </label>
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
