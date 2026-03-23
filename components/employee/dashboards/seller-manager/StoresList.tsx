'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Store, DollarSign, Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Store {
  id: string;
  name: string;
  owner: {
    businessName: string;
    email: string;
  };
  status: string;
  products: number;
  orders: number;
  revenue: number;
  rating: number;
  openedAt: string;
}

interface StoresListProps {
  stores: Store[];
}

export function StoresList({ stores }: StoresListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) ||
                         store.owner.businessName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stores Directory</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredStores.map((store) => (
            <div key={store.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-5 w-5 text-gray-400" />
                    <h4 className="font-semibold text-lg">{store.name}</h4>
                    <Badge variant={
                      store.status === 'active' ? 'default' :
                      store.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {store.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    Owner: {store.owner.businessName} • {store.owner.email}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{store.products} products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{store.orders} orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">${store.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Rating: {store.rating} ⭐</span>
                    <span>Opened: {format(new Date(store.openedAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                
                <Link href={`/employee/seller-manager/stores/${store.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}