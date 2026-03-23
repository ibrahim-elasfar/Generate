'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  description: string;
  timestamp: Date;
  type: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  viewAllHref: string;
  title?: string;
}

export function RecentActivityCard({ activities, viewAllHref, title = 'Recent Activity' }: RecentActivityCardProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {title}
        </CardTitle>
        <Link href={viewAllHref}>
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}