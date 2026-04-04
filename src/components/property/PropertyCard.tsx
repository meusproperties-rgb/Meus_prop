'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatFullPrice } from '@/lib/utils/index';
import type { Property } from '@/types/index';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';

export function PropertyCard({ property, className }: PropertyCardProps) {
  const imageUrl = property.coverImage || property.images?.[0]?.url || PLACEHOLDER_IMAGE;
  const summary =
    property.description.length > 110 ? `${property.description.slice(0, 110).trim()}...` : property.description;

  return (
    <Link href={`/properties/${property.slug}`} className={className}>
      <article className="h-full bg-[#1e1e1e] transition-transform duration-300 hover:-translate-y-1">
        <div className="relative h-[360px] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 50vw, 33vw"
          />
        </div>

        <div className="px-8 pb-8 pt-9">
          <div className="mb-4 flex items-center gap-3">
            <p className="text-[16px] uppercase tracking-[0.12em] text-[#88909b]">
              {property.district || property.city}
            </p>
            {property.features?.includes('Off-Plan') && (
              <span className="bg-[#50151c] px-3 py-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#d12d3a]">
                Off-Plan
              </span>
            )}
          </div>

          <h3 className="font-display text-2xl font-medium leading-tight tracking-tight text-white md:text-[30px]">
            {property.title}
          </h3>
          <p className="mt-4 text-[20px] font-medium text-[#d12d3a] md:text-[22px]">{formatFullPrice(Number(property.price))}</p>
          <p className="mt-5 min-h-[80px] text-base leading-relaxed text-[#91959e] md:text-[18px]">{summary}</p>

          <div className="mt-8">
            <div className="flex h-[54px] w-full items-center justify-center bg-[#c62835] text-[16px] font-medium text-white">
              View Details
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-[#1e1e1e]">
      <div className="h-[360px] shimmer" />
      <div className="space-y-4 px-8 pb-8 pt-9">
        <div className="h-4 w-28 shimmer rounded" />
        <div className="h-8 w-64 shimmer rounded" />
        <div className="h-7 w-40 shimmer rounded" />
        <div className="h-20 w-full shimmer rounded" />
        <div className="h-[54px] w-full shimmer rounded" />
      </div>
    </div>
  );
}
