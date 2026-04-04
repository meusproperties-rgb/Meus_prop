'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Eye, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, Skeleton } from '@/components/ui/components';
import { toast } from '@/components/ui/toaster';
import { formatPrice, getStatusColor, getStatusLabel, getPropertyTypeLabel, timeAgo } from '@/lib/utils/index';
import type { Property, PaginatedResponse } from '@/types/index';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60';

export default function AdminPropertiesPage() {
  const qc = useQueryClient();
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
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: 'Property deleted', variant: 'success' } as Parameters<typeof toast>[0]);
        qc.invalidateQueries({ queryKey: ['admin-properties'] });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' } as Parameters<typeof toast>[0]);
      }
      setDeleteId(null);
    },
  });

  const properties = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground text-sm">{total} total properties</p>
        </div>
        <Link href="/admin/properties/new">
          <Button variant="gold" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Property
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          className="pl-9"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Property</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Views</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden xl:table-cell">Listed</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-3 px-4"><Skeleton className="h-10 w-full rounded" /></td>
                    <td className="py-3 px-4 hidden sm:table-cell"><Skeleton className="h-5 w-20 rounded" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-24 rounded" /></td>
                    <td className="py-3 px-4 hidden md:table-cell"><Skeleton className="h-5 w-16 rounded" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-5 w-10 rounded" /></td>
                    <td className="py-3 px-4 hidden xl:table-cell"><Skeleton className="h-5 w-20 rounded" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-8 w-20 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    No properties found.{' '}
                    <Link href="/admin/properties/new" className="text-primary hover:underline">Add one</Link>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image
                            src={property.coverImage || (property.images?.[0]?.url) || PLACEHOLDER}
                            alt={property.title}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[180px]">{property.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{property.city}{property.district && `, ${property.district}`}</p>
                        </div>
                        {property.isFeatured && <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500 shrink-0" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge variant="secondary">{getPropertyTypeLabel(property.type)}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatPrice(Number(property.price))}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{property.viewCount}</td>
                    <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground text-xs">{timeAgo(property.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/properties/${property.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/admin/properties/${property.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        {deleteId === property.id ? (
                          <div className="flex gap-1">
                            <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => deleteMutation.mutate(property.id)} disabled={deleteMutation.isPending}>
                              {deleteMutation.isPending ? '...' : 'Confirm'}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setDeleteId(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete" onClick={() => setDeleteId(property.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
