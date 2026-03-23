'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  reference: string;
}

interface FinanceTransactionsListProps {
  transactions: Transaction[];
}

export function FinanceTransactionsList({ transactions }: FinanceTransactionsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                {tx.type === 'credit' ? (
                  <ArrowDownRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{tx.reference}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(tx.date), 'MMM dd, yyyy h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold ${
                  tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
                <Badge variant={
                  tx.status === 'completed' ? 'default' :
                  tx.status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}