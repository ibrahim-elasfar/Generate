'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DEVELOPER_MANAGER_STATS } from '@/graphql/employee/queries';

export function SkillsMatrixPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(DEVELOPER_MANAGER_STATS);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  let skills = data?.skillDistribution || [];
  if (typeof skills === 'object' && !Array.isArray(skills)) {
    skills = Object.values(skills).flat();
  }

  const maxCount = Math.max(...skills.map(s => s.count || 0), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Skills Matrix</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">{skill.name || skill.skill}</h3>
                </div>
                <span className="text-sm font-medium">{skill.count || 0} developers</span>
              </div>
              <Progress value={((skill.count || 0) / maxCount) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}