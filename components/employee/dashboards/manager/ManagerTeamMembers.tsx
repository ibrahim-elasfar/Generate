'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  currentProjects: number;
  performance: number;
  status: string;
  joinDate: string;
}

interface ManagerTeamMembersProps {
  members: TeamMember[];
}

export function ManagerTeamMembers({ members }: ManagerTeamMembersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        <Link href="/employee/manager/team/add">
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Joined {format(new Date(member.joinDate), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/employee/manager/team/${member.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Projects</p>
                  <p className="text-lg font-semibold">{member.currentProjects}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Performance</p>
                  <div className="flex items-center gap-2">
                    <Progress value={member.performance} className="flex-1" />
                    <span className="text-sm font-medium">{member.performance}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}