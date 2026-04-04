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
      <Button variant="outline" onClick={() => setOpen(true)} className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" />
        Filters & Sort
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Properties</DialogTitle>
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
    return `/properties?${params.toString()}`;
  };

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (currentPage <= 4) return i + 1;
    if (currentPage >= totalPages - 3) return totalPages - 6 + i;
    return currentPage - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-2">
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
            className={cn(page === currentPage && 'bg-primary text-primary-foreground')}
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
