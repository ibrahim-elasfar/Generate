'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
// import { useMutation } from '@apollo/client';
import { REVIEW_APP } from '@/graphql/employee/mutations';

interface PendingApp {
  id: string;
  name: string;
  developer: string;
  submittedAt: string;
  category: string;
  version: string;
  priority?: string;
}

interface PendingAppsListProps {
  apps: PendingApp[];
  showAll?: boolean;
}

export function PendingAppsList({ apps, showAll = false }: PendingAppsListProps) {
  const [reviewApp] = useMutation(REVIEW_APP);
  const [localApps, setLocalApps] = useState(apps);

  const handleReview = async (appId: string, decision: 'approved' | 'rejected') => {
    const comments = decision === 'rejected' ? prompt('Please enter rejection reason:') : '';
    if (decision === 'rejected' && !comments) return;
    
    try {
      await reviewApp({
        variables: {
          appId,
          decision,
          comments: comments || 'Approved',
          timeSpent: 15 // Mock time spent
        }
      });
      setLocalApps(prev => prev.filter(a => a.id !== appId));
    } catch (error) {
      console.error('Failed to review app:', error);
    }
  };

  const displayApps = showAll ? localApps : localApps.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending App Reviews</CardTitle>
        {!showAll && localApps.length > 5 && (
          <Link href="/employee/app-manager/pending">
            <Button variant="ghost" size="sm">View All ({localApps.length})</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayApps.map((app) => (
            <div key={app.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{app.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{app.name}</h4>
                    <p className="text-sm text-gray-600">Developer: {app.developer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-yellow-50">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <Badge variant="secondary">{app.category}</Badge>
                      <span className="text-xs text-gray-500">v{app.version}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {format(new Date(app.submittedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/employee/app-manager/apps/${app.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-600"
                    onClick={() => handleReview(app.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600"
                    onClick={() => handleReview(app.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {app.priority === 'high' && (
                <div className="mt-2">
                  <Badge variant="destructive" className="text-xs">High Priority</Badge>
                </div>
              )}
            </div>
          ))}
          
          {localApps.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-500">No pending app reviews</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}