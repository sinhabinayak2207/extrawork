import AdminPanel from '@/components/admin/AdminPanel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Manage product images and content',
};

export default function AdminPage() {
  return <AdminPanel />;
}
