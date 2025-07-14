import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, Timestamp, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase-db';

// Achievement interface
export interface FirebaseAchievement {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  certificateUrl?: string;
  createdAt: Date | any; // Support Firestore Timestamp
  updatedAt: Date | any; // Support Firestore Timestamp
}

/**
 * Helper function to convert Firestore document to Achievement object
 */
const convertDocToAchievement = (doc: QueryDocumentSnapshot): FirebaseAchievement => {
  const data = doc.data();
  
  // Convert Firestore Timestamp to Date
  const createdAt = data.createdAt instanceof Timestamp 
    ? data.createdAt.toDate() 
    : new Date(data.createdAt || Date.now());
  
  const updatedAt = data.updatedAt instanceof Timestamp 
    ? data.updatedAt.toDate() 
    : new Date(data.updatedAt || Date.now());
  
  return {
    id: doc.id,
    year: data.year || '',
    title: data.title || '',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    certificateUrl: data.certificateUrl || '',
    createdAt,
    updatedAt
  };
};

/**
 * Gets all achievements
 * @returns Array of achievements
 */
export const getAllAchievements = async (): Promise<FirebaseAchievement[]> => {
  try {
    console.log('Firebase DB: Fetching all achievements');
    
    // Verify database connection
    if (!db) {
      console.error('Firebase DB: Database connection not established');
      throw new Error('Database connection not established');
    }
    
    const achievementsRef = collection(db, 'achievements');
    const querySnapshot = await getDocs(achievementsRef);
    
    const achievements: FirebaseAchievement[] = [];
    
    querySnapshot.forEach((doc) => {
      achievements.push(convertDocToAchievement(doc));
    });
    
    console.log(`Firebase DB: Fetched ${achievements.length} achievements`);
    return achievements;
  } catch (error) {
    console.error('Firebase DB: Error getting all achievements:', error);
    throw new Error(`Failed to get all achievements: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Adds a new achievement
 * @param achievementData The achievement data to add
 * @returns The ID of the newly created achievement
 */
export const addAchievement = async (achievementData: Omit<FirebaseAchievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('Firebase DB: Adding new achievement', achievementData);
    
    // Verify database connection
    if (!db) {
      console.error('Firebase DB: Database connection not established');
      throw new Error('Database connection not established');
    }
    
    // Validate achievement data
    if (!achievementData.title || !achievementData.description) {
      console.error('Firebase DB: Invalid achievement data - missing title or description');
      throw new Error('Achievement must have a title and description');
    }
    
    const achievementsRef = collection(db, 'achievements');
    
    // Create a new document with auto-generated ID
    const newAchievementRef = doc(achievementsRef);
    
    // Prepare achievement data with timestamps
    const achievementWithTimestamps = {
      ...achievementData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add the achievement to Firestore with explicit error handling
    try {
      await setDoc(newAchievementRef, achievementWithTimestamps);
      console.log(`Firebase DB: Achievement added with ID: ${newAchievementRef.id}`);
    } catch (firestoreError) {
      console.error('Firebase DB: Firestore setDoc error:', firestoreError);
      throw new Error(`Firestore setDoc error: ${firestoreError instanceof Error ? firestoreError.message : 'Unknown error'}`);
    }
    
    // Verify the document was added by trying to read it back
    try {
      const docSnapshot = await getDoc(newAchievementRef);
      if (!docSnapshot.exists()) {
        console.error('Firebase DB: Achievement document not found after creation');
        throw new Error('Achievement document not found after creation');
      }
    } catch (verifyError) {
      console.error('Firebase DB: Error verifying new achievement:', verifyError);
      // Continue despite verification error - the document might still have been created
    }
    
    console.log(`Firebase DB: Achievement successfully added with ID: ${newAchievementRef.id}`);
    return newAchievementRef.id;
  } catch (error) {
    console.error('Firebase DB: Error adding achievement:', error);
    throw new Error(`Failed to add achievement: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Updates an existing achievement
 * @param achievementId The ID of the achievement to update
 * @param achievementData The achievement data to update
 */
export const updateAchievement = async (achievementId: string, achievementData: Partial<FirebaseAchievement>): Promise<void> => {
  try {
    console.log(`Firebase DB: Updating achievement ${achievementId}`, achievementData);
    
    // Verify database connection
    if (!db) {
      console.error('Firebase DB: Database connection not established');
      throw new Error('Database connection not established');
    }
    
    // Validate achievement ID
    if (!achievementId) {
      console.error('Firebase DB: Invalid achievement ID');
      throw new Error('Achievement ID is required');
    }
    
    const achievementRef = doc(db, 'achievements', achievementId);
    
    // Verify the document exists before updating
    try {
      const docSnapshot = await getDoc(achievementRef);
      if (!docSnapshot.exists()) {
        console.error(`Firebase DB: Achievement ${achievementId} not found`);
        throw new Error(`Achievement with ID ${achievementId} not found`);
      }
    } catch (verifyError) {
      console.error('Firebase DB: Error verifying achievement existence:', verifyError);
      throw new Error(`Error verifying achievement existence: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`);
    }
    
    // Add updated timestamp
    const updateData = {
      ...achievementData,
      updatedAt: Timestamp.now()
    };
    
    // Update the achievement in Firestore with explicit error handling
    try {
      await updateDoc(achievementRef, updateData);
      console.log(`Firebase DB: Achievement ${achievementId} updated successfully`);
    } catch (firestoreError) {
      console.error('Firebase DB: Firestore updateDoc error:', firestoreError);
      throw new Error(`Firestore updateDoc error: ${firestoreError instanceof Error ? firestoreError.message : 'Unknown error'}`);
    }
    
    // Verify the document was updated
    try {
      const updatedDoc = await getDoc(achievementRef);
      if (!updatedDoc.exists()) {
        console.error(`Firebase DB: Achievement ${achievementId} not found after update`);
      } else {
        console.log(`Firebase DB: Verified achievement ${achievementId} was updated successfully`);
      }
    } catch (verifyError) {
      console.error('Firebase DB: Error verifying achievement update:', verifyError);
      // Continue despite verification error
    }
  } catch (error) {
    console.error('Firebase DB: Error updating achievement:', error);
    throw new Error(`Failed to update achievement: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Deletes an achievement
 * @param achievementId The ID of the achievement to delete
 */
export const deleteAchievement = async (achievementId: string): Promise<void> => {
  try {
    console.log(`Firebase DB: Deleting achievement ${achievementId}`);
    
    // Verify database connection
    if (!db) {
      console.error('Firebase DB: Database connection not established');
      throw new Error('Database connection not established');
    }
    
    // Validate achievement ID
    if (!achievementId) {
      console.error('Firebase DB: Invalid achievement ID');
      throw new Error('Achievement ID is required');
    }
    
    const achievementRef = doc(db, 'achievements', achievementId);
    
    // Verify the document exists before deleting
    try {
      const docSnapshot = await getDoc(achievementRef);
      if (!docSnapshot.exists()) {
        console.error(`Firebase DB: Achievement ${achievementId} not found`);
        throw new Error(`Achievement with ID ${achievementId} not found`);
      }
    } catch (verifyError) {
      console.error('Firebase DB: Error verifying achievement existence:', verifyError);
      throw new Error(`Error verifying achievement existence: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`);
    }
    
    // Delete the achievement from Firestore with explicit error handling
    try {
      await deleteDoc(achievementRef);
      console.log(`Firebase DB: Achievement ${achievementId} deleted successfully`);
    } catch (firestoreError) {
      console.error('Firebase DB: Firestore deleteDoc error:', firestoreError);
      throw new Error(`Firestore deleteDoc error: ${firestoreError instanceof Error ? firestoreError.message : 'Unknown error'}`);
    }
    
    // Verify the document was deleted
    try {
      const docSnapshot = await getDoc(achievementRef);
      if (docSnapshot.exists()) {
        console.warn(`Firebase DB: Achievement ${achievementId} still exists after deletion attempt`);
      } else {
        console.log(`Firebase DB: Verified achievement ${achievementId} was deleted successfully`);
      }
    } catch (verifyError) {
      console.error('Firebase DB: Error verifying achievement deletion:', verifyError);
      // Continue despite verification error
    }
  } catch (error) {
    console.error('Firebase DB: Error deleting achievement:', error);
    throw new Error(`Failed to delete achievement: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
