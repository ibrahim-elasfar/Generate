'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, TrendingDown, Eye, MousePointerClick, ShoppingCart, Target } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsReportsProps {
  stats?: {
    totalImpressions: number;
    totalClicks: number;
    conversionRate: number;
    totalRevenue: number;
    totalSpent: number;
    roi: number;
    performanceByChannel?: Array<{
      channel: string;
      impressions: number;
      clicks: number;
      conversions: number;
      spent: number;
      revenue: number;
    }>;
  };
}

export function AnalyticsReports({ stats }: AnalyticsReportsProps) {
  const [dateRange, setDateRange] = useState('30d');

  if (!stats) return null;

  // Mock data for charts - in real app, this would come from the server
  const channelPerformance = stats.performanceByChannel || [
    { channel: 'Google Ads', impressions: 45000, clicks: 1800, conversions: 90, spent: 4500, revenue: 13500 },
    { channel: 'Facebook', impressions: 38000, clicks: 2100, conversions: 105, spent: 3800, revenue: 15750 },
    { channel: 'Instagram', impressions: 25000, clicks: 950, conversions: 48, spent: 2500, revenue: 7200 },
    { channel: 'Email', impressions: 12000, clicks: 600, conversions: 42, spent: 1200, revenue: 6300 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Analytics Dashboard</CardTitle>
          <div className="flex gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Impressions</span>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+12.5% vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Clicks</span>
              <MousePointerClick className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+8.3% vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Conversion Rate</span>
              <ShoppingCart className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
            <p className={`text-xs mt-1 ${
              stats.conversionRate > 2.5 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.conversionRate > 2.5 ? '+0.5%' : '-0.3%'} vs target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">ROI</span>
              {stats.roi > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className={`text-2xl font-bold ${
              stats.roi > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.roi > 0 ? '+' : ''}{stats.roi.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Channel</th>
                  <th className="text-right py-3 px-4">Impressions</th>
                  <th className="text-right py-3 px-4">Clicks</th>
                  <th className="text-right py-3 px-4">CTR</th>
                  <th className="text-right py-3 px-4">Conversions</th>
                  <th className="text-right py-3 px-4">Conv. Rate</th>
                  <th className="text-right py-3 px-4">Spent</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {channelPerformance.map((channel, index) => {
                  const ctr = (channel.clicks / channel.impressions * 100).toFixed(2);
                  const convRate = (channel.conversions / channel.clicks * 100).toFixed(2);
                  const roas = (channel.revenue / channel.spent).toFixed(2);
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{channel.channel}</td>
                      <td className="text-right py-3 px-4">{channel.impressions.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{channel.clicks.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{ctr}%</td>
                      <td className="text-right py-3 px-4">{channel.conversions}</td>
                      <td className="text-right py-3 px-4">{convRate}%</td>
                      <td className="text-right py-3 px-4">${channel.spent.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 text-green-600">${channel.revenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 font-semibold">{roas}x</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5" />
              <span>Increase budget for Google Ads by 20% - it's your best performing channel with 3.0x ROAS</span>
            </li>
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5" />
              <span>Facebook campaign "Summer Sale" has low CTR - consider refreshing ad creatives</span>
            </li>
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5" />
              <span>Email marketing has highest conversion rate - try expanding to newsletter subscribers</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}