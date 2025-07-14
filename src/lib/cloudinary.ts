import axios from 'axios';
import { logToSystem } from '@/components/SystemLog';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'doa53gfwf';
const CLOUDINARY_API_KEY = '117273964533914';
// IMPORTANT: Make sure you've created this exact preset name in your Cloudinary dashboard
// and set it to 'unsigned' mode
const CLOUDINARY_UPLOAD_PRESET = 'b2b_showcase'; // Your custom unsigned upload preset

/**
 * Generic file upload function for Cloudinary
 * @param file The file to upload
 * @param folder The folder in Cloudinary where the file should be stored
 * @param resourceType The type of resource ('image', 'raw', 'video', etc.)
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, folder: string, resourceType: string = 'raw'): Promise<string> => {
  try {
    logToSystem(`Starting Cloudinary ${resourceType} upload`, 'info');
    logToSystem(`File: ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)`, 'info');
    logToSystem(`Target folder: ${folder}`, 'info');
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Generate a unique ID for the file with timestamp to prevent caching
    const timestamp = new Date().getTime();
    const sanitizedFileName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
    const uniqueId = `${timestamp}_${sanitizedFileName}`;
    formData.append('public_id', uniqueId);
    
    // Upload to Cloudinary via the upload API
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData
    );
    
    logToSystem('Cloudinary upload successful!', 'success');
    
    // Return the secure URL of the uploaded file
    return response.data.secure_url;
  } catch (error) {
    logToSystem(`Error uploading ${resourceType} to Cloudinary`, 'error');
    
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data 
        ? JSON.stringify(error.response.data) 
        : error.message;
      
      logToSystem(`Axios error details: ${errorDetails}`, 'error');
    }
    
    console.error(`Error uploading ${resourceType} to Cloudinary:`, error);
    throw new Error(`Failed to upload ${resourceType}`);
  }
};

/**
 * Uploads an image to Cloudinary
 * @param file The file to upload
 * @param folder The folder in Cloudinary where the file should be stored
 * @returns The URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Upload to Cloudinary via the upload API
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    
    // Return the secure URL of the uploaded image
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Replaces an existing image with a new one
 * @param file The new file to upload
 * @param publicId The public ID of the existing image (optional)
 * @returns The URL of the new image
 */
export const replaceImage = async (file: File, folder: string): Promise<string> => {
  try {
    logToSystem('Starting Cloudinary image replacement', 'info');
    logToSystem(`File: ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)`, 'info');
    logToSystem(`Target folder: ${folder}`, 'info');
    
    // Generate a unique ID for the image with timestamp to prevent caching
    const timestamp = new Date().getTime();
    const sanitizedFileName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
    const uniqueId = `${timestamp}_${sanitizedFileName}`;
    logToSystem(`Generated unique ID: ${uniqueId}`, 'info');
    
    // Upload the new image with the unique ID
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('public_id', uniqueId);
    
    // Add cache-busting parameters
    formData.append('timestamp', timestamp.toString());
    
    logToSystem(`Uploading to Cloudinary with preset: ${CLOUDINARY_UPLOAD_PRESET}`, 'info');
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    
    if (!response.data || !response.data.secure_url) {
      throw new Error('Cloudinary response missing secure_url');
    }
    
    logToSystem('Cloudinary upload successful!', 'success');
    
    // Add a cache-busting query parameter to the URL
    const secureUrl = response.data.secure_url;
    const cacheBustedUrl = secureUrl.includes('?') 
      ? `${secureUrl}&t=${timestamp}` 
      : `${secureUrl}?t=${timestamp}`;
    
    logToSystem(`Image URL with cache-busting: ${cacheBustedUrl}`, 'info');
    
    return cacheBustedUrl;
  } catch (error) {
    logToSystem('Error replacing image in Cloudinary', 'error');
    
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data 
        ? JSON.stringify(error.response.data) 
        : error.message;
      
      logToSystem(`Axios error details: ${errorDetails}`, 'error');
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to replace image');
  }
};
