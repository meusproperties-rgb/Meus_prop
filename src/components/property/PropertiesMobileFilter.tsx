'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyFilters } from './PropertyFilters';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/index';

export function PropertiesMobileFilter() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="h-[52px] w-full justify-center gap-2 text-[13px] uppercase tracking-[0.08em] sm:w-auto">
        <SlidersHorizontal className="w-4 h-4" />
        Filters & Sort
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-sm overflow-y-auto border border-white/10 bg-[#111111]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-tight text-white">Filter Properties</DialogTitle>
          </DialogHeader>
          <PropertyFilters onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

export function PropertiesPagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && typeof value === 'string' && key !== 'page') {
        params.set(key, value);
      }
    });
    params.set('page', String(page));
    return `/listings?${params.toString()}`;
  };

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (currentPage <= 4) return i + 1;
    if (currentPage >= totalPages - 3) return totalPages - 6 + i;
    return currentPage - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <Link href={buildUrl(currentPage - 1)} aria-disabled={currentPage <= 1}>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          className={cn(currentPage <= 1 && 'opacity-50 pointer-events-none')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </Link>

      {pages.map((page) => (
        <Link key={page} href={buildUrl(page)}>
          <Button
            variant={page === currentPage ? 'default' : 'outline'}
            size="icon"
            className={cn(page === currentPage && 'border-[#c62835] bg-[#c62835] text-white')}
          >
            {page}
          </Button>
        </Link>
      ))}

      <Link href={buildUrl(currentPage + 1)} aria-disabled={currentPage >= totalPages}>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          className={cn(currentPage >= totalPages && 'opacity-50 pointer-events-none')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
