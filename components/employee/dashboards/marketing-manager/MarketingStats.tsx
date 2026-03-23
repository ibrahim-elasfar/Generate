'use client';

import { Eye, MousePointerClick, TrendingUp, DollarSign, Percent, Target, Megaphone } from 'lucide-react';
import { StatsCard } from '../shared/StatsCard';

interface MarketingStatsProps {
  stats?: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalImpressions: number;
    totalClicks: number;
    conversionRate: number;
    totalSpent: number;
    totalRevenue: number;
    roi: number;
  };
}

export function MarketingStats({ stats }: MarketingStatsProps) {
  if (!stats) return null;

  const ctr = stats.totalImpressions > 0 
    ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          icon={Megaphone}
          color="blue"
          subtitle={`${stats.activeCampaigns} active`}
        />
        <StatsCard
          title="Total Impressions"
          value={stats.totalImpressions.toLocaleString()}
          icon={Eye}
          color="green"
        />
        <StatsCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={MousePointerClick}
          color="purple"
          subtitle={`CTR: ${ctr}%`}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon={Target}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Spent</span>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className={`rounded-lg p-4 ${
          stats.roi > 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">ROI</span>
            <Percent className={`h-4 w-4 ${
              stats.roi > 0 ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
          <p className={`text-2xl font-bold ${
            stats.roi > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stats.roi > 0 ? '+' : ''}{stats.roi.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}