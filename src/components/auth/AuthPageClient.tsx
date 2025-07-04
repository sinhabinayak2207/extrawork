"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-[#0d1117] bg-opacity-95 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <motion.div 
          className="bg-[#161b22]/80 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-[#30363d]/80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex border-b border-[#30363d]">
            <button
              className={`w-1/2 py-3 text-center font-medium ${activeTab === 'login' ? 'text-white border-b-2 border-[#2ea0f8]' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-3 text-center font-medium ${activeTab === 'signup' ? 'text-white border-b-2 border-[#2ea0f8]' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div>
              {activeTab === 'login' ? (
                <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
              ) : (
                <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
