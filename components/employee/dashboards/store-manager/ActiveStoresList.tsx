'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Store, Package, DollarSign, Star, AlertCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface ActiveStore {
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

interface ActiveStoresListProps {
    stores: ActiveStore[];
}

export function ActiveStoresList({ stores }: ActiveStoresListProps) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('revenue');

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(stores.map(s => s.category).filter(Boolean)))];

    const filteredStores = stores
        .filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) ||
                store.owner.businessName.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || store.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'revenue') return b.revenue - a.revenue;
            if (sortBy === 'orders') return b.orders - a.orders;
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'products') return b.products - a.products;
            return 0;
        });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Stores</CardTitle>
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search stores..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat as string}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="orders">Orders</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="products">Products</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredStores.map((store) => (
                        <div key={store.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Store className="h-5 w-5 text-green-500" />
                                        <h4 className="font-semibold text-lg">{store.name}</h4>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Active
                                        </Badge>
                                        {store.category && (
                                            <Badge variant="secondary">{store.category}</Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">
                                        Owner: {store.owner.businessName} • {store.owner.email}
                                    </p>

                                    <div className="grid grid-cols-4 gap-4 mb-3">
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
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            <span className="text-sm">{store.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500">
                                        Opened {format(new Date(store.openedAt), 'MMMM dd, yyyy')}
                                    </p>
                                </div>

                                <Link href={`/employee/store-manager/stores/${store.id}`}>
                                    <Button size="sm" variant="outline">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {filteredStores.length === 0 && (
                        <div className="text-center py-8">
                            <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No active stores found</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}