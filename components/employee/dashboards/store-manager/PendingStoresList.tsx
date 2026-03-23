'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Eye, Clock, Store, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { APPROVE_STORE, SUSPEND_STORE } from '@/graphql/employee/mutations';

interface PendingStore {
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
  category?: string;
}

interface PendingStoresListProps {
  stores: PendingStore[];
  showAll?: boolean;
}

export function PendingStoresList({ stores, showAll = false }: PendingStoresListProps) {
  const [approveStore] = useMutation(APPROVE_STORE);
  const [rejectStore] = useMutation(SUSPEND_STORE);
  const [localStores, setLocalStores] = useState(stores);

  const handleApprove = async (storeId: string) => {
    try {
      await approveStore({ variables: { storeId } });
      setLocalStores(prev => prev.filter(s => s.id !== storeId));
    } catch (error) {
      console.error('Failed to approve store:', error);
    }
  };

  const handleReject = async (storeId: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    
    try {
      await rejectStore({ variables: { storeId, reason } });
      setLocalStores(prev => prev.filter(s => s.id !== storeId));
    } catch (error) {
      console.error('Failed to reject store:', error);
    }
  };

  const displayStores = showAll ? localStores : localStores.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Store Approvals</CardTitle>
        {!showAll && localStores.length > 5 && (
          <Link href="/employee/store-manager/pending">
            <Button variant="ghost" size="sm">View All ({localStores.length})</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayStores.map((store) => (
            <div key={store.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-5 w-5 text-gray-400" />
                    <h4 className="font-semibold text-lg">{store.name}</h4>
                    <Badge variant="outline" className="bg-yellow-50">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                    {store.category && (
                      <Badge variant="secondary">{store.category}</Badge>
                    )}
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
                  
                  <p className="text-xs text-gray-500">
                    Requested {format(new Date(store.openedAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Link href={`/employee/store-manager/stores/${store.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-600"
                    onClick={() => handleApprove(store.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600"
                    onClick={() => handleReject(store.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {localStores.length === 0 && (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending store approvals</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}