'use client';

import { Users, Briefcase, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface ManagerStatsProps {
  stats?: {
    teamSize: number;
    activeProjects: number;
    completedProjects: number;
    teamPerformance: number;
    pendingTasks: number;
    upcomingDeadlines: number;
    budgetUtilized: number;
    totalBudget: number;
  };
}

export function ManagerStats({ stats }: ManagerStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Team Size"
        value={stats.teamSize}
        icon={Users}
        color="blue"
      />
      <StatsCard
        title="Active Projects"
        value={stats.activeProjects}
        icon={Briefcase}
        color="green"
        subtitle={`${stats.completedProjects} completed`}
      />
      <StatsCard
        title="Team Performance"
        value={`${stats.teamPerformance}%`}
        icon={TrendingUp}
        color="purple"
      />
      <StatsCard
        title="Budget Utilization"
        value={`$${stats.budgetUtilized.toLocaleString()}`}
        icon={DollarSign}
        color="orange"
        subtitle={`of $${stats.totalBudget.toLocaleString()}`}
      />
    </div>
  );
}