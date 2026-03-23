'use client';

import { Clock, CheckCircle, XCircle, TrendingUp, Star, Calendar } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface AppReviewerStatsProps {
  stats?: {
    pendingReviews: number;
    reviewedToday: number;
    thisWeek: number;
    averageReviewTime: number;
    approvalRate: number;
    rejectionRate: number;
  };
}

export function AppReviewerStats({ stats }: AppReviewerStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Pending Reviews"
        value={stats.pendingReviews}
        icon={Clock}
        color="yellow"
      />
      <StatsCard
        title="Reviewed Today"
        value={stats.reviewedToday}
        icon={Calendar}
        color="blue"
      />
      <StatsCard
        title="This Week"
        value={stats.thisWeek}
        icon={TrendingUp}
        color="green"
      />
      <StatsCard
        title="Avg. Review Time"
        value={`${stats.averageReviewTime.toFixed(1)}m`}
        icon={Clock}
        color="purple"
      />
    </div>
  );
}