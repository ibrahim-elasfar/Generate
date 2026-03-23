'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  client: {
    name: string;
    company?: string;
    rating?: number;
  };
  budget: number;
  status: string;
  progress: number;
  deadline: string;
  hoursWorked: number;
}

interface EmployeeProjectsProps {
  projects: Project[];
}

export function EmployeeProjects({ projects }: EmployeeProjectsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.client.company || project.client.name}</p>
                </div>
                <Badge variant={
                  project.status === 'active' ? 'default' :
                  project.status === 'completed' ? 'secondary' : 'outline'
                }>
                  {project.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="ml-2 font-medium">${project.budget.toLocaleString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Hours:</span>
                  <span className="ml-2 font-medium">{project.hoursWorked}</span>
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
                <span className="text-xs text-gray-500">
                  Deadline: {format(new Date(project.deadline), 'MMM dd, yyyy')}
                </span>
                <Link href={`/employee/projects/${project.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
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