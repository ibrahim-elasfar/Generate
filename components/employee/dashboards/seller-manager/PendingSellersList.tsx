'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { APPROVE_SELLER, REJECT_SELLER } from '@/graphql/employee/mutations';

interface PendingSeller {
  id: string;
  businessName: string;
  email: string;
  submittedAt: string;
  documents: string[];
}

interface PendingSellersListProps {
  sellers: PendingSeller[];
  showAll?: boolean;
}

export function PendingSellersList({ sellers, showAll = false }: PendingSellersListProps) {
  const [approveSeller] = useMutation(APPROVE_SELLER);
  const [rejectSeller] = useMutation(REJECT_SELLER);
  const [localSellers, setLocalSellers] = useState(sellers);

  const handleApprove = async (sellerId: string) => {
    try {
      await approveSeller({ variables: { sellerId } });
      setLocalSellers(prev => prev.filter(s => s.id !== sellerId));
    } catch (error) {
      console.error('Failed to approve seller:', error);
    }
  };

  const handleReject = async (sellerId: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    
    try {
      await rejectSeller({ variables: { sellerId, reason } });
      setLocalSellers(prev => prev.filter(s => s.id !== sellerId));
    } catch (error) {
      console.error('Failed to reject seller:', error);
    }
  };

  const displaySellers = showAll ? localSellers : localSellers.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Seller Approvals</CardTitle>
        {!showAll && localSellers.length > 5 && (
          <Link href="/employee/seller-manager/pending">
            <Button variant="ghost" size="sm">View All ({localSellers.length})</Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displaySellers.map((seller) => (
            <div key={seller.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{seller.businessName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{seller.businessName}</h4>
                    <p className="text-sm text-gray-600">{seller.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-yellow-50">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Submitted {format(new Date(seller.submittedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/employee/seller-manager/sellers/${seller.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-600"
                    onClick={() => handleApprove(seller.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600"
                    onClick={() => handleReject(seller.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {seller.documents.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2">Documents:</p>
                  <div className="flex gap-2">
                    {seller.documents.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        Document {index + 1}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {localSellers.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-500">No pending approvals</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}