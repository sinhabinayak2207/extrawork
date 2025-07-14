"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

interface AdminAuthWrapperProps {
  children: ReactNode;
  requireMasterAdmin?: boolean;
}

export default function AdminAuthWrapper({ 
  children, 
  requireMasterAdmin = true 
}: AdminAuthWrapperProps) {
  const { user, isAdmin, isMasterAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication status after a short delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      if (!user) {
        console.log('User not authenticated, redirecting to home');
        router.push('/');
        return;
      }

      if (requireMasterAdmin && !isMasterAdmin) {
        console.log('User not master admin, redirecting to home');
        router.push('/');
        return;
      }

      if (!requireMasterAdmin && !isAdmin && !isMasterAdmin) {
        console.log('User not admin, redirecting to home');
        router.push('/');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, isAdmin, isMasterAdmin, requireMasterAdmin, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-xl">Checking authentication...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!authorized) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 text-center">
            <p className="text-xl text-red-600">Access denied. You don't have permission to view this page.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return <>{children}</>;
}
