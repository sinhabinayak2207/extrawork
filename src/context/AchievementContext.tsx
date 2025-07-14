"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logToSystem } from '@/lib/logger';
import { getAllAchievements, addAchievement as addFirebaseAchievement, updateAchievement as updateFirebaseAchievement, deleteAchievement as deleteFirebaseAchievement, FirebaseAchievement } from '@/lib/firebase-achievements';
import { db } from '@/lib/firebase-db';

// Achievement interface
export interface Achievement {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  certificateUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Context interface
interface AchievementContextType {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Achievement>;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<Achievement>;
  deleteAchievement: (id: string) => Promise<void>;
  getAchievementById: (id: string) => Achievement | undefined;
}

// Create context
const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Mock initial achievements data
const initialAchievements: Achievement[] = [
  {
    id: '1',
    year: '2024',
    title: "ISO 9001:2015 Certified",
    description: "Quality Management System Certification",
    imageUrl: "https://images.unsplash.com/photo-1584432810601-6c7a0b8f9b8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    certificateUrl: "https://example.com/certificate1.pdf",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    year: '2023',
    title: "Export Excellence Award",
    description: "Recognized for outstanding export performance",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    certificateUrl: "https://example.com/certificate2.pdf",
    createdAt: new Date('2023-06-22'),
    updatedAt: new Date('2023-06-22')
  },
  {
    id: '3',
    year: '2023',
    title: "Top Supplier Recognition",
    description: "Awarded by leading industry association",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    certificateUrl: "https://example.com/certificate3.pdf",
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05')
  },
  {
    id: '4',
    year: '2024',
    title: "Sustainability Certification",
    description: "For eco-friendly business practices",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    certificateUrl: "https://example.com/certificate4.pdf",
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  },
];

// Provider component
export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load achievements on mount
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true);
        logToSystem('Starting to load achievements from Firebase...', 'info');
        
        // Check if db is initialized
        if (!db) {
          logToSystem('Firebase DB not initialized, using initial data', 'error');
          setAchievements(initialAchievements);
          return;
        }
        
        // Get achievements from Firebase with explicit try/catch
        let firebaseAchievements;
        try {
          firebaseAchievements = await getAllAchievements();
          logToSystem(`Raw Firebase response received with ${firebaseAchievements.length} items`, 'info');
          
          // Debug log the raw data
          console.log('Raw Firebase achievements:', JSON.stringify(firebaseAchievements));
        } catch (fetchError) {
          const fetchErrorMsg = fetchError instanceof Error ? fetchError.message : 'Unknown Firebase fetch error';
          logToSystem(`Firebase fetch error: ${fetchErrorMsg}`, 'error');
          throw new Error(`Firebase fetch error: ${fetchErrorMsg}`);
        }
        
        // If no achievements found in Firebase, use initial data
        if (!firebaseAchievements || firebaseAchievements.length === 0) {
          logToSystem('No achievements found in Firebase, using initial data', 'info');
          setAchievements(initialAchievements);
        } else {
          // Map Firebase achievements to our Achievement interface
          try {
            const mappedAchievements: Achievement[] = firebaseAchievements.map(a => {
              // Debug log each achievement
              console.log(`Processing achievement: ${a.id}, title: ${a.title}`);
              
              return {
                id: a.id,
                year: a.year || new Date().getFullYear().toString(),
                title: a.title,
                description: a.description,
                imageUrl: a.imageUrl || '',
                certificateUrl: a.certificateUrl || '',
                createdAt: a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || Date.now()),
                updatedAt: a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt || Date.now())
              };
            });
            
            logToSystem(`Successfully mapped ${mappedAchievements.length} achievements from Firebase`, 'success');
            console.log('Mapped achievements:', mappedAchievements);
            
            // Update state with the mapped achievements
            setAchievements(mappedAchievements);
          } catch (mappingError) {
            const mappingErrorMsg = mappingError instanceof Error ? mappingError.message : 'Error mapping achievements';
            logToSystem(`Error mapping achievements: ${mappingErrorMsg}`, 'error');
            throw new Error(`Mapping error: ${mappingErrorMsg}`);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load achievements';
        setError(errorMessage);
        logToSystem(`Error loading achievements: ${errorMessage}`, 'error');
        console.error('Achievement loading error:', err);
        
        // Fallback to initial data if Firebase fails
        setAchievements(initialAchievements);
        logToSystem('Using initial achievement data as fallback', 'info');
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  // Add a new achievement
  const addAchievement = async (achievementData: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Achievement> => {
    try {
      logToSystem(`Adding achievement: ${achievementData.title}`, 'info');
      
      // Validate achievement data
      if (!achievementData.title || !achievementData.description) {
        const errorMsg = 'Achievement must have a title and description';
        logToSystem(errorMsg, 'error');
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Add achievement to Firebase with explicit try/catch
      let newId: string;
      try {
        newId = await addFirebaseAchievement(achievementData);
        logToSystem(`Firebase returned new achievement ID: ${newId}`, 'info');
        
        if (!newId) {
          throw new Error('Firebase returned an empty ID');
        }
      } catch (firebaseErr) {
        const errorMsg = firebaseErr instanceof Error ? firebaseErr.message : 'Firebase error adding achievement';
        logToSystem(`Firebase error: ${errorMsg}`, 'error');
        throw new Error(`Firebase error: ${errorMsg}`);
      }
      
      // Create new achievement with returned ID and timestamps
      const newAchievement: Achievement = {
        ...achievementData,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Update local state with functional update to ensure we're working with the latest state
      setAchievements(prevAchievements => {
        // Check if achievement with this ID already exists (shouldn't happen, but just in case)
        const existingIndex = prevAchievements.findIndex(a => a.id === newId);
        
        if (existingIndex >= 0) {
          // Replace existing achievement
          const updatedAchievements = [...prevAchievements];
          updatedAchievements[existingIndex] = newAchievement;
          return updatedAchievements;
        } else {
          // Add new achievement
          return [...prevAchievements, newAchievement];
        }
      });
      
      logToSystem(`Achievement added successfully: ${newAchievement.title} (ID: ${newId})`, 'success');
      return newAchievement;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add achievement';
      setError(errorMessage);
      logToSystem(`Error adding achievement: ${errorMessage}`, 'error');
      throw new Error(errorMessage);
    }
  };

  // Update an existing achievement
  const updateAchievement = async (id: string, achievementData: Partial<Achievement>): Promise<Achievement> => {
    try {
      // Find the achievement to update
      const achievementIndex = achievements.findIndex(a => a.id === id);
      if (achievementIndex === -1) {
        throw new Error(`Achievement with ID ${id} not found`);
      }

      // Create updated achievement
      const updatedAchievement: Achievement = {
        ...achievements[achievementIndex],
        ...achievementData,
        updatedAt: new Date()
      };

      // Update achievement in Firebase
      await updateFirebaseAchievement(id, achievementData);

      // Update local state
      const updatedAchievements = [...achievements];
      updatedAchievements[achievementIndex] = updatedAchievement;
      setAchievements(updatedAchievements);
      
      logToSystem(`Achievement updated: ${updatedAchievement.title}`, 'success');
      return updatedAchievement;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update achievement';
      setError(errorMessage);
      logToSystem(`Error updating achievement: ${errorMessage}`, 'error');
      throw new Error(errorMessage);
    }
  };

  // Delete an achievement
  const deleteAchievement = async (id: string): Promise<void> => {
    try {
      logToSystem(`Attempting to delete achievement with ID: ${id}`, 'info');
      
      // Validate ID
      if (!id) {
        const errorMsg = 'Achievement ID is required for deletion';
        logToSystem(errorMsg, 'error');
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Find the achievement to delete in current state
      const achievement = achievements.find(a => a.id === id);
      if (!achievement) {
        const errorMsg = `Achievement with ID ${id} not found in local state`;
        logToSystem(errorMsg, 'warning');
        // Continue with deletion attempt from Firebase anyway
      } else {
        logToSystem(`Found achievement to delete: ${achievement.title}`, 'info');
      }

      // Delete achievement from Firebase with explicit error handling
      try {
        await deleteFirebaseAchievement(id);
        logToSystem(`Firebase deletion successful for ID: ${id}`, 'info');
      } catch (firebaseErr) {
        const errorMsg = firebaseErr instanceof Error ? firebaseErr.message : 'Firebase error deleting achievement';
        logToSystem(`Firebase error: ${errorMsg}`, 'error');
        throw new Error(`Firebase error: ${errorMsg}`);
      }

      // Update local state with functional update to ensure we're working with the latest state
      setAchievements(prevAchievements => {
        const filteredAchievements = prevAchievements.filter(a => a.id !== id);
        
        // Log if no achievement was actually removed from state
        if (filteredAchievements.length === prevAchievements.length) {
          logToSystem(`Warning: No achievement with ID ${id} was found in state to remove`, 'warning');
        } else {
          const removedCount = prevAchievements.length - filteredAchievements.length;
          logToSystem(`Removed ${removedCount} achievement(s) from state with ID: ${id}`, 'info');
        }
        
        return filteredAchievements;
      });
      
      logToSystem(`Achievement deletion process completed for ID: ${id}`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete achievement';
      setError(errorMessage);
      logToSystem(`Error deleting achievement: ${errorMessage}`, 'error');
      throw new Error(errorMessage);
    }
  };

  // Get achievement by ID
  const getAchievementById = (id: string): Achievement | undefined => {
    return achievements.find(a => a.id === id);
  };

  // Context value
  const value: AchievementContextType = {
    achievements,
    loading,
    error,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementById
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};

// Custom hook for using the context
export const useAchievements = (): AchievementContextType => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};
