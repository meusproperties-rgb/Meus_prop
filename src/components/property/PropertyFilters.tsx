'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/components';
import { cn, DUBAI_DISTRICTS } from '@/lib/utils/index';

const PROPERTY_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const PROPERTY_STATUSES = [
  { value: 'for_sale', label: 'Buy' },
  { value: 'for_rent', label: 'Rent' },
];

const BEDROOM_OPTIONS = [
  { value: 'all', label: 'Any Beds' },
  { value: '1', label: '1+ Bed' },
  { value: '2', label: '2+ Beds' },
  { value: '3', label: '3+ Beds' },
  { value: '4', label: '4+ Beds' },
  { value: '5', label: '5+ Beds' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'area_asc', label: 'Area: Small to Large' },
  { value: 'area_desc', label: 'Area: Large to Small' },
];

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
  variant?: 'toolbar' | 'panel';
}

export function PropertyFilters({
  className,
  onClose,
  variant = 'panel',
}: PropertyFiltersProps) {
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

  const isToolbar = variant === 'toolbar';

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    onClose?.();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      sortBy: 'newest',
    });
    router.push(pathname);
    onClose?.();
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => key !== 'sortBy' && value);

  const statusButtonClass = (value: string) =>
    cn(
      'flex-1 px-6 py-3 text-sm uppercase tracking-[0.16em] transition-colors sm:flex-none',
      filters.status === value
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground'
    );

  const toolbarFieldClass =
    'h-12 border-border bg-card/70 text-sm text-foreground shadow-none placeholder:text-muted-foreground';

  if (isToolbar) {
    return (
      <div className={cn('space-y-5', className)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              Search Filters
            </div>
            {hasActiveFilters ? (
              <span className="border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                Active
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            ) : null}
            <Button
              type="button"
              variant="cta"
              className="h-12 px-6 text-xs uppercase tracking-[0.16em]"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-stretch">
          <div className="flex w-full border border-border bg-card lg:w-auto">
            {PROPERTY_STATUSES.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    status: previous.status === status.value ? '' : status.value,
                  }))
                }
                className={statusButtonClass(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select
              value={filters.district || 'all'}
              onValueChange={(value) =>
                setFilters((previous) => ({ ...previous, district: value === 'all' ? '' : value }))
              }
            >
              <SelectTrigger className={toolbarFieldClass}>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {DUBAI_DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.minBedrooms || 'all'}
              onValueChange={(value) =>
                setFilters((previous) => ({ ...previous, minBedrooms: value === 'all' ? '' : value }))
              }
            >
              <SelectTrigger className={toolbarFieldClass}>
                <SelectValue placeholder="Any Beds" />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                setFilters((previous) => ({ ...previous, type: value === 'all' ? '' : value }))
              }
            >
              <SelectTrigger className={toolbarFieldClass}>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters((previous) => ({ ...previous, sortBy: value }))}
            >
              <SelectTrigger className={toolbarFieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search title, district, address..."
              className={cn(toolbarFieldClass, 'pl-10')}
              value={filters.search}
              onChange={(event) =>
                setFilters((previous) => ({ ...previous, search: event.target.value }))
              }
              onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
            />
          </div>

          <Input
            placeholder="Min price"
            type="number"
            className={toolbarFieldClass}
            value={filters.minPrice}
            onChange={(event) =>
              setFilters((previous) => ({ ...previous, minPrice: event.target.value }))
            }
          />

          <Input
            placeholder="Max price"
            type="number"
            className={toolbarFieldClass}
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((previous) => ({ ...previous, maxPrice: event.target.value }))
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-7', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accent" />
          <h3 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-white">Filters</h3>
          {hasActiveFilters ? (
            <span className="bg-[#50151c] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d12d3a]">
              Active
            </span>
          ) : null}
        </div>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs uppercase tracking-[0.06em] text-[#8f939c] hover:text-[#d12d3a]"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            value={filters.search}
            onChange={(event) =>
              setFilters((previous) => ({ ...previous, search: event.target.value }))
            }
            onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label>Listing Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_STATUSES.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  status: previous.status === status.value ? '' : status.value,
                }))
              }
              className={cn(
                'border px-3 py-2 text-sm font-medium transition-colors',
                filters.status === status.value
                  ? 'border-[#c62835] bg-[#c62835] text-white'
                  : 'border-white/15 text-[#a3a5aa] hover:border-white/30 hover:bg-white/5 hover:text-white'
              )}
            >
              {status.label === 'Buy' ? 'For Sale' : 'For Rent'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label>Property Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.filter((type) => type.value !== 'all').map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  type: previous.type === type.value ? '' : type.value,
                }))
              }
              className={cn(
                'border px-3 py-2 text-left text-sm font-medium transition-colors',
                filters.type === type.value
                  ? 'border-[#c62835] bg-[#c62835] text-white'
                  : 'border-white/15 text-[#a3a5aa] hover:border-white/30 hover:bg-white/5 hover:text-white'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label>District</Label>
        <Select
          value={filters.district || 'all'}
          onValueChange={(value) =>
            setFilters((previous) => ({ ...previous, district: value === 'all' ? '' : value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any district</SelectItem>
            {DUBAI_DISTRICTS.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2.5">
        <Label>Price Range (AED)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min price"
            type="number"
            value={filters.minPrice}
            onChange={(event) =>
              setFilters((previous) => ({ ...previous, minPrice: event.target.value }))
            }
          />
          <Input
            placeholder="Max price"
            type="number"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((previous) => ({ ...previous, maxPrice: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label>Min. Bedrooms</Label>
        <div className="flex gap-2">
          {BEDROOM_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  minBedrooms: previous.minBedrooms === option.value ? '' : option.value,
                }))
              }
              className={cn(
                'flex-1 border py-2 text-sm font-medium transition-colors',
                filters.minBedrooms === option.value
                  ? 'border-[#c62835] bg-[#c62835] text-white'
                  : 'border-white/15 text-[#a3a5aa] hover:border-white/30 hover:bg-white/5 hover:text-white'
              )}
            >
              {option.value}+
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label>Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters((previous) => ({ ...previous, sortBy: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        onClick={applyFilters}
        className="h-[56px] w-full text-[14px] uppercase tracking-[0.08em]"
        variant="gold"
      >
        Apply Filters
      </Button>
    </div>
  );
}
