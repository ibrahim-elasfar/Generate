'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ContentDetailsPage } from '@/components/employee/dashboards/content-moderator/ContentDetailsPage';
import { isContentModerator } from '@/lib/auth-utils';
import { PENDING_REPORTS } from '@/graphql/employee/queries';
import { RESOLVE_REPORT } from '@/graphql/employee/mutations';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ContentDetailsPagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const id = params?.id as string;

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(PENDING_REPORTS, {
    variables: { id },
    skip: !id
  });

  const [mutate, { loading: mutationLoading }] = useMutation(RESOLVE_REPORT);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/sign-in');
      return;
    }

    // التحقق من الصلاحية
    if (!isContentModerator(session)) {
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
      const result = await mutate({ variables });
      return result.data;
    } catch (error) {
      console.error('Mutation failed:', error);
      throw error;
    }
  };

  return (
    <ContentDetailsPage 
      data={queryData?.pendingReports}
      onSubmit={handleMutation}
      id={id}
    />
  );
}
