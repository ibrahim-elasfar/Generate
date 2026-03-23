// components/employee/dashboards/regular/EmployeeEarnings.tsx

'use client';

import { useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Wallet, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { EMPLOYEE_EARNINGS } from '@/graphql/employee/queries';
import { StatsCard } from '../shared/StatsCard';

export function EmployeeEarnings() {
  const { data, loading } = useQuery(EMPLOYEE_EARNINGS);

  if (loading) {
    return <div className="flex justify-center items-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>;
  }

  const earnings = data?.employeeEarnings;

  return (
    <div className="space-y-6">
      {/* ✅ استخدام StatsCard بدل الـ Card المكرر */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Earnings"
          value={`$${earnings.total.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
          subtitle="Lifetime earnings"
        />
        <StatsCard
          title="Available Balance"
          value={`$${earnings.available.toLocaleString()}`}
          icon={Wallet}
          color="green"
          subtitle="Ready to withdraw"
        />
        <StatsCard
          title="Pending"
          value={`$${earnings.pending.toLocaleString()}`}
          icon={Clock}
          color="yellow"
          subtitle="Awaiting approval"
        />
        <StatsCard
          title="This Month"
          value={`$${earnings.thisMonth.toLocaleString()}`}
          icon={TrendingUp}
          color="purple"
          subtitle="January 2024"
          trend={{
            value: 12.5,
            isPositive: true
          }}
        />
      </div>

      {/* Recent Transactions Card - يفضل الاحتفاظ به منفصل */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {earnings.transactions?.length > 0 ? (
              earnings.transactions.map((tx: any) => (
                <div key={tx.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-gray-500">{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <p className={`font-semibold ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            )}
          </div>
          
          {/* Withdraw Button */}
          <div className="mt-6 pt-4 border-t">
            <Link href="/employee/earnings/withdraw">
              <Button className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}