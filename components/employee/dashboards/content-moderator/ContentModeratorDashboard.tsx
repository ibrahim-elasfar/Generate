'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CONTENT_MODERATOR_STATS, PENDING_REPORTS, MODERATOR_ACTIONS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { ContentModeratorStats } from './ContentModeratorStats';
import { PendingReportsList } from './PendingReportsList';
import { ReportedContentList } from './ReportedContentList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { Flag, CheckCircle, AlertTriangle, Eye, Ban, Shield } from 'lucide-react';

const contentModeratorQuickActions = [
  { href: '/employee/content-moderator/pending', icon: Flag, label: 'Pending Reports', color: 'text-yellow-500' },
  { href: '/employee/content-moderator/reviewed', icon: CheckCircle, label: 'Reviewed', color: 'text-green-500' },
  { href: '/employee/content-moderator/flagged', icon: AlertTriangle, label: 'Flagged Content', color: 'text-red-500' },
  { href: '/employee/content-moderator/guidelines', icon: Shield, label: 'Guidelines', color: 'text-blue-500' },
];

export function ContentModeratorDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(CONTENT_MODERATOR_STATS);
  const { data: pendingData, loading: pendingLoading } = useQuery(PENDING_REPORTS);
  const { data: actionsData, loading: actionsLoading } = useQuery(MODERATOR_ACTIONS, {
    variables: { limit: 10 }
  });

  if (statsLoading || pendingLoading || actionsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.contentModeratorStats;
  const pendingReports = pendingData?.pendingReports || [];
  const recentActions = actionsData?.moderatorActions || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Content Moderator', department: 'Content Moderation', employeeId: 'CM001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Reports</TabsTrigger>
          <TabsTrigger value="reported">Reported Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ContentModeratorStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <PendingReportsList reports={pendingReports.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={contentModeratorQuickActions} title="Moderation Actions" />
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <PendingReportsList reports={pendingReports} showAll />
        </TabsContent>

        <TabsContent value="reported">
          <ReportedContentList actions={recentActions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}