import axios from 'axios';
import { logToSystem } from '@/components/SystemLog';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'doa53gfwf';
const CLOUDINARY_UPLOAD_PRESET = 'b2b_showcase'; // Your custom unsigned upload preset

/**
 * Uploads a PDF certificate to Cloudinary
 * @param file The PDF file to upload
 * @param folder The folder in Cloudinary where the file should be stored
 * @returns The URL of the uploaded PDF
 */
export const uploadCertificate = async (file: File, folder: string = 'certificates'): Promise<string> => {
  try {
    logToSystem('Starting Cloudinary certificate upload', 'info');
    logToSystem(`File: ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)`, 'info');
    
    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      throw new Error('Invalid file type. Only PDF and image files are allowed.');
    }
    
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
    
    // For PDFs, add transformation to convert to PNG for better compatibility
    if (file.type.includes('pdf')) {
      // Add transformation parameters to convert PDF to PNG
      formData.append('resource_type', 'auto');
      formData.append('format', 'png');
      formData.append('flags', 'attachment');
      formData.append('transformation', 'pg_1'); // Get first page of PDF
      
      logToSystem('Converting PDF to PNG for better compatibility', 'info');
    }
    
    // Determine resource type based on file type
    const resourceType = file.type.includes('pdf') ? 'auto' : 'image';
    
    // Upload to Cloudinary via the upload API
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData
    );
    
    logToSystem('Certificate upload successful!', 'success');
    
    // Return the secure URL of the uploaded file
    return response.data.secure_url;
  } catch (error) {
    logToSystem('Error uploading certificate to Cloudinary', 'error');
    
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data || {};
      logToSystem(`Cloudinary API error: ${JSON.stringify(errorDetails)}`, 'error');
    } else if (error instanceof Error) {
      logToSystem(`Error: ${error.message}`, 'error');
    }
    
    throw new Error('Failed to upload certificate');
  }
};
