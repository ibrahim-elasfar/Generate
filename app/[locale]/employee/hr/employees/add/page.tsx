'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AddEmployeePage } from '@/components/employee/dashboards/hr/AddEmployeePage';
import { isHr } from '@/lib/auth-utils';

import { ADD_EMPLOYEE } from '@/graphql/employee/mutations';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AddEmployeePagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);

  

  

  const [mutate, { loading: mutationLoading }] = useMutation(ADD_EMPLOYEE);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/sign-in');
      return;
    }

    // التحقق من الصلاحية
    if (!isHr(session)) {
      router.push('/employee/dashboard');
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  if (status === 'loading' || loading ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session) return null;

  

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
    <AddEmployeePage 
      
      onSubmit={handleMutation}
      
    />
  );
}
