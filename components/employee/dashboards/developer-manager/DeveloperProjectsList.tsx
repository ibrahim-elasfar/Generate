'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Clock, Code, Download, Star } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface App {
  id: string;
  name: string;
  developer: {
    name: string;
    email: string;
  };
  status: string;
  version: string;
  downloads: number;
  rating: number;
}

interface DeveloperProjectsListProps {
  apps: App[];
}

export function DeveloperProjectsList({ apps }: DeveloperProjectsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Developer Projects</CardTitle>
        <Link href="/employee/developer-manager/projects/new">
          <Button size="sm">New Project</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.map((app) => (
            <div key={app.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{app.name}</h4>
                  <p className="text-sm text-gray-600">by {app.developer.name}</p>
                </div>
                <Badge variant={
                  app.status === 'approved' ? 'default' :
                  app.status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {app.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">v{app.version}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{app.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">{app.rating}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href={`/employee/developer-manager/projects/${app.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}