'use client';

import { Briefcase, CheckCircle, Clock, DollarSign, TrendingUp, Star } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface EmployeeStatsProps {
  stats?: {
    activeProjects: number;
    completedProjects: number;
    pendingBids: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    averageRating: number;
    successRate: number;
    hoursWorked: number;
  };
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Active Projects"
        value={stats.activeProjects}
        icon={Briefcase}
        color="blue"
        subtitle={`${stats.pendingBids} pending bids`}
      />
      <StatsCard
        title="Total Earnings"
        value={`$${stats.totalEarnings.toLocaleString()}`}
        icon={DollarSign}
        color="green"
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="This Month"
        value={`$${stats.thisMonthEarnings.toLocaleString()}`}
        icon={TrendingUp}
        color="purple"
      />
      <StatsCard
        title="Success Rate"
        value={`${stats.successRate}%`}
        icon={CheckCircle}
        color="yellow"
        subtitle={`${stats.hoursWorked} hours worked`}
      />
    </div>
  );
}