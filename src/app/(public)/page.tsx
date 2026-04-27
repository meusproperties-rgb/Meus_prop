import Link from 'next/link';
import { Diamond, Building2, TrendingUp, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedPublicProperties } from '@/lib/public-properties';
import { formatFullPrice } from '@/lib/utils/index';

const trustItems = [
  { icon: Diamond, label: 'Luxury Expertise' },
  { icon: Building2, label: 'Off-Plan Specialists' },
  { icon: TrendingUp, label: 'Investment Advisory' },
  { icon: Briefcase, label: 'End-to-End Management' },
];

const services = [
  {
    title: 'Buying & Selling',
    desc: 'Residential and commercial properties across Dubai\'s most sought-after communities.',
  },
  {
    title: 'Off-Plan Investments',
    desc: 'Secure premium units at pre-launch prices with maximum capital appreciation potential.',
  },
  { title: 'Leasing & Rental', desc: 'Full-service rental brokerage delivering optimized yields for property owners.' },
  {
    title: 'Investment Advisory',
    desc: 'Strategic guidance for local and international investors across Dubai, Ras Al Khaimah, and Abu Dhabi.',
  },
];

export default async function HomePage() {
  const featured = await getFeaturedPublicProperties(6);

  return (
    <div>
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/lovable-assets/hero-dubai.jpg"
            alt="Dubai skyline"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="font-display mb-6 text-3xl leading-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-7xl">
            Where Capital Meets Dubai Real Estate
          </h1>
          <p className="mx-auto mb-9 max-w-2xl text-lg font-medium text-primary-foreground/70 md:text-xl">
            Investment-driven advisory backed by 8+ years of UAE market experience.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="cta" size="lg" asChild className="w-full rounded-none sm:w-auto">
              <Link href="/listings">Explore Listings</Link>
            </Button>
            <Button variant="cta-outline" size="lg" asChild className="w-full rounded-none text-primary-foreground hover:text-primary-foreground sm:w-auto">
              <Link href="/contact">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 text-center">
              <item.icon className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto grid items-center gap-20 px-6 md:grid-cols-2">
          <div>
            <img
              src="/lovable-assets/about-interior.jpg"
              alt="Luxury apartment interior"
              className="h-[320px] w-full object-cover sm:h-[420px] md:h-[520px]"
            />
          </div>
          <div>
            <h2 className="font-display mb-7 text-3xl text-foreground md:text-4xl">
              Strategy-Driven Real Estate for the Modern Investor
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              MEUS Real Estate Brokerage is a Dubai-based company established in 2023 under local Emirati management,
              backed by more than 8 years of hands-on experience in the UAE real estate market.
            </p>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We specialize in delivering comprehensive real estate solutions for both residential and investment
              purposes, serving local and international clients across Dubai, Ras Al Khaimah, and Abu Dhabi.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Our operations are supported by strong partnerships with leading real estate developers and key industry
              stakeholders, enabling us to provide exclusive opportunities and seamless transactions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="font-display mb-4 text-3xl text-foreground md:text-4xl">Featured Properties</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Handpicked luxury properties from Dubai&apos;s most prestigious addresses.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <div key={property.id} className="group bg-card">
                <div className="overflow-hidden">
                  <img
                    src={property.coverImage || property.images?.[0]?.url || '/lovable-assets/property-1.jpg'}
                    alt={property.title}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {property.district || property.city}
                    </span>
                    {property.status === 'for_sale' && property.isFeatured && (
                      <span className="bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-display mb-2 text-xl">{property.title}</h3>
                  <p className="mb-3 text-lg font-semibold text-accent">{formatFullPrice(Number(property.price))}</p>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{property.description}</p>
                  <Button variant="cta" size="sm" asChild className="w-full rounded-none">
                    <Link href={`/properties/${property.slug}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground md:py-28">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="font-display mb-4 text-3xl md:text-4xl">Services</h2>
            <p className="mx-auto max-w-xl text-primary-foreground/60">
              Comprehensive real estate solutions tailored for the UAE market.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="border border-primary-foreground/10 p-8 transition-colors hover:border-accent/50">
                <h3 className="font-display mb-3 text-xl">{service.title}</h3>
                <p className="text-sm leading-relaxed text-primary-foreground/60">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display mb-8 text-3xl md:text-4xl">Why Investors Choose Us</h2>
          <p className="mb-14 leading-relaxed text-muted-foreground">
            At MEUS, we believe real estate is more than a transaction - it is a long-term decision. We are committed to
            professionalism, transparency, and a client-centric approach.
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { num: '8+', label: 'Years Experience' },
              { num: '3', label: 'Emirates' },
              { num: '100%', label: 'Client Focus' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display mb-2 text-3xl font-extrabold text-accent md:text-4xl">{stat.num}</p>
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent py-20 text-accent-foreground md:py-28">
        <div className="container mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display mb-6 text-3xl md:text-4xl">Ready to Invest in Dubai&apos;s Future?</h2>
          <p className="mb-10 text-accent-foreground/80">
            Schedule a private consultation with our advisory team and discover exclusive opportunities tailored to your
            investment goals.
          </p>
          <Button variant="cta" size="lg" asChild className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
            <Link href="/contact">Book Your Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
