'use client';

import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Percent } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface FinanceStatsProps {
  stats?: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingPayouts: number;
    processedPayouts: number;
    platformFees: number;
    taxCollected: number;
  };
}

export function FinanceStats({ stats }: FinanceStatsProps) {
  if (!stats) return null;

  const profitMargin = stats.totalRevenue > 0 
    ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Net Profit"
          value={`$${stats.netProfit.toLocaleString()}`}
          icon={TrendingUp}
          color="blue"
          subtitle={`${profitMargin}% margin`}
        />
        <StatsCard
          title="Pending Payouts"
          value={`$${stats.pendingPayouts.toLocaleString()}`}
          icon={Wallet}
          color="yellow"
        />
        <StatsCard
          title="Platform Fees"
          value={`$${stats.platformFees.toLocaleString()}`}
          icon={Percent}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Expenses</span>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.totalExpenses.toLocaleString()}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Processed Payouts</span>
            <CreditCard className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.processedPayouts.toLocaleString()}</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tax Collected</span>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.taxCollected.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}