'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { APP_MANAGER_STATS, PENDING_APPS, ALL_DEVELOPERS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { AppManagerStats } from './AppManagerStats';
import { PendingAppsList } from './PendingAppsList';
import { DevelopersList } from './DevelopersList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { BarChart, CheckCircle, Tags, Users } from 'lucide-react';

const appManagerQuickActions = [
  { href: '/employee/app-manager/reviews', icon: CheckCircle, label: 'Review Apps', color: 'text-blue-500' },
  { href: '/employee/app-manager/developers', icon: Users, label: 'Developers', color: 'text-green-500' },
  { href: '/employee/app-manager/analytics', icon: BarChart, label: 'Analytics', color: 'text-purple-500' },
  { href: '/employee/app-manager/categories', icon: Tags, label: 'Categories', color: 'text-orange-500' },
];

export function AppManagerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(APP_MANAGER_STATS);
  const { data: pendingData, loading: pendingLoading } = useQuery(PENDING_APPS);
  const { data: developersData, loading: devsLoading } = useQuery(ALL_DEVELOPERS);

  if (statsLoading || pendingLoading || devsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.appManagerStats;
  const pendingApps = pendingData?.pendingApps || [];
  const developers = developersData?.allDevelopers || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'App Manager', department: 'Application Management', employeeId: 'AM001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="developers">Developers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AppManagerStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <PendingAppsList apps={pendingApps.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={appManagerQuickActions} title="App Manager Actions" />
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <PendingAppsList apps={pendingApps} showAll />
        </TabsContent>

        <TabsContent value="developers">
          <DevelopersList developers={developers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}