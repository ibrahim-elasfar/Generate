'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { SUPPORT_AGENT_STATS, OPEN_TICKETS, RESOLVED_TICKETS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { SupportAgentStats } from './SupportAgentStats';
import { OpenTicketsList } from './OpenTicketsList';
import { TicketStats } from './TicketStats';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { MessageCircle, CheckCircle, Clock, BarChart, Users, Settings } from 'lucide-react';

const supportAgentQuickActions = [
  { href: '/employee/support-agent/tickets', icon: MessageCircle, label: 'All Tickets', color: 'text-blue-500' },
  { href: '/employee/support-agent/my-tickets', icon: Users, label: 'My Tickets', color: 'text-green-500' },
  { href: '/employee/support-agent/stats', icon: BarChart, label: 'Statistics', color: 'text-purple-500' },
  { href: '/employee/support-agent/settings', icon: Settings, label: 'Settings', color: 'text-orange-500' },
];

export function SupportAgentDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(SUPPORT_AGENT_STATS);
  const { data: openData, loading: openLoading } = useQuery(OPEN_TICKETS);
  const { data: resolvedData, loading: resolvedLoading } = useQuery(RESOLVED_TICKETS, {
    variables: { limit: 10 }
  });

  if (statsLoading || openLoading || resolvedLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.supportAgentStats;
  const openTickets = openData?.openTickets || [];
  const resolvedTickets = resolvedData?.resolvedTickets || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Support Agent', department: 'Customer Support', employeeId: 'SA001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="open">Open Tickets</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SupportAgentStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <OpenTicketsList tickets={openTickets.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={supportAgentQuickActions} title="Support Actions" />
          </div>
        </TabsContent>

        <TabsContent value="open">
          <OpenTicketsList tickets={openTickets} showAll />
        </TabsContent>

        <TabsContent value="stats">
          <TicketStats stats={stats} resolvedTickets={resolvedTickets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}