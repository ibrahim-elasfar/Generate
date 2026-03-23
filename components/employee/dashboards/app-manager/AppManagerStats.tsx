'use client';

import { AppWindow, Download, DollarSign, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface AppManagerStatsProps {
  stats?: {
    totalApps: number;
    pendingReviews: number;
    approvedApps: number;
    rejectedApps: number;
    totalDevelopers: number;
    totalDownloads: number;
    totalRevenue: number;
  };
}

export function AppManagerStats({ stats }: AppManagerStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total Apps"
        value={stats.totalApps}
        icon={AppWindow}
        color="blue"
      />
      <StatsCard
        title="Pending Reviews"
        value={stats.pendingReviews}
        icon={Clock}
        color="yellow"
      />
      <StatsCard
        title="Total Downloads"
        value={stats.totalDownloads.toLocaleString()}
        icon={Download}
        color="green"
      />
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        color="purple"
      />
    </div>
  );
}