'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, UserRound, Users } from 'lucide-react';
import { AdminPageIntro, AdminPanel, AdminStatTile } from '@/components/admin/AdminUI';
import { Badge, Skeleton } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { timeAgo } from '@/lib/utils/index';
import type { PaginatedResponse, User } from '@/types/index';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{ success: boolean; data: PaginatedResponse<User> }>({
    queryKey: ['admin-users', page],
    queryFn: () => fetch(`/api/admin/users?page=${page}&limit=12`).then((response) => response.json()),
  });

  const users = data?.data.items ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = data?.data.totalPages ?? 1;
  const adminCount = users.filter((user) => user.role === 'admin').length;

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Team"
        title="Users and access"
        description="A simple snapshot of who has accounts inside the platform and when they joined."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatTile label="Total Users" value={isLoading ? '...' : total} icon={Users} tone="secondary" />
        <AdminStatTile label="Admins" value={isLoading ? '...' : adminCount} icon={ShieldCheck} tone="primary" />
        <AdminStatTile
          label="Standard Users"
          value={isLoading ? '...' : Math.max(users.length - adminCount, 0)}
          icon={UserRound}
          tone="emerald"
        />
      </div>

      <AdminPanel title="Account Directory" description="Recent user records and their current role.">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[minmax(0,1.5fr)_140px_140px] gap-4 border-b border-border bg-muted/60 px-4 py-3 text-sm font-medium text-muted-foreground">
            <div>User</div>
            <div>Role</div>
            <div>Joined</div>
          </div>
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No users found.</div>
          ) : (
            <div className="divide-y divide-border bg-card">
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-[minmax(0,1.5fr)_140px_140px] gap-4 px-4 py-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <Badge variant={user.role === 'admin' ? 'gold' : 'secondary'}>{user.role}</Badge>
                  </div>
                  <div className="text-muted-foreground">{timeAgo(user.createdAt)}</div>
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
    </div>
  );
}
