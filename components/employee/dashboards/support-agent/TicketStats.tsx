'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Users, Star } from 'lucide-react';
import { format } from 'date-fns';

interface TicketStatsProps {
    stats?: {
        openTickets: number;
        resolvedToday: number;
        averageResponseTime: number;
        customerSatisfaction: number;
        ticketsByPriority?: {
            low: number;
            medium: number;
            high: number;
            urgent: number;
        };
    };
    resolvedTickets: any[];
}

export function TicketStats({ stats, resolvedTickets }: TicketStatsProps) {
    if (!stats) return null;

    const totalResolved = resolvedTickets.length;
    const satisfactionRate = (stats.customerSatisfaction / 5) * 100;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Priority Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Urgent */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Urgent</span>
                                    <span className="font-medium">{stats.ticketsByPriority?.urgent || 0}</span>
                                </div>
                                <Progress
                                    value={((stats.ticketsByPriority?.urgent || 0) / stats.openTickets) * 100}
                                    className="h-2 bg-gray-200 [&>div]:bg-red-500"
                                />
                            </div>

                            {/* High */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>High</span>
                                    <span className="font-medium">{stats.ticketsByPriority?.high || 0}</span>
                                </div>
                                <Progress
                                    value={((stats.ticketsByPriority?.high || 0) / stats.openTickets) * 100}
                                    className="h-2 bg-gray-200 [&>div]:bg-orange-500"
                                />
                            </div>

                            {/* Medium */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Medium</span>
                                    <span className="font-medium">{stats.ticketsByPriority?.medium || 0}</span>
                                </div>
                                <Progress
                                    value={((stats.ticketsByPriority?.medium || 0) / stats.openTickets) * 100}
                                    className="h-2 bg-gray-200 [&>div]:bg-yellow-500"
                                />
                            </div>

                            {/* Low */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Low</span>
                                    <span className="font-medium">{stats.ticketsByPriority?.low || 0}</span>
                                </div>
                                <Progress
                                    value={((stats.ticketsByPriority?.low || 0) / stats.openTickets) * 100}
                                    className="h-2 bg-gray-200 [&>div]:bg-green-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm">Average Response Time</span>
                                </div>
                                <span className="font-semibold">{stats.averageResponseTime.toFixed(1)} minutes</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    <span className="text-sm">Resolution Rate</span>
                                </div>
                                <span className="font-semibold">{((stats.resolvedToday / 8) * 100).toFixed(1)}%</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-sm">Customer Satisfaction</span>
                                </div>
                                <span className="font-semibold">{stats.customerSatisfaction.toFixed(1)}/5</span>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Satisfaction Rate</span>
                                    <span>{satisfactionRate.toFixed(1)}%</span>
                                </div>
                                <Progress value={satisfactionRate} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recently Resolved */}
            <Card>
                <CardHeader>
                    <CardTitle>Recently Resolved Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {resolvedTickets.slice(0, 5).map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium">{ticket.subject}</p>
                                    <p className="text-sm text-gray-600">{ticket.customer}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Resolved
                                    </Badge>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {format(new Date(ticket.resolvedAt), 'MMM dd, h:mm a')}
                                    </p>
                                    {ticket.satisfaction && (
                                        <p className="text-xs text-yellow-600 mt-1">
                                            Satisfaction: {ticket.satisfaction}/5
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}