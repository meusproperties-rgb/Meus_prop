'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
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

const READINESS_STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'off-plan', label: 'Off-Plan' },
  { value: 'ready', label: 'Ready' },
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
  readiness: string;
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

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

interface ToolbarDropdownOption {
  value: string;
  label: string;
}

interface ToolbarDropdownProps {
  value: string;
  options: ToolbarDropdownOption[];
  className?: string;
  menuClassName?: string;
  onChange: (value: string) => void;
}

function ToolbarDropdown({
  value,
  options,
  className,
  menuClassName,
  onChange,
}: ToolbarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn('relative w-full sm:w-auto', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between gap-4 border border-border bg-card px-4 text-left text-sm font-normal text-foreground outline-none transition-colors hover:border-accent/50 focus:border-accent/50"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          className={cn(
            'absolute left-0 top-full z-50 max-h-72 w-full overflow-y-auto border-x border-b border-border bg-card py-0 text-foreground shadow-sm',
            menuClassName
          )}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = selectedOption.value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setIsOpen(false);
                  onChange(option.value);
                }}
                className={cn(
                  'block h-[34px] w-full truncate px-4 text-left text-sm leading-[34px] text-foreground outline-none transition-colors hover:bg-secondary',
                  isSelected && 'bg-secondary'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedValue = value || 'all';
  const selectedLabel =
    READINESS_STATUSES.find((status) => status.value === selectedValue)?.label || 'All Status';

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-full min-w-[180px] items-center justify-between gap-4 border border-border bg-card px-4 text-left text-sm font-normal text-foreground outline-none transition-colors hover:border-accent/50 focus:border-accent/50 sm:w-[180px]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="whitespace-nowrap">{selectedLabel}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-50 w-full min-w-[180px] border-x border-b border-border bg-card py-0 text-foreground shadow-sm sm:w-[180px]"
          role="listbox"
        >
          {READINESS_STATUSES.map((status) => {
            const isSelected = selectedValue === status.value;

            return (
              <button
                key={status.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setIsOpen(false);
                  onChange(status.value === 'all' ? '' : status.value);
                }}
                className={cn(
                  'block h-[34px] w-full whitespace-nowrap px-4 text-left text-sm leading-[34px] text-foreground outline-none transition-colors hover:bg-secondary',
                  isSelected && 'bg-secondary'
                )}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
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
    status: searchParams.get('status') || 'for_sale',
    readiness: searchParams.get('readiness') || '',
    district: searchParams.get('district') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBedrooms: searchParams.get('minBedrooms') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const isToolbar = variant === 'toolbar';

  const pushFilters = (nextFilters: FilterValues) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value && !(key === 'sortBy' && value === 'newest')) {
        params.set(key, value);
      }
    });
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const applyFilters = () => {
    pushFilters(filters);
    onClose?.();
  };

  const updateToolbarFilter = (key: keyof FilterValues, value: string) => {
    const nextFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(nextFilters);
    window.setTimeout(() => pushFilters(nextFilters), 0);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: 'for_sale',
      readiness: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      sortBy: 'newest',
    });
    router.push(`${pathname}?status=for_sale&page=1`);
    onClose?.();
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => key !== 'sortBy' && value);

  const statusButtonClass = (value: string) =>
    cn(
      'flex-1 px-7 py-3 text-sm uppercase tracking-[0.12em] transition-colors sm:flex-none',
      filters.status === value
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    );

  const districtOptions = [
    { value: 'all', label: 'All' },
    ...DUBAI_DISTRICTS.map((district) => ({ value: district, label: district })),
  ];

  if (isToolbar) {
    return (
      <div className={cn('space-y-5', className)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              Search Filters
            </div> */}
            {hasActiveFilters ? (
              <span className="border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                Active
              </span>
            ) : null}
          </div>

          {/* <div className="flex items-center gap-3">
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
          </div> */}
        </div>

        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-stretch">
          <div className="flex w-full border border-border bg-card lg:w-auto">
            {PROPERTY_STATUSES.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => updateToolbarFilter('status', status.value)}
                className={statusButtonClass(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="grid flex-1 gap-5 md:grid-cols-3 xl:flex xl:flex-none">
            <ToolbarDropdown
              value={filters.district || 'all'}
              options={districtOptions}
              className="xl:w-64"
              menuClassName="xl:w-64"
              onChange={(value) => updateToolbarFilter('district', value === 'all' ? '' : value)}
            />

            <ToolbarDropdown
              value={filters.minBedrooms || 'all'}
              options={BEDROOM_OPTIONS}
              className="xl:w-32"
              menuClassName="xl:w-32"
              onChange={(value) => updateToolbarFilter('minBedrooms', value === 'all' ? '' : value)}
            />

            <StatusDropdown
              value={filters.readiness}
              onChange={(value) => updateToolbarFilter('readiness', value)}
            />
          </div>
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
                  status: status.value,
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
