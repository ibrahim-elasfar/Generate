'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { OPEN_TICKETS } from '@/graphql/employee/queries';

export function MyTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data, loading } = useQuery(OPEN_TICKETS);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  let items = data?.openTickets || [];
  if (typeof items === 'object' && !Array.isArray(items)) {
    items = Object.values(items).flat();
  }

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.businessName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id || item._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.name || item.title || item.businessName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description || item.email || item.businessName}</p>
                </div>
                <Link href={`./${item.id || item._id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}