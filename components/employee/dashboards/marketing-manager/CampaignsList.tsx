'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Edit, Play, Pause, TrendingUp, DollarSign, Target, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { UPDATE_CAMPAIGN_STATUS } from '@/graphql/employee/mutations';

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
}

interface CampaignsListProps {
  campaigns: Campaign[];
  showAll?: boolean;
}

export function CampaignsList({ campaigns, showAll = false }: CampaignsListProps) {
  const [updateStatus] = useMutation(UPDATE_CAMPAIGN_STATUS);
  const [localCampaigns, setLocalCampaigns] = useState(campaigns);

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      await updateStatus({
        variables: { campaignId, status: newStatus }
      });
      setLocalCampaigns(prev => prev.map(c => 
        c.id === campaignId ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      console.error('Failed to update campaign status:', error);
    }
  };

  const displayCampaigns = showAll ? localCampaigns : localCampaigns.slice(0, 5);

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      'Google Ads': 'bg-blue-100 text-blue-800',
      'Facebook': 'bg-indigo-100 text-indigo-800',
      'Instagram': 'bg-pink-100 text-pink-800',
      'Email': 'bg-green-100 text-green-800',
      'LinkedIn': 'bg-sky-100 text-sky-800',
      'Twitter': 'bg-slate-100 text-slate-800'
    };
    return colors[channel] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Marketing Campaigns</CardTitle>
        {!showAll && localCampaigns.length > 5 && (
          <Link href="/employee/marketing-manager/campaigns">
            <Button variant="ghost" size="sm">View All ({localCampaigns.length})</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayCampaigns.map((campaign) => {
            const spentPercent = (campaign.spent / campaign.budget) * 100;
            const ctr = campaign.impressions 
              ? ((campaign.clicks || 0) / campaign.impressions * 100).toFixed(2)
              : '0.00';

            return (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{campaign.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getChannelColor(campaign.channel)}>
                        {campaign.channel}
                      </Badge>
                      <Badge variant={
                        campaign.status === 'active' ? 'default' :
                        campaign.status === 'paused' ? 'secondary' : 'outline'
                      }>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {campaign.status === 'active' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(campaign.id, 'paused')}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : campaign.status === 'paused' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(campaign.id, 'active')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Link href={`/employee/marketing-manager/campaigns/${campaign.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-sm font-medium">${campaign.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="text-sm font-medium">${campaign.spent.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-500">Impressions</p>
                      <p className="text-sm font-medium">{campaign.impressions?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-500">CTR</p>
                      <p className="text-sm font-medium">{ctr}%</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Budget Utilization</span>
                    <span>{spentPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={spentPercent} />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Started: {format(new Date(campaign.startDate), 'MMM dd, yyyy')}</span>
                  {campaign.endDate && (
                    <span>Ends: {format(new Date(campaign.endDate), 'MMM dd, yyyy')}</span>
                  )}
                </div>
              </div>
            );
          })}

          {localCampaigns.length === 0 && (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No campaigns found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}