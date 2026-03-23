'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';

interface WelcomeHeaderProps {
  employee: {
    position: string;
    department: string;
    employeeId: string;
  };
}

export function WelcomeHeader({ employee }: WelcomeHeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations('employee');

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-white">
          <AvatarImage src={session?.user?.image || ''} />
          <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {t('welcomeBack')}, {session?.user?.name}!
          </h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <Badge variant="outline" className="bg-white/20 text-white border-white">
              {employee.position}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white border-white">
              {employee.department}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white border-white">
              {t('id')}: {employee.employeeId}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="bg-white text-gray-900">
            <Bell className="h-4 w-4 mr-2" />
            {t('notifications')}
          </Button>
          <Link href="/employee/settings">
            <Button variant="secondary" size="sm" className="bg-white text-gray-900">
              <Settings className="h-4 w-4 mr-2" />
              {t('settings')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}