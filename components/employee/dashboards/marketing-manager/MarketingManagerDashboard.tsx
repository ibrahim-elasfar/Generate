'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MARKETING_MANAGER_STATS, ACTIVE_CAMPAIGNS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { MarketingStats } from './MarketingStats';
import { CampaignsList } from './CampaignsList';
import { AnalyticsReports } from './AnalyticsReports';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { Megaphone, BarChart, TrendingUp, Users, Target, Mail } from 'lucide-react';

const marketingManagerQuickActions = [
  { href: '/employee/marketing-manager/campaigns/new', icon: Megaphone, label: 'New Campaign', color: 'text-blue-500' },
  { href: '/employee/marketing-manager/analytics', icon: BarChart, label: 'Analytics', color: 'text-green-500' },
  { href: '/employee/marketing-manager/audience', icon: Users, label: 'Audience', color: 'text-purple-500' },
  { href: '/employee/marketing-manager/email', icon: Mail, label: 'Email Marketing', color: 'text-orange-500' },
];

export function MarketingManagerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(MARKETING_MANAGER_STATS);
  const { data: campaignsData, loading: campaignsLoading } = useQuery(ACTIVE_CAMPAIGNS);

  if (statsLoading || campaignsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.marketingManagerStats;
  const campaigns = campaignsData?.activeCampaigns || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Marketing Manager', department: 'Marketing', employeeId: 'MM001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <MarketingStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <CampaignsList campaigns={campaigns.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={marketingManagerQuickActions} title="Marketing Actions" />
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsList campaigns={campaigns} showAll />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsReports stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}