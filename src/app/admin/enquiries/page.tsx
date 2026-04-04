'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton, Card, CardContent } from '@/components/ui/components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/components';
import { toast } from '@/components/ui/toaster';
import { timeAgo } from '@/lib/utils/index';
import type { Enquiry, PaginatedResponse } from '@/types/index';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  read: 'bg-blue-100 text-blue-800',
  replied: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-gray-100 text-gray-800',
};

export default function AdminEnquiriesPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const { data, isLoading } = useQuery<{ success: boolean; data: PaginatedResponse<Enquiry> }>({
    queryKey: ['admin-enquiries', page, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      return fetch(`/api/enquiries?${params}`).then((r) => r.json());
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, adminNote }: { id: string; status?: string; adminNote?: string }) =>
      fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      }).then((r) => r.json()),
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: 'Enquiry updated', variant: 'success' } as Parameters<typeof toast>[0]);
        qc.invalidateQueries({ queryKey: ['admin-enquiries'] });
        setSelected(null);
      }
    },
  });

  const enquiries = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  const openEnquiry = (enquiry: Enquiry) => {
    setSelected(enquiry);
    setAdminNote(enquiry.adminNote || '');
    // Mark as read if pending
    if (enquiry.status === 'pending') {
      updateMutation.mutate({ id: enquiry.id, status: 'read' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Enquiries</h1>
          <p className="text-muted-foreground text-sm">{total} total enquiries</p>
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: total, icon: MessageSquare, color: 'text-blue-500' },
          { label: 'Pending', value: enquiries.filter((e) => e.status === 'pending').length, icon: Clock, color: 'text-amber-500' },
          { label: 'Replied', value: enquiries.filter((e) => e.status === 'replied').length, icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Closed', value: enquiries.filter((e) => e.status === 'closed').length, icon: XCircle, color: 'text-gray-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold font-display">{value}</p>
                </div>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enquiry list */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No enquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                onClick={() => openEnquiry(enquiry)}
                className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-foreground">{enquiry.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[enquiry.status]}`}>
                        {enquiry.status}
                      </span>
                      {enquiry.status === 'pending' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{enquiry.email} {enquiry.phone && `· ${enquiry.phone}`}</p>
                    <p className="text-sm text-foreground/80 line-clamp-2">{enquiry.message}</p>
                    {enquiry.property && (
                      <p className="text-xs text-primary mt-1 truncate">Re: {enquiry.property.title}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {timeAgo(enquiry.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquiry from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{selected.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{selected.phone || '—'}</p></div>
                <div className="col-span-2"><p className="text-xs text-muted-foreground">Property</p>
                  {selected.property ? (
                    <Link href={`/properties/${selected.property.slug}`} className="font-medium text-primary hover:underline" target="_blank">{selected.property.title}</Link>
                  ) : <p className="font-medium">—</p>}
                </div>
                <div><p className="text-xs text-muted-foreground">Received</p><p className="font-medium">{timeAgo(selected.createdAt)}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p>
                  <Select value={selected.status} onValueChange={(v) => updateMutation.mutate({ id: selected.id, status: v })}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Message</p>
                <div className="bg-muted/40 rounded-lg p-3 text-sm whitespace-pre-wrap">{selected.message}</div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Admin Note</p>
                <Textarea
                  rows={3}
                  placeholder="Internal notes..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => updateMutation.mutate({ id: selected.id, adminNote, status: 'replied' })}
                  disabled={updateMutation.isPending}
                  variant="gold"
                  size="sm"
                >
                  Mark Replied & Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
