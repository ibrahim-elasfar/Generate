'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Briefcase, FileText, Wallet, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface Action {
  href: string;
  icon: LucideIcon;
  label: string;
  color: string;
}

const defaultActions: Action[] = [
  { href: '/employee/timer', icon: Clock, label: 'Start Timer', color: 'text-blue-500' },
  { href: '/employee/find-work', icon: Briefcase, label: 'Find Work', color: 'text-green-500' },
  { href: '/employee/bids', icon: FileText, label: 'My Bids', color: 'text-purple-500' },
  { href: '/employee/earnings/withdraw', icon: Wallet, label: 'Withdraw', color: 'text-orange-500' },
];

interface QuickActionsCardProps {
  actions?: Action[];
  title?: string;
}

export function QuickActionsCard({ actions = defaultActions, title = 'Quick Actions' }: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
              <action.icon className={`h-6 w-6 mb-1 ${action.color}`} />
              <span className="text-xs">{action.label}</span>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}