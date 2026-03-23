'use client';

import { Flag, CheckCircle, Clock, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface ContentModeratorStatsProps {
  stats?: {
    pendingReports: number;
    resolvedToday: number;
    thisWeek: number;
    averageResolutionTime: number;
  };
}

export function ContentModeratorStats({ stats }: ContentModeratorStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Pending Reports"
        value={stats.pendingReports}
        icon={Flag}
        color="yellow"
      />
      <StatsCard
        title="Resolved Today"
        value={stats.resolvedToday}
        icon={CheckCircle}
        color="green"
      />
      <StatsCard
        title="This Week"
        value={stats.thisWeek}
        icon={TrendingUp}
        color="blue"
      />
      <StatsCard
        title="Avg. Resolution"
        value={`${stats.averageResolutionTime.toFixed(1)}m`}
        icon={Clock}
        color="purple"
      />
    </div>
  );
}