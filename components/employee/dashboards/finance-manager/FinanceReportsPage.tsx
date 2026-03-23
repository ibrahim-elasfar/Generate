'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { FINANCE_MANAGER_STATS } from '@/graphql/employee/queries';

export function FinanceReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(FINANCE_MANAGER_STATS);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const reports = data?.financeManagerStats || {};

  const formatReports = () => {
    if (Array.isArray(reports)) return reports;
    return Object.entries(reports).map(([key, value]) => ({
      id: key,
      title: key.replace(/([A-Z])/g, ' $1').trim(),
      date: new Date().toISOString(),
      data: value
    }));
  };

  const reportList = formatReports();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="space-y-4">
        {reportList.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}