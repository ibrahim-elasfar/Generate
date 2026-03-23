'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Flag, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  MessageCircle,
  ShoppingBag,
  Star,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { useMutation } from '@apollo/client';
import { RESOLVE_REPORT, DELETE_CONTENT } from '@/graphql/employee/mutations';
import Link from 'next/link';

interface ContentReport {
  id: string;
  contentType: string;
  contentId: string;
  reportedBy: string;
  reason: string;
  reportedAt: string;
  status: string;
  priority: string;
  contentPreview?: string;
}

interface PendingReportsListProps {
  reports: ContentReport[];
  showAll?: boolean;
}

export function PendingReportsList({ reports, showAll = false }: PendingReportsListProps) {
  const [resolveReport] = useMutation(RESOLVE_REPORT);
  const [deleteContent] = useMutation(DELETE_CONTENT);
  const [localReports, setLocalReports] = useState(reports);
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [action, setAction] = useState<'warn' | 'delete' | 'ignore'>('warn');
  const [actionNotes, setActionNotes] = useState('');

  const handleResolve = async (reportId: string) => {
    try {
      let actionTaken = '';
      switch (action) {
        case 'warn':
          actionTaken = 'User warned';
          break;
        case 'delete':
          actionTaken = 'Content deleted';
          await deleteContent({
            variables: {
              contentId: selectedReport?.contentId,
              contentType: selectedReport?.contentType
            }
          });
          break;
        case 'ignore':
          actionTaken = 'Report ignored - no violation';
          break;
      }

      await resolveReport({
        variables: {
          reportId,
          action: actionTaken,
          notes: actionNotes
        }
      });
      
      setLocalReports(prev => prev.filter(r => r.id !== reportId));
      setShowActionDialog(false);
      setActionNotes('');
    } catch (error) {
      console.error('Failed to resolve report:', error);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return <ShoppingBag className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      case 'story': return <Eye className="h-4 w-4" />;
      case 'message': return <Users className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100';
  };

  const displayReports = showAll ? localReports : localReports.slice(0, 5);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Content Reports</CardTitle>
          {!showAll && localReports.length > 5 && (
            <Link href="/employee/content-moderator/pending">
              <Button variant="ghost" size="sm">View All ({localReports.length})</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getContentTypeIcon(report.contentType)}
                      <h4 className="font-semibold">
                        {report.contentType} Report #{report.contentId.slice(-6)}
                      </h4>
                      <Badge variant="outline" className="bg-yellow-50">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Reason:</span> {report.reason}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>Reported by: {report.reportedBy}</span>
                      <span>•</span>
                      <span>{format(new Date(report.reportedAt), 'MMM dd, yyyy h:mm a')}</span>
                    </div>

                    {report.contentPreview && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p className="text-gray-700">{report.contentPreview}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedReport(report);
                      setShowActionDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </div>
            ))}

            {localReports.length === 0 && (
              <div className="text-center py-8">
                <Flag className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No pending reports</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      {showActionDialog && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Take Action on Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm">
                  <span className="font-medium">Reported Content:</span> {selectedReport.contentType}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Reason:</span> {selectedReport.reason}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Action</label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="warn"
                      name="action"
                      value="warn"
                      checked={action === 'warn'}
                      onChange={(e) => setAction(e.target.value as any)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="warn" className="text-sm">Send warning to user</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="delete"
                      name="action"
                      value="delete"
                      checked={action === 'delete'}
                      onChange={(e) => setAction(e.target.value as any)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="delete" className="text-sm text-red-600">Delete content (irreversible)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="ignore"
                      name="action"
                      value="ignore"
                      checked={action === 'ignore'}
                      onChange={(e) => setAction(e.target.value as any)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="ignore" className="text-sm">Ignore - no violation</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add any notes about this action..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {action === 'delete' && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Warning: This will permanently delete the content. This action cannot be undone.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleResolve(selectedReport.id)}
                  variant={action === 'delete' ? 'destructive' : 'default'}
                >
                  Confirm Action
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}