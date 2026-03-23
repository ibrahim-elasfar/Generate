'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MANAGER_STATS, MANAGER_TEAM_MEMBERS, MANAGER_PROJECTS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { ManagerStats } from './ManagerStats';
import { ManagerTeamMembers } from './ManagerTeamMembers';
import { ManagerProjectsList } from './ManagerProjectsList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { RecentActivityCard } from '../shared/RecentActivityCard';
import { BarChart, Briefcase, DollarSign, Users } from 'lucide-react';

const managerQuickActions = [
  { href: '/employee/manager/projects/new', icon: Briefcase, label: 'New Project', color: 'text-blue-500' },
  { href: '/employee/manager/team/assign', icon: Users, label: 'Assign Task', color: 'text-green-500' },
  { href: '/employee/manager/reports', icon: BarChart, label: 'Reports', color: 'text-purple-500' },
  { href: '/employee/manager/budget', icon: DollarSign, label: 'Budget Review', color: 'text-orange-500' },
];

export function ManagerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(MANAGER_STATS);
  const { data: teamData, loading: teamLoading } = useQuery(MANAGER_TEAM_MEMBERS);
  const { data: projectsData, loading: projectsLoading } = useQuery(MANAGER_PROJECTS);

  if (statsLoading || teamLoading || projectsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.managerStats;
  const team = teamData?.managerTeamMembers || [];
  const projects = projectsData?.managerProjects || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Department Manager', department: stats?.department || 'General', employeeId: 'MGR001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ManagerStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <RecentActivityCard 
                activities={stats?.recentActivities || []} 
                viewAllHref="/employee/manager/activities"
                title="Team Activities"
              />
            </div>
            <QuickActionsCard actions={managerQuickActions} title="Manager Actions" />
          </div>
        </TabsContent>

        <TabsContent value="team">
          <ManagerTeamMembers members={team} />
        </TabsContent>

        <TabsContent value="projects">
          <ManagerProjectsList projects={projects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}