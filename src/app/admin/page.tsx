'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, MessageSquare, Users, Star, TrendingUp, Eye, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui/components';
import { Badge } from '@/components/ui/components';
import { formatPrice, timeAgo, getStatusColor, getStatusLabel } from '@/lib/utils/index';
import type { DashboardStats } from '@/types/index';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ['admin-stats'],
    queryFn: () => fetch('/api/admin/stats').then((r) => r.json()),
  });

  const stats = data?.data;

  const statCards = [
    { label: 'Total Properties', value: stats?.totalProperties, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50', href: '/admin/properties' },
    { label: 'Active Listings', value: stats?.activeProperties, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', href: '/admin/properties?isActive=true' },
    { label: 'Pending Enquiries', value: stats?.pendingEnquiries, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50', href: '/admin/enquiries?status=pending' },
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', href: '/admin/users' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/admin/properties/new">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity">
            + Add Property
          </button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                    {isLoading ? (
                      <Skeleton className="h-7 w-16" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground font-display">{value ?? '—'}</p>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent properties */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Properties</CardTitle>
              <Link href="/admin/properties" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : stats?.recentProperties?.length ? (
              <div className="divide-y divide-border/50">
                {stats.recentProperties.map((p) => (
                  <div key={p.id} className="py-3 flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={p.coverImage || (p.images?.[0]?.url) || PLACEHOLDER}
                        alt={p.title}
                        width={48}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/admin/properties/${p.id}`} className="text-sm font-medium text-foreground hover:text-primary truncate block">
                        {p.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(p.status)}`}>{getStatusLabel(p.status)}</span>
                        <span className="text-xs text-muted-foreground">{formatPrice(Number(p.price))}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs shrink-0">
                      <Eye className="w-3 h-3" />{p.viewCount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No properties yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent enquiries */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Enquiries</CardTitle>
              <Link href="/admin/enquiries" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : stats?.recentEnquiries?.length ? (
              <div className="divide-y divide-border/50">
                {stats.recentEnquiries.map((e) => (
                  <div key={e.id} className="py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{e.name}</p>
                      <Badge variant={e.status === 'pending' ? 'gold' : e.status === 'replied' ? 'emerald' : 'secondary'} className="text-xs">
                        {e.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{e.message}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {timeAgo(e.createdAt)}
                      {e.property && <span className="truncate ml-1">· {e.property.title}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No enquiries yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
