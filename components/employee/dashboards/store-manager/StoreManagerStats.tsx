'use client';

import { Store, Package, ShoppingCart, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface StoreManagerStatsProps {
  stats?: {
    totalStores: number;
    activeStores: number;
    pendingApprovals: number;
    suspendedStores: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
}

export function StoreManagerStats({ stats }: StoreManagerStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total Stores"
        value={stats.totalStores}
        icon={Store}
        color="blue"
        subtitle={`${stats.activeStores} active`}
      />
      <StatsCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        icon={Clock}
        color="yellow"
      />
      <StatsCard
        title="Total Products"
        value={stats.totalProducts.toLocaleString()}
        icon={Package}
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