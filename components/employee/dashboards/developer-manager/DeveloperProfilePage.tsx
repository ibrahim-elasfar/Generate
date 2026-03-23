'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_DEVELOPER } from '@/graphql/jobs/queries';

export function DeveloperProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params?.id as string;

  const { data, loading } = useQuery(GET_DEVELOPER, {
    variables: { id },
    skip: !id
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const profile = data?.developer;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Developer Profile</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.image} />
              <AvatarFallback>{profile?.name?.[0] || profile?.user?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile?.name || profile?.user?.name}</h2>
              <p className="text-gray-500">{profile?.email || profile?.user?.email}</p>
              <Badge className="mt-1">{profile?.status || 'Active'}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {profile?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.position && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{profile.position}</span>
              </div>
            )}
            {profile?.department && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{profile.department}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}