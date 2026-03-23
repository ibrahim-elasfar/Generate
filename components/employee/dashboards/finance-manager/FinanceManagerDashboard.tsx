'use client';

import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FINANCE_MANAGER_STATS, PENDING_PAYOUTS, FINANCE_TRANSACTIONS } from '@/graphql/employee/queries';
import { WelcomeHeader } from '../shared/WelcomeHeader';
import { FinanceStats } from './FinanceStats';
import { PendingPayoutsList } from './PendingPayoutsList';
import { SalaryReportsList } from './SalaryReportsList';
import { QuickActionsCard } from '../shared/QuickActionsCard';
import { DollarSign, TrendingUp, FileText, Download, BarChart } from 'lucide-react';
import { FinanceTransactionsList } from './FinanceTransactionsList';

const financeManagerQuickActions = [
  { href: '/employee/finance-manager/payouts', icon: DollarSign, label: 'Process Payouts', color: 'text-blue-500' },
  { href: '/employee/finance-manager/salaries', icon: FileText, label: 'Salary Reports', color: 'text-green-500' },
  { href: '/employee/finance-manager/reports', icon: BarChart, label: 'Financial Reports', color: 'text-purple-500' },
  { href: '/employee/finance-manager/export', icon: Download, label: 'Export Data', color: 'text-orange-500' },
];

export function FinanceManagerDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(FINANCE_MANAGER_STATS);
  const { data: payoutsData, loading: payoutsLoading } = useQuery(PENDING_PAYOUTS);
  const { data: transactionsData, loading: transactionsLoading } = useQuery(FINANCE_TRANSACTIONS, {
    variables: { limit: 10 }
  });

  if (statsLoading || payoutsLoading || transactionsLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const stats = statsData?.financeManagerStats;
  const pendingPayouts = payoutsData?.pendingPayouts || [];
  const transactions = transactionsData?.financeTransactions || [];

  return (
    <div className="space-y-6">
      <WelcomeHeader employee={{ position: 'Finance Manager', department: 'Finance', employeeId: 'FM001' }} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payouts">Pending Payouts</TabsTrigger>
          <TabsTrigger value="salaries">Salary Reports</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <FinanceStats stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <PendingPayoutsList payouts={pendingPayouts.slice(0, 5)} />
            </div>
            <QuickActionsCard actions={financeManagerQuickActions} title="Finance Actions" />
          </div>
        </TabsContent>

        <TabsContent value="payouts">
          <PendingPayoutsList payouts={pendingPayouts} showAll />
        </TabsContent>

        <TabsContent value="salaries">
          <SalaryReportsList />
        </TabsContent>

        <TabsContent value="transactions">
          <FinanceTransactionsList transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}