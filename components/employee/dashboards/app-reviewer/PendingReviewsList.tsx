'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, CheckCircle, XCircle, Clock, Star, Code, Download, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { SUBMIT_REVIEW } from '@/graphql/employee/mutations';

interface PendingApp {
  id: string;
  name: string;
  developer: string;
  submittedAt: string;
  category: string;
  version: string;
  priority?: string;
  description?: string;
  screenshots?: string[];
}

interface PendingReviewsListProps {
  apps: PendingApp[];
  showAll?: boolean;
}

export function PendingReviewsList({ apps, showAll = false }: PendingReviewsListProps) {
  const [submitReview] = useMutation(SUBMIT_REVIEW);
  const [localApps, setLocalApps] = useState(apps);
  const [selectedApp, setSelectedApp] = useState<PendingApp | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'rejected'>('approved');
  const [reviewComments, setReviewComments] = useState('');
  const [timeSpent, setTimeSpent] = useState(15);

  const handleReview = async () => {
    if (!selectedApp) return;
    
    try {
      await submitReview({
        variables: {
          appId: selectedApp.id,
          decision: reviewDecision,
          comments: reviewComments,
          timeSpent
        }
      });
      setLocalApps(prev => prev.filter(a => a.id !== selectedApp.id));
      setShowReviewDialog(false);
      setReviewComments('');
      setTimeSpent(15);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const displayApps = showAll ? localApps : localApps.slice(0, 5);

  const getPriorityColor = (priority?: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority || 'medium'] || 'bg-gray-100';
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending App Reviews</CardTitle>
          {!showAll && localApps.length > 5 && (
            <Link href="/employee/app-reviewer/pending">
              <Button variant="ghost" size="sm">View All ({localApps.length})</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayApps.map((app) => (
              <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold text-lg">{app.name}</h4>
                      <Badge variant="outline" className="bg-yellow-50">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      {app.priority && (
                        <Badge className={getPriorityColor(app.priority)}>
                          {app.priority} priority
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">Developer: {app.developer}</p>
                    
                    <div className="flex flex-wrap gap-3 mb-2">
                      <Badge variant="secondary">{app.category}</Badge>
                      <span className="text-xs text-gray-500">Version {app.version}</span>
                      <span className="text-xs text-gray-500">
                        Submitted {format(new Date(app.submittedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    {app.description && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">{app.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedApp(app);
                        setShowReviewDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>

                {app.screenshots && app.screenshots.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Screenshots:</p>
                    <div className="flex gap-2">
                      {app.screenshots.slice(0, 3).map((screenshot, index) => (
                        <div key={index} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {localApps.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No pending app reviews</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {showReviewDialog && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review App: {selectedApp.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* App Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Developer</p>
                    <p className="font-medium">{selectedApp.developer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedApp.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Version</p>
                    <p className="font-medium">{selectedApp.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium">{format(new Date(selectedApp.submittedAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedApp.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{selectedApp.description}</p>
                </div>
              )}

              {/* Decision */}
              <div>
                <label className="text-sm font-medium">Review Decision</label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={reviewDecision === 'approved' ? 'default' : 'outline'}
                    onClick={() => setReviewDecision('approved')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant={reviewDecision === 'rejected' ? 'destructive' : 'outline'}
                    onClick={() => setReviewDecision('rejected')}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="text-sm font-medium">
                  {reviewDecision === 'rejected' ? 'Rejection Reason *' : 'Review Comments'}
                </label>
                <Textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder={reviewDecision === 'rejected' 
                    ? 'Please explain why this app is being rejected...' 
                    : 'Add any comments about this review (optional)...'
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Time Spent */}
              <div>
                <label className="text-sm font-medium">Time Spent (minutes)</label>
                <Input
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(parseInt(e.target.value))}
                  min={1}
                  className="mt-1 w-32"
                />
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Review Guidelines:</strong> Ensure the app follows our policies, has complete documentation, and passes security checks.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleReview}
                  disabled={reviewDecision === 'rejected' && !reviewComments.trim()}
                >
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}