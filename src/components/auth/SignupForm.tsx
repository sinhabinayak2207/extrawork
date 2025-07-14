"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Use our authentication context
  const { signInWithGoogle } = useAuth();

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate step 1 fields
    if (!fullName || !email) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Proceed to step 2
    setStep(2);
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate step 2 fields
    if (!password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    // Submit the form
    setIsLoading(true);
    
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with their name
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      
      console.log('Signup successful', { fullName, email });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err: any) {
      // Handle Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please use a different email or try logging in.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">
        {step === 1 ? 'Create your account' : 'Set up your password'}
      </h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/30 text-red-400 p-3 rounded-lg mb-4 text-sm"
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={step === 1 ? handleSubmitStep1 : handleSubmitStep2} className="space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label htmlFor="fullName" className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white text-sm focus:outline-none focus:border-[#2ea0f8] focus:ring-1 focus:ring-[#2ea0f8]"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white text-sm focus:outline-none focus:border-[#2ea0f8] focus:ring-1 focus:ring-[#2ea0f8]"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm text-gray-300 mb-1">
                Company Name <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white text-sm focus:outline-none focus:border-[#2ea0f8] focus:ring-1 focus:ring-[#2ea0f8]"
                placeholder="Your Company"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-[#2ea0f8] hover:bg-blue-500 text-white font-medium text-sm transition-colors"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white text-sm focus:outline-none focus:border-[#2ea0f8] focus:ring-1 focus:ring-[#2ea0f8]"
                placeholder="••••••••"
                required
              />
              <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white text-sm focus:outline-none focus:border-[#2ea0f8] focus:ring-1 focus:ring-[#2ea0f8]"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 mt-1 text-[#2ea0f8] focus:ring-[#2ea0f8] border-[#30363d] rounded bg-[#0d1117]"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-gray-300">
                I agree to the <a href="#" className="text-[#2ea0f8] hover:text-blue-400">Terms of Service</a> and <a href="#" className="text-[#2ea0f8] hover:text-blue-400">Privacy Policy</a>
              </label>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/3 py-2 px-4 rounded text-sm font-medium border border-[#30363d] bg-[#0d1117] text-gray-300 hover:bg-[#1c2026] transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 py-2 px-4 rounded bg-[#2ea0f8] hover:bg-blue-500 text-white font-medium text-sm transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </>
        )}
      </form>
      
      <div className="mt-4 text-center text-xs">
        <p className="text-gray-400">
          Already have an account? <button
            onClick={onSwitchToLogin}
            className="text-[#2ea0f8] hover:text-blue-400"
          >
            Sign in
          </button>
        </p>
        
        {step === 1 && (
          <div className="mt-4 text-center text-xs text-gray-400">
            <p className="my-2">Or continue with</p>
            
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="flex items-center justify-center w-full py-2 px-4 border border-[#30363d] rounded bg-[#0d1117] text-sm text-gray-300 hover:bg-[#1c2026]"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Sign up with Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
