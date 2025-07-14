import ClientOnly from '@/components/ui/ClientOnly';
import AuthPageClient from '@/components/auth/AuthPageClient';

export default function AuthPage() {
  return (
    <ClientOnly>
      <AuthPageClient />
    </ClientOnly>
  );
}
