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
    <div className={cn('space-y-7', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#d12d3a]" />
          <h3 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-white">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-[#50151c] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d12d3a]">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs uppercase tracking-[0.06em] text-[#8f939c] hover:text-[#d12d3a]">
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2.5">
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
      <div className="space-y-2.5">
        <Label>Listing Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilters((p) => ({ ...p, status: p.status === s.value ? '' : s.value }))}
              className={cn('border px-3 py-2 text-sm font-medium transition-colors',
                filters.status === s.value
                  ? 'border-[#c62835] bg-[#c62835] text-white'
                  : 'border-white/15 text-[#a3a5aa] hover:border-white/30 hover:bg-white/5 hover:text-white')}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2.5">
        <Label>Property Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilters((p) => ({ ...p, type: p.type === t.value ? '' : t.value }))}
              className={cn('border px-3 py-2 text-left text-sm font-medium transition-colors',
                filters.type === t.value
                  ? 'border-[#c62835] bg-[#c62835] text-white'
                  : 'border-white/15 text-[#a3a5aa] hover:border-white/30 hover:bg-white/5 hover:text-white')}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* District */}
      <div className="space-y-2.5">
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
      <div className="space-y-2.5">
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
      <div className="space-y-2.5">
        <Label>Min. Bedrooms</Label>
        <div className="flex gap-2">
          {BEDROOM_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => setFilters((p) => ({ ...p, minBedrooms: p.minBedrooms === b.replace('+', '') ? '' : b.replace('+', '') }))}
              className={cn('flex-1 border py-2 text-sm font-medium transition-colors',
                filters.minBedrooms === b.replace('+', '')
                  ? 'border-[#c62835] bg-[#c62835] text-white'
                  : 'border-white/15 text-[#a3a5aa] hover:border-white/30 hover:bg-white/5 hover:text-white')}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2.5">
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
      <Button onClick={applyFilters} className="h-[56px] w-full text-[14px] uppercase tracking-[0.08em]" variant="gold">
        Apply Filters
      </Button>
    </div>
  );
}
