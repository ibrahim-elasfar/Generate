'use client';

import { Users, Code, AppWindow, TrendingUp, Clock, Award } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface DeveloperManagerStatsProps {
  stats?: {
    totalDevelopers: number;
    activeDevelopers: number;
    pendingApprovals: number;
    totalApps: number;
    appsInReview: number;
    teamPerformance: number;
  };
}

export function DeveloperManagerStats({ stats }: DeveloperManagerStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total Developers"
        value={stats.totalDevelopers}
        icon={Users}
        color="blue"
        subtitle={`${stats.activeDevelopers} active`}
      />
      <StatsCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        icon={Clock}
        color="yellow"
      />
      <StatsCard
        title="Total Apps"
        value={stats.totalApps}
        icon={AppWindow}
        color="green"
        subtitle={`${stats.appsInReview} in review`}
      />
      <StatsCard
        title="Team Performance"
        value={`${stats.teamPerformance}%`}
        icon={TrendingUp}
        color="purple"
      />
    </div>
  );
}