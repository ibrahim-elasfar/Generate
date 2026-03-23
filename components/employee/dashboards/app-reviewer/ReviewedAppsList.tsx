'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, CheckCircle, XCircle, Clock, Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface ReviewedApp {
  id: string;
  name: string;
  developer: string;
  reviewedAt: string;
  decision: string;
  timeSpent: number;
  comments?: string;
}

interface ReviewedAppsListProps {
  apps: ReviewedApp[];
}

export function ReviewedAppsList({ apps }: ReviewedAppsListProps) {
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('all');

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
                         app.developer.toLowerCase().includes(search.toLowerCase());
    const matchesDecision = decisionFilter === 'all' || app.decision === decisionFilter;
    return matchesSearch && matchesDecision;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviewed Applications</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search apps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={decisionFilter} onValueChange={setDecisionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by decision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{app.name}</h4>
                    <Badge variant={app.decision === 'approved' ? 'default' : 'destructive'}>
                      {app.decision === 'approved' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {app.decision}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">Developer: {app.developer}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span>Reviewed {format(new Date(app.reviewedAt), 'MMM dd, yyyy h:mm a')}</span>
                    <span>•</span>
                    <span>Time spent: {app.timeSpent} minutes</span>
                  </div>

                  {app.comments && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">Comments:</span> {app.comments}
                    </div>
                  )}
                </div>
                
                <Link href={`/employee/app-reviewer/apps/${app.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reviewed apps found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}