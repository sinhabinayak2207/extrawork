"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Use our authentication context
  const { signInWithCredentials, signInWithGoogle, loading: isLoading, error: authError } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // For demo purposes, just check if email and password are not empty
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Use our authentication context to sign in
    await signInWithCredentials(email, password);
  };
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Welcome Back</h2>
      
      {(error || authError) && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-4">
          {error || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm text-gray-300">
              Password
            </label>
            <button
              type="button"
              className="text-xs text-[#2ea0f8] hover:text-blue-400"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white text-sm focus:outline-none focus:border-[#2ea0f8] focus:ring-1 focus:ring-[#2ea0f8]"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-[#2ea0f8] focus:ring-[#2ea0f8] border-[#30363d] rounded bg-[#0d1117]"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-300">
            Remember me
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 rounded bg-[#2ea0f8] hover:bg-blue-500 text-white font-medium text-sm transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center text-xs text-gray-400">
        <p className="my-2">Or continue with</p>
        
        <div className="mt-4 flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="bg-[#161b22] border border-[#30363d] text-white px-4 py-2 rounded-md flex items-center justify-center w-full hover:bg-[#30363d] transition-colors"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs">
        <p className="text-gray-400">
          Don't have an account? <button
            onClick={onSwitchToSignup}
            className="text-[#2ea0f8] hover:text-blue-400"
          >
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
