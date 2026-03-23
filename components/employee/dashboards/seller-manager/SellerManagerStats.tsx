'use client';

import { Users, Store, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface SellerManagerStatsProps {
  stats?: {
    totalSellers: number;
    activeSellers: number;
    pendingApprovals: number;
    suspendedSellers: number;
    totalStores: number;
    totalRevenue: number;
    platformCommission: number;
  };
}

export function SellerManagerStats({ stats }: SellerManagerStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total Sellers"
        value={stats.totalSellers}
        icon={Users}
        color="blue"
        subtitle={`${stats.activeSellers} active`}
      />
      <StatsCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        icon={Clock}
        color="yellow"
      />
      <StatsCard
        title="Total Stores"
        value={stats.totalStores}
        icon={Store}
        color="green"
      />
      <StatsCard
        title="Platform Revenue"
        value={`$${stats.platformCommission.toLocaleString()}`}
        icon={DollarSign}
        color="purple"
      />
    </div>
  );
}