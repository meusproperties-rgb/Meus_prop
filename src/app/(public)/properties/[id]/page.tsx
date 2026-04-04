import { notFound } from 'next/navigation';
import { Bed, Bath, Square, MapPin, Calendar, Car, Sofa, Building } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { EnquiryForm } from '@/components/property/EnquiryForm';
import { Badge } from '@/components/ui/components';
import {
  formatFullPrice,
  formatArea,
  getPropertyTypeLabel,
  getStatusLabel,
  getStatusColor,
  getFurnishingLabel,
  timeAgo,
} from '@/lib/utils/index';
import type { Property } from '@/types/index';
import { getMockPropertyBySlug } from '@/lib/mock-data';

interface PageProps {
  params: { id: string };
}

async function getProperty(slug: string): Promise<Property | null> {
  return getMockPropertyBySlug(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = await getProperty(params.id);
  if (!property) return { title: 'Property Not Found' };

  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.coverImage ? [property.coverImage] : [],
    },
  };
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between border-b border-border/50 py-3 last:border-0">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = await getProperty(params.id);
  if (!property) notFound();

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/properties" className="transition-colors hover:text-foreground">Properties</Link>
          <span>/</span>
          <span className="max-w-48 truncate text-foreground">{property.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <PropertyGallery images={property.images || []} title={property.title} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-semibold ${getStatusColor(property.status)}`}>
                  {getStatusLabel(property.status)}
                </span>
                <Badge variant="secondary">{getPropertyTypeLabel(property.type)}</Badge>
                {property.isFeatured && <Badge variant="gold">Featured</Badge>}
              </div>

              <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground mb-6 sm:text-4xl md:text-5xl">
                {property.title}
              </h1>

              <div className="mb-4 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.address}
                  {property.district && `, ${property.district}`}, {property.city}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                  {formatFullPrice(Number(property.price))}
                </span>
                {property.status === 'for_rent' && <span className="text-sm text-muted-foreground">/year</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {property.bedrooms !== null && property.bedrooms !== undefined && (
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <Bed className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                  <div className="font-semibold text-foreground">{property.bedrooms}</div>
                  <div className="text-xs text-muted-foreground">Bedrooms</div>
                </div>
              )}
              {property.bathrooms !== null && property.bathrooms !== undefined && (
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <Bath className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                  <div className="font-semibold text-foreground">{property.bathrooms}</div>
                  <div className="text-xs text-muted-foreground">Bathrooms</div>
                </div>
              )}
              {property.area && (
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <Square className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                  <div className="font-semibold text-foreground">{formatArea(Number(property.area))}</div>
                  <div className="text-xs text-muted-foreground">Total Area</div>
                </div>
              )}
              {property.parkingSpaces !== null && property.parkingSpaces !== undefined && (
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <Car className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                  <div className="font-semibold text-foreground">{property.parkingSpaces}</div>
                  <div className="text-xs text-muted-foreground">Parking</div>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-7 tracking-tight">
                About This Property
              </h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">{property.description}</p>
            </div>

            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-7 tracking-tight">
                Property Details
              </h2>
              <div className="grid grid-cols-1 gap-x-8 rounded-xl bg-muted/30 p-4 sm:grid-cols-2">
                <div>
                  <DetailRow icon={Building} label="Property Type" value={getPropertyTypeLabel(property.type)} />
                  {property.furnishing && (
                    <DetailRow icon={Sofa} label="Furnishing" value={getFurnishingLabel(property.furnishing)} />
                  )}
                  {property.floor && (
                    <DetailRow
                      icon={Building}
                      label="Floor"
                      value={`${property.floor}${property.totalFloors ? ` / ${property.totalFloors}` : ''}`}
                    />
                  )}
                </div>
                <div>
                  {property.yearBuilt && <DetailRow icon={Calendar} label="Year Built" value={property.yearBuilt} />}
                  <DetailRow icon={MapPin} label="City" value={property.city} />
                  <DetailRow icon={MapPin} label="Country" value={property.country} />
                </div>
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-7 tracking-tight">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                        +
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-7 tracking-tight">
                  Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <Badge key={feature} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-border/50 pt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Listed {timeAgo(property.createdAt)} - {property.viewCount} views
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24">
              <div className="mb-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <EnquiryForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                  ownerPhone={property.owner?.phone}
                />
              </div>

              {property.owner && (
                <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Listed By
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-lg font-bold text-accent">
                      {property.owner.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{property.owner.name}</p>
                      <p className="text-sm text-muted-foreground">{property.owner.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
