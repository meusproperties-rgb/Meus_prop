'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bath, Bed, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatArea, formatFullPrice, getPropertyTypeLabel, getStatusLabel } from '@/lib/utils/index';
import type { Property } from '@/types/index';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const imageUrl = property.coverImage || property.images?.[0]?.url || null;
  const summary =
    property.description.length > 120 ? `${property.description.slice(0, 120).trim()}...` : property.description;

  return (
    <Link href={`/listings/${property.slug}`} className={className}>
      <article className="group h-full overflow-hidden border border-border bg-card transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
        <div className="relative h-64 w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#161616] via-[#101010] to-[#1b1b1b]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="border border-white/15 bg-black/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85">
              {getStatusLabel(property.status)}
            </span>
            {property.isFeatured ? (
              <span className="border border-accent/30 bg-accent/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                Featured
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-4 bottom-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">{property.district || property.city}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-white">{property.title}</h3>
            {!imageUrl ? (
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/55">No image available from API</p>
            ) : null}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-lg font-semibold text-accent">{formatFullPrice(Number(property.price))}</p>
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {getPropertyTypeLabel(property.type)}
            </span>
          </div>

          <p className="mt-4 min-h-[72px] text-sm leading-7 text-muted-foreground">{summary}</p>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Bed className="h-4 w-4 text-accent" />
              {property.bedrooms ?? '-'} Beds
            </span>
            <span className="inline-flex items-center gap-2">
              <Bath className="h-4 w-4 text-accent" />
              {property.bathrooms ?? '-'} Baths
            </span>
            <span className="inline-flex items-center gap-2">
              <Maximize className="h-4 w-4 text-accent" />
              {formatArea(Number(property.area))}
            </span>
          </div>

          <Button asChild variant="cta" className="mt-6 h-11 w-full text-[12px] uppercase tracking-[0.16em]">
            <span>View Details</span>
          </Button>
        </div>
      </article>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="h-64 shimmer" />
      <div className="space-y-4 p-6">
        <div className="h-6 w-32 shimmer rounded" />
        <div className="h-16 w-full shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-4/5 shimmer rounded" />
        <div className="h-11 w-full shimmer rounded" />
      </div>
    </div>
  );
}
