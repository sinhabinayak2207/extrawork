import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'doa53gfwf';
const CLOUDINARY_API_KEY = '117273964533914';
const CLOUDINARY_UPLOAD_PRESET = 'b2b_showcase'; // Create an unsigned upload preset in your Cloudinary dashboard

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
    // Generate a unique ID for the image
    const uniqueId = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload the new image with the unique ID
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('public_id', uniqueId);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Error replacing image in Cloudinary:', error);
    throw new Error('Failed to replace image');
  }
};
