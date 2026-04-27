'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Settings2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils/index';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    description: 'Overview and activity',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/properties',
    label: 'Listings',
    description: 'Manage all properties',
    icon: Building2,
  },
  {
    href: '/admin/enquiries',
    label: 'Enquiries',
    description: 'Buyer and renter leads',
    icon: MessageSquare,
  },
  {
    href: '/admin/users',
    label: 'Team',
    description: 'Users and access',
    icon: Users,
  },
];

const pageMeta = [
  {
    match: (pathname: string) => pathname === '/admin',
    title: 'Command center',
    description: 'Track listings, leads, and recent activity across the business.',
  },
  {
    match: (pathname: string) => pathname.startsWith('/admin/properties/new'),
    title: 'New listing',
    description: 'Create a polished property entry with media, pricing, and visibility settings.',
  },
  {
    match: (pathname: string) => /^\/admin\/properties\/[^/]+$/.test(pathname),
    title: 'Edit listing',
    description: 'Refine the content, media, and publication settings for this property.',
  },
  {
    match: (pathname: string) => pathname.startsWith('/admin/properties'),
    title: 'Listings',
    description: 'Review, search, and update the full property inventory.',
  },
  {
    match: (pathname: string) => pathname.startsWith('/admin/enquiries'),
    title: 'Enquiries',
    description: 'Stay on top of incoming leads and follow-up activity.',
  },
  {
    match: (pathname: string) => pathname.startsWith('/admin/users'),
    title: 'Team',
    description: 'See who has access and how recent signups are trending.',
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session.user.role !== 'admin') router.push('/');
  }, [router, session, status]);

  if (status === 'loading') {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') return null;

  const currentMeta =
    pageMeta.find((item) => item.match(pathname)) ?? pageMeta[0];

  return (
    <div className="admin-theme min-h-screen text-foreground">
      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
          <div className="border-b border-sidebar-border px-6 py-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">Meus Admin</p>
                <p className="text-xs text-sidebar-foreground/70">Luxury operations panel</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-5">
            <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
              Navigation
            </p>
            <div className="space-y-1.5">
              {navItems.map(({ href, label, description, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-all',
                      active
                        ? 'border-sidebar-border bg-sidebar-accent text-white shadow-sm'
                        : 'text-sidebar-foreground hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        active ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-sidebar-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="mt-0.5 text-xs text-inherit/60">{description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="px-4 pb-4">
            <div className="rounded-2xl border border-sidebar-border bg-white/5 p-4">
              <p className="section-title text-sidebar-foreground/50">Quick Action</p>
              <p className="mt-2 text-sm font-medium text-white">Add a new listing</p>
              <p className="mt-1 text-xs text-sidebar-foreground/65">
                Create a fresh property entry with media and pricing in one flow.
              </p>
              <Link
                href="/admin/properties/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Listing
              </Link>
            </div>
          </div>

          <div className="mt-auto border-t border-sidebar-border px-4 py-4">
            <div className="rounded-2xl border border-sidebar-border bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                  {session.user.name?.charAt(0) ?? 'A'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{session.user.name}</p>
                  <p className="truncate text-xs text-sidebar-foreground/65">{session.user.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border/80 bg-background/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-title">{currentMeta.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{currentMeta.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/properties/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95"
                >
                  <Plus className="h-4 w-4" />
                  Add Listing
                </Link>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Settings2 className="h-4 w-4" />
                  Team
                </Link>
              </div>
            </div>
            <div className="border-t border-border/70 bg-background/70 px-4 py-3 lg:hidden">
              <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'border-primary/20 bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
