"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Glass container */}
      <div className="max-w-md w-full mx-auto relative z-10">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl overflow-hidden border border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex border-b border-white/20">
            <button
              className={`w-1/2 py-4 text-center font-medium transition-all duration-300 ${activeTab === 'login' ? 'text-white border-b-2 border-blue-400' : 'text-white/70 hover:text-white'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-4 text-center font-medium transition-all duration-300 ${activeTab === 'signup' ? 'text-white border-b-2 border-blue-400' : 'text-white/70 hover:text-white'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
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
