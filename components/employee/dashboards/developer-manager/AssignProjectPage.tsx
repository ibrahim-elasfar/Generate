'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { ASSIGN_PROJECT } from '@/graphql/employee/mutations';
import { DEVELOPER_TEAM, DEVELOPER_APPS } from '@/graphql/employee/queries';
import { Skeleton } from '@/components/ui/skeleton';

export function AssignProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  const [mutate, { loading }] = useMutation(ASSIGN_PROJECT);
  const { data: developersData, loading: devsLoading } = useQuery(DEVELOPER_TEAM);
  const { data: projectsData, loading: projectsLoading } = useQuery(DEVELOPER_APPS);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (devsLoading || projectsLoading) return <Skeleton className="h-96 w-full" />;

  const developers = developersData?.developerTeam || [];
  const projects = projectsData?.developerApps || [];

  const handleSubmit = async () => {
    try {
      await mutate({ variables: { developerId: selectedDeveloper, projectId: selectedProject } });
      router.push('/employee/developer-manager/team');
    } catch (error) {
      console.error('Failed to assign:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Assign Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Developer</Label>
            <Select onValueChange={setSelectedDeveloper}>
              <SelectTrigger>
                <SelectValue placeholder="Select developer..." />
              </SelectTrigger>
              <SelectContent>
                {developers.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Project</Label>
            <Select onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedDeveloper || !selectedProject || loading}>
              <Save className="h-4 w-4 mr-2" />
              Assign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}