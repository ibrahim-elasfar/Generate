'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { APP_REVIEWER_STATS, PENDING_APP_REVIEWS, REVIEWED_APPS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { AppReviewerStats } from './AppReviewerStats';
import { PendingReviewsList } from './PendingReviewsList';
import { ReviewedAppsList } from './ReviewedAppsList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { CheckCircle, XCircle, Clock, BarChart, Star, Filter } from 'lucide-react';

const appReviewerQuickActions = [
  { href: '/employee/app-reviewer/pending', icon: Clock, label: 'Pending Reviews', color: 'text-blue-500' },
  { href: '/employee/app-reviewer/approved', icon: CheckCircle, label: 'Approved Apps', color: 'text-green-500' },
  { href: '/employee/app-reviewer/rejected', icon: XCircle, label: 'Rejected Apps', color: 'text-red-500' },
  { href: '/employee/app-reviewer/stats', icon: BarChart, label: 'Statistics', color: 'text-purple-500' },
];

export function AppReviewerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(APP_REVIEWER_STATS);
  const { data: pendingData, loading: pendingLoading } = useQuery(PENDING_APP_REVIEWS);
  const { data: reviewedData, loading: reviewedLoading } = useQuery(REVIEWED_APPS, {
    variables: { limit: 10 }
  });

  if (statsLoading || pendingLoading || reviewedLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.appReviewerStats;
  const pendingApps = pendingData?.pendingAppReviews || [];
  const reviewedApps = reviewedData?.reviewedApps || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'App Reviewer', department: 'App Review', employeeId: 'AR001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed Apps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AppReviewerStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <PendingReviewsList apps={pendingApps.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={appReviewerQuickActions} title="Reviewer Actions" />
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <PendingReviewsList apps={pendingApps} showAll />
        </TabsContent>

        <TabsContent value="reviewed">
          <ReviewedAppsList apps={reviewedApps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}