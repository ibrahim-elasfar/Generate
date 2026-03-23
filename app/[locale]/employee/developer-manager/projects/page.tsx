'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DeveloperProjectsPage } from '@/components/employee/dashboards/developer-manager/DeveloperProjectsList';
import { isDeveloperManager } from '@/lib/auth-utils';
import { DEVELOPER_APPS } from '@/graphql/employee/queries';

import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DeveloperProjectsPagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);

  

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(DEVELOPER_APPS);

  

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/sign-in');
      return;
    }

    // التحقق من الصلاحية
    if (!isDeveloperManager(session)) {
      router.push('/employee/dashboard');
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  if (status === 'loading' || loading || queryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session) return null;

  
  if (queryError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load data: {queryError.message}</AlertDescription>
      </Alert>
    );
  }

  const handleMutation = async (variables) => {
    try {
      // No mutation defined
    } catch (error) {
      console.error('Mutation failed:', error);
      throw error;
    }
  };

  return (
    <DeveloperProjectsPage 
      data={queryData?.developerApps}
      
      
    />
  );
}
