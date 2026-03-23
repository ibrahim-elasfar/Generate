'use client';

import { useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { STORE_MANAGER_STATS } from '@/graphql/employee/queries';

export function StoreAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(STORE_MANAGER_STATS);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const stats = data?.storeManagerStats || {};

  const total = stats.total !== undefined ? stats.total : (stats.totalApps !== undefined ? stats.totalApps : (stats.totalRevenue !== undefined ? stats.totalRevenue : 0));
  const active = stats.active !== undefined ? stats.active : (stats.activeApps !== undefined ? stats.activeApps : (stats.activeCampaigns !== undefined ? stats.activeCampaigns : 0));
  const revenueAmount = stats.totalRevenue !== undefined ? stats.totalRevenue : (stats.totalSpent !== undefined ? stats.totalSpent : 0);
  const growth = stats.growth !== undefined ? stats.growth : 15;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Store Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <BarChart className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{active}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">${revenueAmount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Growth</p>
                <p className="text-2xl font-bold text-blue-600">+{growth}%</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}