'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Plus, Search, Sparkles, Star, Trash2 } from 'lucide-react';
import { AdminPageIntro, AdminPanel, AdminStatTile } from '@/components/admin/AdminUI';
import { Badge, Skeleton } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toaster';
import {
  formatPrice,
  getPropertyTypeLabel,
  getStatusColor,
  getStatusLabel,
  timeAgo,
} from '@/lib/utils/index';
import type { PaginatedResponse, Property } from '@/types/index';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60';

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ success: boolean; data: PaginatedResponse<Property> }>({
    queryKey: ['admin-properties', page, search],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      return fetch(`/api/properties?${params}`).then((r) => r.json());
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/properties/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: (response) => {
      if (response.success) {
        toast({ title: 'Property deleted', variant: 'success' } as Parameters<typeof toast>[0]);
        queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      } else {
        toast({ title: 'Error', description: response.error, variant: 'destructive' } as Parameters<typeof toast>[0]);
      }
      setDeleteId(null);
    },
  });

  const properties = data?.data.items ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = data?.data.totalPages ?? 1;
  const featuredCount = properties.filter((property) => property.isFeatured).length;
  const activeCount = properties.filter((property) => property.isActive).length;

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Listings"
        title="Property inventory"
        description="Search, review, and edit the listings that power the public site."
        actions={
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            New Listing
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatTile label="Total Loaded" value={isLoading ? '...' : total} icon={Sparkles} tone="secondary" />
        <AdminStatTile label="Featured" value={isLoading ? '...' : featuredCount} icon={Star} tone="amber" />
        <AdminStatTile label="Visible" value={isLoading ? '...' : activeCount} icon={Eye} tone="emerald" />
      </div>

      <AdminPanel title="Listing Manager" description="Use search to narrow the table and jump into edits quickly.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, area, or location..."
              className="h-11 border-border bg-muted pl-10"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="rounded-lg border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground lg:w-[240px]">
            {total} total listings across the current results set.
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium text-muted-foreground">Property</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Status</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">Views</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground xl:table-cell">Listed</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3"><Skeleton className="h-12 w-full rounded-xl" /></td>
                    <td className="hidden px-4 py-3 sm:table-cell"><Skeleton className="h-5 w-20 rounded" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-24 rounded" /></td>
                    <td className="hidden px-4 py-3 md:table-cell"><Skeleton className="h-5 w-16 rounded" /></td>
                    <td className="hidden px-4 py-3 lg:table-cell"><Skeleton className="h-5 w-10 rounded" /></td>
                    <td className="hidden px-4 py-3 xl:table-cell"><Skeleton className="h-5 w-20 rounded" /></td>
                    <td className="px-4 py-3"><Skeleton className="ml-auto h-8 w-24 rounded" /></td>
                  </tr>
                ))
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    No properties found.{' '}
                    <Link href="/admin/properties/new" className="font-medium text-primary hover:underline">
                      Add the first one
                    </Link>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="border-b border-border transition-colors hover:bg-muted/30 last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={property.coverImage || property.images?.[0]?.url || PLACEHOLDER}
                            alt={property.title}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-foreground">{property.title}</p>
                            {property.isFeatured ? (
                              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-500 text-amber-500" />
                            ) : null}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {property.city}
                            {property.district ? `, ${property.district}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge variant="secondary">{getPropertyTypeLabel(property.type)}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatPrice(Number(property.price))}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{property.viewCount}</td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground xl:table-cell">{timeAgo(property.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/properties/${property.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="View">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/admin/properties/${property.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        {deleteId === property.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 px-3 text-xs"
                              onClick={() => deleteMutation.mutate(property.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? '...' : 'Confirm'}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={() => setDeleteId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                            onClick={() => setDeleteId(property.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </AdminPanel>
    </div>
  );
}
