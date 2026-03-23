'use client';

import { useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

import { WelcomeHeader } from '../shared/WelcomeHeader';
import { EmployeeStats } from './EmployeeStats';
import { EmployeeProjects } from './EmployeeProjects';
import { EmployeeEarnings } from './EmployeeEarnings';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { RecentActivityCard } from '../shared/RecentActivityCard';
import { NotificationsCard } from '../shared/NotificationsCard';

import { REGULAR_EMPLOYEE_STATS } from '@/graphql/employee/queries';
import { GET_MY_PROJECTS } from '@/graphql/employee/queries';
import { GET_MY_BIDS } from '@/graphql/employee/queries';
import { GET_EMPLOYEE_BY_USER_ID } from '@/graphql/jobs/queries';

export function EmployeeDashboard() {
  const { data: session } = useSession();

  const { data: employeeData, loading: employeeLoading } = useQuery(GET_EMPLOYEE_BY_USER_ID, {
    variables: { userId: session?.user?.id },
    skip: !session?.user?.id
  });

  const { data: statsData, loading: statsLoading } = useQuery(REGULAR_EMPLOYEE_STATS, {
    variables: { userId: session?.user?.id },
    skip: !session?.user?.id
  });

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_MY_PROJECTS);

  const employee = employeeData?.employeeByUserId;
  const stats = statsData?.regularEmployeeStats;

  if (employeeLoading || statsLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Employee profile not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={employee} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full max-w-3xl grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EmployeeStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <RecentActivityCard 
                activities={stats?.recentProjects || []} 
                viewAllHref="/employee/projects"
                title="Recent Projects"
              />
            </div>
            <QuickActionsCard />
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <EmployeeProjects projects={projectsData?.myProjects || []} />
        </TabsContent>

        <TabsContent value="earnings">
          <EmployeeEarnings />
        </TabsContent>
      </Tabs>
    </div>
  );
}