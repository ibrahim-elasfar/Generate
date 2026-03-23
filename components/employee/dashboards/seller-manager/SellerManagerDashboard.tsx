'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { SELLER_MANAGER_STATS, PENDING_SELLERS, ALL_STORES } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { SellerManagerStats } from './SellerManagerStats';
import { PendingSellersList } from './PendingSellersList';
import { StoresList } from './StoresList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { BarChart, CheckCircle, Store, Users } from 'lucide-react';

const sellerManagerQuickActions = [
  { href: '/employee/seller-manager/approvals', icon: CheckCircle, label: 'Review Pending', color: 'text-blue-500' },
  { href: '/employee/seller-manager/sellers', icon: Users, label: 'All Sellers', color: 'text-green-500' },
  { href: '/employee/seller-manager/stores', icon: Store, label: 'Manage Stores', color: 'text-purple-500' },
  { href: '/employee/seller-manager/reports', icon: BarChart, label: 'Reports', color: 'text-orange-500' },
];

export function SellerManagerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(SELLER_MANAGER_STATS);
  const { data: pendingData, loading: pendingLoading } = useQuery(PENDING_SELLERS);
  const { data: storesData, loading: storesLoading } = useQuery(ALL_STORES);

  if (statsLoading || pendingLoading || storesLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.sellerManagerStats;
  const pendingSellers = pendingData?.pendingSellers || [];
  const stores = storesData?.allStores || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Seller Manager', department: 'Seller Management', employeeId: 'SM001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SellerManagerStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <PendingSellersList sellers={pendingSellers.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={sellerManagerQuickActions} title="Seller Manager Actions" />
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <PendingSellersList sellers={pendingSellers} showAll />
        </TabsContent>

        <TabsContent value="stores">
          <StoresList stores={stores} />
        </TabsContent>
      </Tabs>
    </div>
  );
}