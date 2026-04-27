'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Building2,
  Clock,
  Eye,
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Badge, Skeleton } from '@/components/ui/components';
import { AdminPageIntro, AdminPanel, AdminStatTile } from '@/components/admin/AdminUI';
import { formatPrice, getStatusColor, getStatusLabel, timeAgo } from '@/lib/utils/index';
import type { DashboardStats } from '@/types/index';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ['admin-stats'],
    queryFn: () => fetch('/api/admin/stats').then((r) => r.json()),
  });

  const stats = data?.data;

  const statCards = [
    {
      label: 'Total Listings',
      value: stats?.totalProperties ?? 0,
      icon: Building2,
      tone: 'secondary' as const,
      href: '/admin/properties',
      hint: 'All properties currently stored in the system',
    },
    {
      label: 'Live Listings',
      value: stats?.activeProperties ?? 0,
      icon: TrendingUp,
      tone: 'emerald' as const,
      href: '/admin/properties?isActive=true',
      hint: 'Listings visible to customers right now',
    },
    {
      label: 'Pending Enquiries',
      value: stats?.pendingEnquiries ?? 0,
      icon: MessageSquare,
      tone: 'amber' as const,
      href: '/admin/enquiries?status=pending',
      hint: 'Leads still waiting for a response',
    },
    {
      label: 'Team Members',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      tone: 'primary' as const,
      href: '/admin/users',
      hint: 'Users with accounts inside the platform',
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Overview"
        title="Admin dashboard"
        description="A quick pulse on listings, enquiries, and who needs your attention today."
        actions={
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95"
          >
            Add Listing
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <AdminStatTile
            key={card.label}
            label={card.label}
            value={isLoading ? '...' : card.value}
            icon={card.icon}
            tone={card.tone}
            hint={card.hint}
            href={card.href}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminPanel
          title="Recent Listings"
          description="Fresh property entries and their current status."
          action={
            <Link href="/admin/properties" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : stats?.recentProperties?.length ? (
            <div className="divide-y divide-border">
              {stats.recentProperties.map((property) => (
                <div key={property.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={property.coverImage || property.images?.[0]?.url || PLACEHOLDER}
                      alt={property.title}
                      width={64}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="block truncate text-sm font-medium text-foreground hover:text-primary"
                    >
                      {property.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatPrice(Number(property.price))}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" />
                      {property.viewCount}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(property.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">No listings yet.</p>
          )}
        </AdminPanel>

        <AdminPanel
          title="Recent Enquiries"
          description="The latest messages from buyers and renters."
          action={
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : stats?.recentEnquiries?.length ? (
            <div className="divide-y divide-border">
              {stats.recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{enquiry.name}</p>
                    <Badge
                      variant={
                        enquiry.status === 'pending'
                          ? 'gold'
                          : enquiry.status === 'replied'
                            ? 'emerald'
                            : 'secondary'
                      }
                      className="text-[11px]"
                    >
                      {enquiry.status}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{enquiry.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(enquiry.createdAt)}
                    </span>
                    {enquiry.property ? <span>{enquiry.property.title}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">No enquiries yet.</p>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
