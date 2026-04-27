'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, Eye, MessageSquare, XCircle } from 'lucide-react';
import { AdminPageIntro, AdminPanel, AdminStatTile } from '@/components/admin/AdminUI';
import { Button } from '@/components/ui/button';
import {
  Badge,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Textarea,
} from '@/components/ui/components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toaster';
import { timeAgo } from '@/lib/utils/index';
import type { Enquiry, PaginatedResponse } from '@/types/index';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/12 text-amber-700 border border-amber-500/20',
  read: 'bg-sky-500/10 text-sky-700 border border-sky-500/20',
  replied: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
  closed: 'bg-secondary/8 text-secondary border border-border',
};

export default function AdminEnquiriesPage() {
  const queryClient = useQueryClient();
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
    onSuccess: (response) => {
      if (response.success) {
        toast({ title: 'Enquiry updated', variant: 'success' } as Parameters<typeof toast>[0]);
        queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
        setSelected(null);
      }
    },
  });

  const enquiries = data?.data.items ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = data?.data.totalPages ?? 1;

  const openEnquiry = (enquiry: Enquiry) => {
    setSelected(enquiry);
    setAdminNote(enquiry.adminNote || '');

    if (enquiry.status === 'pending') {
      updateMutation.mutate({ id: enquiry.id, status: 'read' });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Inbox"
        title="Lead management"
        description="Review new conversations, mark progress, and save notes for follow-up."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AdminStatTile label="Total" value={isLoading ? '...' : total} icon={MessageSquare} tone="secondary" />
        <AdminStatTile
          label="Pending"
          value={isLoading ? '...' : enquiries.filter((enquiry) => enquiry.status === 'pending').length}
          icon={Clock}
          tone="amber"
        />
        <AdminStatTile
          label="Replied"
          value={isLoading ? '...' : enquiries.filter((enquiry) => enquiry.status === 'replied').length}
          icon={CheckCircle}
          tone="emerald"
        />
        <AdminStatTile
          label="Closed"
          value={isLoading ? '...' : enquiries.filter((enquiry) => enquiry.status === 'closed').length}
          icon={XCircle}
          tone="primary"
        />
      </div>

      <AdminPanel title="Enquiry Inbox" description="Filter by status and open any message for more detail.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="rounded-lg border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            {total} enquiries in the current mailbox.
          </div>
          <Select
            value={statusFilter || 'all'}
            onValueChange={(value) => {
              setStatusFilter(value === 'all' ? '' : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-full border-border bg-muted lg:w-[220px]">
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

        <div className="overflow-hidden rounded-xl border border-border">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : enquiries.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No enquiries found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border bg-card">
              {enquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  onClick={() => openEnquiry(enquiry)}
                  className="cursor-pointer px-4 py-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{enquiry.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[enquiry.status]}`}>
                          {enquiry.status}
                        </span>
                        {enquiry.status === 'pending' ? (
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {enquiry.email}
                        {enquiry.phone ? ` · ${enquiry.phone}` : ''}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{enquiry.message}</p>
                      {enquiry.property ? (
                        <p className="mt-2 truncate text-xs font-medium text-primary">
                          Re: {enquiry.property.title}
                        </p>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {timeAgo(enquiry.createdAt)}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <Eye className="h-3.5 w-3.5" />
                        Open
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Enquiry from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-border shadow-none">
                  <CardContent className="space-y-2 p-4">
                    <p className="section-title">Contact</p>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{selected.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{selected.phone || '-'}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-none">
                  <CardContent className="space-y-2 p-4">
                    <p className="section-title">Context</p>
                    <div>
                      <p className="text-xs text-muted-foreground">Received</p>
                      <p className="text-sm font-medium">{timeAgo(selected.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Property</p>
                      {selected.property ? (
                        <Link href={`/properties/${selected.property.slug}`} target="_blank" className="text-sm font-medium text-primary hover:underline">
                          {selected.property.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium">-</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <p className="section-title mb-2">Status</p>
                <Select
                  value={selected.status}
                  onValueChange={(value) => updateMutation.mutate({ id: selected.id, status: value })}
                >
                  <SelectTrigger className="h-11 border-border bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="section-title mb-2">Message</p>
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div>
                <p className="section-title mb-2">Internal Note</p>
                <Textarea
                  rows={4}
                  className="border-border bg-muted"
                  placeholder="Save context for the next follow-up..."
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => updateMutation.mutate({ id: selected.id, adminNote, status: 'replied' })}
                  disabled={updateMutation.isPending}
                  className="bg-primary text-primary-foreground hover:opacity-95"
                >
                  Mark Replied & Save
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
