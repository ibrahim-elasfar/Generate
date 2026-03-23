'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Eye, Mail, Code, Star, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Developer {
  id: string;
  name: string;
  email: string;
  appsCount: number;
  status: string;
  joinDate: string;
  skills?: string[];
  performance?: number;
  rating?: number;
}

interface DeveloperTeamListProps {
  members: Developer[];
  showAll?: boolean;
}

export function DeveloperTeamList({ members, showAll = false }: DeveloperTeamListProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  const displayMembers = showAll ? members : members.slice(0, 5);
  
  // Extract all unique skills
  const allSkills = Array.from(new Set(members.flatMap(m => m.skills || [])));

  const filteredMembers = selectedSkill
    ? displayMembers.filter(m => m.skills?.includes(selectedSkill))
    : displayMembers;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Developer Team</CardTitle>
        {!showAll && members.length > 5 && (
          <Link href="/employee/developer-manager/team">
            <Button variant="ghost" size="sm">View All ({members.length})</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {/* Skills Filter */}
        {allSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge 
              variant={!selectedSkill ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedSkill(null)}
            >
              All
            </Badge>
            {allSkills.map(skill => (
              <Badge
                key={skill}
                variant={selectedSkill === skill ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {filteredMembers.map((dev) => (
            <div key={dev.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={dev.avatar} />
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
                <div className="flex gap-2">
                  <Link href={`/employee/developer-manager/developers/${dev.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{dev.appsCount} apps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">{dev.rating || 'New'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{dev.performance || 0}% perf</span>
                </div>
              </div>

              {dev.skills && dev.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {dev.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No developers found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}