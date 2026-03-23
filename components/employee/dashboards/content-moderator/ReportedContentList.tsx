'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle, Flag, MessageCircle, ShoppingBag, Star } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface ReportedContent {
  id: string;
  contentType: string;
  contentId: string;
  action: string;
  takenAt: string;
  resolvedBy: string;
}

interface ReportedContentListProps {
  actions: ReportedContent[];
}

export function ReportedContentList({ actions }: ReportedContentListProps) {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return <ShoppingBag className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    if (action.includes('warning')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Moderation Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getContentTypeIcon(action.contentType)}
                    <h4 className="font-semibold">
                      {action.contentType} #{action.contentId.slice(-6)}
                    </h4>
                    <Badge className={getActionColor(action.action)}>
                      {action.action}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Moderator: {action.resolvedBy}</span>
                    <span>•</span>
                    <span>{format(new Date(action.takenAt), 'MMM dd, yyyy h:mm a')}</span>
                  </div>
                </div>
                
                <Link href={`/employee/content-moderator/content/${action.contentId}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {actions.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No moderation actions yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}