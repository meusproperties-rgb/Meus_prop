import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bath, Bed, Calendar, Car, ChevronLeft, LandPlot, Maximize, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublicProperty } from '@/lib/public-properties';
import { formatArea, formatFullPrice, getStatusLabel } from '@/lib/utils/index';

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
  const heroImage = galleryImages[0]?.url || property.coverImage;
  const features = property.features?.length ? property.features : property.amenities || [];

  const specs = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms ?? '-' },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms ?? '-' },
    { icon: Maximize, label: 'Built-up Area', value: formatArea(Number(property.area)) },
    ...(property.parkingSpaces ? [{ icon: Car, label: 'Parking', value: property.parkingSpaces }] : []),
    ...(property.totalFloors ? [{ icon: LandPlot, label: 'Total Floors', value: property.totalFloors }] : []),
  ];

  return (
    <div className="bg-background pt-20 text-foreground">
      <section className="relative h-[60vh]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={property.title}
            fill
            className="h-full w-full object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-primary/30" />
        <Link
          href="/listings"
          className="absolute left-6 top-6 z-10 flex items-center gap-2 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
        >
          <ChevronLeft size={20} />
          <span className="text-sm uppercase tracking-widest">Back</span>
        </Link>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {property.district || property.city}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                    property.status === 'for_sale'
                      ? 'bg-accent/10 text-accent'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {getStatusLabel(property.status)}
                </span>
              </div>

              <h1 className="mb-3 font-display text-3xl font-bold md:text-4xl">{property.title}</h1>
              <p className="mb-8 font-body text-2xl font-semibold text-accent">
                {formatFullPrice(Number(property.price))}
              </p>

              <div className="mb-12 grid grid-cols-2 gap-6 bg-secondary p-6 md:grid-cols-4">
                {specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <spec.icon className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{spec.label}</p>
                      <p className="font-semibold">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="mb-4 font-display text-2xl font-semibold">Description</h2>
              <p className="mb-12 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {property.description}
              </p>

              {features.length ? (
                <>
                  <h2 className="mb-4 font-display text-2xl font-semibold">Key Features</h2>
                  <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4 bg-primary p-8 text-primary-foreground">
              <h3 className="mb-6 font-display text-xl font-semibold">Interested in this property?</h3>
              <Button variant="cta" size="lg" className="w-full gap-2">
                <Calendar size={18} /> Book a Viewing
              </Button>
              <Button variant="cta-outline" size="lg" className="w-full gap-2">
                <MessageCircle size={18} /> WhatsApp
              </Button>
              <Button variant="cta-outline" size="lg" className="w-full gap-2">
                <Phone size={18} /> Call Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
