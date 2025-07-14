"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import '@/styles/admin-form.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { useAchievements, Achievement } from '@/context/AchievementContext';
import { useAuth } from '@/context/AuthContext';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import SystemLog from '@/components/SystemLog';
import { logToSystem } from '@/lib/logger';
import { uploadImage } from '@/lib/cloudinary';
import { uploadCertificate } from '@/lib/certificate-upload';

// Interface for system log entries
interface SystemLogEntry {
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: Date;
}

// Interface for upload status tracking
interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error: boolean;
  success: boolean;
}

// Custom styles for form inputs
const formInputStyle = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";
const textareaStyle = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

export default function AchievementsManagement() {
  const { achievements, loading: contextLoading, addAchievement, updateAchievement, deleteAchievement } = useAchievements();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<Record<string, UploadStatus>>({});
  const { user, isAdmin, isMasterAdmin } = useAuth();
  const router = useRouter();
  
  // Initial form state
  const initialFormState = {
    id: '',
    year: new Date().getFullYear().toString(),
    title: '',
    description: '',
    certificateUrl: '',
    imageUrl: '',
    createdAt: undefined as Date | undefined,
    updatedAt: undefined as Date | undefined
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  
  // Listen for system log events
  useEffect(() => {
    const handleSystemLog = (event: CustomEvent) => {
      const { message, type } = event.detail;
      setSystemLogs(prev => [
        { message, type, timestamp: new Date() },
        ...prev.slice(0, 19) // Keep only the last 20 logs
      ]);
    };
    
    // Add event listener
    window.addEventListener('system-log', handleSystemLog as EventListener);
    
    // Add initial log
    logToSystem('Achievements Management loaded', 'info');
    
    return () => {
      window.removeEventListener('system-log', handleSystemLog as EventListener);
    };
  }, []);

  // Handle file selection for image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle file selection for PDF
  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedPdf(file);
    logToSystem(`PDF selected: ${file.name}`, 'info');
  };

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.year || !formData.title || !formData.description) {
      logToSystem('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    
    try {
      // Upload image if selected
      let imageUrl = formData.imageUrl || '';
      if (selectedFile) {
        setUploadStatus(prev => ({
          ...prev,
          image: { isUploading: true, progress: 0, error: false, success: false }
        }));
        
        const uploadResult = await uploadImage(selectedFile, 'achievements');
        imageUrl = uploadResult;
        
        setUploadStatus(prev => ({
          ...prev,
          image: { isUploading: false, progress: 100, error: false, success: true }
        }));
        
        logToSystem(`Image uploaded successfully: ${imageUrl}`, 'success');
      }

      // Upload PDF if selected
      let certificateUrl = formData.certificateUrl || '';
      if (selectedPdf) {
        setUploadStatus(prev => ({
          ...prev,
          pdf: { isUploading: true, progress: 0, error: false, success: false }
        }));
        
        // Use the new uploadCertificate function that supports both PDFs and images
        const uploadResult = await uploadCertificate(selectedPdf, 'certificates');
        certificateUrl = uploadResult;
        
        setUploadStatus(prev => ({
          ...prev,
          pdf: { isUploading: false, progress: 100, error: false, success: true }
        }));
        
        logToSystem(`Certificate uploaded successfully: ${certificateUrl}`, 'success');
      }

      if (formData.id) {
        // Update existing achievement
        await updateAchievement(formData.id, {
          year: formData.year,
          title: formData.title,
          description: formData.description,
          imageUrl,
          certificateUrl
        });
        logToSystem(`Achievement updated: ${formData.title}`, 'success');
      } else {
        // Add new achievement
        await addAchievement({
          year: formData.year,
          title: formData.title,
          description: formData.description,
          imageUrl,
          certificateUrl
        });
        logToSystem(`Achievement added: ${formData.title}`, 'success');
      }

      // Reset form
      setFormData(initialFormState);
      setSelectedFile(null);
      setSelectedPdf(null);
      setPreviewUrl(null);
      setIsEditing(false);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      logToSystem(`Error: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Edit an achievement
  const handleEdit = (achievement: Achievement) => {
    setFormData({
      id: achievement.id,
      year: achievement.year,
      title: achievement.title,
      description: achievement.description,
      certificateUrl: achievement.certificateUrl || '',
      imageUrl: achievement.imageUrl || '',
      createdAt: achievement.createdAt,
      updatedAt: achievement.updatedAt
    });
    setPreviewUrl(achievement.imageUrl || null);
    setIsEditing(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle delete achievement
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await deleteAchievement(id);
        logToSystem(`Achievement deleted successfully`, 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logToSystem(`Error deleting achievement: ${errorMessage}`, 'error');
      }
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedFile(null);
    setSelectedPdf(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  return (
    <AdminAuthWrapper requireMasterAdmin={true}>
      <MainLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Achievements Management
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Add, edit, and manage achievements and certifications
            </p>
          </div>
          
          {/* Achievement Form */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {isEditing ? 'Edit Achievement' : 'Add New Achievement'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.imageUrl && !previewUrl && (
                    <p className="text-sm text-gray-500 mt-1">Current image: {formData.imageUrl.split('/').pop()}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Certificate (PDF)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.certificateUrl && (
                    <p className="text-sm text-gray-500 mt-1">Current certificate: {formData.certificateUrl.split('/').pop()}</p>
                  )}
                </div>
              </div>
              
              {/* Preview */}
              {previewUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="relative h-48 w-full md:w-1/2 mx-auto rounded-md overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-2 px-4 border text-black border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-6 rounded-md shadow-sm text-white font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Saving...' : isEditing ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Achievements List */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Current Achievements
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {achievement.imageUrl && (
                    <div className="w-full md:w-1/4 bg-gray-100">
                      <div className="relative h-48 md:h-full">
                        <Image
                          src={achievement.imageUrl}
                          alt={achievement.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{achievement.title}</h3>
                        <p className="text-sm text-blue-600 font-semibold">{achievement.year}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(achievement)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(achievement.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{achievement.description}</p>
                    
                    {achievement.certificateUrl && (
                      <div className="mt-4">
                        <a
                          href={achievement.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View Certificate
                        </a>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Last updated: {achievement.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {achievements.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No achievements found. Add your first achievement using the form above.
                </div>
              )}
            </div>
          </div>
          
          {/* System Log Component */}
          {showLogs && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-700">System Logs</h3>
                <button
                  onClick={() => setShowLogs(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Hide
                </button>
              </div>
              <SystemLog maxEntries={20} />
            </div>
          )}
        </div>
      </MainLayout>
    </AdminAuthWrapper>
  );
}
