import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads an image to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage where the file should be stored
 * @returns The download URL of the uploaded file
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Replaces an existing image with a new one
 * @param file The new file to upload
 * @param path The path of the existing file to replace
 * @returns The download URL of the new file
 */
export const replaceImage = async (file: File, path: string): Promise<string> => {
  try {
    // Delete the existing image if it exists
    try {
      const existingRef = ref(storage, path);
      await deleteObject(existingRef);
    } catch (error) {
      // If the file doesn't exist, just continue with the upload
      console.log('No existing file found or error deleting:', error);
    }
    
    // Upload the new image
    return await uploadImage(file, path);
  } catch (error) {
    console.error('Error replacing image:', error);
    throw new Error('Failed to replace image');
  }
};
