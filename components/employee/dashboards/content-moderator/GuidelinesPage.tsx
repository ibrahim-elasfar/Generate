'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function GuidelinesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Moderation Guidelines</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Moderation Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Content Policy</h3>
            <p className="text-gray-600">All content must be appropriate and follow community standards...</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Prohibited Content</h3>
            <p className="text-gray-600">The following types of content are strictly prohibited...</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Action Guidelines</h3>
            <p className="text-gray-600">When taking action on reported content, follow these guidelines...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}