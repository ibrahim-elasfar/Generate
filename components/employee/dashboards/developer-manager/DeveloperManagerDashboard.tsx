'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { DEVELOPER_MANAGER_STATS, DEVELOPER_TEAM, DEVELOPER_APPS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { DeveloperManagerStats } from './DeveloperManagerStats';
import { DeveloperTeamList } from './DeveloperTeamList';
import { DeveloperProjectsList } from './DeveloperProjectsList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { Code, Users, Briefcase, BarChart } from 'lucide-react';

const developerManagerQuickActions = [
  { href: '/employee/developer-manager/assign', icon: Briefcase, label: 'Assign Project', color: 'text-blue-500' },
  { href: '/employee/developer-manager/team', icon: Users, label: 'Manage Team', color: 'text-green-500' },
  { href: '/employee/developer-manager/skills', icon: Code, label: 'Skills Matrix', color: 'text-purple-500' },
  { href: '/employee/developer-manager/reports', icon: BarChart, label: 'Reports', color: 'text-orange-500' },
];

export function DeveloperManagerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(DEVELOPER_MANAGER_STATS);
  const { data: teamData, loading: teamLoading } = useQuery(DEVELOPER_TEAM);
  const { data: appsData, loading: appsLoading } = useQuery(DEVELOPER_APPS);

  if (statsLoading || teamLoading || appsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.developerManagerStats;
  const team = teamData?.developerTeam || [];
  const apps = appsData?.developerApps || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Developer Manager', department: 'Developer Management', employeeId: 'DM001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DeveloperManagerStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <DeveloperTeamList members={team.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={developerManagerQuickActions} title="Developer Manager Actions" />
          </div>
        </TabsContent>

        <TabsContent value="team">
          <DeveloperTeamList members={team} showAll />
        </TabsContent>

        <TabsContent value="projects">
          <DeveloperProjectsList apps={apps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}