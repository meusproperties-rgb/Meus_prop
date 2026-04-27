import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bath, Bed, Building2, ChevronLeft, MapPin, Maximize, ShieldCheck } from 'lucide-react';
import { EnquiryForm } from '@/components/property/EnquiryForm';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { getPublicProperty } from '@/lib/public-properties';
import {
  formatArea,
  formatFullPrice,
  getPropertyTypeLabel,
  getStatusLabel,
  timeAgo,
} from '@/lib/utils/index';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = await getPublicProperty(params.id, false);

  if (!property) {
    return { title: 'Property Not Found' };
  }

  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.coverImage ? [property.coverImage] : property.images?.[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = await getPublicProperty(params.id, true);

  if (!property) {
    notFound();
  }

  const galleryImages =
    property.images && property.images.length > 0
      ? property.images
      : property.coverImage
        ? [{
            id: `${property.id}-cover`,
            url: property.coverImage,
            publicId: null,
            caption: property.title,
            order: 0,
          }]
        : [];

  const statItems = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms ?? '-' },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms ?? '-' },
    { icon: Maximize, label: 'Area', value: formatArea(Number(property.area)) },
    { icon: Building2, label: 'Type', value: getPropertyTypeLabel(property.type) },
  ];

  return (
    <div className="bg-primary pb-20 pt-20 text-white">
      <section className="border-b border-white/10 py-8">
        <div className="container mx-auto px-6">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-[#8f939c] transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Listings
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8f939c]">
                  {property.district || property.city}
                </span>
                <span className="rounded-full bg-[#50151c] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#d12d3a]">
                  {getStatusLabel(property.status)}
                </span>
                {property.isFeatured ? (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-300">
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="font-display text-4xl leading-tight md:text-5xl">{property.title}</h1>
              <p className="text-2xl font-semibold text-[#d12d3a]">{formatFullPrice(Number(property.price))}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#8f939c]">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {property.address}, {property.city}
                </span>
                <span>Listed {timeAgo(property.createdAt)}</span>
                <span>{property.viewCount} views</span>
              </div>
            </div>

            <PropertyGallery images={galleryImages} title={property.title} />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statItems.map((item) => (
                <div key={item.label} className="border border-white/10 bg-[#111111] p-5">
                  <item.icon className="h-5 w-5 text-[#d12d3a]" />
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#8f939c]">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="border border-white/10 bg-[#111111] p-8">
              <h2 className="font-display text-2xl">Description</h2>
              <p className="mt-4 whitespace-pre-wrap leading-8 text-[#a3a5aa]">{property.description}</p>
            </div>

            {property.amenities?.length ? (
              <div className="border border-white/10 bg-[#111111] p-8">
                <h2 className="font-display text-2xl">Amenities</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 text-sm text-[#d7d7d9]">
                      <div className="h-2 w-2 rounded-full bg-[#d12d3a]" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {property.features?.length ? (
              <div className="border border-white/10 bg-[#111111] p-8">
                <h2 className="font-display text-2xl">Key Features</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-[#d7d7d9]">
                      <ShieldCheck className="h-4 w-4 text-[#d12d3a]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <div className="border border-white/10 bg-[#111111] p-8">
              <EnquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
                ownerPhone={property.owner?.phone}
              />
            </div>

            {property.owner ? (
              <div className="border border-white/10 bg-[#111111] p-8">
                <p className="text-xs uppercase tracking-[0.14em] text-[#8f939c]">Listed By</p>
                <h3 className="mt-3 font-display text-2xl">{property.owner.name}</h3>
                <p className="mt-2 text-sm text-[#a3a5aa]">{property.owner.email}</p>
                {property.owner.phone ? (
                  <p className="mt-1 text-sm text-[#a3a5aa]">{property.owner.phone}</p>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
}
