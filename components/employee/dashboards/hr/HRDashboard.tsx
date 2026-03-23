'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { HR_STATS, HR_APPLICATIONS, HR_EMPLOYEES, HR_INTERVIEWS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { HRStats } from './HRStats';
import { HRApplicationsList } from './HRApplicationsList';
import { HREmployeesList } from './HREmployeesList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { RecentActivityCard } from '../shared/RecentActivityCard';
import { Briefcase, Clock, FileText, UserPlus } from 'lucide-react';

const hrQuickActions = [
  { href: '/employee/hr/post-job', icon: Briefcase, label: 'Post Job', color: 'text-blue-500' },
  { href: '/employee/hr/applications', icon: FileText, label: 'Review Applications', color: 'text-green-500' },
  { href: '/employee/hr/interviews', icon: Clock, label: 'Schedule Interview', color: 'text-purple-500' },
  { href: '/employee/hr/employees/add', icon: UserPlus, label: 'Add Employee', color: 'text-orange-500' },
];

export function HRDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(HR_STATS);
  const { data: applicationsData, loading: appsLoading } = useQuery(HR_APPLICATIONS, {
    variables: { limit: 5 }
  });

  if (statsLoading || appsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.hrStats;
  const applications = applicationsData?.hrApplications.applications || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'HR Manager', department: 'Human Resources', employeeId: 'HR001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <HRStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <RecentActivityCard 
                activities={stats?.recentApplications || []} 
                viewAllHref="/employee/hr/applications"
                title="Recent Applications"
              />
            </div>
            <QuickActionsCard actions={hrQuickActions} title="HR Actions" />
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <HRApplicationsList applications={applications} />
        </TabsContent>

        <TabsContent value="employees">
          <HREmployeesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}