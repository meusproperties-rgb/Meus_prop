'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/components';
import { cn } from '@/lib/utils/index';
import { DUBAI_DISTRICTS } from '@/lib/utils/index';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const PROPERTY_STATUSES = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'for_rent', label: 'For Rent' },
];

const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5+'];

interface FilterValues {
  search: string;
  type: string;
  status: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  sortBy: string;
}

interface PropertyFiltersProps {
  className?: string;
  onClose?: () => void;
}

export function PropertyFilters({ className, onClose }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterValues>({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    district: searchParams.get('district') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBedrooms: searchParams.get('minBedrooms') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    onClose?.();
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', status: '', district: '', minPrice: '', maxPrice: '', minBedrooms: '', sortBy: 'newest' });
    router.push(pathname);
    onClose?.();
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => v && k !== 'sortBy');

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Listing Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilters((p) => ({ ...p, status: p.status === s.value ? '' : s.value }))}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium border transition-all',
                filters.status === s.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label>Property Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilters((p) => ({ ...p, type: p.type === t.value ? '' : t.value }))}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium border transition-all text-left',
                filters.type === t.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* District */}
      <div className="space-y-2">
        <Label>District</Label>
        <Select value={filters.district} onValueChange={(v) => setFilters((p) => ({ ...p, district: v === 'all' ? '' : v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Any district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any district</SelectItem>
            {DUBAI_DISTRICTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range (AED)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
          />
          <Input
            placeholder="Max price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <Label>Min. Bedrooms</Label>
        <div className="flex gap-2">
          {BEDROOM_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => setFilters((p) => ({ ...p, minBedrooms: p.minBedrooms === b.replace('+', '') ? '' : b.replace('+', '') }))}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium border transition-all',
                filters.minBedrooms === b.replace('+', '')
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(v) => setFilters((p) => ({ ...p, sortBy: v }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="area_asc">Area: Small to Large</SelectItem>
            <SelectItem value="area_desc">Area: Large to Small</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apply */}
      <Button onClick={applyFilters} className="w-full" variant="gold">
        Apply Filters
      </Button>
    </div>
  );
}
