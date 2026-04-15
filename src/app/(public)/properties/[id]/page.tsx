import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Bed, Bath, Maximize, LandPlot, Phone, MessageCircle, Calendar, ChevronLeft } from 'lucide-react';
import { formatSitePrice, getSitePropertyById } from '@/lib/site-properties';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = getSitePropertyById(params.id);
  if (!property) return { title: 'Property Not Found' };

  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.images[0] ? [property.images[0]] : [],
    },
  };
}

export default function PropertyDetailPage({ params }: PageProps) {
  const property = getSitePropertyById(params.id);
  if (!property) notFound();

  const specs = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: Maximize, label: 'Built-up Area', value: `${property.builtUpArea.toLocaleString()} sqft` },
    ...(property.plotSize ? [{ icon: LandPlot, label: 'Plot Size', value: `${property.plotSize.toLocaleString()} sqft` }] : []),
  ];

  return (
    <div className="pt-20">
      <section className="relative h-[40vh] min-h-[280px] sm:h-[50vh] lg:h-[60vh]">
        <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />
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
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{property.location}</span>
                <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                  property.status === 'off-plan' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                }`}>
                  {property.status === 'off-plan' ? 'Off-Plan' : 'Ready'}
                </span>
              </div>
              <h1 className="font-display mb-3 text-3xl md:text-4xl">{property.title}</h1>
              <p className="font-body mb-8 text-2xl font-semibold text-accent">{formatSitePrice(property.price, property.type)}</p>

              <div className="mb-12 grid grid-cols-1 gap-4 bg-secondary p-6 sm:grid-cols-2 md:grid-cols-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <spec.icon className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{spec.label}</p>
                      <p className="font-semibold">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="font-display mb-4 text-2xl">Description</h2>
              <p className="mb-12 leading-relaxed text-muted-foreground">{property.description}</p>

              <h2 className="font-display mb-4 text-2xl">Key Features</h2>
              <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {property.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feature}
                  </div>
                ))}
              </div>

              {(property.roi || property.rentalYield) && (
                <>
                  <h2 className="font-display mb-4 text-2xl">Investment Highlights</h2>
                  <div className="grid grid-cols-1 gap-6 bg-secondary p-6 sm:grid-cols-2">
                    {property.roi && (
                      <div>
                        <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Estimated ROI</p>
                        <p className="font-display text-2xl font-bold text-accent">{property.roi}</p>
                      </div>
                    )}
                    {property.rentalYield && (
                      <div>
                        <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Rental Yield</p>
                        <p className="font-display text-2xl font-bold text-accent">{property.rentalYield}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-4 bg-primary p-6 text-primary-foreground sm:p-8 lg:sticky lg:top-28">
              <h3 className="mb-6 text-xl font-semibold font-display">Interested in this property?</h3>
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-8 text-sm font-medium tracking-wide text-accent-foreground transition-colors hover:bg-accent/90">
                <Calendar size={18} /> Book a Viewing
              </button>
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-primary-foreground bg-transparent px-8 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary">
                <MessageCircle size={18} /> WhatsApp
              </button>
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-primary-foreground bg-transparent px-8 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary">
                <Phone size={18} /> Call Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
