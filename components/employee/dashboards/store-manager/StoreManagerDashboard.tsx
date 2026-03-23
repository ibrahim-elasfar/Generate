'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { STORE_MANAGER_STATS, PENDING_STORES, ACTIVE_STORES } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { StoreManagerStats } from './StoreManagerStats';
import { PendingStoresList } from './PendingStoresList';
import { ActiveStoresList } from './ActiveStoresList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { Store, CheckCircle, AlertCircle, BarChart, Tags } from 'lucide-react';

const storeManagerQuickActions = [
  { href: '/employee/store-manager/approvals', icon: CheckCircle, label: 'Review Stores', color: 'text-blue-500' },
  { href: '/employee/store-manager/categories', icon: Tags, label: 'Categories', color: 'text-green-500' },
  { href: '/employee/store-manager/analytics', icon: BarChart, label: 'Analytics', color: 'text-purple-500' },
  { href: '/employee/store-manager/suspended', icon: AlertCircle, label: 'Suspended', color: 'text-orange-500' },
];

export function StoreManagerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(STORE_MANAGER_STATS);
  const { data: pendingData, loading: pendingLoading } = useQuery(PENDING_STORES);
  const { data: activeData, loading: activeLoading } = useQuery(ACTIVE_STORES);

  if (statsLoading || pendingLoading || activeLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.storeManagerStats;
  const pendingStores = pendingData?.pendingStores || [];
  const activeStores = activeData?.activeStores || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Store Manager', department: 'Store Management', employeeId: 'STM001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Stores</TabsTrigger>
          <TabsTrigger value="active">Active Stores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StoreManagerStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <PendingStoresList stores={pendingStores.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={storeManagerQuickActions} title="Store Manager Actions" />
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <PendingStoresList stores={pendingStores} showAll />
        </TabsContent>

        <TabsContent value="active">
          <ActiveStoresList stores={activeStores} />
        </TabsContent>
      </Tabs>
    </div>
  );
}