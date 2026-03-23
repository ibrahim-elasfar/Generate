'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Eye, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { UPDATE_TICKET_STATUS, ESCALATE_TICKET } from '@/graphql/employee/mutations';

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  status: string;
  priority: string;
  createdAt: string;
  lastUpdated: string;
  description?: string;
}

interface OpenTicketsListProps {
  tickets: Ticket[];
  showAll?: boolean;
}

export function OpenTicketsList({ tickets, showAll = false }: OpenTicketsListProps) {
  const [updateStatus] = useMutation(UPDATE_TICKET_STATUS);
  const [escalateTicket] = useMutation(ESCALATE_TICKET);
  const [localTickets, setLocalTickets] = useState(tickets);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [action, setAction] = useState<'resolve' | 'escalate'>('resolve');
  const [resolution, setResolution] = useState('');

  const handleAction = async () => {
    if (!selectedTicket) return;
    
    try {
      if (action === 'resolve') {
        await updateStatus({
          variables: {
            ticketId: selectedTicket.id,
            status: 'resolved',
            resolution
          }
        });
        setLocalTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
      } else {
        await escalateTicket({
          variables: {
            ticketId: selectedTicket.id,
            reason: resolution
          }
        });
        setLocalTickets(prev => prev.map(t => 
          t.id === selectedTicket.id ? { ...t, status: 'escalated' } : t
        ));
      }
      setShowActionDialog(false);
      setResolution('');
    } catch (error) {
      console.error('Failed to update ticket:', error);
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

  const filteredTickets = localTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const displayTickets = showAll ? filteredTickets : filteredTickets.slice(0, 5);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Open Support Tickets</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold">{ticket.subject}</h4>
                      <Badge variant={
                        ticket.status === 'open' ? 'default' :
                        ticket.status === 'in_progress' ? 'secondary' : 'outline'
                      }>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User className="h-3 w-3" />
                      <span>{ticket.customer}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last updated {format(new Date(ticket.lastUpdated), 'h:mm a')}
                      </span>
                    </div>

                    {ticket.description && (
                      <p className="mt-2 text-sm text-gray-700 line-clamp-2">{ticket.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Link href={`/employee/support-agent/tickets/${ticket.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setAction('resolve');
                        setShowActionDialog(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-orange-600"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setAction('escalate');
                        setShowActionDialog(true);
                      }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No open tickets</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      {showActionDialog && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>
                {action === 'resolve' ? 'Resolve Ticket' : 'Escalate Ticket'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">{selectedTicket.subject}</p>
                <p className="text-sm text-gray-600 mt-1">Customer: {selectedTicket.customer}</p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {action === 'resolve' ? 'Resolution Notes' : 'Escalation Reason'}
                </label>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder={action === 'resolve' 
                    ? 'Describe how this ticket was resolved...'
                    : 'Explain why this ticket needs to be escalated...'
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>

              {action === 'escalate' && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Escalated tickets will be reviewed by a senior support agent or manager.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAction}
                  disabled={!resolution.trim()}
                  variant={action === 'escalate' ? 'destructive' : 'default'}
                >
                  {action === 'resolve' ? 'Resolve Ticket' : 'Escalate Ticket'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}