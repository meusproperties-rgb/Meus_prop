import Image from 'next/image';
import Link from 'next/link';
import { Diamond, BriefcaseBusiness, TrendingUp, Briefcase } from 'lucide-react';
import { getMockFeaturedProperties } from '@/lib/mock-data';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';

const topServices = [
  { title: 'Luxury Expertise', icon: Diamond },
  { title: 'Off-Plan Specialists', icon: BriefcaseBusiness },
  { title: 'Investment Advisory', icon: TrendingUp },
  { title: 'End-To-End Management', icon: Briefcase },
];

const serviceBoxes = [
  {
    title: 'Buying & Selling',
    text: 'Residential and commercial properties across Dubai\'s most sought-after communities.',
  },
  {
    title: 'Off-Plan Investments',
    text: 'Secure premium units at pre-launch prices with maximum capital appreciation potential.',
  },
  {
    title: 'Leasing & Rental',
    text: 'Full-service rental brokerage delivering optimized yields for property owners.',
  },
  {
    title: 'Investment Advisory',
    text: 'Strategic guidance for local and international investors across Dubai, RAK, and Abu Dhabi.',
  },
];

export default async function HomePage() {
  const featured = getMockFeaturedProperties(6);

  return (
    <div className="bg-[#171717] text-white">
      <section id="home" className="relative min-h-[865px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2200&q=80"
            alt="Dubai skyline"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[865px] max-w-[1600px] items-center justify-center px-8 text-center lg:px-14">
          <div className="max-w-[980px] pt-10">
            <h1 className="font-display mb-7 text-[4.5rem] font-semibold leading-[1] tracking-[-0.035em] text-primary-foreground">
              Where Capital Meets
              <span className="block">Dubai Real Estate</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[790px] text-[1rem] leading-[1.45] text-[#d7dbe0] sm:text-[1.1rem] md:text-[1.2rem]">
              Investment-driven advisory backed by 8+ years of UAE market experience.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <Link href="/properties">
                <Button className="h-[56px] min-w-[218px] rounded-none bg-[#c62835] px-10 text-[16px] font-semibold text-white hover:bg-[#b3222e]">
                  Explore Listings
                </Button>
              </Link>
              <Link href="/#consultation">
                <Button
                  variant="outline"
                  className="h-[56px] min-w-[246px] rounded-none border-white bg-transparent px-10 text-[16px] font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#171717]">
        <div className="mx-auto grid max-w-[1700px] grid-cols-1 px-8 lg:grid-cols-4 lg:px-14">
          {topServices.map(({ title, icon: Icon }) => (
            <div key={title} className="flex min-h-[240px] flex-col items-center justify-center gap-6 border-white/0 text-center">
              <Icon className="h-10 w-10 text-[#d12d3a]" strokeWidth={1.7} />
              <p className="text-sm uppercase tracking-[0.16em] text-[#8c9098] md:text-base">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#171717] py-28">
        <div className="mx-auto grid max-w-[1700px] items-center gap-16 px-8 lg:grid-cols-[820px_1fr] lg:px-14">
          <div>
            <Image
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?w=1400&q=80"
              alt="Luxury apartment interior"
              width={1400}
              height={1100}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="max-w-[760px]">
            <h2 className="font-display mb-7 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              Strategy-Driven Real Estate for the Modern Investor
            </h2>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-[#9da1aa] sm:text-lg md:text-xl">
              <p>
                MEUS Real Estate Brokerage is a Dubai-based company established in 2023 under local Emirati management,
                backed by more than 8 years of hands-on experience in the UAE real estate market.
              </p>
              <p>
                We specialize in delivering comprehensive real estate solutions for both residential and investment
                purposes, serving local and international clients across Dubai, Ras Al Khaimah, and Abu Dhabi.
              </p>
              <p>
                Our operations are supported by strong partnerships with leading real estate developers and key industry
                stakeholders, enabling us to provide exclusive opportunities and seamless transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="listings" className="bg-[#2a2a2a] py-28">
        <div className="mx-auto max-w-[1700px] px-8 lg:px-14">
          <div className="mb-16 text-center">
            <h2 className="font-display mb-7 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-4 text-base text-[#8f939c] sm:text-lg md:text-xl">
              Handpicked luxury properties from Dubai&apos;s most prestigious addresses.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#111111] py-32">
        <div className="mx-auto max-w-[1700px] px-8 lg:px-14">
          <div className="mb-16 text-center">
            <h2 className="font-display mb-7 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              Services
            </h2>
            <p className="mt-4 text-base text-[#8f939c] sm:text-lg md:text-xl">
              Comprehensive real estate solutions tailored for the UAE market.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
            {serviceBoxes.map((service) => (
              <div key={service.title} className="min-h-[290px] border border-white/10 bg-[#111111] px-10 py-12">
                <h3 className="font-display text-2xl font-medium tracking-tight text-white md:text-[30px]">{service.title}</h3>
                <p className="mt-6 text-base leading-relaxed text-[#9ca0a9] md:text-lg">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#171717] py-32">
        <div className="mx-auto max-w-[1100px] px-8 text-center">
          <h2 className="font-display mb-7 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
            Why Investors Choose Us
          </h2>
          <p className="mx-auto mt-6 max-w-[1100px] text-base leading-relaxed text-[#8f939c] sm:text-lg md:text-xl">
            At MEUS, we believe real estate is more than a transaction - it is a long-term decision. We are committed to professionalism, transparency, and a client-centric approach.
          </p>

          <div className="mt-20 grid gap-14 md:grid-cols-3">
            {[
              ['8+', 'Years Experience'],
              ['3', 'Emirates'],
              ['100%', 'Client Focus'],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="text-5xl font-semibold text-[#d12d3a] md:text-6xl">{value}</div>
                <div className="mt-2 text-sm uppercase tracking-[0.16em] text-[#8f939c] md:text-base">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
