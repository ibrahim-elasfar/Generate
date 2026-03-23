'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  assignedTo: string;
  progress: number;
  deadline: string;
  status: string;
  priority: string;
}

interface ManagerProjectsListProps {
  projects: Project[];
}

export function ManagerProjectsList({ projects }: ManagerProjectsListProps) {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const isDeadlineNear = (deadline: string) => {
    const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Department Projects</CardTitle>
        <Link href="/employee/manager/projects/new">
          <Button size="sm">New Project</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => {
            const nearDeadline = isDeadlineNear(project.deadline);
            
            return (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-600">Assigned to: {project.assignedTo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      project.status === 'active' ? 'default' :
                      project.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {project.status}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${nearDeadline ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      Deadline: {format(new Date(project.deadline), 'MMM dd, yyyy')}
                      {nearDeadline && <AlertCircle className="h-4 w-4 inline ml-1 text-red-600" />}
                    </span>
                  </div>
                  <Link href={`/employee/manager/projects/${project.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}