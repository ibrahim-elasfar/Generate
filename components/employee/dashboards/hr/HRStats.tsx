'use client';

import { Users, Briefcase, FileText, Calendar, UserCheck, TrendingUp } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface HRStatsProps {
  stats?: {
    totalEmployees: number;
    activeEmployees: number;
    openPositions: number;
    totalApplications: number;
    pendingApplications: number;
    scheduledInterviews: number;
    applicationsThisMonth: number;
    hiredThisMonth: number;
  };
}

export function HRStats({ stats }: HRStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total Employees"
        value={stats.totalEmployees}
        icon={Users}
        color="blue"
        subtitle={`${stats.activeEmployees} active`}
      />
      <StatsCard
        title="Open Positions"
        value={stats.openPositions}
        icon={Briefcase}
        color="green"
      />
      <StatsCard
        title="Applications"
        value={stats.totalApplications}
        icon={FileText}
        color="purple"
        subtitle={`${stats.pendingApplications} pending`}
      />
      <StatsCard
        title="Hired This Month"
        value={stats.hiredThisMonth}
        icon={UserCheck}
        color="orange"
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}