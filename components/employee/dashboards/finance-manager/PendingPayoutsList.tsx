'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Eye, Clock, DollarSign, Banknote, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { PROCESS_PAYOUT, REJECT_WITHDRAWAL } from '@/graphql/employee/mutations';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PendingPayout {
  id: string;
  seller: string;
  amount: number;
  requestedAt: string;
  method: string;
  accountDetails?: string;
}

interface PendingPayoutsListProps {
  payouts: PendingPayout[];
  showAll?: boolean;
}

export function PendingPayoutsList({ payouts, showAll = false }: PendingPayoutsListProps) {
  const [processPayout] = useMutation(PROCESS_PAYOUT);
  const [rejectPayout] = useMutation(REJECT_WITHDRAWAL);
  const [localPayouts, setLocalPayouts] = useState(payouts);
  const [selectedPayout, setSelectedPayout] = useState<PendingPayout | null>(null);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleProcess = async (payoutId: string) => {
    if (!transactionId) {
      alert('Please enter transaction ID');
      return;
    }
    
    try {
      await processPayout({
        variables: { payoutId, transactionId }
      });
      setLocalPayouts(prev => prev.filter(p => p.id !== payoutId));
      setShowProcessDialog(false);
      setTransactionId('');
    } catch (error) {
      console.error('Failed to process payout:', error);
    }
  };

  const handleReject = async (payoutId: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    
    try {
      await rejectPayout({
        variables: { withdrawalId: payoutId, reason }
      });
      setLocalPayouts(prev => prev.filter(p => p.id !== payoutId));
    } catch (error) {
      console.error('Failed to reject payout:', error);
    }
  };

  const displayPayouts = showAll ? localPayouts : localPayouts.slice(0, 5);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Payouts</CardTitle>
          {!showAll && localPayouts.length > 5 && (
            <Link href="/employee/finance-manager/payouts">
              <Button variant="ghost" size="sm">View All ({localPayouts.length})</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayPayouts.map((payout) => (
              <div key={payout.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold text-lg">{payout.seller}</h4>
                      <Badge variant="outline" className="bg-yellow-50">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">${payout.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Method: {payout.method}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Requested {format(new Date(payout.requestedAt), 'MMM dd, yyyy • h:mm a')}
                    </p>

                    {payout.accountDetails && (
                      <p className="text-xs text-gray-500 mt-1">
                        Account: {payout.accountDetails}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedPayout(payout);
                        setShowProcessDialog(true);
                      }}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Process
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600"
                      onClick={() => handleReject(payout.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {localPayouts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No pending payouts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Process Payout Dialog */}
      {showProcessDialog && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Process Payout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Seller: {selectedPayout.seller}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ${selectedPayout.amount.toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Transaction ID</label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID..."
                  className="mt-1"
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action will mark the payout as processed. Make sure you have completed the transfer.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowProcessDialog(false);
                  setTransactionId('');
                }}>
                  Cancel
                </Button>
                <Button onClick={() => handleProcess(selectedPayout.id)}>
                  Confirm Process
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}