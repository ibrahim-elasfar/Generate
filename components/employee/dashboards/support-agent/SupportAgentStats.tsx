'use client';

import { MessageCircle, CheckCircle, Clock, TrendingUp, Users, Star } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface SupportAgentStatsProps {
  stats?: {
    openTickets: number;
    resolvedToday: number;
    averageResponseTime: number;
    customerSatisfaction: number;
  };
}

export function SupportAgentStats({ stats }: SupportAgentStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Open Tickets"
        value={stats.openTickets}
        icon={MessageCircle}
        color="yellow"
      />
      <StatsCard
        title="Resolved Today"
        value={stats.resolvedToday}
        icon={CheckCircle}
        color="green"
      />
      <StatsCard
        title="Avg Response"
        value={`${stats.averageResponseTime.toFixed(1)}m`}
        icon={Clock}
        color="blue"
      />
      <StatsCard
        title="Satisfaction"
        value={`${stats.customerSatisfaction.toFixed(1)}/5`}
        icon={Star}
        color="purple"
      />
    </div>
  );
}