'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Mail, AppWindow, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Developer {
  id: string;
  name: string;
  email: string;
  appsCount: number;
  status: string;
  joinDate: string;
}

interface DevelopersListProps {
  developers: Developer[];
}

export function DevelopersList({ developers }: DevelopersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developers.map((dev) => (
            <div key={dev.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{dev.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{dev.name}</h4>
                    <p className="text-sm text-gray-600">{dev.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={dev.status === 'active' ? 'default' : 'secondary'}>
                        {dev.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Joined {format(new Date(dev.joinDate), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/employee/app-manager/developers/${dev.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
              
              <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <AppWindow className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{dev.appsCount} apps</span>
                </div>
                <Button variant="ghost" size="sm" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}