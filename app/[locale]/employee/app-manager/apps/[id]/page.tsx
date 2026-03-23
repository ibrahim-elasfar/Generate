'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
// import { AppDetailsPage } from '@/components/employee/dashboards/app-manager/AppDetails';
import { isAppManager } from '@/lib/auth-utils';
import { GET_APP } from '@/graphql/employee/queries';

import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { AppDetailsPage } from '@/components/employee/dashboards/app-manager/AppDetailsPage';

export default function AppDetailsPagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const id = params?.id as string;

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_APP, {
    variables: { id },
    skip: !id
  });

  

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/sign-in');
      return;
    }

    // التحقق من الصلاحية
    if (!isAppManager(session)) {
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
    <AppDetailsPage 
      data={queryData?.app}
      
      id={id}
    />
  );
}
