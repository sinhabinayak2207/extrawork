import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'doa53gfwf';
const CLOUDINARY_API_KEY = '117273964533914';
// IMPORTANT: Make sure you've created this exact preset name in your Cloudinary dashboard
// and set it to 'unsigned' mode
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // This is the default unsigned preset

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
    console.log('Starting Cloudinary image replacement');
    console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Folder:', folder);
    
    // Generate a unique ID for the image
    const uniqueId = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    console.log('Generated unique ID:', uniqueId);
    
    // Upload the new image with the unique ID
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('public_id', uniqueId);
    
    console.log('FormData created with upload_preset:', CLOUDINARY_UPLOAD_PRESET);
    console.log('Uploading to Cloudinary URL:', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    
    console.log('Cloudinary upload successful!');
    console.log('Response data:', response.data);
    console.log('Secure URL:', response.data.secure_url);
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Error replacing image in Cloudinary:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message);
    }
    throw new Error('Failed to replace image');
  }
};
